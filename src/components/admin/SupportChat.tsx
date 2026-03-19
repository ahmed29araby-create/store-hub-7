import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Image, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SupportChat = () => {
  const { user, organization } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = organization?.id;

  const { data: messages = [] } = useQuery({
    queryKey: ["chat-messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
        () => queryClient.invalidateQueries({ queryKey: ["chat-messages", conversationId] })
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !conversationId) return;
      if (!message.trim() && !imageFile) return;

      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        const ext = imageFile.name.split(".").pop();
        const path = `${conversationId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("subscription-receipts").upload(path, imageFile, { contentType: imageFile.type });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("subscription-receipts").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: "company",
        message: message.trim() || null,
        image_url: imageUrl,
        whatsapp_number: whatsapp.trim() || null,
      });
      if (error) throw error;

      // Notify super admins
      const { data: superAdmins } = await supabase.from("user_roles").select("user_id").eq("role", "super_admin");
      if (superAdmins) {
        for (const admin of superAdmins) {
          await supabase.from("notifications").insert({
            user_id: admin.user_id,
            title: "رسالة دعم فني جديدة",
            message: `رسالة من شركة ${organization?.name}: ${message.trim().substring(0, 100)}`,
            type: "support",
            related_id: conversationId,
          });
        }
      }
    },
    onSuccess: () => {
      setMessage("");
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["chat-messages", conversationId] });
    },
    onError: () => toast.error("حدث خطأ في إرسال الرسالة"),
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">الدعم الفني</h2>
      </div>

      {/* Chat Area */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>ابدأ محادثة مع فريق الدعم</p>
            </div>
          )}
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.sender_type === "company" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl p-3 ${
                msg.sender_type === "company"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {msg.image_url && (
                  <img src={msg.image_url} alt="" className="max-h-48 rounded-lg mb-2 cursor-pointer" onClick={() => window.open(msg.image_url, "_self")} />
                )}
                {msg.message && <p className="text-sm">{msg.message}</p>}
                {msg.whatsapp_number && <p className="text-xs mt-1 opacity-70">واتساب: {msg.whatsapp_number}</p>}
                <p className="text-[10px] mt-1 opacity-50">{new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="رقم واتساب للتواصل (اختياري)" dir="ltr" className="text-xs h-8" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => document.getElementById("chat-image-upload")?.click()}>
              <Image className="w-5 h-5" />
            </Button>
            <input id="chat-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage.mutate(); } }}
            />
            <Button size="icon" onClick={() => sendMessage.mutate()} disabled={(!message.trim() && !imageFile) || uploading || sendMessage.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {imageFile && <p className="text-xs text-muted-foreground">📎 {imageFile.name}</p>}
        </div>
      </Card>
    </div>
  );
};

export default SupportChat;
