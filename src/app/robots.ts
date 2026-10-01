import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: site.url ? `${site.url}/sitemap.xml` : undefined,
    host: site.url || undefined,
  };
}
