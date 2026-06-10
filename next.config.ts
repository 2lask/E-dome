import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  /* Redirects 308 (permanent) pour consolider les doublons :
     - /statistiques -> /dashboard/audience (renomme)
     - /reservations -> /dashboard/reservations (canonique)
     - /apporteurs -> /dashboard/apporteurs (canonique)
     - /dashboard/revenus -> /dashboard#revenus (fusionne dans la
       Vue d'ensemble, ancre vers la section RevenueSection) */
  async redirects() {
    return [
      {
        source: "/statistiques",
        destination: "/dashboard/audience",
        permanent: true,
      },
      {
        source: "/reservations",
        destination: "/dashboard/reservations",
        permanent: true,
      },
      {
        source: "/apporteurs",
        destination: "/dashboard/apporteurs",
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
