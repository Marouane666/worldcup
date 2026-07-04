import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

const BASE = SITE.url.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
