import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, User, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            phone: phone,
            is_customer: true,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">تم إنشاء حسابك بنجاح!</h2>
          <p className="text-muted-foreground mb-8">تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى تأكيد حسابك قبل تسجيل الدخول.</p>
          <Button onClick={() => navigate("/login")} variant="outline">
            <ArrowRight className="w-4 h-4 ml-2" />
            تسجيل الدخول
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
            <CardDescription>أنشئ حسابك للتصفح والشراء من المتاجر</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الاسم الكامل *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك الكامل" />
            </div>

            <div className="space-y-2">
              <Label>رقم الموبايل</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label>كلمة المرور *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل"
                  dir="ltr"
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
              {password.length > 0 && password.length < 8 && (
                <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 8 أحرف على الأقل</p>
              )}
            </div>

            <Button className="w-full" onClick={handleRegister} disabled={!name || !email || password.length < 8 || loading}>
              {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
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

export default CustomerRegister;
