"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FoundersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-44 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,149,106,0.03)_0%,_transparent_60%)]" />
      <ArchBackground variant="building" />

      <div className="max-w-6xl mx-auto relative">

        {/* Léonard - photo left, text right */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-28"
        >
          <div className="w-48 md:w-64 shrink-0">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-[#C4956A]/30 shadow-[0_0_40px_rgba(196,149,106,0.15)]">
              <img src="/images/founders/leonard.jpg" alt="Léonard Ansermet" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">Fondateur & CEO</p>
            <h3 className="text-white text-3xl md:text-4xl font-semibold mb-5 tracking-tight">Léonard Ansermet</h3>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4">
              J&apos;ai commencé dans l&apos;immobilier comme apporteur d&apos;affaires,
              en connectant les gens de bouche à oreille. Pas de bureau, pas
              de licence — juste la conviction que mettre les bonnes personnes
              en contact crée de la valeur. Mais plus j&apos;avançais, plus je
              voyais un secteur brisé en morceaux.
            </p>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Des agents sans réseau social dédié. Des apporteurs sans outil.
              Des photographes invisibles. Des formateurs déconnectés du terrain.
              Chacun dans son coin, chacun sur ses propres plateformes. J&apos;ai
              voulu créer l&apos;endroit qui manquait — celui qui donne à chaque
              acteur la place qu&apos;il mérite.
            </p>
          </div>
        </motion.div>

        {/* Central quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-28 px-4"
        >
          <div className="w-12 h-1 bg-[#C4956A] mx-auto mb-8" />
          <p
            className="text-2xl md:text-4xl lg:text-5xl text-white leading-[1.3] tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            On ne veut pas juste créer une application.
            <br />
            On veut{" "}
            <em className="italic text-[#C4956A]">changer la manière</em>
            <br />
            dont l&apos;immobilier{" "}
            <em className="italic text-[#C4956A]">connecte les gens.</em>
          </p>
          <div className="w-12 h-1 bg-[#C4956A] mx-auto mt-8" />
        </motion.div>

        {/* Jean-Pierre - text left, photo right */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 mb-28"
        >
          <div className="flex-1 text-center md:text-right">
            <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">Co-fondateur & COO</p>
            <h3 className="text-white text-3xl md:text-4xl font-semibold mb-5 tracking-tight">Jean-Pierre Medard Garza</h3>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4">
              Quand Léonard m&apos;a parlé d&apos;E-Dome, je n&apos;ai pas vu un
              projet tech. J&apos;ai vu une opportunité de construire quelque chose
              de juste. Un endroit où le travail de chacun est reconnu, où les
              commissions sont claires, où un apporteur a autant de valeur
              qu&apos;une agence.
            </p>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Ma formation en commerce et ma rigueur opérationnelle servent
              un seul objectif : que chaque décision fasse grandir l&apos;écosystème
              dans la durée. Pas de raccourcis, pas de promesses creuses. Un plan
              solide, des partenaires de confiance, et la certitude que le terrain
              a toujours raison.
            </p>
          </div>
          <div className="w-48 md:w-64 shrink-0">
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
