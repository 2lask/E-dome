// ============================================================
// E-Dome Platform — Mock Data
// Le casting des seize personnes (analyse2/casting.md) et ce qui
// s'y rattache : biens, formations, conversations, avis.
// ============================================================

import type { User, Property, Formation } from './types';
import { CURRENT_USER } from "./demo/identity";
import { followerCount, followingCount } from "./demo/social";

/* ── Ce qui est écrit, ce qui est dérivé ──────────────────────────────────

   Les compteurs d'une personne ne s'écrivent plus à la main. En fin de
   fichier, `stampDerivedStats()` calcule pour chacune des seize :
     · `properties` — les biens qu'elle héberge au catalogue ;
     · `reviews` / `rating` — les avis qu'elle a RÉELLEMENT reçus (`mockReviews`) ;
     · `followers` / `following` — le graphe `FOLLOWS` (`demo/social.ts`).
   Restent écrits `transactions` et `revenue`, parce qu'ils viennent du journal
   (`demo/ledger.ts`), qui importe ce fichier : l'invariant 15 vérifie qu'ils
   concordent, pour les seize. Les zéros de départ ci-dessous ne sont donc
   jamais affichés tels quels. */

/** Statistiques de départ : tout ce qui se dérive est recalculé plus bas. */
const derived = (transactions: number, revenue: number): User['stats'] => ({
  followers: 0,
  following: 0,
  properties: 0,
  reviews: 0,
  rating: 0,
  transactions,
  revenue,
});

/** Visage synthétique, servi localement (D16) : aucun portrait réel. */
const face = (id: string) => `/avatars/${id}.jpg`;

// ─── LES SEIZE ──────────────────────────────────────────────────────────────

/* L'utilisateur courant dérive de `demo/identity`. Son `revenue` reste à 0 :
   son tableau de bord affiche le revenu dérivé du journal (test 16). */
export const currentUser: User = {
  id: CURRENT_USER.id,
  firstName: CURRENT_USER.firstName,
  lastName: CURRENT_USER.lastName,
  email: CURRENT_USER.email,
  avatar: CURRENT_USER.avatar,
  city: CURRENT_USER.city,
  country: CURRENT_USER.country,
  roles: [...CURRENT_USER.roles],
  activeRole: 'hote',
  stats: derived(155, 0),
  bio: CURRENT_USER.about,
  languages: ['Français', 'English', 'Deutsch'],
  responseTime: '2h',
};

export const users: User[] = [
  currentUser,
  /* Céline Bovard, 46 ans, Lutry — agente immobilière indépendante (une agence
     d'une personne). Chaleureuse, précise : elle parle des biens comme des
     lieux de vie. */
  {
    id: 'user-002',
    firstName: 'Céline',
    lastName: 'Bovard',
    email: 'celine.bovard@e-dome.ch',
    avatar: face('user-002'),
    city: 'Lutry',
    country: 'Suisse',
    roles: ['agence', 'hote'],
    activeRole: 'agence',
    stats: derived(21, 12780),
    bio: 'Agente immobilière indépendante à Lutry. Je vends des maisons vigneronnes et des appartements du Lavaux, de Lutry à Chexbres — des lieux de vie avant d’être des mètres carrés.',
    languages: ['Français', 'Deutsch', 'English'],
    certifications: ['Brevet fédéral d’agente immobilière (2011)'],
    responseTime: '1h',
  },
  /* Ennio Bordoni, 61 ans, Genève (Champel) — investisseur, ancien banquier
     privé. Froid, chiffré, phrases courtes. */
  {
    id: 'user-003',
    firstName: 'Ennio',
    lastName: 'Bordoni',
    email: 'ennio.bordoni@e-dome.ch',
    avatar: face('user-003'),
    city: 'Genève',
    country: 'Suisse',
    roles: ['proprietaire', 'hote'],
    activeRole: 'proprietaire',
    interests: ['investisseur'],
    stats: derived(47, 26780),
    bio: 'Ancien banquier privé. Investisseur. Six appartements, Vaud et Genève. Je regarde le rendement net. Le brut ne m’intéresse pas.',
    languages: ['Italiano', 'Français', 'English', 'Deutsch'],
    responseTime: '6h',
  },
  /* Aline Tschanz, 33 ans, Neuchâtel — agente salariée chez Hartmann
     Immobilier SA. Jeune pro dynamique, organisée. */
  {
    id: 'user-004',
    firstName: 'Aline',
    lastName: 'Tschanz',
    email: 'aline.tschanz@e-dome.ch',
    avatar: face('user-004'),
    city: 'Neuchâtel',
    country: 'Suisse',
    roles: ['agent'],
    activeRole: 'agent',
    stats: derived(0, 0),
    bio: 'Agente immobilière chez Hartmann Immobilier SA, à Neuchâtel. Je suis vos ventes et vos locations du premier appel à la remise des clés : visites groupées, dossiers complets, réponse dans la journée.',
    languages: ['Français', 'Deutsch', 'English'],
    responseTime: '1h',
  },
  /* Nikola Ristić, 29 ans, Yverdon-les-Bains — photographe immobilier (drone,
     visite 3D). Écrit court, sans accents, en abrégé. */
  {
    id: 'user-005',
    firstName: 'Nikola',
    lastName: 'Ristić',
    email: 'nikola.ristic@e-dome.ch',
    avatar: face('user-005'),
    city: 'Yverdon-les-Bains',
    country: 'Suisse',
    roles: ['prestataire'],
    activeRole: 'prestataire',
    trades: ['photographe'],
    stats: derived(4, 2110),
    bio: 'photographe immo yverdon et environs. photo, drone, visite 3d, plans. dispo semaine + samedi. devis rapide par msg',
    languages: ['Français', 'Srpski', 'English'],
    certifications: ['Pilote de drone, catégorie ouverte (OFAC, 2023)'],
    responseTime: '30 min',
  },
  /* Ana Ferreira, 34 ans, Renens — cherche à louer, famille avec deux enfants.
     Débutante : questions simples, polie. */
  {
    id: 'user-006',
    firstName: 'Ana',
    lastName: 'Ferreira',
    email: 'ana.ferreira@e-dome.ch',
    avatar: face('user-006'),
    city: 'Renens',
    country: 'Suisse',
    roles: ['particulier'],
    activeRole: 'particulier',
    interests: ['locataire'],
    stats: derived(0, 0),
    bio: 'Bonjour ! Nous cherchons un 4 pièces à Renens ou Prilly pour notre famille (deux enfants, 6 et 9 ans). Je découvre la plateforme, merci pour vos conseils.',
    languages: ['Português', 'Français'],
    responseTime: '3h',
  },
  /* Bernard Chappuis, 72 ans, Pully — vend seul la maison familiale. Peu à
     l'aise avec le numérique, formules datées, quelques fautes. */
  {
    id: 'user-007',
    firstName: 'Bernard',
    lastName: 'Chappuis',
    email: 'bernard.chappuis@e-dome.ch',
    avatar: face('user-007'),
    city: 'Pully',
    country: 'Suisse',
    roles: ['particulier'],
    activeRole: 'particulier',
    interests: ['vendeur'],
    stats: derived(0, 0),
    bio: 'Retraité, ancien ingénieur. Je vends moi même la maison familliale de Pully, ou nous avons vécu 41 ans avec mon épouse. Visites sur rendez-vous, de préférence le matin.',
    languages: ['Français', 'Deutsch'],
    responseTime: '1 jour',
  },
  /* Clémence Jaquet, 27 ans, Morges — premier achat. Elle doute, pèse le pour
     et le contre, demande l'avis des autres. */
  {
    id: 'user-008',
    firstName: 'Clémence',
    lastName: 'Jaquet',
    email: 'clemence.jaquet@e-dome.ch',
    avatar: face('user-008'),
    city: 'Morges',
    country: 'Suisse',
    roles: ['particulier'],
    activeRole: 'particulier',
    interests: ['acheteur'],
    stats: derived(0, 0),
    bio: 'Infirmière, j’habite à Morges. Avec mon compagnon, on pense à un premier achat… mais est-ce vraiment le moment ? Je lis beaucoup et je pose (trop ?) de questions.',
    languages: ['Français', 'English'],
    responseTime: '5h',
  },
  /* Reto Jungo, 49 ans, Fribourg — architecte (rénovation, Minergie, CECB).
     Technique, précis, bilingue. */
  {
    id: 'user-009',
    firstName: 'Reto',
    lastName: 'Jungo',
    email: 'reto.jungo@e-dome.ch',
    avatar: face('user-009'),
    city: 'Fribourg',
    country: 'Suisse',
    roles: ['prestataire', 'createur'],
    activeRole: 'prestataire',
    trades: ['architecte'],
    stats: derived(21, 11740),
    bio: 'Architecte EPF SIA, bureau à Fribourg. Rénovation énergétique, Minergie, CECB Plus. Je travaille en français et en allemand — Sanierung, Energieberatung, Bauleitung.',
    languages: ['Deutsch', 'Schweizerdeutsch', 'Français', 'English'],
    certifications: ['Expert CECB (2016)', 'Conseiller Minergie (2019)'],
    responseTime: '4h',
  },
  /* Elena Currat, 38 ans, Vevey — home staging. Enthousiaste, visuelle,
     sobre. */
  {
    id: 'user-010',
    firstName: 'Elena',
    lastName: 'Currat',
    email: 'elena.currat@e-dome.ch',
    avatar: face('user-010'),
    city: 'Vevey',
    country: 'Suisse',
    roles: ['prestataire'],
    activeRole: 'prestataire',
    trades: ['home-staging'],
    stats: derived(2, 3550),
    bio: 'Home staging à Vevey et sur la Riviera. Lumière, couleurs, quelques meubles bien placés : je prépare votre bien pour qu’on ait envie d’y entrer, en photo comme en visite.',
    languages: ['Français', 'Italiano', 'English'],
    responseTime: '2h',
  },
  /* Sandrine Monnier, 53 ans, Neuchâtel — créatrice de formations (fiscalité
     immobilière), ex-fiduciaire. Pédagogue, structurée. */
  {
    id: 'user-011',
    firstName: 'Sandrine',
    lastName: 'Monnier',
    email: 'sandrine.monnier@e-dome.ch',
    avatar: face('user-011'),
    city: 'Neuchâtel',
    country: 'Suisse',
    roles: ['createur'],
    activeRole: 'createur',
    stats: derived(89, 29055),
    bio: 'Vingt ans en fiduciaire, puis la pédagogie. Je crée des formations sur la fiscalité immobilière en Suisse romande : valeur locative, déductions, gain immobilier. Pas à pas, avec des cas réels.',
    languages: ['Français', 'Deutsch'],
    certifications: ['Brevet fédéral de spécialiste en finance et comptabilité (2004)'],
    responseTime: '3h',
  },
  /* Yves Mottiez, 67 ans, Bulle — apporteur, retraité, connaît toute La
     Gruyère. Formel, à l'ancienne. */
  {
    id: 'user-012',
    firstName: 'Yves',
    lastName: 'Mottiez',
    email: 'yves.mottiez@e-dome.ch',
    avatar: face('user-012'),
    city: 'Bulle',
    country: 'Suisse',
    roles: ['apporteur'],
    activeRole: 'apporteur',
    stats: derived(0, 0),
    bio: 'Retraité de la banque, établi à Bulle depuis toujours. Je connais La Gruyère et ses gens. Je mets en relation les vendeurs de la région avec des agences sérieuses. Meilleures salutations, Y. Mottiez',
    languages: ['Français', 'Deutsch'],
    responseTime: '1 jour',
  },
  /* Mirjana Kovač, 45 ans, Montreux — hôte courte durée, deux appartements.
     Pragmatique : taux d'occupation et saisons. */
  {
    id: 'user-013',
    firstName: 'Mirjana',
    lastName: 'Kovač',
    email: 'mirjana.kovac@e-dome.ch',
    avatar: face('user-013'),
    city: 'Montreux',
    country: 'Suisse',
    roles: ['hote'],
    activeRole: 'hote',
    stats: derived(76, 49490),
    bio: 'Hôte à Montreux, deux appartements en courte durée. Juillet, c’est le Jazz ; décembre, le marché de Noël ; le reste de l’année se travaille au prix et au taux d’occupation.',
    languages: ['Hrvatski', 'Français', 'Deutsch', 'English'],
    responseTime: '1h',
  },
  /* Hélène Marchal, 52 ans, Évian-les-Bains (France) — apporteuse,
     marketplace uniquement. Commerciale, réseau transfrontalier. */
  {
    id: 'user-014',
    firstName: 'Hélène',
    lastName: 'Marchal',
    email: 'helene.marchal@e-dome.ch',
    avatar: face('user-014'),
    city: 'Évian-les-Bains',
    country: 'France',
    roles: ['apporteur'],
    activeRole: 'apporteur',
    stats: derived(0, 0),
    bio: 'Basée à Évian, je recommande à mon réseau des deux rives du Léman les formations et les événements qui valent le détour. Depuis la France, mon affiliation porte sur la marketplace uniquement — aucune prime sur les biens.',
    languages: ['Français', 'English', 'Italiano'],
    responseTime: '2h',
  },
  /* Jean-Luc Hartmann, 58 ans, Neuchâtel — directeur de Hartmann Immobilier
     SA. Institutionnel, posé. */
  {
    id: 'user-015',
    firstName: 'Jean-Luc',
    lastName: 'Hartmann',
    email: 'jeanluc.hartmann@e-dome.ch',
    avatar: face('user-015'),
    city: 'Neuchâtel',
    country: 'Suisse',
    roles: ['agence'],
    activeRole: 'agence',
    stats: derived(18, 8700),
    bio: 'Directeur de Hartmann Immobilier SA, à Neuchâtel. Vingt-cinq ans dans l’immobilier neuchâtelois. Vente, estimation et gestion locative, avec une équipe de proximité.',
    languages: ['Français', 'Deutsch', 'English'],
    certifications: ['Brevet fédéral de gérant d’immeubles (2003)', 'Expert en estimations immobilières (2012)'],
    responseTime: '2h',
  },
  /* Amina El Idrissi, 44 ans, Marrakech (Guéliz) — créatrice de formations
     (gestion locative touristique, pricing dynamique), hôte de son riad.
     Bienveillante, concrète. */
  {
    id: 'user-016',
    firstName: 'Amina',
    lastName: 'El Idrissi',
    email: 'amina.elidrissi@e-dome.ch',
    avatar: face('user-016'),
    city: 'Marrakech',
    country: 'Maroc',
    roles: ['createur', 'hote'],
    activeRole: 'createur',
    stats: derived(161, 89163),
    bio: 'Je forme les hôtes à la gestion locative touristique et au pricing dynamique. Mon riad, en médina, me sert de terrain d’essai depuis 2016 : je n’enseigne que ce que j’ai testé.',
    languages: ['العربية', 'Français', 'English'],
    responseTime: '3h',
  },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/** La personne d'identifiant `id` — échoue bruyamment sur un id inconnu. */
function person(id: string): User {
  const u = getUserById(id);
  if (!u) throw new Error(`mock-data : personne inconnue — ${id}`);
  return u;
}

// ─── LE CATALOGUE (25 biens) ────────────────────────────────────────────────

/* Chaque bien a pour hôte une personne du casting, dans un lieu réel, à un
   prix tiré des repères de marché du casting. Les biens lointains qui ne
   correspondaient à personne (Dubaï, Phuket, Santorin, Lisbonne, Nice,
   Barcelone, Zurich, Lugano) ont été relocalisés sur leur id, ou retirés
   (prop11 bureaux genevois, prop18 riad à vendre, prop22 chalet de
   Crans-Montana) — sauf le riad d'Amina, rattaché à son profil.

   Répartition : 9 en vente (dont 2 vendus, `soldTo`), 6 en location longue
   durée (`/mois`), 10 en courte durée (`/nuit`).

   `rating` et `reviewCount` sont recalculés en fin de fichier à partir des
   avis réels : les zéros ci-dessous ne s'affichent pas tels quels. */

const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop`;

export const properties: Property[] = [
  // ── Céline Bovard (user-002) ────────────────────────────────────────────
  // prop1 — Vente, Appartement, Lutry — VENDU à Ennio (mandat conclu).
  {
    id: 'prop1',
    title: 'Appartement 4,5 pièces vue lac à Lutry',
    description:
      'Au deuxième étage d’une petite copropriété au-dessus du bourg, un 4,5 pièces de 128 m² tourné vers le lac et les Alpes. Le matin, la lumière entre par la cuisine ; le soir, on dîne sur la terrasse face au Grammont. Trois chambres, deux salles d’eau, cave et deux places de parc. Le bourg et le débarcadère sont à huit minutes à pied.',
    type: 'appartement',
    transactionType: 'vente',
    price: 1690000,
    currency: 'CHF',
    location: { city: 'Lutry', country: 'Suisse', address: 'Route de Lavaux, 1095 Lutry', lat: 46.5035, lng: 6.6855 },
    images: [IMG('1600596542815-ffad4c1539a9'), IMG('1600607687939-ce8a6c25118c'), IMG('1600585154340-be6161a56a0c'), IMG('1600566753190-17f0baa2a6c3')],
    videos: [],
    host: person('user-002'),
    bedrooms: 3,
    bathrooms: 2,
    area: 128,
    floor: 2,
    amenities: ['Vue lac', 'Terrasse', 'Cave', 'Parking', 'Ascenseur', 'Buanderie'],
    rating: 0,
    reviewCount: 0,
    soldTo: 'user-003',
    analytics: { rendementBrut: 2.9, rendementNet: 2.1, prixM2: 13203, dpe: 'C', etatGeneral: 'Très bon', anneeConstruction: 1998, potentielPlusValue: 9, roi5ans: 12, roi10ans: 27, tauxOccupation: 0 },
  },
  // prop19 — Vente, Maison, Riex (Lavaux) — mandat actif.
  {
    id: 'prop19',
    title: 'Maison vigneronne à Riex, au cœur du Lavaux',
    description:
      'Une maison de vigneron du XIXe siècle, restaurée avec retenue : murs en molasse, poutres d’origine, cave voûtée où l’on entreposait la récolte. 185 m² sur trois niveaux, quatre chambres, une terrasse qui surplombe les vignes en terrasses et le lac. Une maison qui a une histoire, et de la place pour la suivante.',
    type: 'maison',
    transactionType: 'vente',
    price: 2450000,
    currency: 'CHF',
    location: { city: 'Riex', country: 'Suisse', address: 'Route de la Corniche, 1097 Riex', lat: 46.495, lng: 6.724 },
    images: [IMG('1564013799919-ab600027ffc6'), IMG('1600566753086-00f18fb6b3ea'), IMG('1600210491892-03d54c0aaf87'), IMG('1616594039964-ae9021a400a0')],
    videos: [],
    host: person('user-002'),
    bedrooms: 4,
    bathrooms: 2,
    area: 185,
    amenities: ['Vue lac', 'Cave voûtée', 'Terrasse', 'Cheminée', 'Jardin'],
    rating: 0,
    reviewCount: 0,
    featured: true,
    analytics: { rendementBrut: 2.6, rendementNet: 1.8, prixM2: 13243, dpe: 'E', etatGeneral: 'Restauré', anneeConstruction: 1860, potentielPlusValue: 8, roi5ans: 11, roi10ans: 25, tauxOccupation: 0 },
  },
  // prop13 — Vente, Appartement, Morges — mandat actif.
  {
    id: 'prop13',
    title: '3,5 pièces lumineux à deux pas du lac, Morges',
    description:
      'Un 3,5 pièces de 92 m² au troisième étage, à trois rues du quai et du château. Séjour traversant, deux chambres, une loggia où le café du matin se prend au soleil. Une première acquisition idéale, ou un pied-à-terre pour qui travaille à Lausanne : la gare est à cinq minutes.',
    type: 'appartement',
    transactionType: 'vente',
    price: 985000,
    currency: 'CHF',
    location: { city: 'Morges', country: 'Suisse', address: 'Rue Louis-de-Savoie, 1110 Morges', lat: 46.51, lng: 6.497 },
    images: [IMG('1560185127-6ed189bf02f4'), IMG('1560448204-e02f11c3d0e2'), IMG('1556909114-f6e7ad7d3136'), IMG('1584622650111-993a426fbf0a')],
    videos: [],
    host: person('user-002'),
    bedrooms: 2,
    bathrooms: 1,
    area: 92,
    floor: 3,
    amenities: ['Loggia', 'Ascenseur', 'Cave', 'Proche gare', 'Buanderie'],
    rating: 0,
    reviewCount: 0,
    analytics: { rendementBrut: 3.3, rendementNet: 2.5, prixM2: 10707, dpe: 'C', etatGeneral: 'Bon', anneeConstruction: 1972, potentielPlusValue: 10, roi5ans: 14, roi10ans: 31, tauxOccupation: 0 },
  },
  // prop23 — Courte durée, Studio, Lausanne (Ouchy) — le pied-à-terre de Céline.
  {
    id: 'prop23',
    title: 'Pied-à-terre meublé à Ouchy, vue lac',
    description:
      'Mon pied-à-terre lausannois, que je loue quand je n’y dors pas : un studio de 38 m² sur les quais d’Ouchy, balcon face au Léman, à deux pas du métro m2. Meublé avec soin, linge fourni, cuisine équipée. On y entend les mouettes et le bateau de 8 h 30.',
    type: 'studio',
    transactionType: 'location-ct',
    price: 180,
    currency: 'CHF',
    location: { city: 'Lausanne', country: 'Suisse', address: 'Place du Port, 1006 Lausanne', lat: 46.5066, lng: 6.6266 },
    images: [IMG('1522708323590-d24dbb6b0267'), IMG('1502672260266-1c1ef2d93688'), IMG('1560448204-e02f11c3d0e2')],
    videos: [],
    host: person('user-002'),
    bedrooms: 0,
    bathrooms: 1,
    area: 38,
    floor: 3,
    amenities: ['WiFi', 'Meublé', 'Balcon', 'Vue lac', 'Cuisine équipée', 'Ascenseur'],
    rating: 0,
    reviewCount: 0,
  },

  // ── Ennio Bordoni (user-003) ────────────────────────────────────────────
  // prop16 — Vente, Appartement, Genève (Champel) — vendu par son propriétaire.
  {
    id: 'prop16',
    title: '5 pièces à Champel, calme et lumineux',
    description:
      '5 pièces, 142 m², 4e étage. Immeuble de 1965, rénové en 2019 (façade, fenêtres, chaudière). Trois chambres, deux salles de bains. Cave, une place en sous-sol. Charges : 690 CHF/mois. Vente directe par le propriétaire, sans intermédiaire.',
    type: 'appartement',
    transactionType: 'vente',
    price: 3150000,
    currency: 'CHF',
    location: { city: 'Genève', country: 'Suisse', address: 'Avenue de Champel, 1206 Genève', lat: 46.1905, lng: 6.153 },
    images: [IMG('1600607687939-ce8a6c25118c'), IMG('1600566753190-17f0baa2a6c3'), IMG('1600210492486-724fe5c67fb0')],
    videos: [],
    host: person('user-003'),
    bedrooms: 3,
    bathrooms: 2,
    area: 142,
    floor: 4,
    amenities: ['Ascenseur', 'Cave', 'Parking souterrain', 'Balcon', 'Concierge'],
    rating: 0,
    reviewCount: 0,
    analytics: { rendementBrut: 2.8, rendementNet: 2.0, prixM2: 22183, dpe: 'C', etatGeneral: 'Rénové', anneeConstruction: 1965, potentielPlusValue: 7, roi5ans: 10, roi10ans: 24, tauxOccupation: 0 },
  },
  // prop24 — Courte durée, Studio, Montreux.
  {
    id: 'prop24',
    title: 'Studio meublé à Montreux, près du Casino',
    description:
      'Studio de 34 m². Meublé. Cuisine équipée, machine à laver. Gare à six minutes à pied, quais à deux. Arrivée autonome par boîte à clés. Juillet : réservation minimum trois nuits.',
    type: 'studio',
    transactionType: 'location-ct',
    price: 140,
    currency: 'CHF',
    location: { city: 'Montreux', country: 'Suisse', address: 'Avenue du Casino, 1820 Montreux', lat: 46.4312, lng: 6.9107 },
    images: [IMG('1560448204-e02f11c3d0e2'), IMG('1586023492125-27b2c045efd7'), IMG('1631679706909-1844bbd07221')],
    videos: [],
    host: person('user-003'),
    bedrooms: 0,
    bathrooms: 1,
    area: 34,
    floor: 2,
    amenities: ['WiFi', 'Meublé', 'Cuisine équipée', 'Machine à laver', 'Arrivée autonome'],
    rating: 0,
    reviewCount: 0,
  },
  // prop25 — Courte durée, Appartement, Nyon.
  {
    id: 'prop25',
    title: '2 pièces meublé à Nyon, près de la gare',
    description:
      '2 pièces, 52 m², rez surélevé. Gare CFF à 300 m : Genève en 15 minutes, Lausanne en 25. Une chambre, séjour avec canapé-lit. Pour séjours professionnels. Facture au nom de la société sur demande.',
    type: 'appartement',
    transactionType: 'location-ct',
    price: 160,
    currency: 'CHF',
    location: { city: 'Nyon', country: 'Suisse', address: 'Rue de la Gare, 1260 Nyon', lat: 46.3833, lng: 6.2394 },
    images: [IMG('1502672260266-1c1ef2d93688'), IMG('1560185893-a55cbc8c57e8'), IMG('1584622650111-993a426fbf0a')],
    videos: [],
    host: person('user-003'),
    bedrooms: 1,
    bathrooms: 1,
    area: 52,
    floor: 0,
    amenities: ['WiFi', 'Meublé', 'Cuisine équipée', 'Proche gare', 'Cave'],
    rating: 0,
    reviewCount: 0,
  },
  // prop17 — Longue durée, Appartement, Prilly.
  {
    id: 'prop17',
    title: '3,5 pièces à Prilly, proche gare de Prilly-Malley',
    description:
      '3,5 pièces, 74 m², 2e étage. Deux chambres, balcon. Gare de Prilly-Malley à 7 minutes, bus 9 et 33 devant l’immeuble. Loyer 1 940 CHF + 150 CHF de charges. Libre au 1er décembre. Garantie de loyer : trois mois.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 2090,
    currency: 'CHF',
    location: { city: 'Prilly', country: 'Suisse', address: 'Route de Cossonay, 1008 Prilly', lat: 46.534, lng: 6.603 },
    images: [IMG('1556909114-f6e7ad7d3136'), IMG('1560185893-a55cbc8c57e8'), IMG('1584622650111-993a426fbf0a')],
    videos: [],
    host: person('user-003'),
    bedrooms: 2,
    bathrooms: 1,
    area: 74,
    floor: 2,
    amenities: ['Balcon', 'Cave', 'Buanderie', 'Ascenseur', 'Proche transports'],
    rating: 0,
    reviewCount: 0,
  },
  // prop10 — Longue durée, Appartement, Vevey.
  {
    id: 'prop10',
    title: '3,5 pièces au centre de Vevey',
    description:
      '3,5 pièces, 78 m², 3e étage sans ascenseur. Deux chambres. Gare et marché à 5 minutes. Loyer 1 990 CHF + 160 CHF de charges. Dossier complet exigé : attestation de l’Office des poursuites, trois fiches de salaire.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 2150,
    currency: 'CHF',
    location: { city: 'Vevey', country: 'Suisse', address: 'Rue du Simplon, 1800 Vevey', lat: 46.4605, lng: 6.843 },
    images: [IMG('1560185127-6ed189bf02f4'), IMG('1560448204-e02f11c3d0e2'), IMG('1556909114-f6e7ad7d3136')],
    videos: [],
    host: person('user-003'),
    bedrooms: 2,
    bathrooms: 1,
    area: 78,
    floor: 3,
    amenities: ['Cave', 'Buanderie', 'Centre-ville', 'Proche gare'],
    rating: 0,
    reviewCount: 0,
  },

  // ── Léo Martin (user-001) ───────────────────────────────────────────────
  // prop5 — Courte durée, Appartement-chalet, Verbier.
  {
    id: 'prop5',
    title: 'Appartement dans un chalet, au centre de Verbier',
    description:
      'Un 4,5 pièces de 120 m² au premier étage d’un chalet, à dix minutes à pied de Médran. Trois chambres, deux salles de bains, cheminée et balcon plein sud. Local à skis chauffé. Je fais l’accueil moi-même ou par boîte à clés selon l’heure d’arrivée.',
    type: 'chalet',
    transactionType: 'location-ct',
    price: 420,
    currency: 'CHF',
    location: { city: 'Verbier', country: 'Suisse', address: 'Rue de Médran, 1936 Verbier', lat: 46.0975, lng: 7.231 },
    images: [IMG('1518732714860-b62714ce0c59'), IMG('1542718610-a1d656d1884c'), IMG('1510798831971-661eb04b3739'), IMG('1520984032042-162d526883e0')],
    videos: [],
    host: person('user-001'),
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    floor: 1,
    amenities: ['Cheminée', 'Local à skis', 'Balcon', 'WiFi', 'Parking'],
    rating: 0,
    reviewCount: 0,
    featured: true,
  },
  // prop2 — Courte durée, Studio, Genève.
  {
    id: 'prop2',
    title: 'Studio meublé près de Cornavin, Genève',
    description:
      'Studio contemporain de 32 m², entièrement meublé, pour les séjours d’affaires et les week-ends. Cuisine équipée, literie de qualité, fibre. La gare Cornavin est à cinq minutes à pied, le lac à dix.',
    type: 'studio',
    transactionType: 'location-ct',
    price: 120,
    currency: 'CHF',
    location: { city: 'Genève', country: 'Suisse', address: 'Rue du Mont-Blanc, 1201 Genève', lat: 46.2085, lng: 6.1435 },
    images: [IMG('1522708323590-d24dbb6b0267'), IMG('1502672260266-1c1ef2d93688'), IMG('1560448204-e02f11c3d0e2'), IMG('1586023492125-27b2c045efd7')],
    videos: [],
    host: person('user-001'),
    bedrooms: 0,
    bathrooms: 1,
    area: 32,
    floor: 4,
    amenities: ['WiFi', 'Meublé', 'Cuisine équipée', 'Machine à laver', 'Proche gare'],
    rating: 0,
    reviewCount: 0,
  },
  // prop9 — Courte durée, Studio, Lausanne (Sous-Gare).
  {
    id: 'prop9',
    title: 'Studio meublé à Sous-Gare, Lausanne',
    description:
      'Le studio de 30 m² que je loue dans mon quartier : à six minutes de la gare de Lausanne, entre la gare et Ouchy. Lit double, coin cuisine, douche à l’italienne. Arrivée autonome ; j’habite à deux rues si quelque chose manque.',
    type: 'studio',
    transactionType: 'location-ct',
    price: 135,
    currency: 'CHF',
    location: { city: 'Lausanne', country: 'Suisse', address: 'Avenue de la Harpe, 1007 Lausanne', lat: 46.5115, lng: 6.625 },
    images: [IMG('1502672260266-1c1ef2d93688'), IMG('1586023492125-27b2c045efd7'), IMG('1631679706909-1844bbd07221')],
    videos: [],
    host: person('user-001'),
    bedrooms: 0,
    bathrooms: 1,
    area: 30,
    floor: 1,
    amenities: ['WiFi', 'Meublé', 'Arrivée autonome', 'Proche gare', 'Cuisine équipée'],
    rating: 0,
    reviewCount: 0,
  },
  // prop8 — Longue durée, Appartement, Renens — Ana est candidate.
  {
    id: 'prop8',
    title: '4,5 pièces familial à Renens, proche gare',
    description:
      'Un 4,5 pièces de 98 m² au 3e étage, trois chambres, une salle de bains et un WC séparé, balcon sur cour. Gare de Renens et tram à 6 minutes, écoles à 400 m. Loyer 2 280 CHF + 200 CHF de charges. Le loyer de l’ancien locataire figure sur la formule officielle de notification du loyer initial (obligatoire dans le canton de Vaud), jointe au bail. Garantie : trois mois de loyer net au maximum, sur un compte bloqué à votre nom.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 2480,
    currency: 'CHF',
    location: { city: 'Renens', country: 'Suisse', address: 'Avenue du 14-Avril, 1020 Renens', lat: 46.537, lng: 6.588 },
    images: [IMG('1560448204-e02f11c3d0e2'), IMG('1560185893-a55cbc8c57e8'), IMG('1556909114-f6e7ad7d3136'), IMG('1584622650111-993a426fbf0a')],
    videos: [],
    host: person('user-001'),
    bedrooms: 3,
    bathrooms: 1,
    area: 98,
    floor: 3,
    amenities: ['Balcon', 'Cave', 'Buanderie', 'Ascenseur', 'Proche écoles', 'Proche gare'],
    rating: 0,
    reviewCount: 0,
  },

  // ── Hartmann Immobilier SA — Jean-Luc Hartmann (user-015) ───────────────
  // prop27 — Vente, Villa, Hauterive — VENDUE à Sandrine (mandat conclu).
  {
    id: 'prop27',
    title: 'Villa individuelle avec vue lac à Hauterive',
    description:
      'Villa familiale de 210 m² sur une parcelle de 900 m², vue dégagée sur le lac de Neuchâtel et les Alpes. Cinq pièces, jardin arboré, double garage. Construction 2004, entretien suivi. Mandat exclusif Hartmann Immobilier SA.',
    type: 'villa',
    transactionType: 'vente',
    price: 1350000,
    currency: 'CHF',
    location: { city: 'Hauterive', country: 'Suisse', address: 'Chemin des Roulières 5, 2068 Hauterive', lat: 47.0122, lng: 6.9756 },
    images: [IMG('1600585154340-be6161a56a0c'), IMG('1600596542815-ffad4c1539a9'), IMG('1600607687939-ce8a6c25118c')],
    videos: [],
    host: person('user-015'),
    bedrooms: 4,
    bathrooms: 2,
    area: 210,
    amenities: ['Jardin', 'Garage', 'Vue lac', 'Cheminée', 'Cave'],
    rating: 0,
    reviewCount: 0,
    soldTo: 'user-011',
    analytics: { rendementBrut: 3.4, rendementNet: 2.5, prixM2: 6428, dpe: 'C', etatGeneral: 'Très bon', anneeConstruction: 2004, potentielPlusValue: 12, roi5ans: 16, roi10ans: 38, tauxOccupation: 0 },
  },
  // prop28 — Vente, Appartement, Neuchâtel (Beaux-Arts) — mandat actif.
  {
    id: 'prop28',
    title: '4,5 pièces rénové aux Beaux-Arts, Neuchâtel',
    description:
      'Appartement de 118 m² dans un immeuble de maître du quartier des Beaux-Arts, entièrement rénové en 2023. Parquet d’origine, hauts plafonds, balcon côté lac. Trois chambres, deux salles d’eau. Mandat Hartmann Immobilier SA.',
    type: 'appartement',
    transactionType: 'vente',
    price: 920000,
    currency: 'CHF',
    location: { city: 'Neuchâtel', country: 'Suisse', address: 'Avenue du 1er-Mars, 2000 Neuchâtel', lat: 46.9959, lng: 6.9403 },
    images: [IMG('1560185127-6ed189bf02f4'), IMG('1560448204-e02f11c3d0e2'), IMG('1584622650111-993a426fbf0a')],
    videos: [],
    host: person('user-015'),
    bedrooms: 3,
    bathrooms: 2,
    area: 118,
    floor: 2,
    amenities: ['Balcon', 'Parquet', 'Cave', 'Ascenseur', 'Proche centre'],
    rating: 0,
    reviewCount: 0,
    featured: true,
    analytics: { rendementBrut: 3.9, rendementNet: 2.9, prixM2: 7796, dpe: 'B', etatGeneral: 'Rénové', anneeConstruction: 1928, potentielPlusValue: 14, roi5ans: 18, roi10ans: 41, tauxOccupation: 0 },
  },
  // prop26 — Courte durée, Appartement, Neuchâtel — meublé géré par l'agence.
  {
    id: 'prop26',
    title: 'Meublé géré au centre de Neuchâtel',
    description:
      'Appartement meublé de 46 m² en zone piétonne, géré par Hartmann Immobilier SA en location courte durée. Arrivée autonome, ménage professionnel entre chaque séjour, à deux pas du château et du lac.',
    type: 'appartement',
    transactionType: 'location-ct',
    price: 150,
    currency: 'CHF',
    location: { city: 'Neuchâtel', country: 'Suisse', address: 'Rue du Château, 2000 Neuchâtel', lat: 46.9896, lng: 6.9293 },
    images: [IMG('1586023492125-27b2c045efd7'), IMG('1560448204-e02f11c3d0e2'), IMG('1502672260266-1c1ef2d93688')],
    videos: [],
    host: person('user-015'),
    bedrooms: 1,
    bathrooms: 1,
    area: 46,
    floor: 2,
    amenities: ['WiFi', 'Meublé', 'Arrivée autonome', 'Ménage inclus', 'Centre-ville'],
    rating: 0,
    reviewCount: 0,
  },
  // prop7 — Longue durée, Appartement, Neuchâtel.
  {
    id: 'prop7',
    title: '3,5 pièces lumineux au bord du lac, Neuchâtel',
    description:
      'Bel appartement de 3,5 pièces au 4e étage avec vue dégagée sur le lac de Neuchâtel. Récemment rénové, cuisine ouverte, balcon orienté sud. Commerces et transports à proximité. Gérance Hartmann Immobilier SA.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 1780,
    currency: 'CHF',
    location: { city: 'Neuchâtel', country: 'Suisse', address: 'Quai Philippe-Godet, 2000 Neuchâtel', lat: 46.9925, lng: 6.9311 },
    images: [IMG('1560448204-e02f11c3d0e2'), IMG('1560185893-a55cbc8c57e8'), IMG('1584622650111-993a426fbf0a'), IMG('1556909114-f6e7ad7d3136')],
    videos: [],
    host: person('user-015'),
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    floor: 4,
    amenities: ['Balcon', 'Cave', 'Buanderie', 'Vue lac'],
    rating: 0,
    reviewCount: 0,
  },

  // ── Hartmann Immobilier SA — Aline Tschanz (user-004) ───────────────────
  // prop15 — Vente, Appartement, Neuchâtel — immeuble rénové (projet Reto Jungo).
  {
    id: 'prop15',
    title: '3,5 pièces rénové Minergie, rue des Parcs',
    description:
      'Dans un immeuble des années 1960 entièrement rénové (isolation, fenêtres triple vitrage, pompe à chaleur — étude énergétique et direction de travaux par un architecte fribourgeois), un 3,5 pièces de 89 m² avec balcon. CECB passé de F à B. Gare de Neuchâtel à 8 minutes. Mandat Hartmann Immobilier SA, visites groupées le samedi matin.',
    type: 'appartement',
    transactionType: 'vente',
    price: 695000,
    currency: 'CHF',
    location: { city: 'Neuchâtel', country: 'Suisse', address: 'Rue des Parcs, 2000 Neuchâtel', lat: 46.9985, lng: 6.923 },
    images: [IMG('1545324418-cc1a3fa10c00'), IMG('1560448204-e02f11c3d0e2'), IMG('1586023492125-27b2c045efd7')],
    videos: [],
    host: person('user-004'),
    bedrooms: 2,
    bathrooms: 1,
    area: 89,
    floor: 3,
    amenities: ['Minergie', 'Pompe à chaleur', 'Balcon', 'Cave', 'Ascenseur'],
    rating: 0,
    reviewCount: 0,
    analytics: { rendementBrut: 4.1, rendementNet: 3.2, prixM2: 7809, dpe: 'B', etatGeneral: 'Rénové', anneeConstruction: 1962, potentielPlusValue: 12, roi5ans: 17, roi10ans: 39, tauxOccupation: 0 },
  },
  // prop20 — Vente, Maison, Bulle — bien amené à l'agence par Yves Mottiez.
  {
    id: 'prop20',
    title: 'Maison individuelle à Bulle, vue sur le Moléson',
    description:
      'Maison de 5,5 pièces, 150 m² habitables sur une parcelle de 620 m², dans un quartier calme à dix minutes à pied du centre de Bulle. Quatre chambres, jardin, garage double. Chauffage à pellets (2018). Mandat Hartmann Immobilier SA.',
    type: 'maison',
    transactionType: 'vente',
    price: 845000,
    currency: 'CHF',
    location: { city: 'Bulle', country: 'Suisse', address: 'Route de Riaz, 1630 Bulle', lat: 46.623, lng: 7.06 },
    images: [IMG('1600585154526-990dced4db0d'), IMG('1518780664697-55e3ad937233'), IMG('1600566753086-00f18fb6b3ea')],
    videos: [],
    host: person('user-004'),
    bedrooms: 4,
    bathrooms: 2,
    area: 150,
    amenities: ['Jardin', 'Garage double', 'Vue montagne', 'Cave', 'Chauffage pellets'],
    rating: 0,
    reviewCount: 0,
    analytics: { rendementBrut: 3.6, rendementNet: 2.7, prixM2: 5633, dpe: 'C', etatGeneral: 'Bon', anneeConstruction: 1994, potentielPlusValue: 11, roi5ans: 15, roi10ans: 34, tauxOccupation: 0 },
  },
  // prop14 — Longue durée, Appartement meublé, Neuchâtel.
  {
    id: 'prop14',
    title: '2,5 pièces meublé proche université, Neuchâtel',
    description:
      'Appartement de 2,5 pièces entièrement meublé, idéal pour étudiants ou jeunes professionnels. À dix minutes à pied de l’Université de Neuchâtel. Charges comprises. Gérance Hartmann Immobilier SA.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 1350,
    currency: 'CHF',
    location: { city: 'Neuchâtel', country: 'Suisse', address: 'Rue de la Pierre-à-Mazel, 2000 Neuchâtel', lat: 46.9917, lng: 6.9295 },
    images: [IMG('1502672260266-1c1ef2d93688'), IMG('1560185893-a55cbc8c57e8'), IMG('1586023492125-27b2c045efd7')],
    videos: [],
    host: person('user-004'),
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    floor: 2,
    amenities: ['Meublé', 'Charges comprises', 'Buanderie', 'Cave', 'Parking vélo'],
    rating: 0,
    reviewCount: 0,
  },
  // prop21 — Longue durée, Appartement, Yverdon-les-Bains.
  {
    id: 'prop21',
    title: '3,5 pièces à Yverdon-les-Bains, proche gare',
    description:
      '3,5 pièces de 76 m² au 2e étage, deux chambres, balcon. Gare d’Yverdon et vieille ville à 7 minutes à pied. Loyer 1 440 CHF + 150 CHF de charges. Libre de suite. Gérance Hartmann Immobilier SA.',
    type: 'appartement',
    transactionType: 'location-lt',
    price: 1590,
    currency: 'CHF',
    location: { city: 'Yverdon-les-Bains', country: 'Suisse', address: 'Rue des Moulins, 1400 Yverdon-les-Bains', lat: 46.779, lng: 6.641 },
    images: [IMG('1560448204-e02f11c3d0e2'), IMG('1560185127-6ed189bf02f4'), IMG('1556909114-f6e7ad7d3136')],
    videos: [],
    host: person('user-004'),
    bedrooms: 2,
    bathrooms: 1,
    area: 76,
    floor: 2,
    amenities: ['Balcon', 'Cave', 'Buanderie', 'Proche gare'],
    rating: 0,
    reviewCount: 0,
  },

  // ── Bernard Chappuis (user-007) ─────────────────────────────────────────
  // prop3 — Vente, Maison, Pully — vendue seul par son propriétaire.
  {
    id: 'prop3',
    title: 'Maison familiale avec jardin à Pully',
    description:
      'Je mets en vente la maison où nous avons élevé nos trois enfants. 6,5 pièces, 210 m² habitable, sur une parcelle de 850 m² avec jardin et vue sur le lac depuis l’étage. Cinq chambres, trois salles d’eau, garage. Construite en 1978, bien entretenue, la cuisine et le chauffage seraient à rafraichir. Le centre de Pully et la gare sont à 10 minutes à pied. Visites sur rendez-vous, de préférence le matin. Pas d’agence s.v.p.',
    type: 'maison',
    transactionType: 'vente',
    price: 2950000,
    currency: 'CHF',
    location: { city: 'Pully', country: 'Suisse', address: 'Chemin de Rennier, 1009 Pully', lat: 46.5135, lng: 6.665 },
    images: [IMG('1583608205776-bfd35f0d9f83'), IMG('1564013799919-ab600027ffc6'), IMG('1600566753086-00f18fb6b3ea'), IMG('1600210491892-03d54c0aaf87')],
    videos: [],
    host: person('user-007'),
    bedrooms: 5,
    bathrooms: 3,
    area: 210,
    amenities: ['Jardin', 'Garage', 'Vue lac', 'Cave', 'Cheminée'],
    rating: 0,
    reviewCount: 0,
    analytics: { rendementBrut: 2.5, rendementNet: 1.7, prixM2: 14047, dpe: 'E', etatGeneral: 'À rafraîchir', anneeConstruction: 1978, potentielPlusValue: 10, roi5ans: 12, roi10ans: 28, tauxOccupation: 0 },
  },

  // ── Mirjana Kovač (user-013) ────────────────────────────────────────────
  // prop12 — Courte durée, Appartement, Montreux.
  {
    id: 'prop12',
    title: '2 pièces vue lac à Montreux',
    description:
      '2 pièces de 55 m², balcon vue lac, 5e étage avec ascenseur. Une chambre, canapé-lit au salon : jusqu’à 4 personnes. Quais et gare à 5 minutes. Pendant le Montreux Jazz (juillet), minimum 4 nuits ; en décembre, le marché de Noël est en bas de la rue.',
    type: 'appartement',
    transactionType: 'location-ct',
    price: 210,
    currency: 'CHF',
    location: { city: 'Montreux', country: 'Suisse', address: 'Avenue des Alpes, 1820 Montreux', lat: 46.433, lng: 6.911 },
    images: [IMG('1502672260266-1c1ef2d93688'), IMG('1560185893-a55cbc8c57e8'), IMG('1631679706909-1844bbd07221')],
    videos: [],
    host: person('user-013'),
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    floor: 5,
    amenities: ['Vue lac', 'Balcon', 'WiFi', 'Meublé', 'Ascenseur', 'Cuisine équipée'],
    rating: 0,
    reviewCount: 0,
    featured: true,
  },
  // prop6 — Courte durée, Studio, Clarens (Montreux).
  {
    id: 'prop6',
    title: 'Studio à Clarens, à deux pas du lac',
    description:
      'Studio de 32 m² au rez, petite terrasse. Lit double, coin cuisine. Quai de Clarens à 2 minutes, centre de Montreux à 15 minutes à pied par les quais. Arrivée autonome. Ménage fait entre chaque séjour.',
    type: 'studio',
    transactionType: 'location-ct',
    price: 125,
    currency: 'CHF',
    location: { city: 'Montreux', country: 'Suisse', address: 'Rue du Lac, 1815 Clarens', lat: 46.44, lng: 6.892 },
    images: [IMG('1522708323590-d24dbb6b0267'), IMG('1586023492125-27b2c045efd7'), IMG('1631679706909-1844bbd07221')],
    videos: [],
    host: person('user-013'),
    bedrooms: 0,
    bathrooms: 1,
    area: 32,
    floor: 0,
    amenities: ['Terrasse', 'WiFi', 'Meublé', 'Arrivée autonome', 'Proche lac'],
    rating: 0,
    reviewCount: 0,
  },

  // ── Amina El Idrissi (user-016) ─────────────────────────────────────────
  // prop4 — Courte durée, Riad, Marrakech (médina).
  {
    id: 'prop4',
    title: 'Riad en médina, quatre suites autour du patio',
    description:
      'Mon riad, que je loue en entier : quatre suites autour d’un patio planté d’orangers, une fontaine, une terrasse sur les toits pour le petit-déjeuner. Restauré avec des artisans de la médina. Jusqu’à 8 personnes. Petit-déjeuner compris, accueil à l’arrivée par Fatiha qui travaille avec moi depuis 2016.',
    type: 'riad',
    transactionType: 'location-ct',
    price: 290,
    currency: 'CHF',
    location: { city: 'Marrakech', country: 'Maroc', address: 'Derb Sidi Bouamar, Médina', lat: 31.6295, lng: -7.9811 },
    images: [IMG('1590073242678-70ee3fc28e8e'), IMG('1577493340887-b7bfff550145'), IMG('1571896349842-33c89424de2d'), IMG('1582719478250-c89cae4dc85b')],
    videos: [],
    host: person('user-016'),
    bedrooms: 4,
    bathrooms: 4,
    area: 200,
    amenities: ['Patio', 'Terrasse', 'Fontaine', 'Petit-déjeuner', 'WiFi', 'Climatisation'],
    rating: 0,
    reviewCount: 0,
  },
];

// ─── CONVERSATIONS ──────────────────────────────────────────────────────────

/* Les fils de la messagerie ne vivent plus ici : ils sont l'amorce du moteur
   d'interactions (chantier P2), dans `demo/inbox-seeds.ts`, et toute lecture
   passe par les vues dérivées de `demo/session-views.ts` (amorce + ce que le
   visiteur fait pendant sa session). */

// ─── FORMATIONS ─────────────────────────────────────────────────────────────

/* Les formations des créateurs du casting : Léo (investissement locatif),
   Amina (gestion locative touristique, pricing dynamique), Sandrine
   (fiscalité immobilière, premier achat), Reto (rénovation énergétique).
   `studentCount` égale les inscriptions du journal (invariant 19) ; `rating`
   est recalculé à partir des avis réels. */
export const formations: Formation[] = [
  {
    id: 'form-001',
    title: 'Investissement locatif : de z\u00e9ro \u00e0 rentier',
    description:
      'Formation compl\u00e8te pour ma\u00eetriser l\u2019investissement locatif. De la recherche du bien au calcul de rentabilit\u00e9, en passant par le financement et la fiscalit\u00e9 suisse.',
    category: 'Investissement',
    level: 'debutant',
    instructor: person('user-001'),
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
        duration: '2h',
        lessons: [
          { id: 'les-010', title: 'Multi-lots et immeubles', duration: '1h', completed: false },
          { id: 'les-011', title: 'Investir \u00e0 l\u2019\u00e9tranger', duration: '1h', completed: false },
        ],
      },
      {
        id: 'mod-005',
        title: '\u00c9tudes de cas et conclusion',
        duration: '1h',
        lessons: [
          { id: 'les-012', title: '\u00c9tude de cas r\u00e9els', duration: '1h', completed: false },
        ],
      },
    ],
    rating: 0,
    studentCount: 40,
  },
  {
    id: 'form-002',
    title: 'Ma\u00eetriser la location courte dur\u00e9e',
    description:
      'La gestion locative touristique de A \u00e0 Z : choisir ses plateformes, pr\u00e9parer le logement, \u00e9crire une annonce qui convertit, accueillir, g\u00e9rer les avis, rester dans les r\u00e8gles communales. Avec mes fiches et mes check-lists de m\u00e9nage et d\u2019accueil.',
    category: 'Location',
    level: 'intermediaire',
    instructor: person('user-016'),
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
    rating: 0,
    studentCount: 69,
  },

  {
    id: 'form-005',
    title: 'R\u00e9novation \u00e9nerg\u00e9tique : CECB, Minergie et subventions',
    description:
      'Lire un CECB, choisir entre isolation, fenêtres et pompe à chaleur, obtenir les subventions du Programme Bâtiments et des cantons, piloter le chantier. Une formation d’architecte pour propriétaires et gérances, avec les ordres de grandeur réels des coûts en Suisse romande.',
    category: 'R\u00e9novation',
    level: 'intermediaire',
    instructor: person('user-009'),
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
    rating: 0,
    studentCount: 20,
  },

  {
    id: 'form-007',
    title: 'Fiscalité immobilière en Suisse romande : l’essentiel',
    description:
      'Valeur locative, déduction des intérêts et des frais d’entretien, impôt sur la fortune, revenus locatifs dans un autre canton : ce que tout propriétaire romand doit savoir pour remplir sa déclaration sans se tromper. Cas pratiques vaudois, genevois, neuchâtelois et fribourgeois.',
    category: 'Fiscalité',
    level: 'debutant',
    instructor: person('user-011'),
    thumbnail: IMG('1554224155-6726b3ff858f'),
    price: 349,
    currency: 'CHF',
    duration: '6h',
    modules: [
      {
        id: 'mod-024',
        title: 'Les bases',
        duration: '2h',
        lessons: [
          { id: 'les-063', title: 'Revenu, fortune, valeur locative : les trois piliers', duration: '45min' },
          { id: 'les-064', title: 'Ce que l’on peut déduire, et ce que l’on ne peut pas', duration: '1h15' },
        ],
      },
      {
        id: 'mod-025',
        title: 'Le bailleur',
        duration: '2h',
        lessons: [
          { id: 'les-065', title: 'Déclarer un loyer, un meublé, une courte durée', duration: '1h' },
          { id: 'les-066', title: 'Un bien dans un autre canton : la répartition intercantonale', duration: '1h' },
        ],
      },
      {
        id: 'mod-026',
        title: 'Cas pratiques',
        duration: '2h',
        lessons: [
          { id: 'les-067', title: 'Quatre déclarations commentées (VD, GE, NE, FR)', duration: '1h30' },
          { id: 'les-068', title: 'Les erreurs que je voyais le plus en fiduciaire', duration: '30min' },
        ],
      },
    ],
    rating: 0,
    studentCount: 55,
  },
  {
    id: 'form-009',
    title: 'Premier achat : fonds propres, hypothèque et impôts',
    description:
      'Combien faut-il vraiment de fonds propres ? Peut-on utiliser son 2e pilier ? Que coûte un logement une fois acheté, impôts compris ? Une formation pas à pas pour préparer un premier achat en Suisse romande, avec un tableur de budget à remplir.',
    category: 'Investissement',
    level: 'debutant',
    instructor: person('user-011'),
    thumbnail: IMG('1450101499163-c8848c66ca85'),
    price: 290,
    currency: 'CHF',
    duration: '5h',
    modules: [
      {
        id: 'mod-030',
        title: 'Le budget',
        duration: '2h',
        lessons: [
          { id: 'les-076', title: '20 % de fonds propres : d’où ils peuvent venir', duration: '1h' },
          { id: 'les-077', title: 'Le taux théorique et la règle du tiers', duration: '1h' },
        ],
      },
      {
        id: 'mod-031',
        title: 'Après la signature',
        duration: '3h',
        lessons: [
          { id: 'les-078', title: 'Droits de mutation, frais de notaire, cédule', duration: '1h' },
          { id: 'les-079', title: 'Valeur locative et déductions : la première déclaration', duration: '1h' },
          { id: 'les-080', title: 'Retirer ou mettre en gage son 2e pilier', duration: '1h' },
        ],
      },
    ],
    rating: 0,
    studentCount: 34,
  },
  {
    id: 'form-010',
    title: 'Pricing dynamique pour la location courte durée',
    description:
      'Fixer son prix nuit par nuit selon la saison, les événements, le jour de la semaine et le délai de réservation. Les outils, les règles simples qui marchent sans outil, et comment lire son taux d’occupation pour ajuster. Testé sur mon riad et sur les logements de mes élèves.',
    category: 'Location',
    level: 'intermediaire',
    instructor: person('user-016'),
    thumbnail: IMG('1551434678-e076c223a692'),
    price: 290,
    currency: 'CHF',
    duration: '5h',
    modules: [
      {
        id: 'mod-033',
        title: 'Comprendre la demande',
        duration: '2h',
        lessons: [
          { id: 'les-084', title: 'Saisons, événements, jours de semaine', duration: '1h' },
          { id: 'les-085', title: 'Lire son taux d’occupation et son prix moyen', duration: '1h' },
        ],
      },
      {
        id: 'mod-034',
        title: 'Fixer ses prix',
        duration: '3h',
        lessons: [
          { id: 'les-086', title: 'Prix plancher, prix de base, prix d’événement', duration: '1h' },
          { id: 'les-087', title: 'Remises de dernière minute et séjours longs', duration: '1h' },
          { id: 'les-088', title: 'Outils automatiques : quand ils aident, quand ils nuisent', duration: '1h' },
        ],
      },
    ],
    rating: 0,
    studentCount: 51,
  },
];

// ─── AVIS ───────────────────────────────────────────────────────────────────

/* Chaque avis a pour auteur une personne de l'annuaire, et se rattache à ce
   qu'elle a RÉELLEMENT acheté, loué ou suivi :
     · un séjour   → une écriture de séjour au journal à son nom ;
     · un achat    → le bien porte `soldTo` = l'auteur ;
     · une formation → une inscription au journal à son nom ;
     · une prestation → une écriture `services` dont elle est le client, ou
       — dans l'autre sens — dont elle est le prestataire (avis croisés).
   L'invariant 18 le vérifie, avec la date : on n'évalue pas avant d'avoir
   acheté. Les avis ne sont pas unanimes, et chacun parle dans sa voix. */

export type ReviewSubject =
  | { kind: 'property'; id: string }
  | { kind: 'formation'; id: string }
  | { kind: 'service'; id: string };

export interface Review {
  id: string;
  /** Ce qui est évalué : un bien, une formation, une prestation. */
  subject: ReviewSubject;
  /** Compat : renseigné quand l'avis porte sur un bien (fiche du bien). */
  propertyId?: string;
  author: User;
  /** La personne qui REÇOIT l'avis — c'est elle dont le compteur augmente. */
  recipientId: string;
  rating: number;
  comment: string;
  createdAt: string;
  /** Réponse publique de la personne évaluée. */
  reply?: { content: string; createdAt: string };
}

function propertyReview(id: string, propertyId: string, authorId: string, rating: number, createdAt: string, comment: string, reply?: Review['reply']): Review {
  const p = properties.find((x) => x.id === propertyId);
  if (!p) throw new Error(`Avis ${id} : bien inconnu — ${propertyId}`);
  return { id, subject: { kind: 'property', id: propertyId }, propertyId, author: person(authorId), recipientId: p.host.id, rating, comment, createdAt, reply };
}

function formationReview(id: string, formationId: string, authorId: string, rating: number, createdAt: string, comment: string): Review {
  const f = formations.find((x) => x.id === formationId);
  if (!f) throw new Error(`Avis ${id} : formation inconnue — ${formationId}`);
  return { id, subject: { kind: 'formation', id: formationId }, author: person(authorId), recipientId: f.instructor.id, rating, comment, createdAt };
}

function serviceReview(id: string, serviceSaleId: string, authorId: string, recipientId: string, rating: number, createdAt: string, comment: string): Review {
  person(recipientId);
  return { id, subject: { kind: 'service', id: serviceSaleId }, author: person(authorId), recipientId, rating, comment, createdAt };
}

export const mockReviews: Review[] = [
  // ── Reçus par Léo Martin ────────────────────────────────────────────────
  propertyReview('rev-001', 'prop2', 'user-016', 5, '2026-05-03T09:00:00Z',
    'Studio très bien placé pour le salon à Genève : la gare à cinq minutes, tout était propre et prêt. Léo a répondu à mes questions en quelques minutes. Je reviendrai.'),
  propertyReview('rev-002', 'prop2', 'user-005', 4, '2026-07-02T21:40:00Z',
    'propre bien situe. lit ok. parking galere dans le quartier, prevoir le train'),
  propertyReview('rev-003', 'prop5', 'user-003', 4, '2026-02-03T08:00:00Z',
    'Appartement conforme à l’annonce. Chauffage efficace. Local à skis pratique. Arrivée à 16 h, pas avant : à préciser dans l’annonce.'),
  propertyReview('rev-004', 'prop5', 'user-011', 5, '2026-03-04T18:30:00Z',
    'Une semaine de ski en famille, sans une seule mauvaise surprise. L’appartement est chaleureux, la cheminée tire bien, et Léo avait laissé une liste claire de tout ce qu’il faut savoir. Merci !'),
  propertyReview('rev-005', 'prop9', 'user-013', 5, '2026-04-02T10:15:00Z',
    'Propre, bien équipé, arrivée autonome sans souci. En tant qu’hôte moi-même : bon rapport qualité-prix pour Lausanne, je n’aurais pas mis plus cher.'),
  formationReview('rev-006', 'form-001', 'user-003', 3, '2026-01-20T07:30:00Z',
    'Correct pour débuter. Les hypothèses de taux du module 2 sont optimistes. Le calcul du rendement net est juste.'),
  formationReview('rev-007', 'form-001', 'user-008', 4, '2026-05-25T20:10:00Z',
    'J’ai enfin compris la différence entre rendement brut et net… et que ce n’est peut-être pas pour nous tout de suite. Il manque un module sur l’achat à deux ? Mais c’est très clair.'),

  // ── Reçus par Céline Bovard ─────────────────────────────────────────────
  propertyReview('rev-008', 'prop1', 'user-003', 4, '2026-02-10T08:00:00Z',
    'Achat conclu en sept semaines. Dossier complet dès la première visite. Délais tenus. Prix final 2 % sous le prix affiché. Rien à redire.',
    { content: 'Merci Ennio. Ce fut un plaisir de vous accompagner — et de savoir que cet appartement, où la lumière du matin entre par la cuisine, a trouvé quelqu’un qui en prendra soin.', createdAt: '2026-02-12T17:20:00Z' }),
  propertyReview('rev-009', 'prop23', 'user-012', 4, '2026-08-04T09:00:00Z',
    'Séjour agréable avec mon épouse à l’occasion d’un concert à Lausanne. Studio propre et très bien situé, Madame Bovard est d’une grande amabilité. Le lit est un peu ferme à notre âge. Meilleures salutations, Y. Mottiez'),
  propertyReview('rev-010', 'prop23', 'user-014', 5, '2026-09-03T19:00:00Z',
    'Parfait pour deux jours de rendez-vous à Lausanne : le métro en bas, le lac devant. Céline pense à tout, jusqu’à la liste des bonnes adresses d’Ouchy.'),
  serviceReview('rev-011', 'sv-nik-morges', 'user-005', 'user-002', 5, '2026-09-06T13:00:00Z',
    'cliente top. brief clair, acces ok, paye direct. on refait quand tu veux celine'),
  serviceReview('rev-012', 'sv-ele-morges', 'user-010', 'user-002', 5, '2026-09-08T11:30:00Z',
    'Travailler avec Céline, c’est un plaisir : elle connaît chaque pièce de ses biens et sait exactement ce qu’elle veut montrer. Brief précis, clés à l’heure, retours rapides.'),

  // ── Reçus par Nikola Ristić ─────────────────────────────────────────────
  serviceReview('rev-013', 'sv-nik-riex', 'user-002', 'user-005', 5, '2026-06-05T08:45:00Z',
    'Nikola a saisi la maison de Riex exactement comme je la voulais : la lumière du soir sur les vignes, la cave voûtée, la terrasse. Les vues de drone ont fait la moitié des demandes de visite. Rapide, discret, ponctuel.'),
  serviceReview('rev-014', 'sv-nik-pully', 'user-007', 'user-005', 4, '2026-08-12T10:00:00Z',
    'Trés belles photos. Le jeune homme était ponctuel et poli. Le drone a un peu effrayé le chat. Je recommande.'),
  serviceReview('rev-015', 'sv-nik-leo', 'user-001', 'user-005', 5, '2026-02-06T12:00:00Z',
    'Reportage livré en 48 h. Depuis que les nouvelles photos sont en ligne, les demandes pour le studio ont nettement augmenté. Je le recommande sans hésiter.'),

  // ── Reçu par Elena Currat ───────────────────────────────────────────────
  serviceReview('rev-016', 'sv-ele-riex', 'user-002', 'user-010', 5, '2026-06-06T09:10:00Z',
    'Elena a rendu à la maison de Riex sa chaleur, sans en faire un décor : trois meubles déplacés, du lin, des bouquets de saison. Les visiteurs se voyaient y vivre. Je ne prépare plus une vente sans elle.'),

  // ── Reçus par Reto Jungo ────────────────────────────────────────────────
  serviceReview('rev-017', 'sv-reto-cecb', 'user-015', 'user-009', 5, '2026-03-20T14:00:00Z',
    'Étude énergétique rigoureuse et concept de rénovation clair, chiffré par étapes. Monsieur Jungo a su expliquer ses choix aux copropriétaires comme à nos équipes. Une collaboration que nous poursuivrons.'),
  formationReview('rev-018', 'form-005', 'user-004', 5, '2026-04-15T18:00:00Z',
    'Suivie pour mieux conseiller nos propriétaires : le module sur les subventions cantonales est directement utilisable. Clair, concret, avec les bons ordres de grandeur.'),

  // ── Reçus par Sandrine Monnier ──────────────────────────────────────────
  formationReview('rev-019', 'form-007', 'user-001', 5, '2026-03-10T20:00:00Z',
    'Je remplissais ma déclaration de bailleur à l’instinct depuis trois ans. Le module sur la répartition intercantonale m’a appris que je le faisais mal pour mon studio de Genève. Clair, structuré, et Sandrine répond aux questions.'),
  formationReview('rev-020', 'form-009', 'user-008', 4, '2026-06-14T21:15:00Z',
    'Très pédagogique. Le tableur de budget nous a un peu fait peur, on est encore loin des 20 %… mais au moins on sait où on en est. Merci Sandrine.'),

  // ── Reçus par Amina El Idrissi ──────────────────────────────────────────
  formationReview('rev-021', 'form-010', 'user-013', 5, '2026-02-15T09:30:00Z',
    'Appliqué sur mes deux appartements de Montreux : en novembre et en janvier, j’ai rempli des semaines qui restaient vides, sans baisser mon prix moyen. Le module sur les prix d’événement a remboursé la formation dès le Jazz.'),
  propertyReview('rev-022', 'prop4', 'user-002', 5, '2026-05-02T16:00:00Z',
    'Une maison qui respire : le patio au réveil, les oranges, le thé sur la terrasse au coucher du soleil. Fatiha nous a accueillis comme des amis. Amina répond à tout, avec beaucoup de gentillesse.'),

  // ── Reçus par Ennio Bordoni ─────────────────────────────────────────────
  propertyReview('rev-023', 'prop24', 'user-008', 5, '2026-07-20T11:00:00Z',
    'Week-end au Jazz avec mon compagnon : studio propre, très bien placé, arrivée autonome facile. On a hésité à cause du minimum de trois nuits, mais finalement c’était parfait.'),
  propertyReview('rev-024', 'prop25', 'user-015', 4, '2026-06-03T08:30:00Z',
    'Logement fonctionnel et bien tenu, idéal pour des rendez-vous à Genève. Rez-de-chaussée un peu sombre. Échanges brefs mais efficaces avec le propriétaire.'),

  // ── Reçus par Jean-Luc Hartmann ─────────────────────────────────────────
  propertyReview('rev-025', 'prop27', 'user-011', 5, '2026-02-18T10:00:00Z',
    'Nous avons acheté notre villa d’Hauterive par Hartmann Immobilier. Estimation juste, visites bien organisées, et un dossier fiscal impeccable — ce qui, venant d’une ancienne fiduciaire, n’est pas un petit compliment.'),
  propertyReview('rev-026', 'prop26', 'user-009', 5, '2026-04-04T07:45:00Z',
    'Logé ici pendant les relevés de l’immeuble de la rue des Parcs. Bien situé, calme, propre. Pratique de pouvoir travailler sur la table du séjour.'),

  // ── Reçus par Mirjana Kovač ─────────────────────────────────────────────
  propertyReview('rev-027', 'prop12', 'user-001', 5, '2026-07-01T09:00:00Z',
    'Venu voir comment une hôte expérimentée prépare un logement : tout est pensé, du guide d’arrivée aux prises près du lit. Vue lac superbe. J’ai pris des notes.'),
  propertyReview('rev-028', 'prop12', 'user-006', 5, '2026-09-05T15:20:00Z',
    'Merci Mirjana, tout était propre et les enfants ont adoré le lac. Est-ce que c’est normal de laisser une caution pour les clés ? Sinon parfait, on reviendra.'),
  propertyReview('rev-029', 'prop6', 'user-014', 4, '2026-07-22T10:40:00Z',
    'Idéal pour le Jazz : on rentre à pied par les quais. Studio petit mais bien rangé. La terrasse donne sur la rue, un peu bruyant le samedi soir.'),
];

/** Les avis reçus par une personne, du plus récent au plus ancien. */
export function reviewsReceivedBy(personId: string): Review[] {
  return mockReviews
    .filter((r) => r.recipientId === personId)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Les avis rédigés par une personne. */
export function reviewsWrittenBy(personId: string): Review[] {
  return mockReviews.filter((r) => r.author.id === personId);
}

/** Note moyenne arrondie au dixième (0 sans avis). */
export function averageRating(reviews: readonly { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

// ─── LES COMPTEURS DÉRIVÉS ──────────────────────────────────────────────────

/* Calculés une fois, à l'import, à partir des données ci-dessus. Les objets
   `User` sont partagés par référence (hôtes des biens, formateurs, auteurs
   d'avis) : tamponner la personne met à jour tous les écrans d'un coup. */
function stampDerivedStats(): void {
  for (const u of users) {
    const received = mockReviews.filter((r) => r.recipientId === u.id);
    u.stats.properties = properties.filter((p) => p.host.id === u.id).length;
    u.stats.reviews = received.length;
    u.stats.rating = averageRating(received);
    u.stats.followers = followerCount(u.id);
    u.stats.following = followingCount(u.id);
  }
  for (const p of properties) {
    const rs = mockReviews.filter((r) => r.propertyId === p.id);
    p.reviewCount = rs.length;
    p.rating = averageRating(rs);
  }
  for (const f of formations) {
    f.rating = averageRating(mockReviews.filter((r) => r.subject.kind === 'formation' && r.subject.id === f.id));
  }
}
stampDerivedStats();

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

/** Les biens encore disponibles : un bien vendu (`soldTo`) n'est plus proposé. */
export function isAvailable(p: Property): boolean {
  return !p.soldTo;
}

export function getSimilarProperties(property: Property): Property[] {
  // Priorité : même type de transaction, puis même pays, puis même type de bien
  const pool = properties.filter((p) => p.id !== property.id && isAvailable(p));
  const sameTransaction = pool.filter((p) => p.transactionType === property.transactionType);
  if (sameTransaction.length >= 3) return sameTransaction.slice(0, 4);
  // Fallback : même pays
  const sameCountry = pool.filter((p) => p.location.country === property.location.country);
  if (sameCountry.length >= 2) return sameCountry.slice(0, 4);
  // Dernier fallback : n'importe quel bien différent
  return pool.slice(0, 4);
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
