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
            <p className="text-white/50 text-xs tracking-widest uppercase mb-3 font-medium">Co-fondateur & COO</p>
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
            <div className="aspect-square rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              <img src="/images/founders/jeanpierre.jpg" alt="Jean-Pierre Medard Garza" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Conviction block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="rounded-3xl p-8 md:p-14 border-2 border-[#C4956A]/15 text-center"
          style={{ background: "rgba(196, 149, 106, 0.03)" }}
        >
          <h3 className="text-white text-xl md:text-2xl font-semibold mb-6">
            Ce n&apos;est pas notre plateforme.
            <span className="text-[#C4956A]"> C&apos;est la vôtre.</span>
          </h3>
          <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-4">
            Chaque agent, chaque investisseur, chaque photographe, chaque
            formateur qui manifeste son intérêt aujourd&apos;hui ne rejoint pas
            une liste d&apos;attente. Il influence directement ce que sera E-Dome
            demain. Vos retours façonnent le produit. Vos besoins définissent
            les priorités. Votre expertise nourrit l&apos;écosystème.
          </p>
          <p className="text-white/45 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            L&apos;immobilier de demain ne sera pas dicté par la technologie.
            Il sera construit par les gens qui le vivent chaque jour.
            Et ces gens, c&apos;est vous.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="/images/founders/leonard.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-[#C4956A]/30 object-cover" />
            <img src="/images/founders/jeanpierre.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-white/15 object-cover -ml-3" />
            <span className="text-white/30 text-xs ml-3">Membres fondateurs #1 & #2</span>
          </div>

          <Link href="/feed" className="inline-flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-8 py-4 text-sm font-semibold hover:bg-[#d4a57a] transition-colors">
            Faire partie de l&apos;histoire <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
