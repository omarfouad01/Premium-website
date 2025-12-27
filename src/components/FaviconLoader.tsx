import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const FaviconLoader = () => {
  useEffect(() => {
    loadFavicon();
  }, []);

  const loadFavicon = async () => {
    try {
      const { data } = await supabase
        .from("site_settings_premium_20251225")
        .select("favicon_url")
        .limit(1)
        .single();

      if (data?.favicon_url) {
        updateFavicon(data.favicon_url);
      }
    } catch (error) {
      console.error("Error loading favicon:", error);
    }
  };

  const updateFavicon = (url: string) => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;
  };

  return null;
};

export default FaviconLoader;
