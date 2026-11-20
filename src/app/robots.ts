import type { MetadataRoute } from "next";

/* robots.txt : tout le public est explorable ; les espaces personnels,
   l'administration, l'API et les liens privés (dossier partagé) ne le sont pas. */

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch").replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin", "/api/", "/merci", "/auth/",
          "/demandes", "/mes-biens", "/publier", "/parametres", "/reglements",
          "/dossier", "/agence$", "/profil$", "/recherches/nouvelle",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
