import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Image, ArrowRight, MessageCircle, Info, Building2 } from "lucide-react";
import { toast } from "sonner";

const AdminChatInbox = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all conversations (organizations that have sent messages)
  const { data: conversations = [] } = useQuery({
    queryKey: ["admin-conversations"],
    queryFn: async () => {
      const { data: msgs, error } = await supabase
        .from("chat_messages")
        .select("conversation_id, created_at, message, sender_type")
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      // Group by conversation_id, get latest message
      const convMap = new Map<string, any>();
      (msgs || []).forEach((m: any) => {
        if (!convMap.has(m.conversation_id)) convMap.set(m.conversation_id, m);
      });

      // Get org details
      const orgIds = Array.from(convMap.keys());
      if (orgIds.length === 0) return [];
      const { data: orgs } = await supabase.from("organizations").select("id, name, store_type, subscription_status").in("id", orgIds);
      
      return orgIds.map(id => ({
        orgId: id,
        org: orgs?.find((o: any) => o.id === id),
        lastMessage: convMap.get(id),
      })).filter(c => c.org);
    },
    refetchInterval: 10000,
  });

  // Get messages for selected conversation
  const { data: messages: chatMessages = [] } = useQuery({
    queryKey: ["admin-chat", selectedOrg],
    queryFn: async () => {
      if (!selectedOrg) return [];
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", selectedOrg)
        .order("created_at", { ascending: true });
      if (error) throw error;
      // Mark unread messages as read
      await supabase.from("chat_messages").update({ is_read: true })
        .eq("conversation_id", selectedOrg).eq("sender_type", "company").eq("is_read", false);
      return data;
    },
    enabled: !!selectedOrg,
    refetchInterval: 5000,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedOrg) return;
    const channel = supabase
      .channel(`admin-chat-${selectedOrg}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${selectedOrg}` },
        () => queryClient.invalidateQueries({ queryKey: ["admin-chat", selectedOrg] })
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedOrg]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !selectedOrg) return;
      if (!message.trim() && !imageFile) return;

      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        const ext = imageFile.name.split(".").pop();
        const path = `admin/${selectedOrg}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("subscription-receipts").upload(path, imageFile, { contentType: imageFile.type });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("subscription-receipts").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: selectedOrg,
        sender_id: user.id,
        sender_type: "admin",
        message: message.trim() || null,
        image_url: imageUrl,
      });
      if (error) throw error;

      // Notify company admin
      const { data: profiles } = await supabase.from("profiles").select("user_id").eq("organization_id", selectedOrg);
      if (profiles) {
        for (const p of profiles) {
          await supabase.from("notifications").insert({
            user_id: p.user_id,
            title: "رسالة من الدعم الفني",
            message: message.trim().substring(0, 100) || "صورة جديدة",
            type: "support",
          });
        }
      }
    },
    onSuccess: () => {
      setMessage("");
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-chat", selectedOrg] });
    },
    onError: () => toast.error("حدث خطأ"),
  });

  const storeTypeLabels: Record<string, string> = {
    clothing: "ملابس", accessories: "إكسسوارات", restaurant: "مطاعم", pharmacy: "صيدليات",
    electronics: "إلكترونيات", sports: "رياضة", gifts: "هدايا", home_decor: "منزل وديكور",
    supermarket: "سوبرماركت", kids_toys: "أطفال وألعاب", real_estate: "عقارات",
  };

  if (!selectedOrg) {
    return (
      <div className="space-y-4" dir="rtl">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">الرسائل</h2>
        </div>
        {conversations.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground"><MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد رسائل</p></CardContent></Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv: any) => (
              <Card key={conv.orgId} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedOrg(conv.orgId)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{new Date(conv.lastMessage.created_at).toLocaleString("ar-EG")}</p>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="font-semibold text-foreground">{conv.org.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{conv.lastMessage.message || "📷 صورة"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentOrg = conversations.find((c: any) => c.orgId === selectedOrg);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setSelectedOrg(null)}>
          <ArrowRight className="w-4 h-4 ml-1" />رجوع
        </Button>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="font-semibold">{currentOrg?.org?.name}</p>
            <p className="text-xs text-muted-foreground">
              {storeTypeLabels[currentOrg?.org?.store_type] || ""} — {currentOrg?.org?.subscription_status === "active" ? "اشتراك نشط" : "غير مشترك"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Chat */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl p-3 ${
                msg.sender_type === "admin" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {msg.image_url && <img src={msg.image_url} alt="" className="max-h-48 rounded-lg mb-2 cursor-pointer" onClick={() => window.open(msg.image_url, "_self")} />}
                {msg.message && <p className="text-sm">{msg.message}</p>}
                {msg.whatsapp_number && <p className="text-xs mt-1 opacity-70">واتساب: {msg.whatsapp_number}</p>}
                <p className="text-[10px] mt-1 opacity-50">{new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => document.getElementById("admin-chat-img")?.click()}>
              <Image className="w-5 h-5" />
            </Button>
            <input id="admin-chat-img" type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب رسالتك..."
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage.mutate(); } }} />
            <Button size="icon" onClick={() => sendMessage.mutate()} disabled={(!message.trim() && !imageFile) || uploading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {imageFile && <p className="text-xs text-muted-foreground mt-1">📎 {imageFile.name}</p>}
        </div>
      </Card>
    </div>
  );
};

export default AdminChatInbox;
