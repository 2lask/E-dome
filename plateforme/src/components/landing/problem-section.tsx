"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useLandingLang } from "@/components/landing/landing-i18n";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
};

function CountUpStat({ target, suffix = "", inView }: { target: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => { if (inView && !started) setStarted(true); }, [inView, started]);
  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);
  return <>{started ? count : 0}{suffix}</>;
}

const stats = [
  { num: 12, suffix: "", labelKey: "problem.stat1_unit", descKey: "problem.stat1_desc" },
  { num: 40, suffix: "%", labelKey: "problem.stat2_unit", descKey: "problem.stat2_desc" },
  { num: 23, suffix: " min", labelKey: "problem.stat3_unit", descKey: "problem.stat3_desc" },
  { num: 67, suffix: "%", labelKey: "problem.stat4_unit", descKey: "problem.stat4_desc" },
];

export function ProblemSection() {
  const { t } = useLandingLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative bg-white py-24 md:py-40 px-6 overflow-hidden">
      <div className="grid-12 grid grid-cols-12 gap-8 relative">
        <div className="col-span-12 md:col-span-8 md:col-start-3">
        {/* Header */}
        <motion.p {...fadeUp} transition={{ duration: 0.6 }}
          className="text-[#1262b3] text-xs font-bold tracking-widest uppercase mb-6">
          {t("problem.label")}
        </motion.p>
        <motion.h2 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[clamp(2.2rem,5vw,4rem)] text-[#1a1a1a] leading-[1.05] tracking-tight mb-6">
          {t("problem.title1")}{" "}
          <span className="italic text-[#1262b3]">{t("problem.title2")}</span>
        </motion.h2>
        <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#6b7280] text-base leading-relaxed mb-16 md:mb-24">
          {t("problem.desc")}
        </motion.p>

        {/* Editorial numbered list */}
        <div className="space-y-0">
          {stats.map((s, i) => (
            <motion.div
              key={s.labelKey}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="grid grid-cols-[3rem_1fr] gap-6 py-8 border-t border-[#e5e7eb] items-start"
            >
              <span className="text-[#1262b3] text-[clamp(2.2rem,5vw,4rem)] font-bold leading-none tabular-nums">
                <CountUpStat target={s.num} suffix={s.suffix} inView={inView} />
              </span>
              <div className="pt-2">
                <p className="text-[#1a1a1a] text-sm font-bold uppercase tracking-widest mb-2">
                  {t(s.labelKey)}
                </p>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  {t(s.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-[#e5e7eb]" />
        </div>

        {/* Closing line */}
        <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-[#1262b3] text-sm font-bold tracking-widest uppercase">
          {t("problem.pill")} {t("problem.pill_bold")}
        </motion.p>
        </div>      </div>
    </section>
  );
}
