"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevenueCard {
  title: string;
  percentage: string;
  percentageNum: number;
  suffix: string;
  share: string;
  detail: string;
  icon: React.ReactNode;
  barColor: string;
}

/* ---------- SVG Icons for each card ---------- */
const TransactionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="22" height="16" rx="3" stroke="url(#txGrad)" strokeWidth="1.5" />
    <line x1="3" y1="12" x2="25" y2="12" stroke="url(#txGrad)" strokeWidth="1.5" />
    <rect x="6" y="16" width="6" height="2" rx="1" fill="url(#txGrad)" opacity="0.6" />
    <defs>
      <linearGradient id="txGrad" x1="0" y1="0" x2="28" y2="28">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
    </defs>
  </svg>
);

const ServicesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="10" stroke="url(#svcGrad)" strokeWidth="1.5" />
    <path d="M14 8v6l4 3" stroke="url(#svcGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="6" r="3" fill="url(#svcGrad)" opacity="0.4" />
    <defs>
      <linearGradient id="svcGrad" x1="0" y1="0" x2="28" y2="28">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
    </defs>
  </svg>
);

const FormationsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4L3 10l11 6 11-6-11-6z" stroke="url(#eduGrad)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 13v6c0 0 3 4 7 4s7-4 7-4v-6" stroke="url(#eduGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="25" y1="10" x2="25" y2="20" stroke="url(#eduGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="eduGrad" x1="0" y1="0" x2="28" y2="28">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
    </defs>
  </svg>
);

const PremiumIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3l3.5 7 7.5 1-5.5 5.2L20.8 24 14 20.2 7.2 24l1.3-7.8L3 11l7.5-1L14 3z" stroke="url(#starGrad)" strokeWidth="1.5" strokeLinejoin="round" />
    <defs>
      <linearGradient id="starGrad" x1="0" y1="0" x2="28" y2="28">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
    </defs>
  </svg>
);

/* ---------- Revenue Flow SVG ---------- */
const RevenueFlowSVG = () => (
  <svg
    className="mx-auto my-2 w-full max-w-md"
    viewBox="0 0 400 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Client label */}
    <rect x="10" y="15" width="80" height="30" rx="8" fill="#ffe0c2" fillOpacity="0.12" stroke="#ffe0c2" strokeWidth="1" />
    <text x="50" y="35" textAnchor="middle" fill="#ffe0c2" fontSize="11" fontWeight="600" fontFamily="inherit">Client</text>

    {/* Arrow 1 */}
    <line x1="95" y1="30" x2="145" y2="30" stroke="url(#flowGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points="145,25 155,30 145,35" fill="#ffe0c2" />

    {/* E-Dome label */}
    <rect x="158" y="10" width="84" height="40" rx="10" fill="url(#flowBoxGrad)" fillOpacity="0.18" stroke="url(#flowGrad)" strokeWidth="1.5" />
    <text x="200" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="inherit">E-Dome</text>

    {/* Arrow 2 */}
    <line x1="247" y1="30" x2="297" y2="30" stroke="url(#flowGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points="297,25 307,30 297,35" fill="#ffdfb5" />

    {/* Host label */}
    <rect x="310" y="15" width="80" height="30" rx="8" fill="#ffdfb5" fillOpacity="0.12" stroke="#ffdfb5" strokeWidth="1" />
    <text x="350" y="35" textAnchor="middle" fill="#ffdfb5" fontSize="11" fontWeight="600" fontFamily="inherit">Hôte</text>

    {/* Commission label above center */}
    <text x="200" y="7" textAnchor="middle" fill="white" fillOpacity="0.35" fontSize="9" fontFamily="inherit">commission</text>

    <defs>
      <linearGradient id="flowGrad" x1="0" y1="0" x2="400" y2="0">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
      <linearGradient id="flowBoxGrad" x1="158" y1="10" x2="242" y2="50">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
    </defs>
  </svg>
);

/* ---------- Mini bar chart SVG ---------- */
const RevenueBarChart = ({ inView }: { inView: boolean }) => {
  const bars = [
    { label: "Transactions", pct: 70, color: "#ffe0c2" },
    { label: "Services", pct: 15, color: "#ffd9a0" },
    { label: "Formations", pct: 10, color: "#ffd090" },
    { label: "Premium", pct: 5, color: "#ffdfb5" },
  ];
  const barMaxH = 100;
  const barW = 44;
  const gap = 28;
  const totalW = bars.length * barW + (bars.length - 1) * gap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6, duration: 0.7 }}
      className="mx-auto mt-14 flex flex-col items-center"
    >
      <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white/40">
        Répartition des revenus
      </h4>
      <svg
        width={totalW + 40}
        height={barMaxH + 50}
        viewBox={`0 0 ${totalW + 40} ${barMaxH + 50}`}
        className="overflow-visible"
      >
        {bars.map((bar, i) => {
          const x = 20 + i * (barW + gap);
          const h = (bar.pct / 100) * barMaxH;
          const y = barMaxH - h;
          return (
            <g key={bar.label}>
              {/* bar bg */}
              <rect
                x={x}
                y={0}
                width={barW}
                height={barMaxH}
                rx={6}
                fill="white"
                fillOpacity="0.03"
              />
              {/* animated bar */}
              <motion.rect
                x={x}
                width={barW}
                rx={6}
                fill={bar.color}
                fillOpacity="0.7"
                initial={{ y: barMaxH, height: 0 }}
                animate={inView ? { y, height: h } : { y: barMaxH, height: 0 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: "easeOut" }}
              />
              {/* pct label */}
              <motion.text
                x={x + barW / 2}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="700"
                initial={{ y: barMaxH - 4, opacity: 0 }}
                animate={inView ? { y: y - 6, opacity: 1 } : { y: barMaxH - 4, opacity: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
              >
                {bar.pct}%
              </motion.text>
              {/* label */}
              <text
                x={x + barW / 2}
                y={barMaxH + 16}
                textAnchor="middle"
                fill="white"
                fillOpacity="0.35"
                fontSize="9"
                fontWeight="500"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};

/* ---------- Data ---------- */
const revenueCards: RevenueCard[] = [
  {
    title: "Commissions Transactions",
    percentage: "70",
    percentageNum: 70,
    suffix: "%",
    share: "70% des revenus",
    detail:
      "Revenus optimis\u00e9s sur chaque transaction \u00B7 Commission transparente pr\u00e9lev\u00e9e c\u00f4t\u00e9 plateforme \u00B7 Z\u00e9ro frais cach\u00e9s pour l\u2019h\u00f4te",
    icon: <TransactionIcon />,
    barColor: "#ffe0c2",
  },
  {
    title: "Services & Options",
    percentage: "15",
    percentageNum: 15,
    suffix: "%",
    share: "15% des revenus",
    detail:
      "Commission transparente sur les services additionnels \u00B7 L\u2019h\u00f4te conserve la majorit\u00e9 de ses revenus",
    icon: <ServicesIcon />,
    barColor: "#ffd9a0",
  },
  {
    title: "Formations & \u00c9v\u00e9nements",
    percentage: "10",
    percentageNum: 10,
    suffix: "%",
    share: "10% des revenus",
    detail:
      "Revenus optimis\u00e9s pour les formateurs \u00B7 Commission transparente sur cours et s\u00e9minaires",
    icon: <FormationsIcon />,
    barColor: "#ffd090",
  },
  {
    title: "Abonnements Premium",
    percentage: "5-15",
    percentageNum: 15,
    suffix: "%",
    share: "5\u219215% des revenus",
    detail:
      "Agences : 99-299 CHF/mois \u00B7 Statistiques avanc\u00e9es, CRM, visibilit\u00e9 boost\u00e9e",
    icon: <PremiumIcon />,
    barColor: "#ffdfb5",
  },
];

/* ---------- AnimatedNumber ---------- */
function AnimatedNumber({
  target,
  isRange,
  inView,
}: {
  target: number;
  isRange: boolean;
  inView: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCurrent(start);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, inView]);

  if (isRange) {
    const low = Math.max(0, Math.round((current / target) * 5));
    return (
      <span>
        {low}-{current}%
      </span>
    );
  }

  return <span>{current}%</span>;
}

/* ---------- Variants ---------- */
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

/* ---------- Checkmark icon ---------- */
const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block mr-2 -mt-0.5">
    <circle cx="12" cy="12" r="10" stroke="url(#checkGrad)" strokeWidth="1.5" />
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="url(#checkGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="checkGrad" x1="0" y1="0" x2="24" y2="24">
        <stop stopColor="#ffe0c2" />
        <stop offset="1" stopColor="#ffdfb5" />
      </linearGradient>
    </defs>
  </svg>
);

/* ========== COMPONENT ========== */
export default function MonetizationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="monetization"
      ref={sectionRef}
      className="relative bg-[#111111] py-24 px-4 md:px-8"
    >
      {/* Subtle grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-[#ffe0c2]/5 blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-[#ffdfb5]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70 backdrop-blur-sm">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
            Mod&egrave;le &Eacute;conomique
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Quatre sources de revenus.{" "}
            <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
              Un mod&egrave;le durable.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Un mod&egrave;le de double mon&eacute;tisation transparent : commission plateforme
            + frais optionnels client, partag&eacute;s &eacute;quitablement.
          </p>
        </motion.div>

        {/* Revenue Flow Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-14"
        >
          <RevenueFlowSVG />
        </motion.div>

        {/* Horizontal measurement line with ticks - above cards */}
        <div className="pointer-events-none relative mb-4 hidden lg:block">
          <div className="h-px w-full bg-white/[0.04]" />
          {Array.from({ length: 21 }).map((_, i) => (
            <div
              key={`tick-top-${i}`}
              className="absolute top-0 w-px bg-white/[0.06]"
              style={{ left: `${i * 5}%`, height: i % 5 === 0 ? '8px' : '4px', transform: 'translateY(-50%)' }}
            />
          ))}
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {revenueCards.map((card, idx) => (
            <motion.div
              key={card.title}
              custom={idx}
              variants={cardVariants}
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: "easeOut" as const, delay: idx * 0.15 }}
              className="group relative"
            >
              {/* Gradient border reveal on hover */}
              <div
                className={cn(
                  "absolute -inset-[1px] rounded-2xl opacity-0 blur-[0.5px] transition-opacity duration-500 group-hover:opacity-100",
                  "bg-gradient-to-br from-[#ffe0c2] via-[#ffdfb5] to-[#ffe0c2]"
                )}
              />

              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#201e18] bg-[#191919]/80 p-6 backdrop-blur-sm",
                  "transition-all duration-500 group-hover:border-transparent group-hover:shadow-[0_0_50px_-12px_rgba(255,224,194,0.2)]"
                )}
              >
                {/* Icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                  {card.icon}
                </div>

                {/* Percentage display - larger with glow */}
                <div className="relative mb-6 flex items-baseline gap-1">
                  {/* Glow behind number */}
                  <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-r from-[#ffe0c2]/15 to-[#ffdfb5]/15 blur-2xl" />
                  <span className="relative bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-6xl font-black tracking-tight text-transparent md:text-7xl drop-shadow-[0_0_30px_rgba(255,224,194,0.3)]">
                    <AnimatedNumber
                      target={card.percentageNum}
                      isRange={card.percentage.includes("-")}
                      inView={isInView}
                    />
                  </span>
                </div>

                {/* Share badge */}
                <span className="mb-4 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
                  {card.share}
                </span>

                {/* Title */}
                <h3 className="mb-3 text-lg font-bold text-white">
                  {card.title}
                </h3>

                {/* Detail */}
                <p className="mt-auto text-sm leading-relaxed text-neutral-400">
                  {card.detail}
                </p>

                {/* Bottom gradient line on hover */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] transition-all duration-700 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Horizontal measurement line with ticks - below cards */}
        <div className="pointer-events-none relative mt-4 hidden lg:block">
          <div className="h-px w-full bg-white/[0.04]" />
          {Array.from({ length: 21 }).map((_, i) => (
            <div
              key={`tick-bot-${i}`}
              className="absolute top-0 w-px bg-white/[0.06]"
              style={{ left: `${i * 5}%`, height: i % 5 === 0 ? '8px' : '4px', transform: 'translateY(-50%)' }}
            />
          ))}
        </div>

        {/* Revenue Distribution Bar Chart */}
        <RevenueBarChart inView={isInView} />

        {/* Key message box - enhanced with gradient border & checkmark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-14"
        >
          {/* Outer gradient border wrapper */}
          <div className="rounded-2xl bg-gradient-to-r from-[#ffe0c2] via-[#ffdfb5] to-[#ffe0c2] p-[1.5px]">
            <div
              className={cn(
                "relative overflow-hidden rounded-[calc(1rem-1.5px)] bg-[#191919]/95 p-8 text-center backdrop-blur-sm",
                "md:p-12"
              )}
            >
              {/* Subtle gradient background */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#ffe0c2]/8 via-transparent to-[#ffdfb5]/8" />

              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-64 rounded-full bg-gradient-to-r from-[#ffe0c2]/10 to-[#ffdfb5]/10 blur-3xl" />
              </div>

              <p className="relative z-10 text-lg font-medium leading-relaxed text-white/80 md:text-xl">
                <CheckCircleIcon />
                <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-xl font-extrabold text-transparent md:text-2xl">
                  Gardez davantage de vos revenus.
                </span>{" "}
                La commission est pr&eacute;lev&eacute;e c&ocirc;t&eacute; plateforme — l&apos;h&ocirc;te ne paie rien de plus. Toutes les transactions sont
                automatiques, tra&ccedil;ables et s&eacute;curis&eacute;es via{" "}
                <span className="font-semibold text-white">Stripe Connect</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
