"use server";

import { createClient } from "./server";
import type { MyProperty, NewPropertyInput } from "../my-property";
import type { PropertyType, TransactionType, Currency } from "../types";

/* ── Actions serveur : les biens EN BASE (chantier C4) ───────────────────────

   Publier un bien l'écrit dans `properties` au nom de la personne connectée
   (RLS : `auth.uid() = host_id`). On relit SES biens pour « Mes annonces » et
   sa vitrine, et UN bien public (avec son hôte) pour la fiche de l'Explorer.

   Sans Supabase (mode démo) ou sans session : échec explicite / liste vide —
   l'appelant retombe sur la mémoire de session (aucune régression). */

/* Les colonnes lues, partagées par les deux lectures. */
const COLS =
  "id, host_id, title, description, type, transaction_type, price, currency, city, country, address, lat, lng, images, videos, bedrooms, bathrooms, area, amenities, featured, sold_to, created_at";

/* La même chose + l'hôte joint (fiche publique). Deux FK vers profiles
   (host_id, sold_to) → on désambiguïse par la colonne. */
const COLS_WITH_HOST = `${COLS}, host:profiles!host_id (id, first_name, last_name, avatar, city, country, roles, active_role)`;

type Row = {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  type: string;
  transaction_type: string;
  price: number;
  currency: string | null;
  city: string;
  country: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  images: string[] | null;
  videos: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  amenities: string[] | null;
  featured: boolean | null;
  sold_to: string | null;
  created_at: string;
  host?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    city: string | null;
    country: string | null;
    roles: string[] | null;
    active_role: string | null;
  } | null;
};

function mapRow(r: Row): MyProperty {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    type: r.type as PropertyType,
    transactionType: r.transaction_type as TransactionType,
    price: Number(r.price),
    currency: (r.currency ?? "CHF") as Currency,
    city: r.city,
    country: r.country ?? "Suisse",
    address: r.address ?? undefined,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    images: r.images ?? [],
    videos: r.videos ?? [],
    bedrooms: r.bedrooms ?? 0,
    bathrooms: r.bathrooms ?? 0,
    area: Number(r.area ?? 0),
    amenities: r.amenities ?? [],
    featured: r.featured ?? false,
    soldTo: r.sold_to,
    createdAt: r.created_at,
    host: r.host
      ? {
          id: r.host.id,
          firstName: r.host.first_name,
          lastName: r.host.last_name,
          avatar: r.host.avatar,
          city: r.host.city,
          country: r.host.country ?? "Suisse",
          roles: r.host.roles ?? ["particulier"],
          activeRole: r.host.active_role ?? "particulier",
        }
      : undefined,
  };
}

/** Publie un bien : insère une ligne `properties` pour la personne connectée. */
export async function createMyProperty(
  input: NewPropertyInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "supabase-non-configure" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "non-connecte" };

  const row = {
    host_id: user.id,
    title: input.title,
    description: input.description ?? "",
    type: input.type,
    transaction_type: input.transactionType,
    price: Math.max(0, Math.round(input.price)),
    currency: input.currency ?? "CHF",
    city: input.city,
    country: input.country ?? "Suisse",
    address: input.address || null,
    images: input.images ?? [],
    videos: input.videos ?? [],
    bedrooms: Math.max(0, Math.round(input.bedrooms)),
    bathrooms: Math.max(0, Math.round(input.bathrooms)),
    area: Math.max(0, Math.round(input.area)),
    amenities: input.amenities ?? [],
    analytics: input.analytics ?? null,
  };

  const { data, error } = await supabase.from("properties").insert(row).select("id").single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

/** Les biens de la personne connectée (« Mes annonces », vitrine), récents d'abord. */
export async function listMyProperties(): Promise<MyProperty[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("properties")
    .select(COLS)
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map(mapRow);
}

/** Un bien public par son id, hôte joint (fiche de l'Explorer). `null` si
    absent ou base indisponible. */
export async function getPublicProperty(id: string): Promise<MyProperty | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select(COLS_WITH_HOST)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  /* PostgREST infère l'hôte joint comme un tableau ; à l'exécution, une
     relation « plusieurs-à-un » renvoie bien un objet unique. */
  return mapRow(data as unknown as Row);
}

/** Supprime un de MES biens (RLS : seulement le mien). */
export async function deleteMyProperty(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "supabase-non-configure" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "non-connecte" };

  const { error } = await supabase.from("properties").delete().eq("id", id).eq("host_id", user.id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
