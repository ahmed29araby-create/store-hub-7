import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const AccountSettings = () => {
  const { user, profile, refreshUserData } = useAuth();

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEmailChange = async () => {
    if (!newEmail.trim()) return;
    const currentEmail = profile?.email || user?.email;
    if (newEmail.trim().toLowerCase() === currentEmail?.toLowerCase()) return;
    setEmailLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("update-admin-credentials", {
        body: { new_email: newEmail, current_password: undefined },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success("تم تحديث البريد الإلكتروني بنجاح! سجّل دخول بالبريد الجديد.");
      setNewEmail("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء تحديث البريد الإلكتروني");
    }
    setEmailLoading(false);
  };

  const handlePasswordChange = async () => {
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

    setPasswordLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("update-admin-credentials", {
        body: { current_password: currentPassword, new_password: newPassword },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success("تم تغيير كلمة المرور بنجاح!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء تغيير كلمة المرور");
    }
    setPasswordLoading(false);
  };

  const PasswordToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: (v: boolean) => void;
  }) => (
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
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">مسؤول المنصة</p>
              <p className="text-xl font-bold text-foreground">{profile?.email || user?.email}</p>
              <p className="text-sm text-muted-foreground">{profile?.display_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="w-4 h-4" />
            تعديل البريد الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>البريد الإلكتروني الجديد</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@email.com"
              dir="ltr"
            />
          </div>
          <Button
            onClick={handleEmailChange}
            disabled={!newEmail.trim() || emailLoading}
            className="w-full"
          >
            {emailLoading ? "جاري التحديث..." : "تحديث البريد الإلكتروني"}
          </Button>
          <p className="text-xs text-muted-foreground">
            سيتم تحديث البريد الإلكتروني مباشرة. استخدم البريد الجديد لتسجيل الدخول.
          </p>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4" />
            تعديل كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="كلمة المرور الجديدة (12 حرف على الأقل)"
                dir="ltr"
                className="pl-10"
              />
              <PasswordToggle show={showNew} onToggle={setShowNew} />
            </div>
            {newPassword.length > 0 && newPassword.length < 12 && (
              <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 12 حرف على الأقل</p>
            )}
          </div>
          <div className="space-y-2">
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
            onClick={handlePasswordChange}
            disabled={!currentPassword || newPassword.length < 12 || newPassword !== confirmPassword || passwordLoading}
            className="w-full"
          >
            {passwordLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
