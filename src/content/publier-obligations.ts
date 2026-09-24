/* ── L'écran d'obligations de `/publier` ────────────────────────────────────

   L'étape de « frais de publication » disparaît pour la VENTE et la LOCATION
   LONGUE DURÉE : il n'existe plus aucun frais de 500 ou 2 500 CHF, et publier
   un bien de particulier est gratuit — c'est ce qui attire les acheteurs, donc
   les investisseurs, donc les agences (mission B.2). À la place, l'écran
   rappelle ce que la loi impose au vendeur ou au bailleur.

   La courte durée garde son bloc : publication gratuite, commission prélevée
   sur l'hôte. Elle porte en plus le numéro d'enregistrement, exigible depuis
   mai 2026 — la seule obligation qui presse (cf. JURIDIQUE-A-VALIDER.md §5).

   Ces textes sont indicatifs et destinés à la relecture de l'avocat ; ce qui
   doit être confirmé est tracé dans JURIDIQUE-A-VALIDER.md. */

export interface Obligation {
  label: string;
  body: string;
}

export const publierObligations = {
  freeBadge: "Publication gratuite",
  freeNote: "0 CHF à E-Dome. Le bien d'un particulier est gratuit à publier.",

  vente: {
    title: "Avant de publier une vente",
    obligations: [
      {
        label: "Vous êtes en droit de vendre",
        body: "Vous êtes propriétaire du bien, ou mandaté par écrit pour le vendre. E-Dome ne vérifie pas ce droit et n'intervient jamais dans la vente.",
      },
      {
        label: "Lex Koller",
        body: "L'acquisition de ce bien par une personne domiciliée à l'étranger peut être soumise à autorisation. Si votre acheteur est concerné, la vente en dépend — signalez-le dans l'annonce.",
      },
      {
        label: "Diagnostics et informations dues",
        body: "Les informations essentielles sur l'état du bien, ses charges et ses éventuels défauts doivent être exactes. Une annonce trompeuse engage votre responsabilité, pas celle de la plateforme.",
      },
    ] satisfies Obligation[],
  },

  "location-lt": {
    title: "Avant de publier une location longue durée",
    obligations: [
      {
        label: "Formule officielle du loyer initial",
        body: "Dans les cantons qui l'imposent (Vaud, Genève, Neuchâtel, Fribourg, Zurich, entre autres), vous devez notifier au locataire le loyer du précédent bail sur la formule officielle, au début du bail. E-Dome ne remplace pas ce document.",
      },
      {
        label: "Vous êtes en droit de louer",
        body: "Vous êtes propriétaire ou gérant du bien, et libre de tout bail en cours incompatible.",
      },
      {
        label: "Dépôt de garantie",
        body: "Le dépôt ne peut excéder trois mois de loyer et doit être placé sur un compte au nom du locataire (art. 257e CO). E-Dome ne détient jamais ces fonds.",
      },
    ] satisfies Obligation[],
  },

  "location-ct": {
    title: "Location courte durée",
    obligations: [
      {
        label: "Numéro d'enregistrement",
        body: "La location de courte durée exige, depuis mai 2026, un numéro d'enregistrement dans un nombre croissant de communes. Renseignez-le s'il vous a été attribué.",
      },
      {
        label: "Ce que prélève E-Dome",
        body: "La publication est gratuite. Une commission de 12 % est prélevée sur l'hôte à chaque réservation — jamais ajoutée au prix payé par le voyageur.",
      },
    ] satisfies Obligation[],
  },
} as const;
