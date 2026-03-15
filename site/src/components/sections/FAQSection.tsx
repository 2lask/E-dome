"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

interface FAQItemData {
  question: string;
  answer: string;
}

const faqs: FAQItemData[] = [
  {
    question: "E-Dome est-il déjà lancé ?",
    answer:
      "Pas encore. E-Dome est actuellement en phase de pré-lancement. Cette étape de qualification nous permet de constituer une communauté solide de fondateurs engagés avant l'ouverture officielle. C'est le moment idéal pour rejoindre le projet et bénéficier d'un positionnement prioritaire.",
  },
  {
    question: "La manifestation d'intérêt engage-t-elle à quelque chose ?",
    answer:
      "Absolument pas. Remplir le formulaire n'implique aucun paiement, aucun engagement contractuel et aucune obligation. Il sert uniquement à exprimer votre intérêt pour le programme. Vous restez libre de poursuivre ou non au moment du lancement.",
  },
  {
    question: "À qui s'adresse E-Dome ?",
    answer:
      "E-Dome est pensé pour l'ensemble des acteurs de l'immobilier : agences, hôtes, propriétaires, promoteurs, apporteurs d'affaires, photographes, vidéastes, formateurs et prestataires de services. Quel que soit votre rôle dans la chaîne de valeur immobilière, la plateforme vous offre des outils adaptés.",
  },
  {
    question: "E-Dome est-il limité à un seul pays ?",
    answer:
      "Non, E-Dome a été conçu dès le départ avec une vision internationale. L'infrastructure supporte le multi-devises et le multi-langues, ce qui vous permet d'opérer au-delà de vos frontières dès le premier jour.",
  },
  {
    question: "Comment fonctionne le système d'apporteurs ?",
    answer:
      "C'est très simple. Chaque utilisateur peut activer un rôle d'apporteur depuis son tableau de bord et générer des liens de partage traçables. Lorsqu'un lien aboutit à une transaction, la commission est calculée et versée automatiquement via la plateforme — sans frais supplémentaires pour l'hôte ni pour le client.",
  },
];

function FAQItem({
  item,
  index,
}: {
  item: FAQItemData;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-[#201e18]"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-2 text-left group cursor-pointer"
      >
        <span className="flex items-center gap-3 flex-1 pr-4">
          <HelpCircle className="shrink-0 w-5 h-5 text-[#ffe0c2]/40" />
          <span className="text-lg font-semibold text-white group-hover:text-[#ffe0c2] transition-colors duration-300">
            {item.question}
          </span>
        </span>

        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#201e18] transition-colors duration-300 group-hover:border-[#ffe0c2]/40">
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ChevronDown className="w-4 h-4 text-[#ffe0c2]" />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 px-2 pl-10 text-white/60 text-base leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-32 px-6 md:px-12 bg-[#111111]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#ffe0c2] border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 rounded-full px-4 py-1.5 mb-6">
            <MessageCircle className="w-3.5 h-3.5" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Questions{" "}
            <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
              fréquentes
            </span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="border-t border-[#201e18]">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} item={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
