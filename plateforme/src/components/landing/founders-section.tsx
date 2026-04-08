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
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,149,106,0.04)_0%,_transparent_60%)]" />
      <ArchBackground variant="building" />

      <div className="max-w-5xl mx-auto relative">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-[#C4956A] text-sm tracking-widest uppercase mb-6 font-medium">
            Ceux qui bâtissent E-Dome
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Ce projet, c&apos;est{" "}
            <em className="italic text-[#C4956A]/70">le nôtre.</em>
            <br />
            Bientôt, ce sera{" "}
            <em className="italic text-[#C4956A]/70">le vôtre.</em>
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            E-Dome n&apos;a pas été imaginé dans une salle de réunion. Il est né
            d&apos;un vécu, d&apos;une frustration réelle et d&apos;une conviction profonde :
            l&apos;immobilier mérite mieux que ce qui existe aujourd&apos;hui.
          </p>
        </motion.div>

        {/* Founders portraits + story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 mb-20">

          {/* Léonard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="relative mb-6">
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#C4956A]/20">
                <img
                  src="/images/founders/leonard.jpg"
                  alt="Léonard Ansermet"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-3xl" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-1 font-medium">Fondateur & CEO</p>
                <h3 className="text-white text-2xl md:text-3xl font-semibold">Léonard Ansermet</h3>
              </div>
            </div>

            <div className="px-2">
              <p className="text-white/80 text-base leading-relaxed mb-5">
                Tout a commencé par une réalité simple : Léonard faisait ses
                premières transactions immobilières de bouche à oreille, en
                connectant les bonnes personnes au bon moment. Apporteur
                d&apos;affaires sans structure, sans outil, sans visibilité.
                À chaque deal conclu, la même question revenait :
              </p>
              <blockquote className="border-l-2 border-[#C4956A]/40 pl-5 mb-5">
                <p className="text-white text-lg md:text-xl italic leading-relaxed"
                  style={{ fontFamily: "'Instrument Serif', serif" }}>
                  &ldquo;Pourquoi est-ce qu&apos;aucune plateforme ne me donne
                  ma place ? Pourquoi l&apos;apporteur, le photographe, le
                  formateur sont-ils invisibles dans cet écosystème ?&rdquo;
                </p>
              </blockquote>
              <p className="text-white/70 text-sm leading-relaxed">
                Ce n&apos;était pas juste un manque d&apos;outil — c&apos;était un manque
                de connexion humaine. Un secteur où chaque acteur travaille seul,
                où les commissions sont opaques, où les opportunités se perdent
                entre les mailles de plateformes qui ne se parlent pas. Léonard
                a décidé de dessiner, page par page, la plateforme qu&apos;il
                aurait voulu avoir dès le premier jour.
              </p>
            </div>
          </motion.div>

          {/* Jean-Pierre */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative mb-6">
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/10">
                <img
                  src="/images/founders/jeanpierre.jpg"
                  alt="Jean-Pierre Medard Garza"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-3xl" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-white/50 text-xs tracking-widest uppercase mb-1 font-medium">Co-fondateur & COO</p>
                <h3 className="text-white text-2xl md:text-3xl font-semibold">Jean-Pierre Medard Garza</h3>
              </div>
            </div>

            <div className="px-2">
              <p className="text-white/80 text-base leading-relaxed mb-5">
                Quand Léonard lui a présenté l&apos;idée, Jean-Pierre n&apos;a pas
                hésité une seconde. Diplômé d&apos;un CFC d&apos;employé de commerce
                avec maturité professionnelle, il apporte ce que chaque projet
                ambitieux exige : la rigueur, la structure, la capacité de
                transformer une vision en plan d&apos;action concret.
              </p>
              <blockquote className="border-l-2 border-white/20 pl-5 mb-5">
                <p className="text-white text-lg md:text-xl italic leading-relaxed"
                  style={{ fontFamily: "'Instrument Serif', serif" }}>
                  &ldquo;Un bon produit ne suffit pas. Il faut des partenaires
                  solides, un modèle viable et une exécution irréprochable.
                  C&apos;est ce que je construis chaque jour pour E-Dome.&rdquo;
                </p>
              </blockquote>
              <p className="text-white/70 text-sm leading-relaxed">
                Jean-Pierre structure le business, noue les partenariats, pilote
                les opérations. Sa formation commerciale et son sens du terrain
                sont le socle sur lequel E-Dome se construit. Chaque décision
                passe par son filtre : est-ce durable ? Est-ce que ça sert
                l&apos;écosystème dans son ensemble ?
              </p>
            </div>
          </motion.div>
        </div>

        {/* Message to the community */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="rounded-3xl p-8 md:p-12 border-2 border-[#C4956A]/20 text-center mb-12"
          style={{ background: "rgba(196, 149, 106, 0.04)" }}
        >
          <div className="w-12 h-1 bg-[#C4956A] mx-auto mb-8" />
          <h3 className="text-white text-2xl md:text-3xl font-semibold mb-6 tracking-tight">
            Vous n&apos;êtes pas un utilisateur.
            <br />
            <span className="text-[#C4956A]">Vous êtes un bâtisseur.</span>
          </h3>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            E-Dome ne se construit pas dans un bureau fermé. Il se construit avec
            vous — les agents, les hôtes, les investisseurs, les formateurs, les
            apporteurs, les photographes, les courtiers. Chaque personne qui rejoint
            le projet aujourd&apos;hui ne se contente pas d&apos;utiliser une plateforme :
            elle contribue à redéfinir la façon dont l&apos;immobilier fonctionne.
          </p>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            Les premiers à manifester leur intérêt ne sont pas de simples early
            adopters. Ce sont les architectes d&apos;un nouvel écosystème. Ce sont
            ceux qui, dans cinq ans, pourront dire : &ldquo;J&apos;en faisais partie
            depuis le début.&rdquo;
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex -space-x-3">
              <img src="/images/founders/leonard.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
              <img src="/images/founders/jeanpierre.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
            </div>
            <p className="text-white/40 text-sm">
              Membres fondateurs #1 & #2
            </p>
          </div>

          <Link href="/feed" className="inline-flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-8 py-3.5 text-sm font-semibold hover:bg-[#d4a57a] transition-colors">
            Rejoindre le mouvement <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
