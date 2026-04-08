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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,149,106,0.04)_0%,_transparent_60%)]" />
      <ArchBackground variant="building" />

      <div className="max-w-5xl mx-auto relative">

        {/* Manifesto opening */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-24 md:mb-32"
        >
          <div className="w-16 h-1 bg-[#C4956A] mb-10" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-white leading-[1.2] tracking-tight mb-8">
            L&apos;immobilier est un secteur à des milliards.
            <br />
            <span className="text-[#C4956A]">Mais il fonctionne encore comme il y a 20 ans.</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl">
            Des acteurs isolés. Des outils qui ne communiquent pas. Des commissions
            sans transparence. Des talents invisibles. Nous refusons d&apos;accepter
            que ça continue. Alors nous construisons autre chose — pas une
            plateforme de plus, mais le socle d&apos;un immobilier nouveau.
          </p>
        </motion.div>

        {/* Photos + identities */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          {/* Léonard */}
          <div className="relative group">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border-2 border-[#C4956A]/15 group-hover:border-[#C4956A]/30 transition-colors">
              <img src="/images/founders/leonard.jpg" alt="Léonard Ansermet" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-2 font-medium">Fondateur & CEO</p>
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3">Léonard Ansermet</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Vision produit · UX/UI · Stratégie de lancement
              </p>
            </div>
          </div>

          {/* Jean-Pierre */}
          <div className="relative group">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white/8 group-hover:border-white/15 transition-colors">
              <img src="/images/founders/jeanpierre.jpg" alt="Jean-Pierre Medard Garza" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-2 font-medium">Co-fondateur & COO</p>
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3">Jean-Pierre Medard Garza</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Business Dev · Opérations · Partenariats
              </p>
            </div>
          </div>
        </motion.div>

        {/* The WHY - emotional story */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-5 font-medium">Pourquoi on fait ça</p>
              <p className="text-white text-base md:text-lg leading-relaxed mb-6">
                Léonard a commencé dans l&apos;immobilier par le plus simple :
                connecter les gens. Apporteur d&apos;affaires de bouche à oreille,
                il mettait en relation acheteurs et vendeurs, concrétisait des
                transactions par la confiance. Pas d&apos;agence, pas de licence —
                juste du terrain et de l&apos;instinct.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Mais à chaque deal, le même constat revenait : les rares outils
                existants sont rudimentaires. L&apos;apporteur n&apos;a pas sa place.
                Le photographe non plus. Ni le formateur, ni le courtier.
                Chaque acteur travaille dans son coin, avec ses propres outils,
                sans jamais croiser les autres. Le secteur ne manque pas d&apos;argent
                — il manque de connexion.
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-5 font-medium">Ce qu&apos;on construit</p>
              <p className="text-white text-base md:text-lg leading-relaxed mb-6">
                Quand Léonard a partagé cette vision avec Jean-Pierre, la réponse
                a été immédiate. Jean-Pierre, formé en commerce avec maturité
                professionnelle, savait exactement ce qu&apos;il fallait faire :
                structurer, chiffrer, exécuter. Transformer l&apos;indignation en
                plan d&apos;action.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Ensemble, ils ne construisent pas un produit. Ils construisent
                une nouvelle façon de penser l&apos;immobilier — un monde où chaque
                acteur a sa place, où chaque contribution est valorisée, où la
                technologie sert enfin les gens du terrain au lieu de les ignorer.
                E-Dome, c&apos;est ce monde-là.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to arms */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <div className="rounded-3xl p-10 md:p-14 border-2 border-[#C4956A]/15" style={{ background: "rgba(196, 149, 106, 0.03)" }}>
            <p
              className="text-3xl md:text-4xl lg:text-5xl text-white leading-[1.2] tracking-tight mb-6"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Chaque acteur qui nous rejoint<br />
              <em className="italic text-[#C4956A]">ne suit pas un mouvement.</em><br />
              <em className="italic text-[#C4956A]">Il le crée.</em>
            </p>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Les premiers à manifester leur intérêt ne sont pas des utilisateurs.
              Ce sont les pionniers d&apos;un changement profond. Ceux qui, demain,
              pourront dire qu&apos;ils ont contribué à redéfinir l&apos;immobilier.
              Votre voix compte. Votre métier compte. Votre place existe — et
              elle vous attend.
            </p>

            <div className="flex items-center justify-center gap-3 mb-8">
              <img src="/images/founders/leonard.jpg" alt="" className="w-11 h-11 rounded-full border-2 border-[#C4956A]/30 object-cover" />
              <img src="/images/founders/jeanpierre.jpg" alt="" className="w-11 h-11 rounded-full border-2 border-white/15 object-cover -ml-4" />
              <span className="text-white/40 text-sm ml-2">Léonard & Jean-Pierre</span>
            </div>

            <Link href="/feed" className="inline-flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-8 py-4 text-base font-semibold hover:bg-[#d4a57a] transition-colors">
              Faire partie de l&apos;histoire <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
