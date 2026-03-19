import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Pencil, Send, Plus, X, Check, Gift } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bg_color: string;
  is_active: boolean;
  sort_order: number;
}

const OffersManager = () => {
  const queryClient = useQueryClient();
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [sendDialog, setSendDialog] = useState<Offer | null>(null);
  const [sendTarget, setSendTarget] = useState<"active" | "expired" | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("🎁");

  const { data: offers = [] } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("*").order("sort_order");
      if (error) throw error;
      return data as Offer[];
    },
  });

  const updateOffer = useMutation({
    mutationFn: async (offer: Partial<Offer> & { id: string }) => {
      const { error } = await supabase.from("offers").update(offer).eq("id", offer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setEditingOffer(null);
      toast.success("تم تحديث العرض");
    },
  });

  const addOffer = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("offers").insert({
        title: newTitle, subtitle: newSubtitle, description: newDescription,
        icon: newIcon, sort_order: offers.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setShowAddDialog(false);
      setNewTitle(""); setNewSubtitle(""); setNewDescription(""); setNewIcon("🎁");
      toast.success("تم إضافة العرض");
    },
  });

  const sendOffer = useMutation({
    mutationFn: async ({ offerId, target }: { offerId: string; target: string }) => {
      // Get organizations based on target
      let query = supabase.from("organizations").select("id, name").eq("approval_status", "approved");
      if (target === "active") {
        query = query.eq("subscription_status", "active");
      } else if (target === "expired") {
        query = query.neq("subscription_status", "active");
      }
      const { data: orgs } = await query;
      if (!orgs || orgs.length === 0) { toast.error("لا توجد شركات لإرسال العرض"); return; }

      const offer = offers.find(o => o.id === offerId);
      // Send notification to all company admins
      for (const org of orgs) {
        const { data: profiles } = await supabase.from("profiles").select("user_id").eq("organization_id", org.id);
        if (profiles) {
          for (const p of profiles) {
            await supabase.from("notifications").insert({
              user_id: p.user_id,
              title: offer?.title || "عرض جديد",
              message: offer?.description || "",
              type: "offer",
            });
          }
        }
        await supabase.from("offer_sends").insert({ offer_id: offerId, organization_id: org.id });
      }
      toast.success(`تم إرسال العرض إلى ${orgs.length} شركة`);
    },
    onSuccess: () => setSendDialog(null),
  });

  const startEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setEditTitle(offer.title);
    setEditSubtitle(offer.subtitle);
    setEditDescription(offer.description);
    setEditIcon(offer.icon);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">العروض</h2>
          <p className="text-muted-foreground mt-1">اختر العرض المناسب وأرسله لجميع الشركات المتعاقدة. يمكنك تعديل النصوص قبل الإرسال.</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}><Plus className="w-4 h-4 ml-1" />إضافة عرض</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="relative overflow-hidden" style={{ backgroundColor: offer.bg_color }}>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <button onClick={() => startEdit(offer)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <div className="text-right">
                  <h3 className="font-bold text-foreground flex items-center gap-1 justify-end">
                    {offer.title} <span>{offer.icon}</span>
                  </h3>
                  <p className="text-sm text-primary font-semibold">{offer.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-right leading-relaxed">{offer.description}</p>
              <Button className="w-full" onClick={() => setSendDialog(offer)}>
                <Send className="w-4 h-4 ml-1" />إرسال الرسالة
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingOffer} onOpenChange={() => setEditingOffer(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>تعديل العرض</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>الأيقونة</Label><Input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} /></div>
            <div><Label>العنوان</Label><Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /></div>
            <div><Label>العنوان الفرعي</Label><Input value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} /></div>
            <div><Label>الوصف</Label><Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} /></div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button onClick={() => {
              if (editingOffer) updateOffer.mutate({ id: editingOffer.id, title: editTitle, subtitle: editSubtitle, description: editDescription, icon: editIcon });
            }}><Check className="w-4 h-4 ml-1" />حفظ</Button>
            <Button variant="outline" onClick={() => setEditingOffer(null)}><X className="w-4 h-4 ml-1" />إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      <Dialog open={!!sendDialog} onOpenChange={() => setSendDialog(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إرسال العرض</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">اختر الشركات المستهدفة:</p>
            <RadioGroup value={sendTarget} onValueChange={(v) => setSendTarget(v as any)} className="space-y-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="active" id="t-active" />
                <Label htmlFor="t-active">الشركات المشتركة حالياً</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="expired" id="t-expired" />
                <Label htmlFor="t-expired">الشركات التي انتهى اشتراكها</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="t-all" />
                <Label htmlFor="t-all">جميع الشركات</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (sendDialog) sendOffer.mutate({ offerId: sendDialog.id, target: sendTarget }); }} disabled={sendOffer.isPending}>
              <Send className="w-4 h-4 ml-1" />{sendOffer.isPending ? "جاري الإرسال..." : "إرسال"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إضافة عرض جديد</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>الأيقونة</Label><Input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="🎁" /></div>
            <div><Label>العنوان</Label><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} /></div>
            <div><Label>العنوان الفرعي</Label><Input value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} /></div>
            <div><Label>الوصف</Label><Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={4} /></div>
          </div>
          <DialogFooter>
            <Button onClick={() => addOffer.mutate()} disabled={!newTitle || addOffer.isPending}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffersManager;
