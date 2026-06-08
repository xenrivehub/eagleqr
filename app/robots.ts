import type { MetadataRoute } from "next";

const BASE = "https://eaglemenu.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Yönetim/işlevsel yollar indexlenmesin
      disallow: ["/dashboard", "/admin", "/api", "/menu-pdf"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
