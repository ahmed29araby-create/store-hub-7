import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, User, LogOut, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const MyAccount = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ["my-favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          product_id,
          organization_id,
          created_at,
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
          id,
          product_id,
          organization_id,
          quantity,
          created_at,
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

  const removeFavorite = async (id: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } else {
      toast.success("تم إزالة المنتج من المفضلة");
      refetchFavorites();
    }
  };

  const removeCartItem = async (id: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } else {
      toast.success("تم إزالة المنتج من السلة");
      refetchCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const getStoreUrl = (orgId: string, storeType: string) => {
    return `/store/${storeType}/${orgId}`;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">{profile?.display_name || "حسابي"}</h1>
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
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="w-4 h-4" />
              المفضلة ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="cart" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              السلة ({cartItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد منتجات في المفضلة بعد</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">تصفح المتاجر وأضف منتجاتك المفضلة</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
                    تصفح المتاجر
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {favorites.map((fav: any) => (
                  <Card key={fav.id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      {fav.products?.image_url ? (
                        <img src={fav.products.image_url} alt={fav.products?.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                          <Heart className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{fav.products?.name}</h3>
                        <p className="text-sm text-primary font-medium">{fav.products?.price} ج.م</p>
                        {fav.organizations?.name && (
                          <button
                            onClick={() => navigate(getStoreUrl(fav.organization_id, fav.organizations.store_type))}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            {fav.organizations.name} ←
                          </button>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeFavorite(fav.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">السلة فارغة</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">أضف منتجات من المتاجر لشرائها</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
                    تصفح المتاجر
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item: any) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.products?.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.products?.name}</h3>
                        <p className="text-sm text-primary font-medium">{item.products?.price} ج.م × {item.quantity}</p>
                        {item.organizations?.name && (
                          <button
                            onClick={() => navigate(getStoreUrl(item.organization_id, item.organizations.store_type))}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            {item.organizations.name} ←
                          </button>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeCartItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAccount;
