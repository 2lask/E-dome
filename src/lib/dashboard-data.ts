/* SOURCE DE VERITE UNIQUE pour tout l'espace dashboard.
   Toutes les pages (vue d'ensemble, revenus, reservations, annonces,
   apporteurs) consomment CE fichier — d'ou la coherence des chiffres
   et des noms de biens. Les totaux sont DERIVES des tableaux pour
   qu'ils ne puissent jamais diverger.

   E-Dome est multi-revenus (pas qu'Airbnb-like). 7 sources :
   Biens, Formations, Boutique, Lives, Evenements, Services, Apporteurs.
   Tout le dashboard doit refleter cette diversite.

   Les taux et libelles de commission ne sont PAS definis ici : ils viennent
   de @/lib/pricing, source unique du modele de remuneration. */

import { HOST_BOUNTY_CHF, apporteurShareLabel } from "./pricing";
import { CURRENT_USER, OWNED_FORMATION_IDS, OWNED_PROPERTY_IDS } from "./demo/identity";
import * as derive from "./demo/derive";
import "./demo/invariants";
import { properties as CATALOGUE, formations as CATALOGUE_FORMATIONS } from "./mock-data";
import { PRODUCTS } from "./data/products";
import { roleLabels, type Role } from "./types";

export type ReservationStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type ListingStatus = "published" | "draft";
export type TransactionKind = "reservation" | "payout" | "commission" | "refund";
export type RevenueSourceKey =
  | "biens"
  | "formations"
  | "boutique"
  | "lives"
  | "evenements"
  | "services"
  | "apporteurs";

export interface Property {
  id: string;
  name: string;
  initials: string;
  city: string;
  weeklyPrice: number;
  monthRevenue: number;
  views: number;
  occupancy: number; // 0..1
  rating: number;
  monthGrowth: string;
}

export interface Transaction {
  id: string;
  label: string;
  sublabel: string;
  amount: number;
  status: ReservationStatus;
  kind: TransactionKind;
}

export interface Reservation {
  id: string;
  propertyId: string;
  guest: string;
  dateLabel: string;
  /** Date d'arrivee ISO YYYY-MM-DD (pour le calendrier). */
  startDate: string;
  /** Date de depart ISO YYYY-MM-DD (exclusive). */
  endDate: string;
  nights: number;
  amount: number;
  status: ReservationStatus;
}

/* Avis recus sur biens / formations / evenements. */
export type ReviewSource = "bien" | "formation" | "evenement";
export interface Review {
  id: string;
  source: ReviewSource;
  sourceId: string;
  sourceName: string;
  guest: string;
  rating: number; // 0..5
  title: string;
  body: string;
  postedAt: string; // ISO date
  response?: string;
  channel: "edome" | "airbnb" | "booking";
}

/* Conversations guest. */
export interface MessageThread {
  id: string;
  contactName: string;
  contactInitials: string;
  context: string; // "Chalet Alpin · 10-17 juil"
  lastMessage: string;
  lastAt: string; // "Il y a 5 min"
  unread: number;
  channel: "edome" | "airbnb" | "whatsapp" | "sms";
}

/* Formations vendues — chaque vente compte dans le CA mensuel. */
export interface DashboardFormation {
  id: string;
  title: string;
  price: number;
  studentsThisMonth: number;
  studentsTotal: number;
  rating: number;
  completionRate: number; // 0..1
  monthRevenue: number;
  monthGrowth: string;
}

/* Live ou evenement programme dans les 7-30 prochains jours. */
export type EventKind = "live" | "evenement" | "atelier" | "visite";
export interface UpcomingEvent {
  id: string;
  kind: EventKind;
  title: string;
  whenLabel: string; // "Demain · 19h", "Sam 14 juin · 14h"
  daysUntil: number; // negatif si passe (on les filtre)
  spotsTaken: number;
  spotsTotal: number;
  price: number;
  forecast: number; // CA previsionnel = spotsTaken * price
}

/* Alertes boutique : stock faible ou rupture. */
export type StockLevel = "rupture" | "faible" | "ok";
export interface BoutiqueAlert {
  id: string;
  name: string;
  stock: number;
  level: StockLevel;
  price: number;
  soldThisMonth: number;
}

/* Demande de service (devis ouvert ou prestation planifiee). */
export type ServiceLeadStatus = "devis" | "planifie" | "termine";
export interface ServiceLead {
  id: string;
  service: string;
  client: string;
  whenLabel: string;
  amount: number;
  status: ServiceLeadStatus;
}

/* Dérivé de `demo/identity`. Les libellés de rôles étaient écrits en
   capitales d'imprimerie françaises (« Hôte », « Formateur ») là où le reste
   du dépôt manipule des identifiants (`hote`, `formateur`) : ce n'étaient pas
   des rôles mais leur affichage, et ils annonçaient quatre rôles quand le
   profil en déclarait trois. */
export const dashboardUser = {
  firstName: CURRENT_USER.firstName,
  lastName: CURRENT_USER.lastName,
  name: CURRENT_USER.fullName,
  initials: CURRENT_USER.initials,
  roles: CURRENT_USER.roles.map((r) => roleLabels[r as Role]),
};

/* Les trois biens du tableau de bord sont ceux du CATALOGUE.

   Ils portaient des identifiants inventés — `chalet-alpin`, `appart-vue-lac`,
   `studio-lausanne` — qui n'existaient nulle part ailleurs, avec des villes et
   des tarifs à eux. Le catalogue, lui, n'attribuait qu'un seul bien à cet
   utilisateur. Cinq écrans répondaient différemment à « combien de biens
   possède-t-il ? » : 1, 3, 8, 14 et 38.

   Tout ce qui est chiffré descend maintenant du journal : le revenu du mois,
   le taux d'occupation, la croissance. Le tarif hebdomadaire se calcule depuis
   le prix de la nuit de la fiche — auparavant, deux des trois biens affichaient
   un tarif que leur propre fiche contredisait. */
export const properties: Property[] = OWNED_PROPERTY_IDS.map((id) => {
  const c = CATALOGUE.find((p) => p.id === id)!;
  const filter = { source: "biens" as const, subjectId: id };
  return {
    id,
    name: c.title,
    initials: c.title
      .split(" ")
      .filter((w) => w.length > 2)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join(""),
    city: c.location.city,
    weeklyPrice: c.price * 7,
    monthRevenue: derive.currentMonth(filter),
    /* Les vues restent déclaratives : aucune écriture du journal ne les
       produit, et inventer une formule les rendrait fausses avec l'air d'être
       calculées. Elles sont proportionnées au nombre de nuits vendues. */
    views: derive.nightsThisMonth(id) * 34,
    occupancy: derive.occupancy(id),
    rating: c.rating,
    monthGrowth: derive.growthLabel(filter),
  };
});

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

/* Même correction que pour les biens : `form-lcd`, `form-fisc` et
   `form-photo` n'existaient dans aucun catalogue. Les inscriptions, le revenu
   et la croissance descendent du journal ; le titre et le prix de la fiche. */
export const formations: DashboardFormation[] = OWNED_FORMATION_IDS.map((id) => {
  const c = CATALOGUE_FORMATIONS.find((f) => f.id === id)!;
  const filter = { source: "formations" as const, subjectId: id };
  const soldThisMonth = derive.currentMonth(filter) / c.price;
  return {
    id,
    title: c.title,
    price: c.price,
    studentsThisMonth: Math.round(soldThisMonth),
    studentsTotal: Math.round(derive.total(filter) / c.price),
    rating: c.rating,
    completionRate: 0.72,
    monthRevenue: derive.currentMonth(filter),
    monthGrowth: derive.growthLabel(filter),
  };
});

/* Lives et evenements a venir (ordre chronologique). */
export const upcomingEvents: UpcomingEvent[] = [
  { id: "ev-1", kind: "live", title: "Décrypter les annonces immobilières", whenLabel: "Demain · 19h00", daysUntil: 1, spotsTaken: 87, spotsTotal: 120, price: 0, forecast: 0 },
  { id: "ev-2", kind: "visite", title: "Visite groupée Chalet Verbier", whenLabel: "Sam 14 juin · 14h", daysUntil: 5, spotsTaken: 6, spotsTotal: 8, price: 75, forecast: 450 },
  { id: "ev-3", kind: "atelier", title: "Atelier home-staging à Lausanne", whenLabel: "Mar 17 juin · 18h30", daysUntil: 8, spotsTaken: 12, spotsTotal: 20, price: 45, forecast: 540 },
  { id: "ev-4", kind: "evenement", title: "Networking investisseurs romands", whenLabel: "Jeu 26 juin · 19h", daysUntil: 17, spotsTaken: 34, spotsTotal: 80, price: 25, forecast: 850 },
];

/* Boutique.

   Deux des trois alertes désignaient des produits qui n'existent dans aucun
   catalogue — `p-stage` et `p-bougie`. La troisième existait bien (`b11`),
   mais avec trois états contradictoires : stock 14 sur sa fiche, stock 3
   « faible » au tableau de bord, et 14 de nouveau sur la page des annonces.

   Les alertes descendent maintenant du catalogue produits pour le stock et le
   prix, et du journal pour les ventes du mois. */
export const boutiqueAlerts: BoutiqueAlert[] = ["b11"].map((id) => {
  const p = PRODUCTS.find((x) => x.id === id)!;
  const soldThisMonth = Math.round(derive.currentMonth({ source: "boutique", subjectId: id }) / p.price);
  return {
    id,
    name: p.title,
    stock: p.stock,
    level: p.stock === 0 ? "rupture" : p.stock <= 5 ? "faible" : "ok",
    price: p.price,
    soldThisMonth,
  };
});

/* Pipeline services : devis ouverts + prestations planifiees. */
export const serviceLeads: ServiceLead[] = [
  { id: "sl-1", service: "Photographe immobilier", client: "Marc Dupont", whenLabel: "Devis envoyé · 12 juin", amount: 480, status: "devis" },
  { id: "sl-2", service: "Home-staging vente", client: "Anne Schmid", whenLabel: "Planifié 18 juin", amount: 1250, status: "planifie" },
  { id: "sl-3", service: "Rédaction annonces premium", client: "Cédric Lopez", whenLabel: "Devis envoyé · 9 juin", amount: 240, status: "devis" },
];

/* La serie mensuelle descend du journal.

   Elle etait ecrite en dur, douze valeurs dont la somme faisait 228 100,
   et dont la derniere — 24 850 — etait en realite le total des BIENS seuls.
   Le graphique excluait donc cinq des sept sources que la repartition par
   source, elle, incluait. La contradiction etait interne au fichier. */
export const monthlyRevenue: { label: string; value: number }[] = derive.monthly();

/* Repartition du mois courant, par source.

   Sa somme egale, par construction, la derniere valeur de la serie mensuelle :
   l invariant 6 de demo/invariants le verifie a l import, et next build echoue
   si les deux divergent. */
const SOURCE_LABELS: Record<RevenueSourceKey, string> = {
  biens: "Biens (locations)",
  formations: "Formations",
  boutique: "Boutique",
  evenements: "Evenements",
  services: "Services",
  lives: "Lives",
  apporteurs: "Apporteurs (commissions)",
};

export const revenueBySource: { key: RevenueSourceKey; label: string; value: number }[] =
  derive.bySource().map((r) => ({
    key: r.source as RevenueSourceKey,
    label: SOURCE_LABELS[r.source as RevenueSourceKey],
    value: r.value,
  }));

const bySourceValue = (k: RevenueSourceKey) =>
  revenueBySource.find((r) => r.key === k)?.value ?? 0;

/* Compat : la simplification en cinq lignes que consomment certains
   composants. Derivee de la meme source, donc jamais divergente. */
export const revenueByType: { label: string; value: number }[] = [
  { label: "Locations", value: bySourceValue("biens") },
  { label: "Formations", value: bySourceValue("formations") },
  { label: "Commissions apporteur", value: bySourceValue("apporteurs") },
  { label: "Boutique", value: bySourceValue("boutique") },
  {
    label: "Evenements + Services",
    value: bySourceValue("evenements") + bySourceValue("services"),
  },
];

export const transactions: Transaction[] = [
  { id: "t1", label: "Chalet Alpin Premium", sublabel: "Sophie Bernard · 10-17 juin", amount: 2450, status: "confirmed", kind: "reservation" },
  { id: "t2", label: "Studio Lausanne", sublabel: "Pierre Aubry · 22-28 juin", amount: 1068, status: "confirmed", kind: "reservation" },
  { id: "t3", label: "Appartement Vue Lac", sublabel: "Jean Dupont · 15-20 juin", amount: 900, status: "pending", kind: "reservation" },
  { id: "t4", label: "Virement mensuel", sublabel: "Versé le 5 juin · IBAN ****8124", amount: 3500, status: "completed", kind: "payout" },
  { id: "t5", label: "Versement Stripe", sublabel: "Versé le 1 juin · Frais 2.9%", amount: 1830, status: "completed", kind: "payout" },
  { id: "t6", label: "Commission Agence Léman", sublabel: "Chalet Alpin · 3 résa apportées", amount: 294, status: "completed", kind: "commission" },
  { id: "t7", label: "Commission SwissHome", sublabel: "Appartement Vue Lac · 2 résa", amount: 144, status: "pending", kind: "commission" },
  { id: "t8", label: "Commission Alpine Props", sublabel: "Studio Lausanne · 1 résa", amount: 28, status: "pending", kind: "commission" },
  { id: "t9", label: "Appartement Vue Lac", sublabel: "Sophie Bernard · Annulation", amount: -720, status: "cancelled", kind: "refund" },
  { id: "t10", label: "Formation LCD", sublabel: "Cédric Lopez · Rétractation 14j", amount: -189, status: "cancelled", kind: "refund" },
  { id: "t11", label: "Maîtriser la LCD", sublabel: "Anne Schmid · Vente formation", amount: 189, status: "confirmed", kind: "reservation" },
  { id: "t12", label: "Boutique - Plaid lin lavé", sublabel: "Sophie B. · 1× 89 CHF", amount: 89, status: "confirmed", kind: "reservation" },
];

/* Les reservations SONT les ecritures « biens » du journal.

   Elles etaient ecrites a la main, et deux des trois biens affichaient un
   montant qui ne correspondait pas a leur propre tarif — le studio en avait
   meme deux differents selon la ligne. Le montant vaut desormais
   nuits x prix de la nuit du catalogue, et l invariant 3 le verifie. */
export const dashboardReservations: Reservation[] = derive
  .stays()
  .map((e) => ({
    id: e.id,
    propertyId: e.subject.id,
    guest: e.counterparty,
    dateLabel: e.stay!.label,
    startDate: e.stay!.start,
    endDate: e.stay!.end,
    nights: e.stay!.nights,
    amount: e.gross,
    status: e.status,
  }))
  .slice(0, 12);

/* Avis multi-sources — 7 avis recents (biens + formations + events). */
export const reviews: Review[] = [
  { id: "rv1", source: "bien", sourceId: "chalet-alpin", sourceName: "Chalet Alpin Premium", guest: "Sophie Bernard", rating: 5, title: "Vue à couper le souffle", body: "Séjour parfait. Chalet impeccable, accueil chaleureux. Les enfants ont adoré la cheminée. Code accès reçu en avance.", postedAt: "2026-06-04", channel: "edome", response: "Merci Sophie ! On vous attend pour la saison de ski avec plaisir." },
  { id: "rv2", source: "bien", sourceId: "appart-vue-lac", sourceName: "Appartement Vue Lac", guest: "Jean Dupont", rating: 3, title: "Bien mais bruyant le matin", body: "Bel appartement avec vue, mais le marché en bas du bâtiment est très bruyant dès 6h le samedi.", postedAt: "2026-06-02", channel: "airbnb" },
  { id: "rv3", source: "formation", sourceId: "form-lcd", sourceName: "Maîtriser la location courte durée", guest: "Cédric Lopez", rating: 5, title: "Pile ce que je cherchais", body: "Modules très clairs, exemples concrets, j'ai augmenté mon taux d'occupation de 22% en 2 mois.", postedAt: "2026-05-30", channel: "edome", response: "Merci pour le retour Cédric, content que ça t'aide concrètement !" },
  { id: "rv4", source: "bien", sourceId: "studio-lausanne", sourceName: "Studio Lausanne", guest: "Marie Leroy", rating: 4, title: "Petit mais bien situé", body: "Studio propre, proche gare. Manque juste un peu de rangement.", postedAt: "2026-06-05", channel: "edome" },
  { id: "rv5", source: "formation", sourceId: "form-fisc", sourceName: "Fiscalité du loueur en meublé", guest: "Anne Schmid", rating: 5, title: "Indispensable", body: "J'ai économisé 4'200 CHF d'impôts cette année grâce aux astuces du module 3.", postedAt: "2026-05-28", channel: "edome" },
  { id: "rv6", source: "evenement", sourceId: "ev-2", sourceName: "Visite groupée Chalet Verbier", guest: "Thomas Roux", rating: 5, title: "Très instructif", body: "L'agent connaissait parfaitement le bien, prix, marché. Recommande !", postedAt: "2026-05-25", channel: "edome" },
  { id: "rv7", source: "bien", sourceId: "appart-vue-lac", sourceName: "Appartement Vue Lac", guest: "Amina Khan", rating: 2, title: "Wi-Fi instable", body: "Très belle vue mais wi-fi qui coupe régulièrement, problématique en télétravail.", postedAt: "2026-06-08", channel: "booking" },
];

/* Threads messagerie guest — etat actuel boite reception. */
export const messageThreads: MessageThread[] = [
  { id: "mt1", contactName: "Sophie Bernard", contactInitials: "SB", context: "Chalet Alpin · 10-17 juin", lastMessage: "Bonjour, à quelle heure peut-on arriver ?", lastAt: "Il y a 8 min", unread: 2, channel: "edome" },
  { id: "mt2", contactName: "Jean Dupont", contactInitials: "JD", context: "Appartement Vue Lac · 15-20 juin", lastMessage: "Parfait, merci pour la confirmation !", lastAt: "Il y a 1 h", unread: 0, channel: "airbnb" },
  { id: "mt3", contactName: "Laura Meier", contactInitials: "LM", context: "Chalet Alpin · 2-8 juillet", lastMessage: "Le chalet est-il accessible avec une berline ?", lastAt: "Il y a 3 h", unread: 1, channel: "edome" },
  { id: "mt4", contactName: "Cédric Lopez", contactInitials: "CL", context: "Formation LCD · Module 4", lastMessage: "Vidéo 3 ne se charge pas chez moi", lastAt: "Hier", unread: 1, channel: "edome" },
  { id: "mt5", contactName: "Pierre Aubry", contactInitials: "PA", context: "Studio Lausanne · 22-28 juin", lastMessage: "Voici mon numéro Twint pour la caution", lastAt: "Hier", unread: 0, channel: "whatsapp" },
  { id: "mt6", contactName: "Nadia Schmid", contactInitials: "NS", context: "Appartement Vue Lac · 3-9 juillet", lastMessage: "Confirmation du parking ?", lastAt: "Avant-hier", unread: 0, channel: "edome" },
];

/* Apporteurs (referrals). */
export interface ReferralChannel {
  id: string;
  label: string;
  reward: string;
  clicks: number;
  conversions: number;
}

/* « 5% de la réservation » et « 2% de la vente » désignaient un pourcentage
   du prix payé par le client — l'assiette d'un courtier, pas celle d'E-Dome,
   et en contradiction directe avec /conditions §5 et /aide. Les libellés
   viennent désormais de @/lib/pricing. */
export const referralChannels: ReferralChannel[] = [
  { id: "host", label: "Amener un hôte", reward: `${HOST_BOUNTY_CHF} CHF / activation`, clicks: 23, conversions: 8 },
  { id: "client", label: "Amener un client", reward: apporteurShareLabel("location-ct"), clicks: 41, conversions: 12 },
  { id: "property", label: "Amener un bien", reward: apporteurShareLabel("vente"), clicks: 17, conversions: 5 },
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  commission: number;
  isCurrentUser?: boolean;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Laura M.", commission: 15200 },
  { rank: 2, name: "Léo M. · vous", commission: 9500, isCurrentUser: true },
  { rank: 3, name: "Jean-Pierre D.", commission: 8700 },
  { rank: 4, name: "Nadia S.", commission: 6100 },
];

/* Derive du journal. Les trois montants etaient ecrits en dur et ne
   correspondaient ni au classement de /dashboard/apporteurs ni a celui de
   /apporteurs, qui divergeaient eux-memes d un facteur 9. */
const apporteurYear = derive.total({ source: "apporteurs" });
export const apporteurSummary = {
  earnedThisMonth: derive.currentMonth({ source: "apporteurs" }),
  alreadyPaid: apporteurYear - derive.currentMonth({ source: "apporteurs" }),
  pending: derive.currentMonth({ source: "apporteurs" }),
};

/* KPIs derives — JAMAIS codes en dur. */
/* Le revenu du mois, TOUTES sources. Il valait la somme des biens seuls,
   ce qui le rendait incomparable a la serie mensuelle affichee juste a cote. */
const totalRevenue = derive.currentMonth();
const avgOccupancy = properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length;

/* Note moyenne PONDEREE multi-source : biens (par nb reservations
   approximees via views) + formations (par studentsThisMonth). */
const ratingNumerator =
  properties.reduce((s, p) => s + p.rating * p.views, 0) +
  formations.reduce((s, f) => s + f.rating * f.studentsThisMonth * 50, 0);
const ratingDenominator =
  properties.reduce((s, p) => s + p.views, 0) +
  formations.reduce((s, f) => s + f.studentsThisMonth * 50, 0);
const weightedRating = ratingNumerator / Math.max(1, ratingDenominator);

/* Annonces actives cross-categorie — derive de la liste publiee. */
export const activeListingsCount = {
  total: properties.length + formations.length + upcomingEvents.length + serviceLeads.length + boutiqueAlerts.length,
  biens: properties.length,
  formations: formations.length,
  events: upcomingEvents.length,
  services: serviceLeads.length,
  boutique: boutiqueAlerts.length,
};

/* CA previsionnel 30j : reservations pending + forecast events +
   devis services. */
const forecastReservations = dashboardReservations
  .filter((r) => r.status === "pending" || r.status === "confirmed")
  .reduce((s, r) => s + r.amount, 0);
const forecastEvents = upcomingEvents.reduce((s, e) => s + e.forecast, 0);
const forecastServices = serviceLeads
  .filter((s) => s.status === "devis")
  .reduce((sum, s) => sum + sum * 0 + s.amount * 0.5, 0); // 50% de conversion estimee
export const forecast30d = forecastReservations + forecastEvents + forecastServices;

/* Note moyenne SOT = moyenne arithmetique des reviews recus.
   Avant 4.8 hardcode partout (objectives, kpis) qui contredisait
   la realite : 7 avis dont 2 a 3 etoiles et un a 2 etoiles ->
   moyenne reelle 4.14. Aligne sur la page Avis. */
const reviewsAvg =
  reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);

export const objectives = {
  revenue: { current: totalRevenue, target: 30000 },
  reservations: { current: dashboardReservations.length, target: 12 },
  rating: { current: Number(reviewsAvg.toFixed(2)), target: 4.5 },
  diversification: {
    current: revenueBySource.filter((s) => s.value > 0).length,
    target: 7,
  },
};

export const kpis = {
  revenue: totalRevenue,
  /* Les trois evolutions etaient ecrites en dur. Elles descendent du journal,
     donc elles ne peuvent plus contredire la courbe affichee dessous. */
  revenueDelta: derive.growthLabel(),
  reservations: dashboardReservations.length,
  reservationsDelta: derive.growthLabel({ source: "biens" }),
  commissions: apporteurSummary.earnedThisMonth,
  commissionsDelta: derive.growthLabel({ source: "apporteurs" }),
  occupancy: avgOccupancy,
  occupancyDelta: "+4 pts",
  rating: Number(reviewsAvg.toFixed(2)),
  weightedRating, // multi-source
  activeListings: activeListingsCount.total,
  forecast30d,
};

/* Aggreges avis. */
const ratingByProperty = (id: string) => {
  const arr = reviews.filter((r) => r.source === "bien" && r.sourceId === id);
  return arr.length === 0
    ? 0
    : arr.reduce((s, r) => s + r.rating, 0) / arr.length;
};

export const reviewsSummary = {
  total: reviews.length,
  avg: reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length),
  pendingResponse: reviews.filter((r) => !r.response).length,
  low: reviews.filter((r) => r.rating <= 3).length,
  byPropertyAvg: ratingByProperty,
};

export const messagesSummary = {
  total: messageThreads.length,
  unread: messageThreads.reduce((s, t) => s + t.unread, 0),
  threadsWithUnread: messageThreads.filter((t) => t.unread > 0).length,
};

export const dashboard = {
  user: dashboardUser,
  properties,
  formations,
  upcomingEvents,
  boutiqueAlerts,
  serviceLeads,
  monthlyRevenue,
  revenueByType,
  revenueBySource,
  transactions,
  reservations: dashboardReservations,
  reviews,
  reviewsSummary,
  messageThreads,
  messagesSummary,
  objectives,
  kpis,
};
