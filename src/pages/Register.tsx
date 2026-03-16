import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Store, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const storeTypeLabels: Record<string, string> = {
  clothing: "متجر ملابس",
  accessories: "متجر إكسسوارات",
  restaurant: "مطعم",
  pharmacy: "صيدلية",
  electronics: "إلكترونيات وتقنية",
  sports: "رياضة ولياقة",
  gifts: "هدايا ومناسبات",
  home_decor: "المنزل والديكور",
  supermarket: "سوبرماركت",
  kids_toys: "أطفال وألعاب",
  real_estate: "عقارات",
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get("type") || "";

  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storeType, setStoreType] = useState(preselectedType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!storeName || !email || !password || !confirmPassword || !storeType) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(storeName)) {
      toast.error("يرجى إدخال اسم المتجر باللغة الإنجليزية فقط");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }
    if (password.length < 12) {
      toast.error("كلمة المرور يجب أن تكون 12 حرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("register-store", {
        body: { store_name: storeName, email, password, store_type: storeType },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">تم تسجيل طلبك بنجاح!</h2>
          <p className="text-muted-foreground mb-2">حسابك قيد المراجعة من قبل إدارة المنصة.</p>
          <p className="text-muted-foreground mb-8">سيتم تفعيل متجرك بعد الموافقة على طلبك.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للصفحة الرئيسية
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Store className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">إنشاء متجرك</CardTitle>
            <CardDescription>أدخل بياناتك لإنشاء متجرك الإلكتروني</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Store Name */}
            <div className="space-y-2">
              <Input
                value={storeName}
                onChange={(e) => {
                  const val = e.target.value;
                  setStoreName(val);
                }}
                placeholder="My Store"
                dir="ltr"
              />
              {storeName && /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(storeName) && (
                <p className="text-xs text-destructive">يرجى إدخال اسم المتجر باللغة الإنجليزية فقط</p>
              )}
            </div>

            {/* Store Type */}
            <div className="space-y-2">
              <Label>نوع المتجر</Label>
              <Select value={storeType} onValueChange={setStoreType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المتجر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">متجر ملابس</SelectItem>
                  <SelectItem value="accessories">متجر إكسسوارات</SelectItem>
                  <SelectItem value="restaurant">مطعم</SelectItem>
                  <SelectItem value="pharmacy">صيدلية</SelectItem>
                  <SelectItem value="electronics">إلكترونيات وتقنية</SelectItem>
                  <SelectItem value="sports">رياضة ولياقة</SelectItem>
                  <SelectItem value="gifts">هدايا ومناسبات</SelectItem>
                  <SelectItem value="home_decor">المنزل والديكور</SelectItem>
                  <SelectItem value="supermarket">سوبرماركت</SelectItem>
                  <SelectItem value="kids_toys">أطفال وألعاب</SelectItem>
                  <SelectItem value="real_estate">عقارات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(val)) return;
                    setPassword(val);
                  }}
                  placeholder="برجاء إدخال كلمة مرور لا تقل عن 12 حرف"
                  dir="rtl"
                  className="pl-10"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && password.length < 12 && (
                <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 12 حرف على الأقل</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(val)) return;
                    setConfirmPassword(val);
                  }}
                  placeholder="تأكيد كلمة المرور"
                  dir="rtl"
                  className="pl-10"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">كلمة المرور غير متطابقة</p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={!storeName || !email || password.length < 12 || password !== confirmPassword || !storeType || loading}
            >
              {loading ? "جاري التسجيل..." : "إنشاء المتجر"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                لديك حساب بالفعل؟ <span className="text-primary font-medium">تسجيل الدخول</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
