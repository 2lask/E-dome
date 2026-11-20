import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { CITIES } from "@/lib/villes";

/* Plan du site : les pages publiques RÉELLES.
   · pages d'entrée et villes de lancement ;
   · chaque bien en ligne, chaque recherche active, chaque agence (lus avec la
     clé publique : seulement ce que tout visiteur peut voir).
   Les pôles parqués (redirigés) et les espaces privés sont absents. */

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch").replace(/\/+$/, "");

const STATIC: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
  ["/", 1, "daily"],
  ["/explorer", 0.9, "daily"],
  ["/recherches", 0.9, "daily"],
  ...CITIES.map((c) => [`/ville/${c.slug}`, 0.9, "daily"] as [string, number, "daily"]),
  ["/apporteurs", 0.7, "weekly"],
  ["/agences", 0.7, "weekly"],
  ["/demenagement", 0.7, "monthly"],
  ["/vendre", 0.6, "monthly"],
  ["/a-propos", 0.5, "monthly"],
  ["/aide", 0.4, "monthly"],
  ["/tarifs", 0.4, "monthly"],
  ["/conditions", 0.2, "yearly"],
  ["/confidentialite", 0.2, "yearly"],
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC.map(([path, priority, changeFrequency]) => ({
    url: `${BASE_URL}${path}`, lastModified: now, priority, changeFrequency,
  }));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return entries;
  const db = createClient(url, anon, { auth: { persistSession: false } });
  const [props, searches, agencies] = await Promise.all([
    db.from("properties").select("id, created_at").is("sold_to", null).limit(5000),
    db.from("searches").select("id, created_at").eq("active", true).limit(5000),
    db.from("agencies").select("slug, created_at").limit(2000),
  ]);
  for (const p of (props.data ?? []) as { id: string; created_at: string }[])
    entries.push({ url: `${BASE_URL}/explorer/${p.id}`, lastModified: new Date(p.created_at), priority: 0.6, changeFrequency: "weekly" });
  for (const s of (searches.data ?? []) as { id: string; created_at: string }[])
    entries.push({ url: `${BASE_URL}/recherches/${s.id}`, lastModified: new Date(s.created_at), priority: 0.6, changeFrequency: "weekly" });
  for (const a of (agencies.data ?? []) as { slug: string; created_at: string }[])
    entries.push({ url: `${BASE_URL}/agences/${a.slug}`, lastModified: new Date(a.created_at), priority: 0.5, changeFrequency: "weekly" });
  return entries;
}
