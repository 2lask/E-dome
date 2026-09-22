"use client";

import React from "react";

/* ─── Rendu du gras ──────────────────────────────────────────────────────────

   Les textes ci-dessous portent des `**intitulés**`. Ils étaient rendus tels
   quels, astérisques comprises, parce que le conteneur affiche du texte brut
   (`whitespace-pre-line`). Cinq passages étaient touchés — les catégories de
   données, les bases légales, les destinataires, les droits, les cookies.

   Plutôt que de retirer la mise en forme de la source, ce qui rendrait ces
   listes illisibles à l'édition, on la rend. Le découpage sur une paire
   d'astérisques suffit : il n'y a pas d'autre balisage dans ce document, et
   une astérisque isolée reste affichée telle quelle. */

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        /* Les indices impairs sont les captures, donc le contenu à mettre en
           gras ; les pairs sont le texte qui les entoure. */
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--foreground)]">
            {part}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

/* ─── Sections ───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `La présente Politique de Confidentialité décrit comment E-Dome (ci-après « E-Dome », « nous ») collecte, utilise, stocke et protège les données personnelles des utilisateurs de la plateforme E-Dome. Cette politique est conforme à la Loi fédérale suisse sur la protection des données (LPD, entrée en vigueur le 1er septembre 2023) ainsi qu'au Règlement général sur la protection des données (RGPD) de l'Union européenne, applicable aux utilisateurs situés dans l'UE/EEE.`,
  },
  {
    id: "responsable",
    title: "2. Responsable du traitement",
    /* La société n'est pas encore constituée : le responsable du traitement
       est donc une personne physique, pas une Sàrl avec une adresse et un
       DPO. Remplacez les deux mentions entre crochets, ici et à la dernière
       section, par votre nom et votre adresse e-mail. */
    content: `Le responsable du traitement des données est :\n\n[MON NOM]\n[MON E-MAIL]\nSuisse\n\nE-Dome n'est pas encore constituée en société. En attendant, le responsable du traitement est la personne physique à l'origine du projet, joignable à l'adresse ci-dessus pour toute question relative au traitement de vos données personnelles. Ces mentions seront mises à jour dès la constitution de la société.`,
  },
  {
    id: "collecte",
    title: "3. Données collectées",
    content: `Nous collectons les catégories de données suivantes :\n\n**Données d'inscription :** nom, prénom, adresse email, numéro de téléphone, mot de passe (chiffré), pays de résidence, langue préférée.\n\n**Données de profil :** photo de profil, biographie, certifications, langues parlées, rôles actifs.\n\n**Données de transaction :** historique des réservations, montants, moyens de paiement (les données bancaires complètes sont traitées par notre prestataire de paiement certifié PCI-DSS).\n\n**Données d'utilisation :** pages visitées, fonctionnalités utilisées, durée des sessions, adresse IP, type de navigateur, appareil utilisé.\n\n**Données de communication :** messages échangés entre utilisateurs, historique du chat en direct, demandes de support.\n\n**Données de localisation :** ville et pays (jamais de géolocalisation précise sans consentement explicite).`,
  },
  {
    id: "manifestations-interet",
    title: "4. Manifestations d'intérêt (liste d'attente)",
    content: `Le formulaire de la page d'accueil, avant l'ouverture de la plateforme, constitue un traitement distinct de ceux décrits ci-dessus.

Données collectées : prénom, adresse e-mail, profil déclaré (agence, créateur, prestataire, investisseur, propriétaire, candidature à l'équipe), canton ou pays de résidence, réponses aux questions relatives à votre activité, engagements que vous avez cochés, et horodatage de votre consentement.

Ce que nous ne collectons pas : aucune adresse IP n'est conservée, ni en clair ni sous forme hachée. La limitation du nombre d'envois s'effectue en mémoire, sans conservation.

Finalité : vous recontacter au sujet du projet, comprendre les besoins des premiers utilisateurs et établir l'ordre de priorité des fonctionnalités. Vos réponses ne servent à aucune prospection pour le compte de tiers et ne sont ni vendues ni cédées.

Base légale : votre consentement, recueilli par une case à cocher non pré-remplie et horodaté lors de l'enregistrement. L'inscription à la lettre d'information fait l'objet d'un consentement séparé, également facultatif.

Parrainage : si vous arrivez par un lien de parrainage, un cookie conservant le code du parrain est déposé pour une durée de 30 jours. Il nous permet d'attribuer votre inscription à la personne qui vous a orienté vers nous. Vous pouvez le supprimer à tout moment depuis les réglages de votre navigateur.

Mesure d'audience : par défaut, aucun outil de mesure n'est chargé sur la page d'accueil et aucun cookie de mesure n'est déposé. Si un tel outil est activé à l'avenir, cette politique sera mise à jour avant sa mise en service.

Hébergement des données : l'application est hébergée par Vercel et les données du formulaire sont enregistrées chez Supabase, dans une région située en Europe. Seul le serveur accède à ces données ; la table est protégée par une sécurité au niveau des lignes qui n'autorise aucune lecture publique.

Durée de conservation : 24 mois à compter de notre dernier contact. Vous pouvez demander la suppression de vos données à tout moment, sans motif ; elle est alors effectuée sans attendre ce délai.

Vos droits : vous pouvez demander à consulter, corriger, exporter ou supprimer l'ensemble de ces données en écrivant à l'adresse indiquée à la section « Responsable du traitement ». Nous y répondons dans un délai de 30 jours. La suppression est définitive et entraîne votre retrait de la liste d'attente.`,
  },
  {
    id: "finalites",
    title: "5. Finalités du traitement",
    content: `Vos données sont traitées pour les finalités suivantes :\n- Fourniture et amélioration des services de la Plateforme.\n- Gestion de votre compte et de vos préférences.\n- Traitement des transactions et versements de commissions.\n- Communication relative à votre compte (notifications, alertes).\n- Analyse statistique et amélioration de l'expérience utilisateur.\n- Prévention de la fraude et sécurité de la Plateforme.\n- Respect de nos obligations légales et réglementaires.\n- Marketing direct (uniquement avec votre consentement préalable).`,
  },
  {
    id: "base-legale",
    title: "6. Base légale du traitement",
    content: `Le traitement de vos données repose sur les bases légales suivantes :\n- **Exécution contractuelle :** traitement nécessaire à la fourniture des services.\n- **Consentement :** pour le marketing direct et les cookies non essentiels.\n- **Intérêt légitime :** pour l'amélioration des services et la prévention de la fraude.\n- **Obligation légale :** pour les obligations fiscales et de conformité.`,
  },
  {
    id: "partage",
    title: "7. Partage des données",
    content: `Vos données peuvent être partagées avec :\n- **Autres utilisateurs :** informations de profil public, annonces, avis.\n- **Prestataires de services :** hébergement de l’application (Vercel) et de la base de données (Supabase, région Europe), paiement, analyse, support.\n- **Autorités compétentes :** sur requête légale ou judiciaire.\n\nNous ne vendons jamais vos données personnelles à des tiers. Tout transfert de données hors de Suisse ou de l'UE/EEE est encadré par des garanties appropriées (clauses contractuelles types, décisions d'adéquation).`,
  },
  {
    id: "conservation",
    title: "8. Durée de conservation",
    content: `Vos données sont conservées pour la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées :\n- Données de compte : pendant la durée de votre inscription + 2 ans après suppression.\n- Données de transaction : 10 ans (obligations légales suisses).\n- Données d'utilisation : 26 mois maximum.\n- Messages : 5 ans après le dernier message.\n- Cookies : voir la section dédiée ci-dessous.`,
  },
  {
    id: "droits",
    title: "9. Vos droits",
    content: `Conformément à la LPD et au RGPD, vous disposez des droits suivants :\n- **Droit d'accès :** obtenir une copie de vos données personnelles.\n- **Droit de rectification :** corriger des données inexactes ou incomplètes.\n- **Droit à l'effacement :** demander la suppression de vos données (sous réserve des obligations légales).\n- **Droit à la portabilité :** recevoir vos données dans un format structuré et lisible.\n- **Droit d'opposition :** vous opposer au traitement de vos données pour des motifs légitimes.\n- **Droit de retrait du consentement :** retirer votre consentement à tout moment sans affecter la légalité du traitement antérieur.\n- **Droit de réclamation :** introduire une réclamation auprès du Préposé fédéral à la protection des données (PFPDT) ou de l'autorité de contrôle compétente.\n\nPour exercer vos droits, écrivez à l’adresse indiquée à la section « Responsable du traitement ». Nous répondons dans un délai de 30 jours.`,
  },
  {
    id: "securite",
    title: "10. Sécurité des données",
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :\n- Chiffrement des données en transit (TLS 1.3) et au repos (AES-256).\n- Authentification à deux facteurs disponible.\n- Accès restreint aux données (principe du moindre privilège).\n- Audits de sécurité réguliers.\n- Hébergement chez des prestataires établis, dans une région européenne.\n- Plan de réponse aux incidents de sécurité.`,
  },
  {
    id: "cookies",
    title: "11. Cookies",
    content: `La Plateforme utilise les types de cookies suivants :\n- **Cookies essentiels :** nécessaires au fonctionnement (session, sécurité). Pas de consentement requis.\n- **Cookies analytiques :** mesure d'audience anonymisée. Consentement requis.\n- **Cookies de préférence :** mémorisation de vos choix (langue, devise, thème). Consentement requis.\n\nNous n'utilisons aucun cookie publicitaire ni de tracking tiers. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de la Plateforme.`,
  },
  {
    id: "mineurs",
    title: "12. Données des mineurs",
    content: `La Plateforme n'est pas destinée aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles de mineurs. Si nous apprenons que des données d'un mineur ont été collectées, nous les supprimerons dans les plus brefs délais.`,
  },
  {
    id: "modifications",
    title: "13. Modifications de la politique",
    content: `E-Dome se réserve le droit de modifier la présente Politique de Confidentialité à tout moment. Les modifications significatives seront communiquées par notification sur la Plateforme ou par email. La date de dernière mise à jour est indiquée en haut de cette page. En continuant à utiliser la Plateforme après modification, l'Utilisateur accepte la version mise à jour.\n\nPour toute question concernant la protection de vos données, écrivez à [MON E-MAIL].`,
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
      <div className="p-4 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/5 text-xs text-[var(--text-secondary)] leading-relaxed">
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
            className="block text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition text-left"
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
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              <RichText text={s.content} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
