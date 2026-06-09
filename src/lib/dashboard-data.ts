/* SOURCE DE VERITE UNIQUE pour tout l'espace dashboard.
   Toutes les pages (vue d'ensemble, revenus, reservations, annonces,
   apporteurs) consomment CE fichier — d'ou la coherence des chiffres
   et des noms de biens. Les totaux sont DERIVES des tableaux pour
   qu'ils ne puissent jamais diverger.

   Note : isole de src/lib/mock-data.ts (qui a sa propre structure
   pour les features sociales : conversations, formations, events,
   etc.). Cet espace de noms est entierement dedie au dashboard. */

export type ReservationStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type ListingStatus = "published" | "draft";
export type TransactionKind = "reservation" | "payout" | "commission" | "refund";

export interface Property {
  id: string;
  name: string;
  initials: string;
  city: string;
  weeklyPrice: number;
  monthRevenue: number;
  views: number;
  occupancy: number; // 0..1
}

export interface Transaction {
  id: string;
  label: string;
  sublabel: string;
  amount: number; // negatif = sortie
  status: ReservationStatus;
  kind: TransactionKind;
}

export interface Reservation {
  id: string;
  propertyId: string;
  guest: string;
  dateLabel: string;
  nights: number;
  amount: number;
  status: ReservationStatus;
}

/* Identite utilisateur dediee au dashboard. Renommee en `dashboardUser`
   pour ne pas entrer en collision avec le `currentUser` (type User) deja
   exporte par mock-data.ts. */
export const dashboardUser = {
  name: "Léo Martin",
  initials: "LM",
  roles: ["Hôte", "Formateur", "Apporteur"] as const,
};

/* Les 3 memes biens partout dans l'espace dashboard. */
export const properties: Property[] = [
  { id: "chalet-alpin", name: "Chalet Alpin Premium", initials: "CA", city: "Verbier", weeklyPrice: 2450, monthRevenue: 11200, views: 2840, occupancy: 0.92 },
  { id: "appart-vue-lac", name: "Appartement Vue Lac", initials: "AV", city: "Montreux", weeklyPrice: 1800, monthRevenue: 8400, views: 1240, occupancy: 0.78 },
  { id: "studio-lausanne", name: "Studio Lausanne", initials: "SL", city: "Lausanne", weeklyPrice: 890, monthRevenue: 5250, views: 980, occupancy: 0.74 },
];

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

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

export const revenueByType: { label: string; value: number }[] = [
  { label: "Locations", value: 21350 },
  { label: "Commissions apporteur", value: 2400 },
  { label: "Boutique", value: 1100 },
];

export const transactions: Transaction[] = [
  { id: "t1", label: "Chalet Alpin Premium", sublabel: "Sophie Bernard", amount: 2450, status: "confirmed", kind: "reservation" },
  { id: "t2", label: "Virement mensuel", sublabel: "Versé le 25.03", amount: 3500, status: "completed", kind: "payout" },
  { id: "t3", label: "Commission apporteur", sublabel: "Marc Dupont", amount: 100, status: "pending", kind: "commission" },
  { id: "t4", label: "Appartement Vue Lac", sublabel: "Remboursement", amount: -720, status: "cancelled", kind: "refund" },
];

export const dashboardReservations: Reservation[] = [
  { id: "dr1", propertyId: "chalet-alpin", guest: "Sophie Bernard", dateLabel: "10–17 juil · 7 nuits", nights: 7, amount: 2450, status: "confirmed" },
  { id: "dr2", propertyId: "appart-vue-lac", guest: "Jean Dupont", dateLabel: "15–20 avr · 5 nuits", nights: 5, amount: 900, status: "pending" },
  { id: "dr3", propertyId: "studio-lausanne", guest: "Marie Leroy", dateLabel: "1–5 mars · 4 nuits", nights: 4, amount: 356, status: "completed" },
  { id: "dr4", propertyId: "appart-vue-lac", guest: "Sophie Bernard", dateLabel: "10–14 fév · 4 nuits", nights: 4, amount: 720, status: "cancelled" },
  { id: "dr5", propertyId: "chalet-alpin", guest: "Thomas Roux", dateLabel: "20–25 mai · 5 nuits", nights: 5, amount: 1750, status: "confirmed" },
  { id: "dr6", propertyId: "studio-lausanne", guest: "Amina Khan", dateLabel: "8–12 jan · 4 nuits", nights: 4, amount: 712, status: "completed" },
  { id: "dr7", propertyId: "chalet-alpin", guest: "Laura Meier", dateLabel: "2–8 août · 6 nuits", nights: 6, amount: 2100, status: "pending" },
  { id: "dr8", propertyId: "appart-vue-lac", guest: "Nadia Schmid", dateLabel: "3–9 sep · 6 nuits", nights: 6, amount: 1080, status: "confirmed" },
];

/* Apporteurs (referrals) — donnees pour la page /dashboard/apporteurs. */
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
  earnedThisMonth: 2400, // = alreadyPaid + pending
  alreadyPaid: 2050,
  pending: 350,
};

/* KPIs derives — JAMAIS codes en dur. */
const totalRevenue = properties.reduce((sum, p) => sum + p.monthRevenue, 0);
const avgOccupancy = properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length;

export const objectives = {
  revenue: { current: totalRevenue, target: 30000 },
  reservations: { current: dashboardReservations.length, target: 12 },
  rating: { current: 4.8, target: 5 },
};

export const kpis = {
  revenue: totalRevenue, // 24'850 — derive, jamais code en dur
  revenueDelta: "+15.3%",
  reservations: dashboardReservations.length,
  reservationsDelta: "+21%",
  commissions: apporteurSummary.earnedThisMonth,
  commissionsDelta: "+26%",
  occupancy: avgOccupancy, // ~0.81
  occupancyDelta: "+4 pts",
  rating: 4.8,
};

export const dashboard = {
  user: dashboardUser,
  properties,
  monthlyRevenue,
  revenueByType,
  transactions,
  reservations: dashboardReservations,
  objectives,
  kpis,
};
