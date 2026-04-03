// ─── Roles ───────────────────────────────────────────────────────────────────

export type Role =
  | "client"
  | "hote"
  | "agence"
  | "promoteur"
  | "apporteur"
  | "investisseur"
  | "formateur"
  | "proprietaire"
  | "photographe"
  | "courtier"
  | "architecte"
  | "notaire"
  | "admin";

export const roleBadgeColors: Record<Role, string> = {
  client: "bg-gray-500/20 text-gray-400",
  hote: "bg-amber-500/20 text-amber-400",
  agence: "bg-blue-500/20 text-blue-400",
  promoteur: "bg-purple-500/20 text-purple-400",
  apporteur: "bg-emerald-500/20 text-emerald-400",
  investisseur: "bg-cyan-500/20 text-cyan-400",
  formateur: "bg-orange-500/20 text-orange-400",
  proprietaire: "bg-rose-500/20 text-rose-400",
  photographe: "bg-pink-500/20 text-pink-400",
  courtier: "bg-indigo-500/20 text-indigo-400",
  architecte: "bg-teal-500/20 text-teal-400",
  notaire: "bg-slate-500/20 text-slate-400",
  admin: "bg-red-500/20 text-red-400",
};

export const roleLabels: Record<Role, string> = {
  client: "Client",
  hote: "Hôte",
  agence: "Agence",
  promoteur: "Promoteur",
  apporteur: "Apporteur d'affaires",
  investisseur: "Investisseur",
  formateur: "Formateur",
  proprietaire: "Propriétaire",
  photographe: "Photographe",
  courtier: "Courtier",
  architecte: "Architecte",
  notaire: "Notaire",
  admin: "Administrateur",
};

// ─── Currency ────────────────────────────────────────────────────────────────

export type Currency = "CHF" | "EUR" | "USD" | "GBP" | "AED" | "MAD" | "THB";

// ─── Property ────────────────────────────────────────────────────────────────

export type PropertyType =
  | "appartement"
  | "villa"
  | "maison"
  | "chalet"
  | "studio"
  | "penthouse"
  | "terrain"
  | "commercial"
  | "bureau"
  | "riad";

export type TransactionType = "vente" | "location-ct" | "location-lt";

export interface PropertyAnalytics {
  rendementBrut: number;
  rendementNet: number;
  prixM2: number;
  dpe: string;
  etatGeneral: string;
  anneeConstruction: number;
  potentielPlusValue: number;
  roi5ans: number;
  roi10ans: number;
  tauxOccupation: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency: Currency;
  location: {
    city: string;
    country: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  images: string[];
  videos?: string[];
  host: User;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  amenities: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  analytics?: PropertyAnalytics;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  city: string;
  country: string;
  roles: Role[];
  activeRole: Role;
  stats: {
    followers: number;
    following: number;
    properties: number;
    reviews: number;
    rating: number;
    transactions: number;
    revenue: number;
  };
  bio: string;
  languages?: string[];
  certifications?: string[];
  responseTime?: string;
}

// ─── Social ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
}

export interface SocialPost {
  id: string;
  author: User;
  content: string;
  media: string[];
  type: "post" | "reel" | "story";
  likes: number;
  comments: Comment[];
  createdAt: string;
  location?: string;
  property?: Property;
  formation?: { id: string; title: string; instructor: string; price: number; students: number; thumbnail: string };
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isPhoto?: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
  lastMessage: string;
  isOnline: boolean;
}

// ─── Reservation ─────────────────────────────────────────────────────────────

export interface Reservation {
  id: string;
  property: Property;
  guest: User;
  checkIn: string;
  checkOut: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  options?: string[];
}

// ─── Formation ───────────────────────────────────────────────────────────────

export interface FormationModule {
  id: string;
  title: string;
  duration: string;
  lessons: { id: string; title: string; duration: string; completed?: boolean }[];
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "debutant" | "intermediaire" | "avance";
  instructor: User;
  thumbnail: string;
  price: number;
  currency: Currency;
  duration: string;
  modules: FormationModule[];
  rating: number;
  studentCount: number;
  previewVideo?: string;
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: "message" | "reservation" | "review" | "follow" | "system" | "payment";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  averageRating: number;
  totalViews: number;
  conversionRate: number;
  pendingPayments: number;
}

export interface Transaction {
  id: string;
  type: "payment" | "payout" | "commission" | "refund";
  amount: number;
  currency: Currency;
  status: "completed" | "pending" | "failed";
  description: string;
  date: string;
  counterpart?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
  occupancy: number;
}
