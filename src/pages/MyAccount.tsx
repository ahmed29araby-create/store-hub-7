import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, User, LogOut, Trash2, ArrowRight, Settings, Eye, EyeOff, Camera, Package } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessages";

const MyAccount = () => {
  const { user, profile, loading, signOut, refreshUserData } = useAuth();
  const navigate = useNavigate();

  // Settings state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ["my-favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id, product_id, organization_id, created_at,
          products:product_id (id, name, price, image_url, description),
          organizations:organization_id (id, name, store_type)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: cartItems = [], refetch: refetchCart } = useQuery({
    queryKey: ["my-cart", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id, product_id, organization_id, quantity, created_at,
          products:product_id (id, name, price, image_url, description),
          organizations:organization_id (id, name, store_type)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const removeFavorite = async (id: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) toast.error("حدث خطأ أثناء الحذف");
    else { toast.success("تم إزالة المنتج من المفضلة"); refetchFavorites(); }
  };

  const removeCartItem = async (id: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) toast.error("حدث خطأ أثناء الحذف");
    else { toast.success("تم إزالة المنتج من السلة"); refetchCart(); }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim() || !user) return;
    setNameLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({ display_name: newName.trim() }).eq("user_id", user.id);
      if (error) throw error;
      toast.success("تم تحديث الاسم بنجاح");
      setNewName("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء تحديث الاسم"));
    }
    setNameLoading(false);
  };

  const handleEmailUpdate = async () => {
    if (!newEmail.trim() || !user) return;
    setEmailLoading(true);
    try {
      const res = await supabase.functions.invoke("update-admin-credentials", {
        body: { new_email: newEmail },
      });
      if (res.error) throw new Error(getErrorMessage(res.error, "حدث خطأ أثناء تحديث البريد"));
      if (res.data?.error) throw new Error(res.data.error);
      toast.success("تم تحديث البريد الإلكتروني بنجاح!");
      setNewEmail("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء تحديث البريد الإلكتروني"));
    }
    setEmailLoading(false);
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 8) { toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    if (newPassword !== confirmPassword) { toast.error("كلمة المرور غير متطابقة"); return; }
    setPasswordLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("update-admin-credentials", {
        body: { current_password: currentPassword, new_password: newPassword },
      });
      if (error) {
        const body = await error?.context?.json?.() catch {};
        throw new Error(body?.error || getErrorMessage(error, "حدث خطأ أثناء تغيير كلمة المرور"));
      }
      if (data?.error) throw new Error(data.error);
      toast.success("تم تغيير كلمة المرور بنجاح!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء تغيير كلمة المرور"));
    }
    setPasswordLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
      toast.success("تم تحديث الصورة بنجاح");
      await refreshUserData();
    } catch (err: any) {
      toast.error(getErrorMessage(err, "حدث خطأ أثناء رفع الصورة"));
    }
    setAvatarLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const getStoreUrl = (orgId: string, storeType: string) => `/store/${storeType}/${orgId}`;
  const avatarUrl = (profile as any)?.avatar_url;

  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار", preparing: "قيد التحضير", ready: "جاهز", delivered: "تم التوصيل", cancelled: "ملغي",
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
            <div>
              <h1 className="font-bold text-foreground">{profile?.display_name || user?.user_metadata?.display_name || "حسابي"}</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowRight className="w-4 h-4 ml-1" />
              الرئيسية
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="favorites" dir="rtl">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="favorites" className="gap-1 text-xs sm:text-sm">
              <Heart className="w-4 h-4" />
              المفضلة ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="cart" className="gap-1 text-xs sm:text-sm">
              <ShoppingCart className="w-4 h-4" />
              السلة ({cartItems.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1 text-xs sm:text-sm">
              <Package className="w-4 h-4" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد منتجات في المفضلة بعد</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>تصفح المتاجر</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {favorites.map((fav: any) => (
                  <Card key={fav.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      {fav.products?.image_url ? (
                        <img src={fav.products.image_url} alt={fav.products?.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center"><Heart className="w-6 h-6 text-muted-foreground/30" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{fav.products?.name}</h3>
                        <p className="text-sm text-primary font-medium">{fav.products?.price} ج.م</p>
                        {fav.organizations?.name && (
                          <button onClick={() => navigate(getStoreUrl(fav.organization_id, fav.organizations.store_type))} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            {fav.organizations.name} ←
                          </button>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeFavorite(fav.id)}><Trash2 className="w-4 h-4" /></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">السلة فارغة</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>تصفح المتاجر</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.products?.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center"><ShoppingCart className="w-6 h-6 text-muted-foreground/30" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.products?.name}</h3>
                        <p className="text-sm text-primary font-medium">{item.products?.price} ج.م × {item.quantity}</p>
                        {item.organizations?.name && (
                          <button onClick={() => navigate(getStoreUrl(item.organization_id, item.organizations.store_type))} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            {item.organizations.name} ←
                          </button>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeCartItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات بعد</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("ar-EG")}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-bold">{order.total} ج.م</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-4">
              {/* Avatar */}
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Camera className="w-4 h-4" />الصورة الشخصية</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center"><User className="w-8 h-8 text-muted-foreground/40" /></div>
                  )}
                  <div>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" disabled={avatarLoading} asChild><span>{avatarLoading ? "جاري الرفع..." : "تغيير الصورة"}</span></Button>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Name */}
              <Card>
                <CardHeader><CardTitle className="text-base">تعديل الاسم</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="أدخل الاسم الجديد" />
                  <Button onClick={handleNameUpdate} disabled={!newName.trim() || nameLoading} className="w-full">
                    {nameLoading ? "جاري التحديث..." : "تحديث الاسم"}
                  </Button>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardHeader><CardTitle className="text-base">تعديل البريد الإلكتروني</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="البريد الإلكتروني الجديد" dir="ltr" />
                  <Button onClick={handleEmailUpdate} disabled={!newEmail.trim() || emailLoading} className="w-full">
                    {emailLoading ? "جاري التحديث..." : "تحديث البريد"}
                  </Button>
                </CardContent>
              </Card>

              {/* Password */}
              <Card>
                <CardHeader><CardTitle className="text-base">تغيير كلمة المرور</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="كلمة المرور الحالية" dir="ltr" className="pl-10" />
                    <button type="button" onMouseDown={() => setShowCurrent(true)} onMouseUp={() => setShowCurrent(false)} onMouseLeave={() => setShowCurrent(false)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)" dir="ltr" className="pl-10" />
                    <button type="button" onMouseDown={() => setShowNew(true)} onMouseUp={() => setShowNew(false)} onMouseLeave={() => setShowNew(false)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تأكيد كلمة المرور الجديدة" dir="ltr" />
                  {confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-destructive">كلمة المرور غير متطابقة</p>}
                  <Button onClick={handlePasswordUpdate} disabled={!currentPassword || newPassword.length < 8 || newPassword !== confirmPassword || passwordLoading} className="w-full">
                    {passwordLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAccount;
