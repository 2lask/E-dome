"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Clock, ArrowLeftRight, Brain } from "lucide-react";

function CountUpStat({ target, suffix = "", inView }: { target: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) setStarted(true);
  }, [inView, started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return <>{started ? count : 0}{suffix}</>;
}

const stats = [
  {
    icon: ArrowLeftRight,
    iconColor: "text-blue-400/70",
    iconBg: "bg-blue-400/10",
    light: true,
    value: "12",
    numValue: 12,
    numSuffix: "",
    unit: "outils en moyenne",
    description: "Un professionnel de l'immobilier utilise en moyenne une douzaine d'outils différents pour gérer son activité : annonces, réservations, comptabilité, communication, formation, prospection.",
    source: "McKinsey Global Institute — Real Estate Technology Adoption, 2024",
  },
  {
    icon: Clock,
    iconColor: "text-amber-400/70",
    iconBg: "bg-amber-400/10",
    light: "beige",
    value: "40%",
    numValue: 40,
    numSuffix: "%",
    unit: "du temps en friction",
    description: "Près de la moitié du temps de travail des agents et gestionnaires immobiliers est consacré à des tâches administratives et à la navigation entre plateformes déconnectées.",
    source: "National Association of Realtors — Technology Report, 2024",
  },
  {
    icon: Brain,
    iconColor: "text-purple-400/70",
    iconBg: "bg-purple-400/10",
    light: "beige",
    value: "23 min",
    numValue: 23,
    numSuffix: " min",
    unit: "pour se reconcentrer",
    description: "Chaque interruption ou changement d'application nécessite en moyenne 23 minutes et 15 secondes pour retrouver un niveau de concentration équivalent.",
    source: "University of California, Irvine — Gloria Mark et al., 2023",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-red-400/70",
    iconBg: "bg-red-400/10",
    light: true,
    value: "67%",
    numValue: 67,
    numSuffix: "%",
    unit: "d'abandons en ligne",
    description: "Deux tiers des parcours d'achat ou de réservation immobilière en ligne sont abandonnés lorsque l'utilisateur doit quitter la plateforme en cours de route pour compléter une étape ailleurs.",
    source: "JLL — Digital Buyer Journey Report, 2024",
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-16 md:mb-24">
          <p className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-4">Le constat</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8">
            Un secteur{" "}
            <em className="not-italic text-[#C4956A]/40" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
              dispersé.
            </em>
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-3xl leading-relaxed">
            Pour chercher un bien, un site. Pour réserver, un autre. Pour se former, encore
            un autre. Pour trouver un prestataire, un annuaire. Pour suivre ses
            commissions, un tableur. Chaque étape renvoie vers un outil différent —
            et à chaque transition, on perd du temps, de la concentration et des
            opportunités. Le parcours immobilier actuel est une succession de
            ruptures qui coûte cher à tous les acteurs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.value}
                initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className={`rounded-3xl p-6 md:p-8 border-2 transition-colors ${
                  stat.light === true
                    ? "border-[#C4956A]/60 hover:border-[#C4956A]/80"
                    : "border-[#C4956A]/40 hover:border-[#C4956A]/60"
                }`}
                style={{
                  background: stat.light === true
                    ? "rgba(255, 255, 255, 0.92)"
                    : stat.light === "beige"
                    ? "rgba(196, 149, 106, 0.15)"
                    : undefined,
                }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`rounded-full p-2.5 ${stat.iconBg} shrink-0`}>
                    <Icon size={18} className={stat.iconColor} />
                  </div>
                  <div>
                    <p className={`text-3xl md:text-4xl font-semibold tracking-tight ${stat.light === true ? "text-black" : "text-white"}`}>
                      <CountUpStat target={stat.numValue} suffix={stat.numSuffix} inView={inView} />
                      <span className={`text-base ml-2 font-normal ${stat.light === true ? "text-black/40" : "text-white/30"}`}>{stat.unit}</span>
                    </p>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed mb-3 ${stat.light === true ? "text-black/60" : "text-white/60"}`}>{stat.description}</p>
                <p className={`text-xs italic ${stat.light === true ? "text-black/30" : "text-white/25"}`}>{stat.source}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center">
          <div className="rounded-full inline-flex items-center gap-3 px-8 py-4 border-2 border-[#C4956A]/50" style={{ background: "rgba(196, 149, 106, 0.15)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-white/80 text-sm">
              E-Dome rassemble tout en un seul endroit.{" "}
              <span className="text-white font-medium">Zéro friction, zéro dispersion.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
