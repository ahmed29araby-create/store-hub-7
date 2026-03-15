import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, UserPen } from "lucide-react";
import { toast } from "sonner";

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

const AccountSettings = () => {
  const { user, profile, refreshUserData } = useAuth();

  // Name change
  const [newName, setNewName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

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

  const handleNameChange = async () => {
    if (!newName.trim()) return;
    if (newName.trim() === profile?.display_name) return;
    setNameLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: newName.trim() })
        .eq("user_id", user!.id);
      if (error) throw error;
      toast.success("تم تحديث الاسم بنجاح");
      setNewName("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء تحديث الاسم");
    }
    setNameLoading(false);
  };

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
      const msg = typeof err?.message === 'string' ? err.message : "حدث خطأ أثناء تحديث البريد الإلكتروني";
      toast.error(msg.includes("Edge function") || msg.includes("non-2xx") ? "حدث خطأ أثناء تحديث البريد الإلكتروني" : msg);
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
      const msg = typeof err?.message === 'string' ? err.message : "حدث خطأ أثناء تغيير كلمة المرور";
      toast.error(msg.includes("Edge function") || msg.includes("non-2xx") ? "حدث خطأ أثناء تغيير كلمة المرور" : msg);
    }
    setPasswordLoading(false);
  };

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
              <p className="text-xl font-bold text-foreground">{profile?.display_name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Name Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPen className="w-4 h-4" />
            تعديل الاسم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الاسم الجديد</Label>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="أدخل الاسم الجديد"
            />
          </div>
          <Button
            onClick={handleNameChange}
            disabled={!newName.trim() || nameLoading}
            className="w-full"
          >
            {nameLoading ? "جاري التحديث..." : "تحديث الاسم"}
          </Button>
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
