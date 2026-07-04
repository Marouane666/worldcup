import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

const BASE = SITE.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
