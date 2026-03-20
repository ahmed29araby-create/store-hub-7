import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

      // Auto-login after successful registration
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      toast.success("تم إنشاء حسابك بنجاح!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="space-y-2">
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="My Store"
                dir="ltr"
              />
              {storeName && /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(storeName) && (
                <p className="text-xs text-destructive">يرجى إدخال اسم المتجر باللغة الإنجليزية فقط</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>نوع المتجر</Label>
              <Select value={storeType} onValueChange={setStoreType}>
                <SelectTrigger><SelectValue placeholder="اختر نوع المتجر" /></SelectTrigger>
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

            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" dir="ltr" />
            </div>

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
                <button type="button" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && password.length < 12 && <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 12 حرف على الأقل</p>}
            </div>

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
                <button type="button" onMouseDown={() => setShowConfirmPassword(true)} onMouseUp={() => setShowConfirmPassword(false)} onMouseLeave={() => setShowConfirmPassword(false)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && <p className="text-xs text-destructive">كلمة المرور غير متطابقة</p>}
            </div>

            <Button className="w-full" onClick={handleRegister} disabled={!storeName || !email || password.length < 12 || password !== confirmPassword || !storeType || loading}>
              {loading ? "جاري التسجيل..." : "إنشاء المتجر"}
            </Button>

            <div className="text-center">
              <button onClick={() => navigate("/login")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
