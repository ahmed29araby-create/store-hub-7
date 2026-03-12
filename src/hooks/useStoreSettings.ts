import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StoreSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_button_text: string;
  categories: string[];
}

export const useStoreSettings = (orgId: string | undefined) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orgId) { setIsLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("*")
        .eq("organization_id", orgId)
        .single();

      if (data) {
        setSettings({
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_image_url: data.hero_image_url || "",
          hero_button_text: data.hero_button_text || "",
          categories: Array.isArray(data.categories) ? (data.categories as string[]) : [],
        });
      }
      setIsLoading(false);
    };
    fetch();
  }, [orgId]);

  return { settings, isLoading: isLoading };
};
