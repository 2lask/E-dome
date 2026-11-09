import { properties as CATALOGUE, formations as FORMATIONS, reviewsReceivedBy, type Review } from "@/lib/mock-data";
import type { ProfileAvis, ProfileBien, ProfileFormation } from "@/components/profile/profile-showcase";
import { personById } from "./directory";

/* ── La vitrine RÉELLE d'une personne ───────────────────────────────────────

   Les pages de profil affichaient une vitrine générique (« Penthouse Genève »,
   « Jean-Pierre M. ») dès qu'une personne n'hébergeait rien : des biens qui
   n'étaient pas les siens, des avis que personne n'avait écrits. Ici, tout se
   dérive de la donnée : les biens qu'elle héberge, les formations dont elle
   est l'autrice, les avis qu'elle a réellement reçus — chaque nombre de
   l'en-tête se vérifie en ouvrant l'onglet correspondant. Une vitrine vide
   reste vide (état « Aucun… »). */

const MONTHS_FR_SHORT = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

/* Date « 15 mars 2026 » construite à la main, jamais via toLocaleDateString
   (l'ICU du serveur et celle du navigateur diffèrent : hydratation cassée). */
export function frDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS_FR_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Les biens qu'héberge la personne. Un bien vendu le dit. */
export function biensOf(personId: string): ProfileBien[] {
  return CATALOGUE.filter((c) => c.host.id === personId).map((c) => ({
    id: c.id,
    title: c.title,
    cover: c.images[0]!,
    price: c.price,
    currency: c.currency,
    unit: c.transactionType === "vente" ? "" : c.transactionType === "location-lt" ? "/mois" : "/nuit",
    location: `${c.location.city}, ${c.location.country}${c.soldTo ? " · Vendu" : ""}`,
  }));
}

/** Les formations dont la personne est l'autrice. */
export function formationsOf(personId: string): ProfileFormation[] {
  return FORMATIONS.filter((f) => f.instructor.id === personId).map((f) => ({
    id: f.id,
    title: f.title,
    cover: f.thumbnail,
    price: f.price,
    currency: f.currency,
    students: f.studentCount,
    rating: f.rating,
  }));
}

/** Ce sur quoi porte un avis, en une ligne (« Séjour · Studio… »). */
function aboutLabel(r: Review): string {
  if (r.subject.kind === "property") {
    const p = CATALOGUE.find((x) => x.id === r.subject.id);
    if (!p) return "Bien";
    const kind = p.soldTo ? "Achat" : p.transactionType === "location-ct" ? "Séjour" : "Bien";
    return `${kind} · ${p.title}`;
  }
  if (r.subject.kind === "formation") {
    const f = FORMATIONS.find((x) => x.id === r.subject.id);
    return `Formation · ${f?.title ?? r.subject.id}`;
  }
  return "Prestation";
}

/** Les avis réellement reçus, et leur répartition par étoiles. */
export function avisOf(personId: string): { avis: ProfileAvis[]; ratingBreakdown: { stars: number; count: number }[] } {
  const revs = reviewsReceivedBy(personId);
  const recipient = personById(personId);
  const avis: ProfileAvis[] = revs.map((r) => ({
    id: r.id,
    author: `${r.author.firstName} ${r.author.lastName}`.trim(),
    authorId: r.author.id,
    authorAvatar: r.author.avatar,
    about: aboutLabel(r),
    rating: r.rating,
    text: r.comment,
    date: frDate(r.createdAt),
    reply: r.reply && recipient
      ? { author: `${recipient.firstName} ${recipient.lastName}`, text: r.reply.content, date: frDate(r.reply.createdAt) }
      : undefined,
  }));
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: revs.filter((r) => r.rating === stars).length,
  }));
  return { avis, ratingBreakdown };
}
