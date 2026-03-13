import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, User, LogOut, Home, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const CustomerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [editName, setEditName] = useState(profile?.display_name || "");
  const [saving, setSaving] = useState(false);

  // Fetch favorites with product details
  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ["customer-favorites", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*, products(id, name, price, image_url, organization_id)")
        .eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch cart items with product details
  const { data: cartItems = [], refetch: refetchCart } = useQuery({
    queryKey: ["customer-cart", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("cart_items")
        .select("*, products(id, name, price, image_url, organization_id)")
        .eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const handleUpdateName = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName.trim() })
      .eq("user_id", user!.id);
    if (error) {
      toast.error("حدث خطأ أثناء التحديث");
    } else {
      toast.success("تم تحديث الاسم بنجاح");
    }
    setSaving(false);
  };

  const removeFavorite = async (productId: string) => {
    await supabase.from("favorites").delete().eq("user_id", user!.id).eq("product_id", productId);
    refetchFavorites();
    toast.success("تم الإزالة من المفضلة");
  };

  const removeCartItem = async (productId: string) => {
    await supabase.from("cart_items").delete().eq("user_id", user!.id).eq("product_id", productId);
    refetchCart();
    toast.success("تم الإزالة من السلة");
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return removeCartItem(productId);
    await supabase.from("cart_items").update({ quantity }).eq("user_id", user!.id).eq("product_id", productId);
    refetchCart();
  };

  const cartTotal = cartItems.reduce((sum, item: any) => sum + (item.products?.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <Home className="w-5 h-5" />
            <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>StoreHub</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{profile?.display_name}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile" className="gap-1"><User className="w-4 h-4" /> حسابي</TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1"><Heart className="w-4 h-4" /> المفضلة ({favorites.length})</TabsTrigger>
            <TabsTrigger value="cart" className="gap-1"><ShoppingCart className="w-4 h-4" /> السلة ({cartItems.length})</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> معلومات الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-xs">البريد الإلكتروني</Label>
                  <p className="font-medium">{profile?.email || user?.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>الاسم</Label>
                  <div className="flex gap-2">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <Button onClick={handleUpdateName} disabled={saving} size="sm">
                      {saving ? "..." : "حفظ"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>لا توجد منتجات في المفضلة</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>تصفح المتاجر</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {favorites.map((fav: any) => (
                  <Card key={fav.id} className="overflow-hidden">
                    <div className="aspect-[4/5] bg-muted">
                      {fav.products?.image_url ? (
                        <img src={fav.products.image_url} alt={fav.products.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Heart className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 space-y-1">
                      <p className="font-medium text-sm truncate">{fav.products?.name}</p>
                      <p className="text-sm text-primary font-bold">{fav.products?.price} ج.م</p>
                      <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => removeFavorite(fav.product_id)}>
                        <Trash2 className="w-3 h-3 ml-1" /> إزالة
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>السلة فارغة</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>تصفح المتاجر</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-20 rounded bg-muted overflow-hidden flex-shrink-0">
                        {item.products?.image_url ? (
                          <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingCart className="w-5 h-5 opacity-20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.products?.name}</p>
                        <p className="text-sm text-primary font-bold">{item.products?.price} ج.م</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateCartQuantity(item.product_id, (item.quantity || 1) - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity || 1}</span>
                        <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateCartQuantity(item.product_id, (item.quantity || 1) + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive w-8 h-8" onClick={() => removeCartItem(item.product_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-lg text-primary">{cartTotal.toLocaleString("ar-EG")} ج.م</span>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomerDashboard;
