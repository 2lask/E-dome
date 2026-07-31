"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { getMockProfile } from "@/lib/profile-data";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfileData } from "@/components/profile/profile-showcase";
import { BackButton } from "@/components/ui/back-button";
import type { Role } from "@/lib/types";

/* /profil/[id] — profil public d'un autre utilisateur. Le profil (identité +
   sections LinkedIn) vient de getMockProfile ; la vitrine (biens/formations…)
   est générée selon le rôle principal. Lecture seule (isOwn=false). */

const PUBLICATIONS = [
  { id: "pub1", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", caption: "Nouveau bien sur le marché — vue panoramique." },
  { id: "pub2", src: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=600", caption: "Saison ouverte sur les locations alpines." },
  { id: "pub3", src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600", caption: "Inspirations design pour vos intérieurs." },
  { id: "pub4", src: "https://images.unsplash.com/photo-1590073242678-70ee818e55fb?w=600", caption: "Visite d'un riad rénové." },
];
const BIENS = [
  { id: "prop1", title: "Chalet Verbier", cover: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", price: 350, currency: "CHF", unit: "/nuit", location: "Verbier, Suisse" },
  { id: "prop2", title: "Appartement Vue Lac", cover: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", price: 1_250_000, currency: "CHF", unit: "", location: "Montreux, Suisse" },
];
const PRODUITS = [
  { id: "prod1", title: "Plaid lin lavé", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 89, currency: "CHF", stock: 14 },
];
const FORMATIONS = [
  { id: "form-001", title: "Investissement locatif", cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", price: 497, currency: "CHF", students: 342, rating: 4.9 },
];
const LIVES = [
  { id: "live1", title: "Décrypter les annonces", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", status: "scheduled" as const, scheduledAt: "2026-06-12 19:00", expectedViewers: 320 },
];
const SERVICES = [
  { id: "s1", title: "Conseil investissement", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 250, currency: "CHF", unit: "/h" },
];
const AVIS = [
  { id: "r1", author: "Jean-Pierre M.", rating: 5, text: "Excellent contact, recommandé sans hésiter.", date: "15 mars 2026" },
  { id: "r2", author: "Marie L.", rating: 5, text: "Sérieux, réactif, et un vrai sens du conseil.", date: "28 fév. 2026" },
  { id: "r3", author: "Thomas K.", rating: 4, text: "Très bonne expérience dans l'ensemble.", date: "10 jan. 2026" },
];
const RATING_BREAKDOWN = [
  { stars: 5, count: 2 },
  { stars: 4, count: 1 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

/* Vitrine adaptée au rôle principal : une agence/courtier/promoteur affiche
   surtout des biens, un formateur surtout des formations, etc. */
function showcaseForRole(primary: Role): ProfileData {
  if (primary === "agence" || primary === "courtier" || primary === "promoteur") {
    return {
      publications: PUBLICATIONS.slice(0, 3),
      biens: [
        ...BIENS,
        { id: "prop-extra-1", title: "Penthouse Genève", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600", price: 3_200_000, currency: "CHF", unit: "", location: "Genève, Suisse" },
        { id: "prop-extra-2", title: "Maison familiale", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", price: 980_000, currency: "CHF", unit: "", location: "Lausanne, Suisse" },
      ],
      produits: [],
      formations: [],
      lives: [],
      services: SERVICES,
      avis: AVIS,
      ratingBreakdown: RATING_BREAKDOWN,
    };
  }
  if (primary === "formateur") {
    return {
      publications: PUBLICATIONS.slice(0, 4),
      biens: BIENS.slice(0, 1),
      produits: [],
      formations: [
        ...FORMATIONS,
        { id: "form-002", title: "Gestion locative CT", cover: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600", price: 397, currency: "CHF", students: 178, rating: 4.8 },
        { id: "form-003", title: "Fiscalité immobilière", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 297, currency: "CHF", students: 95, rating: 4.7 },
      ],
      lives: LIVES,
      services: [],
      avis: AVIS,
      ratingBreakdown: RATING_BREAKDOWN,
    };
  }
  return {
    publications: PUBLICATIONS,
    biens: BIENS,
    produits: PRODUITS,
    formations: FORMATIONS,
    lives: LIVES,
    services: SERVICES,
    avis: AVIS,
    ratingBreakdown: RATING_BREAKDOWN,
  };
}

export default function ProfilByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const profile = getMockProfile(id);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">Profil introuvable</h1>
        <p className="text-sm mt-2 text-[var(--text-muted)]">
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

  const showcase = showcaseForRole(profile.roles[0] ?? "client");

  return (
    <>
      <div className="md:hidden mb-2 -mt-2">
        <BackButton fallbackHref="/feed" />
      </div>
      <ProfileView
        profile={profile}
        isOwn={false}
        showcase={showcase}
        isFollowing={isFollowing}
        onToggleFollow={() => setIsFollowing((v) => !v)}
        onMessage={() => router.push(`/messages?to=${profile.id}`)}
      />
    </>
  );
}
