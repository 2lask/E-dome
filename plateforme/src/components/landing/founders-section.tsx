"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { TextEffect } from "@/components/ui/text-effect";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-16 md:py-44 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,149,106,0.03)_0%,_transparent_60%)]" />
      <ArchBackground variant="building" />

      <div className="max-w-6xl mx-auto relative">

        {/* Léonard - photo left, text right */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-16 md:mb-28"
        >
          <div className="w-36 sm:w-48 md:w-64 shrink-0">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-[#C4956A]/30 shadow-[0_0_40px_rgba(196,149,106,0.15)]">
              <img src="/images/founders/leonard.jpg" alt="Léonard Ansermet" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <TextEffect per="word" preset="fade" delay={0.2} trigger={inView}
              className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">
              Fondateur et CEO
            </TextEffect>
            <h3 className="text-white text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
              <VerticalCutReveal splitBy="words" staggerDuration={0.15} staggerFrom="first">
                Léonard Ansermet
              </VerticalCutReveal>
            </h3>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4">
              L&apos;idée d&apos;E-Dome m&apos;est venue en vivant le quotidien
              de l&apos;immobilier de l&apos;intérieur. En tant qu&apos;apporteur
              d&apos;affaires, je passais mes journées à naviguer entre
              des dizaines d&apos;outils différents, à chercher les bons
              contacts sur une plateforme, les bons biens sur une autre,
              à suivre mes commissions sur des fichiers manuels. Je
              perdais un temps considérable — et je savais que tous les
              acteurs du secteur vivaient la même chose.
            </p>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Un soir, j&apos;ai ouvert une page blanche et j&apos;ai commencé
              à dessiner ce que serait la plateforme idéale. Pas un outil
              de plus — un endroit unique où chaque professionnel de
              l&apos;immobilier retrouve tout ce dont il a besoin. Le réseau,
              les annonces, la formation, les commissions, la visibilité.
              Page après page, fonctionnalité après fonctionnalité,
              E-Dome a pris forme. Aujourd&apos;hui, cette vision est devenue
              une maquette de plus de 30 pages — et bientôt, une réalité.
            </p>
            <div className="flex items-center gap-3 mt-5 justify-center md:justify-start">
              <a href="https://wa.me/66910687928" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs font-medium hover:bg-[#25D366]/20 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href="mailto:contact@edome.world"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contact@edome.world
              </a>
            </div>
          </div>
        </motion.div>

        {/* Central quote */}
        <div className="text-center mb-16 md:mb-28 px-4">
          <div className="w-12 h-1 bg-[#C4956A] mx-auto mb-8" />
          <div
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white leading-[1.3] tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            <VerticalCutReveal splitBy="words" staggerDuration={0.08} staggerFrom="center">
              On ne veut pas juste créer une application. On veut changer la manière dont l'immobilier connecte les gens.
            </VerticalCutReveal>
          </div>
          <div className="w-12 h-1 bg-[#C4956A] mx-auto mt-8" />
        </div>

        {/* Jean-Pierre - text left, photo right */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 mb-16 md:mb-28"
        >
          <div className="flex-1 text-center md:text-right">
            <TextEffect per="word" preset="fade" delay={0.2} trigger={inView}
              className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">
              Co-fondateur et COO
            </TextEffect>
            <h3 className="text-white text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
              <VerticalCutReveal splitBy="words" staggerDuration={0.15} staggerFrom="first">
                Jean-Pierre Medard Garza
              </VerticalCutReveal>
            </h3>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4">
              Quand Léonard m&apos;a montré ce qu&apos;il avait en tête, j&apos;ai
              tout de suite compris que ce n&apos;était pas juste une idée
              d&apos;application. C&apos;était une réponse à un vrai problème —
              un secteur où les gens créent de la valeur chaque jour mais
              n&apos;ont aucun espace commun pour se retrouver, collaborer
              et être reconnus.
            </p>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Titulaire d&apos;un CFC d&apos;employé de commerce avec maturité
              professionnelle, j&apos;ai appris qu&apos;un bon produit ne suffit
              jamais — il faut une exécution rigoureuse et des fondations
              solides. Mon rôle, c&apos;est de structurer le modèle, trouver
              les bons partenaires et m&apos;assurer que chaque décision
              sert la croissance durable du projet. C&apos;est ce que je
              construis chaque jour pour E-Dome.
            </p>
            <div className="flex items-center gap-3 mt-5 justify-center md:justify-end">
              <a href="https://wa.me/41762832444" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs font-medium hover:bg-[#25D366]/20 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href="mailto:contact@edome.world"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contact@edome.world
              </a>
            </div>
          </div>
          <div className="w-36 sm:w-48 md:w-64 shrink-0">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-[#C4956A]/30 shadow-[0_0_40px_rgba(196,149,106,0.15)]">
              <img src="/images/founders/jeanpierre.jpg" alt="Jean-Pierre Medard Garza" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Vision commune */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left card */}
            <div className="rounded-2xl p-7 md:p-9 border-2 border-[#C4956A]/20" style={{ background: "rgba(196, 149, 106, 0.04)" }}>
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-4 font-medium">Notre conviction</p>
              <p
                className="text-white text-xl md:text-2xl leading-[1.3] mb-5 tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                L&apos;immobilier ne changera pas grâce à un outil de plus.
                Il changera quand ses acteurs seront enfin{" "}
                <em className="italic text-[#C4956A]">connectés.</em>
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Des milliers de professionnels compétents restent dans
                l&apos;ombre faute d&apos;un espace qui les met en lumière. Des
                opportunités se perdent chaque jour entre des outils qui
                ne se parlent pas. Des commissions sont versées sans que
                personne ne sache vraiment à qui ni pourquoi. Ce n&apos;est
                pas une fatalité — c&apos;est un problème qu&apos;on a décidé
                de résoudre.
              </p>
            </div>

            {/* Right card */}
            <div className="rounded-2xl p-7 md:p-9 border-2 border-white/8" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-4 font-medium">Notre engagement</p>
              <p
                className="text-white text-xl md:text-2xl leading-[1.3] mb-5 tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                On ne cherche pas des utilisateurs.
                {" "}On cherche des{" "}
                <em className="italic text-[#C4956A]">pionniers.</em>
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                E-Dome grandit grâce à ceux qui le vivent au quotidien.
                Chaque retour terrain, chaque idée partagée, chaque besoin
                exprimé rend la plateforme plus forte. Les premiers à nous
                faire confiance ne rejoignent pas un projet — ils en
                écrivent les premières pages.
              </p>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
