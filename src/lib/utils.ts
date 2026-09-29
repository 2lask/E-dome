import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Il y a ${weeks} sem`;
  return date.toLocaleDateString("fr-CH");
}

export function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

/**
 * Montant de volume lisible, SANS `toLocaleString` (le séparateur de milliers
 * diffère entre l'ICU du serveur et celui du navigateur — piège
 * d'hydratation). Au-delà du million : « 4,65 M CHF » ; en dessous, groupé à
 * l'apostrophe suisse : « 850'000 CHF ».
 */
export function formatVolumeChf(amount: number): string {
  const n = Math.round(amount);
  if (n >= 1_000_000) {
    const m = (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
    return `${m} M CHF`;
  }
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")} CHF`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
