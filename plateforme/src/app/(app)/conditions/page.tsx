"use client";

import React from "react";

/* ─── Sections ───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "objet",
    title: "1. Objet",
    content: `Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation de la plateforme E-Dome (ci-après "la Plateforme"), éditée par E-Dome Sàrl, dont le siège social se situe en Suisse. En accédant à la Plateforme, l'Utilisateur accepte sans réserve l'intégralité des présentes CGU. Si l'Utilisateur n'accepte pas ces conditions, il doit cesser toute utilisation de la Plateforme.`,
  },
  {
    id: "definitions",
    title: "2. Définitions",
    content: `- "Plateforme" : le site web et l'application mobile E-Dome.\n- "Utilisateur" : toute personne physique ou morale inscrite sur la Plateforme.\n- "Hôte" : Utilisateur proposant un bien immobilier à la vente ou à la location.\n- "Client" : Utilisateur recherchant un bien immobilier.\n- "Apporteur d'affaires" : Utilisateur recommandant des prospects via les liens de parrainage.\n- "Contenu" : tout texte, image, vidéo, annonce ou information publiée sur la Plateforme.\n- "Commission" : pourcentage prélevé par la Plateforme sur les transactions réalisées.`,
  },
  {
    id: "inscription",
    title: "3. Inscription et compte",
    content: `L'inscription sur la Plateforme est gratuite et ouverte à toute personne majeure ou entité juridique valablement constituée. L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription. Chaque Utilisateur ne peut détenir qu'un seul compte. E-Dome se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, sans préavis ni indemnité.`,
  },
  {
    id: "services",
    title: "4. Services proposés",
    content: `La Plateforme permet :\n- La publication et la consultation d'annonces immobilières (vente, location courte et longue durée).\n- La mise en relation entre hôtes et clients.\n- La réservation et la gestion de biens immobiliers.\n- L'accès à des formations en ligne.\n- La participation à des événements en direct (lives).\n- Le programme d'apporteurs d'affaires.\n- L'accès à des outils de statistiques et de gestion.\n\nE-Dome agit en qualité d'intermédiaire et n'est pas partie aux contrats conclus entre Utilisateurs.`,
  },
  {
    id: "commissions",
    title: "5. Commissions et tarification",
    content: `E-Dome preleve une commission sur les transactions réalisées via la Plateforme, selon le bareme suivant :`,
    table: [
      ["Type de transaction", "Commission Plateforme", "Part Apporteur (si applicable)"],
      ["Vente immobilière", "3.5% du prix de vente", "Jusqu'à 15% de la commission plateforme"],
      ["Location courte durée", "8% du montant du séjour", "Jusqu'à 15% de la commission plateforme"],
      ["Location longue durée", "50% du premier loyer", "Jusqu'à 15% de la commission plateforme"],
      ["Formation vendue", "20% du prix de la formation", "Jusqu'à 10% de la commission plateforme"],
    ],
    contentAfter: `La commission de l'apporteur d'affaires est exclusivement prélevée sur la part plateforme. En aucun cas elle ne constitue un coût supplémentaire pour l'hôte ou le client. Les tarifs peuvent être modifiés avec un préavis de 30 jours.`,
  },
  {
    id: "obligations",
    title: "6. Obligations des Utilisateurs",
    content: `L'Utilisateur s'engage à :\n- Utiliser la Plateforme conformément à sa destination et aux lois en vigueur.\n- Ne publier aucun contenu illicite, trompeur, diffamatoire ou portant atteinte aux droits de tiers.\n- Respecter les droits de propriété intellectuelle.\n- Ne pas tenter de contourner les mécanismes de la Plateforme (scraping, spam, etc.).\n- Maintenir la confidentialité de ses identifiants de connexion.\n- Signaler tout contenu ou comportement inapproprié.`,
  },
  {
    id: "propriete",
    title: "7. Propriété intellectuelle",
    content: `L'ensemble des éléments composant la Plateforme (design, textes, logos, algorithmes, code source) sont la propriété exclusive d'E-Dome ou de ses partenaires. Toute reproduction, représentation ou exploitation, même partielle, est interdite sans autorisation préalable écrite. Les Utilisateurs conservent la propriété de leurs contenus mais accordent à E-Dome une licence non exclusive, mondiale et gratuite pour leur affichage sur la Plateforme.`,
  },
  {
    id: "responsabilite",
    title: "8. Limitation de responsabilité",
    content: `E-Dome met tout en œuvre pour assurer la disponibilité et la sécurité de la Plateforme, mais ne saurait être tenue responsable :\n- Des interruptions temporaires de service pour maintenance ou mise à jour.\n- Des contenus publiés par les Utilisateurs.\n- Des litiges entre Utilisateurs.\n- Des pertes financières liées à l'utilisation de la Plateforme.\n- De l'exactitude des informations fournies par les Utilisateurs.\n\nLa responsabilité d'E-Dome est en tout état de cause limitée au montant des commissions perçues au cours des 12 derniers mois.`,
  },
  {
    id: "donnees",
    title: "9. Protection des données",
    content: `Le traitement des données personnelles est régi par notre Politique de Confidentialité, accessible depuis la page dédiée. E-Dome s'engage à respecter la Loi fédérale sur la protection des données (LPD) ainsi que le Règlement général sur la protection des données (RGPD) pour les Utilisateurs situés dans l'Union européenne.`,
  },
  {
    id: "juridiction",
    title: "10. Droit applicable et juridiction",
    content: `Les présentes CGU sont soumises au droit suisse. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents du canton de Neuchâtel, Suisse, seront seuls compétents.\n\nLes présentes CGU sont entrées en vigueur le 1er janvier 2026 et peuvent être modifiées à tout moment par E-Dome. Les modifications prennent effet dès leur publication sur la Plateforme. L'Utilisateur est invité à consulter régulièrement les CGU.`,
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ConditionsPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Demo disclaimer */}
      <div className="p-4 rounded-xl border border-[#1e9df1]/40 bg-[#1e9df1]/5 text-xs text-[var(--text-secondary)] leading-relaxed">
        <span className="mr-1">&#9888;&#65039;</span>
        Ce document est fourni à titre indicatif dans le cadre de la maquette de démonstration E-Dome. Il ne constitue pas un document légal contraignant.
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-[var(--text-secondary)]">Dernière mise à jour : 1er janvier 2026</p>
      </div>

      {/* Table of contents */}
      <nav className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2">
        <h2 className="font-semibold text-[var(--foreground)] mb-3">Table des matières</h2>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="block text-sm text-[var(--text-secondary)] hover:text-[#1e9df1] transition text-left"
          >
            {s.title}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{s.title}</h2>
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{s.content}</div>
            {s.table && (
              <div className="rounded-lg border border-[var(--card-border)] overflow-x-auto my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--card)]">
                      {s.table[0].map((h, i) => (
                        <th key={i} className="text-left p-3 text-[var(--text-muted)] font-medium border-b border-[var(--card-border)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.slice(1).map((row, ri) => (
                      <tr key={ri} className="border-b border-[var(--card-border)] last:border-0">
                        {row.map((cell, ci) => (
                          <td key={ci} className="p-3 text-[var(--foreground)]">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.contentAfter && (
              <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{s.contentAfter}</div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
