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

  const { data: products = [], isLoading } = useQuery({
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

  return { organization, products, isLoading, orgId };
};
