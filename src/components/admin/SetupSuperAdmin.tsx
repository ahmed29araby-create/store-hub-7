import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const SetupSuperAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!email || password.length < 12) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-super-admin", {
        body: { email, password },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success("تم إنشاء حساب Super Admin بنجاح! سجل دخول الآن.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>إعداد حساب مسؤول المنصة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            استخدم هذا فقط مرة واحدة لإنشاء أول حساب Super Admin. بعدها لن يمكن إنشاء حساب آخر.
          </p>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>كلمة المرور (12 حرف على الأقل)</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {password.length > 0 && password.length < 12 && (
              <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 12 حرف على الأقل</p>
            )}
          </div>
          <Button className="w-full" onClick={handleSetup} disabled={!email || password.length < 12 || loading}>
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupSuperAdmin;
