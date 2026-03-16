import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  organization_id: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  is_visible: boolean;
  sort_order: number;
}

export const useStoreProducts = () => {
  const { orgId } = useParams<{ orgId: string }>();

  const { data: organization } = useQuery({
    queryKey: ["store-org", orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, store_type, is_active")
        .eq("id", orgId)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["store-products", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("organization_id", orgId)
        .eq("is_available", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StoreProduct[];
    },
    enabled: !!orgId,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["store-categories", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("organization_id", orgId)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as StoreCategory[];
    },
    enabled: !!orgId,
  });

  // Group products by category
  const groupedProducts: { category: StoreCategory; products: StoreProduct[] }[] = categories
    .map((cat) => ({
      category: cat,
      products: products.filter((p) => p.category === cat.id),
    }))
    .filter((group) => group.products.length > 0);

  // Only return categories that have products (hide empty ones from store)
  const visibleCategories = categories.filter(
    (cat) => products.some((p) => p.category === cat.id)
  );

  // Products without a category
  const uncategorizedProducts = products.filter(
    (p) => !p.category || !categories.find((c) => c.id === p.category)
  );

  return {
    organization,
    products,
    categories: visibleCategories,
    groupedProducts,
    uncategorizedProducts,
    isLoading: productsLoading || categoriesLoading,
    orgId,
  };
};
