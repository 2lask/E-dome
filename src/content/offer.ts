/* ── Ce que coûte chaque façon de vendre ────────────────────────────────────

   Le contenu de `/vendre`, le cœur de la démonstration côté vendeur. L'écran
   doit être limpide et montrer ce que CHAQUE route coûte au particulier.

   Deux routes qui s'excluent — seul ou accompagné — présentées comme deux
   cartes ; « à la carte » ne s'exclut de rien et vit dans un bloc rattaché,
   pas dans une troisième carte de même taille qui mentirait sur la nature du
   choix (DECISIONS §2.2).

   Les deux cartes portent LES MÊMES SIX LIGNES, dans le même ordre. C'est la
   règle qui rend le coût lisible : l'œil compare des lignes alignées, pas des
   paragraphes. La ligne « à E-Dome » dit « 0 CHF » des deux côtés — le
   différenciateur n'est pas E-Dome, c'est la ligne « à un tiers ». */

export interface SellerRoute {
  id: "seul" | "accompagne";
  label: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  /** Les six lignes, mêmes clés que l'autre carte, dans l'ordre. */
  lines: {
    /** Ce que vous faites. */
    you: string;
    /** Qui trouve l'acheteur et gère la vente. */
    sale: string;
    /** Qui fait les visites et négocie. */
    visits: string;
    /** Ce que vous payez à E-Dome. Toujours « 0 CHF ». */
    toEdome: string;
    /** Ce que vous pouvez payer à un tiers. Le vrai différenciateur. */
    toThird: string;
    /** Pour qui c'est fait. */
    idealFor: string;
  };
}

export const sellPage = {
  eyebrow: "Vendre son bien",
  title: "Deux façons de vendre. Aucune ne passe par une commission E-Dome.",
  subtitle:
    "Publiez seul, ou laissez une agence vérifiée s'en charger. Dans les deux cas, E-Dome ne prend rien sur la vente.",

  /** Répété sur les deux cartes, en très gros : le point contre-intuitif. */
  headline: "0 CHF à E-Dome",

  /** Les libellés des six lignes, une fois — les cartes s'y alignent. */
  lineLabels: {
    you: "Ce que vous faites",
    sale: "Qui trouve l'acheteur",
    visits: "Visites et négociation",
    toEdome: "À E-Dome",
    toThird: "À un tiers",
    idealFor: "Idéal si",
  },

  routes: [
    {
      id: "seul",
      label: "Seul",
      tagline: "Vous publiez, vous gérez, vous vendez.",
      cta: "Publier mon bien",
      ctaHref: "/publier",
      lines: {
        you: "Vous publiez gratuitement, recevez les contacts, organisez vos visites.",
        sale: "Vous — les acheteurs vous contactent directement.",
        visits: "Vous les menez vous-même.",
        toEdome: "0 CHF. La publication est gratuite.",
        toThird: "Rien d'obligatoire. En option : mise en avant, photographe, home staging.",
        idealFor: "Vous connaissez votre bien et vous avez le temps de gérer.",
      },
    },
    {
      id: "accompagne",
      label: "Accompagné",
      tagline: "Une agence vérifiée s'en charge de bout en bout.",
      cta: "Être accompagné",
      ctaHref: "/vendre/accompagnement",
      lines: {
        you: "Vous décrivez votre bien ; des agences vérifiées vous contactent ; vous en choisissez une.",
        sale: "L'agence que vous mandatez.",
        visits: "L'agence les organise et négocie pour vous.",
        toEdome: "0 CHF. E-Dome ne touche rien sur cette vente et ne vous facture rien.",
        toThird: "La commission de l'agence, convenue avec elle dans le mandat.",
        idealFor: "Vous préférez déléguer, ou votre bien demande un savoir-faire.",
      },
    },
  ] satisfies SellerRoute[],

  /* Le bloc rattaché : à la carte. Il ne s'oppose pas aux deux routes — on
     prend un photographe qu'on vende seul ou accompagné. */
  alaCarte: {
    title: "À la carte, dans les deux cas",
    body: "Que vous vendiez seul ou accompagné, vous pouvez prendre des prestations ponctuelles sur la marketplace : photographe, home staging, diagnostic, visite virtuelle.",
    cta: "Voir les services",
    ctaHref: "/services",
  },

  /* La phrase sans laquelle personne ne clique. */
  reassurance: "Vous pouvez changer d'avis : commencer seul, puis vous faire accompagner, ou l'inverse. Rien n'est définitif.",

  rulesTitle: "Ce qu'E-Dome ne fait jamais",
  rulesIntro:
    "Ces quatre règles tiennent ensemble : c'est ce qui garde E-Dome hors du courtage. Sur la route accompagnée, la formulation exacte est qu'E-Dome ne signe aucun mandat, ne négocie aucun prix, et ne touche rien sur la commission de l'agence.",
} as const;
