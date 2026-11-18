import type { NextConfig } from "next";

/* ── Pôles parqués (REBUILD.md §3.2) ─────────────────────────────────────────
   Ce qui n'alimente pas la boucle Bien → Demande → Prime sort de la navigation
   ET de l'accès direct : chacun serait vide au lancement (démarrage à froid)
   et diluerait la promesse. Le code est CONSERVÉ ; pour réactiver un pôle,
   retirer sa ligne ici et l'ajouter à `src/lib/nav.ts`.

   Redirections TEMPORAIRES (307) : un navigateur ne les mémorise pas, le
   retour d'un pôle est donc immédiat. */
const PARKED_TO_HOME = [
  "/feed",
  "/creer-post",
  "/creer-reel",
  "/live/:path*",
  "/boutique/:path*",
  "/evenements/:path*",
  "/formations/:path*",
  "/reunion/:path*",
  "/investisseurs",
  "/services/:path*",
  "/agence/:path*",
  "/reseau",
  "/reservations",
  "/onboarding",
  "/demo",
  "/statistiques",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async redirects() {
    return [
      /* L'ancien tableau de bord : ses deux pages utiles ont une vraie adresse. */
      { source: "/dashboard/annonces", destination: "/mes-biens", permanent: false },
      { source: "/dashboard/apporteurs", destination: "/apporteurs", permanent: false },
      { source: "/dashboard/:path*", destination: "/", permanent: false },
      /* Messages et notifications vivent désormais dans les Demandes. */
      { source: "/messages", destination: "/demandes", permanent: false },
      { source: "/notifications", destination: "/demandes", permanent: false },
      /* Recherche et favoris reposaient sur le catalogue fictif : la
         recherche passe à l'Explorer réel (la requête `?q=` est conservée) ;
         les favoris reviendront avec une vraie table. */
      { source: "/recherche", destination: "/explorer", permanent: false },
      { source: "/favoris", destination: "/explorer", permanent: false },
      ...PARKED_TO_HOME.map((source) => ({ source, destination: "/", permanent: false })),
    ];
  },
};

export default nextConfig;
