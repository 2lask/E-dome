import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  /* Redirects 308 (permanent) pour consolider les doublons :
     - /statistiques -> /dashboard/audience (renomme + integre au shell)
     - /reservations -> /dashboard/reservations (canonique)
     - /apporteurs -> /dashboard/apporteurs (canonique)
     L'ancien /statistiques/page.tsx a un redirect() server-side au
     cas ou un navigateur ne suivrait pas le 308. */
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
    ];
  },
};

export default nextConfig;
