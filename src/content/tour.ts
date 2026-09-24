import type { PlatformRole } from "@/lib/model/identity";

/* ── La visite guidée ───────────────────────────────────────────────────────

   En dernier, parce qu'elle dépend des écrans qu'elle traverse (plan, étape 8).
   Six arrêts qui, dans l'ordre, répondent aux trois questions du critère
   ultime : ce qu'est E-Dome, qui paie quoi, ce qui existe déjà.

   Chaque arrêt nomme sa route et, quand c'est utile, le rôle à endosser — la
   visite pilote alors le sélecteur de rôle, le même mécanisme que la visite
   libre. Le texte vit ici ; l'overlay ne fait que l'afficher et naviguer. */

export interface TourStop {
  route: string;
  /** Rôle à activer en arrivant, s'il y a lieu. */
  as?: PlatformRole;
  title: string;
  body: string;
  /** Ce qu'il faut regarder sur l'écran. */
  look: string;
}

export const guidedTour = {
  launch: "Visite guidée",
  intro: "Six écrans, deux minutes : ce qu'est E-Dome, qui paie quoi, et ce qui existe déjà.",
  next: "Suivant",
  prev: "Précédent",
  done: "Terminer",
  close: "Fermer la visite",
  stepOf: (i: number, n: number) => `Étape ${i} sur ${n}`,
  stops: [
    {
      route: "/demo",
      title: "Ce qu'est E-Dome, en un écran",
      body: "Sept pôles réunis sur une plateforme. La couleur dit ce qui est ouvert au lancement et ce qui vient ensuite.",
      look: "Le bloc « qui paie quoi » : le point du modèle qu'une capture d'écran ne peut pas résoudre.",
    },
    {
      route: "/vendre",
      as: "proprietaire",
      title: "Vendre : 0 CHF à E-Dome",
      body: "Deux façons de vendre, seul ou accompagné. E-Dome ne prend rien sur la vente, des deux côtés.",
      look: "Les six lignes alignées, et la ligne « à un tiers » — le vrai différenciateur.",
    },
    {
      route: "/explorer/prop5",
      as: "hote",
      title: "Le flux d'argent",
      body: "Sur une location courte durée, chaque part est visible : l'hôte, E-Dome, les frais de paiement.",
      look: "Le panneau « qui paie quoi » : la commission est prélevée sur l'hôte, jamais ajoutée au prix du voyageur.",
    },
    {
      route: "/agence",
      as: "agence",
      title: "L'espace agence",
      body: "La principale source de revenu : les agences s'abonnent aux outils. C'est là qu'E-Dome gagne sa vie.",
      look: "Les demandes d'accompagnement — des fiches anonymes, sans classement payant.",
    },
    {
      route: "/tarifs",
      title: "Les prix, sans mentir",
      body: "Cette page est générée depuis le catalogue : elle ne peut pas afficher un tarif que le modèle ne porte pas.",
      look: "Régie en « Ensuite » : le statut vient de la donnée, pas d'une décision de la page.",
    },
    {
      route: "/conditions",
      title: "Ce qu'E-Dome ne fait jamais",
      body: "Quatre règles qui gardent E-Dome hors du courtage, énoncées avant les prix.",
      look: "Le §2 : les quatre règles ensemble, jamais la seule règle 3.",
    },
  ] satisfies TourStop[],
} as const;
