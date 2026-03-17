import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, AlertCircle, Upload, Phone, Check, Star } from "lucide-react";

interface Package {
  id: string;
  name: string;
  name_en: string | null;
  price: number;
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
  created_at: string;
}

const CompanySubscription = () => {
  const { profile, organization } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: packages = [] } = useQuery({
    queryKey: ["visible-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_packages")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return data as Package[];
    },
  });

  const { data: vodafoneNumber } = useQuery({
    queryKey: ["vodafone-number-client"],
    queryFn: async () => {
      const { data } = await supabase
        .from("platform_settings")
        .select("value")
        .eq("key", "vodafone_cash_number")
        .maybeSingle();
      return data?.value || "";
    },
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ["my-subscription-requests", organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      const { data, error } = await supabase
        .from("subscription_requests")
        .select("*")
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SubRequest[];
    },
    enabled: !!organization?.id,
  });

  const { data: pkgMap } = useQuery({
    queryKey: ["pkg-map-client", packages],
    queryFn: () => {
      const m: Record<string, string> = {};
      packages.forEach((p) => (m[p.id] = p.name));
      return m;
    },
    enabled: packages.length > 0,
  });

  const submitRequest = useMutation({
    mutationFn: async () => {
      if (!selectedPkg || !organization?.id || !phoneNumber.trim()) {
        throw new Error("بيانات ناقصة");
      }

      let receiptUrl: string | null = null;
      if (receiptFile) {
        setUploading(true);
        const fileExt = receiptFile.name.split(".").pop();
        const filePath = `${organization.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("subscription-receipts")
          .upload(filePath, receiptFile, { contentType: receiptFile.type });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("subscription-receipts")
          .getPublicUrl(filePath);
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
      });
      if (error) throw error;

      // Send notification to super admins
      const { data: superAdmins } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "super_admin");

      if (superAdmins) {
        for (const admin of superAdmins) {
          await supabase.from("notifications").insert({
            user_id: admin.user_id,
            title: "طلب اشتراك جديد",
            message: `شركة ${organization.name} طلبت اشتراك باقة ${selectedPkg.name} بمبلغ ${selectedPkg.price} جنيه. رقم المحول: ${phoneNumber.trim()}`,
            type: "subscription",
            related_id: organization.id,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscription-requests"] });
      toast.success("تم إرسال طلب الاشتراك بنجاح");
      setSelectedPkg(null);
      setPhoneNumber("");
      setReceiptFile(null);
    },
    onError: (err) => {
      setUploading(false);
      toast.error("حدث خطأ: " + (err as Error).message);
    },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">الاشتراك</h2>
        </div>
        <p className="text-muted-foreground">إدارة اشتراك {organization?.name || ""}</p>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 justify-end mb-4">
            <Badge variant="secondary" className="text-sm">غير نشط</Badge>
            <span className="font-semibold">حالة الاشتراك</span>
          </div>
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">لا يوجد اشتراك نشط حالياً</p>
          </div>
        </CardContent>
      </Card>

      {/* Packages */}
      <div>
        <h3 className="text-xl font-bold text-center mb-4">اختر الباقة المناسبة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative cursor-pointer transition-all hover:shadow-md ${
                selectedPkg?.id === pkg.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPkg(pkg)}
            >
              <CardContent className="p-4 text-center space-y-2">
                {pkg.is_popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                    الأكثر طلباً
                  </Badge>
                )}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">{pkg.name}</span>
                </div>
                <p className="text-2xl font-bold">
                  {pkg.price}
                  <span className="text-sm font-normal text-muted-foreground mr-1">جنيه / شهر</span>
                </p>
                <Button
                  variant={selectedPkg?.id === pkg.id ? "default" : "outline"}
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => { e.stopPropagation(); setSelectedPkg(pkg); }}
                >
                  {selectedPkg?.id === pkg.id ? "تم الاختيار" : "اختر هذه الباقة"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      {selectedPkg && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{selectedPkg.name} — {selectedPkg.price} جنيه</Badge>
              <h3 className="text-lg font-bold">الدفع عبر Vodafone Cash</h3>
            </div>

            {/* Discount code placeholder */}
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm text-muted-foreground">هل لديك كود خصم؟</span>
            </div>

            {/* Steps */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-right">خطوات الدفع:</h4>
                <p className="text-sm text-right">
                  1. حوّل مبلغ <strong>{selectedPkg.price} جنيه</strong> إلى رقم Vodafone Cash:
                </p>
                {vodafoneNumber && (
                  <div className="flex items-center gap-2 justify-end">
                    <Phone className="w-4 h-4" />
                    <strong dir="ltr">{vodafoneNumber}</strong>
                  </div>
                )}
                <p className="text-sm text-right">
                  2. بعد التحويل، أدخل رقم الهاتف المُحوَّل منه وارفع صورة الإيصال
                </p>
              </CardContent>
            </Card>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-right block">رقم الهاتف المُحوَّل منه</Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>

            {/* Receipt */}
            <div className="space-y-2">
              <Label className="text-right block">صورة إيصال التحويل</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById("receipt-upload")?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {receiptFile ? receiptFile.name : "اختر صورة"}
                </p>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => submitRequest.mutate()}
                disabled={!phoneNumber.trim() || uploading || submitRequest.isPending}
              >
                <Check className="w-4 h-4 ml-1" />
                إرسال طلب الاشتراك
              </Button>
              <Button variant="outline" onClick={() => setSelectedPkg(null)}>
                إلغاء
              </Button>
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
                  <Badge
                    variant={req.status === "approved" ? "default" : req.status === "rejected" ? "destructive" : "secondary"}
                  >
                    {req.status === "approved" ? "تمت الموافقة" : req.status === "rejected" ? "مرفوض" : "في الانتظار"}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">{req.months} شهر — {req.amount} جنيه</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(req.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanySubscription;
