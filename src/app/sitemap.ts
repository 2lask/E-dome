import type { MetadataRoute } from "next";

/* Plan du site.

   Volontairement restreint aux pages qui ont un sens pour un visiteur qui
   découvre le projet : la landing, les pages légales, et les entrées
   principales de la maquette.

   Les routes de détail (`/explorer/[id]`, `/boutique/[id]`, `/profil/[id]`…)
   sont exclues : elles ne décrivent que des données fictives, et les
   référencer ferait apparaître des biens et des profils inventés dans les
   moteurs de recherche. À reprendre quand les données seront réelles.

   `/merci` et `/admin` sont absents, comme dans robots.ts. */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

interface Entry {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const ENTRIES: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/feed", priority: 0.7, changeFrequency: "daily" },
  { path: "/explorer", priority: 0.7, changeFrequency: "daily" },
  { path: "/formations", priority: 0.6, changeFrequency: "weekly" },
  { path: "/evenements", priority: 0.6, changeFrequency: "weekly" },
  { path: "/boutique", priority: 0.5, changeFrequency: "weekly" },
  { path: "/services", priority: 0.5, changeFrequency: "weekly" },
  { path: "/apporteurs", priority: 0.5, changeFrequency: "monthly" },
  { path: "/conditions", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ENTRIES.map((entry) => ({
    url: `${BASE_URL}${entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
