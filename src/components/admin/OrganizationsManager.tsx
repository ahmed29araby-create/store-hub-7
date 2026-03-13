import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Power, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const storeTypeLabels: Record<string, string> = {
  clothing: "ملابس",
  accessories: "إكسسوارات",
  restaurant: "مطاعم",
};

const OrganizationsManager = () => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeType, setStoreType] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // Confirm action state
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "toggle";
    orgId: string;
    orgName: string;
    isActive?: boolean;
  } | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const queryClient = useQueryClient();

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createOrg = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("create-organization", {
        body: { name, email, password, store_type: storeType },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("تم إضافة الشركة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setOpen(false);
      setName(""); setEmail(""); setPassword(""); setStoreType("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleOrg = useMutation({
    mutationFn: async ({ id, is_active, password }: { id: string; is_active: boolean; password: string }) => {
      const { data, error } = await supabase.functions.invoke("toggle-organization", {
        body: { organization_id: id, is_active, password },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      toast.success("تم تحديث حالة الشركة");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      closeConfirmDialog();
    },
    onError: (err: Error) => {
      const msg = err.message?.includes("غير صحيحة") ? "يرجى إدخال كلمة مرور مسؤول المنصة صحيحة" : err.message;
      toast.error(msg);
    },
  });

  const deleteOrg = useMutation({
    mutationFn: async ({ orgId, password }: { orgId: string; password: string }) => {
      const { data, error } = await supabase.functions.invoke("delete-organization", {
        body: { organization_id: orgId, password },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      toast.success("تم حذف الشركة");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      closeConfirmDialog();
    },
    onError: (err: Error) => {
      const msg = err.message?.includes("غير صحيحة") ? "يرجى إدخال كلمة مرور مسؤول المنصة صحيحة" : err.message;
      toast.error(msg);
    },
  });

  const closeConfirmDialog = () => {
    setConfirmAction(null);
    setConfirmPassword("");
    setShowConfirmPassword(false);
  };

  const handleConfirmAction = () => {
    if (!confirmAction || !confirmPassword) return;
    if (confirmAction.type === "delete") {
      deleteOrg.mutate({ orgId: confirmAction.orgId, password: confirmPassword });
    } else {
      toggleOrg.mutate({ id: confirmAction.orgId, is_active: !confirmAction.isActive, password: confirmPassword });
    }
  };

  const filteredOrgs = orgs.filter((org) => {
    if (filter === "active") return org.is_active;
    if (filter === "inactive") return !org.is_active;
    return true;
  });

  const isActionPending = deleteOrg.isPending || toggleOrg.isPending;

  const getConfirmTitle = () => {
    if (!confirmAction) return "";
    if (confirmAction.type === "delete") return `تأكيد حذف شركة "${confirmAction.orgName}"`;
    return confirmAction.isActive ? `تأكيد تعطيل شركة "${confirmAction.orgName}"` : `تأكيد تفعيل شركة "${confirmAction.orgName}"`;
  };

  const getConfirmDescription = () => {
    if (!confirmAction) return "";
    if (confirmAction.type === "delete") return `سيتم حذف شركة "${confirmAction.orgName}" وجميع بياناتها نهائياً.`;
    return confirmAction.isActive
      ? `سيتم تعطيل شركة "${confirmAction.orgName}" ولن يتمكن عملاؤها من الوصول للمتجر.`
      : `سيتم تفعيل شركة "${confirmAction.orgName}" وسيتمكن عملاؤها من الوصول للمتجر.`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>الكل ({orgs.length})</Button>
          <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>نشطة ({orgs.filter(o => o.is_active).length})</Button>
          <Button variant={filter === "inactive" ? "default" : "outline"} size="sm" onClick={() => setFilter("inactive")}>معطلة ({orgs.filter(o => !o.is_active).length})</Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />إضافة شركة</Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة شركة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات الشركة الجديدة</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(val)) return;
                    setName(val);
                  }}
                  placeholder="اسم الشركة (بالإنجليزية فقط)"
                  dir="ltr"
                />
                {name.length === 0 && (
                  <p className="text-xs text-muted-foreground">يجب إدخال اسم الشركة بالحروف الإنجليزية فقط</p>
                )}
              </div>
              <div className="space-y-2">
                <Select value={storeType} onValueChange={setStoreType}>
                  <SelectTrigger><SelectValue placeholder="اختر نوع المتجر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">ملابس</SelectItem>
                    <SelectItem value="accessories">إكسسوارات</SelectItem>
                    <SelectItem value="restaurant">مطاعم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور (12 حرف على الأقل)</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(val)) return;
                      setPassword(val);
                    }}
                    placeholder="••••••••••••"
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
              <Button
                className="w-full"
                onClick={() => createOrg.mutate()}
                disabled={!name || !email || password.length < 12 || !storeType || createOrg.isPending}
              >
                {createOrg.isPending ? "جاري الإنشاء..." : "إنشاء الشركة"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orgs List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
      ) : filteredOrgs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">لا توجد شركات</div>
      ) : (
        <div className="grid gap-4">
          {filteredOrgs.map((org) => (
            <Card key={org.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{org.name}</h3>
                        <Badge variant={org.is_active ? "default" : "destructive"}>
                          {org.is_active ? "نشطة" : "معطلة"}
                        </Badge>
                        <Badge variant="outline">{storeTypeLabels[org.store_type] || org.store_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{org.email}</p>
                      <p className="text-xs text-muted-foreground">
                        انضمت في {new Date(org.created_at).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmAction({ type: "toggle", orgId: org.id, orgName: org.name, isActive: org.is_active })}
                    >
                      <Power className="w-4 h-4 ml-1" />
                      {org.is_active ? "تعطيل" : "تفعيل"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmAction({ type: "delete", orgId: org.id, orgName: org.name })}
                    >
                      <Trash2 className="w-4 h-4 ml-1" />حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Action Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => { if (!open) closeConfirmDialog(); }}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{getConfirmTitle()}</DialogTitle>
            <DialogDescription>{getConfirmDescription()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              أدخل كلمة مرور مسؤول المنصة لتأكيد العملية
            </p>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="كلمة مرور مسؤول المنصة"
                dir="ltr"
                className="pl-10"
                onKeyDown={(e) => { if (e.key === "Enter" && confirmPassword) handleConfirmAction(); }}
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
            <Button
              variant={confirmAction?.type === "delete" ? "destructive" : "default"}
              className="w-full"
              onClick={handleConfirmAction}
              disabled={!confirmPassword || isActionPending}
            >
              {isActionPending ? "جاري التنفيذ..." : confirmAction?.type === "delete" ? "تأكيد الحذف" : confirmAction?.isActive ? "تأكيد التعطيل" : "تأكيد التفعيل"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsManager;
