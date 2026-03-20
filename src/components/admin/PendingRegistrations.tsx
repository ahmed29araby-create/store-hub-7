import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2, CheckCircle, XCircle, Clock, Shirt, Watch, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

const storeTypeLabels: Record<string, string> = {
  clothing: "ملابس", accessories: "إكسسوارات", restaurant: "مطاعم", pharmacy: "صيدلية",
  electronics: "إلكترونيات", sports: "رياضة", gifts: "هدايا", home_decor: "ديكور",
  supermarket: "سوبرماركت", kids_toys: "أطفال", real_estate: "عقارات",
};

const storeTypeIcons: Record<string, typeof Shirt> = {
  clothing: Shirt, accessories: Watch, restaurant: UtensilsCrossed,
};

const PendingRegistrations = () => {
  const queryClient = useQueryClient();
  const [approveDialog, setApproveDialog] = useState<{ id: string; name: string } | null>(null);
  const [trialMonths, setTrialMonths] = useState("1");

  const { data: pendingOrgs = [], isLoading } = useQuery({
    queryKey: ["pending-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("*").eq("approval_status", "pending").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ orgId, trialMonths }: { orgId: string; trialMonths: number }) => {
      const { data, error } = await supabase.functions.invoke("approve-organization", {
        body: { organization_id: orgId, action: "approve", trial_months: trialMonths },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Send notification to company admin
      const { data: profiles } = await supabase.from("profiles").select("user_id").eq("organization_id", orgId);
      if (profiles) {
        const trialText = trialMonths > 0
          ? `تم تفعيل حسابك بنجاح مع اشتراك مجاني لمدة ${trialMonths} ${trialMonths === 1 ? "شهر" : trialMonths === 2 ? "شهرين" : "أشهر"}.`
          : "تم تفعيل حسابك بنجاح! يرجى اختيار باقة اشتراك للمتابعة.";
        for (const p of profiles) {
          await supabase.from("notifications").insert({
            user_id: p.user_id,
            title: "تم تفعيل حسابك",
            message: trialText,
            type: "account",
            related_id: orgId,
          });
        }
      }
    },
    onSuccess: () => {
      toast.success("تمت الموافقة على الطلب وتم إرسال إشعار للشركة");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setApproveDialog(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const rejectMutation = useMutation({
    mutationFn: async (orgId: string) => {
      const { data, error } = await supabase.functions.invoke("approve-organization", {
        body: { organization_id: orgId, action: "reject" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      toast.success("تم رفض الطلب");
      queryClient.invalidateQueries({ queryKey: ["pending-registrations"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>;

  if (pendingOrgs.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">لا توجد طلبات معلقة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold">{pendingOrgs.length} طلب معلق</h2>
      </div>

      <div className="grid gap-4">
        {pendingOrgs.map((org) => {
          const StoreIcon = storeTypeIcons[org.store_type] || Building2;
          return (
            <Card key={org.id} className="border-orange-200 dark:border-orange-900/30">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <StoreIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{org.name}</h3>
                        <Badge variant="secondary">{storeTypeLabels[org.store_type] || org.store_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{org.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(org.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setApproveDialog({ id: org.id, name: org.name })} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 ml-1" />موافقة
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => rejectMutation.mutate(org.id)} disabled={rejectMutation.isPending}>
                      <XCircle className="w-4 h-4 ml-1" />رفض
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!approveDialog} onOpenChange={(open) => { if (!open) setApproveDialog(null); }}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>الموافقة على "{approveDialog?.name}"</DialogTitle>
            <DialogDescription>اختر مدة الفترة التجريبية المجانية</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الفترة التجريبية</Label>
              <Select value={trialMonths} onValueChange={setTrialMonths}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">بدون فترة تجريبية (يدفع مباشرة)</SelectItem>
                  <SelectItem value="1">شهر مجاني</SelectItem>
                  <SelectItem value="2">شهرين مجاني</SelectItem>
                  <SelectItem value="3">3 أشهر مجاني</SelectItem>
                  <SelectItem value="4">4 أشهر مجاني</SelectItem>
                  <SelectItem value="5">5 أشهر مجاني</SelectItem>
                  <SelectItem value="6">6 أشهر مجاني</SelectItem>
                  <SelectItem value="12">سنة مجانية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {trialMonths !== "0" && (
              <p className="text-sm text-muted-foreground">
                سيتم تفعيل المتجر لمدة {trialMonths} {Number(trialMonths) === 1 ? "شهر" : Number(trialMonths) === 2 ? "شهرين" : Number(trialMonths) === 12 ? "سنة" : "أشهر"} مجاناً.
              </p>
            )}
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => { if (approveDialog) approveMutation.mutate({ orgId: approveDialog.id, trialMonths: Number(trialMonths) }); }} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? "جاري الموافقة..." : "تأكيد الموافقة"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingRegistrations;
