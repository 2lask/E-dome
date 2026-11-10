"use client";

import React, { useState, useMemo } from "react";
import { Calendar as BookingCallout } from "@/components/ui/calendar";
import {
  AFFILIATION_RATES,
  APPORTEUR_SUBSCRIPTION_SHARES,
  APPORTEUR_WINDOW_MONTHS,
  EDOME_PRIME_SHARE,
  FREE_LIMITS,
  PRIME_DISPUTE,
  PRIME_RANGE_LABEL,
  RATES,
} from "@/lib/pricing/catalog";
import { chfLabel, primeBreakdown, affiliationBreakdown } from "@/lib/demo/affiliation";

/* ─── FAQ Data ───────────────────────────────────────────────────────────── */

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

/* La réponse unique sur le barème éclatait en trois questions, générées depuis
   le module (`RATES`) — elles ne peuvent donc pas répéter un ancien tarif. Le
   pct/range lit le catalogue ; le texte n'écrit aucun chiffre en dur. */
const pct = (r: number) => `${(r * 100).toLocaleString("fr-CH")} %`;
const range = (min: number, max: number) => (min === max ? pct(max) : `${pct(min)} à ${pct(max)}`);

const FAQS: FAQ[] = [
  // Compte
  { category: "Compte", question: "Comment créer un compte sur E-Dome ?", answer: "Cliquez sur 'S'inscrire' depuis la page d'accueil, renseignez vos informations (nom, email, mot de passe) et validez votre adresse email via le lien de confirmation reçu." },
  { category: "Compte", question: "Comment changer mon rôle actif ?", answer: "Rendez-vous dans vos Paramètres > Rôles. Vous pouvez activer ou désactiver les rôles disponibles et définir votre rôle principal. Chaque rôle donne accès à des fonctionnalités spécifiques." },
  { category: "Compte", question: "Comment supprimer mon compte ?", answer: "Allez dans Paramètres > Sécurité > Supprimer le compte. Cette action est irréversible. Vos données seront supprimées conformément à notre politique de confidentialité (certaines données sont conservées pour des raisons légales)." },
  // Publication
  { category: "Publication", question: "Comment publier un bien ?", answer: "Activez le rôle 'Hôte' puis cliquez sur 'Publier'. Remplissez les informations du bien (titre, description, photos, prix, localisation) et soumettez votre annonce. Elle sera examinée par notre équipe avant publication." },
  { category: "Publication", question: "Combien de photos puis-je ajouter ?", answer: "Vous pouvez ajouter jusqu'à 30 photos par annonce. Nous recommandons un minimum de 10 photos de haute qualité pour maximiser l'attractivité de votre bien. Les vidéos sont également acceptées." },
  { category: "Publication", question: "Combien de temps dure la vérification ?", answer: "La vérification d'une annonce prend généralement entre 24 et 48 heures. Vous recevrez une notification dès que votre annonce sera publiée ou si des modifications sont requises." },
  // Réservation
  { category: "Réservation", question: "Comment réserver un bien ?", answer: "Sélectionnez le bien souhaité, choisissez vos dates et cliquez sur 'Réserver'. Vous devrez confirmer le paiement pour finaliser la réservation. L'hôte recevra une notification et pourra accepter ou refuser." },
  { category: "Réservation", question: "Quelle est la politique d'annulation ?", answer: "Chaque hôte définit sa propre politique d'annulation (flexible, modérée ou stricte). Les détails sont indiqués sur chaque annonce. En cas d'annulation, le remboursement dépend de la politique choisie par l'hôte." },
  { category: "Réservation", question: "Comment contacter l'hôte avant de réserver ?", answer: "Utilisez le bouton 'Contacter l'hôte' sur la page du bien pour envoyer un message direct. Vous pouvez poser vos questions avant de confirmer votre réservation." },
  // Paiement
  { category: "Paiement", question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons les cartes de crédit (Visa, Mastercard), TWINT, les virements bancaires IBAN, et PayPal. Tous les paiements sont sécurisés et chiffrés." },
  { category: "Paiement", question: "Quand reçois-je mon paiement en tant qu'hôte ?", answer: "Le paiement est versé dans les 48 heures suivant le check-in du client, après déduction de la commission plateforme. Les versements sont effectués sur votre compte bancaire enregistré." },
  { category: "Paiement", question: "Combien coûte la vente ou la location longue durée d'un bien ?", answer: "Rien à E-Dome. Publier un bien à la vente ou en location longue durée est gratuit, et aucune somme due à E-Dome ne dépend de la conclusion de la vente ou du bail. E-Dome gagne sa vie du côté professionnel, par les abonnements des agences — pas sur la transaction d'un particulier." },
  { category: "Paiement", question: "Combien coûte un pôle de la marketplace ?", answer: `Une commission sur ce qui se vend via la plateforme, prélevée sur le prestataire ou l'hôte, jamais ajoutée au prix payé par le client. Location courte durée : ${range(RATES["location-ct"].min, RATES["location-ct"].max)} de la réservation, à la charge de l'hôte. Services : ${range(RATES.service.min, RATES.service.max)}. Formations : ${range(RATES.formation.min, RATES.formation.max)}. Lives : ${range(RATES.live.min, RATES.live.max)}. Événements : ${range(RATES.evenement.min, RATES.evenement.max)} plus une part fixe par billet. Boutique : aucune commission, elle fonctionne en affiliation.` },
  { category: "Paiement", question: "Qu'est-ce qui est gratuit, et qu'est-ce qui est payant ?", answer: `Tout le monde démarre gratuitement et peut vraiment travailler. Une agence ou un agent publie jusqu'à ${FREE_LIMITS.agence.activeListings} biens actifs, avec ${FREE_LIMITS.agence.seats} utilisateur et ${FREE_LIMITS.agence.activeApplications} candidatures d'accompagnement actives à la fois ; un prestataire ${FREE_LIMITS.prestataire.activeServices} fiches, un créateur ${FREE_LIMITS.createur.activeFormations} formations, un hôte ${FREE_LIMITS.hote.activeShortStays} biens en courte durée. Un particulier ne paie jamais rien. Le payant, c'est grandir : volume illimité, équipe, mise en avant, statistiques complètes. Détail par rôle sur la page Tarifs.` },
  // Apporteurs
  { category: "Apporteurs", question: "Comment devenir apporteur d'affaires ?", answer: "Activez le rôle 'Apporteur' dans vos paramètres. Vous aurez accès à vos liens de parrainage personnalisés que vous pouvez partager pour amener des hôtes, clients ou biens sur la plateforme." },
  { category: "Apporteurs", question: "Combien de temps dure le tracking d'un lien ?", answer: "Le cookie de tracking est valide pendant 30 jours après le clic (attribution au premier clic). Si le prospect s'inscrit et réalise une transaction dans ce délai, la conversion vous est attribuée." },
  // Technique
  { category: "Technique", question: "L'application est-elle disponible sur mobile ?", answer: "E-Dome est une application web responsive accessible depuis tout navigateur mobile. Une application native iOS et Android est en cours de développement et sera disponible courant 2026." },
  { category: "Technique", question: "Mes données sont-elles sécurisées ?", answer: "Oui. Nous utilisons le chiffrement TLS 1.3 pour les transmissions et AES-256 pour le stockage. Nos serveurs sont hébergés en Suisse et certifiés ISO 27001. L'authentification à deux facteurs est disponible." },
  { category: "Technique", question: "Comment signaler un problème technique ?", answer: "Utilisez le formulaire de contact ou envoyez un email à support@edome.world en décrivant le problème, votre navigateur et votre appareil. Notre équipe technique vous répondra sous 24 heures." },
];

const CATEGORIES = [...new Set(FAQS.map((f) => f.category))];

/* ─── Le tableau comparatif des deux mécaniques apporteur ─────────────────
   Remplace l'ancienne FAQ à taux unique. Deux colonnes, jamais mélangées ;
   les exemples chiffrés passent par `quote()` (via affiliation.ts). */
const primeExample = primeBreakdown(200);
const formationExample = affiliationBreakdown("formation", 400, 0.35);
const affRange = (p: keyof typeof AFFILIATION_RATES) => {
  const r = AFFILIATION_RATES[p];
  return r ? range(r.min, r.max) : "—";
};
const COMPARE_ROWS: { label: string; biens: string; marketplace: string }[] = [
  { label: "Ce que vous touchez", biens: "Une prime fixe en francs", marketplace: "Un pourcentage du prix, toujours affiché en net CHF" },
  { label: "Qui la fixe", biens: `Le vendeur ou le bailleur, de ${PRIME_RANGE_LABEL}`, marketplace: `Le vendeur, dans une fourchette par pôle (formations ${affRange("formation")}, événements ${affRange("evenement")}, services ${affRange("service")}, courte durée ${affRange("location-ct")})` },
  { label: "Quand c'est dû", biens: "Quand le vendeur accepte la mise en relation. Refuser est gratuit ; jamais lié à la vente", marketplace: "Quand le produit est vendu grâce à votre lien" },
  { label: "Qui paie", biens: `Le vendeur. E-Dome retient ${pct(EDOME_PRIME_SHARE)} à l'intérieur de la prime`, marketplace: "Le vendeur, sur sa marge. La commission d'E-Dome ne change pas" },
  { label: "Exemple", biens: `Prime de ${chfLabel(primeExample.primeCents)} → vous touchez ${chfLabel(primeExample.apporteurCents)} net`, marketplace: `Formation à ${chfLabel(formationExample.grossCents)}, taux 35 % → vous touchez ${chfLabel(formationExample.affiliateCents)} net` },
  { label: "Protection", biens: `Contact « pas sérieux » signalable ${PRIME_DISPUTE.windowHours} h ; vérification renforcée au-delà de 1'000 CHF`, marketplace: "Attribution au premier clic, 30 jours" },
  { label: "Pays", biens: "Fermé en France, en Allemagne et au Portugal", marketplace: "Ouvert partout" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AidePage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    let results = FAQS;
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      results = results.filter((f) => f.category === activeCategory);
    }
    return results;
  }, [search, activeCategory]);

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, { faq: FAQ; globalIdx: number }[]> = {};
    filteredFaqs.forEach((faq, idx) => {
      if (!groups[faq.category]) groups[faq.category] = [];
      groups[faq.category].push({ faq, globalIdx: FAQS.indexOf(faq) });
    });
    return groups;
  }, [filteredFaqs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-3xl page-heading text-[var(--foreground)]">Centre d&apos;aide</h1>
        <p className="text-[var(--text-secondary)]">Trouvez rapidement des réponses à vos questions</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Rechercher une question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition text-lg"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeCategory === null
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          Tout
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Biens / Marketplace : le tableau comparatif */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Apporteurs : deux mécaniques, jamais confondues</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-left">
                <th className="w-32 p-3 font-medium text-[var(--text-muted)]"></th>
                <th className="p-3 font-semibold text-[var(--foreground)]">Biens · vente et location longue durée</th>
                <th className="p-3 font-semibold text-[var(--foreground)]">Marketplace · formations, lives, événements, services, courte durée</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r) => (
                <tr key={r.label} className="border-b border-[var(--card-border)] last:border-0 align-top">
                  <th scope="row" className="p-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{r.label}</th>
                  <td className="p-3 text-[var(--text-secondary)]">{r.biens}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{r.marketplace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Et les abonnements : amener une agence ou un propriétaire qui s&apos;abonne vous rapporte une part de ce qu&apos;encaisse E-Dome —{" "}
          {pct(APPORTEUR_SUBSCRIPTION_SHARES.patrimoine ?? 0)} Patrimoine, {pct(APPORTEUR_SUBSCRIPTION_SHARES.vitrine ?? 0)} Vitrine et Mandats,{" "}
          {pct(APPORTEUR_SUBSCRIPTION_SHARES.regie ?? 0)} Régie — pendant {APPORTEUR_WINDOW_MONTHS} mois au plus. Jamais un supplément pour le client.
        </p>
      </section>

      {/* FAQ Accordion */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">Aucun résultat pour votre recherche.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, items]) => (
            <section key={category} className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{category}</h2>
              <div className="space-y-2">
                {items.map(({ faq, globalIdx }) => (
                  <div key={globalIdx} className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden">
                    <button
                      onClick={() => toggleItem(globalIdx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--hover-bg)] transition"
                    >
                      <span className="text-[var(--foreground)] font-medium pr-4">{faq.question}</span>
                      <span className={`text-[var(--text-muted)] transition-transform ${openItems.has(globalIdx) ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>
                    {openItems.has(globalIdx) && (
                      <div className="px-4 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--card-border)] pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Contact CTA — deux pistes : appel direct (Calendar / cal.com)
          ou formulaire support. L'appel passe en premier car c'est
          souvent ce que les nouveaux utilisateurs cherchent quand ils
          ne trouvent pas dans la FAQ. */}
      <section className="space-y-4">
        <BookingCallout
          bookingLink="https://cal.com/edome/support"
          title="Vous n'avez pas trouvé votre réponse ?"
          subtitle="Réservez un appel avec notre équipe support. Lundi-vendredi, 9h-18h (CET)."
          ctaLabel="Réserver un appel"
          duration="20 min"
        />
        <div className="text-center">
          <a
            href="/contact"
            className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] underline"
          >
            Ou ouvrir un ticket support écrit
          </a>
        </div>
      </section>
    </div>
  );
}
