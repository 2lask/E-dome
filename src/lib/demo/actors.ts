import type { PlatformRole } from "@/lib/model/identity";
import {
  DEFAULT_PERSONA_ID,
  PERSONAS,
  PERSONA_GROUP_LABELS,
  PERSONA_GROUP_ORDER,
  personaFor,
  type Persona,
  type PersonaGroup,
} from "@/content/roles";
import { personById, requirePerson } from "./directory";
import { AGENCY_MEMBER_IDS } from "./agency";

/* ── La personne incarnée (chantier P3, « être un profil ») ─────────────────

   Fonctions PURES : qui est la personne qu'on incarne, comment elle se
   présente, et ce que sa navigation lui propose. Aucune ne lit le navigateur
   — l'acteur courant vit dans la mémoire de session (`use-session.ts`), et ces
   fonctions prennent son identifiant en paramètre. Testées par
   `tests/data/p3-actor.test.ts`. */

/** Une personne qu'on peut incarner, telle que l'interface l'affiche. */
export interface ActorSummary {
  id: string;
  firstName: string;
  name: string;
  initials: string;
  avatar: string;
  city: string;
  roles: PlatformRole[];
  activeRole: PlatformRole;
  group: PersonaGroup;
  /** « agente immobilière ». */
  as: string;
  /** Une ligne pour le sélecteur : « Agente immobilière · Lutry ». */
  line: string;
  /** Pour le bandeau : « agente immobilière à Lutry ». */
  legend: string;
  cta: Persona["cta"];
}

const capitalize = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/** Vrai si l'id désigne une personne qu'on peut incarner. */
export function isIncarnable(id: string | null | undefined): id is string {
  return !!id && !!personaFor(id) && !!personById(id);
}

/** Un id valide à incarner : l'id donné s'il est connu, sinon Léo. */
export function resolveActorId(id: string | null | undefined): string {
  return isIncarnable(id) ? id : DEFAULT_PERSONA_ID;
}

export function actorSummary(id: string): ActorSummary {
  const persona = personaFor(id) ?? personaFor(DEFAULT_PERSONA_ID)!;
  const p = requirePerson(persona.id);
  return {
    id: p.id,
    firstName: p.firstName,
    name: `${p.firstName} ${p.lastName}`,
    initials: `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase(),
    avatar: p.avatar,
    city: p.city,
    roles: p.roles,
    activeRole: p.activeRole,
    group: persona.group,
    as: persona.as,
    line: `${capitalize(persona.as)} · ${p.city}`,
    legend: `${persona.as} à ${p.city}`,
    cta: persona.cta,
  };
}

/** Les seize, rangés par ce qu'ils font, dans l'ordre du sélecteur. */
export function personaGroups(): { group: PersonaGroup; label: string; people: ActorSummary[] }[] {
  return PERSONA_GROUP_ORDER.map((group) => ({
    group,
    label: PERSONA_GROUP_LABELS[group],
    people: PERSONAS.filter((p) => p.group === group).map((p) => actorSummary(p.id)),
  }));
}

/* ── La navigation de la personne ─────────────────────────────────────────

   « Mon espace » suit les rôles de la personne incarnée : l'espace agence pour
   l'équipe d'Hartmann Immobilier (la seule agence de démonstration — Céline,
   agente indépendante, pilote ses mandats depuis son tableau de bord),
   l'espace apporteur pour qui recommande, ses formations pour qui en crée,
   ses prestations pour qui en vend. Un particulier n'y voit que son tableau
   de bord, ses favoris et son profil. */

export type NavIcon = "dashboard" | "agency" | "referral" | "formations" | "services" | "favorites" | "profile";

export interface ActorNavItem {
  key: string;
  label: string;
  href: string;
  icon: NavIcon;
}

export function isAgencyMember(id: string): boolean {
  return AGENCY_MEMBER_IDS.includes(id);
}

export function navFor(id: string): ActorNavItem[] {
  const a = actorSummary(id);
  const has = (r: PlatformRole) => a.roles.includes(r);
  const items: ActorNavItem[] = [{ key: "dashboard", label: "Tableau de bord", href: "/dashboard", icon: "dashboard" }];
  if (isAgencyMember(a.id)) items.push({ key: "agence", label: "Espace agence", href: "/agence", icon: "agency" });
  if (has("apporteur")) items.push({ key: "apporteurs", label: "Espace apporteur", href: "/apporteurs", icon: "referral" });
  if (has("createur")) items.push({ key: "formations", label: "Mes formations", href: "/dashboard/annonces#formations", icon: "formations" });
  if (has("prestataire")) items.push({ key: "services", label: "Mes prestations", href: "/dashboard/annonces#prestations", icon: "services" });
  items.push({ key: "favoris", label: "Favoris", href: "/favoris", icon: "favorites" });
  items.push({ key: "profil", label: "Profil", href: "/profil", icon: "profile" });
  return items;
}
