"use client";

import { useState, use } from "react";
import { properties as CATALOGUE, mockReviews } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { getMockProfile } from "@/lib/profile-data";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfileData, ProfileBien, ProfileAvis } from "@/components/profile/profile-showcase";
import { getPublicPosts, profileToAuthor } from "@/lib/profile-posts";
import { BackButton } from "@/components/ui/back-button";
import type { Role } from "@/lib/types";

/* /profil/[id] — profil public d'un autre utilisateur. Le profil (identité +
   sections LinkedIn) vient de getMockProfile ; la vitrine (biens/formations…)
   est générée selon le rôle principal. Lecture seule (isOwn=false). */

/* Meme collision que sur /profil : « prop2 » designait ici un appartement a
   1 250 000 CHF a Montreux, quand le catalogue en fait un studio a 120 CHF la
   nuit a Geneve. Les deux premieres fiches du catalogue servent de vitrine
   generique pour un profil consulte. */
const BIENS = CATALOGUE.slice(0, 2).map((c) => ({
  id: c.id,
  title: c.title,
  cover: c.images[0]!,
  price: c.price,
  currency: c.currency,
  unit: c.transactionType === "vente" ? "" : "/nuit",
  location: `${c.location.city}, ${c.location.country}`,
}));
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

/* Vitrine RÉELLE d'une personne, dérivée de l'annuaire — pas un jeu générique.
   Les biens sont ceux qu'elle héberge au catalogue (host = son id) ; les avis
   reçus sont les avis de ces biens. C'est ce qui rend le profil cohérent :
   /profil/user-002 montre les vrais biens de Sophie et les vrais avis reçus,
   dont celui de Marc sur l'appartement qu'il lui a acheté. Un profil qui
   n'héberge rien retombe sur la vitrine générique (voir merge plus bas). */
const MONTHS_FR_SHORT = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

/* Date « 15 mars 2026 » — construite à la main, JAMAIS via toLocaleDateString :
   le mois localisé et le séparateur varient entre l'ICU du serveur et celui du
   navigateur, ce qui casse l'hydratation. */
function frDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS_FR_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function biensForHost(id: string): ProfileBien[] {
  return CATALOGUE.filter((c) => c.host.id === id).map((c) => ({
    id: c.id,
    title: c.title,
    cover: c.images[0]!,
    price: c.price,
    currency: c.currency,
    unit: c.transactionType === "vente" ? "" : c.transactionType === "location-lt" ? "/mois" : "/nuit",
    location: `${c.location.city}, ${c.location.country}`,
  }));
}

function avisForHost(id: string): { avis: ProfileAvis[]; ratingBreakdown: { stars: number; count: number }[] } {
  const hosted = new Set(CATALOGUE.filter((c) => c.host.id === id).map((c) => c.id));
  const revs = mockReviews
    .filter((r) => hosted.has(r.propertyId))
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const avis: ProfileAvis[] = revs.map((r) => ({
    id: r.id,
    author: `${r.author.firstName} ${r.author.lastName}`.trim(),
    rating: r.rating,
    text: r.comment,
    date: frDate(r.createdAt),
  }));
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: revs.filter((r) => r.rating === stars).length,
  }));
  return { avis, ratingBreakdown };
}

/* Vitrine adaptée au rôle principal : une agence/courtier/promoteur affiche
   surtout des biens, un formateur surtout des formations, etc. */
function showcaseForRole(primary: Role): Omit<ProfileData, "posts"> {
  if (primary === "agence" || primary === "courtier" || primary === "promoteur") {
    return {
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

  /* Vitrine : le squelette dépend du rôle (générique), mais les biens et les
     avis sont RÉELS quand la personne en a — dérivés de l'annuaire, pas inventés.
     Fallback sur le générique uniquement pour une personne qui n'héberge aucun
     bien / n'a reçu aucun avis, pour ne pas afficher une vitrine vide. */
  const base = showcaseForRole(profile.roles[0] ?? "client");
  const realBiens = biensForHost(profile.id);
  const { avis, ratingBreakdown } = avisForHost(profile.id);
  const showcase: ProfileData = {
    ...base,
    biens: realBiens.length > 0 ? realBiens : base.biens,
    avis: avis.length > 0 ? avis : base.avis,
    ratingBreakdown: avis.length > 0 ? ratingBreakdown : base.ratingBreakdown,
    posts: getPublicPosts(profileToAuthor(profile)),
  };

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
