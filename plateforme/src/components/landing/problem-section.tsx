"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Clock, ArrowLeftRight, Brain } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextEffect } from "@/components/ui/text-effect";
import { ArchBackground } from "@/components/landing/arch-background";
import DotPattern from "@/components/ui/dot-pattern";
import { useLandingLang } from "@/components/landing/landing-i18n";

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

export function ProblemSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const stats = [
    {
      icon: ArrowLeftRight,
      iconColor: "text-blue-400/70",
      iconBg: "bg-blue-400/10",
      light: true,
      value: t("problem.stat1_value"),
      numValue: 12,
      numSuffix: "",
      unit: t("problem.stat1_unit"),
      description: t("problem.stat1_desc"),
      source: t("problem.stat1_source"),
    },
    {
      icon: Clock,
      iconColor: "text-amber-400/70",
      iconBg: "bg-amber-400/10",
      light: "beige",
      value: t("problem.stat2_value"),
      numValue: 40,
      numSuffix: "%",
      unit: t("problem.stat2_unit"),
      description: t("problem.stat2_desc"),
      source: t("problem.stat2_source"),
    },
    {
      icon: Brain,
      iconColor: "text-purple-400/70",
      iconBg: "bg-purple-400/10",
      light: "beige",
      value: t("problem.stat3_value"),
      numValue: 23,
      numSuffix: " min",
      unit: t("problem.stat3_unit"),
      description: t("problem.stat3_desc"),
      source: t("problem.stat3_source"),
    },
    {
      icon: AlertTriangle,
      iconColor: "text-red-400/70",
      iconBg: "bg-red-400/10",
      light: true,
      value: t("problem.stat4_value"),
      numValue: 67,
      numSuffix: "%",
      unit: t("problem.stat4_unit"),
      description: t("problem.stat4_desc"),
      source: t("problem.stat4_source"),
    },
  ];

  return (
    <section ref={ref} className="bg-black py-16 md:py-40 px-6 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      <ArchBackground variant="floorplan" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-10 md:mb-24">
          <TextEffect per="word" preset="slide" delay={0} trigger={inView}
            className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-4">
            {t("problem.label")}
          </TextEffect>
          <TextEffect per="word" preset="scale" delay={0.2} trigger={inView}
            as="h2"
            className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8">
            {`${t("problem.title1")} ${t("problem.title2")}`}
          </TextEffect>
          <BlurFade delay={0.3} inView><p className="text-white/45 text-base md:text-lg max-w-3xl leading-relaxed">
            {t("problem.desc")}
          </p></BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.value}
                initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className="relative border border-red-500/50 hover:border-red-500/70 transition-colors overflow-hidden"
                style={{ background: "rgba(20, 10, 10, 0.9)" }}>
                <DotPattern width={5} height={5} className="fill-red-500/10" />

                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-red-500" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-red-500" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-red-500" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-red-500" />

                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`rounded-full p-2.5 ${stat.iconBg} shrink-0`}>
                      <Icon size={18} className={stat.iconColor} />
                    </div>
                    <div>
                      <p className="text-white text-3xl md:text-4xl font-semibold tracking-tight">
                        <CountUpStat target={stat.numValue} suffix={stat.numSuffix} inView={inView} />
                        <span className="text-white/30 text-base ml-2 font-normal">{stat.unit}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{stat.description}</p>
                  <p className="text-white/25 text-xs italic">{stat.source}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center">
          <div className="rounded-2xl md:rounded-full inline-flex items-center gap-3 px-5 md:px-8 py-4 border-2 border-emerald-500/40" style={{ background: "rgba(15, 30, 15, 0.85)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-white/60 text-sm">
              {t("problem.pill")}{" "}
              <span className="text-emerald-400 font-medium">{t("problem.pill_bold")}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
