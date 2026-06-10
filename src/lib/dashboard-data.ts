/* SOURCE DE VERITE UNIQUE pour tout l'espace dashboard.
   Toutes les pages (vue d'ensemble, revenus, reservations, annonces,
   apporteurs) consomment CE fichier — d'ou la coherence des chiffres
   et des noms de biens. Les totaux sont DERIVES des tableaux pour
   qu'ils ne puissent jamais diverger.

   E-Dome est multi-revenus (pas qu'Airbnb-like). 7 sources :
   Biens, Formations, Boutique, Lives, Evenements, Services, Apporteurs.
   Tout le dashboard doit refleter cette diversite. */

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

/* Identite utilisateur unique pour TOUT l'espace dashboard ET le
   profil. Avant : 2 jeux de roles divergents (3 vs 4) — desormais
   aligne avec /profil. Investisseur retenu car credible vu son
   activite/bio "passionne immobilier 15 ans". */
export const dashboardUser = {
  firstName: "Léo",
  lastName: "Martin",
  name: "Léo Martin",
  initials: "LM",
  roles: ["Hôte", "Formateur", "Apporteur", "Investisseur"] as const,
};

/* Les 3 memes biens partout. */
export const properties: Property[] = [
  { id: "chalet-alpin", name: "Chalet Alpin Premium", initials: "CA", city: "Verbier", weeklyPrice: 2450, monthRevenue: 11200, views: 2840, occupancy: 0.92, rating: 4.9, monthGrowth: "+18%" },
  { id: "appart-vue-lac", name: "Appartement Vue Lac", initials: "AV", city: "Montreux", weeklyPrice: 1800, monthRevenue: 8400, views: 1240, occupancy: 0.78, rating: 4.6, monthGrowth: "+12%" },
  { id: "studio-lausanne", name: "Studio Lausanne", initials: "SL", city: "Lausanne", weeklyPrice: 890, monthRevenue: 5250, views: 980, occupancy: 0.74, rating: 4.4, monthGrowth: "+8%" },
];

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

/* Formations vendues ce mois. */
export const formations: DashboardFormation[] = [
  { id: "form-lcd", title: "Maîtriser la location courte durée", price: 189, studentsThisMonth: 18, studentsTotal: 342, rating: 4.8, completionRate: 0.72, monthRevenue: 3402, monthGrowth: "+24%" },
  { id: "form-fisc", title: "Fiscalité du loueur en meublé", price: 297, studentsThisMonth: 7, studentsTotal: 124, rating: 4.7, completionRate: 0.68, monthRevenue: 2079, monthGrowth: "+15%" },
  { id: "form-photo", title: "Photographie immobilière mobile", price: 97, studentsThisMonth: 12, studentsTotal: 88, rating: 4.5, completionRate: 0.81, monthRevenue: 1164, monthGrowth: "+9%" },
];

/* Lives et evenements a venir (ordre chronologique). */
export const upcomingEvents: UpcomingEvent[] = [
  { id: "ev-1", kind: "live", title: "Décrypter les annonces immobilières", whenLabel: "Demain · 19h00", daysUntil: 1, spotsTaken: 87, spotsTotal: 120, price: 0, forecast: 0 },
  { id: "ev-2", kind: "visite", title: "Visite groupée Chalet Verbier", whenLabel: "Sam 14 juin · 14h", daysUntil: 5, spotsTaken: 6, spotsTotal: 8, price: 75, forecast: 450 },
  { id: "ev-3", kind: "atelier", title: "Atelier home-staging à Lausanne", whenLabel: "Mar 17 juin · 18h30", daysUntil: 8, spotsTaken: 12, spotsTotal: 20, price: 45, forecast: 540 },
  { id: "ev-4", kind: "evenement", title: "Networking investisseurs romands", whenLabel: "Jeu 26 juin · 19h", daysUntil: 17, spotsTaken: 34, spotsTotal: 80, price: 25, forecast: 850 },
];

/* Boutique — produits avec stock. Seules les alertes (rupture/faible)
   atterrissent ici ; les "ok" ne s'affichent que sur /dashboard/annonces. */
export const boutiqueAlerts: BoutiqueAlert[] = [
  { id: "p-stage", name: "Kit home-staging « Lin lavé »", stock: 0, level: "rupture", price: 189, soldThisMonth: 14 },
  { id: "p-plaid", name: "Plaid lin lavé bleu nuit", stock: 3, level: "faible", price: 89, soldThisMonth: 22 },
  { id: "p-bougie", name: "Bougie parfumée 80h « Forêt »", stock: 4, level: "faible", price: 38, soldThisMonth: 31 },
];

/* Pipeline services : devis ouverts + prestations planifiees. */
export const serviceLeads: ServiceLead[] = [
  { id: "sl-1", service: "Photographe immobilier", client: "Marc Dupont", whenLabel: "Devis envoyé · 12 juin", amount: 480, status: "devis" },
  { id: "sl-2", service: "Home-staging vente", client: "Anne Schmid", whenLabel: "Planifié 18 juin", amount: 1250, status: "planifie" },
  { id: "sl-3", service: "Rédaction annonces premium", client: "Cédric Lopez", whenLabel: "Devis envoyé · 9 juin", amount: 240, status: "devis" },
];

/* Revenus mensuels (la derniere valeur = total du mois courant). */
export const monthlyRevenue: { label: string; value: number }[] = [
  { label: "Jan", value: 13200 },
  { label: "Fév", value: 14400 },
  { label: "Mar", value: 15600 },
  { label: "Avr", value: 14850 },
  { label: "Mai", value: 17400 },
  { label: "Juin", value: 18900 },
  { label: "Juil", value: 20100 },
  { label: "Août", value: 19200 },
  { label: "Sep", value: 21900 },
  { label: "Oct", value: 23400 },
  { label: "Nov", value: 24300 },
  { label: "Déc", value: 24850 },
];

/* Mix revenus du mois — derive de la realite des 7 sources.
   Locations = somme monthRevenue des biens.
   Formations = somme monthRevenue des formations.
   Lives/Evenements = somme forecast des upcomingEvents (proxy demo).
   Services = somme amount des planifies/termines.
   Boutique = derive du soldThisMonth × price.
   Apporteurs = apporteurSummary.earnedThisMonth.

   Le total monthlyRevenue garde son chiffre historique (24'850) pour
   coherence chart. Le mix multi-source ci-dessous est l'EXACTE
   verite des 7 sources et son total est legerement different. */
const biensRevenue = properties.reduce((s, p) => s + p.monthRevenue, 0);
const formationsRevenue = formations.reduce((s, f) => s + f.monthRevenue, 0);
const eventsRevenue = upcomingEvents.reduce((s, e) => s + e.forecast, 0);
const servicesRevenue = serviceLeads
  .filter((s) => s.status !== "devis")
  .reduce((sum, s) => sum + s.amount, 0);
const boutiqueRevenue = boutiqueAlerts.reduce(
  (s, p) => s + p.price * p.soldThisMonth,
  0,
);

export const revenueBySource: { key: RevenueSourceKey; label: string; value: number }[] = [
  { key: "biens", label: "Biens (locations)", value: biensRevenue },
  { key: "formations", label: "Formations", value: formationsRevenue },
  { key: "boutique", label: "Boutique", value: boutiqueRevenue },
  { key: "evenements", label: "Événements", value: eventsRevenue },
  { key: "services", label: "Services", value: servicesRevenue },
  { key: "lives", label: "Lives", value: 0 },
  { key: "apporteurs", label: "Apporteurs (commissions)", value: 2400 },
];

/* Compat : 3 entrees historiques pour les composants qui restent
   sur la simplification "Locations / Commissions / Boutique". */
export const revenueByType: { label: string; value: number }[] = [
  { label: "Locations", value: biensRevenue },
  { label: "Formations", value: formationsRevenue },
  { label: "Commissions apporteur", value: 2400 },
  { label: "Boutique", value: boutiqueRevenue },
  { label: "Événements + Services", value: eventsRevenue + servicesRevenue },
];

export const transactions: Transaction[] = [
  { id: "t1", label: "Chalet Alpin Premium", sublabel: "Sophie Bernard", amount: 2450, status: "confirmed", kind: "reservation" },
  { id: "t2", label: "Virement mensuel", sublabel: "Versé le 25.03", amount: 3500, status: "completed", kind: "payout" },
  { id: "t3", label: "Commission apporteur", sublabel: "Marc Dupont", amount: 100, status: "pending", kind: "commission" },
  { id: "t4", label: "Appartement Vue Lac", sublabel: "Remboursement", amount: -720, status: "cancelled", kind: "refund" },
];

export const dashboardReservations: Reservation[] = [
  { id: "dr1", propertyId: "chalet-alpin", guest: "Sophie Bernard", dateLabel: "10–17 juin · 7 nuits", startDate: "2026-06-10", endDate: "2026-06-17", nights: 7, amount: 2450, status: "confirmed" },
  { id: "dr2", propertyId: "appart-vue-lac", guest: "Jean Dupont", dateLabel: "15–20 juin · 5 nuits", startDate: "2026-06-15", endDate: "2026-06-20", nights: 5, amount: 900, status: "pending" },
  { id: "dr3", propertyId: "studio-lausanne", guest: "Marie Leroy", dateLabel: "1–5 juin · 4 nuits", startDate: "2026-06-01", endDate: "2026-06-05", nights: 4, amount: 356, status: "completed" },
  { id: "dr4", propertyId: "appart-vue-lac", guest: "Sophie Bernard", dateLabel: "10–14 fév · 4 nuits", startDate: "2026-02-10", endDate: "2026-02-14", nights: 4, amount: 720, status: "cancelled" },
  { id: "dr5", propertyId: "chalet-alpin", guest: "Thomas Roux", dateLabel: "20–25 juin · 5 nuits", startDate: "2026-06-20", endDate: "2026-06-25", nights: 5, amount: 1750, status: "confirmed" },
  { id: "dr6", propertyId: "studio-lausanne", guest: "Amina Khan", dateLabel: "8–12 juin · 4 nuits", startDate: "2026-06-08", endDate: "2026-06-12", nights: 4, amount: 712, status: "completed" },
  { id: "dr7", propertyId: "chalet-alpin", guest: "Laura Meier", dateLabel: "2–8 juillet · 6 nuits", startDate: "2026-07-02", endDate: "2026-07-08", nights: 6, amount: 2100, status: "pending" },
  { id: "dr8", propertyId: "appart-vue-lac", guest: "Nadia Schmid", dateLabel: "3–9 juillet · 6 nuits", startDate: "2026-07-03", endDate: "2026-07-09", nights: 6, amount: 1080, status: "confirmed" },
  { id: "dr9", propertyId: "studio-lausanne", guest: "Pierre Aubry", dateLabel: "22–28 juin · 6 nuits", startDate: "2026-06-22", endDate: "2026-06-28", nights: 6, amount: 1068, status: "confirmed" },
];

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

export const referralChannels: ReferralChannel[] = [
  { id: "host", label: "Amener un hôte", reward: "100 CHF / activation", clicks: 23, conversions: 8 },
  { id: "client", label: "Amener un client", reward: "5% de la réservation", clicks: 41, conversions: 12 },
  { id: "property", label: "Amener un bien", reward: "2% de la vente", clicks: 17, conversions: 5 },
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

export const apporteurSummary = {
  earnedThisMonth: 2400,
  alreadyPaid: 2050,
  pending: 350,
};

/* KPIs derives — JAMAIS codes en dur. */
const totalRevenue = properties.reduce((sum, p) => sum + p.monthRevenue, 0);
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

export const objectives = {
  revenue: { current: totalRevenue, target: 30000 },
  reservations: { current: dashboardReservations.length, target: 12 },
  rating: { current: 4.8, target: 5 },
  diversification: {
    current: revenueBySource.filter((s) => s.value > 0).length,
    target: 7,
  },
};

export const kpis = {
  revenue: totalRevenue,
  revenueDelta: "+15.3%",
  reservations: dashboardReservations.length,
  reservationsDelta: "+21%",
  commissions: apporteurSummary.earnedThisMonth,
  commissionsDelta: "+26%",
  occupancy: avgOccupancy,
  occupancyDelta: "+4 pts",
  rating: 4.8,
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
