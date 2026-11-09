import type { Notification } from "@/lib/types";
import { properties as CATALOGUE, mockReviews, users } from "@/lib/mock-data";
import { CURRENT_USER_ID } from "./identity";

/* ── Les données d'AMORCE de la messagerie et des notifications ─────────────

   Ce que la plateforme contient avant que le visiteur ne fasse quoi que ce
   soit. Le moteur de session (`session-store.ts`, `session-views.ts`) y ajoute
   ce que le visiteur fait ; les écrans ne lisent JAMAIS ces tableaux en
   direct, ils passent par les vues dérivées — sinon on retrouverait trois
   compteurs de non-lues différents.

   Les fils suivent le casting (`analyse2/casting.md`) : de vraies personnes de
   l'annuaire, à des stades différents d'une relation, chacune avec sa voix.
   Certains fils ne concernent pas Léo (Ennio ↔ Céline, Bernard ↔ Nikola…) :
   ils existent pour le chantier P3, « être un profil », où l'on incarnera
   Céline ou Bernard et où l'on verra leur messagerie. Aujourd'hui, la vue de
   Léo n'en montre que les fils dont il est membre.

   Toutes les dates sont antérieures ou égales à `DEMO_TODAY` (30 septembre
   2026, 12 h) : les événements de session viennent toujours après. */

export interface ThreadMessageSeed {
  id: string;
  senderId: string;
  text: string;
  at: string;
  /** Non lu par les autres membres du fil. */
  unread?: boolean;
}

export interface ThreadSeed {
  id: string;
  memberIds: string[];
  /** Nom d'un groupe (absent pour un fil à deux). */
  name?: string;
  avatar?: string;
  /** L'objet dont parle le fil (un bien), pour l'afficher en tête. */
  subject?: { kind: "property"; id: string };
  messages: ThreadMessageSeed[];
}

export interface NotificationSeed {
  id: string;
  recipientId: string;
  type: Notification["type"];
  /** La personne à l'origine de la notification, si c'en est une. */
  actorId?: string;
  title: string;
  message: string;
  at: string;
  href: string;
  read: boolean;
}

const LEO = CURRENT_USER_ID; // Léo Martin, Lausanne
const CELINE = "user-002";
const ENNIO = "user-003";
const ALINE = "user-004";
const NIKOLA = "user-005";
const ANA = "user-006";
const BERNARD = "user-007";
const CLEMENCE = "user-008";
const SANDRINE = "user-011";
const MIRJANA = "user-013";
const JEANLUC = "user-015";
const AMINA = "user-016";

const title = (propertyId: string) => {
  const p = CATALOGUE.find((x) => x.id === propertyId);
  if (!p) throw new Error("Bien inconnu dans l'amorce de la messagerie : " + propertyId);
  return p.title;
};
const nameOf = (id: string) => {
  const u = users.find((x) => x.id === id);
  if (!u) throw new Error("Personne inconnue dans l'amorce de la messagerie : " + id);
  return `${u.firstName} ${u.lastName}`;
};

/* ── Les fils ───────────────────────────────────────────────────────────── */

export const THREAD_SEEDS: ThreadSeed[] = [
  /* Ana ↔ Léo — l'appartement de Renens. Stade : candidature déposée. Ana est
     débutante et polie ; Léo, bailleur, rappelle la formule officielle du
     loyer initial, obligatoire dans le canton de Vaud. */
  {
    id: "th-ana-leo",
    memberIds: [ANA, LEO],
    subject: { kind: "property", id: "prop8" },
    messages: [
      { id: "th1-1", senderId: ANA, at: "2026-09-24T16:10:00Z", text: "Bonjour Monsieur Martin, je suis intéressée par le 4,5 pièces à Renens pour ma famille (nous avons deux enfants). Est-ce qu'il est encore libre ?" },
      { id: "th1-2", senderId: LEO, at: "2026-09-24T17:02:00Z", text: "Bonjour Madame Ferreira, oui, il est libre au 1er novembre. Je fais des visites samedi matin : 10 h ou 11 h ?" },
      { id: "th1-3", senderId: ANA, at: "2026-09-26T11:20:00Z", text: "Merci pour la visite de ce matin, les enfants ont adoré la chambre avec le balcon. Nous aimerions déposer notre dossier." },
      { id: "th1-4", senderId: LEO, at: "2026-09-26T12:05:00Z", text: "Avec plaisir. Il me faut un extrait de l'office des poursuites, vos trois dernières fiches de salaire et une copie de vos permis. Avec le bail, vous recevrez la formule officielle de notification du loyer initial : elle indique le loyer de l'ancien locataire, c'est obligatoire dans le canton de Vaud." },
      { id: "th1-5", senderId: ANA, at: "2026-09-29T18:41:00Z", unread: true, text: "J'ai tout envoyé par e-mail. Une question : cette formule officielle, je dois la signer ou seulement la garder ? Et c'est normal qu'on demande 3 mois de garantie ? C'est notre premier appartement en Suisse." },
      { id: "th1-6", senderId: ANA, at: "2026-09-29T18:43:00Z", unread: true, text: "Désolée pour toutes ces questions, on veut bien faire." },
    ],
  },
  /* Ennio ↔ Céline — après l'achat de Lutry. Ennio est froid et chiffré,
     Céline chaleureuse et précise. Stade : nouvelle recherche. */
  {
    id: "th-ennio-celine",
    memberIds: [ENNIO, CELINE],
    messages: [
      { id: "th2-1", senderId: CELINE, at: "2026-09-21T08:30:00Z", text: "Bonjour Monsieur Bordoni, l'acte de Lutry est inscrit au registre foncier. Merci pour votre confiance, et pour votre avis." },
      { id: "th2-2", senderId: ENNIO, at: "2026-09-21T09:02:00Z", text: "Reçu. Merci." },
      { id: "th2-3", senderId: ENNIO, at: "2026-09-28T07:15:00Z", text: "Autre sujet. Je cherche un immeuble de rendement. Riviera ou Lavaux. Rendement brut 4,2 % minimum. Budget 4 M." },
      { id: "th2-4", senderId: CELINE, at: "2026-09-28T09:40:00Z", text: "Bonjour ! À Lavaux, 4,2 % brut sera difficile : les immeubles s'y vendent autour de 3 %. Sur la Riviera, c'est plus réaliste. Je regarde ce qui se prépare hors marché et je reviens vers vous vendredi." },
      { id: "th2-5", senderId: ENNIO, at: "2026-09-28T09:44:00Z", unread: true, text: "Vendredi. D'accord." },
    ],
  },
  /* Bernard ↔ Nikola — les photos de la maison de Pully, en juillet (le
     reportage est au journal, `sv-nik-pully`). Stade : terminé. Bernard écrit
     à l'ancienne, avec quelques fautes ; Nikola court, sans accents. */
  {
    id: "th-bernard-nikola",
    memberIds: [BERNARD, NIKOLA],
    subject: { kind: "property", id: "prop3" },
    messages: [
      { id: "th3-1", senderId: BERNARD, at: "2026-07-06T14:00:00Z", text: "Bonjour Monsieur, Madame Bovard m'a donné votre nom. Je vend ma maison à Pully et il me faudrait des photos convenables. Quels sont vos tarifs ? Avec mes salutations, B. Chappuis" },
      { id: "th3-2", senderId: NIKOLA, at: "2026-07-06T15:12:00Z", text: "bonjour, photos + drone 590.- tout compris. dispo mardi matin si soleil" },
      { id: "th3-3", senderId: BERNARD, at: "2026-07-06T16:30:00Z", text: "Mardi matin c'est entendu. Faut-il que je range le jardin avant votre venue ?" },
      { id: "th3-4", senderId: NIKOLA, at: "2026-07-06T16:41:00Z", text: "oui svp + ouvrez tous les volets. a mardi" },
      { id: "th3-5", senderId: NIKOLA, at: "2026-07-10T09:05:00Z", text: "photos dispo, lien envoye par mail. 32 photos + 6 drone" },
      { id: "th3-6", senderId: BERNARD, at: "2026-07-10T19:20:00Z", text: "Je les ai bien reçues. Elles sont superbes, ma femme aurait été contente de voir la maison comme ça. Merci jeune homme." },
    ],
  },
  /* Mirjana ↔ Amina — une question sur la formation de pricing dynamique.
     Mirjana parle saison et taux d'occupation ; Amina reste concrète. */
  {
    id: "th-mirjana-amina",
    memberIds: [MIRJANA, AMINA],
    messages: [
      { id: "th4-1", senderId: MIRJANA, at: "2026-09-25T17:00:00Z", text: "Bonjour Amina, j'ai fini le module 4. Question concrète : pendant le Montreux Jazz, je monte mon 2 pièces à 260 la nuit, ou je reste à 220 et je vise 100 % d'occupation ?" },
      { id: "th4-2", senderId: AMINA, at: "2026-09-25T19:30:00Z", text: "Bonjour Mirjana ! Regardez d'abord votre délai de réservation l'an dernier : si tout était pris trois mois avant, vous étiez trop basse. Je monterais à 250, avec un minimum de trois nuits les week-ends du festival." },
      { id: "th4-3", senderId: MIRJANA, at: "2026-09-26T06:50:00Z", unread: true, text: "Tout était pris en avril. Donc trop basse. Je teste 250 et 3 nuits, je vous dis en juillet." },
    ],
  },
  /* Aline ↔ Jean-Luc — interne à Hartmann Immobilier SA : le bien de Bulle
     amené par Yves Mottiez (prime biens, Suisse). */
  {
    id: "th-aline-jeanluc",
    memberIds: [ALINE, JEANLUC],
    subject: { kind: "property", id: "prop20" },
    messages: [
      { id: "th5-1", senderId: JEANLUC, at: "2026-09-29T06:05:00Z", text: "Aline, la maison de Bulle amenée par M. Mottiez : pouvez-vous organiser l'estimation cette semaine ?" },
      { id: "th5-2", senderId: ALINE, at: "2026-09-29T06:40:00Z", text: "Bonjour Jean-Luc, c'est calé jeudi à 14 h avec le propriétaire. Je réserve Nikola pour les photos dès que le mandat est signé." },
      { id: "th5-3", senderId: JEANLUC, at: "2026-09-29T07:02:00Z", text: "Parfait. Pensez à confirmer sa prime à M. Mottiez dès que la mise en relation est acceptée." },
      { id: "th5-4", senderId: ALINE, at: "2026-09-29T07:10:00Z", text: "C'est noté, je lui écris aujourd'hui." },
    ],
  },
  /* Clémence ↔ Céline — un café. Clémence doute ; Céline propose sans
     pousser. */
  {
    id: "th-clemence-celine",
    memberIds: [CLEMENCE, CELINE],
    messages: [
      { id: "th6-1", senderId: CELINE, at: "2026-09-26T08:00:00Z", text: "Bonjour Clémence, j'ai lu votre question dans le fil. Si cela peut vous aider, je vous offre un café à Morges pour en parler, sans engagement." },
      { id: "th6-2", senderId: CLEMENCE, at: "2026-09-26T10:25:00Z", text: "Oh merci, c'est gentil… Je ne veux pas vous faire perdre votre temps, je ne suis même pas sûre d'acheter cette année." },
      { id: "th6-3", senderId: CELINE, at: "2026-09-26T10:40:00Z", text: "C'est justement le bon moment pour en parler, avant de chercher. Samedi 10 h, au bord du lac ?" },
      { id: "th6-4", senderId: CLEMENCE, at: "2026-09-26T12:15:00Z", unread: true, text: "D'accord pour samedi. Je prépare mes questions (il y en a beaucoup)." },
    ],
  },
  /* Les autres fils de Léo : son photographe, sa formatrice, une agente qui
     lui envoie une cliente, une hôte voisine. */
  {
    id: "th-leo-nikola",
    memberIds: [LEO, NIKOLA],
    subject: { kind: "property", id: "prop9" },
    messages: [
      { id: "th7-1", senderId: LEO, at: "2026-09-25T10:00:00Z", text: "Salut Nikola, tu serais disponible pour refaire les photos du studio de Sous-Gare ? J'ai changé le canapé." },
      { id: "th7-2", senderId: NIKOLA, at: "2026-09-25T10:31:00Z", text: "yes dispo mardi ou jeudi aprem. meme prix que la derniere fois" },
      { id: "th7-3", senderId: NIKOLA, at: "2026-09-26T06:05:00Z", unread: true, text: "jeudi 14h ca joue?" },
    ],
  },
  {
    id: "th-leo-sandrine",
    memberIds: [LEO, SANDRINE],
    messages: [
      { id: "th8-1", senderId: LEO, at: "2026-09-20T07:00:00Z", text: "Bonjour Sandrine, merci pour la formation. Une question : la location de mon studio de Genève se déclare dans le canton de Genève ou dans le canton de Vaud ?" },
      { id: "th8-2", senderId: SANDRINE, at: "2026-09-20T12:20:00Z", text: "Bonjour Léo, bonne question. Le revenu d'un immeuble est imposé dans le canton où il se trouve : Genève, donc. Vaud en tient compte pour fixer le taux de votre revenu global. C'est le module 3, leçon 2." },
    ],
  },
  {
    id: "th-leo-celine",
    memberIds: [LEO, CELINE],
    subject: { kind: "property", id: "prop9" },
    messages: [
      { id: "th9-1", senderId: CELINE, at: "2026-09-18T08:00:00Z", text: "Bonjour Léo ! Une cliente cherche un logement pour trois semaines à Lausanne pendant les travaux de sa maison. Votre studio de Sous-Gare serait libre en novembre ?" },
      { id: "th9-2", senderId: LEO, at: "2026-09-18T09:15:00Z", text: "Bonjour Céline, du 3 au 24 novembre, oui. Je vous envoie le lien de la fiche, elle peut réserver directement." },
    ],
  },
  {
    id: "th-leo-mirjana",
    memberIds: [LEO, MIRJANA],
    messages: [
      { id: "th10-1", senderId: MIRJANA, at: "2026-09-15T14:40:00Z", text: "Léo, tu as baissé ton prix à Verbier pour octobre ? Chez moi à Montreux, -15 % en semaine et les réservations sont revenues." },
      { id: "th10-2", senderId: LEO, at: "2026-09-15T15:05:00Z", text: "Pas encore. J'applique ce qu'Amina explique dans sa formation et je te dis." },
    ],
  },
  /* Un groupe : trois hôtes qui parlent prix d'automne. */
  {
    id: "th-group-pricing",
    memberIds: [LEO, MIRJANA, AMINA],
    name: "Pricing courte durée — automne",
    avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop",
    messages: [
      { id: "th11-1", senderId: AMINA, at: "2026-09-27T09:00:00Z", text: "Bonjour à tous ! On fait le point sur vos prix d'octobre et de novembre vendredi ?" },
      { id: "th11-2", senderId: LEO, at: "2026-09-27T09:20:00Z", text: "Présent. J'apporte mes chiffres de Verbier." },
      { id: "th11-3", senderId: MIRJANA, at: "2026-09-27T10:05:00Z", unread: true, text: "Moi aussi. Montreux : 61 % d'occupation en septembre, c'est bas pour la saison." },
    ],
  },
];

/* ── Les notifications ──────────────────────────────────────────────────── */

/* L'avis le plus récent reçu par Léo, pris dans les avis réels. */
const latestReviewOfLeo = [...mockReviews]
  .filter((r) => r.recipientId === LEO)
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

const reviewNotification: NotificationSeed[] = latestReviewOfLeo
  ? [
      {
        id: "nt-review-leo",
        recipientId: LEO,
        type: "review",
        actorId: latestReviewOfLeo.author.id,
        title: `${nameOf(latestReviewOfLeo.author.id)} vous a laissé un avis`,
        message: `${latestReviewOfLeo.rating}/5 · « ${latestReviewOfLeo.comment.slice(0, 90)}${latestReviewOfLeo.comment.length > 90 ? "…" : ""} »`,
        at: latestReviewOfLeo.createdAt,
        href: "/dashboard/avis",
        read: true,
      },
    ]
  : [];

export const NOTIFICATION_SEEDS: NotificationSeed[] = [
  /* Pour Léo : chaque notification renvoie à ce qu'elle annonce. */
  {
    id: "nt-ana-msg",
    recipientId: LEO,
    type: "message",
    actorId: ANA,
    title: `${nameOf(ANA)} vous a écrit`,
    message: "« Cette formule officielle, je dois la signer ou seulement la garder ? »",
    at: "2026-09-29T18:41:00Z",
    href: `/messages?to=${ANA}`,
    read: false,
  },
  {
    id: "nt-ana-dossier",
    recipientId: LEO,
    type: "system",
    actorId: ANA,
    title: "Dossier de candidature reçu",
    message: `${nameOf(ANA)} · ${title("prop8")}`,
    at: "2026-09-29T18:40:00Z",
    href: "/explorer/prop8",
    read: false,
  },
  {
    id: "nt-nikola-msg",
    recipientId: LEO,
    type: "message",
    actorId: NIKOLA,
    title: `${nameOf(NIKOLA)} vous a écrit`,
    message: "« jeudi 14h ca joue? »",
    at: "2026-09-26T06:05:00Z",
    href: `/messages?to=${NIKOLA}`,
    read: false,
  },
  {
    id: "nt-group-msg",
    recipientId: LEO,
    type: "message",
    actorId: MIRJANA,
    title: "Pricing courte durée — automne",
    message: `${nameOf(MIRJANA)} : « 61 % d'occupation en septembre, c'est bas pour la saison. »`,
    at: "2026-09-27T10:05:00Z",
    href: "/messages?conv=th-group-pricing",
    read: false,
  },
  {
    id: "nt-clemence-follow",
    recipientId: LEO,
    type: "follow",
    actorId: CLEMENCE,
    title: `${nameOf(CLEMENCE)} vous suit`,
    message: "Premier achat à Morges. Elle suit vos publications sur le pôle biens.",
    at: "2026-09-22T19:00:00Z",
    href: `/profil/${CLEMENCE}`,
    read: true,
  },
  ...reviewNotification,
  {
    id: "nt-verif-leo",
    recipientId: LEO,
    type: "system",
    title: "Identité vérifiée",
    message: "Votre pièce d'identité a été vérifiée. Votre profil affiche le badge « vérifié ».",
    at: "2026-09-02T09:00:00Z",
    href: "/profil",
    read: true,
  },

  /* Pour les autres membres du casting — visibles quand on les incarnera (P3). */
  {
    id: "nt-celine-clemence",
    recipientId: CELINE,
    type: "message",
    actorId: CLEMENCE,
    title: `${nameOf(CLEMENCE)} vous a écrit`,
    message: "« D'accord pour samedi. Je prépare mes questions. »",
    at: "2026-09-26T12:15:00Z",
    href: `/messages?to=${CLEMENCE}`,
    read: false,
  },
  {
    id: "nt-celine-ennio",
    recipientId: CELINE,
    type: "message",
    actorId: ENNIO,
    title: `${nameOf(ENNIO)} vous a écrit`,
    message: "« Vendredi. D'accord. »",
    at: "2026-09-28T09:44:00Z",
    href: `/messages?to=${ENNIO}`,
    read: false,
  },
  {
    id: "nt-amina-mirjana",
    recipientId: AMINA,
    type: "message",
    actorId: MIRJANA,
    title: `${nameOf(MIRJANA)} vous a écrit`,
    message: "« Je teste 250 et 3 nuits, je vous dis en juillet. »",
    at: "2026-09-26T06:50:00Z",
    href: `/messages?to=${MIRJANA}`,
    read: false,
  },
  {
    id: "nt-leo-ana-visit",
    recipientId: ANA,
    type: "reservation",
    actorId: LEO,
    title: "Visite confirmée",
    message: `${title("prop8")} · samedi 26 septembre, 11 h`,
    at: "2026-09-24T17:02:00Z",
    href: "/explorer/prop8",
    read: true,
  },
];
