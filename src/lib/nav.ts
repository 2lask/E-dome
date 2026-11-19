import { Home, Compass, Inbox, Building2, Coins, Radar, type LucideIcon } from "lucide-react";

/* ── La navigation d'E-Dome — source unique (REBUILD.md §3.2) ────────────────

   Six entrées. Chacune correspond à un moment du moteur de récompenses :
   l'offre (Explorer, Mes biens), la demande (Recherches), la décision
   (Demandes), le gain (Gagner). La barre latérale, la barre mobile et le menu de
   commande lisent TOUS cette liste : une entrée ajoutée ici apparaît partout,
   une entrée retirée disparaît partout.

   `memberOnly` : réservé à un compte connecté (un visiteur n'a ni demandes ni
   biens). Les routes correspondantes sont aussi fermées par le proxy. */

export interface NavEntry {
  key: "accueil" | "explorer" | "recherches" | "demandes" | "mes-biens" | "gagner";
  label: string;
  href: string;
  icon: LucideIcon;
  /** Préfixes de chemin qui allument l'entrée. */
  match: string[];
  memberOnly?: boolean;
  /** Une ligne, affichée dans le menu de commande. */
  description: string;
}

export const NAV: NavEntry[] = [
  {
    key: "accueil",
    label: "Accueil",
    href: "/",
    icon: Home,
    match: ["/"],
    description: "Ce qui demande votre attention",
  },
  {
    key: "explorer",
    label: "Explorer",
    href: "/explorer",
    icon: Compass,
    match: ["/explorer", "/recherche"],
    description: "Les biens à vendre et à louer",
  },
  {
    key: "recherches",
    label: "Recherches",
    href: "/recherches",
    icon: Radar,
    match: ["/recherches"],
    description: "Ce que les gens cherchent, et ce qu'ils offrent à qui le trouve",
  },
  {
    key: "demandes",
    label: "Demandes",
    href: "/demandes",
    icon: Inbox,
    match: ["/demandes"],
    memberOnly: true,
    description: "Contacts, visites et mises en relation",
  },
  {
    key: "mes-biens",
    label: "Mes biens",
    href: "/mes-biens",
    icon: Building2,
    match: ["/mes-biens", "/publier"],
    memberOnly: true,
    description: "Vos annonces, leur qualité, leurs primes",
  },
  {
    key: "gagner",
    label: "Gagner",
    href: "/apporteurs",
    icon: Coins,
    match: ["/apporteurs"],
    description: "Recommandez le bon contact, touchez une prime",
  },
];

/** Les entrées visibles pour un membre ou un visiteur. */
export function navFor(member: boolean): NavEntry[] {
  return NAV.filter((e) => member || !e.memberOnly);
}

/** L'entrée est-elle active pour ce chemin ? (`/` ne s'allume que sur `/`.) */
export function isNavActive(entry: NavEntry, pathname: string): boolean {
  if (entry.href === "/") return pathname === "/";
  return entry.match.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Ouvre le menu de commande depuis n'importe où. */
export const COMMAND_OPEN_EVENT = "edome:command-open";
/** Ouvre le copilote IA (écouté par `AiAssistant`). */
export const AI_OPEN_EVENT = "edome:ai-open";
