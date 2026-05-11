"use client";

import React from "react";

/* ─── Sections ───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `La présente Politique de Confidentialité décrit comment E-Dome Sàrl (ci-après "E-Dome", "nous") collecte, utilise, stocke et protège les données personnelles des utilisateurs de la plateforme E-Dome. Cette politique est conforme à la Loi fédérale suisse sur la protection des données (LPD, entrée en vigueur le 1er septembre 2023) ainsi qu'au Règlement général sur la protection des données (RGPD) de l'Union européenne, applicable aux utilisateurs situés dans l'UE/EEE.`,
  },
  {
    id: "responsable",
    title: "2. Responsable du traitement",
    content: `Le responsable du traitement des données est :\n\nE-Dome Sàrl\nRue de la Gare 12\n2000 Neuchâtel, Suisse\nEmail : dpo@edome.world\nTéléphone : +41 32 000 00 00\n\nLe Délégué à la Protection des Données (DPO) peut être contacté à l'adresse dpo@edome.world pour toute question relative au traitement de vos données personnelles.`,
  },
  {
    id: "collecte",
    title: "3. Données collectées",
    content: `Nous collectons les catégories de données suivantes :\n\n**Données d'inscription :** nom, prénom, adresse email, numéro de téléphone, mot de passe (chiffré), pays de résidence, langue préférée.\n\n**Données de profil :** photo de profil, biographie, certifications, langues parlées, rôles actifs.\n\n**Données de transaction :** historique des réservations, montants, moyens de paiement (les données bancaires complètes sont traitées par notre prestataire de paiement certifié PCI-DSS).\n\n**Données d'utilisation :** pages visitées, fonctionnalités utilisées, durée des sessions, adresse IP, type de navigateur, appareil utilisé.\n\n**Données de communication :** messages échangés entre utilisateurs, historique du chat en direct, demandes de support.\n\n**Données de localisation :** ville et pays (jamais de géolocalisation précise sans consentement explicite).`,
  },
  {
    id: "finalites",
    title: "4. Finalités du traitement",
    content: `Vos données sont traitées pour les finalités suivantes :\n- Fourniture et amélioration des services de la Plateforme.\n- Gestion de votre compte et de vos préférences.\n- Traitement des transactions et versements de commissions.\n- Communication relative à votre compte (notifications, alertes).\n- Analyse statistique et amélioration de l'expérience utilisateur.\n- Prévention de la fraude et sécurité de la Plateforme.\n- Respect de nos obligations légales et réglementaires.\n- Marketing direct (uniquement avec votre consentement préalable).`,
  },
  {
    id: "base-legale",
    title: "5. Base légale du traitement",
    content: `Le traitement de vos données repose sur les bases légales suivantes :\n- **Exécution contractuelle :** traitement nécessaire à la fourniture des services.\n- **Consentement :** pour le marketing direct et les cookies non essentiels.\n- **Intérêt légitime :** pour l'amélioration des services et la prévention de la fraude.\n- **Obligation légale :** pour les obligations fiscales et de conformité.`,
  },
  {
    id: "partage",
    title: "6. Partage des données",
    content: `Vos données peuvent être partagées avec :\n- **Autres utilisateurs :** informations de profil public, annonces, avis.\n- **Prestataires de services :** hébergement (serveurs en Suisse), paiement, analyse, support.\n- **Autorités compétentes :** sur requête légale ou judiciaire.\n\nNous ne vendons jamais vos données personnelles à des tiers. Tout transfert de données hors de Suisse ou de l'UE/EEE est encadré par des garanties appropriées (clauses contractuelles types, décisions d'adéquation).`,
  },
  {
    id: "conservation",
    title: "7. Durée de conservation",
    content: `Vos données sont conservées pour la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées :\n- Données de compte : pendant la durée de votre inscription + 2 ans après suppression.\n- Données de transaction : 10 ans (obligations légales suisses).\n- Données d'utilisation : 26 mois maximum.\n- Messages : 5 ans après le dernier message.\n- Cookies : voir la section dédiée ci-dessous.`,
  },
  {
    id: "droits",
    title: "8. Vos droits",
    content: `Conformément à la LPD et au RGPD, vous disposez des droits suivants :\n- **Droit d'accès :** obtenir une copie de vos données personnelles.\n- **Droit de rectification :** corriger des données inexactes ou incomplètes.\n- **Droit à l'effacement :** demander la suppression de vos données (sous réserve des obligations légales).\n- **Droit à la portabilité :** recevoir vos données dans un format structuré et lisible.\n- **Droit d'opposition :** vous opposer au traitement de vos données pour des motifs légitimes.\n- **Droit de retrait du consentement :** retirer votre consentement à tout moment sans affecter la légalité du traitement antérieur.\n- **Droit de réclamation :** introduire une réclamation auprès du Préposé fédéral à la protection des données (PFPDT) ou de l'autorité de contrôle compétente.\n\nPour exercer vos droits, contactez-nous à dpo@edome.world. Nous répondrons dans un délai de 30 jours.`,
  },
  {
    id: "securite",
    title: "9. Sécurité des données",
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :\n- Chiffrement des données en transit (TLS 1.3) et au repos (AES-256).\n- Authentification à deux facteurs disponible.\n- Accès restreint aux données (principe du moindre privilège).\n- Audits de sécurité réguliers.\n- Hébergement sur des serveurs certifiés ISO 27001 en Suisse.\n- Plan de réponse aux incidents de sécurité.`,
  },
  {
    id: "cookies",
    title: "10. Cookies",
    content: `La Plateforme utilise les types de cookies suivants :\n- **Cookies essentiels :** nécessaires au fonctionnement (session, sécurité). Pas de consentement requis.\n- **Cookies analytiques :** mesure d'audience anonymisée. Consentement requis.\n- **Cookies de préférence :** mémorisation de vos choix (langue, devise, thème). Consentement requis.\n\nNous n'utilisons aucun cookie publicitaire ni de tracking tiers. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de la Plateforme.`,
  },
  {
    id: "mineurs",
    title: "11. Données des mineurs",
    content: `La Plateforme n'est pas destinée aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles de mineurs. Si nous apprenons que des données d'un mineur ont été collectées, nous les supprimerons dans les plus brefs délais.`,
  },
  {
    id: "modifications",
    title: "12. Modifications de la politique",
    content: `E-Dome se réserve le droit de modifier la présente Politique de Confidentialité à tout moment. Les modifications significatives seront communiquées par notification sur la Plateforme ou par email. La date de dernière mise à jour est indiquée en haut de cette page. En continuant à utiliser la Plateforme après modification, l'Utilisateur accepte la version mise à jour.\n\nPour toute question concernant la protection de vos données, contactez notre DPO :\nEmail : dpo@edome.world\nCourrier : E-Dome Sàrl, Rue de la Gare 12, 2000 Neuchâtel, Suisse`,
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ConfidentialitePage() {
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
        <h1 className="text-3xl page-heading text-[var(--foreground)]">Politique de Confidentialite</h1>
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
          </section>
        ))}
      </div>
    </div>
  );
}
