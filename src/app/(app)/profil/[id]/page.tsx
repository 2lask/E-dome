"use client";

import { use } from "react";
import { useApp } from "@/lib/context";
import { useRouter } from "next/navigation";
import { getMockProfile } from "@/lib/profile-data";
import { avisOf, biensOf, formationsOf } from "@/lib/demo/showcase";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfileData } from "@/components/profile/profile-showcase";
import { getPublicPosts, profileToAuthor } from "@/lib/profile-posts";
import { BackButton } from "@/components/ui/back-button";
import type { Profile } from "@/lib/profile-types";
import { gmvVolume } from "@/lib/demo/derive";
import { DEMO_TODAY } from "@/lib/demo/clock";
import { useSession } from "@/lib/use-session";
import { sessionShowcaseOf, sessionAvisOf } from "@/lib/demo/session-views";
import { findService, servicesOf } from "@/lib/demo/services-catalog";
import { personById } from "@/lib/demo/directory";
import { primeEligibility } from "@/lib/pricing";
import { PrimeCountryNotice } from "@/components/business/apporteur-summary";

/* /profil/[id] — profil public d'un autre utilisateur. Le profil (identité +
   sections LinkedIn) vient de getMockProfile ; la vitrine (biens/formations…)
   est dérivée de la donnée réelle. Le bouton « Suivre » agit sur le même état
   de suivi que /reseau. Lecture seule (isOwn=false). */

/* Volume de transactions (D16.1) — l'année civile de `DEMO_TODAY`, jamais
   `new Date()` au rendu. Affiché seulement pour un agent ou une agence qui en
   a un : c'est le GMV non commissionnable du journal, la somme des biens
   vendus par son intermédiaire. Ce n'est PAS un revenu — ni le sien, ni celui
   d'E-Dome — et le libellé le dit. */
const VOLUME_YEAR = DEMO_TODAY.getUTCFullYear();

function transactionVolumeFor(profile: Profile): { year: number; amountChf: number } | undefined {
  if (!profile.roles.some((r) => r === "agent" || r === "agence")) return undefined;
  const amountChf = gmvVolume(profile.id, VOLUME_YEAR);
  return amountChf > 0 ? { year: VOLUME_YEAR, amountChf } : undefined;
}

export default function ProfilByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const profile = getMockProfile(id);
  const { isFollowing, toggleFollow } = useApp();
  const { state: sessionState } = useSession();

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

  /* Vitrine RÉELLE, sans gabarit générique : les biens qu'elle héberge, les
     formations dont elle est l'autrice, les avis qu'elle a reçus (dérivés,
     `lib/demo/showcase.ts`). Une vitrine vide reste vide : on n'invente pas
     de biens ni d'avis pour la remplir. Produits, lives et services n'ont pas
     encore de propriétaire dans la donnée (chantiers P4/P6). */
  const { avis, ratingBreakdown } = avisOf(profile.id);
  /* + ce que cette personne a publié pendant la session (chantier P3 : quand
     on l'incarne, ses publications apparaissent sur sa fiche publique). */
  const added = sessionShowcaseOf(sessionState, profile.id);
  /* P6a : les services du catalogue tenus par cette personne, et les avis de
     prestation laissés pendant la session (en tête). */
  const sessionAvis = sessionAvisOf(sessionState, profile.id, (sid) => findService(sessionState, sid)?.title);
  const catalogServices = servicesOf(sessionState, profile.id)
    .filter((s) => !s.fromSession)
    .map((s) => ({ id: s.id, title: s.title, cover: s.avatar, price: s.price, currency: "CHF", unit: s.unit }));
  const allAvis = [...sessionAvis, ...avis];
  const allBreakdown = ratingBreakdown.map((b) => ({ ...b, count: b.count + sessionAvis.filter((a) => a.rating === b.stars).length }));
  const showcase: ProfileData = {
    biens: [...added.biens, ...biensOf(profile.id)],
    formations: [...added.formations, ...formationsOf(profile.id)],
    produits: [],
    lives: added.lives,
    services: [...added.services, ...catalogServices],
    avis: allAvis,
    ratingBreakdown: allBreakdown,
    posts: getPublicPosts(profileToAuthor(profile)),
  };

  /* Restriction pays VISIBLE (D7) : un apporteur d'un pays où le volet biens
     est fermé (France, Allemagne, Portugal…) ne touche jamais de prime sur un
     bien — et sa fiche dit pourquoi. */
  const person = personById(profile.id);
  const primeAccess = person?.roles.includes("apporteur") ? primeEligibility(person.country) : undefined;

  return (
    <>
      <div className="md:hidden mb-2 -mt-2">
        <BackButton fallbackHref="/feed" />
      </div>
      {primeAccess && !primeAccess.eligible && (
        <div className="mb-3">
          <PrimeCountryNotice country={primeAccess.country} reason={primeAccess.reason} />
        </div>
      )}
      <ProfileView
        profile={profile}
        isOwn={false}
        showcase={showcase}
        transactionVolume={transactionVolumeFor(profile)}
        isFollowing={isFollowing(profile.id)}
        onToggleFollow={() => toggleFollow(profile.id)}
        onMessage={() => router.push(`/messages?to=${profile.id}`)}
      />
    </>
  );
}
