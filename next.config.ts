import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  /* Redirects 308 (permanent) :
     - /statistiques -> /dashboard/audience (page racine supprimee)
     - /dashboard/revenus -> /dashboard#revenus (fusionnee dans la
       Vue d'ensemble, ancre vers la section RevenueSection)

     Note : /apporteurs et /reservations existent toujours en racine ET
     en sous-page dashboard avec 2 contenus distincts (vue utilisateur vs
     vue host/business). On n'utilise plus de redirect, les 2 cohabitent. */
  async redirects() {
    return [
      {
        source: "/statistiques",
        destination: "/dashboard/audience",
        permanent: true,
      },
      {
        source: "/dashboard/revenus",
        destination: "/dashboard#revenus",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
