import type { Profile } from "./profile-types";
import type { PlatformRole } from "./model/identity";
import type { SessionUser } from "./session-user";

/* Pont « compte connecté » → modèle d'affichage. Partagé par le contexte (le
   profil éditable) et le hook d'identité, pour qu'une personne connectée voie
   SON compte partout, pas une personne de démonstration. */

/** Avatar « à initiales » (façon Slack/Google) tant qu'il n'y a pas de photo.
    Data-URI SVG : aucune requête réseau, jamais d'image cassée, déterministe
    (donc pas de divergence serveur/client à l'hydratation). */
export function initialsAvatar(firstName: string, lastName: string): string {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "ME";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">` +
    `<rect width="96" height="96" rx="48" fill="#0b5d57"/>` +
    `<text x="50%" y="50%" dy=".34em" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="600" letter-spacing="-1" fill="#faf9f6">${initials.slice(0, 2)}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Un `Profile` complet construit depuis le vrai compte : identité réelle,
    sections VIDES (un nouveau compte ne ment pas sur son contenu). */
export function profileFromCurrentUser(u: SessionUser): Profile {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email ?? "",
    avatar: u.avatar || initialsAvatar(u.firstName, u.lastName),
    headline: "",
    location: { city: u.city ?? "", country: u.country },
    roles: (u.roles.length ? u.roles : ["particulier"]) as PlatformRole[],
    trades: u.trades as Profile["trades"],
    interests: u.interests as Profile["interests"],
    about: u.bio ?? "",
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    links: [],
    visibility: { isPublic: true, showEmail: false, showPhone: false, showStats: true, hiddenSections: [] },
    meta: { verified: false, membreFondateur: false, memberSince: u.createdAt || "" },
    stats: { followers: 0, following: 0, rating: 0, reviewsCount: 0 },
  };
}
