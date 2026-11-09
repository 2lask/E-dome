"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/context";
import { CURRENT_USER_ID } from "@/lib/demo/identity";
import { avisOf, biensOf, formationsOf } from "@/lib/demo/showcase";
import { ProfileView } from "@/components/profile/profile-view";
import type { ProfileData } from "@/components/profile/profile-showcase";
import { getMyPosts, profileToAuthor } from "@/lib/profile-posts";

/* /profil — mon profil. Identité + sections « LinkedIn » viennent du contexte
   (profile, persisté et éditable). L'onglet Publications rend mes vrais posts
   du feed. Biens, formations et avis sont RÉELS (dérivés, comme sur
   /profil/[id]) ; produits, lives et services restent des exemples de démo
   en attendant leur propriétaire dans la donnée (chantiers P4/P6). */

const AVIS = avisOf(CURRENT_USER_ID);

const SHOWCASE: Omit<ProfileData, "posts"> = {
  /* Courte ET longue durée : les quatre biens qu'il héberge au catalogue. */
  biens: biensOf(CURRENT_USER_ID),
  produits: [
    { id: "prod1", title: "Plaid lin lavé bleu nuit", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 89, currency: "CHF", stock: 14 },
    { id: "prod2", title: "Lampe céramique nordique", cover: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600", price: 145, currency: "CHF", stock: 6 },
    { id: "prod3", title: "Vase grès noir mat", cover: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", price: 65, currency: "CHF", stock: 22 },
  ],
  formations: formationsOf(CURRENT_USER_ID),
  lives: [
    { id: "live1", title: "Décrypter les annonces immobilières", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", status: "scheduled", scheduledAt: "2026-06-12 19:00", expectedViewers: 320 },
    { id: "live2", title: "Q&R : fiscalité locative en Suisse", cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600", status: "replay", replayViews: 1240 },
  ],
  services: [
    { id: "s1", title: "Conseil investissement personnalisé", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 250, currency: "CHF", unit: "/h" },
    { id: "s2", title: "Audit de portefeuille immobilier", cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", price: 1800, currency: "CHF", unit: "" },
  ],
  avis: AVIS.avis,
  ratingBreakdown: AVIS.ratingBreakdown,
};

export default function ProfilPage() {
  const { profile } = useApp();
  const showcase: ProfileData = useMemo(
    () => ({ ...SHOWCASE, posts: getMyPosts(profileToAuthor(profile)) }),
    [profile],
  );
  return <ProfileView profile={profile} isOwn showcase={showcase} />;
}
