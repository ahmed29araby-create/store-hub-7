import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreditCard, AlertCircle, Upload, Phone, Check, Star, Clock, CalendarDays, AlertTriangle } from "lucide-react";

interface Package {
  id: string;
  name: string;
  name_en: string | null;
  price: number;
  max_products: number;
  is_visible: boolean;
  is_popular: boolean;
  sort_order: number;
}

interface SubRequest {
  id: string;
  package_id: string;
  amount: number;
  months: number;
  phone_number: string;
  receipt_url: string | null;
  status: string;
  payment_method: string;
  created_at: string;
}

const CompanySubscription = () => {
  const { profile, organization, refreshUserData } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vodafone_cash");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptViewUrl, setReceiptViewUrl] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const { data: packages = [] } = useQuery({
    queryKey: ["visible-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscription_packages").select("*").eq("is_visible", true).order("sort_order");
      if (error) throw error;
      return data as Package[];
    },
  });

  const { data: vodafoneNumber } = useQuery({
    queryKey: ["vodafone-number-client"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings").select("value").eq("key", "vodafone_cash_number").maybeSingle();
      return data?.value || "";
    },
  });

  const { data: instapayNumber } = useQuery({
    queryKey: ["instapay-number-client"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings").select("value").eq("key", "instapay_number").maybeSingle();
      return data?.value || "";
    },
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ["my-subscription-requests", organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      const { data, error } = await supabase.from("subscription_requests").select("*").eq("organization_id", organization.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data as SubRequest[];
    },
    enabled: !!organization?.id,
  });

  const { data: activePkg } = useQuery({
    queryKey: ["active-package", organization?.subscription_package_id],
    queryFn: async () => {
      if (!organization?.subscription_package_id) return null;
      const { data } = await supabase.from("subscription_packages").select("*").eq("id", organization.subscription_package_id).single();
      return data as Package | null;
    },
    enabled: !!organization?.subscription_package_id,
  });

  const isActive = organization?.subscription_status === "active" && organization?.subscription_end_date && new Date(organization.subscription_end_date) > new Date();
  const isTrialActive = organization?.trial_end_date && new Date(organization.trial_end_date) > new Date();
  const hasActiveAccess = isActive || isTrialActive;

  const daysRemaining = isActive && organization?.subscription_end_date
    ? Math.ceil((new Date(organization.subscription_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : isTrialActive && organization?.trial_end_date
    ? Math.ceil((new Date(organization.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleSelectPackage = (pkg: Package) => {
    if (hasActiveAccess && daysRemaining > 0) {
      setSelectedPkg(pkg);
      setConfirmDialog(true);
    } else {
      setSelectedPkg(pkg);
    }
  };

  const confirmSelectPackage = () => {
    setConfirmDialog(false);
  };

  const submitRequest = useMutation({
    mutationFn: async () => {
      if (!selectedPkg || !organization?.id || !phoneNumber.trim()) throw new Error("بيانات ناقصة");

      let receiptUrl: string | null = null;
      if (receiptFile) {
        setUploading(true);
        const fileExt = receiptFile.name.split(".").pop();
        const filePath = `${organization.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("subscription-receipts").upload(filePath, receiptFile, { contentType: receiptFile.type });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("subscription-receipts").getPublicUrl(filePath);
        receiptUrl = urlData.publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from("subscription_requests").insert({
        organization_id: organization.id,
        package_id: selectedPkg.id,
        amount: selectedPkg.price,
        months: 1,
        phone_number: phoneNumber.trim(),
        receipt_url: receiptUrl,
        payment_method: paymentMethod,
      });
      if (error) throw error;

      // Send notification to super admins
      const { data: superAdmins } = await supabase.from("user_roles").select("user_id").eq("role", "super_admin");
      if (superAdmins) {
        for (const admin of superAdmins) {
          await supabase.from("notifications").insert({
            user_id: admin.user_id,
            title: "طلب اشتراك جديد",
            message: `شركة ${organization.name} طلبت اشتراك باقة ${selectedPkg.name} بمبلغ ${selectedPkg.price} جنيه عبر ${paymentMethod === "vodafone_cash" ? "Vodafone Cash" : "InstaPay"}. رقم المحول: ${phoneNumber.trim()}`,
            type: "subscription",
            related_id: organization.id,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscription-requests"] });
      toast.success("تم إرسال طلب الاشتراك بنجاح. عند تفعيل الاشتراك سيصلك إشعار على الإشعارات.");
      setSelectedPkg(null);
      setPhoneNumber("");
      setReceiptFile(null);
      setReceiptPreview(null);
    },
    onError: (err) => {
      setUploading(false);
      toast.error("حدث خطأ: " + (err as Error).message);
    },
  });

  const pkgMap: Record<string, string> = {};
  packages.forEach(p => { pkgMap[p.id] = p.name; });

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">الاشتراك</h2>
        </div>
        <p className="text-muted-foreground">إدارة اشتراك {organization?.name || ""}</p>
      </div>

      {/* Active Subscription Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 justify-end mb-4">
            <Badge variant={hasActiveAccess ? "default" : "secondary"} className="text-sm">
              {hasActiveAccess ? "نشط" : "غير نشط"}
            </Badge>
            <span className="font-semibold">حالة الاشتراك</span>
          </div>
          {hasActiveAccess ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">الباقة</p>
                  <p className="font-bold text-foreground">{isActive && activePkg ? activePkg.name : isTrialActive ? "تجريبي مجاني" : "-"}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">السعر</p>
                  <p className="font-bold text-foreground">{isActive ? `${organization?.subscription_price || activePkg?.price || 0} جنيه` : "مجاني"}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <CalendarDays className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">ينتهي في</p>
                  <p className="font-bold text-foreground">
                    {isActive && organization?.subscription_end_date
                      ? new Date(organization.subscription_end_date).toLocaleDateString("ar-EG")
                      : isTrialActive && organization?.trial_end_date
                      ? new Date(organization.trial_end_date).toLocaleDateString("ar-EG")
                      : "-"}
                  </p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">باقي</p>
                  <p className="font-bold text-foreground">{daysRemaining} يوم</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">لا يوجد اشتراك نشط حالياً</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Packages */}
      <div>
        <h3 className="text-xl font-bold text-center mb-4">اختر الباقة المناسبة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative cursor-pointer transition-all hover:shadow-md ${selectedPkg?.id === pkg.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleSelectPackage(pkg)}
            >
              <CardContent className="p-4 text-center space-y-2">
                {pkg.is_popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">الأكثر طلباً</Badge>
                )}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">{pkg.name}</span>
                </div>
                <p className="text-2xl font-bold">
                  {pkg.price}<span className="text-sm font-normal text-muted-foreground mr-1">جنيه / شهر</span>
                </p>
                <p className="text-xs text-muted-foreground">حتى {pkg.max_products} منتج</p>
                <Button
                  variant={selectedPkg?.id === pkg.id ? "default" : "outline"}
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => { e.stopPropagation(); handleSelectPackage(pkg); }}
                >
                  {selectedPkg?.id === pkg.id ? "تم الاختيار" : "اختر هذه الباقة"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      {selectedPkg && !confirmDialog && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{selectedPkg.name} — {selectedPkg.price} جنيه</Badge>
              <h3 className="text-lg font-bold">الدفع</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-right block font-semibold">طريقة الدفع</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4" dir="rtl">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="vodafone_cash" id="vodafone" />
                  <Label htmlFor="vodafone">Vodafone Cash</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="instapay" id="instapay" />
                  <Label htmlFor="instapay">InstaPay</Label>
                </div>
              </RadioGroup>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-right">خطوات الدفع:</h4>
                <p className="text-sm text-right">1. حوّل مبلغ <strong>{selectedPkg.price} جنيه</strong> إلى رقم {paymentMethod === "vodafone_cash" ? "Vodafone Cash" : "InstaPay"}:</p>
                <div className="flex items-center gap-2 justify-end">
                  <Phone className="w-4 h-4" />
                  <strong dir="ltr">{paymentMethod === "vodafone_cash" ? vodafoneNumber : instapayNumber}</strong>
                </div>
                <p className="text-sm text-right">2. بعد التحويل، أدخل رقم الهاتف المُحوَّل منه وارفع صورة الإيصال</p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label className="text-right block">رقم الهاتف المُحوَّل منه</Label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="01xxxxxxxxx" dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">صورة إيصال التحويل</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById("receipt-upload")?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{receiptFile ? receiptFile.name : "اختر صورة"}</p>
                <input id="receipt-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setReceiptFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
              {receiptPreview && <img src={receiptPreview} alt="preview" className="max-h-40 mx-auto rounded-lg" />}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => submitRequest.mutate()} disabled={!phoneNumber.trim() || uploading || submitRequest.isPending}>
                <Check className="w-4 h-4 ml-1" />إرسال طلب الاشتراك
              </Button>
              <Button variant="outline" onClick={() => setSelectedPkg(null)}>إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {myRequests.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-right">سجل طلبات الدفع</h3>
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={req.status === "approved" ? "default" : req.status === "rejected" ? "destructive" : "secondary"}>
                      {req.status === "approved" ? "تمت الموافقة" : req.status === "rejected" ? "مرفوض" : "في الانتظار"}
                    </Badge>
                    {req.status === "approved" && <Badge variant="outline" className="text-green-600 border-green-300">نشط</Badge>}
                    {req.receipt_url && (
                      <Button variant="ghost" size="sm" onClick={() => setReceiptViewUrl(req.receipt_url)}>
                        عرض الإيصال
                      </Button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{req.months} شهر — {req.amount} جنيه — {req.payment_method === "instapay" ? "InstaPay" : "Vodafone Cash"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString("ar-EG")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm active subscription dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              تنبيه — لديك اشتراك نشط
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              لديك اشتراك نشط حالياً وباقي <strong>{daysRemaining} يوم</strong> على انتهائه.
            </p>
            <p className="text-muted-foreground">
              في حالة الاشتراك في باقة جديدة، سيتم إلغاء الباقة الحالية واستبدالها بالباقة الجديدة.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button onClick={confirmSelectPackage}>متابعة الاشتراك</Button>
            <Button variant="outline" onClick={() => { setConfirmDialog(false); setSelectedPkg(null); }}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt view dialog */}
      <Dialog open={!!receiptViewUrl} onOpenChange={() => setReceiptViewUrl(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>صورة الإيصال</DialogTitle>
          </DialogHeader>
          {receiptViewUrl && <img src={receiptViewUrl} alt="إيصال" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanySubscription;
