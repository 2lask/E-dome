"use client";

import React from "react";

/* ─── Sections ───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `La presente Politique de Confidentialite decrit comment E-Dome Sarl (ci-apres "E-Dome", "nous") collecte, utilise, stocke et protege les donnees personnelles des utilisateurs de la plateforme E-Dome. Cette politique est conforme a la Loi federale suisse sur la protection des donnees (LPD, entree en vigueur le 1er septembre 2023) ainsi qu'au Reglement general sur la protection des donnees (RGPD) de l'Union europeenne, applicable aux utilisateurs situes dans l'UE/EEE.`,
  },
  {
    id: "responsable",
    title: "2. Responsable du traitement",
    content: `Le responsable du traitement des donnees est :\n\nE-Dome Sarl\nRue de la Gare 12\n2000 Neuchatel, Suisse\nEmail : dpo@edome.world\nTelephone : +41 32 000 00 00\n\nLe Delegue a la Protection des Donnees (DPO) peut etre contacte a l'adresse dpo@edome.world pour toute question relative au traitement de vos donnees personnelles.`,
  },
  {
    id: "collecte",
    title: "3. Donnees collectees",
    content: `Nous collectons les categories de donnees suivantes :\n\n**Donnees d'inscription :** nom, prenom, adresse email, numero de telephone, mot de passe (chiffre), pays de residence, langue preferee.\n\n**Donnees de profil :** photo de profil, biographie, certifications, langues parlees, roles actifs.\n\n**Donnees de transaction :** historique des reservations, montants, moyens de paiement (les donnees bancaires completes sont traitees par notre prestataire de paiement certifie PCI-DSS).\n\n**Donnees d'utilisation :** pages visitees, fonctionnalites utilisees, duree des sessions, adresse IP, type de navigateur, appareil utilise.\n\n**Donnees de communication :** messages echanges entre utilisateurs, historique du chat en direct, demandes de support.\n\n**Donnees de localisation :** ville et pays (jamais de geolocalisation precise sans consentement explicite).`,
  },
  {
    id: "finalites",
    title: "4. Finalites du traitement",
    content: `Vos donnees sont traitees pour les finalites suivantes :\n- Fourniture et amelioration des services de la Plateforme.\n- Gestion de votre compte et de vos preferences.\n- Traitement des transactions et versements de commissions.\n- Communication relative a votre compte (notifications, alertes).\n- Analyse statistique et amelioration de l'experience utilisateur.\n- Prevention de la fraude et securite de la Plateforme.\n- Respect de nos obligations legales et reglementaires.\n- Marketing direct (uniquement avec votre consentement prealable).`,
  },
  {
    id: "base-legale",
    title: "5. Base legale du traitement",
    content: `Le traitement de vos donnees repose sur les bases legales suivantes :\n- **Execution contractuelle :** traitement necessaire a la fourniture des services.\n- **Consentement :** pour le marketing direct et les cookies non essentiels.\n- **Interet legitime :** pour l'amelioration des services et la prevention de la fraude.\n- **Obligation legale :** pour les obligations fiscales et de conformite.`,
  },
  {
    id: "partage",
    title: "6. Partage des donnees",
    content: `Vos donnees peuvent etre partagees avec :\n- **Autres utilisateurs :** informations de profil public, annonces, avis.\n- **Prestataires de services :** hebergement (serveurs en Suisse), paiement, analyse, support.\n- **Autorites competentes :** sur requete legale ou judiciaire.\n\nNous ne vendons jamais vos donnees personnelles a des tiers. Tout transfert de donnees hors de Suisse ou de l'UE/EEE est encadre par des garanties appropriees (clauses contractuelles types, decisions d'adequation).`,
  },
  {
    id: "conservation",
    title: "7. Durée de conservation",
    content: `Vos donnees sont conservees pour la duree strictement necessaire aux finalites pour lesquelles elles ont ete collectees :\n- Donnees de compte : pendant la duree de votre inscription + 2 ans apres suppression.\n- Donnees de transaction : 10 ans (obligations legales suisses).\n- Donnees d'utilisation : 26 mois maximum.\n- Messages : 5 ans apres le dernier message.\n- Cookies : voir la section dediee ci-dessous.`,
  },
  {
    id: "droits",
    title: "8. Vos droits",
    content: `Conformement a la LPD et au RGPD, vous disposez des droits suivants :\n- **Droit d'acces :** obtenir une copie de vos donnees personnelles.\n- **Droit de rectification :** corriger des donnees inexactes ou incompletes.\n- **Droit a l'effacement :** demander la suppression de vos donnees (sous reserve des obligations legales).\n- **Droit a la portabilite :** recevoir vos donnees dans un format structure et lisible.\n- **Droit d'opposition :** vous opposer au traitement de vos donnees pour des motifs legitimes.\n- **Droit de retrait du consentement :** retirer votre consentement a tout moment sans affecter la legalite du traitement anterieur.\n- **Droit de reclamation :** introduire une reclamation aupres du Prepose federal a la protection des donnees (PFPDT) ou de l'autorite de controle competente.\n\nPour exercer vos droits, contactez-nous a dpo@edome.world. Nous repondrons dans un delai de 30 jours.`,
  },
  {
    id: "securite",
    title: "9. Securite des donnees",
    content: `Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger vos donnees :\n- Chiffrement des donnees en transit (TLS 1.3) et au repos (AES-256).\n- Authentification a deux facteurs disponible.\n- Acces restreint aux donnees (principe du moindre privilege).\n- Audits de securite reguliers.\n- Hebergement sur des serveurs certifies ISO 27001 en Suisse.\n- Plan de reponse aux incidents de securite.`,
  },
  {
    id: "cookies",
    title: "10. Cookies",
    content: `La Plateforme utilise les types de cookies suivants :\n- **Cookies essentiels :** necessaires au fonctionnement (session, securite). Pas de consentement requis.\n- **Cookies analytiques :** mesure d'audience anonymisee. Consentement requis.\n- **Cookies de preference :** memorisation de vos choix (langue, devise, theme). Consentement requis.\n\nNous n'utilisons aucun cookie publicitaire ni de tracking tiers. Vous pouvez gerer vos preferences de cookies a tout moment via les parametres de la Plateforme.`,
  },
  {
    id: "mineurs",
    title: "11. Donnees des mineurs",
    content: `La Plateforme n'est pas destinee aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de donnees personnelles de mineurs. Si nous apprenons que des donnees d'un mineur ont ete collectees, nous les supprimerons dans les plus brefs delais.`,
  },
  {
    id: "modifications",
    title: "12. Modifications de la politique",
    content: `E-Dome se reserve le droit de modifier la presente Politique de Confidentialite a tout moment. Les modifications significatives seront communiquees par notification sur la Plateforme ou par email. La date de derniere mise a jour est indiquee en haut de cette page. En continuant a utiliser la Plateforme apres modification, l'Utilisateur accepte la version mise a jour.\n\nPour toute question concernant la protection de vos donnees, contactez notre DPO :\nEmail : dpo@edome.world\nCourrier : E-Dome Sarl, Rue de la Gare 12, 2000 Neuchatel, Suisse`,
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ConfidentialitePage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Politique de Confidentialite</h1>
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
          </section>
        ))}
      </div>
    </div>
  );
}
