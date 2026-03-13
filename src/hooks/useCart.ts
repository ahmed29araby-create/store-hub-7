import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCart = (orgId?: string) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) { setCartItems([]); return; }
    const fetchCart = async () => {
      let query = supabase.from("cart_items").select("product_id, quantity").eq("user_id", userId);
      if (orgId) query = query.eq("organization_id", orgId);
      const { data } = await query;
      if (data) setCartItems(data);
    };
    fetchCart();
  }, [userId, orgId]);

  const addToCart = async (productId: string, organizationId: string) => {
    if (!userId) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }
    setLoading(true);
    const existing = cartItems.find(i => i.product_id === productId);
    if (existing) {
      await supabase.from("cart_items").update({ quantity: (existing.quantity || 1) + 1 }).eq("user_id", userId).eq("product_id", productId);
      setCartItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
    } else {
      await supabase.from("cart_items").insert({ user_id: userId, product_id: productId, organization_id: organizationId, quantity: 1 });
      setCartItems(prev => [...prev, { product_id: productId, quantity: 1 }]);
    }
    toast.success("تم الإضافة إلى السلة 🛒");
    setLoading(false);
  };

  const getCartCount = () => cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const isInCart = (productId: string) => cartItems.some(i => i.product_id === productId);

  return { cartItems, addToCart, getCartCount, isInCart, loading, isLoggedIn: !!userId };
};
