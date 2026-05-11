import type { MetadataRoute } from "next";

const defaultSite = "https://clear-voice-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? defaultSite
  ).replace(/\/+$/, "");

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
