import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User, Mail, Link2, Copy } from "lucide-react";
import { toast } from "sonner";

const CompanySettings = () => {
  const { user, profile, organization, refreshUserData } = useAuth();

  // Name editing
  const [editName, setEditName] = useState(profile?.display_name || "");
  const [nameLoading, setNameLoading] = useState(false);

  // Email editing
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const storeUrl = organization?.store_type && organization?.id
    ? `${window.location.origin}/store/${organization.store_type}/${organization.id}`
    : "";

  const copyStoreLink = () => {
    if (storeUrl) {
      navigator.clipboard.writeText(storeUrl);
      toast.success("تم نسخ رابط المتجر!");
    }
  };

  const handleUpdateName = async () => {
    if (!editName.trim()) return;
    setNameLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName.trim() })
      .eq("user_id", user!.id);
    if (error) {
      toast.error("حدث خطأ أثناء تحديث الاسم");
    } else {
      toast.success("تم تحديث الاسم بنجاح");
      await refreshUserData();
    }
    setNameLoading(false);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) return;
    setEmailLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("update-admin-credentials", {
        body: { new_email: newEmail },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success("تم تحديث البريد الإلكتروني بنجاح");
      setNewEmail("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
    }
    setEmailLoading(false);
  };

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
      const { data, error } = await supabase.functions.invoke("update-admin-credentials", {
        body: { current_password: currentPassword, new_password: newPassword },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success("تم تغيير كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
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
      {/* Share Store Link */}
      {storeUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="w-4 h-4" />
              مشاركة رابط المتجر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={storeUrl} readOnly dir="ltr" className="text-xs" />
              <Button variant="outline" size="icon" onClick={copyStoreLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Info - Editable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الاسم</Label>
            <div className="flex gap-2">
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              <Button size="sm" onClick={handleUpdateName} disabled={nameLoading}>
                {nameLoading ? "..." : "حفظ"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>البريد الإلكتروني الحالي</Label>
            <p className="font-medium text-sm text-muted-foreground">{profile?.email}</p>
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
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="البريد الإلكتروني الجديد"
            dir="ltr"
          />
          <Button onClick={handleUpdateEmail} disabled={!newEmail.trim() || emailLoading} className="w-full">
            {emailLoading ? "جاري التحديث..." : "تحديث البريد الإلكتروني"}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4" />
            تغيير كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="كلمة المرور الحالية" dir="ltr" className="pl-10" />
            <PasswordToggle show={showCurrent} onToggle={setShowCurrent} />
          </div>
          <div className="space-y-1">
            <div className="relative">
              <Input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة (12 حرف على الأقل)" dir="ltr" className="pl-10" />
              <PasswordToggle show={showNew} onToggle={setShowNew} />
            </div>
            {newPassword.length > 0 && newPassword.length < 12 && (
              <p className="text-xs text-destructive">كلمة المرور يجب أن تكون 12 حرف على الأقل</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <Input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تأكيد كلمة المرور الجديدة" dir="ltr" className="pl-10" />
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
