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
  { category: "Compte", question: "Comment creer un compte sur E-Dome ?", answer: "Cliquez sur 'S'inscrire' depuis la page d'accueil, renseignez vos informations (nom, email, mot de passe) et validez votre adresse email via le lien de confirmation recu." },
  { category: "Compte", question: "Comment changer mon role actif ?", answer: "Rendez-vous dans vos Parametres > Roles. Vous pouvez activer ou desactiver les roles disponibles et definir votre role principal. Chaque role donne acces a des fonctionnalites specifiques." },
  { category: "Compte", question: "Comment supprimer mon compte ?", answer: "Allez dans Parametres > Securite > Supprimer le compte. Cette action est irreversible. Vos donnees seront supprimees conformement a notre politique de confidentialite (certaines donnees sont conservees pour des raisons legales)." },
  // Publication
  { category: "Publication", question: "Comment publier un bien ?", answer: "Activez le role 'Hote' puis cliquez sur 'Publier'. Remplissez les informations du bien (titre, description, photos, prix, localisation) et soumettez votre annonce. Elle sera examinee par notre equipe avant publication." },
  { category: "Publication", question: "Combien de photos puis-je ajouter ?", answer: "Vous pouvez ajouter jusqu'a 30 photos par annonce. Nous recommandons un minimum de 10 photos de haute qualite pour maximiser l'attractivite de votre bien. Les videos sont egalement acceptees." },
  { category: "Publication", question: "Combien de temps dure la verification ?", answer: "La verification d'une annonce prend generalement entre 24 et 48 heures. Vous recevrez une notification des que votre annonce sera publiee ou si des modifications sont requises." },
  // Reservation
  { category: "Reservation", question: "Comment reserver un bien ?", answer: "Selectionnez le bien souhaite, choisissez vos dates et cliquez sur 'Reserver'. Vous devrez confirmer le paiement pour finaliser la reservation. L'hote recevra une notification et pourra accepter ou refuser." },
  { category: "Reservation", question: "Quelle est la politique d'annulation ?", answer: "Chaque hote definit sa propre politique d'annulation (flexible, moderee ou stricte). Les details sont indiques sur chaque annonce. En cas d'annulation, le remboursement depend de la politique choisie par l'hote." },
  { category: "Reservation", question: "Comment contacter l'hote avant de reserver ?", answer: "Utilisez le bouton 'Contacter l'hote' sur la page du bien pour envoyer un message direct. Vous pouvez poser vos questions avant de confirmer votre reservation." },
  // Paiement
  { category: "Paiement", question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons les cartes de credit (Visa, Mastercard), TWINT, les virements bancaires IBAN, et PayPal. Tous les paiements sont securises et chiffres." },
  { category: "Paiement", question: "Quand recois-je mon paiement en tant qu'hote ?", answer: "Le paiement est verse dans les 48 heures suivant le check-in du client, apres deduction de la commission plateforme. Les versements sont effectues sur votre compte bancaire enregistre." },
  { category: "Paiement", question: "Comment fonctionnent les commissions ?", answer: "E-Dome preleve une commission sur chaque transaction (3.5% vente, 8% location courte duree, 50% premier loyer longue duree). Les commissions des apporteurs sont prelevees sur la part plateforme, sans cout supplementaire pour l'hote ou le client." },
  // Apporteurs
  { category: "Apporteurs", question: "Comment devenir apporteur d'affaires ?", answer: "Activez le role 'Apporteur' dans vos parametres. Vous aurez acces a vos liens de parrainage personnalises que vous pouvez partager pour amener des hotes, clients ou biens sur la plateforme." },
  { category: "Apporteurs", question: "Comment sont calculees mes commissions ?", answer: "Votre commission est un pourcentage de la commission plateforme (jusqu'a 15%). Elle est calculee automatiquement lors de chaque conversion et versee mensuellement sur votre compte bancaire." },
  { category: "Apporteurs", question: "Combien de temps dure le tracking d'un lien ?", answer: "Le cookie de tracking est valide pendant 90 jours apres le clic. Si le prospect s'inscrit et realise une transaction dans ce delai, la conversion vous est attribuee." },
  // Technique
  { category: "Technique", question: "L'application est-elle disponible sur mobile ?", answer: "E-Dome est une application web responsive accessible depuis tout navigateur mobile. Une application native iOS et Android est en cours de developpement et sera disponible courant 2026." },
  { category: "Technique", question: "Mes donnees sont-elles securisees ?", answer: "Oui. Nous utilisons le chiffrement TLS 1.3 pour les transmissions et AES-256 pour le stockage. Nos serveurs sont heberges en Suisse et certifies ISO 27001. L'authentification a deux facteurs est disponible." },
  { category: "Technique", question: "Comment signaler un probleme technique ?", answer: "Utilisez le formulaire de contact ou envoyez un email a support@edome.world en decrivant le probleme, votre navigateur et votre appareil. Notre equipe technique vous repondra sous 24 heures." },
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
          <p className="text-[var(--text-muted)]">Aucun resultat pour votre recherche.</p>
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
