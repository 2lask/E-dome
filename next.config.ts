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
  "/reseau",
  "/reservations",
  "/onboarding",
  "/demo",
  "/statistiques",
  /* Simulation de paiement de l'ancienne fiche fictive : sans point d'entrée. */
  "/paiement",
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
      /* Les notifications vivent dans les Demandes ; /messages est la
         messagerie vendeur ↔ apporteur. */
      { source: "/notifications", destination: "/demandes", permanent: false },
      /* Recherche et favoris reposaient sur le catalogue fictif : la
         recherche passe à l'Explorer réel (la requête `?q=` est conservée) ;
         les favoris reviendront avec une vraie table. */
      { source: "/recherche", destination: "/explorer", permanent: false },
      { source: "/favoris", destination: "/explorer", permanent: false },
      /* Propositions d'agences fictives : aucune agence n'est encore inscrite. */
      /* Espace agence réel (/agence) ; les sous-pages de l'ancienne maquette y renvoient. */
      { source: "/agence/:path+", destination: "/agence", permanent: false },
      { source: "/vendre/accompagnement", destination: "/vendre", permanent: false },
      ...PARKED_TO_HOME.map((source) => ({ source, destination: "/", permanent: false })),
    ];
  },
};

export default nextConfig;
