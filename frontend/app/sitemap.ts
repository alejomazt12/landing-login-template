import type { MetadataRoute } from "next";

import { brands } from "@/data/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...brands.map((brand) => ({
      url: `${SITE_URL}/brands/${brand.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
