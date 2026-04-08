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
                Aujourd&apos;hui, un agent et un photographe ne se croisent
                que par hasard. Un apporteur d&apos;affaires n&apos;a aucun moyen
                de prouver sa valeur. Un formateur partage son savoir sur
                des plateformes qui n&apos;ont rien à voir avec l&apos;immobilier.
                Nous refusons que ça continue.
              </p>
            </div>

            {/* Right card */}
            <div className="rounded-2xl p-7 md:p-9 border-2 border-white/8" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-4 font-medium">Notre engagement</p>
              <p
                className="text-white text-xl md:text-2xl leading-[1.3] mb-5 tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Chaque personne qui nous rejoint ne devient pas un{" "}
                <em className="italic text-white/50">utilisateur.</em>
                {" "}Elle devient un{" "}
                <em className="italic text-[#C4956A]">architecte</em> de ce qui vient.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                E-Dome se construit avec le terrain, pas derrière un écran.
                Vos retours, vos idées, votre expertise métier façonnent
                chaque fonctionnalité. Les premiers à croire en ce projet
                ne seront pas oubliés — ils seront ceux qui l&apos;auront rendu
                possible.
              </p>
            </div>
          </div>

          {/* CTA block */}
          <div className="rounded-2xl p-8 md:p-10 border-2 border-[#C4956A]/15 text-center" style={{ background: "rgba(196, 149, 106, 0.03)" }}>
            <p
              className="text-white text-xl md:text-2xl leading-[1.4] tracking-tight mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              L&apos;immobilier de demain ne se fera pas seul.
              <br />
              Il se fera{" "}
              <em className="italic text-[#C4956A]">ensemble.</em>
            </p>
            <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Chaque acteur qui croit en ce projet apporte plus qu&apos;un
              soutien — il apporte son regard, son expérience, sa réalité
              du terrain. C&apos;est cette intelligence collective qui fera
              d&apos;E-Dome quelque chose que personne n&apos;a encore construit.
              Une nouvelle ère de l&apos;immobilier commence ici, et elle a
              besoin de vous pour prendre forme.
            </p>
            <Link href="/feed" className="inline-flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-8 py-4 text-sm font-semibold hover:bg-[#d4a57a] transition-colors">
              Découvrir ce qu&apos;on construit <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
