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
  id: string;
  name: string;
  name_en: string | null;
  price: number;
  default_price: number;
  is_visible: boolean;
  is_popular: boolean;
  sort_order: number;
}

interface SubRequest {
  id: string;
  organization_id: string;
  package_id: string;
  amount: number;
  months: number;
  phone_number: string;
  receipt_url: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
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
  const [activeRequestTab, setActiveRequestTab] = useState("pending");

  const { data: packages = [] } = useQuery({
    queryKey: ["subscription-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_packages")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Package[];
    },
  });

  const { data: vodafoneSetting } = useQuery({
    queryKey: ["vodafone-cash-number"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .eq("key", "vodafone_cash_number")
        .maybeSingle();
      if (error) throw error;
      if (data) setVodafoneNumber(data.value);
      return data;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["subscription-requests-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_requests")
        .select("*")
        .order("created_at", { ascending: false });
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

  const { data: pkgMap } = useQuery({
    queryKey: ["pkg-map", packages],
    queryFn: () => {
      const m: Record<string, string> = {};
      packages.forEach((p) => (m[p.id] = p.name));
      return m;
    },
    enabled: packages.length > 0,
  });

  const getOrgName = (orgId: string) => orgs.find((o) => o.id === orgId)?.name || orgId;
  const getPkgName = (pkgId: string) => pkgMap?.[pkgId] || pkgId;

  const updatePackage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Package> }) => {
      const { error } = await supabase.from("subscription_packages").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
      toast.success("تم التحديث");
    },
  });

  const bulkUpdatePrices = useMutation({
    mutationFn: async ({ type, value, mode }: { type: "percent" | "fixed"; value: number; mode: "increase" | "discount" }) => {
      const updates = packages.map((pkg) => {
        let newPrice = pkg.price;
        if (mode === "increase") {
          newPrice = type === "percent" ? pkg.price * (1 + value / 100) : pkg.price + value;
        } else {
          newPrice = type === "percent" ? pkg.price * (1 - value / 100) : pkg.price - value;
        }
        return { id: pkg.id, price: Math.max(0, Math.round(newPrice)) };
      });
      for (const u of updates) {
        const { error } = await supabase.from("subscription_packages").update({ price: u.price }).eq("id", u.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
      setBulkDialog(null);
      setBulkValue("");
      toast.success("تم تحديث جميع الأسعار");
    },
  });

  const resetPrices = useMutation({
    mutationFn: async () => {
      for (const pkg of packages) {
        const { error } = await supabase.from("subscription_packages").update({ price: pkg.default_price }).eq("id", pkg.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
      toast.success("تم إعادة الأسعار الافتراضية");
    },
  });

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status, orgId, amount }: { id: string; status: string; orgId: string; amount: number }) => {
      const { error } = await supabase.from("subscription_requests").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      if (status === "approved") {
        await supabase.from("organizations").update({ subscription_price: amount }).eq("id", orgId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-requests-admin"] });
      toast.success("تم تحديث حالة الطلب");
    },
  });

  const saveVodafone = async () => {
    const { error } = await supabase.from("platform_settings").upsert({ key: "vodafone_cash_number", value: vodafoneNumber, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) { toast.error("حدث خطأ"); return; }
    setVodafoneEditing(false);
    toast.success("تم حفظ الرقم");
    queryClient.invalidateQueries({ queryKey: ["vodafone-cash-number"] });
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

      {/* Manage Packages Collapsible */}
      <Collapsible open={packagesOpen} onOpenChange={setPackagesOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">إدارة باقات الاشتراك</span>
              </div>
              {packagesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4">
              {/* Bulk Actions */}
              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setBulkDialog("increase")}>
                  <TrendingUp className="w-4 h-4 ml-1" /> زيادة سعر جميع الباقات
                </Button>
                <Button variant="outline" size="sm" onClick={() => setBulkDialog("discount")}>
                  <TrendingDown className="w-4 h-4 ml-1" /> خصم على جميع الباقات
                </Button>
                <Button variant="ghost" size="sm" onClick={() => resetPrices.mutate()}>
                  <X className="w-4 h-4 ml-1" /> إعادة الأسعار الافتراضية
                </Button>
              </div>

              {/* Package Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className={`relative transition-opacity ${!pkg.is_visible ? "opacity-40" : ""}`}>
                    <CardContent className="p-4 text-center space-y-2">
                      {pkg.is_popular && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">الأكثر طلباً</Badge>
                      )}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-sm">{pkg.name}</span>
                      </div>
                      {pkg.price !== pkg.default_price && (
                        <p className="text-xs text-muted-foreground line-through">{pkg.default_price} جنيه</p>
                      )}
                      {editingId === pkg.id ? (
                        <div className="flex items-center gap-1 justify-center">
                          <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 h-8 text-center"
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                            updatePackage.mutate({ id: pkg.id, updates: { price: Number(editPrice) } });
                            setEditingId(null);
                          }}><Check className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold">{pkg.price}<span className="text-sm font-normal text-muted-foreground mr-1">جنيه / شهر</span></p>
                      )}
                      <div className="flex gap-1 justify-center pt-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingId(pkg.id); setEditPrice(String(pkg.price)); }}>
                          <Pencil className="w-3 h-3 ml-1" /> تعديل السعر
                        </Button>
                      </div>
                      <Button
                        variant={pkg.is_visible ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={() => updatePackage.mutate({ id: pkg.id, updates: { is_visible: !pkg.is_visible } })}
                      >
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

      {/* Vodafone Cash Number */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">رقم تحويل Vodafone Cash</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              value={vodafoneNumber}
              onChange={(e) => { setVodafoneNumber(e.target.value); setVodafoneEditing(true); }}
              placeholder="+201000000000"
              className="max-w-xs"
              dir="ltr"
            />
            {vodafoneEditing && (
              <Button size="sm" onClick={saveVodafone}>حفظ</Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">هذا الرقم سيظهر للشركات عند الدفع</p>
        </CardContent>
      </Card>

      {/* Subscription Requests */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Tabs value={activeRequestTab} onValueChange={setActiveRequestTab} dir="rtl">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger value="pending">في الانتظار <Badge variant="secondary" className="mr-1">{requests.filter(r => r.status === "pending").length}</Badge></TabsTrigger>
                <TabsTrigger value="approved">مقبولة <Badge variant="secondary" className="mr-1">{requests.filter(r => r.status === "approved").length}</Badge></TabsTrigger>
                <TabsTrigger value="rejected">مرفوضة <Badge variant="secondary" className="mr-1">{requests.filter(r => r.status === "rejected").length}</Badge></TabsTrigger>
                <TabsTrigger value="all">الكل <Badge variant="secondary" className="mr-1">{requests.length}</Badge></TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={activeRequestTab} className="mt-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <Settings2 className="w-8 h-8" />
                  </div>
                  <p>لا توجد طلبات اشتراك</p>
                </div>
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
                            <p className="text-sm text-muted-foreground">رقم المحول: {req.phone_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString("ar-EG")}</p>
                            {req.receipt_url && (
                              <a href={req.receipt_url} target="_blank" rel="noreferrer" className="text-primary text-sm underline">عرض الإيصال</a>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {req.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => updateRequestStatus.mutate({ id: req.id, status: "approved", orgId: req.organization_id, amount: req.amount })}>
                                  <Check className="w-3 h-3 ml-1" /> موافقة
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateRequestStatus.mutate({ id: req.id, status: "rejected", orgId: req.organization_id, amount: 0 })}>
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
          <DialogHeader>
            <DialogTitle>
              {bulkDialog === "increase" ? "زيادة السعر — جميع الباقات" : "خصم — جميع الباقات"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">نوع التعديل</p>
              <RadioGroup value={bulkType} onValueChange={(v) => setBulkType(v as "percent" | "fixed")} className="flex gap-4" dir="rtl">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="percent" id="percent" />
                  <Label htmlFor="percent">نسبة مئوية %</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">مبلغ ثابت $</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>{bulkDialog === "increase" ? "قيمة الزيادة" : "قيمة الخصم"} {bulkType === "percent" ? "(%)" : "(جنيه)"}</Label>
              <Input type="number" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} placeholder={bulkType === "percent" ? "مثال: 20" : "مثال: 200"} className="mt-1" />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button onClick={() => {
              if (!bulkValue) return;
              bulkUpdatePrices.mutate({ type: bulkType, value: Number(bulkValue), mode: bulkDialog! });
            }}>
              {bulkDialog === "increase" ? "تطبيق الزيادة" : "تطبيق الخصم"}
            </Button>
            <Button variant="outline" onClick={() => setBulkDialog(null)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsManager;
