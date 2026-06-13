import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-13");

  const routes: Array<{
    url: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" },
    { url: "/explorer", priority: 0.9, changeFrequency: "daily" },
    { url: "/feed", priority: 0.9, changeFrequency: "daily" },
    { url: "/boutique", priority: 0.8, changeFrequency: "daily" },
    { url: "/formations", priority: 0.8, changeFrequency: "weekly" },
    { url: "/evenements", priority: 0.7, changeFrequency: "weekly" },
    { url: "/services", priority: 0.7, changeFrequency: "weekly" },
    { url: "/apporteurs", priority: 0.8, changeFrequency: "monthly" },
    { url: "/live", priority: 0.6, changeFrequency: "daily" },
    { url: "/investisseurs", priority: 0.7, changeFrequency: "monthly" },
    { url: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { url: "/aide", priority: 0.5, changeFrequency: "monthly" },
    { url: "/conditions", priority: 0.3, changeFrequency: "yearly" },
    { url: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.url}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
