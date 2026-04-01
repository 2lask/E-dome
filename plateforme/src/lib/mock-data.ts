// ============================================================
// E-Dome Platform — Mock Data
// All text in French. Realistic Swiss/French/International data.
// ============================================================

import type {
  User,
  Role,
  Property,
  PropertyType,
  TransactionType,
  PropertyAnalytics,
  SocialPost,
  Comment,
  Conversation,
  Message,
  Reservation,
  Formation,
  FormationModule,
  Notification,
  DashboardStats,
  Transaction,
  MonthlyRevenue,
} from './types';

// ─── USERS (16) ─────────────────────────────────────────────────────────────

export const currentUser: User = {
  id: 'user-001',
  firstName: 'Karim',
  lastName: 'Benali',
  email: 'karim.benali@edome.ch',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  city: 'Neuch\u00e2tel',
  country: 'Suisse',
  roles: ['hote', 'apporteur', 'formateur'] as Role[],
  activeRole: 'hote' as Role,
  stats: {
    followers: 2340,
    following: 812,
    properties: 14,
    reviews: 87,
    rating: 4.8,
    transactions: 52,
    revenue: 485000,
  },
  bio: 'Expert immobilier certifi\u00e9 USPI. Sp\u00e9cialiste des investissements locatifs en Suisse romande et \u00e0 l\u2019international. Passionn\u00e9 par l\u2019innovation proptech.',
  languages: ['Fran\u00e7ais', 'English', 'Arabic'],
  certifications: ['Expert Immobilier USPI (2024)', 'Courtier F\u00e9d\u00e9ral (2022)'],
  responseTime: '2h',
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-002',
    firstName: 'Sophie',
    lastName: 'Durand',
    email: 'sophie.durand@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    city: 'Lausanne',
    country: 'Suisse',
    roles: ['hote', 'courtier'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 3100, following: 520, properties: 22, reviews: 134, rating: 4.9, transactions: 78, revenue: 920000 },
    bio: 'Courti\u00e8re immobili\u00e8re ind\u00e9pendante. 12 ans d\u2019exp\u00e9rience sur l\u2019arc l\u00e9manique. Sp\u00e9cialit\u00e9 : biens de luxe et attiques.',
    languages: ['Fran\u00e7ais', 'Deutsch', 'English'],
    certifications: ['Courti\u00e8re Brevet F\u00e9d\u00e9ral (2019)'],
    responseTime: '1h',
  },
  {
    id: 'user-003',
    firstName: 'Marc',
    lastName: 'Favre',
    email: 'marc.favre@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    city: 'Gen\u00e8ve',
    country: 'Suisse',
    roles: ['investisseur', 'apporteur'] as Role[],
    activeRole: 'investisseur' as Role,
    stats: { followers: 5620, following: 340, properties: 8, reviews: 42, rating: 4.7, transactions: 31, revenue: 1250000 },
    bio: 'Investisseur immobilier depuis 2010. Portfolio diversifi\u00e9 entre la Suisse, la France et le Portugal. Rendements vis\u00e9s : 5-8% net.',
    languages: ['Fran\u00e7ais', 'English', 'Portugu\u00eas'],
    certifications: ['CFA Level II (2018)'],
    responseTime: '4h',
  },
  {
    id: 'user-004',
    firstName: 'Amina',
    lastName: 'El Idrissi',
    email: 'amina.elidrissi@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    city: 'Marrakech',
    country: 'Maroc',
    roles: ['hote', 'formateur'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 4200, following: 610, properties: 6, reviews: 98, rating: 4.9, transactions: 45, revenue: 340000 },
    bio: 'Propri\u00e9taire de riads et maisons d\u2019h\u00f4tes \u00e0 Marrakech. Formatrice en gestion locative touristique. Ambassadrice E-Dome Maroc.',
    languages: ['Fran\u00e7ais', 'Arabic', 'English'],
    certifications: ['Gestion H\u00f4teli\u00e8re (ISCAE 2020)'],
    responseTime: '3h',
  },
  {
    id: 'user-005',
    firstName: 'Lucas',
    lastName: 'Renaud',
    email: 'lucas.renaud@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    city: 'Nice',
    country: 'France',
    roles: ['hote', 'photographe'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 1800, following: 430, properties: 4, reviews: 56, rating: 4.6, transactions: 28, revenue: 195000 },
    bio: 'Photographe immobilier et h\u00f4te sur la C\u00f4te d\u2019Azur. Je sublime vos biens pour maximiser la conversion. Drone & Matterport.',
    languages: ['Fran\u00e7ais', 'English', 'Italiano'],
    certifications: ['Pilote Drone (DGAC 2023)'],
    responseTime: '2h',
  },
  {
    id: 'user-006',
    firstName: 'Yasmin',
    lastName: 'Al Maktoum',
    email: 'yasmin.almaktoum@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    city: 'Dubai',
    country: '\u00c9mirats Arabes Unis',
    roles: ['agence', 'investisseur'] as Role[],
    activeRole: 'agence' as Role,
    stats: { followers: 8900, following: 210, properties: 35, reviews: 210, rating: 4.8, transactions: 120, revenue: 3500000 },
    bio: 'Directrice d\u2019agence \u00e0 Dubai. Sp\u00e9cialiste des propri\u00e9t\u00e9s ultra-luxe, penthouses et villas sur Palm Jumeirah.',
    languages: ['English', 'Arabic', 'Fran\u00e7ais'],
    certifications: ['RERA Certified Broker (2021)'],
    responseTime: '1h',
  },
  {
    id: 'user-007',
    firstName: 'Pierre',
    lastName: 'Gonçalves',
    email: 'pierre.goncalves@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    city: 'Lisbonne',
    country: 'Portugal',
    roles: ['hote', 'apporteur'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 2100, following: 380, properties: 9, reviews: 67, rating: 4.7, transactions: 38, revenue: 275000 },
    bio: 'Franco-portugais install\u00e9 \u00e0 Lisbonne. Sp\u00e9cialiste de la r\u00e9novation et du Golden Visa. 9 biens en gestion.',
    languages: ['Fran\u00e7ais', 'Portugu\u00eas', 'English'],
    certifications: ['AMI License Portugal (2022)'],
    responseTime: '3h',
  },
  {
    id: 'user-008',
    firstName: 'Nathalie',
    lastName: 'Blanc',
    email: 'nathalie.blanc@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    city: 'Gen\u00e8ve',
    country: 'Suisse',
    roles: ['notaire', 'formateur'] as Role[],
    activeRole: 'notaire' as Role,
    stats: { followers: 1500, following: 190, properties: 0, reviews: 34, rating: 4.9, transactions: 95, revenue: 180000 },
    bio: 'Notaire sp\u00e9cialis\u00e9e en droit immobilier suisse. Formatrice juridique sur E-Dome. Auteure de guides pratiques.',
    languages: ['Fran\u00e7ais', 'Deutsch'],
    certifications: ['Brevet de Notaire VD (2016)'],
    responseTime: '6h',
  },
  {
    id: 'user-009',
    firstName: 'Thomas',
    lastName: 'Müller',
    email: 'thomas.muller@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    city: 'Lausanne',
    country: 'Suisse',
    roles: ['architecte', 'investisseur'] as Role[],
    activeRole: 'architecte' as Role,
    stats: { followers: 3400, following: 270, properties: 3, reviews: 29, rating: 4.8, transactions: 15, revenue: 420000 },
    bio: 'Architecte EPFL, sp\u00e9cialiste en r\u00e9novation \u00e9nerg\u00e9tique et construction durable. Projets Minergie et SNBS.',
    languages: ['Fran\u00e7ais', 'Deutsch', 'English'],
    certifications: ['Architecte REG A (SIA)', 'Expert Minergie (2023)'],
    responseTime: '5h',
  },
  {
    id: 'user-010',
    firstName: 'Fatima',
    lastName: 'Zahra',
    email: 'fatima.zahra@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    city: 'Dakar',
    country: 'S\u00e9n\u00e9gal',
    roles: ['apporteur', 'formateur'] as Role[],
    activeRole: 'apporteur' as Role,
    stats: { followers: 1200, following: 560, properties: 0, reviews: 18, rating: 4.5, transactions: 22, revenue: 85000 },
    bio: 'Apporteuse d\u2019affaires en Afrique de l\u2019Ouest. R\u00e9seau de 200+ investisseurs. Experte en opportunit\u00e9s immobili\u00e8res \u00e9mergentes.',
    languages: ['Fran\u00e7ais', 'Wolof', 'English'],
    certifications: [],
    responseTime: '4h',
  },
  {
    id: 'user-011',
    firstName: 'Alexandre',
    lastName: 'Petit',
    email: 'alexandre.petit@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    city: 'Bangkok',
    country: 'Tha\u00eflande',
    roles: ['hote', 'investisseur'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 2800, following: 420, properties: 11, reviews: 73, rating: 4.6, transactions: 40, revenue: 310000 },
    bio: 'Expatri\u00e9 fran\u00e7ais \u00e0 Bangkok. Gestionnaire de condos et villas de luxe \u00e0 Phuket et Koh Samui. Rendements 8-12%.',
    languages: ['Fran\u00e7ais', 'English', 'Thai'],
    certifications: ['Property Management Thailand (2022)'],
    responseTime: '3h',
  },
  {
    id: 'user-012',
    firstName: 'Cl\u00e9mence',
    lastName: 'Moreau',
    email: 'clemence.moreau@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    city: 'Lausanne',
    country: 'Suisse',
    roles: ['client', 'investisseur'] as Role[],
    activeRole: 'client' as Role,
    stats: { followers: 450, following: 120, properties: 1, reviews: 8, rating: 4.3, transactions: 3, revenue: 12000 },
    bio: 'Cadre dans la pharma. Premi\u00e8re acquisition immobili\u00e8re en cours. En recherche active d\u2019un 4.5 pi\u00e8ces sur Lausanne.',
    languages: ['Fran\u00e7ais', 'English'],
    certifications: [],
    responseTime: '8h',
  },
  {
    id: 'user-013',
    firstName: 'Omar',
    lastName: 'Benjelloun',
    email: 'omar.benjelloun@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face',
    city: 'Marrakech',
    country: 'Maroc',
    roles: ['promoteur', 'hote'] as Role[],
    activeRole: 'promoteur' as Role,
    stats: { followers: 6200, following: 310, properties: 18, reviews: 142, rating: 4.7, transactions: 65, revenue: 1800000 },
    bio: 'Promoteur immobilier \u00e0 Marrakech et Tanger. Programmes neufs haut standing. Partenaire officiel E-Dome Maroc.',
    languages: ['Fran\u00e7ais', 'Arabic', 'English'],
    certifications: ['FNPI Maroc (2019)'],
    responseTime: '2h',
  },
  {
    id: 'user-014',
    firstName: 'Elena',
    lastName: 'Papadopoulos',
    email: 'elena.papadopoulos@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    city: 'Ath\u00e8nes',
    country: 'Gr\u00e8ce',
    roles: ['hote', 'apporteur'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 1900, following: 380, properties: 7, reviews: 54, rating: 4.8, transactions: 32, revenue: 220000 },
    bio: 'H\u00f4tesse \u00e0 Ath\u00e8nes et dans les Cyclades. Villas avec vue mer, exp\u00e9riences authentiques. Golden Visa Gr\u00e8ce.',
    languages: ['Fran\u00e7ais', 'English', '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac'],
    certifications: [],
    responseTime: '3h',
  },
  {
    id: 'user-015',
    firstName: 'Jean-Luc',
    lastName: 'Hartmann',
    email: 'jeanluc.hartmann@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    city: 'Neuch\u00e2tel',
    country: 'Suisse',
    roles: ['agence', 'courtier'] as Role[],
    activeRole: 'agence' as Role,
    stats: { followers: 4100, following: 250, properties: 28, reviews: 178, rating: 4.8, transactions: 110, revenue: 1450000 },
    bio: 'Directeur Hartmann Immobilier SA. 20 ans dans l\u2019immobilier neuch\u00e2telois. Membre USPI et SVIT.',
    languages: ['Fran\u00e7ais', 'Deutsch', 'English'],
    certifications: ['Courtier Brevet F\u00e9d\u00e9ral (2012)', 'Expert USPI (2018)'],
    responseTime: '1h',
  },
  {
    id: 'user-016',
    firstName: 'Carlos',
    lastName: 'Rivera',
    email: 'carlos.rivera@edome.ch',
    avatar: 'https://images.unsplash.com/photo-1548449112-96a38a643324?w=150&h=150&fit=crop&crop=face',
    city: 'Barcelone',
    country: 'Espagne',
    roles: ['hote', 'photographe'] as Role[],
    activeRole: 'hote' as Role,
    stats: { followers: 2500, following: 490, properties: 5, reviews: 62, rating: 4.7, transactions: 35, revenue: 185000 },
    bio: 'H\u00f4te et photographe immobilier \u00e0 Barcelone. Sp\u00e9cialiste home staging et vid\u00e9o cin\u00e9matique pour biens de prestige.',
    languages: ['Espa\u00f1ol', 'Fran\u00e7ais', 'English'],
    certifications: ['Home Staging Europe (2023)'],
    responseTime: '2h',
  },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

// ─── PROPERTIES (14) ────────────────────────────────────────────────────────

export const properties: Property[] = [
  // 1 — Vente, Appartement, Lausanne
  {
    id: 'prop-001',
    title: 'Magnifique 4.5 pi\u00e8ces avec vue sur le Lac L\u00e9man',
    description:
      'Superbe appartement de 4.5 pi\u00e8ces enti\u00e8rement r\u00e9nov\u00e9, situ\u00e9 au 6\u00e8me \u00e9tage avec une vue imprenable sur le lac et les Alpes. Finitions haut de gamme, cuisine \u00e9quip\u00e9e Bulthaup, parquet ch\u00eane massif. Deux places de parking incluses.',
    type: 'appartement',
    transactionType: 'vente',
    price: 1450000,
    currency: 'CHF',
    location: { city: 'Lausanne', country: 'Suisse', address: 'Avenue de Cour 42', lat: 46.5107, lng: 6.6284 },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616137466211-f736a1f8e5e0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    ],
    videos: ['/videos/property-tour-1.mp4'],
    host: users[1], // Sophie
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    floor: 6,
    amenities: ['Ascenseur', 'Balcon', 'Cave', 'Parking', 'Buanderie', 'Vue lac'],
    rating: 4.9,
    reviewCount: 24,
    featured: true,
    analytics: {
      rendementBrut: 3.8,
      rendementNet: 2.9,
      prixM2: 10741,
      dpe: 'B',
      etatGeneral: 'Excellent',
      anneeConstruction: 2019,
      potentielPlusValue: 12,
      roi5ans: 18.5,
      roi10ans: 42.0,
      tauxOccupation: 97,
    },
  },
  // 2 — Location-ct, Studio, Gen\u00e8ve
  {
    id: 'prop-002',
    title: 'Studio meubl\u00e9 design au c\u0153ur de Gen\u00e8ve',
    description:
      'Studio contemporain de 32m\u00b2 enti\u00e8rement meubl\u00e9, id\u00e9al pour s\u00e9jours courte dur\u00e9e. Cuisine \u00e9quip\u00e9e, literie premium, WiFi fibre. \u00c0 5 minutes de la gare Cornavin.',
    type: 'studio',
    transactionType: 'location-ct',
    price: 120,
    currency: 'CHF',
    location: { city: 'Gen\u00e8ve', country: 'Suisse', address: 'Rue du Mont-Blanc 18', lat: 46.2044, lng: 6.1432 },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[2], // Marc
    bedrooms: 0,
    bathrooms: 1,
    area: 32,
    floor: 3,
    amenities: ['WiFi', 'Meubl\u00e9', 'Cuisine \u00e9quip\u00e9e', 'Machine \u00e0 laver', 'Climatisation'],
    rating: 4.6,
    reviewCount: 58,
    featured: false,
  },
  // 3 — Vente, Villa, Nice
  {
    id: 'prop-003',
    title: 'Villa contemporaine avec piscine \u00e0 d\u00e9bordement',
    description:
      'Magnifique villa d\u2019architecte de 280m\u00b2 sur un terrain de 1200m\u00b2. Piscine \u00e0 d\u00e9bordement avec vue mer panoramique. 5 chambres, 3 salles de bains, double garage. Quartier r\u00e9sidentiel calme.',
    type: 'villa',
    transactionType: 'vente',
    price: 2850000,
    currency: 'EUR',
    location: { city: 'Nice', country: 'France', address: 'Chemin des Collines 7', lat: 43.7102, lng: 7.262 },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
    ],
    videos: ['/videos/property-tour-2.mp4'],
    host: users[4], // Lucas
    bedrooms: 5,
    bathrooms: 3,
    area: 280,
    amenities: ['Piscine', 'Jardin', 'Garage', 'Terrasse', 'Vue mer', 'Alarme', 'Domotique'],
    rating: 4.9,
    reviewCount: 12,
    featured: true,
    analytics: {
      rendementBrut: 4.2,
      rendementNet: 3.1,
      prixM2: 10179,
      dpe: 'C',
      etatGeneral: 'Excellent',
      anneeConstruction: 2021,
      potentielPlusValue: 15,
      roi5ans: 22.0,
      roi10ans: 48.5,
      tauxOccupation: 94,
    },
  },
  // 4 — Vente, Riad, Marrakech
  {
    id: 'prop-004',
    title: 'Riad traditionnel r\u00e9nov\u00e9 en M\u00e9dina',
    description:
      'Authentique riad de 200m\u00b2 enti\u00e8rement restaur\u00e9 avec mat\u00e9riaux nobles. Patio avec fontaine, 4 suites avec salle de bain, terrasse panoramique. Exploit\u00e9 en maison d\u2019h\u00f4tes avec excellente rentabilit\u00e9.',
    type: 'riad',
    transactionType: 'vente',
    price: 3200000,
    currency: 'MAD',
    location: { city: 'Marrakech', country: 'Maroc', address: 'Derb Sidi Bouamar, M\u00e9dina', lat: 31.6295, lng: -7.9811 },
    images: [
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    ],
    videos: ['/videos/property-tour-3.mp4'],
    host: users[3], // Amina
    bedrooms: 4,
    bathrooms: 4,
    area: 200,
    amenities: ['Patio', 'Terrasse', 'Fontaine', 'Hammam', 'WiFi', 'Climatisation'],
    rating: 4.8,
    reviewCount: 87,
    featured: true,
    analytics: {
      rendementBrut: 9.5,
      rendementNet: 7.2,
      prixM2: 16000,
      dpe: 'D',
      etatGeneral: 'Tr\u00e8s bon',
      anneeConstruction: 1890,
      potentielPlusValue: 20,
      roi5ans: 38.0,
      roi10ans: 85.0,
      tauxOccupation: 78,
    },
  },
  // 5 — Location-ct, Chalet, Verbier
  {
    id: 'prop-005',
    title: 'Chalet de luxe au pied des pistes \u00e0 Verbier',
    description:
      'Chalet exceptionnel de 350m\u00b2 avec acc\u00e8s ski-in/ski-out. Espace wellness priv\u00e9 (sauna, jacuzzi), chemin\u00e9e, 6 chambres. Vue imprenable sur les sommets. Service de concierge inclus.',
    type: 'chalet',
    transactionType: 'location-ct',
    price: 850,
    currency: 'CHF',
    location: { city: 'Verbier', country: 'Suisse', address: 'Route de Verbier Station 15', lat: 46.0967, lng: 7.2286 },
    images: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1604014237256-11d475e2a2d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520984032042-162d526883e0?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[0], // Karim
    bedrooms: 6,
    bathrooms: 4,
    area: 350,
    amenities: ['Sauna', 'Jacuzzi', 'Chemin\u00e9e', 'Ski-in/Ski-out', 'Garage', 'Concierge', 'WiFi'],
    rating: 4.9,
    reviewCount: 31,
    featured: true,
  },
  // 6 — Vente, Penthouse, Dubai
  {
    id: 'prop-006',
    title: 'Penthouse ultra-luxe sur Palm Jumeirah',
    description:
      'Penthouse d\u2019exception de 450m\u00b2 au dernier \u00e9tage avec vue 360\u00b0 sur le Golfe et la Marina. Piscine priv\u00e9e sur le toit, ascenseur priv\u00e9, 4 suites. Finitions Armani Casa.',
    type: 'penthouse',
    transactionType: 'vente',
    price: 15000000,
    currency: 'AED',
    location: { city: 'Dubai', country: '\u00c9mirats Arabes Unis', address: 'Palm Jumeirah, Crescent Road', lat: 25.1124, lng: 55.139 },
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    ],
    videos: ['/videos/property-tour-4.mp4'],
    host: users[5], // Yasmin
    bedrooms: 4,
    bathrooms: 5,
    area: 450,
    floor: 42,
    amenities: ['Piscine priv\u00e9e', 'Ascenseur priv\u00e9', 'Vue mer', 'Salle de cin\u00e9ma', 'Salle de sport', 'Concierge 24h'],
    rating: 5.0,
    reviewCount: 8,
    featured: true,
    analytics: {
      rendementBrut: 5.2,
      rendementNet: 4.1,
      prixM2: 33333,
      dpe: 'A',
      etatGeneral: 'Neuf',
      anneeConstruction: 2024,
      potentielPlusValue: 18,
      roi5ans: 28.0,
      roi10ans: 62.0,
      tauxOccupation: 100,
    },
  },
  // 7 — Location-lt, Appartement, Neuch\u00e2tel
  {
    id: 'prop-007',
    title: '3.5 pi\u00e8ces lumineux au bord du lac',
    description:
      'Bel appartement de 3.5 pi\u00e8ces au 4\u00e8me \u00e9tage avec vue d\u00e9gag\u00e9e sur le lac de Neuch\u00e2tel. R\u00e9cemment r\u00e9nov\u00e9, cuisine ouverte, balcon orient\u00e9 sud. Proche commerces et transports.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 1850,
    currency: 'CHF',
    location: { city: 'Neuch\u00e2tel', country: 'Suisse', address: 'Quai Philippe-Godet 12', lat: 46.9925, lng: 6.9311 },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[14], // Jean-Luc
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    floor: 4,
    amenities: ['Balcon', 'Cave', 'Buanderie', 'Parking', 'Vue lac'],
    rating: 4.7,
    reviewCount: 19,
    featured: false,
  },
  // 8 — Vente, Maison, Lisbonne
  {
    id: 'prop-008',
    title: 'Maison de ville r\u00e9nov\u00e9e \u00e0 Alfama',
    description:
      'Charmante maison de ville sur 3 niveaux dans le quartier historique d\u2019Alfama. 160m\u00b2 habitables, terrasse sur le toit avec vue Tage, patio int\u00e9rieur. Id\u00e9al investissement Golden Visa.',
    type: 'maison',
    transactionType: 'vente',
    price: 680000,
    currency: 'EUR',
    location: { city: 'Lisbonne', country: 'Portugal', address: 'Rua de S\u00e3o Miguel 34', lat: 38.7103, lng: -9.1302 },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598928506311-c55ez637a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[6], // Pierre
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    amenities: ['Terrasse', 'Patio', 'Chemin\u00e9e', 'Vue fleuve', 'Cave \u00e0 vin'],
    rating: 4.8,
    reviewCount: 15,
    featured: false,
    analytics: {
      rendementBrut: 6.1,
      rendementNet: 4.5,
      prixM2: 4250,
      dpe: 'C',
      etatGeneral: 'Tr\u00e8s bon',
      anneeConstruction: 1920,
      potentielPlusValue: 22,
      roi5ans: 32.0,
      roi10ans: 70.0,
      tauxOccupation: 88,
    },
  },
  // 9 — Location-ct, Villa, Phuket
  {
    id: 'prop-009',
    title: 'Villa tropicale avec piscine \u00e0 Phuket',
    description:
      'Villa de luxe de 220m\u00b2 avec piscine infinity et vue oc\u00e9an. 4 chambres, cuisine ext\u00e9rieure, sala tha\u00ef. Personnel de maison inclus. Location \u00e0 la semaine.',
    type: 'villa',
    transactionType: 'location-ct',
    price: 380,
    currency: 'THB',
    location: { city: 'Phuket', country: 'Tha\u00eflande', address: 'Kamala Beach Road 88', lat: 7.9519, lng: 98.2817 },
    images: [
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=800&h=600&fit=crop',
    ],
    videos: ['/videos/property-tour-5.mp4'],
    host: users[10], // Alexandre
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    amenities: ['Piscine', 'Vue mer', 'Jardin tropical', 'Cuisine ext\u00e9rieure', 'Personnel', 'WiFi'],
    rating: 4.7,
    reviewCount: 42,
    featured: false,
  },
  // 10 — Vente, Terrain, Marrakech
  {
    id: 'prop-010',
    title: 'Terrain constructible 5000m\u00b2 Palmeraie',
    description:
      'Terrain viabilis\u00e9 de 5000m\u00b2 dans la Palmeraie de Marrakech. Permis de construire obtenu pour villa de 600m\u00b2. Acc\u00e8s route goudronn\u00e9e, proximit\u00e9 golfs et h\u00f4tels 5 \u00e9toiles.',
    type: 'terrain',
    transactionType: 'vente',
    price: 4500000,
    currency: 'MAD',
    location: { city: 'Marrakech', country: 'Maroc', address: 'Circuit de la Palmeraie', lat: 31.6715, lng: -8.0029 },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[12], // Omar
    bedrooms: 0,
    bathrooms: 0,
    area: 5000,
    amenities: ['Viabilis\u00e9', 'Permis de construire', 'Route goudronn\u00e9e', 'Eau', '\u00c9lectricit\u00e9'],
    rating: 4.5,
    reviewCount: 6,
    featured: false,
    analytics: {
      rendementBrut: 0,
      rendementNet: 0,
      prixM2: 900,
      dpe: 'N/A',
      etatGeneral: 'Terrain nu',
      anneeConstruction: 0,
      potentielPlusValue: 35,
      roi5ans: 40.0,
      roi10ans: 95.0,
      tauxOccupation: 0,
    },
  },
  // 11 — Vente, Bureau, Gen\u00e8ve
  {
    id: 'prop-011',
    title: 'Bureaux standing \u00e0 Gen\u00e8ve Eaux-Vives',
    description:
      'Surface de bureaux de 180m\u00b2 au 2\u00e8me \u00e9tage d\u2019un immeuble r\u00e9cent. Open space am\u00e9nageable, 2 salles de r\u00e9union, kitchenette. Fibre optique, climatisation r\u00e9versible. Proche gare des Eaux-Vives.',
    type: 'bureau',
    transactionType: 'vente',
    price: 980000,
    currency: 'CHF',
    location: { city: 'Gen\u00e8ve', country: 'Suisse', address: 'Rue de la Terrassi\u00e8re 8', lat: 46.2, lng: 6.1614 },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562664377-709f2c337eb2?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[2], // Marc
    bedrooms: 0,
    bathrooms: 2,
    area: 180,
    floor: 2,
    amenities: ['Climatisation', 'Fibre optique', 'Salles de r\u00e9union', 'Kitchenette', 'Parking', 'Acc\u00e8s handicap\u00e9'],
    rating: 4.6,
    reviewCount: 9,
    featured: false,
    analytics: {
      rendementBrut: 4.8,
      rendementNet: 3.6,
      prixM2: 5444,
      dpe: 'B',
      etatGeneral: 'Excellent',
      anneeConstruction: 2020,
      potentielPlusValue: 10,
      roi5ans: 20.0,
      roi10ans: 45.0,
      tauxOccupation: 95,
    },
  },
  // 12 — Location-ct, Villa, Gr\u00e8ce
  {
    id: 'prop-012',
    title: 'Villa blanche avec vue caldera \u00e0 Santorin',
    description:
      'Villa cycladique de 150m\u00b2 perch\u00e9e sur la caldera d\u2019Oia. 3 chambres, piscine priv\u00e9e, terrasses multiples. Vue coucher de soleil l\u00e9gendaire. Service de concierge et chef priv\u00e9 disponibles.',
    type: 'villa',
    transactionType: 'location-ct',
    price: 450,
    currency: 'EUR',
    location: { city: 'Santorin', country: 'Gr\u00e8ce', address: 'Oia, Caldera View', lat: 36.4618, lng: 25.3753 },
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    ],
    videos: ['/videos/property-tour-6.mp4'],
    host: users[13], // Elena
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    amenities: ['Piscine', 'Vue caldera', 'Terrasse', 'Concierge', 'Chef priv\u00e9', 'WiFi', 'Climatisation'],
    rating: 4.9,
    reviewCount: 36,
    featured: true,
  },
  // 13 — Vente, Appartement, Barcelone
  {
    id: 'prop-013',
    title: 'Loft industriel r\u00e9nov\u00e9 \u00e0 El Born',
    description:
      'Superbe loft de 120m\u00b2 dans un ancien atelier du quartier El Born. Hauteur sous plafond 4m, briques apparentes, verrerie industrielle. Mezzanine, terrasse priv\u00e9e 25m\u00b2.',
    type: 'appartement',
    transactionType: 'vente',
    price: 520000,
    currency: 'EUR',
    location: { city: 'Barcelone', country: 'Espagne', address: 'Carrer del Rec 28', lat: 41.3851, lng: 2.183 },
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[15], // Carlos
    bedrooms: 2,
    bathrooms: 1,
    area: 120,
    floor: 1,
    amenities: ['Terrasse', 'Mezzanine', 'Hauteur sous plafond', 'Briques', 'Verrerie', 'Climatisation'],
    rating: 4.7,
    reviewCount: 21,
    featured: false,
    analytics: {
      rendementBrut: 5.5,
      rendementNet: 4.0,
      prixM2: 4333,
      dpe: 'D',
      etatGeneral: 'Tr\u00e8s bon',
      anneeConstruction: 1935,
      potentielPlusValue: 14,
      roi5ans: 25.0,
      roi10ans: 55.0,
      tauxOccupation: 92,
    },
  },
  // 14 — Location-lt, Appartement, Neuch\u00e2tel
  {
    id: 'prop-014',
    title: '2.5 pi\u00e8ces meubl\u00e9 proche universit\u00e9',
    description:
      'Appartement de 2.5 pi\u00e8ces enti\u00e8rement meubl\u00e9, id\u00e9al pour \u00e9tudiants ou jeunes professionnels. \u00c0 10 minutes \u00e0 pied de l\u2019Universit\u00e9 de Neuch\u00e2tel. Charges comprises.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 1350,
    currency: 'CHF',
    location: { city: 'Neuch\u00e2tel', country: 'Suisse', address: 'Rue de la Pierre-\u00e0-Mazel 5', lat: 46.9917, lng: 6.9295 },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585412459212-a]c67e1c6f28?w=800&h=600&fit=crop',
    ],
    videos: [],
    host: users[14], // Jean-Luc
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    floor: 2,
    amenities: ['Meubl\u00e9', 'Charges comprises', 'Buanderie', 'Cave', 'Parking v\u00e9lo'],
    rating: 4.5,
    reviewCount: 27,
    featured: false,
  },
];

// ─── SOCIAL POSTS (10) ──────────────────────────────────────────────────────

export const socialPosts: SocialPost[] = [
  {
    id: 'post-001',
    author: users[0],
    content:
      'Nouvelle acquisition \u00e0 Verbier ! Ce chalet d\u2019exception est d\u00e9sormais disponible pour des s\u00e9jours inoubliables. Ski-in/ski-out, spa priv\u00e9, vue \u00e0 couper le souffle. R\u00e9servations ouvertes pour la saison 2026. \ud83c\udfbf\u2744\ufe0f',
    media: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 342,
    comments: [
      {
        id: 'comment-001',
        author: users[1],
        content: 'Absolument magnifique ! Le chalet est une vraie p\u00e9pite.',
        createdAt: '2026-03-28T14:30:00Z',
        likes: 12,
      },
      {
        id: 'comment-002',
        author: users[2],
        content: 'Quel rendement tu vises sur la saison ?',
        createdAt: '2026-03-28T15:10:00Z',
        likes: 5,
      },
    ],
    createdAt: '2026-03-28T10:00:00Z',
    location: 'Verbier, Suisse',
    property: properties[4],
  },
  {
    id: 'post-002',
    author: users[3],
    content:
      'Un nouveau riad vient de rejoindre notre collection en M\u00e9dina de Marrakech. Architecture traditionnelle, r\u00e9novation contemporaine. Le meilleur des deux mondes. #Marrakech #Riad #Investissement',
    media: [
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 567,
    comments: [
      {
        id: 'comment-003',
        author: users[12],
        content: 'Magnifique ! C\u2019est exactement ce que je recherche. DM ?',
        createdAt: '2026-03-27T09:45:00Z',
        likes: 8,
      },
    ],
    createdAt: '2026-03-27T08:00:00Z',
    location: 'Marrakech, Maroc',
    property: properties[3],
  },
  {
    id: 'post-003',
    author: users[5],
    content:
      'Just listed : Penthouse 450m\u00b2 sur Palm Jumeirah. Finitions Armani Casa, piscine priv\u00e9e sur le toit. Vue 360\u00b0 sur le Golfe. Le summum du luxe \u00e0 Dubai. #Dubai #Luxury #RealEstate',
    media: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    ],
    type: 'reel',
    likes: 1240,
    comments: [
      {
        id: 'comment-004',
        author: users[2],
        content: 'Le march\u00e9 de Dubai est en feu en ce moment. Bon timing !',
        createdAt: '2026-03-26T18:20:00Z',
        likes: 22,
      },
      {
        id: 'comment-005',
        author: users[10],
        content: 'Prix demand\u00e9 ? Je connais un investisseur int\u00e9ress\u00e9.',
        createdAt: '2026-03-26T19:00:00Z',
        likes: 3,
      },
    ],
    createdAt: '2026-03-26T16:00:00Z',
    location: 'Dubai, EAU',
    property: properties[5],
  },
  {
    id: 'post-004',
    author: users[1],
    content:
      'Retour sur ma formation "Investir dans l\u2019immobilier locatif en Suisse" donn\u00e9e ce week-end \u00e0 Lausanne. 45 participants passionn\u00e9s ! Prochaine session en mai. #Formation #Immobilier #Suisse',
    media: [
      'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523580494863-6ead3f3dda5b?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 189,
    comments: [],
    createdAt: '2026-03-25T12:00:00Z',
    location: 'Lausanne, Suisse',
  },
  {
    id: 'post-005',
    author: users[4],
    content:
      'Visite virtuelle de cette villa \u00e0 Nice. Tournage drone + Matterport. Le futur de la visite immobili\u00e8re est d\u00e9j\u00e0 l\u00e0 ! #Drone #VillaLuxe #CoteDAzur',
    media: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    ],
    type: 'reel',
    likes: 423,
    comments: [
      {
        id: 'comment-006',
        author: users[0],
        content: 'Super boulot Lucas ! Tu es dispo pour un shooting \u00e0 Verbier ?',
        createdAt: '2026-03-24T10:15:00Z',
        likes: 6,
      },
    ],
    createdAt: '2026-03-24T09:00:00Z',
    location: 'Nice, France',
    property: properties[2],
  },
  {
    id: 'post-006',
    author: users[6],
    content:
      'Lisbonne continue d\u2019attirer les investisseurs francophones. Notre derni\u00e8re maison \u00e0 Alfama s\u2019est vendue en 48h. Le march\u00e9 portugais reste tr\u00e8s dynamique. #Lisbonne #GoldenVisa #Portugal',
    media: [
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 278,
    comments: [
      {
        id: 'comment-007',
        author: users[2],
        content: 'Int\u00e9ressant. Tu as d\u2019autres biens \u00e0 Alfama ?',
        createdAt: '2026-03-23T14:00:00Z',
        likes: 4,
      },
    ],
    createdAt: '2026-03-23T11:00:00Z',
    location: 'Lisbonne, Portugal',
    property: properties[7],
  },
  {
    id: 'post-007',
    author: users[13],
    content:
      'Coucher de soleil depuis notre villa \u00e0 Santorin. Ces moments qui n\u2019ont pas de prix... mais qui g\u00e9n\u00e8rent un excellent rendement ! #Santorin #Gr\u00e8ce #LocationSaisonni\u00e8re',
    media: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    ],
    type: 'story',
    likes: 892,
    comments: [],
    createdAt: '2026-03-22T19:30:00Z',
    location: 'Santorin, Gr\u00e8ce',
    property: properties[11],
  },
  {
    id: 'post-008',
    author: users[8],
    content:
      'Notre projet de r\u00e9novation Minergie \u00e0 Lausanne est termin\u00e9 ! Passage de F \u00e0 A en performance \u00e9nerg\u00e9tique. Plus-value de 35% sur le bien. La r\u00e9novation \u00e9nerg\u00e9tique, c\u2019est l\u2019avenir. #Minergie #R\u00e9novation #Durable',
    media: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 156,
    comments: [
      {
        id: 'comment-008',
        author: users[8],
        content: 'Le co\u00fbt total de la r\u00e9novation a \u00e9t\u00e9 de 280\u2019000 CHF pour un gain de valeur de 450\u2019000 CHF.',
        createdAt: '2026-03-21T11:00:00Z',
        likes: 14,
      },
    ],
    createdAt: '2026-03-21T09:00:00Z',
    location: 'Lausanne, Suisse',
  },
  {
    id: 'post-009',
    author: users[9],
    content:
      'Webinaire gratuit demain : "Investir en Afrique de l\u2019Ouest : opportunit\u00e9s et pi\u00e8ges \u00e0 \u00e9viter". 200+ inscrits ! Rejoignez-nous. #Afrique #Investissement #Webinaire',
    media: [
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 98,
    comments: [],
    createdAt: '2026-03-20T14:00:00Z',
    location: 'Dakar, S\u00e9n\u00e9gal',
  },
  {
    id: 'post-010',
    author: users[14],
    content:
      'Le march\u00e9 immobilier neuch\u00e2telois en 2026 : les prix se stabilisent enfin apr\u00e8s 3 ans de hausse. Bonne nouvelle pour les primo-acc\u00e9dants. Analyse compl\u00e8te sur notre blog. #Neuch\u00e2tel #MarchéImmobilier',
    media: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    ],
    type: 'post',
    likes: 134,
    comments: [
      {
        id: 'comment-009',
        author: users[11],
        content: 'Enfin de bonnes nouvelles ! Merci pour l\u2019analyse Jean-Luc.',
        createdAt: '2026-03-19T16:30:00Z',
        likes: 7,
      },
    ],
    createdAt: '2026-03-19T10:00:00Z',
    location: 'Neuch\u00e2tel, Suisse',
  },
];

// ─── CONVERSATIONS (7) ──────────────────────────────────────────────────────

export const conversations: Conversation[] = [
  {
    id: 'conv-001',
    participant: users[1],
    messages: [
      { id: 'msg-001', senderId: 'user-002', content: 'Bonjour Karim, j\u2019ai un client int\u00e9ress\u00e9 par le chalet de Verbier.', timestamp: '2026-03-31T09:00:00Z', read: true },
      { id: 'msg-002', senderId: 'user-001', content: 'Super Sophie ! Il est disponible \u00e0 partir du 15 avril. Quel budget pour ton client ?', timestamp: '2026-03-31T09:15:00Z', read: true },
      { id: 'msg-003', senderId: 'user-002', content: 'Budget illimit\u00e9, c\u2019est un family office genevois. On peut organiser une visite cette semaine ?', timestamp: '2026-03-31T09:30:00Z', read: false },
    ],
    unreadCount: 1,
    lastMessage: 'Budget illimit\u00e9, c\u2019est un family office genevois. On peut organiser une visite cette semaine ?',
    isOnline: true,
  },
  {
    id: 'conv-002',
    participant: users[3],
    messages: [
      { id: 'msg-004', senderId: 'user-004', content: 'Salam Karim ! Le riad est pr\u00eat pour les photos. Tu viens quand \u00e0 Marrakech ?', timestamp: '2026-03-30T15:00:00Z', read: true },
      { id: 'msg-005', senderId: 'user-001', content: 'Inchallah la semaine prochaine. Je te confirme les dates demain.', timestamp: '2026-03-30T16:00:00Z', read: true },
      { id: 'msg-006', senderId: 'user-004', content: 'Parfait ! J\u2019ai aussi 2 nouveaux riads \u00e0 te montrer pour le portefeuille.', timestamp: '2026-03-30T16:30:00Z', read: true },
    ],
    unreadCount: 0,
    lastMessage: 'Parfait ! J\u2019ai aussi 2 nouveaux riads \u00e0 te montrer pour le portefeuille.',
    isOnline: true,
  },
  {
    id: 'conv-003',
    participant: users[2],
    messages: [
      { id: 'msg-007', senderId: 'user-001', content: 'Marc, tu as analys\u00e9 le rendement du bureau \u00e0 Gen\u00e8ve ?', timestamp: '2026-03-29T11:00:00Z', read: true },
      { id: 'msg-008', senderId: 'user-003', content: 'Oui, 4.8% brut c\u2019est int\u00e9ressant pour Gen\u00e8ve. Je te envoie mon analyse compl\u00e8te ce soir.', timestamp: '2026-03-29T14:00:00Z', read: true },
      { id: 'msg-009', senderId: 'user-003', content: 'Voici l\u2019analyse PDF en pi\u00e8ce jointe. Le net apr\u00e8s charges est \u00e0 3.6%.', timestamp: '2026-03-29T20:00:00Z', read: false },
      { id: 'msg-010', senderId: 'user-003', content: 'Tu as pu regarder ?', timestamp: '2026-03-30T08:00:00Z', read: false },
    ],
    unreadCount: 2,
    lastMessage: 'Tu as pu regarder ?',
    isOnline: false,
  },
  {
    id: 'conv-004',
    participant: users[11],
    messages: [
      { id: 'msg-011', senderId: 'user-012', content: 'Bonjour, je suis int\u00e9ress\u00e9e par l\u2019appartement \u00e0 Neuch\u00e2tel. Est-il toujours disponible ?', timestamp: '2026-03-28T10:00:00Z', read: true },
      { id: 'msg-012', senderId: 'user-001', content: 'Bonjour Cl\u00e9mence ! Oui tout \u00e0 fait, quand souhaitez-vous le visiter ?', timestamp: '2026-03-28T10:30:00Z', read: true },
      { id: 'msg-013', senderId: 'user-012', content: 'Samedi matin si possible ? Vers 10h ?', timestamp: '2026-03-28T11:00:00Z', read: true },
    ],
    unreadCount: 0,
    lastMessage: 'Samedi matin si possible ? Vers 10h ?',
    isOnline: false,
  },
  {
    id: 'conv-005',
    participant: users[5],
    messages: [
      { id: 'msg-014', senderId: 'user-006', content: 'Hi Karim, I have a VIP client looking for a ski chalet in Switzerland. Any recommendations?', timestamp: '2026-03-27T12:00:00Z', read: true },
      { id: 'msg-015', senderId: 'user-001', content: 'Absolutely Yasmin! Our Verbier chalet would be perfect. I\u2019ll send the full dossier.', timestamp: '2026-03-27T13:00:00Z', read: true },
    ],
    unreadCount: 0,
    lastMessage: 'Absolutely Yasmin! Our Verbier chalet would be perfect. I\u2019ll send the full dossier.',
    isOnline: true,
  },
  {
    id: 'conv-006',
    participant: users[7],
    messages: [
      { id: 'msg-016', senderId: 'user-001', content: 'Nathalie, j\u2019aurais besoin de votre expertise pour un acte de vente \u00e0 Neuch\u00e2tel.', timestamp: '2026-03-26T09:00:00Z', read: true },
      { id: 'msg-017', senderId: 'user-008', content: 'Bien s\u00fbr Karim. Envoyez-moi les documents et je vous fais un devis. D\u00e9lai habituel : 10 jours ouvrables.', timestamp: '2026-03-26T11:00:00Z', read: true },
      { id: 'msg-018', senderId: 'user-001', content: 'Parfait, je vous envoie tout demain matin.', timestamp: '2026-03-26T11:30:00Z', read: true },
      { id: 'msg-019', senderId: 'user-008', content: 'J\u2019ai bien re\u00e7u les documents. Je reviens vers vous mercredi avec le projet d\u2019acte.', timestamp: '2026-03-27T09:00:00Z', read: false },
    ],
    unreadCount: 1,
    lastMessage: 'J\u2019ai bien re\u00e7u les documents. Je reviens vers vous mercredi avec le projet d\u2019acte.',
    isOnline: false,
  },
  {
    id: 'conv-007',
    participant: users[9],
    messages: [
      { id: 'msg-020', senderId: 'user-010', content: 'Karim, j\u2019ai 3 investisseurs s\u00e9n\u00e9galais int\u00e9ress\u00e9s par vos formations. Commission apporteur possible ?', timestamp: '2026-03-25T14:00:00Z', read: true },
      { id: 'msg-021', senderId: 'user-001', content: 'Absolument Fatima ! 15% de commission sur chaque inscription. Je t\u2019envoie le lien d\u2019affiliation.', timestamp: '2026-03-25T15:00:00Z', read: true },
    ],
    unreadCount: 0,
    lastMessage: 'Absolument Fatima ! 15% de commission sur chaque inscription. Je t\u2019envoie le lien d\u2019affiliation.',
    isOnline: false,
  },
];

// ─── RESERVATIONS (8) ───────────────────────────────────────────────────────

export const reservations: Reservation[] = [
  {
    id: 'res-001',
    property: properties[4], // Chalet Verbier
    guest: users[2],
    checkIn: '2026-04-15',
    checkOut: '2026-04-22',
    status: 'confirmed',
    totalPrice: 5950,
    options: ['Transfert a\u00e9roport', 'Forfait ski'],
  },
  {
    id: 'res-002',
    property: properties[1], // Studio Gen\u00e8ve
    guest: users[11],
    checkIn: '2026-04-05',
    checkOut: '2026-04-08',
    status: 'pending',
    totalPrice: 360,
  },
  {
    id: 'res-003',
    property: properties[11], // Villa Santorin
    guest: users[0],
    checkIn: '2026-06-20',
    checkOut: '2026-06-27',
    status: 'confirmed',
    totalPrice: 3150,
    options: ['Chef priv\u00e9', 'Excursion bateau'],
  },
  {
    id: 'res-004',
    property: properties[8], // Villa Phuket
    guest: users[2],
    checkIn: '2026-01-10',
    checkOut: '2026-01-24',
    status: 'completed',
    totalPrice: 5320,
  },
  {
    id: 'res-005',
    property: properties[4], // Chalet Verbier
    guest: users[5],
    checkIn: '2026-02-14',
    checkOut: '2026-02-21',
    status: 'completed',
    totalPrice: 5950,
    options: ['Transfert', 'Moniteur de ski'],
  },
  {
    id: 'res-006',
    property: properties[1], // Studio Gen\u00e8ve
    guest: users[9],
    checkIn: '2026-04-10',
    checkOut: '2026-04-12',
    status: 'pending',
    totalPrice: 240,
  },
  {
    id: 'res-007',
    property: properties[3], // Riad Marrakech
    guest: users[6],
    checkIn: '2026-03-01',
    checkOut: '2026-03-05',
    status: 'cancelled',
    totalPrice: 1800,
  },
  {
    id: 'res-008',
    property: properties[11], // Villa Santorin
    guest: users[15],
    checkIn: '2026-07-10',
    checkOut: '2026-07-17',
    status: 'confirmed',
    totalPrice: 3150,
    options: ['Concierge VIP'],
  },
];

// ─── FORMATIONS (8) ─────────────────────────────────────────────────────────

export const formations: Formation[] = [
  {
    id: 'form-001',
    title: 'Investissement locatif : de z\u00e9ro \u00e0 rentier',
    description:
      'Formation compl\u00e8te pour ma\u00eetriser l\u2019investissement locatif. De la recherche du bien au calcul de rentabilit\u00e9, en passant par le financement et la fiscalit\u00e9 suisse.',
    category: 'Investissement',
    level: 'debutant',
    instructor: users[0],
    thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop',
    price: 497,
    currency: 'CHF',
    duration: '12h',
    modules: [
      {
        id: 'mod-001',
        title: 'Les fondamentaux de l\u2019investissement',
        duration: '2h30',
        lessons: [
          { id: 'les-001', title: 'Pourquoi investir dans l\u2019immobilier', duration: '30min', completed: true },
          { id: 'les-002', title: 'Types de biens et strat\u00e9gies', duration: '45min', completed: true },
          { id: 'les-003', title: 'Calculer la rentabilit\u00e9', duration: '1h15', completed: false },
        ],
      },
      {
        id: 'mod-002',
        title: 'Financement et fiscalit\u00e9',
        duration: '3h',
        lessons: [
          { id: 'les-004', title: 'Obtenir un cr\u00e9dit hypoth\u00e9caire', duration: '1h', completed: false },
          { id: 'les-005', title: 'Fiscalit\u00e9 immobili\u00e8re suisse', duration: '1h', completed: false },
          { id: 'les-006', title: 'Optimisation fiscale', duration: '1h', completed: false },
        ],
      },
      {
        id: 'mod-003',
        title: 'Gestion locative',
        duration: '3h30',
        lessons: [
          { id: 'les-007', title: 'Trouver et s\u00e9lectionner les locataires', duration: '1h', completed: false },
          { id: 'les-008', title: 'Bail et droit du bail', duration: '1h30', completed: false },
          { id: 'les-009', title: 'Gestion quotidienne', duration: '1h', completed: false },
        ],
      },
      {
        id: 'mod-004',
        title: 'Strat\u00e9gies avanc\u00e9es',
        duration: '3h',
        lessons: [
          { id: 'les-010', title: 'Multi-lots et immeubles', duration: '1h', completed: false },
          { id: 'les-011', title: 'Investir \u00e0 l\u2019\u00e9tranger', duration: '1h', completed: false },
          { id: 'les-012', title: '\u00c9tude de cas r\u00e9els', duration: '1h', completed: false },
        ],
      },
    ],
    rating: 4.8,
    studentCount: 342,
    previewVideo: '/videos/formation-preview-1.mp4',
  },
  {
    id: 'form-002',
    title: 'Ma\u00eetriser la location courte dur\u00e9e',
    description:
      'Tout savoir pour r\u00e9ussir en location courte dur\u00e9e : plateformes, pricing dynamique, automatisation, r\u00e9glementation et exp\u00e9rience client.',
    category: 'Location',
    level: 'intermediaire',
    instructor: users[3],
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    price: 397,
    currency: 'CHF',
    duration: '8h',
    modules: [
      {
        id: 'mod-005',
        title: 'Lancer son activit\u00e9',
        duration: '2h',
        lessons: [
          { id: 'les-013', title: 'Choisir sa niche', duration: '30min' },
          { id: 'les-014', title: 'Cadre l\u00e9gal et autorisations', duration: '45min' },
          { id: 'les-015', title: 'Pr\u00e9parer son bien', duration: '45min' },
        ],
      },
      {
        id: 'mod-006',
        title: 'Optimiser ses revenus',
        duration: '3h',
        lessons: [
          { id: 'les-016', title: 'Pricing dynamique', duration: '1h' },
          { id: 'les-017', title: 'Photographie et annonces', duration: '1h' },
          { id: 'les-018', title: 'Automatisation', duration: '1h' },
        ],
      },
      {
        id: 'mod-007',
        title: 'Exp\u00e9rience client 5 \u00e9toiles',
        duration: '3h',
        lessons: [
          { id: 'les-019', title: 'Accueil et communication', duration: '1h' },
          { id: 'les-020', title: 'G\u00e9rer les avis', duration: '1h' },
          { id: 'les-021', title: 'Fid\u00e9lisation et upselling', duration: '1h' },
        ],
      },
    ],
    rating: 4.9,
    studentCount: 218,
  },
  {
    id: 'form-003',
    title: 'N\u00e9gociation immobili\u00e8re : vendre au meilleur prix',
    description:
      'Techniques de n\u00e9gociation \u00e9prouv\u00e9es pour vendre vos biens rapidement et au meilleur prix. Psychologie de l\u2019acheteur, strat\u00e9gies de pricing, closing.',
    category: 'Vente',
    level: 'avance',
    instructor: users[1],
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    price: 597,
    currency: 'CHF',
    duration: '6h',
    modules: [
      {
        id: 'mod-008',
        title: 'Psychologie de la n\u00e9gociation',
        duration: '2h',
        lessons: [
          { id: 'les-022', title: 'Comprendre l\u2019acheteur', duration: '1h' },
          { id: 'les-023', title: 'Techniques d\u2019influence', duration: '1h' },
        ],
      },
      {
        id: 'mod-009',
        title: 'Strat\u00e9gies de vente',
        duration: '2h',
        lessons: [
          { id: 'les-024', title: 'Fixer le bon prix', duration: '1h' },
          { id: 'les-025', title: 'Cr\u00e9er l\u2019urgence', duration: '1h' },
        ],
      },
      {
        id: 'mod-010',
        title: 'Closing et suivi',
        duration: '2h',
        lessons: [
          { id: 'les-026', title: 'Techniques de closing', duration: '1h' },
          { id: 'les-027', title: 'Apr\u00e8s-vente et recommandations', duration: '1h' },
        ],
      },
    ],
    rating: 4.7,
    studentCount: 156,
  },
  {
    id: 'form-004',
    title: 'Immobilier de luxe : codes et strat\u00e9gies',
    description:
      'Apprenez les sp\u00e9cificit\u00e9s du march\u00e9 du luxe : client\u00e8le UHNWI, marketing exclusif, discr\u00e9tion, r\u00e9seaux internationaux et closing haut de gamme.',
    category: 'Luxe',
    level: 'avance',
    instructor: users[5],
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    price: 897,
    currency: 'CHF',
    duration: '10h',
    modules: [
      {
        id: 'mod-011',
        title: 'Le march\u00e9 du luxe',
        duration: '3h',
        lessons: [
          { id: 'les-028', title: 'Comprendre la client\u00e8le UHNWI', duration: '1h' },
          { id: 'les-029', title: 'March\u00e9s de luxe mondiaux', duration: '1h' },
          { id: 'les-030', title: 'Tendances et perspectives', duration: '1h' },
        ],
      },
      {
        id: 'mod-012',
        title: 'Marketing et vente de luxe',
        duration: '4h',
        lessons: [
          { id: 'les-031', title: 'Branding personnel', duration: '1h' },
          { id: 'les-032', title: 'Off-market et discr\u00e9tion', duration: '1h30' },
          { id: 'les-033', title: 'R\u00e9seaux internationaux', duration: '1h30' },
        ],
      },
      {
        id: 'mod-013',
        title: 'Closing haut de gamme',
        duration: '3h',
        lessons: [
          { id: 'les-034', title: 'N\u00e9gociation avec les UHNWI', duration: '1h30' },
          { id: 'les-035', title: 'Aspects juridiques internationaux', duration: '1h30' },
        ],
      },
    ],
    rating: 4.9,
    studentCount: 89,
    previewVideo: '/videos/formation-preview-4.mp4',
  },
  {
    id: 'form-005',
    title: 'R\u00e9novation rentable : maximiser la plus-value',
    description:
      'Guide complet pour r\u00e9nover un bien immobilier de mani\u00e8re rentable. Budget, planning, choix des mat\u00e9riaux, Minergie, et calcul de la plus-value.',
    category: 'R\u00e9novation',
    level: 'intermediaire',
    instructor: users[8],
    thumbnail: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',
    price: 347,
    currency: 'CHF',
    duration: '7h',
    modules: [
      {
        id: 'mod-014',
        title: 'Planifier sa r\u00e9novation',
        duration: '2h',
        lessons: [
          { id: 'les-036', title: 'Diagnostic et \u00e9tat des lieux', duration: '1h' },
          { id: 'les-037', title: 'Budget et retour sur investissement', duration: '1h' },
        ],
      },
      {
        id: 'mod-015',
        title: 'R\u00e9novation \u00e9nerg\u00e9tique',
        duration: '3h',
        lessons: [
          { id: 'les-038', title: 'Isolation et chauffage', duration: '1h' },
          { id: 'les-039', title: 'Label Minergie', duration: '1h' },
          { id: 'les-040', title: 'Subventions et aides', duration: '1h' },
        ],
      },
      {
        id: 'mod-016',
        title: 'Gestion de chantier',
        duration: '2h',
        lessons: [
          { id: 'les-041', title: 'Choisir ses artisans', duration: '1h' },
          { id: 'les-042', title: 'Suivi et r\u00e9ception', duration: '1h' },
        ],
      },
    ],
    rating: 4.6,
    studentCount: 178,
  },
  {
    id: 'form-006',
    title: 'Marketing digital pour l\u2019immobilier',
    description:
      'Strat\u00e9gies de marketing digital adapt\u00e9es \u00e0 l\u2019immobilier : r\u00e9seaux sociaux, SEO, publicit\u00e9 en ligne, personal branding et g\u00e9n\u00e9ration de leads.',
    category: 'Marketing',
    level: 'debutant',
    instructor: users[4],
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop',
    price: 297,
    currency: 'CHF',
    duration: '6h',
    modules: [
      {
        id: 'mod-017',
        title: 'Fondamentaux du marketing immo',
        duration: '2h',
        lessons: [
          { id: 'les-043', title: 'Personal branding', duration: '1h' },
          { id: 'les-044', title: 'Cr\u00e9er du contenu engageant', duration: '1h' },
        ],
      },
      {
        id: 'mod-018',
        title: 'R\u00e9seaux sociaux',
        duration: '2h',
        lessons: [
          { id: 'les-045', title: 'Instagram et TikTok pour l\u2019immo', duration: '1h' },
          { id: 'les-046', title: 'LinkedIn immobilier', duration: '1h' },
        ],
      },
      {
        id: 'mod-019',
        title: 'G\u00e9n\u00e9ration de leads',
        duration: '2h',
        lessons: [
          { id: 'les-047', title: 'SEO immobilier', duration: '1h' },
          { id: 'les-048', title: 'Publicit\u00e9 Meta et Google', duration: '1h' },
        ],
      },
    ],
    rating: 4.5,
    studentCount: 267,
  },
  {
    id: 'form-007',
    title: 'Droit immobilier suisse : l\u2019essentiel',
    description:
      'Ma\u00eetrisez les fondamentaux du droit immobilier suisse : propri\u00e9t\u00e9, copropri\u00e9t\u00e9, PPE, droit du bail, s\u00e9questre notarial et transfert de propri\u00e9t\u00e9.',
    category: 'Juridique',
    level: 'intermediaire',
    instructor: users[7],
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
    price: 447,
    currency: 'CHF',
    duration: '9h',
    modules: [
      {
        id: 'mod-020',
        title: 'Droit de la propri\u00e9t\u00e9',
        duration: '3h',
        lessons: [
          { id: 'les-049', title: 'Propri\u00e9t\u00e9 et copropri\u00e9t\u00e9', duration: '1h' },
          { id: 'les-050', title: 'PPE (Propri\u00e9t\u00e9 par \u00e9tages)', duration: '1h' },
          { id: 'les-051', title: 'Registre foncier', duration: '1h' },
        ],
      },
      {
        id: 'mod-021',
        title: 'Droit du bail',
        duration: '3h',
        lessons: [
          { id: 'les-052', title: 'Le contrat de bail', duration: '1h' },
          { id: 'les-053', title: 'Loyers et charges', duration: '1h' },
          { id: 'les-054', title: 'R\u00e9siliation et litiges', duration: '1h' },
        ],
      },
      {
        id: 'mod-022',
        title: 'Transfert de propri\u00e9t\u00e9',
        duration: '3h',
        lessons: [
          { id: 'les-055', title: 'Processus d\u2019achat/vente', duration: '1h' },
          { id: 'les-056', title: 'R\u00f4le du notaire', duration: '1h' },
          { id: 'les-057', title: 'Fiscalit\u00e9 des transactions', duration: '1h' },
        ],
      },
    ],
    rating: 4.8,
    studentCount: 134,
  },
  {
    id: 'form-008',
    title: 'Photographie immobili\u00e8re professionnelle',
    description:
      'Apprenez \u00e0 photographier des biens immobiliers comme un pro. Mat\u00e9riel, \u00e9clairage, composition, retouche, vid\u00e9o et drone.',
    category: 'Photographie',
    level: 'debutant',
    instructor: users[15],
    thumbnail: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=600&fit=crop',
    price: 247,
    currency: 'CHF',
    duration: '5h',
    modules: [
      {
        id: 'mod-023',
        title: 'Mat\u00e9riel et bases',
        duration: '1h30',
        lessons: [
          { id: 'les-058', title: 'Choisir son mat\u00e9riel', duration: '45min' },
          { id: 'les-059', title: 'Les bases de la photo immo', duration: '45min' },
        ],
      },
      {
        id: 'mod-024',
        title: 'Prise de vue',
        duration: '2h',
        lessons: [
          { id: 'les-060', title: '\u00c9clairage naturel et artificiel', duration: '1h' },
          { id: 'les-061', title: 'Composition et angles', duration: '1h' },
        ],
      },
      {
        id: 'mod-025',
        title: 'Post-production',
        duration: '1h30',
        lessons: [
          { id: 'les-062', title: 'Retouche Lightroom', duration: '45min' },
          { id: 'les-063', title: 'Vid\u00e9o et drone', duration: '45min' },
        ],
      },
    ],
    rating: 4.7,
    studentCount: 312,
    previewVideo: '/videos/formation-preview-8.mp4',
  },
];

// ─── EVENTS (6) ─────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'webinaire' | 'conference' | 'atelier' | 'networking';
  thumbnail: string;
  speaker: User;
  date: string;
  time: string;
  duration: string;
  location: string;
  isOnline: boolean;
  spotsTotal: number;
  spotsTaken: number;
  price: number;
  currency: string;
  tags: string[];
}

export const events: Event[] = [
  {
    id: 'evt-001',
    title: 'Investir en Suisse romande en 2026',
    description:
      'Webinaire complet sur les opportunit\u00e9s d\u2019investissement en Suisse romande. Analyse du march\u00e9, tendances, zones \u00e0 fort potentiel et strat\u00e9gies gagnantes.',
    type: 'webinaire',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
    speaker: users[0],
    date: '2026-04-15',
    time: '18:00',
    duration: '1h30',
    location: 'En ligne (Zoom)',
    isOnline: true,
    spotsTotal: 200,
    spotsTaken: 156,
    price: 0,
    currency: 'CHF',
    tags: ['Investissement', 'Suisse', 'March\u00e9'],
  },
  {
    id: 'evt-002',
    title: 'Conf\u00e9rence E-Dome : L\u2019avenir de l\u2019immobilier digital',
    description:
      'Grande conf\u00e9rence annuelle E-Dome r\u00e9unissant les acteurs cl\u00e9s de la proptech. Innovations, IA, blockchain, tokenisation immobili\u00e8re et nouvelles tendances.',
    type: 'conference',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    speaker: users[14],
    date: '2026-05-20',
    time: '09:00',
    duration: '8h',
    location: 'Palais de Beaulieu, Lausanne',
    isOnline: false,
    spotsTotal: 500,
    spotsTaken: 312,
    price: 150,
    currency: 'CHF',
    tags: ['Proptech', 'Innovation', 'Conf\u00e9rence'],
  },
  {
    id: 'evt-003',
    title: 'Atelier : Home staging pour maximiser la vente',
    description:
      'Atelier pratique de home staging. Apprenez \u00e0 mettre en valeur un bien pour acc\u00e9l\u00e9rer la vente et obtenir le meilleur prix. Exercices sur un bien r\u00e9el.',
    type: 'atelier',
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
    speaker: users[1],
    date: '2026-04-25',
    time: '14:00',
    duration: '3h',
    location: 'Espace Fusterie, Gen\u00e8ve',
    isOnline: false,
    spotsTotal: 30,
    spotsTaken: 24,
    price: 85,
    currency: 'CHF',
    tags: ['Home Staging', 'Vente', 'Pratique'],
  },
  {
    id: 'evt-004',
    title: 'Networking : Investisseurs immobiliers romands',
    description:
      'Soir\u00e9e networking d\u00e9di\u00e9e aux investisseurs immobiliers de Suisse romande. \u00c9change d\u2019exp\u00e9riences, deal-sharing et opportunit\u00e9s de co-investissement.',
    type: 'networking',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    speaker: users[2],
    date: '2026-04-30',
    time: '18:30',
    duration: '3h',
    location: 'H\u00f4tel Royal Savoy, Lausanne',
    isOnline: false,
    spotsTotal: 80,
    spotsTaken: 67,
    price: 45,
    currency: 'CHF',
    tags: ['Networking', 'Investisseurs', 'Co-investissement'],
  },
  {
    id: 'evt-005',
    title: 'Webinaire : Fiscalit\u00e9 immobili\u00e8re internationale',
    description:
      'Comment optimiser la fiscalit\u00e9 de vos investissements immobiliers \u00e0 l\u2019\u00e9tranger. Conventions de double imposition, structures holding, Golden Visa.',
    type: 'webinaire',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    speaker: users[7],
    date: '2026-05-10',
    time: '12:00',
    duration: '1h',
    location: 'En ligne (Zoom)',
    isOnline: true,
    spotsTotal: 150,
    spotsTaken: 89,
    price: 0,
    currency: 'CHF',
    tags: ['Fiscalit\u00e9', 'International', 'Juridique'],
  },
  {
    id: 'evt-006',
    title: 'Atelier photo : Sublimer vos biens immobiliers',
    description:
      'Atelier pratique de photographie immobili\u00e8re. Apportez votre appareil photo et apprenez \u00e0 cr\u00e9er des visuels professionnels pour vos annonces.',
    type: 'atelier',
    thumbnail: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=600&fit=crop',
    speaker: users[15],
    date: '2026-05-15',
    time: '10:00',
    duration: '4h',
    location: 'Studio E-Dome, Neuch\u00e2tel',
    isOnline: false,
    spotsTotal: 15,
    spotsTaken: 12,
    price: 120,
    currency: 'CHF',
    tags: ['Photographie', 'Pratique', 'Immobilier'],
  },
];

// ─── NOTIFICATIONS (12) ─────────────────────────────────────────────────────

export const notifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'reservation',
    title: 'Nouvelle r\u00e9servation',
    message: 'Cl\u00e9mence Moreau souhaite r\u00e9server le Studio \u00e0 Gen\u00e8ve du 5 au 8 avril.',
    read: false,
    createdAt: '2026-04-01T08:00:00Z',
    href: '/reservations/res-002',
  },
  {
    id: 'notif-002',
    type: 'message',
    title: 'Nouveau message',
    message: 'Sophie Durand vous a envoy\u00e9 un message concernant le chalet de Verbier.',
    read: false,
    createdAt: '2026-03-31T09:30:00Z',
    href: '/messages/conv-001',
  },
  {
    id: 'notif-003',
    type: 'payment',
    title: 'Paiement re\u00e7u',
    message: 'Vous avez re\u00e7u 5\u2019950 CHF pour la r\u00e9servation du chalet de Verbier.',
    read: false,
    createdAt: '2026-03-30T14:00:00Z',
    href: '/dashboard/finances',
  },
  {
    id: 'notif-004',
    type: 'review',
    title: 'Nouvel avis',
    message: 'Marc Favre a laiss\u00e9 un avis 5 \u00e9toiles sur la villa de Phuket.',
    read: true,
    createdAt: '2026-03-29T16:00:00Z',
    href: '/properties/prop-009#reviews',
  },
  {
    id: 'notif-005',
    type: 'follow',
    title: 'Nouveau follower',
    message: 'Elena Papadopoulos vous suit d\u00e9sormais.',
    read: true,
    createdAt: '2026-03-28T20:00:00Z',
    href: '/profile/user-014',
  },
  {
    id: 'notif-006',
    type: 'system',
    title: 'Mise \u00e0 jour de la plateforme',
    message: 'Nouvelle fonctionnalit\u00e9 : visites virtuelles 3D disponibles pour vos annonces.',
    read: true,
    createdAt: '2026-03-27T10:00:00Z',
    href: '/updates',
  },
  {
    id: 'notif-007',
    type: 'reservation',
    title: 'R\u00e9servation confirm\u00e9e',
    message: 'Votre r\u00e9servation \u00e0 Santorin du 20 au 27 juin est confirm\u00e9e.',
    read: true,
    createdAt: '2026-03-26T12:00:00Z',
    href: '/reservations/res-003',
  },
  {
    id: 'notif-008',
    type: 'payment',
    title: 'Commission apporteur',
    message: 'Commission de 740 CHF cr\u00e9dit\u00e9e pour le parrainage de Fatima Zahra.',
    read: false,
    createdAt: '2026-03-25T09:00:00Z',
    href: '/dashboard/referrals',
  },
  {
    id: 'notif-009',
    type: 'system',
    title: 'V\u00e9rification d\u2019identit\u00e9',
    message: 'Votre pi\u00e8ce d\u2019identit\u00e9 a \u00e9t\u00e9 v\u00e9rifi\u00e9e avec succ\u00e8s. Badge "V\u00e9rifi\u00e9" activ\u00e9.',
    read: true,
    createdAt: '2026-03-24T11:00:00Z',
    href: '/profile/settings',
  },
  {
    id: 'notif-010',
    type: 'message',
    title: 'Nouveau message',
    message: 'Nathalie Blanc vous a r\u00e9pondu au sujet de l\u2019acte de vente.',
    read: false,
    createdAt: '2026-03-27T09:00:00Z',
    href: '/messages/conv-006',
  },
  {
    id: 'notif-011',
    type: 'reservation',
    title: 'R\u00e9servation annul\u00e9e',
    message: 'Pierre Gon\u00e7alves a annul\u00e9 sa r\u00e9servation au Riad de Marrakech.',
    read: true,
    createdAt: '2026-03-22T15:00:00Z',
    href: '/reservations/res-007',
  },
  {
    id: 'notif-012',
    type: 'follow',
    title: 'Nouveau follower',
    message: 'Carlos Rivera vous suit d\u00e9sormais.',
    read: true,
    createdAt: '2026-03-20T18:00:00Z',
    href: '/profile/user-016',
  },
];

// ─── DASHBOARD DATA ─────────────────────────────────────────────────────────

export const dashboardStats: DashboardStats = {
  totalRevenue: 485000,
  monthlyRevenue: 42500,
  totalBookings: 52,
  occupancyRate: 87,
  averageRating: 4.8,
  totalViews: 24680,
  conversionRate: 3.8,
  pendingPayments: 6350,
};

export const transactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'payment',
    amount: 5950,
    currency: 'CHF',
    status: 'completed',
    description: 'Location chalet Verbier — Marc Favre',
    date: '2026-03-30',
    counterpart: 'Marc Favre',
  },
  {
    id: 'tx-002',
    type: 'payout',
    amount: 4760,
    currency: 'CHF',
    status: 'completed',
    description: 'Virement vers compte bancaire',
    date: '2026-03-28',
  },
  {
    id: 'tx-003',
    type: 'commission',
    amount: 740,
    currency: 'CHF',
    status: 'completed',
    description: 'Commission apporteur — Fatima Zahra',
    date: '2026-03-25',
    counterpart: 'Fatima Zahra',
  },
  {
    id: 'tx-004',
    type: 'payment',
    amount: 360,
    currency: 'CHF',
    status: 'pending',
    description: 'Location studio Gen\u00e8ve — Cl\u00e9mence Moreau',
    date: '2026-04-01',
    counterpart: 'Cl\u00e9mence Moreau',
  },
  {
    id: 'tx-005',
    type: 'payment',
    amount: 5950,
    currency: 'CHF',
    status: 'completed',
    description: 'Location chalet Verbier — Yasmin Al Maktoum',
    date: '2026-02-14',
    counterpart: 'Yasmin Al Maktoum',
  },
  {
    id: 'tx-006',
    type: 'commission',
    amount: 1450,
    currency: 'CHF',
    status: 'completed',
    description: 'Commission vente appartement Lausanne',
    date: '2026-02-10',
  },
  {
    id: 'tx-007',
    type: 'refund',
    amount: -1800,
    currency: 'CHF',
    status: 'completed',
    description: 'Remboursement annulation — Pierre Gon\u00e7alves',
    date: '2026-03-22',
    counterpart: 'Pierre Gon\u00e7alves',
  },
  {
    id: 'tx-008',
    type: 'payment',
    amount: 497,
    currency: 'CHF',
    status: 'completed',
    description: 'Vente formation "Investissement locatif"',
    date: '2026-03-18',
  },
];

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Avr 2025', revenue: 28500, bookings: 8, occupancy: 72 },
  { month: 'Mai 2025', revenue: 32000, bookings: 10, occupancy: 78 },
  { month: 'Juin 2025', revenue: 45000, bookings: 14, occupancy: 92 },
  { month: 'Juil 2025', revenue: 52000, bookings: 16, occupancy: 96 },
  { month: 'Ao\u00fbt 2025', revenue: 48000, bookings: 15, occupancy: 94 },
  { month: 'Sep 2025', revenue: 38000, bookings: 12, occupancy: 82 },
  { month: 'Oct 2025', revenue: 31000, bookings: 9, occupancy: 74 },
  { month: 'Nov 2025', revenue: 26000, bookings: 7, occupancy: 65 },
  { month: 'D\u00e9c 2025', revenue: 42000, bookings: 13, occupancy: 88 },
  { month: 'Jan 2026', revenue: 44000, bookings: 13, occupancy: 90 },
  { month: 'F\u00e9v 2026', revenue: 46000, bookings: 14, occupancy: 91 },
  { month: 'Mar 2026', revenue: 42500, bookings: 12, occupancy: 87 },
];

export interface MonthlyReferralEarnings {
  month: string;
  earnings: number;
  referrals: number;
}

export const monthlyReferralEarnings: MonthlyReferralEarnings[] = [
  { month: 'Oct 2025', earnings: 1200, referrals: 3 },
  { month: 'Nov 2025', earnings: 850, referrals: 2 },
  { month: 'D\u00e9c 2025', earnings: 2100, referrals: 5 },
  { month: 'Jan 2026', earnings: 1680, referrals: 4 },
  { month: 'F\u00e9v 2026', earnings: 2340, referrals: 6 },
  { month: 'Mar 2026', earnings: 1950, referrals: 5 },
];

// ─── REVIEWS ────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  propertyId: string;
  author: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    propertyId: 'prop-005',
    author: users[2],
    rating: 5,
    comment: 'Chalet absolument exceptionnel ! Vue \u00e0 couper le souffle, service impeccable. Le spa priv\u00e9 est un vrai plus. On reviendra sans h\u00e9siter.',
    createdAt: '2026-02-22T10:00:00Z',
  },
  {
    id: 'rev-002',
    propertyId: 'prop-004',
    author: users[6],
    rating: 5,
    comment: 'Un riad magnifique, authentique et parfaitement r\u00e9nov\u00e9. L\u2019accueil d\u2019Amina est chaleureux. Le petit-d\u00e9jeuner sur la terrasse est un moment magique.',
    createdAt: '2026-03-06T14:00:00Z',
  },
  {
    id: 'rev-003',
    propertyId: 'prop-001',
    author: users[11],
    rating: 4,
    comment: 'Tr\u00e8s bel appartement avec une vue incroyable sur le lac. Seul b\u00e9mol : le parking est un peu \u00e9troit. Sinon, tout est parfait.',
    createdAt: '2026-03-15T09:00:00Z',
  },
  {
    id: 'rev-004',
    propertyId: 'prop-009',
    author: users[2],
    rating: 5,
    comment: 'Villa de r\u00eave \u00e0 Phuket ! Le personnel est aux petits soins, la piscine infinity est spectaculaire. Deux semaines de pur bonheur.',
    createdAt: '2026-01-25T12:00:00Z',
  },
  {
    id: 'rev-005',
    propertyId: 'prop-012',
    author: users[0],
    rating: 5,
    comment: 'Santorin comme dans les r\u00eaves. La villa est parfaitement situ\u00e9e pour le coucher de soleil. Elena est une h\u00f4tesse exceptionnelle.',
    createdAt: '2026-03-20T18:00:00Z',
  },
];

// ─── SUGGESTED USERS, TRENDING, STORIES ─────────────────────────────────────

export interface SuggestedUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  mutualConnections: number;
}

export const suggestedUsers: SuggestedUser[] = [
  { id: 'user-013', name: 'Omar Benjelloun', avatar: users[12].avatar, role: 'Promoteur', mutualConnections: 8 },
  { id: 'user-014', name: 'Elena Papadopoulos', avatar: users[13].avatar, role: 'H\u00f4tesse', mutualConnections: 5 },
  { id: 'user-016', name: 'Carlos Rivera', avatar: users[15].avatar, role: 'H\u00f4te & Photographe', mutualConnections: 3 },
  { id: 'user-009', name: 'Thomas M\u00fcller', avatar: users[8].avatar, role: 'Architecte', mutualConnections: 12 },
  { id: 'user-010', name: 'Fatima Zahra', avatar: users[9].avatar, role: 'Apporteuse d\u2019affaires', mutualConnections: 4 },
];

export interface TrendingHashtag {
  tag: string;
  count: number;
}

export const trendingHashtags: TrendingHashtag[] = [
  { tag: '#ImmobilierSuisse', count: 1240 },
  { tag: '#InvestissementLocatif', count: 980 },
  { tag: '#Proptech', count: 856 },
  { tag: '#Marrakech', count: 742 },
  { tag: '#VillaDeLuxe', count: 698 },
  { tag: '#GoldenVisa', count: 534 },
  { tag: '#LocationCT', count: 489 },
  { tag: '#R\u00e9novation', count: 423 },
  { tag: '#Dubai', count: 387 },
  { tag: '#Minergie', count: 312 },
];

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  hasNewStory: boolean;
}

export const storyUsers: StoryUser[] = [
  { id: 'user-001', name: 'Karim', avatar: users[0].avatar, hasNewStory: true },
  { id: 'user-002', name: 'Sophie', avatar: users[1].avatar, hasNewStory: true },
  { id: 'user-004', name: 'Amina', avatar: users[3].avatar, hasNewStory: true },
  { id: 'user-006', name: 'Yasmin', avatar: users[5].avatar, hasNewStory: false },
  { id: 'user-005', name: 'Lucas', avatar: users[4].avatar, hasNewStory: true },
  { id: 'user-014', name: 'Elena', avatar: users[13].avatar, hasNewStory: false },
  { id: 'user-015', name: 'Jean-Luc', avatar: users[14].avatar, hasNewStory: true },
  { id: 'user-013', name: 'Omar', avatar: users[12].avatar, hasNewStory: false },
];

// ─── FAVORITES ──────────────────────────────────────────────────────────────

export const favoritePropertyIds: string[] = ['prop-001', 'prop-003', 'prop-005', 'prop-006', 'prop-012'];
export const favoritePostIds: string[] = ['post-001', 'post-003', 'post-005', 'post-007'];

// ─── APPOINTMENTS ───────────────────────────────────────────────────────────

export interface Appointment {
  id: string;
  title: string;
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  date: string;
  time: string;
  type: 'visite' | 'signature' | 'estimation';
}

export const upcomingAppointments: Appointment[] = [
  {
    id: 'apt-001',
    title: 'Visite appartement Neuch\u00e2tel',
    propertyId: 'prop-007',
    propertyTitle: '3.5 pi\u00e8ces lumineux au bord du lac',
    clientName: 'Cl\u00e9mence Moreau',
    date: '2026-04-05',
    time: '10:00',
    type: 'visite',
  },
  {
    id: 'apt-002',
    title: 'Signature acte de vente',
    propertyId: 'prop-001',
    propertyTitle: 'Magnifique 4.5 pi\u00e8ces avec vue sur le Lac L\u00e9man',
    clientName: 'Marc Favre',
    date: '2026-04-10',
    time: '14:00',
    type: 'signature',
  },
  {
    id: 'apt-003',
    title: 'Estimation villa',
    clientName: 'Jean-Luc Hartmann',
    date: '2026-04-12',
    time: '09:00',
    type: 'estimation',
  },
];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getSimilarProperties(property: Property): Property[] {
  return properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.type === property.type ||
          p.location.country === property.location.country ||
          p.transactionType === property.transactionType)
    )
    .slice(0, 4);
}

export function getReviewsForProperty(propertyId: string): Review[] {
  return mockReviews.filter((r) => r.propertyId === propertyId);
}

export function getFormationById(id: string): Formation | undefined {
  return formations.find((f) => f.id === id);
}

export function getSimilarFormations(formation: Formation): Formation[] {
  return formations
    .filter(
      (f) =>
        f.id !== formation.id &&
        (f.category === formation.category || f.level === formation.level)
    )
    .slice(0, 3);
}
