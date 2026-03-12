import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFavorites = (orgId?: string) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      let query = supabase.from("favorites").select("product_id").eq("user_id", userId);
      if (orgId) query = query.eq("organization_id", orgId);
      const { data } = await query;
      if (data) setFavorites(data.map((f: any) => f.product_id));
    };

    fetchFavorites();
  }, [userId, orgId]);

  const toggleFavorite = async (productId: string, organizationId: string) => {
    if (!userId) {
      toast.error("يجب تسجيل الدخول أولاً لإضافة المفضلة");
      return;
    }

    setLoading(true);
    const isFav = favorites.includes(productId);

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (!error) {
        setFavorites(prev => prev.filter(id => id !== productId));
        toast.success("تم الإزالة من المفضلة");
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, product_id: productId, organization_id: organizationId });
      if (!error) {
        setFavorites(prev => [...prev, productId]);
        toast.success("تم الإضافة إلى المفضلة ❤️");
      }
    }
    setLoading(false);
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return { favorites, toggleFavorite, isFavorite, loading, isLoggedIn: !!userId };
};
