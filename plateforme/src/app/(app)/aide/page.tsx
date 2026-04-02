"use client";

import React, { useState, useMemo } from "react";

/* ─── FAQ Data ───────────────────────────────────────────────────────────── */

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

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
  { category: "Paiement", question: "Comment fonctionnent les commissions ?", answer: "E-Dome prélève une commission sur chaque transaction (3.5% vente, 8% location courte durée, 50% premier loyer longue durée). Les commissions des apporteurs sont prélevées sur la part plateforme, sans coût supplémentaire pour l'hôte ou le client." },
  // Apporteurs
  { category: "Apporteurs", question: "Comment devenir apporteur d'affaires ?", answer: "Activez le rôle 'Apporteur' dans vos paramètres. Vous aurez accès à vos liens de parrainage personnalisés que vous pouvez partager pour amener des hôtes, clients ou biens sur la plateforme." },
  { category: "Apporteurs", question: "Comment sont calculées mes commissions ?", answer: "Votre commission est un pourcentage de la commission plateforme (jusqu'à 15%). Elle est calculée automatiquement lors de chaque conversion et versée mensuellement sur votre compte bancaire." },
  { category: "Apporteurs", question: "Combien de temps dure le tracking d'un lien ?", answer: "Le cookie de tracking est valide pendant 90 jours après le clic. Si le prospect s'inscrit et réalise une transaction dans ce délai, la conversion vous est attribuée." },
  // Technique
  { category: "Technique", question: "L'application est-elle disponible sur mobile ?", answer: "E-Dome est une application web responsive accessible depuis tout navigateur mobile. Une application native iOS et Android est en cours de développement et sera disponible courant 2026." },
  { category: "Technique", question: "Mes données sont-elles sécurisées ?", answer: "Oui. Nous utilisons le chiffrement TLS 1.3 pour les transmissions et AES-256 pour le stockage. Nos serveurs sont hébergés en Suisse et certifiés ISO 27001. L'authentification à deux facteurs est disponible." },
  { category: "Technique", question: "Comment signaler un problème technique ?", answer: "Utilisez le formulaire de contact ou envoyez un email à support@edome.world en décrivant le problème, votre navigateur et votre appareil. Notre équipe technique vous répondra sous 24 heures." },
];

const CATEGORIES = [...new Set(FAQS.map((f) => f.category))];

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
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Centre d&apos;aide</h1>
        <p className="text-[var(--text-secondary)]">Trouvez rapidement des reponses a vos questions</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Rechercher une question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition text-lg"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeCategory === null
              ? "bg-[#C4956A] text-white"
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
                ? "bg-[#C4956A] text-white"
                : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

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

      {/* Contact CTA */}
      <section className="text-center p-8 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Vous n&apos;avez pas trouve votre reponse ?</h2>
        <p className="text-[var(--text-secondary)]">
          Notre equipe support est disponible du lundi au vendredi, de 9h a 18h (CET).
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 rounded-lg bg-[#C4956A] text-white font-medium hover:opacity-90 transition"
        >
          Contacter le support
        </a>
      </section>
    </div>
  );
}
