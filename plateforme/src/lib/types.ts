// ─── Roles ───────────────────────────────────────────────

export type Role =
  | "client"
  | "hote"
  | "proprietaire"
  | "agence"
  | "promoteur"
  | "apporteur"
  | "investisseur"
  | "formateur"
  | "courtier"
  | "admin";

export const roleBadgeColors: Record<Role, string> = {
  client: "gray",
  hote: "blue",
  proprietaire: "green",
  agence: "violet",
  promoteur: "orange",
  apporteur: "yellow",
  investisseur: "red",
  formateur: "teal",
  courtier: "cyan",
  admin: "black",
};

export const roleLabels: Record<Role, string> = {
  client: "Client",
  hote: "Hôte",
  proprietaire: "Propriétaire",
  agence: "Agence",
  promoteur: "Promoteur",
  apporteur: "Apporteur",
  investisseur: "Investisseur",
  formateur: "Formateur",
  courtier: "Courtier",
  admin: "Admin",
};

// ─── User ────────────────────────────────────────────────

export interface UserStats {
  followers: number;
  following: number;
  properties: number;
  rating: number;
  reviewCount: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  roles: Role[];
  activeRole: Role;
  phone?: string;
  country: string;
  city: string;
  bio?: string;
  verified: boolean;
  kycLevel: number;
  stats: UserStats;
  joinedAt: string;
  online: boolean;
  languages?: string[];
  certifications?: { title: string; issuer: string; date: string }[];
  responseTime?: number;
}

// ─── Property ────────────────────────────────────────────

export type PropertyType =
  | "appartement"
  | "villa"
  | "maison"
  | "chalet"
  | "studio"
  | "penthouse"
  | "loft"
  | "terrain"
  | "commercial";

export type TransactionType = "vente" | "location-lt" | "location-ct";

export interface PropertyLocation {
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface PaidOption {
  id: string;
  name: string;
  description: string;
  price: number;
  perDay?: boolean;
  selected?: boolean;
}

export interface Availability {
  start: string;
  end: string;
}

export interface PropertyDocument {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency: "CHF" | "EUR" | "USD" | "GBP" | "AED" | "MAD" | "THB";
  pricePerNight?: number;
  location: PropertyLocation;
  images: string[];
  videos: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  equipment: string[];
  host: User;
  rating: number;
  reviewCount: number;
  views: number;
  createdAt: string;
  status: "active" | "pending" | "sold" | "rented" | "draft";
  featured: boolean;
  paidOptions: PaidOption[];
  availabilities?: Availability[];
  documents?: PropertyDocument[];
  analytics?: {
    rendementBrut?: number;
    rendementNet?: number;
    prixM2?: number;
    chargesAnnuelles?: number;
    dpe?: string;
    etatGeneral?: string;
    anneeConstruction?: number;
    potentielPlusValue?: string;
    roi5ans?: number;
    roi10ans?: number;
    tauxOccupation?: number;
  };
}

// ─── Social ──────────────────────────────────────────────

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
}

export interface SocialMedia {
  type: "image" | "video";
  url: string;
}

export interface SocialPost {
  id: string;
  author: User;
  content: string;
  media: SocialMedia[];
  likes: number;
  comments: Comment[];
  shares: number;
  saves: number;
  createdAt: string;
  type: "post" | "reel" | "story";
  property?: Property;
  hashtags: string[];
}

// ─── Messaging ───────────────────────────────────────────

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
  isPhoto?: boolean;
  attachments?: { type: string; url: string; name: string }[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Reservation ─────────────────────────────────────────

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Reservation {
  id: string;
  property: Property;
  guest: User;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  optionsPrice: number;
  options: PaidOption[];
  status: ReservationStatus;
  createdAt: string;
}

// ─── Referral ────────────────────────────────────────────

export type ReferralStatus = "pending" | "validated" | "paid";

export interface Referral {
  id: string;
  referrer: User;
  referred: User;
  property?: Property;
  commission: number;
  status: ReferralStatus;
  createdAt: string;
  link: string;
}

// ─── Formation ───────────────────────────────────────────

export interface Module {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  instructor: User;
  price: number;
  currency: "CHF" | "EUR" | "USD" | "GBP" | "AED" | "MAD" | "THB";
  duration: string;
  level: "débutant" | "intermédiaire" | "avancé";
  category: string;
  thumbnail: string;
  modules: Module[];
  rating: number;
  studentsCount: number;
  isFree: boolean;
  previewVideo?: string;
}

// ─── Event ───────────────────────────────────────────────

export type EventType = "webinar" | "live" | "atelier" | "seminaire";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: EventType;
  speaker: User;
  location: string;
  spots: number;
  registered: number;
  price?: number;
  thumbnail: string;
}

// ─── Notification ────────────────────────────────────────

export interface Notification {
  id: string;
  type:
    | "reservation"
    | "message"
    | "referral"
    | "system"
    | "like"
    | "comment"
    | "follow"
    | "payment";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

// ─── Dashboard ───────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  averageRating: number;
  totalProperties: number;
  pendingReservations: number;
  referralEarnings: number;
  totalViews: number;
  conversionRate: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense" | "commission" | "refund";
  amount: number;
  currency: "CHF" | "EUR" | "USD" | "GBP" | "AED" | "MAD" | "THB";
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface MonthlyReferralEarnings {
  month: string;
  earnings: number;
  referrals: number;
}
