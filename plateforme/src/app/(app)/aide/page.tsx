"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Home,
  Smartphone,
  Users,
  GraduationCap,
  CreditCard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── FAQ Data ───────────────────────────────────────────

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  faqs: FAQ[];
}

const categories: FAQCategory[] = [
  {
    id: "marketplace",
    label: "Marketplace",
    icon: Home,
    emoji: "\uD83C\uDFE0",
    faqs: [
      {
        question: "Comment publier une annonce sur la marketplace ?",
        answer:
          "Rendez-vous sur la page \"Publier\" depuis le menu latéral. Sélectionnez le type de bien (location courte durée, location longue durée ou vente), remplissez les informations requises, ajoutez des photos de qualité et définissez votre prix. Votre annonce sera vérifiée par notre équipe avant d'être publiée, généralement sous 24 heures.",
      },
      {
        question: "Comment fonctionne le système de réservation ?",
        answer:
          "Lorsqu'un client souhaite réserver votre bien, il envoie une demande de réservation avec les dates souhaitées. Vous recevez une notification et disposez de 24 heures pour accepter ou refuser. Une fois acceptée, le paiement est sécurisé via notre plateforme et vous sera versé selon les conditions convenues.",
      },
      {
        question: "Quels frais sont appliqués sur les transactions ?",
        answer:
          "Les commissions varient selon le type de transaction : 10-15% pour la location courte durée, 10-15% pour la location longue durée, et 2-4% pour les ventes immobilières. Le taux exact dépend de votre volume de transactions et de votre statut sur la plateforme.",
      },
      {
        question: "Comment optimiser la visibilité de mon annonce ?",
        answer:
          "Ajoutez des photos professionnelles de haute qualité, rédigez une description détaillée et attractive, fixez un prix compétitif et maintenez un taux de réponse élevé. Les annonces avec des avis positifs et un hôte vérifié bénéficient d'un meilleur positionnement dans les résultats de recherche.",
      },
      {
        question: "Que faire en cas de problème avec une réservation ?",
        answer:
          "Contactez d'abord l'autre partie via la messagerie intégrée de la plateforme. Si le problème persiste, utilisez notre formulaire de signalement depuis la page de la réservation ou contactez notre support via la page Contact. Notre équipe de médiation interviendra sous 48 heures.",
      },
    ],
  },
  {
    id: "social",
    label: "Réseau Social",
    icon: Smartphone,
    emoji: "\uD83D\uDCF1",
    faqs: [
      {
        question: "Comment publier du contenu sur le réseau social ?",
        answer:
          "Depuis votre feed, cliquez sur le bouton de publication en haut de page. Vous pouvez partager du texte, des images, des vidéos ou des liens. Utilisez des hashtags pertinents pour augmenter la visibilité de vos publications auprès de la communauté immobilière.",
      },
      {
        question: "Comment gérer la confidentialité de mes publications ?",
        answer:
          "Dans vos paramètres de confidentialité, vous pouvez choisir qui peut voir vos publications (public, abonnés uniquement, ou privé). Vous pouvez également bloquer des utilisateurs et contrôler qui peut vous envoyer des messages directs.",
      },
      {
        question: "Comment augmenter mon engagement sur la plateforme ?",
        answer:
          "Publiez régulièrement du contenu de qualité lié à l'immobilier, interagissez avec les publications d'autres utilisateurs (likes, commentaires), participez aux discussions et partagez votre expertise. Les utilisateurs actifs et pertinents sont mis en avant par l'algorithme.",
      },
      {
        question: "Puis-je signaler un contenu inapproprié ?",
        answer:
          "Oui, chaque publication dispose d'un bouton de signalement. Sélectionnez le motif du signalement (spam, contenu inapproprié, harcèlement, etc.) et notre équipe de modération examinera le contenu sous 24 heures. Les contenus en violation de nos CGU seront supprimés.",
      },
    ],
  },
  {
    id: "apporteurs",
    label: "Apporteurs",
    icon: Users,
    emoji: "\uD83E\uDD1D",
    faqs: [
      {
        question: "Comment devenir apporteur d'affaires ?",
        answer:
          "Activez le rôle \"Apporteur\" dans vos paramètres de compte. Après vérification de votre identité (KYC), vous recevrez votre lien de recommandation personnel. Partagez ce lien et gagnez des commissions sur chaque transaction réalisée par vos filleuls.",
      },
      {
        question: "Comment fonctionnent les liens de recommandation ?",
        answer:
          "Votre lien de recommandation unique est disponible dans votre tableau de bord Apporteurs. Lorsqu'un utilisateur s'inscrit via votre lien et effectue une transaction, vous percevez une commission calculée sur la commission plateforme. Le tracking est assuré par cookies pendant 30 jours.",
      },
      {
        question: "Quels sont les paliers de commissions ?",
        answer:
          "Le programme comporte 5 paliers : Bronze (départ), Argent, Or, Platine et Diamant. Chaque palier offre un taux de commission plus élevé et des avantages supplémentaires. La progression dépend de votre volume de recommandations et du chiffre d'affaires généré.",
      },
      {
        question: "Comment sont versées les commissions d'apporteur ?",
        answer:
          "Les commissions sont calculées en temps réel et apparaissent dans votre tableau de bord. Les versements sont effectués mensuellement par virement bancaire, sous réserve d'un montant minimum de 50 CHF. Vous recevez un relevé détaillé de toutes vos commissions.",
      },
    ],
  },
  {
    id: "formations",
    label: "Formations",
    icon: GraduationCap,
    emoji: "\uD83D\uDCDA",
    faqs: [
      {
        question: "Comment accéder aux formations ?",
        answer:
          "Rendez-vous dans la section \"Formations\" depuis le menu latéral. Parcourez le catalogue par catégorie ou utilisez la recherche. Certaines formations sont gratuites, d'autres nécessitent un achat. Une fois inscrit, vous accédez aux modules à votre rythme depuis votre espace personnel.",
      },
      {
        question: "Les certificats ont-ils une valeur officielle ?",
        answer:
          "Les certificats E-Dome attestent de votre achèvement d'une formation et des compétences acquises. Ils sont reconnus au sein de la communauté E-Dome et valorisent votre profil sur la plateforme. Certaines formations sont élaborées en partenariat avec des organismes reconnus.",
      },
      {
        question: "Puis-je obtenir un remboursement pour une formation ?",
        answer:
          "Vous disposez d'un délai de 14 jours après l'achat pour demander un remboursement, à condition de ne pas avoir complété plus de 30% des modules. La demande se fait depuis la page de la formation ou en contactant le support. Le remboursement est effectué sous 10 jours ouvrés.",
      },
    ],
  },
  {
    id: "paiements",
    label: "Paiements",
    icon: CreditCard,
    emoji: "\uD83D\uDCB0",
    faqs: [
      {
        question: "Quels moyens de paiement sont acceptés ?",
        answer:
          "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les virements bancaires (SEPA et SWIFT), TWINT ainsi que d'autres méthodes de paiement locales. Tous les paiements sont sécurisés et chiffrés.",
      },
      {
        question: "Comment est assurée la sécurité des paiements ?",
        answer:
          "Tous les paiements sont traités via des prestataires certifiés PCI-DSS. Les données bancaires ne sont jamais stockées sur nos serveurs. Chaque transaction bénéficie d'une authentification forte (3D Secure) et notre système de détection de fraude surveille les activités suspectes en temps réel.",
      },
      {
        question: "Comment fonctionne le processus de remboursement ?",
        answer:
          "En cas d'annulation éligible, le remboursement est initié automatiquement vers le moyen de paiement original. Le délai de traitement est de 5 à 10 jours ouvrés selon votre banque. Vous recevez une confirmation par email dès l'initiation du remboursement.",
      },
      {
        question: "Où trouver mes factures et relevés ?",
        answer:
          "Toutes vos factures et relevés de transactions sont disponibles dans la section \"Facturation\" de vos paramètres. Vous pouvez les télécharger au format PDF à tout moment. Un récapitulatif mensuel est également envoyé par email.",
      },
    ],
  },
  {
    id: "compte",
    label: "Compte",
    icon: Settings,
    emoji: "\u2699\uFE0F",
    faqs: [
      {
        question: "Comment modifier mes informations personnelles ?",
        answer:
          "Rendez-vous dans \"Paramètres\" > \"Général\" pour modifier votre nom, photo de profil, bio et coordonnées. Certaines modifications (email, téléphone) nécessitent une confirmation par code de vérification pour des raisons de sécurité.",
      },
      {
        question: "Comment supprimer mon compte ?",
        answer:
          "Dans \"Paramètres\" > \"Général\", faites défiler jusqu'à la section \"Zone de danger\" et cliquez sur \"Supprimer mon compte\". Cette action est irréversible et entraîne la suppression de toutes vos données après un délai de 30 jours, conformément à notre politique de confidentialité.",
      },
      {
        question: "Comment vérifier mon identité (KYC) ?",
        answer:
          "La vérification d'identité est requise pour certains services (publication d'annonces, apporteur d'affaires, transactions). Rendez-vous dans \"Paramètres\" > \"Sécurité\" et suivez le processus de vérification en fournissant une pièce d'identité valide et un selfie de confirmation. La vérification prend généralement 24 à 48 heures.",
      },
      {
        question: "Comment activer l'authentification à deux facteurs ?",
        answer:
          "Dans \"Paramètres\" > \"Sécurité\", activez l'authentification à deux facteurs (2FA). Vous pouvez choisir de recevoir les codes par SMS ou d'utiliser une application d'authentification (Google Authenticator, Authy). Nous recommandons fortement d'activer cette option pour sécuriser votre compte.",
      },
    ],
  },
];

// ─── Accordion Item ─────────────────────────────────────

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--card-border)] last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className={cn("text-sm font-medium transition-colors", isOpen ? "text-[#C4956A]" : "text-[var(--foreground)]")}>
          {faq.question}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-[var(--text-secondary)] transition-transform duration-200",
            isOpen && "rotate-180 text-[#C4956A]"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────

export default function AidePage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(q) ||
            faq.answer.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.faqs.length > 0);
  }, [search]);

  const displayCategories = activeCategory
    ? filteredCategories.filter((c) => c.id === activeCategory)
    : filteredCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[800px] pb-16"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4956A]/10">
          <HelpCircle className="h-6 w-6 text-[#C4956A]" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Centre d&apos;aide</h1>
        <p className="text-sm text-[var(--text-secondary)]">Comment pouvons-nous vous aider ?</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveCategory(null);
          }}
          placeholder="Rechercher une question..."
          className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] py-3.5 pl-12 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[#C4956A]/40"
        />
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            activeCategory === null
              ? "bg-[#C4956A]/15 text-[#C4956A]"
              : "bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-[#C4956A]/15 text-[#C4956A]"
                : "bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            )}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {displayCategories.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--text-secondary)]">Aucun résultat pour &laquo; {search} &raquo;</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Essayez avec d&apos;autres termes ou contactez notre support.</p>
          </div>
        ) : (
          displayCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden">
                <div className="flex items-center gap-3 border-b border-[var(--card-border)] px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C4956A]/10">
                    <Icon className="h-4 w-4 text-[#C4956A]" />
                  </div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">
                    <span className="mr-2">{cat.emoji}</span>
                    {cat.label}
                  </h2>
                  <span className="ml-auto text-xs text-[var(--text-muted)]">{cat.faqs.length} questions</span>
                </div>
                <div>
                  {cat.faqs.map((faq, i) => {
                    const key = `${cat.id}-${i}`;
                    return (
                      <AccordionItem
                        key={key}
                        faq={faq}
                        isOpen={openItems.has(key)}
                        onToggle={() => toggleItem(key)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4956A]/10">
          <MessageCircle className="h-6 w-6 text-[#C4956A]" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
          Vous n&apos;avez pas trouvé votre réponse ?
        </h3>
        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          Notre équipe de support est disponible du lundi au vendredi, de 9h à 18h CET.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Contacter le support
        </Link>
      </div>
    </motion.div>
  );
}
