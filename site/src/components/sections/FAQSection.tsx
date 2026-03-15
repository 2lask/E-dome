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
  {
    question: "Combien coûte l'utilisation d'E-Dome ?",
    answer:
      "L'inscription est gratuite. E-Dome se r\u00e9mun\u00e8re via des commissions sur les transactions, nettement inf\u00e9rieures aux plateformes traditionnelles, des commissions sur les services additionnels, et des abonnements premium optionnels pour les agences. Les membres fondateurs b\u00e9n\u00e9ficient de conditions pr\u00e9f\u00e9rentielles permanentes.",
  },
  {
    question: "Quelle est la différence avec Airbnb ou Booking ?",
    answer:
      "Airbnb et Booking se limitent \u00e0 la r\u00e9servation de logements avec des commissions \u00e9lev\u00e9es. E-Dome est un \u00e9cosyst\u00e8me complet : r\u00e9seau social professionnel, marketplace multi-services (location CT, LT et vente), syst\u00e8me d\u2019apporteurs r\u00e9mun\u00e9r\u00e9s, formations int\u00e9gr\u00e9es et services additionnels. Le tout avec des commissions significativement inf\u00e9rieures.",
  },
  {
    question: "Comment devenir membre fondateur ?",
    answer:
      "Remplissez le formulaire de manifestation d'intérêt. Notre équipe analyse votre profil et vous contacte pour un échange. Les membres sélectionnés reçoivent un badge fondateur permanent, un accès bêta anticipé, des formations offertes et des conditions préférentielles sur les commissions dès le lancement.",
  },
  {
    question: "Quand le lancement est-il prévu ?",
    answer:
      "Le lancement officiel est prévu pour le second semestre 2025. Les membres fondateurs auront un accès bêta exclusif plusieurs semaines avant l'ouverture publique pour configurer leur profil et commencer à bâtir leur réseau.",
  },
  {
    question: "Mes données sont-elles protégées ?",
    answer:
      "Absolument. E-Dome est conforme au RGPD européen et à la LPD suisse. Vos données ne sont jamais vendues. Les paiements transitent par Stripe (certifié PCI-DSS). Une vérification KYC est requise pour les professionnels, conformément à la législation suisse anti-blanchiment.",
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
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#ffe0c2] border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 rounded-full px-4 py-1.5 mb-6">
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

        {/* CTA */}
        <motion.div className="mt-12 text-center" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:0.2}}>
          <p className="text-white/40 text-sm mb-4">Vous avez d&apos;autres questions ?</p>
          <a href="#qualification" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#ffe0c2]/30 text-[#ffe0c2] text-sm font-medium hover:bg-[#ffe0c2]/5 transition-colors duration-300">
            Contactez-nous
          </a>
        </motion.div>
      </div>
    </section>
  );
}
