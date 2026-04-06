"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, Wallet, GraduationCap, Camera, Scale, Landmark, Briefcase } from "lucide-react";

const roles = [
  { icon: Building2, label: "Hôte" },
  { icon: Users, label: "Agence" },
  { icon: Wallet, label: "Investisseur" },
  { icon: GraduationCap, label: "Formateur" },
  { icon: Briefcase, label: "Apporteur" },
  { icon: Camera, label: "Photographe" },
  { icon: Scale, label: "Courtier" },
  { icon: Landmark, label: "Notaire" },
];

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="bg-black pt-32 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      {/* Architectural background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-8"
        >
          Notre vision
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-12"
        >
          Chaque acteur de l&apos;immobilier{" "}
          <em className="not-italic text-white/60" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
            mérite sa place.
          </em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16"
        >
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            E-Dome n&apos;est pas une énième plateforme immobilière. C&apos;est un
            écosystème complet où chaque professionnel — hôte, agent, promoteur,
            photographe, courtier, notaire, architecte, formateur — dispose d&apos;un
            espace adapté à son métier. Un profil unique, interchangeable, qui
            s&apos;adapte à votre rôle du moment.
          </p>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Au cœur du système : un modèle de commissions transparent qui
            rémunère chaque acteur de la chaîne. L&apos;apporteur d&apos;affaires
            touche sa commission, le formateur monétise son expertise, l&apos;hôte
            gère ses réservations, l&apos;investisseur analyse ses rendements —
            tout depuis une interface unique.
          </p>
        </motion.div>

        {/* Roles grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-white/30 text-xs tracking-widest uppercase mb-6">
            13 profils métiers — un seul compte
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.label} className="liquid-glass rounded-2xl p-4 text-center group hover:bg-white/5 transition-colors">
                  <Icon size={20} className="text-white/40 mx-auto mb-2 group-hover:text-white/70 transition-colors" />
                  <p className="text-white/50 text-xs group-hover:text-white/80 transition-colors">{role.label}</p>
                </div>
              );
            })}
          </div>
          <p className="text-white/20 text-xs mt-3">
            + Client, Agent, Promoteur, Architecte, Admin
          </p>
        </motion.div>
      </div>
    </section>
  );
}
