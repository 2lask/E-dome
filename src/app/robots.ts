import type { MetadataRoute } from "next";

/* robots.txt généré par Next.

   `/admin` et `/merci` sont explicitement exclus : la première est une page
   d'administration protégée par mot de passe, la seconde contient un code de
   parrainage dans son URL et n'a rien à faire dans un index.

   Les routes de la maquette restent autorisées : elles sont publiques et
   volontairement explorables. À revoir le jour où la plateforme passera sur
   des données réelles. */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/merci", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
