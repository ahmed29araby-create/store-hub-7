import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { toast } from "sonner";

const CompanySettings = () => {
  const { profile, organization } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 12) {
      toast.error("كلمة المرور يجب أن تكون 12 حرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }
    if (currentPassword === newPassword) {
      toast.info("كلمة المرور الجديدة هي نفس كلمة المرور الحالية");
      return;
    }

    setLoading(true);
    try {
      // Verify current password
      const email = profile?.email;
      if (!email) throw new Error("لم يتم العثور على البريد الإلكتروني");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) {
        toast.error("كلمة المرور الحالية غير صحيحة");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success("تم تغيير كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء تغيير كلمة المرور");
    }
    setLoading(false);
  };

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: (v: boolean) => void }) => (
    <button
      type="button"
      onMouseDown={() => onToggle(true)}
      onMouseUp={() => onToggle(false)}
      onMouseLeave={() => onToggle(false)}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-muted-foreground text-xs">الاسم</Label>
            <p className="font-medium">{profile?.display_name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">البريد الإلكتروني</Label>
            <p className="font-medium">{profile?.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">نوع المتجر</Label>
            <p className="font-medium">
              {organization?.store_type === "clothing" && "ملابس"}
              {organization?.store_type === "accessories" && "إكسسوارات"}
              {organization?.store_type === "restaurant" && "مطاعم"}
              {organization?.store_type === "pharmacy" && "صيدلية"}
              {organization?.store_type === "electronics" && "إلكترونيات وتقنية"}
              {organization?.store_type === "sports" && "رياضة ولياقة"}
              {organization?.store_type === "gifts" && "هدايا ومناسبات"}
              {organization?.store_type === "home_decor" && "المنزل والديكور"}
              {organization?.store_type === "supermarket" && "سوبرماركت"}
              {organization?.store_type === "kids_toys" && "أطفال وألعاب"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4" />
            تغيير كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="كلمة المرور الحالية"
              dir="ltr"
              className="pl-10"
            />
            <PasswordToggle show={showCurrent} onToggle={setShowCurrent} />
          </div>
          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="يرجى إدخال كلمة مرور لا تقل عن 12 حرف"
                dir="ltr"
                className="pl-10"
              />
              <PasswordToggle show={showNew} onToggle={setShowNew} />
            </div>
            {newPassword.length > 0 && newPassword.length < 12 && (
              <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 12 حرف على الأقل</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور الجديدة"
                dir="ltr"
                className="pl-10"
              />
              <PasswordToggle show={showConfirm} onToggle={setShowConfirm} />
            </div>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive">كلمة المرور غير متطابقة</p>
            )}
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={!currentPassword || newPassword.length < 12 || newPassword !== confirmPassword || loading}
            className="w-full"
          >
            {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;
