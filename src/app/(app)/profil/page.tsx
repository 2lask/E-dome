"use client";

import { useMemo } from "react";
import { CURRENT_USER_ID } from "@/lib/demo/identity";
import { avisOf, biensOf, formationsOf } from "@/lib/demo/showcase";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfileData } from "@/components/profile/profile-showcase";
import { getMyPosts, profileToAuthor } from "@/lib/profile-posts";
import { useSession } from "@/lib/use-session";
import { useActorProfile } from "@/lib/use-actor";
import { sessionShowcaseOf } from "@/lib/demo/session-views";
import { gmvVolume } from "@/lib/demo/derive";
import { DEMO_TODAY } from "@/lib/demo/clock";

/* /profil — MA fiche, celle de la personne incarnée (chantier P3).

   Pour Léo, l'identité et les sections « LinkedIn » viennent du profil
   éditable du contexte (persisté). Pour une autre personne incarnée, c'est sa
   fiche d'annuaire — la même que /profil/[id] —, sans les modales d'édition
   (elles écrivent dans le profil de Léo). Biens, formations et avis sont
   RÉELS (dérivés) ; ce que la personne a publié pendant la visite passe en
   tête. Produits, lives et services d'exemple ne restent que chez Léo, en
   attendant leur propriétaire dans la donnée (chantiers P4/P6). */

const LEO_EXAMPLES: Pick<ProfileData, "produits" | "lives" | "services"> = {
  produits: [
    { id: "prod1", title: "Plaid lin lavé bleu nuit", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 89, currency: "CHF", stock: 14 },
    { id: "prod2", title: "Lampe céramique nordique", cover: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600", price: 145, currency: "CHF", stock: 6 },
    { id: "prod3", title: "Vase grès noir mat", cover: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", price: 65, currency: "CHF", stock: 22 },
  ],
  lives: [
    { id: "live1", title: "Décrypter les annonces immobilières", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", status: "scheduled", scheduledAt: "2026-06-12 19:00", expectedViewers: 320 },
    { id: "live2", title: "Q&R : fiscalité locative en Suisse", cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600", status: "replay", replayViews: 1240 },
  ],
  services: [
    { id: "s1", title: "Conseil investissement personnalisé", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 250, currency: "CHF", unit: "/h" },
    { id: "s2", title: "Audit de portefeuille immobilier", cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", price: 1800, currency: "CHF", unit: "" },
  ],
};

/* Volume de transactions (D16.1), comme sur /profil/[id] : l'année de
   `DEMO_TODAY`, jamais `new Date()` au rendu. */
const VOLUME_YEAR = DEMO_TODAY.getUTCFullYear();

export default function ProfilPage() {
  const { profile, editable } = useActorProfile();
  const { state: sessionState, actorId } = useSession();
  const showcase: ProfileData = useMemo(() => {
    const added = sessionShowcaseOf(sessionState, actorId);
    const { avis, ratingBreakdown } = avisOf(actorId);
    const examples = actorId === CURRENT_USER_ID ? LEO_EXAMPLES : { produits: [], lives: [], services: [] };
    return {
      biens: [...added.biens, ...biensOf(actorId)],
      produits: examples.produits,
      formations: [...added.formations, ...formationsOf(actorId)],
      services: [...added.services, ...examples.services],
      lives: [...added.lives, ...examples.lives],
      avis,
      ratingBreakdown,
      posts: getMyPosts(profileToAuthor(profile)),
    };
  }, [profile, sessionState, actorId]);
  const volume = profile.roles.some((r) => r === "agent" || r === "agence") ? gmvVolume(actorId, VOLUME_YEAR) : 0;
  return (
    <ProfileView
      key={actorId}
      profile={profile}
      isOwn
      editable={editable}
      showcase={showcase}
      transactionVolume={volume > 0 ? { year: VOLUME_YEAR, amountChf: volume } : undefined}
    />
  );
}
