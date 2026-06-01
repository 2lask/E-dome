"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ProfileVitrine, type ProfileUser, type ProfileData } from "@/components/profile/profile-vitrine";

/* /profil/[id] — profil d'un autre utilisateur. Consomme <ProfileVitrine>
   avec isOwn=false. Une mockUsers map donne quelques profils variés
   (hôte, agence, formatrice, promoteur, courtier…). Données fictives.

   La structure d'onglets est strictement la même que /profil — la vitrine
   est unifiée pour tous les types de comptes. */

// ─── Profils fictifs ─────────────────────────────────────────────

const MOCK_USERS: Record<string, ProfileUser> = {
  "user-001": {
    id: "user-001",
    firstName: "Léo",
    lastName: "Martin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240",
    city: "Lausanne",
    country: "Suisse",
    roles: ["Hôte", "Formateur", "Apporteur"],
    bio: "Expert immobilier certifié USPI. Spécialiste des investissements locatifs en Suisse romande et à l'international.",
    isMembreFondateur: true,
    stats: { followers: 2340, following: 812, rating: 4.8, reviewsCount: 87 },
  },
  "user-002": {
    id: "user-002",
    firstName: "Sophie",
    lastName: "Durand",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240",
    city: "Lausanne",
    country: "Suisse",
    roles: ["Courtière BF", "Hôte"],
    bio: "Courtière Brevet Fédéral spécialisée dans l'immobilier de standing en Suisse romande.",
    stats: { followers: 890, following: 210, rating: 4.8, reviewsCount: 42 },
  },
  "user-003": {
    id: "user-003",
    firstName: "Marc",
    lastName: "Favre",
    avatar: "https://images.unsplash.com/photo-1519345182560-cabd3c3338a3?w=240",
    city: "Genève",
    country: "Suisse",
    roles: ["Courtier", "Hôte"],
    bio: "Agent immobilier et hôte actif à Genève. Spécialiste de la location courte durée.",
    stats: { followers: 640, following: 340, rating: 4.7, reviewsCount: 42 },
  },
  "user-004": {
    id: "user-004",
    firstName: "Amina",
    lastName: "El Idrissi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240",
    city: "Marrakech",
    country: "Maroc",
    roles: ["Formatrice", "Hôte"],
    bio: "Formatrice et hôte au Maroc. Experte en investissement locatif dans les marchés émergents.",
    stats: { followers: 1200, following: 610, rating: 4.9, reviewsCount: 98 },
  },
  "user-005": {
    id: "user-005",
    firstName: "Lucas",
    lastName: "Renaud",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240",
    city: "Nice",
    country: "France",
    roles: ["Promoteur"],
    bio: "Promoteur immobilier sur la Côte d'Azur. Spécialiste des villas de prestige.",
    stats: { followers: 520, following: 430, rating: 4.6, reviewsCount: 56 },
  },
  "user-006": {
    id: "user-006",
    firstName: "Yasmin",
    lastName: "Al Maktoum",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240",
    city: "Dubaï",
    country: "EAU",
    roles: ["Agence"],
    bio: "Agence immobilière premium à Dubaï. Spécialiste des résidences de luxe.",
    stats: { followers: 3500, following: 480, rating: 4.8, reviewsCount: 64 },
  },
  "user-015": {
    id: "user-015",
    firstName: "Jean-Luc",
    lastName: "Hartmann",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240",
    city: "Neuchâtel",
    country: "Suisse",
    roles: ["Agence"],
    bio: "Agence familiale en Suisse romande. Vente et gestion locative depuis 1992.",
    stats: { followers: 280, following: 150, rating: 4.5, reviewsCount: 22 },
  },
};

// ─── Mocks de données — varient selon le rôle principal ──────────

const PUBLICATIONS_DEFAULT = [
  { id: "pub1", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", caption: "Nouveau bien sur le marché — vue panoramique." },
  { id: "pub2", src: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=600", caption: "Saison ouverte sur les locations alpines." },
  { id: "pub3", src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600", caption: "Inspirations design pour vos intérieurs." },
  { id: "pub4", src: "https://images.unsplash.com/photo-1590073242678-70ee818e55fb?w=600", caption: "Visite d'un riad rénové." },
];

const BIENS_DEFAULT = [
  { id: "prop1", title: "Chalet Verbier", cover: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", price: 350, currency: "CHF", unit: "/nuit", location: "Verbier, Suisse" },
  { id: "prop2", title: "Appartement Vue Lac", cover: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", price: 1_250_000, currency: "CHF", unit: "", location: "Montreux, Suisse" },
];

const PRODUITS_DEFAULT = [
  { id: "prod1", title: "Plaid lin lavé", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 89, currency: "CHF", stock: 14 },
];

const FORMATIONS_DEFAULT = [
  { id: "form-001", title: "Investissement locatif", cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", price: 497, currency: "CHF", students: 342, rating: 4.9 },
];

const LIVES_DEFAULT = [
  { id: "live1", title: "Décrypter les annonces", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", status: "scheduled" as const, scheduledAt: "2026-06-12 19:00", expectedViewers: 320 },
];

const SERVICES_DEFAULT = [
  { id: "s1", title: "Conseil investissement", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 250, currency: "CHF", unit: "/h" },
];

const AVIS_DEFAULT = [
  { id: "r1", author: "Jean-Pierre M.", rating: 5, text: "Excellent contact, recommandé sans hésiter.", date: "15 mars 2026" },
  { id: "r2", author: "Marie L.", rating: 5, text: "Sérieux, réactif, et un vrai sens du conseil.", date: "28 fév. 2026" },
  { id: "r3", author: "Thomas K.", rating: 4, text: "Très bonne expérience dans l'ensemble.", date: "10 jan. 2026" },
];

const RATING_BREAKDOWN_DEFAULT = [
  { stars: 5, count: 2 },
  { stars: 4, count: 1 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

function dataForUser(user: ProfileUser): ProfileData {
  const primary = user.roles[0]?.toLowerCase() || "";

  // Adaptation simple selon le rôle principal pour qu'un profil agence
  // affiche surtout des biens, une formatrice surtout des formations, etc.
  // (Maquette — données fictives.)
  if (primary.includes("agence") || primary.includes("courtier") || primary.includes("courtière") || primary.includes("promoteur")) {
    return {
      publications: PUBLICATIONS_DEFAULT.slice(0, 3),
      biens: [
        ...BIENS_DEFAULT,
        { id: "prop-extra-1", title: "Penthouse Genève", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600", price: 3_200_000, currency: "CHF", unit: "", location: "Genève, Suisse" },
        { id: "prop-extra-2", title: "Maison familiale", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", price: 980_000, currency: "CHF", unit: "", location: "Lausanne, Suisse" },
      ],
      produits: [],
      formations: [],
      lives: [],
      services: SERVICES_DEFAULT,
      avis: AVIS_DEFAULT,
      ratingBreakdown: RATING_BREAKDOWN_DEFAULT,
    };
  }
  if (primary.includes("formateur") || primary.includes("formatrice")) {
    return {
      publications: PUBLICATIONS_DEFAULT.slice(0, 4),
      biens: BIENS_DEFAULT.slice(0, 1),
      produits: [],
      formations: [
        ...FORMATIONS_DEFAULT,
        { id: "form-002", title: "Gestion locative CT", cover: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600", price: 397, currency: "CHF", students: 178, rating: 4.8 },
        { id: "form-003", title: "Fiscalité immobilière", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 297, currency: "CHF", students: 95, rating: 4.7 },
      ],
      lives: LIVES_DEFAULT,
      services: [],
      avis: AVIS_DEFAULT,
      ratingBreakdown: RATING_BREAKDOWN_DEFAULT,
    };
  }
  // Hôte / autre — mix générique
  return {
    publications: PUBLICATIONS_DEFAULT,
    biens: BIENS_DEFAULT,
    produits: PRODUITS_DEFAULT,
    formations: FORMATIONS_DEFAULT,
    lives: LIVES_DEFAULT,
    services: SERVICES_DEFAULT,
    avis: AVIS_DEFAULT,
    ratingBreakdown: RATING_BREAKDOWN_DEFAULT,
  };
}

// ─── Page ─────────────────────────────────────────────────────────

export default function ProfilByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = MOCK_USERS[id];
  const [isFollowing, setIsFollowing] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
        <h1 className="text-xl page-heading" style={{ color: "var(--foreground)" }}>
          Profil introuvable
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          Cet utilisateur n&apos;existe pas dans la maquette.
        </p>
        <button
          onClick={() => router.push("/feed")}
          className="mt-6 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Retour au feed
        </button>
      </div>
    );
  }

  const data = dataForUser(user);

  return (
    <ProfileVitrine
      user={user}
      data={data}
      isOwn={false}
      isFollowing={isFollowing}
      onToggleFollow={() => setIsFollowing((v) => !v)}
      onMessage={() => router.push(`/messages?to=${user.id}`)}
    />
  );
}
