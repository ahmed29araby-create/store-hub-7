import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Settings2, Star, Eye, EyeOff, Pencil, TrendingUp, TrendingDown, RotateCcw, X, Check, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Package {
  id: string; name: string; name_en: string | null; price: number; default_price: number;
  is_visible: boolean; is_popular: boolean; sort_order: number; max_products: number;
}

interface SubRequest {
  id: string; organization_id: string; package_id: string; amount: number; months: number;
  phone_number: string; receipt_url: string | null; status: string; payment_method: string;
  created_at: string; reviewed_at: string | null;
}

const SubscriptionsManager = () => {
  const queryClient = useQueryClient();
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [bulkDialog, setBulkDialog] = useState<"increase" | "discount" | null>(null);
  const [bulkType, setBulkType] = useState<"percent" | "fixed">("percent");
  const [bulkValue, setBulkValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [vodafoneNumber, setVodafoneNumber] = useState("");
  const [vodafoneEditing, setVodafoneEditing] = useState(false);
  const [instapayNumber, setInstapayNumber] = useState("");
  const [instapayEditing, setInstapayEditing] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState("pending");
  const [receiptViewUrl, setReceiptViewUrl] = useState<string | null>(null);

  const { data: packages = [] } = useQuery({
    queryKey: ["subscription-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscription_packages").select("*").order("sort_order");
      if (error) throw error;
      return data as Package[];
    },
  });

  const { data: vodafoneSetting } = useQuery({
    queryKey: ["vodafone-cash-number"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings").select("*").eq("key", "vodafone_cash_number").maybeSingle();
      if (data) setVodafoneNumber(data.value);
      return data;
    },
  });

  const { data: instapaySetting } = useQuery({
    queryKey: ["instapay-number"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings").select("*").eq("key", "instapay_number").maybeSingle();
      if (data) setInstapayNumber(data.value);
      return data;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["subscription-requests-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscription_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as SubRequest[];
    },
  });

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs-for-subs"],
    queryFn: async () => {
      const { data } = await supabase.from("organizations").select("id, name");
      return data || [];
    },
  });

  const getOrgName = (orgId: string) => orgs.find((o) => o.id === orgId)?.name || orgId;
  const getPkgName = (pkgId: string) => packages.find(p => p.id === pkgId)?.name || pkgId;

  const updatePackage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Package> }) => {
      const { error } = await supabase.from("subscription_packages").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["subscription-packages"] }); toast.success("تم التحديث"); },
  });

  const bulkUpdatePrices = useMutation({
    mutationFn: async ({ type, value, mode }: { type: "percent" | "fixed"; value: number; mode: "increase" | "discount" }) => {
      for (const pkg of packages) {
        let newPrice = pkg.price;
        if (mode === "increase") newPrice = type === "percent" ? pkg.price * (1 + value / 100) : pkg.price + value;
        else newPrice = type === "percent" ? pkg.price * (1 - value / 100) : pkg.price - value;
        await supabase.from("subscription_packages").update({ price: Math.max(0, Math.round(newPrice)) }).eq("id", pkg.id);
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["subscription-packages"] }); setBulkDialog(null); setBulkValue(""); toast.success("تم تحديث جميع الأسعار"); },
  });

  const resetPrices = useMutation({
    mutationFn: async () => {
      for (const pkg of packages) {
        await supabase.from("subscription_packages").update({ price: pkg.default_price }).eq("id", pkg.id);
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["subscription-packages"] }); toast.success("تم إعادة الأسعار الافتراضية"); },
  });

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status, orgId, amount, pkgId, months }: { id: string; status: string; orgId: string; amount: number; pkgId: string; months: number }) => {
      const { error } = await supabase.from("subscription_requests").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      if (status === "approved") {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + months);
        await supabase.from("organizations").update({
          subscription_status: "active",
          subscription_package_id: pkgId,
          subscription_price: amount,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: endDate.toISOString(),
        }).eq("id", orgId);

        // Notify company admin
        const { data: profiles } = await supabase.from("profiles").select("user_id").eq("organization_id", orgId);
        if (profiles) {
          for (const p of profiles) {
            await supabase.from("notifications").insert({
              user_id: p.user_id,
              title: "تم تفعيل الاشتراك",
              message: `تم الموافقة على اشتراكك بنجاح! الباقة: ${getPkgName(pkgId)} — المبلغ: ${amount} جنيه. الاشتراك ساري حتى ${endDate.toLocaleDateString("ar-EG")}`,
              type: "subscription",
              related_id: orgId,
            });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-requests-admin"] });
      queryClient.invalidateQueries({ queryKey: ["orgs-for-subs"] });
      toast.success("تم تحديث حالة الطلب");
    },
  });

  const saveVodafone = async () => {
    await supabase.from("platform_settings").upsert({ key: "vodafone_cash_number", value: vodafoneNumber, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setVodafoneEditing(false);
    toast.success("تم حفظ رقم Vodafone Cash");
    queryClient.invalidateQueries({ queryKey: ["vodafone-cash-number"] });
  };

  const saveInstapay = async () => {
    await supabase.from("platform_settings").upsert({ key: "instapay_number", value: instapayNumber, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setInstapayEditing(false);
    toast.success("تم حفظ رقم InstaPay");
    queryClient.invalidateQueries({ queryKey: ["instapay-number"] });
  };

  const filteredRequests = requests.filter((r) => {
    if (activeRequestTab === "pending") return r.status === "pending";
    if (activeRequestTab === "approved") return r.status === "approved";
    if (activeRequestTab === "rejected") return r.status === "rejected";
    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">اشتراكات الشركات</h2>
        <p className="text-muted-foreground mt-1">مراجعة وإدارة طلبات الاشتراك</p>
      </div>

      {/* Manage Packages */}
      <Collapsible open={packagesOpen} onOpenChange={setPackagesOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2"><Settings2 className="w-5 h-5 text-muted-foreground" /><span className="font-semibold">إدارة باقات الاشتراك</span></div>
              {packagesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4">
              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setBulkDialog("increase")}><TrendingUp className="w-4 h-4 ml-1" /> زيادة سعر جميع الباقات</Button>
                <Button variant="outline" size="sm" onClick={() => setBulkDialog("discount")}><TrendingDown className="w-4 h-4 ml-1" /> خصم على جميع الباقات</Button>
                <Button variant="ghost" size="sm" onClick={() => resetPrices.mutate()}><RotateCcw className="w-4 h-4 ml-1" /> إعادة الأسعار الافتراضية</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className={`relative transition-opacity ${!pkg.is_visible ? "opacity-40" : ""}`}>
                    <CardContent className="p-4 text-center space-y-2">
                      {pkg.is_popular && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">الأكثر طلباً</Badge>}
                      <div className="flex items-center justify-center gap-1 mt-2"><Star className="w-4 h-4 text-muted-foreground" /><span className="font-semibold text-sm">{pkg.name}</span></div>
                      {pkg.price !== pkg.default_price && <p className="text-xs text-muted-foreground line-through">{pkg.default_price} جنيه</p>}
                      {editingId === pkg.id ? (
                        <div className="flex items-center gap-1 justify-center">
                          <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-24 h-8 text-center" />
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { updatePackage.mutate({ id: pkg.id, updates: { price: Number(editPrice) } }); setEditingId(null); }}><Check className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold">{pkg.price}<span className="text-sm font-normal text-muted-foreground mr-1">جنيه / شهر</span></p>
                      )}
                      <p className="text-xs text-muted-foreground">حتى {pkg.max_products} منتج</p>
                      <div className="flex gap-1 justify-center pt-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingId(pkg.id); setEditPrice(String(pkg.price)); }}><Pencil className="w-3 h-3 ml-1" /> تعديل السعر</Button>
                      </div>
                      <Button variant={pkg.is_visible ? "outline" : "default"} size="sm" className="w-full" onClick={() => updatePackage.mutate({ id: pkg.id, updates: { is_visible: !pkg.is_visible } })}>
                        {pkg.is_visible ? <><EyeOff className="w-3 h-3 ml-1" /> إخفاء الباقة</> : <><Eye className="w-3 h-3 ml-1" /> إظهار الباقة</>}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Payment Numbers */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-muted-foreground" /><span className="font-semibold">أرقام التحويل</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">رقم Vodafone Cash</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={vodafoneNumber} onChange={(e) => { setVodafoneNumber(e.target.value); setVodafoneEditing(true); }} placeholder="+201000000000" dir="ltr" />
                {vodafoneEditing && <Button size="sm" onClick={saveVodafone}>حفظ</Button>}
              </div>
            </div>
            <div>
              <Label className="text-sm">رقم InstaPay</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={instapayNumber} onChange={(e) => { setInstapayNumber(e.target.value); setInstapayEditing(true); }} placeholder="InstaPay ID" dir="ltr" />
                {instapayEditing && <Button size="sm" onClick={saveInstapay}>حفظ</Button>}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">هذه الأرقام ستظهر للشركات عند الدفع</p>
        </CardContent>
      </Card>

      {/* Subscription Requests */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Tabs value={activeRequestTab} onValueChange={setActiveRequestTab} dir="rtl">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger value="pending">في الانتظار <Badge variant="secondary" className="mr-1">{requests.filter(r => r.status === "pending").length}</Badge></TabsTrigger>
                <TabsTrigger value="approved">مقبولة</TabsTrigger>
                <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
                <TabsTrigger value="all">الكل</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={activeRequestTab} className="mt-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><Settings2 className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد طلبات اشتراك</p></div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.map((req) => (
                    <Card key={req.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">{getOrgName(req.organization_id)}</p>
                            <p className="text-sm text-muted-foreground">الباقة: {getPkgName(req.package_id)}</p>
                            <p className="text-sm text-muted-foreground">المبلغ: {req.amount} جنيه — {req.months} شهر</p>
                            <p className="text-sm text-muted-foreground">طريقة الدفع: {req.payment_method === "instapay" ? "InstaPay" : "Vodafone Cash"}</p>
                            <p className="text-sm text-muted-foreground">رقم المحول: {req.phone_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString("ar-EG")}</p>
                            {req.receipt_url && (
                              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" onClick={() => setReceiptViewUrl(req.receipt_url)}>عرض الإيصال</Button>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {req.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => updateRequestStatus.mutate({ id: req.id, status: "approved", orgId: req.organization_id, amount: req.amount, pkgId: req.package_id, months: req.months })}>
                                  <Check className="w-3 h-3 ml-1" /> موافقة
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateRequestStatus.mutate({ id: req.id, status: "rejected", orgId: req.organization_id, amount: 0, pkgId: req.package_id, months: 0 })}>
                                  <X className="w-3 h-3 ml-1" /> رفض
                                </Button>
                              </>
                            )}
                            {req.status === "approved" && <Badge className="bg-green-100 text-green-800">مقبول</Badge>}
                            {req.status === "rejected" && <Badge variant="destructive">مرفوض</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Bulk Price Dialog */}
      <Dialog open={!!bulkDialog} onOpenChange={() => setBulkDialog(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{bulkDialog === "increase" ? "زيادة السعر — جميع الباقات" : "خصم — جميع الباقات"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">نوع التعديل</p>
              <RadioGroup value={bulkType} onValueChange={(v) => setBulkType(v as "percent" | "fixed")} className="flex gap-4" dir="rtl">
                <div className="flex items-center gap-2"><RadioGroupItem value="percent" id="percent" /><Label htmlFor="percent">نسبة مئوية %</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="fixed" id="fixed" /><Label htmlFor="fixed">مبلغ ثابت (جنيه)</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label>{bulkDialog === "increase" ? "قيمة الزيادة" : "قيمة الخصم"} {bulkType === "percent" ? "(%)" : "(جنيه)"}</Label>
              <Input type="number" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} placeholder={bulkType === "percent" ? "مثال: 20" : "مثال: 200"} className="mt-1" />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button onClick={() => { if (!bulkValue) return; bulkUpdatePrices.mutate({ type: bulkType, value: Number(bulkValue), mode: bulkDialog! }); }}>
              {bulkDialog === "increase" ? "تطبيق الزيادة" : "تطبيق الخصم"}
            </Button>
            <Button variant="outline" onClick={() => setBulkDialog(null)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt View Dialog */}
      <Dialog open={!!receiptViewUrl} onOpenChange={() => setReceiptViewUrl(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>صورة الإيصال</DialogTitle></DialogHeader>
          {receiptViewUrl && <img src={receiptViewUrl} alt="إيصال" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsManager;
