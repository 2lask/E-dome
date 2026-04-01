"use client";

import React from "react";

/* ─── Sections ───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "objet",
    title: "1. Objet",
    content: `Les presentes Conditions Generales d'Utilisation (ci-apres "CGU") regissent l'acces et l'utilisation de la plateforme E-Dome (ci-apres "la Plateforme"), editee par E-Dome Sarl, dont le siege social se situe en Suisse. En accedant a la Plateforme, l'Utilisateur accepte sans reserve l'integralite des presentes CGU. Si l'Utilisateur n'accepte pas ces conditions, il doit cesser toute utilisation de la Plateforme.`,
  },
  {
    id: "definitions",
    title: "2. Definitions",
    content: `- "Plateforme" : le site web et l'application mobile E-Dome.\n- "Utilisateur" : toute personne physique ou morale inscrite sur la Plateforme.\n- "Hote" : Utilisateur proposant un bien immobilier a la vente ou a la location.\n- "Client" : Utilisateur recherchant un bien immobilier.\n- "Apporteur d'affaires" : Utilisateur recommandant des prospects via les liens de parrainage.\n- "Contenu" : tout texte, image, video, annonce ou information publiee sur la Plateforme.\n- "Commission" : pourcentage preleve par la Plateforme sur les transactions realisees.`,
  },
  {
    id: "inscription",
    title: "3. Inscription et compte",
    content: `L'inscription sur la Plateforme est gratuite et ouverte a toute personne majeure ou entite juridique valablement constituee. L'Utilisateur s'engage a fournir des informations exactes, completes et a jour lors de son inscription. Chaque Utilisateur ne peut detenir qu'un seul compte. E-Dome se reserve le droit de suspendre ou supprimer tout compte en cas de violation des presentes CGU, sans preavis ni indemnite.`,
  },
  {
    id: "services",
    title: "4. Services proposes",
    content: `La Plateforme permet :\n- La publication et la consultation d'annonces immobilieres (vente, location courte et longue duree).\n- La mise en relation entre hotes et clients.\n- La reservation et la gestion de biens immobiliers.\n- L'acces a des formations en ligne.\n- La participation a des evenements en direct (lives).\n- Le programme d'apporteurs d'affaires.\n- L'acces a des outils de statistiques et de gestion.\n\nE-Dome agit en qualite d'intermediaire et n'est pas partie aux contrats conclus entre Utilisateurs.`,
  },
  {
    id: "commissions",
    title: "5. Commissions et tarification",
    content: `E-Dome preleve une commission sur les transactions realisees via la Plateforme, selon le bareme suivant :`,
    table: [
      ["Type de transaction", "Commission Plateforme", "Part Apporteur (si applicable)"],
      ["Vente immobiliere", "3.5% du prix de vente", "Jusqu'a 15% de la commission plateforme"],
      ["Location courte duree", "8% du montant du sejour", "Jusqu'a 15% de la commission plateforme"],
      ["Location longue duree", "50% du premier loyer", "Jusqu'a 15% de la commission plateforme"],
      ["Formation vendue", "20% du prix de la formation", "Jusqu'a 10% de la commission plateforme"],
    ],
    contentAfter: `La commission de l'apporteur d'affaires est exclusivement prelevee sur la part plateforme. En aucun cas elle ne constitue un cout supplementaire pour l'hote ou le client. Les tarifs peuvent etre modifies avec un preavis de 30 jours.`,
  },
  {
    id: "obligations",
    title: "6. Obligations des Utilisateurs",
    content: `L'Utilisateur s'engage a :\n- Utiliser la Plateforme conformement a sa destination et aux lois en vigueur.\n- Ne publier aucun contenu illicite, trompeur, diffamatoire ou portant atteinte aux droits de tiers.\n- Respecter les droits de propriete intellectuelle.\n- Ne pas tenter de contourner les mecanismes de la Plateforme (scraping, spam, etc.).\n- Maintenir la confidentialite de ses identifiants de connexion.\n- Signaler tout contenu ou comportement inapproprie.`,
  },
  {
    id: "propriete",
    title: "7. Propriete intellectuelle",
    content: `L'ensemble des elements composant la Plateforme (design, textes, logos, algorithmes, code source) sont la propriete exclusive d'E-Dome ou de ses partenaires. Toute reproduction, representation ou exploitation, meme partielle, est interdite sans autorisation prealable ecrite. Les Utilisateurs conservent la propriete de leurs contenus mais accordent a E-Dome une licence non exclusive, mondiale et gratuite pour leur affichage sur la Plateforme.`,
  },
  {
    id: "responsabilite",
    title: "8. Limitation de responsabilite",
    content: `E-Dome met tout en oeuvre pour assurer la disponibilite et la securite de la Plateforme, mais ne saurait etre tenue responsable :\n- Des interruptions temporaires de service pour maintenance ou mise a jour.\n- Des contenus publies par les Utilisateurs.\n- Des litiges entre Utilisateurs.\n- Des pertes financieres liees a l'utilisation de la Plateforme.\n- De l'exactitude des informations fournies par les Utilisateurs.\n\nLa responsabilite d'E-Dome est en tout etat de cause limitee au montant des commissions percues au cours des 12 derniers mois.`,
  },
  {
    id: "donnees",
    title: "9. Protection des donnees",
    content: `Le traitement des donnees personnelles est regi par notre Politique de Confidentialite, accessible depuis la page dediee. E-Dome s'engage a respecter la Loi federale sur la protection des donnees (LPD) ainsi que le Reglement general sur la protection des donnees (RGPD) pour les Utilisateurs situes dans l'Union europeenne.`,
  },
  {
    id: "juridiction",
    title: "10. Droit applicable et juridiction",
    content: `Les presentes CGU sont soumises au droit suisse. En cas de litige, les parties s'engagent a rechercher une solution amiable. A defaut, les tribunaux competents du canton de Neuchatel, Suisse, seront seuls competents.\n\nLes presentes CGU sont entrees en vigueur le 1er janvier 2026 et peuvent etre modifiees a tout moment par E-Dome. Les modifications prennent effet des leur publication sur la Plateforme. L'Utilisateur est invite a consulter regulierement les CGU.`,
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ConditionsPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Conditions Generales d&apos;Utilisation</h1>
        <p className="text-[var(--text-secondary)]">Derniere mise a jour : 1er janvier 2026</p>
      </div>

      {/* Table of contents */}
      <nav className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2">
        <h2 className="font-semibold text-[var(--foreground)] mb-3">Table des matieres</h2>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="block text-sm text-[var(--text-secondary)] hover:text-[#C4956A] transition text-left"
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
