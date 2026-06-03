"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useTransform, type MotionValue } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Bell,
  Boxes,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Camera,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Compass,
  Crown,
  Eye,
  Gem,
  Gift,
  GraduationCap,
  HardHat,
  Handshake,
  Home,
  KeyRound,
  Lamp,
  Landmark,
  Layers,
  LineChart,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Mic,
  Paintbrush,
  Phone,
  Receipt,
  Ruler,
  Scale,
  Scroll,
  Search,
  ShieldCheck,
  ShoppingBag,
  Shield,
  Sofa,
  Sparkles,
  Star,
  Store,
  Tags,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { FounderBadge } from "@/components/ui/founder-badge";
import { HeroSideStrip } from "@/components/ui/hero-side-strip";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { Marquee } from "@/components/ui/marquee";
import { useSlideProgress } from "@/components/landing/scroll-stage";
import {
  LandingLanguageProvider,
  useLandingLang,
} from "@/components/landing/landing-i18n";
import { ScrollStage } from "@/components/landing/scroll-stage";
import {
  ArchTower,
  ArchTallFacade,
  ArchAngularVolume,
  ArchDraftingTable,
  ArchSmallSlab,
  ArchCantilever,
} from "@/components/landing/arch-sketches";

/* ═══════════════════════════════════════════════════════════════════ */
/*  ROOT                                                               */
/* ═══════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <LandingLanguageProvider>
      <HomePageContent />
    </LandingLanguageProvider>
  );
}

/* ───────────────────────── Shared animation config ────────────────── */

const fadeUpViewport = { once: true, margin: "-80px" as const } as const;
const fadeUp = {
  initial: { opacity: 0, y: 30 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: fadeUpViewport,
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } as const,
};

function SectionHeading({
  label,
  title1,
  title2,
  description,
}: {
  label?: string;
  title1: string;
  title2: string;
  description?: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      {label && (
        <motion.div {...fadeUp} className="text-[#1e9df1] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
          {label}
        </motion.div>
      )}
      <motion.h2
        {...fadeUp}
        className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {title1}
        <br />
        <span className="text-[#1e9df1]">{title2}</span>
      </motion.h2>
      {description && (
        <motion.div {...fadeUp} className="text-[#1a1a1a]/50 text-base sm:text-lg leading-relaxed font-light">
          {description}
        </motion.div>
      )}
    </div>
  );
}

/* ─────────── HeroBenefitsAccordion ──────────────────────
   Liste des 6 avantages membres fondateurs avec icônes
   Lucide. Clic sur une ligne → développe la description.
─────────────────────────────────────────────────────────── */
function HeroBenefitsAccordion({
  lang,
  badgeTitle,
}: {
  lang: "fr" | "en" | "th";
  badgeTitle: string;
}) {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const ICONS = [Award, Zap, Eye, Mic, Users, Gem];

  const benefits =
    lang === "en"
      ? [
          { title: "Founding Member Badge", desc: "A permanent badge on your profile proving you were here from day one. Lifetime recognition in the ecosystem." },
          { title: "Early access", desc: "Set up your account, profile and preferences before the public launch. Be operational on day one." },
          { title: "Priority visibility", desc: "Your profile featured in search results and recommendations during the first months." },
          { title: "Exclusive conferences", desc: "Access to private sessions to discover features, give feedback and shape development priorities." },
          { title: "Founder network", desc: "Join a private group with the other first members and the founders. Exchange, collaborate, build together." },
          { title: "Exclusive perks", desc: "Preferential conditions on future premium features, training and platform tools." },
        ]
      : lang === "th"
      ? [
          { title: "ป้ายสมาชิกผู้ก่อตั้ง", desc: "ป้ายถาวรบนโปรไฟล์ของคุณ ที่พิสูจน์ว่าคุณอยู่ที่นี่ตั้งแต่วันแรก การรับรองตลอดชีพในระบบนิเวศ" },
          { title: "เข้าถึงก่อนใคร", desc: "ตั้งค่าบัญชี โปรไฟล์ และความชื่นชอบของคุณก่อนเปิดตัวสู่สาธารณะ พร้อมใช้งานตั้งแต่วันเปิดตัว" },
          { title: "การมองเห็นที่จัดลำดับ", desc: "โปรไฟล์ของคุณถูกนำเสนอในผลการค้นหาและคำแนะนำในช่วงเดือนแรก" },
          { title: "การประชุมพิเศษ", desc: "เข้าถึงเซสชันส่วนตัวเพื่อค้นพบฟีเจอร์ ให้ความคิดเห็น และมีอิทธิพลต่อทิศทางการพัฒนา" },
          { title: "เครือข่ายผู้ก่อตั้ง", desc: "เข้าร่วมกลุ่มส่วนตัวกับสมาชิกกลุ่มแรกและผู้ก่อตั้ง แลกเปลี่ยน ทำงานร่วมกัน สร้างไปด้วยกัน" },
          { title: "สิทธิประโยชน์พิเศษ", desc: "เงื่อนไขที่ดีกว่าสำหรับฟีเจอร์พรีเมียมในอนาคต การฝึกอบรม และเครื่องมือของแพลตฟอร์ม" },
        ]
      : [
          { title: "Badge Membre Fondateur", desc: "Un badge permanent sur votre profil qui prouve que vous étiez là dès le début. Reconnaissance à vie dans l'écosystème." },
          { title: "Accès anticipé", desc: "Configurez votre compte, votre profil et vos préférences avant le lancement public. Soyez opérationnel dès le jour J." },
          { title: "Visibilité prioritaire", desc: "Votre profil mis en avant dans les résultats de recherche et les recommandations pendant les premiers mois." },
          { title: "Conférences exclusives", desc: "Accès à des sessions privées pour découvrir les fonctionnalités, donner votre avis et influencer les priorités de développement." },
          { title: "Réseau fondateur", desc: "Intégrez un groupe privé avec les autres premiers membres et les fondateurs. Échangez, collaborez, construisez ensemble." },
          { title: "Avantages exclusifs", desc: "Des conditions préférentielles sur les futures fonctionnalités premium, les formations et les outils de la plateforme." },
        ];

  const eyebrow =
    lang === "en"
      ? "Founding members benefits"
      : lang === "th"
      ? "สิทธิประโยชน์สมาชิกผู้ก่อตั้ง"
      : "Avantages membres fondateurs";

  return (
    <div className="border-l border-[#1a1a1a]/10 pl-8 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-white" />
        <p className="text-[#1a1a1a] text-[0.65rem] tracking-[0.3em] uppercase font-semibold">
          {eyebrow}
        </p>
      </div>

      {/* Badge premium en tête */}
      <div className="mb-7">
        <FounderBadge brand="E-DOME" title={badgeTitle} />
      </div>

      {/* Liste accordéon des 6 avantages —
          Hover-to-open : passage de la souris sur un item l'ouvre auto-
          matiquement (et referme les autres). Le mouseLeave sur l'UL
          referme tout. Le click reste fonctionnel pour le tactile/clavier. */}
      <ul onMouseLeave={() => setOpen([])}>
        {benefits.map((b, i) => {
          const Icon = ICONS[i];
          const isOpen = open.includes(i);
          return (
            <li key={i} className="border-t border-[#1a1a1a]/10 first:border-t-0">
              <button
                type="button"
                onClick={() => toggle(i)}
                onMouseEnter={() => setOpen([i])}
                onFocus={() => setOpen([i])}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 py-3 text-left group"
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full border transition-colors duration-300 ${
                    isOpen
                      ? "border-[#1e9df1] bg-[#1e9df1] text-black"
                      : "border-[#1e9df1]/40 bg-[#1e9df1]/5 text-[#1e9df1] group-hover:bg-[#1e9df1] group-hover:text-black"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.8} />
                </span>
                <span
                  className={`block h-px transition-all duration-300 ${
                    isOpen ? "w-5 bg-[#1e9df1]" : "w-3 bg-[#e0e0e0] group-hover:w-5 group-hover:bg-[#1e9df1]"
                  }`}
                />
                <span className="text-[#1a1a1a] text-[0.72rem] font-medium uppercase tracking-[0.15em] flex-1">
                  {b.title}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-[#1e9df1] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-[#1a1a1a]/50 text-[0.7rem] leading-relaxed font-light pl-10 pr-2 pb-3">
                      {b.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DotDivider() {
  return (
    <div className="flex items-center gap-4 max-w-xs mx-auto py-14">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#1e9df1]/15" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#1e9df1]/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#1e9df1]/15" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MOTEUR ÉCONOMIQUE — slide ScrollStage avec graphique animé en BG  */
/*  Doit vivre dans le tree d'un <ScrollStage> (utilise useSlide-     */
/*  Progress). slideIdx attendu = 1 dans la 2e ScrollStage.           */
/* ═══════════════════════════════════════════════════════════════════ */

/**
 * Petit point sur la courbe de revenus. Animation one-shot : quand le
 * slide est activé (activated = true), le point grossit avec un délai
 * propre puis reste affiché — pas de scroll-driven, pas de retour à 0.
 */
function RevenueDot({
  x,
  y,
  color,
  delay,
  activated,
}: {
  x: number;
  y: number;
  color: string;
  delay: number;
  activated: boolean;
}) {
  return (
    <g>
      <motion.circle
        cx={x}
        cy={y}
        fill={color}
        fillOpacity={0.14}
        initial={{ r: 0 }}
        animate={{ r: activated ? 9 : 0 }}
        transition={{ duration: 0.45, delay, ease: [0.34, 1.56, 0.64, 1] }}
      />
      <motion.circle
        cx={x}
        cy={y}
        fill={color}
        fillOpacity={0.85}
        initial={{ r: 0 }}
        animate={{ r: activated ? 3.5 : 0 }}
        transition={{ duration: 0.45, delay, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </g>
  );
}

function MoteurEconomiqueSlide({
  lang,
  slideIdx,
}: {
  lang: "fr" | "en" | "th";
  slideIdx: number;
}) {
  /* One-shot : dès qu'on arrive sur la section (progress > seuil bas),
     l'animation se déclenche et reste figée à 100 % par la suite. */
  const progress = useSlideProgress(slideIdx);
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      if (v > 0.05) setActivated(true);
    });
    return unsub;
  }, [progress]);

  const heading =
    lang === "en"
      ? { title1: "At the financial heart", title2: "of E-Dome." }
      : lang === "th"
        ? { title1: "หัวใจการเงิน", title2: "ของ E-Dome" }
        : { title1: "Au cœur financier", title2: "d'E-Dome." };

  const lead =
    lang === "en" ? (
      <>
        E-Dome rebuilds the financial mechanics of real estate around{" "}
        <span className="text-[#1a1a1a] font-semibold">
          a single principle: value stays where it's created
        </span>
        . No opaque margins, no fees stacked on top of the price, no invisible
        revenues. Everything is tracked, automatic, paid at source — and every paid
        actor gets their own real-time revenue dashboard.
      </>
    ) : lang === "th" ? (
      <>
        E-Dome สร้างกลไกการเงินของอสังหาฯ ขึ้นใหม่บน{" "}
        <span className="text-[#1a1a1a] font-semibold">
          หลักการเดียว: คุณค่าอยู่กับคนที่สร้างมัน
        </span>
        . ไม่มีกำไรซ่อน ไม่มีค่าใช้จ่ายเพิ่มในราคา ไม่มีรายได้ที่มองไม่เห็น ทุกอย่างถูกติดตาม
        อัตโนมัติ ชำระตั้งแต่ต้นทาง — และทุกผู้รับมีแดชบอร์ดรายได้ของตัวเองแบบเรียลไทม์
      </>
    ) : (
      <>
        E-Dome rebâtit la mécanique financière de l'immobilier autour d'{" "}
        <span className="text-[#1a1a1a] font-semibold">
          un seul principe : la valeur reste là où elle se crée
        </span>
        . Pas de marges opaques, pas de frais ajoutés au prix, pas de revenus
        invisibles. Tout est tracé, automatique, payé à la source — et chaque acteur
        rémunéré dispose de son propre tableau de bord en temps réel.
      </>
    );

  const chips: { icon: React.ReactNode; color: string; label: string }[] = [
    {
      icon: <Lock size={13} />,
      color: "#1e9df1",
      label: lang === "en" ? "Per-pôle model" : lang === "th" ? "โมเดลตามแต่ละพอล" : "Modèle par pôle",
    },
    {
      icon: <ShieldCheck size={13} />,
      color: "#1e9df1",
      label: lang === "en" ? "100% traceable" : lang === "th" ? "ตรวจสอบได้ 100%" : "100 % traçable",
    },
    {
      icon: <LineChart size={13} />,
      color: "#1e9df1",
      label:
        lang === "en"
          ? "Personal dashboard"
          : lang === "th"
            ? "แดชบอร์ดส่วนตัว"
            : "Dashboard personnel",
    },
  ];

  /* Liste compacte des types d'apports rémunérés. Chaque pill décrit le
     canal d'affiliation et le mécanisme de paiement — pas de chiffres
     précis car les barèmes ne sont pas encore fixés. La liste n'est pas
     exhaustive : tout produit ou service vendu sur E-Dome peut déclencher
     une part d'apporteur (rappelé en caption juste en-dessous). */
  const affiliations: { icon: React.ReactNode; color: string; tag: string; rate: string }[] =
    lang === "en"
      ? [
          { icon: <Home size={14} />, color: "#1e9df1", tag: "Bring a host", rate: "% forever (active account)" },
          { icon: <Users size={14} />, color: "#1e9df1", tag: "Bring a client", rate: "% per booking" },
          { icon: <MapPin size={14} />, color: "#1e9df1", tag: "Bring a property", rate: "% on the sale" },
          { icon: <GraduationCap size={14} />, color: "#1e9df1", tag: "Bring a course", rate: "% on every sale" },
          { icon: <Briefcase size={14} />, color: "#1e9df1", tag: "Bring a service", rate: "% of the quote" },
          { icon: <Mic size={14} />, color: "#1e9df1", tag: "Bring an event", rate: "% per ticket" },
        ]
      : lang === "th"
        ? [
            { icon: <Home size={14} />, color: "#1e9df1", tag: "นำเจ้าของบ้าน", rate: "% ตลอดไป (บัญชีใช้งาน)" },
            { icon: <Users size={14} />, color: "#1e9df1", tag: "นำลูกค้า", rate: "% ต่อการจอง" },
            { icon: <MapPin size={14} />, color: "#1e9df1", tag: "นำทรัพย์สิน", rate: "% ของการขาย" },
            { icon: <GraduationCap size={14} />, color: "#1e9df1", tag: "นำคอร์ส", rate: "% ทุกการขาย" },
            { icon: <Briefcase size={14} />, color: "#1e9df1", tag: "นำบริการ", rate: "% ใบเสนอราคา" },
            { icon: <Mic size={14} />, color: "#1e9df1", tag: "นำอีเวนต์", rate: "% ต่อบัตร" },
          ]
        : [
            { icon: <Home size={14} />, color: "#1e9df1", tag: "Amener un hôte", rate: "% pour toujours (compte actif)" },
            { icon: <Users size={14} />, color: "#1e9df1", tag: "Amener un client", rate: "% par réservation" },
            { icon: <MapPin size={14} />, color: "#1e9df1", tag: "Amener un bien", rate: "% sur la vente" },
            { icon: <GraduationCap size={14} />, color: "#1e9df1", tag: "Amener une formation", rate: "% à chaque vente" },
            { icon: <Briefcase size={14} />, color: "#1e9df1", tag: "Amener un prestataire", rate: "% du devis" },
            { icon: <Mic size={14} />, color: "#1e9df1", tag: "Amener un événement", rate: "% par billet" },
          ];

  return (
    <section className="relative scroll-slide bg-white overflow-hidden">
      {/* ── BG : graphique linéaire qui se trace de bas-gauche en haut-droite,
              piloté par le progress du slide (la courbe naît au scroll). ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Grille horizontale */}
        {[20, 40, 60, 80].map((y) => (
          <div
            key={`h-${y}`}
            className="absolute inset-x-0 h-px bg-white/[0.035]"
            style={{ top: `${y}%` }}
          />
        ))}
        {/* Grille verticale (très subtile) */}
        {[15, 30, 45, 60, 75, 90].map((x) => (
          <div
            key={`v-${x}`}
            className="absolute top-0 bottom-0 w-px bg-white/[0.025]"
            style={{ left: `${x}%` }}
          />
        ))}

        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="rev-line" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e9df1" stopOpacity="0.05" />
              <stop offset="40%" stopColor="#1e9df1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1e9df1" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e9df1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#1e9df1" stopOpacity="0" />
            </linearGradient>
            <filter id="rev-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Aire sous la courbe */}
          <motion.path
            d="M 0 720 C 150 700, 300 660, 450 580 C 600 500, 750 380, 900 240 C 1050 130, 1200 80, 1200 80 L 1200 800 L 0 800 Z"
            fill="url(#rev-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: activated ? 1 : 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Halo flouté de la courbe principale (lueur) */}
          <motion.path
            d="M 0 720 C 150 700, 300 660, 450 580 C 600 500, 750 380, 900 240 C 1050 130, 1200 80, 1200 80"
            stroke="#1e9df1"
            strokeOpacity={0.35}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            filter="url(#rev-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activated ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Courbe principale (bleu → vert) */}
          <motion.path
            d="M 0 720 C 150 700, 300 660, 450 580 C 600 500, 750 380, 900 240 C 1050 130, 1200 80, 1200 80"
            stroke="url(#rev-line)"
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activated ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Courbe secondaire pointillée (tendance support) */}
          <motion.path
            d="M 0 760 L 200 740 L 400 700 L 600 620 L 800 540 L 1000 460 L 1200 360"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={1}
            strokeDasharray="3 5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activated ? 1 : 0 }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Points clés — apparaissent en cascade après le tracé. */}
          <RevenueDot x={250} y={685} color="#1e9df1" delay={0.7} activated={activated} />
          <RevenueDot x={500} y={555} color="#1e9df1" delay={0.9} activated={activated} />
          <RevenueDot x={750} y={360} color="#1e9df1" delay={1.1} activated={activated} />
          <RevenueDot x={1000} y={175} color="#1e9df1" delay={1.3} activated={activated} />
        </svg>

        {/* Voile radial central pour garder le texte lisible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 75%)",
          }}
        />
      </div>

      {/* ── Contenu ──
          justify-start + pt-24 : la navbar fixe (top:0, z-50) recouvrait le
          haut du titre quand le slide était centré ; on ancre désormais
          depuis le haut avec un padding qui dégage la navbar (≈48 px) plus
          un peu d'air. */}
      <div className="relative z-10 max-w-6xl mx-auto px-2 h-full flex flex-col justify-start pt-24 pb-6">
        {/* Heading compact — pas de label "kicker" cette fois (la BG anime
            déjà l'idée du moteur économique). Titre direct, taille raisonnée
            pour ne pas pousser le contenu hors slide. */}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {heading.title1}
            <br />
            <span className="text-[#1e9df1]">{heading.title2}</span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-[#1a1a1a]/70 text-sm sm:text-base leading-relaxed font-light"
          >
            {lead}
          </motion.p>
        </div>

        {/* 4 chips */}
        <motion.div
          {...fadeUp}
          className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-8 px-4"
        >
          {chips.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f5f5]/80 border border-[#1a1a1a]/10 backdrop-blur-sm"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: `${c.color}1f`,
                  color: c.color,
                  boxShadow: `inset 0 0 0 1px ${c.color}33`,
                }}
              >
                {c.icon}
              </span>
              <span className="text-[0.72rem] sm:text-xs font-semibold text-[#1a1a1a] tracking-tight whitespace-nowrap">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── 3 leviers financiers d'E-Dome — au-delà de l'apporteur :
              (1) commission plateforme contenue, (2) données financières
              que les hôtes peuvent ajouter à leurs annonces, (3) programme
              d'affiliation paramétrable. */}
        <motion.div {...fadeUp} className="max-w-5xl mx-auto px-4 mb-6">
          <p className="text-center text-[0.6rem] tracking-[0.22em] uppercase text-[#1a1a1a]/40 font-bold mb-3">
            {lang === "en"
              ? "What E-Dome brings"
              : lang === "th"
                ? "สิ่งที่ E-Dome มอบให้"
                : "Ce que E-Dome apporte"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {(lang === "en"
              ? [
                  {
                    icon: <Handshake size={14} />,
                    color: "#1e9df1",
                    eyebrow: "A shared commission",
                    title: "Business referrer program",
                    body: "Digital referral marketing — the referrer activates the function after identity verification (KYC), then generates their own link. Each conversion through it credits a share of E-Dome's own platform revenue to the referrer — tracked in real time, never added on top of the price. The seller, organiser or service provider can disable the programme on any listing or piece of content. The referrer never negotiates a price, never represents either party, is never paid directly by buyer or seller, and is neither an estate agent nor a broker. Applies across every pôle.",
                  },
                  {
                    icon: <LineChart size={14} />,
                    color: "#1e9df1",
                    eyebrow: "Built for investors",
                    title: "Integrated investment data",
                    body: "Hosts can enrich their sale or investment listings with yield numbers, rental revenue charts, projections, expense breakdowns, market comparables — everything the investor needs to decide, in one view.",
                  },
                  {
                    icon: <Wallet size={14} />,
                    color: "#1e9df1",
                    eyebrow: "Per-pôle model",
                    title: "Transparent fees, differentiated by pôle",
                    body: "Sales between individuals → flat platform fee (500 CHF below 1M, 2,500 CHF above) — independent of the sale price, paid at publication, never a percentage. Long-term rental → flat listing fee (150 / 250 / 400 CHF by lease length). Short-term rental, services, events, lives, training, e-commerce → marketplace commission (4–12 % depending on the pôle). Agency partnerships → B2B revenue share on the agency's own commission — the agency keeps its licence and its margin. Most of the value stays with the seller, and nothing is added to the buyer's price.",
                  },
                ]
              : lang === "th"
                ? [
                    {
                      icon: <Handshake size={14} />,
                      color: "#1e9df1",
                      eyebrow: "ค่าคอมมิชชันที่แบ่ง",
                      title: "โปรแกรมผู้แนะนำธุรกิจ",
                      body: "การตลาดแบบ Referral ดิจิทัล — ผู้แนะนำเปิดใช้งานหลังตรวจยืนยันตัวตน (KYC) จากนั้นสร้างลิงก์ของตนเอง ทุกการแปลงผ่านลิงก์ให้ส่วนแบ่งจากรายได้ของ E-Dome แก่ผู้แนะนำ ตรวจสอบได้แบบเรียลไทม์ ไม่บวกเพิ่มในราคา ผู้ขาย ผู้จัดงาน หรือผู้ให้บริการ สามารถปิดโปรแกรมในประกาศหรือเนื้อหาของตนได้ตลอด ผู้แนะนำไม่ต่อรองราคา ไม่เป็นตัวแทนคู่สัญญาใด ไม่รับเงินตรงจากผู้ซื้อหรือผู้ขาย และไม่ใช่ทั้งนายหน้าและตัวแทนอสังหาฯ ใช้ได้ทุกพอล",
                    },
                    {
                      icon: <LineChart size={14} />,
                      color: "#1e9df1",
                      eyebrow: "ออกแบบสำหรับนักลงทุน",
                      title: "ข้อมูลการลงทุนในตัว",
                      body: "เจ้าของสามารถเพิ่มข้อมูลผลตอบแทน กราฟรายได้ค่าเช่า การคาดการณ์ ค่าใช้จ่าย การเปรียบเทียบตลาด — ทุกอย่างที่นักลงทุนต้องการตัดสินใจ ในมุมมองเดียว",
                    },
                    {
                      icon: <Wallet size={14} />,
                      color: "#1e9df1",
                      eyebrow: "โมเดลตามแต่ละพอล",
                      title: "ค่าธรรมเนียมโปร่งใส แตกต่างตามพอล",
                      body: "ซื้อขายระหว่างบุคคล → ค่าธรรมเนียมแพลตฟอร์มแบบคงที่ (500 CHF สำหรับทรัพย์ต่ำกว่า 1 ล้าน, 2,500 CHF สำหรับทรัพย์เกิน 1 ล้าน) — ไม่ขึ้นกับราคาขาย เก็บตอนลงประกาศ ไม่ใช่เปอร์เซ็นต์ เช่ารายยาว → ค่าธรรมเนียมคงที่ (150 / 250 / 400 CHF ตามระยะสัญญา) เช่าระยะสั้น บริการ อีเวนต์ ไลฟ์ การฝึกอบรม อีคอมเมิร์ซ → ค่าคอมมิชชัน Marketplace (4–12 % ตามพอล) ความร่วมมือกับเอเจนซี่ → Revenue share B2B จากค่าคอมมิชชันของเอเจนซี่เอง — เอเจนซี่ถือใบอนุญาตและกำไรของตน ส่วนใหญ่อยู่กับผู้ขาย และผู้ซื้อไม่จ่ายเพิ่ม",
                    },
                  ]
                : [
                    {
                      icon: <Handshake size={14} />,
                      color: "#1e9df1",
                      eyebrow: "Une commission partagée",
                      title: "Programme apporteur d'affaires",
                      body: "Referral marketing digital — l'apporteur active la fonction après vérification d'identité (KYC), puis génère son lien personnel. Chaque conversion via ce lien reverse une part des revenus de plateforme d'E-Dome à l'apporteur — tracée en temps réel, jamais ajoutée au prix. Le vendeur, l'organisateur ou le prestataire peut désactiver le programme sur chaque annonce ou contenu. L'apporteur ne négocie aucun prix, ne représente aucune partie, n'est jamais payé directement par le vendeur ou l'acheteur, et n'est ni agent immobilier ni courtier. Applicable sur tous les pôles.",
                    },
                    {
                      icon: <LineChart size={14} />,
                      color: "#1e9df1",
                      eyebrow: "Pensé pour les investisseurs",
                      title: "Données d'investissement intégrées",
                      body: "Les hôtes peuvent enrichir leurs annonces de vente ou de projet d'investissement avec rentabilité, graphiques de revenus locatifs, projections, charges détaillées, comparatifs marché — tout ce qu'il faut à l'investisseur, en un coup d'œil.",
                    },
                    {
                      icon: <Wallet size={14} />,
                      color: "#1e9df1",
                      eyebrow: "Modèle par pôle",
                      title: "Des frais transparents, différenciés par pôle",
                      body: "Ventes entre particuliers → frais fixes de plateforme (500 CHF jusqu'à 1 M, 2 500 CHF au-delà) — indépendants du prix, dus à la publication, jamais un pourcentage. Location longue durée → frais fixes (150 / 250 / 400 CHF selon la durée du bail). Location courte, services, événements, lives, formations, e-commerce → commission marketplace (4–12 % selon le pôle). Partenariats agences → revenue share B2B sur la commission de l'agence — l'agence garde sa licence et sa marge. L'essentiel reste chez celui qui vend, et rien n'est ajouté au prix payé par le client.",
                    },
                  ]
            ).map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#f5f5f5]/70 backdrop-blur-sm border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/15 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `${card.color}1f`,
                      color: card.color,
                      boxShadow: `inset 0 0 0 1px ${card.color}33`,
                    }}
                  >
                    {card.icon}
                  </span>
                  <span
                    className="text-[0.55rem] tracking-[0.2em] uppercase font-bold"
                    style={{ color: card.color }}
                  >
                    {card.eyebrow}
                  </span>
                </div>
                <h4 className="text-[0.85rem] sm:text-[0.9rem] font-bold text-[#1a1a1a] tracking-tight leading-tight">
                  {card.title}
                </h4>
                <p className="text-[0.7rem] sm:text-[0.74rem] text-[#1a1a1a]/50 leading-snug font-light">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Callout important : la commission de l'apporteur est prélevée
              sur la part d'E-Dome, JAMAIS en sus. Pas d'animation : ce
              bloc doit être constamment visible dès l'arrivée sur la
              section, sans effet d'apparition. ── */}
        <div className="mx-4 sm:mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.04] to-transparent border border-emerald-500/30 backdrop-blur-sm overflow-hidden mb-5">
          <div className="flex flex-col sm:flex-row items-stretch">
            {/* Côté gauche : pictogramme + libellé fort */}
            <div className="flex items-center gap-3 px-4 py-3 sm:pr-3 sm:border-r sm:border-emerald-500/20">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/15 text-[#1e9df1] border border-emerald-500/30">
                <ShieldCheck size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1e9df1] font-bold">
                  {lang === "en"
                    ? "Important"
                    : lang === "th"
                      ? "สำคัญ"
                      : "À savoir"}
                </p>
                <p className="text-[0.95rem] sm:text-base font-bold text-[#1a1a1a] tracking-tight mt-0.5">
                  {lang === "en"
                    ? "Zero extra cost for the host or client."
                    : lang === "th"
                      ? "ไม่มีค่าใช้จ่ายเพิ่ม"
                      : "Aucun supplément pour l'hôte ou le client."}
                </p>
              </div>
            </div>

            {/* Côté droit : phrase d'explication centrée */}
            <div className="flex-1 px-4 py-3 flex items-center">
              <p className="text-[0.78rem] sm:text-sm text-[#1a1a1a]/70 font-light leading-snug">
                {lang === "en" ? (
                  <>
                    The referrer's commission is{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      taken from E-Dome's own share
                    </span>{" "}
                    of the transaction —{" "}
                    <span className="text-[#1a1a1a] font-semibold">never added on top</span>{" "}
                    of the price. Bringing a contact never makes the deal more
                    expensive.
                  </>
                ) : lang === "th" ? (
                  <>
                    ค่าคอมมิชชันของผู้แนะนำ{" "}
                    <span className="text-[#1a1a1a] font-semibold">หักจากส่วนของ E-Dome</span>{" "}
                    เท่านั้น —{" "}
                    <span className="text-[#1a1a1a] font-semibold">ไม่เพิ่มเข้าราคา</span>{" "}
                    การพาผู้ติดต่อมาจึงไม่ทำให้ดีลแพงขึ้น
                  </>
                ) : (
                  <>
                    La commission de l'apporteur est{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      prélevée sur la part d'E-Dome
                    </span>{" "}
                    — <span className="text-[#1a1a1a] font-semibold">jamais ajoutée</span> au
                    prix. Amener un contact n'a jamais rendu une transaction plus chère.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Trust closing line */}
        <motion.div {...fadeUp} className="text-center px-4">
          <p className="text-[#1a1a1a]/50 text-[0.78rem] sm:text-sm leading-relaxed font-light">
            {lang === "en" ? (
              <>
                100% traceable. 100% automatic.{" "}
                <span className="text-[#1a1a1a] font-semibold">No hidden cost</span> for the
                host or the client.
              </>
            ) : lang === "th" ? (
              <>
                ตรวจสอบได้ 100% อัตโนมัติ 100%{" "}
                <span className="text-[#1a1a1a] font-semibold">ไม่มีค่าใช้จ่ายแอบแฝง</span>
              </>
            ) : (
              <>
                100 % traçable. 100 % automatique.{" "}
                <span className="text-[#1a1a1a] font-semibold">Aucun coût caché</span> pour
                l'hôte ou le client.
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  HeroArchTower — wrapper qui injecte useSlideProgress(0) du           */
/*  ScrollStage parent dans l'esquisse latérale du hero. Doit vivre      */
/*  dans l'arbre d'un <ScrollStage>.                                     */
/* ═══════════════════════════════════════════════════════════════════ */
function HeroArchTower() {
  const progress = useSlideProgress(0);
  return (
    <div className="hidden lg:block absolute right-[-18%] top-0 bottom-0 w-[42%] z-0 pointer-events-none">
      <ArchTower className="w-full h-full" scrollProgress={progress} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN CONTENT                                                      */
/* ═══════════════════════════════════════════════════════════════════ */

function HomePageContent() {
  const { lang, setLang, t } = useLandingLang();

  /* ── Vidéos défilant en parallaxe dans l'iPhone ──────────────────── */
  /* reel-08 vient en index 0 = tuile centrée qui zoome plein cadre à la fin */
  const phoneVideos = [
    { src: "/videos/parallax/reel-08.mp4" },
    { src: "/videos/parallax/reel-01.mp4" },
    { src: "/videos/parallax/reel-02.mp4" },
    { src: "/videos/parallax/reel-03.mp4" },
    { src: "/videos/parallax/reel-04.mp4" },
    { src: "/videos/parallax/reel-05.mp4" },
    { src: "/videos/parallax/reel-06.mp4" },
    { src: "/videos/parallax/reel-07.mp4" },
    { src: "/videos/parallax/reel-09.mp4" },
    { src: "/videos/parallax/reel-10.mp4" },
  ];

  /* ── Texte punch affiché à côté du téléphone ─────────────────────── */
  const phonePunch =
    lang === "en"
      ? "Social content captures millions of eyes — and ushers them straight out the door. Commissions stay high in a market that never consolidated its stack. And owners, prescribers, local contributors — half the living forces of the ecosystem — have nowhere to belong."
      : lang === "th"
        ? "คอนเทนต์โซเชียลดึงดูดสายตาเป็นล้าน — แล้วผลักออกไปทันที ค่าคอมมิชชันยังสูงในตลาดที่ไม่เคยรวมเครื่องมือเข้าด้วยกัน และเจ้าของ ผู้แนะนำ ผู้ร่วมในท้องถิ่น — ครึ่งหนึ่งของพลังของระบบนิเวศ — ไม่มีที่ให้อยู่"
        : "Du contenu social qui capte des millions de regards — et les envoie aussitôt ailleurs. Des commissions élevées dans un marché qui n'a jamais unifié ses outils. Des particuliers, prescripteurs, contributeurs locaux : la moitié des forces vives de l'écosystème, sans endroit pour exister.";

  const phonePunchEmphasis =
    lang === "en"
      ? "Real estate has built walls where it should have built a roof."
      : lang === "th"
        ? "อสังหาฯ สร้างกำแพงในที่ที่ควรสร้างหลังคา"
        : "L'immobilier a bâti des murs là où il aurait fallu bâtir un toit.";

  /* ── Service cards data ──────────────────────────────────────────── */
  const services = [
    { icon: <Layers size={22} />, tagKey: "services.f1_tag", titleKey: "services.f1_title", descKey: "services.f1_desc" },
    { icon: <MapPin size={22} />, tagKey: "services.f2_tag", titleKey: "services.f2_title", descKey: "services.f2_desc" },
    { icon: <GraduationCap size={22} />, tagKey: "services.f3_tag", titleKey: "services.f3_title", descKey: "services.f3_desc" },
    { icon: <TrendingUp size={22} />, tagKey: "services.f4_tag", titleKey: "services.f4_title", descKey: "services.f4_desc" },
    { icon: <Video size={22} />, tagKey: "services.f5_tag", titleKey: "services.f5_title", descKey: "services.f5_desc" },
    { icon: <Briefcase size={22} />, tagKey: "services.f6_tag", titleKey: "services.f6_title", descKey: "services.f6_desc" },
  ];

  /* ── Philosophy points ───────────────────────────────────────────── */
  const philosophyPoints = [
    { titleKey: "philosophy.p1_title", descKey: "philosophy.p1_desc" },
    { titleKey: "philosophy.p2_title", descKey: "philosophy.p2_desc" },
    { titleKey: "philosophy.p3_title", descKey: "philosophy.p3_desc" },
    { titleKey: "philosophy.p4_title", descKey: "philosophy.p4_desc" },
  ];

  /* ── Roadmap phases ──────────────────────────────────────────────── */
  const phases = [
    {
      titleKey: "roadmap.phase1_title",
      status: t("roadmap.status_done"),
      statusColor: "bg-[#1e9df1]/10 text-[#1e9df1]",
      items: [1, 2, 3, 4, 5, 6, 7].map((n) => `roadmap.phase1_item${n}`),
    },
    {
      titleKey: "roadmap.phase2_title",
      status: t("roadmap.status_current"),
      statusColor: "bg-[#1e9df1]/10 text-[#1e9df1]",
      items: [1, 2, 3, 4, 5].map((n) => `roadmap.phase2_item${n}`),
    },
    {
      titleKey: "roadmap.phase3_title",
      status: t("roadmap.status_upcoming"),
      statusColor: "bg-[#eeeeee] text-[#1a1a1a]/50",
      items: [1, 2, 3, 4, 5, 6].map((n) => `roadmap.phase3_item${n}`),
    },
    {
      titleKey: "roadmap.phase4_title",
      status: t("roadmap.status_upcoming"),
      statusColor: "bg-[#eeeeee] text-[#1a1a1a]/50",
      items: [1, 2, 3, 4, 5].map((n) => `roadmap.phase4_item${n}`),
    },
  ];

  /* ── Benefits ────────────────────────────────────────────────────── */
  const benefits = [
    { icon: <BadgeCheck size={20} />, titleKey: "roadmap.benefit1_title", descKey: "roadmap.benefit1_desc" },
    { icon: <Clock size={20} />, titleKey: "roadmap.benefit2_title", descKey: "roadmap.benefit2_desc" },
    { icon: <Eye size={20} />, titleKey: "roadmap.benefit3_title", descKey: "roadmap.benefit3_desc" },
    { icon: <Star size={20} />, titleKey: "roadmap.benefit4_title", descKey: "roadmap.benefit4_desc" },
    { icon: <Users size={20} />, titleKey: "roadmap.benefit5_title", descKey: "roadmap.benefit5_desc" },
    { icon: <Gift size={20} />, titleKey: "roadmap.benefit6_title", descKey: "roadmap.benefit6_desc" },
  ];

  /* ── Roles ───────────────────────────────────────────────────────── */
  const roles = [
    "about.role_hote", "about.role_agence", "about.role_agent",
    "about.role_investisseur", "about.role_formateur", "about.role_apporteur",
    "about.role_photographe", "about.role_courtier", "about.role_notaire",
    "about.role_architecte", "about.role_promoteur", "about.role_client",
  ];

  return (
    <div className="bg-white text-[#1a1a1a] antialiased" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#1a1a1a]/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="#" className="font-semibold text-2xl tracking-tight">
            E-<span className="text-[#1e9df1]">Dome</span>
          </a>

          <div className="hidden md:flex gap-8">
            {[
              { href: "#vision", label: t("nav.vision") },
              { href: "#fonctionnalites", label: t("nav.features") },
              { href: "#fondateurs", label: t("nav.founders") },
              { href: "#roadmap", label: t("nav.roadmap") },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#1a1a1a]/50 hover:text-[#1e9df1] text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-lg border border-[#1a1a1a]/10 overflow-hidden">
              {(["fr", "en", "th"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs font-medium px-2.5 py-1.5 transition-colors uppercase ${
                    lang === l
                      ? "bg-[#1e9df1] text-[#1a1a1a]"
                      : "text-[#1a1a1a]/50 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="#inscriptions"
              className="hidden sm:inline-flex bg-[#1e9df1] text-[#1a1a1a] rounded-none px-5 py-2 text-sm font-semibold hover:bg-[#1a8fd9] transition-colors"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </nav>

      <ScrollStage>
      {/* ═══════════════════════ HERO (left-aligned, brutaliste) ═══════════════════════ */}
      <section className="scroll-slide bg-white relative overflow-hidden">
        {/* Esquisse gratte-ciel — remplit toute la zone latérale droite et
            se dessine puis disparaît trait par trait au scroll de la slide
            (piloté par useSlideProgress du ScrollStage parent). */}
        <HeroArchTower />

        <div className="min-h-screen flex items-center px-6 sm:px-12 md:px-20 lg:px-32 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
            {/* Colonne texte (gauche) */}
            <motion.div {...fadeUp} className="lg:col-span-7 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-8 h-px bg-[#1e9df1]" />
                <p className="text-[#1e9df1] text-xs tracking-[0.3em] uppercase font-semibold">
                  {t("hero.label")}
                </p>
              </div>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#1a1a1a] leading-[1.02] mb-8"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t("hero.title1")}
                <br />
                <span className="text-[#1e9df1] italic">{t("hero.title2")}</span>
              </h1>
              <p className="text-base sm:text-lg text-[#1a1a1a]/50 leading-relaxed font-light mb-10 max-w-xl">
                {lang === "en" ? (
                  <>
                    Support the project by expressing your interest.{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      A simple questionnaire, free and with no commitment
                    </span>
                    , that proves real market demand and helps us build the platform that suits you.
                  </>
                ) : lang === "th" ? (
                  <>
                    สนับสนุนโครงการโดยการแสดงความสนใจของคุณ{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      แบบสอบถามง่ายๆ ฟรีและไม่มีข้อผูกมัด
                    </span>{" "}
                    ที่พิสูจน์ความต้องการที่แท้จริงของตลาด และช่วยเราสร้างแพลตฟอร์มที่เหมาะกับคุณ
                  </>
                ) : (
                  <>
                    Soutenez le projet en manifestant votre intérêt.{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      Un simple questionnaire, gratuit et sans engagement
                    </span>
                    , qui prouve une vraie demande sur le marché et nous aide à construire la plateforme qui vous correspond.
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#inscriptions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1e9df1] text-[#1a1a1a] text-sm font-semibold hover:bg-[#1a8fd9] transition-all"
                >
                  {t("hero.cta")} <ArrowRight size={16} />
                </Link>
                <Link
                  href="#vision"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#1a1a1a]/15 text-[#1a1a1a]/70 text-sm font-medium hover:bg-[#f5f5f5] hover:border-neutral-600 transition-all"
                >
                  {t("hero.learn")}
                </Link>
              </div>
            </motion.div>

            {/* Colonne droite : badge fondateur + 6 avantages (accordéon cliquable) */}
            <motion.div {...fadeUp} className="hidden lg:block lg:col-span-5 lg:-ml-16">
              <HeroBenefitsAccordion
                lang={lang}
                badgeTitle={
                  lang === "en"
                    ? "FOUNDING MEMBER"
                    : lang === "th"
                    ? "สมาชิกผู้ก่อตั้ง"
                    : "MEMBRE FONDATEUR"
                }
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LE CONSTAT ═══════════════════════
          Refonte éditoriale brutaliste. Titre punchy "L'immobilier
          travaille à l'envers", intro courte, 6 constats en liste
          print-style (numéro mono / phrase unique). Pas de cartes,
          pas d'icônes : que de la typographie et des règles
          horizontales. */}
      <section id="probleme" className="scroll-slide bg-white relative overflow-hidden">
        {/* Façade haute brutaliste (Le Corbusier-esque) en bleu, ancrée à
            gauche, avec parallaxe scroll vertical. */}
        <div className="hidden lg:block absolute left-[-3%] top-0 bottom-0 w-[18%] z-0 pointer-events-none">
          <ArchTallFacade className="w-full h-full" />
        </div>
        <div className="min-h-screen flex items-center px-6 py-10 relative z-10">
        <div className="max-w-5xl mx-auto w-full">
          {(() => {
            type Pb = { title: string; body: string; resolution: string };
            type Data = {
              intro: React.ReactNode;
              constats: Pb[];
              closing: string;
            };
            const data: Data =
              lang === "en"
                ? {
                    intro: (
                      <>
                        Real estate is, above all, a relationship business.
                        Yet today everything is scattered — tools, revenue,
                        content, actors. A lot of value is lost along the way.
                      </>
                    ),
                    constats: [
                      {
                        title: "High commissions.",
                        body: "Revenue split by hand, with no transparency, no central tracking, and no real traceability.",
                        resolution:
                          "Transparent fees per pôle — flat fees for sales between individuals and long-term rental, marketplace commission below market for services, events, lives, training, e-commerce and short-term rental. Fully automated and traceable.",
                      },
                      {
                        title: "Real-estate content that redirects elsewhere.",
                        body: "Every click that leaves the platform breaks the prospect's attention and fragments the experience.",
                        resolution: "Integrated marketplace and social feed. The click stays inside.",
                      },
                      {
                        title: "A trade scattered across dozens of tools.",
                        body: "Every task has its own platform, its own subscription, its own data and its own limits.",
                        resolution: "Listings, messaging, calendar, accounting, training — one single flow.",
                      },
                      {
                        title: "No place where the ecosystem actually exists.",
                        body: "Every real-estate trade already collaborates with the others — but on separate systems.",
                        resolution: "All roles, on the same platform, connected to the same network.",
                      },
                    ],
                    closing: "An ecosystem that doesn't know it's one.",
                  }
                : lang === "th"
                ? {
                    intro: (
                      <>
                        อสังหาริมทรัพย์ ก่อนอื่นใด คือธุรกิจของความสัมพันธ์
                        แต่วันนี้ ทุกอย่างกระจัดกระจาย — เครื่องมือ รายได้
                        คอนเทนต์ ผู้เล่น และคุณค่ามากมายสูญหายระหว่างทาง
                      </>
                    ),
                    constats: [
                      {
                        title: "ค่าคอมมิชชันสูง",
                        body: "รายได้แบ่งด้วยมือ ไม่โปร่งใส ไม่มีการติดตามรวมศูนย์ และไม่มีการตรวจสอบที่แท้จริง",
                        resolution:
                          "ค่าธรรมเนียมโปร่งใสตามแต่ละพอล — ค่าธรรมเนียมคงที่สำหรับการซื้อขายระหว่างบุคคลและการเช่ารายยาว ค่าคอมมิชชัน Marketplace ต่ำกว่าตลาดสำหรับบริการ อีเวนต์ ไลฟ์ การฝึกอบรม อีคอมเมิร์ซ และการเช่าระยะสั้น อัตโนมัติและตรวจสอบได้ทั้งหมด",
                      },
                      {
                        title: "คอนเทนต์อสังหาฯ ที่นำไปที่อื่น",
                        body: "ทุกคลิกที่ออกจากแพลตฟอร์มตัดความสนใจของผู้ที่อาจเป็นลูกค้าและทำให้ประสบการณ์แตกออก",
                        resolution: "มาร์เก็ตเพลสและฟีดโซเชียลรวมกัน คลิกยังอยู่กับเรา",
                      },
                      {
                        title: "อาชีพที่กระจายอยู่บนเครื่องมือหลายสิบตัว",
                        body: "ทุกงานมีแพลตฟอร์มของมัน สมาชิกของมัน ข้อมูลของมัน และข้อจำกัดของมัน",
                        resolution: "ประกาศ แชท ตารางนัด บัญชี อบรม — กระแสเดียวกัน",
                      },
                      {
                        title: "ไม่มีที่ที่ระบบนิเวศมีอยู่จริง",
                        body: "ทุกอาชีพในวงการอสังหาฯ ทำงานร่วมกันอยู่แล้ว — แต่บนระบบที่แยกกัน",
                        resolution: "ทุกบทบาทอยู่บนแพลตฟอร์มเดียว เชื่อมต่อกับเครือข่ายเดียว",
                      },
                    ],
                    closing: "ระบบนิเวศที่ไม่รู้ว่าตัวเองเป็นระบบนิเวศ",
                  }
                : {
                    intro: (
                      <>
                        L'immobilier est avant tout un métier de relations.
                        Pourtant aujourd'hui, tout y est éparpillé — les
                        outils, les revenus, le contenu, les acteurs. Beaucoup
                        de valeur se perd en chemin.
                      </>
                    ),
                    constats: [
                      {
                        title: "Des commissions élevées.",
                        body: "Des revenus répartis manuellement, sans transparence, sans suivi centralisé et sans réelle traçabilité.",
                        resolution:
                          "Frais transparents par pôle — frais fixes pour les ventes entre particuliers et la location longue durée, commission marketplace sous-marché pour les services, événements, lives, formations, e-commerce et location courte durée. Entièrement automatisé et traçable.",
                      },
                      {
                        title: "Du contenu immobilier qui redirige ailleurs.",
                        body: "Chaque clic qui fait quitter la plateforme casse l'attention du prospect et fragmente l'expérience.",
                        resolution:
                          "Marketplace et fil social intégrés. Le clic reste à l'intérieur.",
                      },
                      {
                        title: "Un métier dispersé entre des dizaines d'outils.",
                        body: "Chaque tâche a sa plateforme, son abonnement, ses données et ses limites.",
                        resolution:
                          "Annonces, messagerie, agenda, compta, formations — un seul flux.",
                      },
                      {
                        title: "Aucun endroit où l'écosystème existe réellement.",
                        body: "Tous les métiers de l'immobilier collaborent déjà entre eux — mais sur des systèmes séparés.",
                        resolution:
                          "Tous les rôles sur la même plateforme, connectés par un même réseau.",
                      },
                    ],
                    closing: "Un écosystème qui ignore qu'il en est un.",
                  };

            /* Graphique linéaire négatif rouge en arrière-plan, fragmenté
               à travers les 4 encadrés mais visuellement continu : chaque
               carte rend son propre segment de la courbe descendante, et
               les Y aux frontières gauche/droite des cartes correspondent
               aux Y des cartes voisines. Avec viewBox 0..100 / 0..100 et
               preserveAspectRatio="none", la courbe s'étire pour remplir
               la carte sans déborder. */
            const chartSegments = [
              // Carte 01 — Y 18 → 32 (légère chute initiale)
              "0,18 12,15 28,22 45,17 62,28 78,24 100,32",
              // Carte 02 — Y 32 → 52 (chute plus marquée)
              "0,32 14,30 30,38 48,40 65,46 82,50 100,52",
              // Carte 03 — Y 52 → 70 (creux en milieu)
              "0,52 18,56 35,60 52,68 70,64 88,72 100,70",
              // Carte 04 — Y 70 → 92 (effondrement final)
              "0,70 16,73 32,78 50,82 68,86 86,89 100,92",
            ];

            return (
              <>
                {/* HEADER — eyebrow + titre punchy + intro globale courte */}
                <motion.div {...fadeUp} className="mb-8 max-w-3xl">
                  <p className="text-[#1e9df1] text-[0.62rem] tracking-[0.35em] uppercase font-semibold mb-3">
                    {t("problem.label")}
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-[#1a1a1a] mb-4"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {lang === "en" ? (
                      <>
                        A disconnected
                        <br />
                        <span className="text-[#1e9df1] italic">
                          ecosystem.
                        </span>
                      </>
                    ) : lang === "th" ? (
                      <>
                        ระบบนิเวศ
                        <br />
                        <span className="text-[#1e9df1] italic">
                          ที่ขาดการเชื่อมต่อ
                        </span>
                      </>
                    ) : (
                      <>
                        Un écosystème
                        <br />
                        <span className="text-[#1e9df1] italic">
                          déconnecté.
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="text-[#1a1a1a]/70 text-sm md:text-base leading-relaxed font-light">
                    {data.intro}
                  </p>
                </motion.div>

                {/* 4 CONSTATS en encadrés avec graphique linéaire négatif
                    rouge en arrière-plan, continu visuellement de gauche à
                    droite (chaque carte = 1 segment, Y aux bords alignés). */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {data.constats.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="relative bg-[#f5f5f5]/60 backdrop-blur-sm rounded-2xl border border-[#1a1a1a]/10 hover:border-red-500/30 transition-colors p-5 sm:p-5 flex flex-col overflow-hidden"
                    >
                      {/* Graphique linéaire négatif en arrière-plan */}
                      <svg
                        aria-hidden
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id={`chart-fill-${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#1e9df1" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#1e9df1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Aire sous la courbe (très subtile) */}
                        <motion.polygon
                          points={`${chartSegments[i]} 100,100 0,100`}
                          fill={`url(#chart-fill-${i})`}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        />
                        {/* Courbe linéaire */}
                        <motion.polyline
                          points={chartSegments[i]}
                          fill="none"
                          stroke="rgba(239, 68, 68, 0.42)"
                          strokeWidth="0.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 1 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{
                            pathLength: {
                              duration: 1.2,
                              delay: i * 0.18,
                              ease: [0.25, 0.1, 0.25, 1],
                            },
                            opacity: {
                              duration: 0.4,
                              delay: i * 0.18,
                            },
                          }}
                        />
                      </svg>

                      {/* Contenu au-dessus du graphique */}
                      <span className="relative font-mono text-[0.62rem] text-red-400/70 tracking-[0.22em] uppercase font-semibold mb-3">
                        0{i + 1}
                      </span>
                      <h3
                        className="relative text-[1rem] sm:text-[1.05rem] font-semibold text-[#1a1a1a] leading-tight mb-2.5"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {c.title}
                      </h3>
                      <p className="relative text-[#1a1a1a]/50 text-[0.78rem] sm:text-[0.82rem] leading-relaxed font-light flex-1 mb-3">
                        {c.body}
                      </p>
                      {/* Résolution E-Dome — petit, bleu, en pied de carte */}
                      <div className="relative pt-3 border-t border-[#1a1a1a]/10/80">
                        <p className="text-[0.65rem] sm:text-[0.7rem] text-blue-300/80 leading-snug font-medium">
                          <span className="text-[#1e9df1] font-bold">
                            E-Dome →
                          </span>{" "}
                          {c.resolution}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CLOSING — phrase italique serif, sans animation,
                    constamment visible dès le rendu. */}
                <p
                  className="text-center text-base sm:text-lg md:text-xl mt-7 text-[#1a1a1a]/70 italic font-light"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  «&nbsp;{data.closing}&nbsp;»
                </p>
              </>
            );
          })()}
        </div>
        </div>
      </section>
      </ScrollStage>

      {/* ═══════════════════════ CINEMATIC HERO (hors ScrollStage) ═══════════
          Composant cinématique qui s'auto-pinne sur 7000 px de scroll : il
          révèle la tagline, la card pleine résolution avec mockup iPhone,
          puis pull-back vers les CTAs. Contenu adapté à E-Dome. */}
      <CinematicHero
        brandName={lang === "th" ? "E-DOME" : "E-DOME"}
        tagline1={
          lang === "en"
            ? "Real estate built walls."
            : lang === "th"
              ? "อสังหาฯ สร้างกำแพง"
              : "L'immobilier a bâti des murs."
        }
        tagline2={
          lang === "en"
            ? "We are building the roof."
            : lang === "th"
              ? "เรากำลังสร้างหลังคา"
              : "Nous bâtissons le toit."
        }
        cardHeading={
          lang === "en"
            ? "Real estate, finally connected."
            : lang === "th"
              ? "อสังหาฯ ที่เชื่อมโยงกันในที่สุด"
              : "L'immobilier, enfin connecté."
        }
        cardDescription={(() => {
          const features =
            lang === "en"
              ? [
                  { icon: <Layers size={11} />, label: "Social feed", desc: "post, react, share", color: "#1e9df1" },
                  { icon: <MapPin size={11} />, label: "Marketplace", desc: "rent, sell, book", color: "#1e9df1" },
                  { icon: <Video size={11} />, label: "Lives", desc: "live events, replays", color: "#1e9df1" },
                  { icon: <GraduationCap size={11} />, label: "Campus", desc: "courses + cohorts", color: "#1e9df1" },
                  { icon: <Handshake size={11} />, label: "Referrals", desc: "auto commissions", color: "#1e9df1" },
                  { icon: <Briefcase size={11} />, label: "Pros directory", desc: "verified providers", color: "#1e9df1" },
                ]
              : lang === "th"
                ? [
                    { icon: <Layers size={11} />, label: "ฟีดโซเชียล", desc: "โพสต์ ตอบรีบ แชร์", color: "#1e9df1" },
                    { icon: <MapPin size={11} />, label: "มาร์เก็ตเพลส", desc: "เช่า ขาย จอง", color: "#1e9df1" },
                    { icon: <Video size={11} />, label: "ไลฟ์", desc: "ไลฟ์สด & ดูย้อนหลัง", color: "#1e9df1" },
                    { icon: <GraduationCap size={11} />, label: "แคมปัส", desc: "คอร์ส + รุ่น", color: "#1e9df1" },
                    { icon: <Handshake size={11} />, label: "เครือข่ายแนะนำ", desc: "คอมมิชชันอัตโนมัติ", color: "#1e9df1" },
                    { icon: <Briefcase size={11} />, label: "ไดเรกทอรีมืออาชีพ", desc: "ผู้ให้บริการที่ยืนยัน", color: "#1e9df1" },
                  ]
                : [
                    { icon: <Layers size={11} />, label: "Fil social", desc: "publier, réagir, partager", color: "#1e9df1" },
                    { icon: <MapPin size={11} />, label: "Marketplace", desc: "louer, vendre, réserver", color: "#1e9df1" },
                    { icon: <Video size={11} />, label: "Lives", desc: "événements en direct", color: "#1e9df1" },
                    { icon: <GraduationCap size={11} />, label: "Campus", desc: "formations & promos", color: "#1e9df1" },
                    { icon: <Handshake size={11} />, label: "Apporteurs", desc: "commissions traçables", color: "#1e9df1" },
                    { icon: <Briefcase size={11} />, label: "Annuaire pros", desc: "prestataires vérifiés", color: "#1e9df1" },
                  ];
          return (
            <>
              <span className="block mb-3 leading-relaxed">
                {lang === "en" ? (
                  <>
                    Publish a property, accept the booking, train your clients,
                    stream a live, refer a contact for a commission and find
                    your photographer — every action lives in the same app.{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      One signal, one inbox, one ledger.
                    </span>
                  </>
                ) : lang === "th" ? (
                  <>
                    ลงประกาศ รับการจอง อบรมลูกค้า ไลฟ์สด แนะนำคนรับค่าคอม
                    และหาช่างภาพ — ทุกการกระทำอยู่ในแอปเดียวกัน{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      สัญญาณเดียว กล่องเดียว บัญชีเดียว
                    </span>
                  </>
                ) : (
                  <>
                    Publier un bien, encaisser une réservation, former vos
                    clients, diffuser un live, recommander un contact contre
                    commission, trouver le bon photographe — chaque action vit
                    dans la même app.{" "}
                    <span className="text-[#1a1a1a] font-semibold">
                      Un seul signal, une seule boîte, un seul compteur.
                    </span>
                  </>
                )}
              </span>
              <span
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] md:text-[13.5px] leading-snug"
                style={{ display: "grid" }}
              >
                {features.map((f) => (
                  <span key={f.label} className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: `${f.color}22`,
                        color: f.color,
                        boxShadow: `inset 0 0 0 1px ${f.color}33`,
                      }}
                    >
                      {f.icon}
                    </span>
                    <span className="text-blue-100/85">
                      <span className="text-[#1a1a1a] font-semibold">{f.label}</span>
                      <span className="text-blue-100/60"> · {f.desc}</span>
                    </span>
                  </span>
                ))}
              </span>
            </>
          );
        })()}
        metricValue={1250}
        metricLabel={lang === "en" ? "CHF" : lang === "th" ? "CHF" : "CHF"}
        phoneStatLabel={
          lang === "en"
            ? "This week"
            : lang === "th"
              ? "สัปดาห์นี้"
              : "Cette semaine"
        }
        phoneStatDelta={
          lang === "en"
            ? "+18% vs last week"
            : lang === "th"
              ? "+18% เทียบสัปดาห์ที่แล้ว"
              : "+18 % vs sem. dernière"
        }
        phoneBellCount={3}
        phoneModules={[
          {
            icon: <Layers size={14} />,
            label: lang === "en" ? "Feed" : lang === "th" ? "ฟีด" : "Fil",
            color: "#1e9df1",
          },
          {
            icon: <MapPin size={14} />,
            label:
              lang === "en"
                ? "Listings"
                : lang === "th"
                  ? "ทรัพย์"
                  : "Biens",
            color: "#1e9df1",
          },
          {
            icon: <Video size={14} />,
            label: lang === "en" ? "Live" : lang === "th" ? "ไลฟ์" : "Lives",
            color: "#1e9df1",
          },
          {
            icon: <GraduationCap size={14} />,
            label:
              lang === "en"
                ? "Campus"
                : lang === "th"
                  ? "อบรม"
                  : "Campus",
            color: "#1e9df1",
          },
          {
            icon: <Handshake size={14} />,
            label:
              lang === "en"
                ? "Network"
                : lang === "th"
                  ? "เครือข่าย"
                  : "Apporteurs",
            color: "#1e9df1",
          },
          {
            icon: <Briefcase size={14} />,
            label:
              lang === "en" ? "Pros" : lang === "th" ? "ผู้ให้" : "Pros",
            color: "#1e9df1",
          },
        ]}
        phoneNotifications={[
          {
            icon: <TrendingUp size={11} />,
            title:
              lang === "en"
                ? "+250 CHF · Referral"
                : lang === "th"
                  ? "+250 CHF · ค่าแนะนำ"
                  : "+250 CHF · Apporteur",
            subtitle:
              lang === "en"
                ? "Marie's link converted"
                : lang === "th"
                  ? "ลิงก์ของ Marie แปลงสำเร็จ"
                  : "Lien de Marie · 1 conversion",
            time: lang === "th" ? "2 น." : "2m",
            color: "#1e9df1",
          },
          {
            icon: <BadgeCheck size={11} />,
            title:
              lang === "en"
                ? "Booking accepted"
                : lang === "th"
                  ? "การจองได้รับการยืนยัน"
                  : "Réservation acceptée",
            subtitle:
              lang === "en"
                ? "Villa du Lac · 4 nights"
                : lang === "th"
                  ? "Villa du Lac · 4 คืน"
                  : "Villa du Lac · 4 nuits",
            time: lang === "th" ? "12 น." : "12m",
            color: "#1e9df1",
          },
          {
            icon: <Mic size={11} />,
            title:
              lang === "en"
                ? "Live started"
                : lang === "th"
                  ? "ไลฟ์เริ่มแล้ว"
                  : "Live démarré",
            subtitle:
              lang === "en"
                ? "« Investing in 2026 »"
                : lang === "th"
                  ? "« ลงทุนในปี 2026 »"
                  : "« Investir en 2026 »",
            time: lang === "th" ? "1 ชม." : "1h",
            color: "#1e9df1",
          },
        ]}
        ctaHeading={
          lang === "en"
            ? "Not a single actor left aside."
            : lang === "th"
              ? "ไม่มีผู้เล่นใดถูกทิ้งไว้"
              : "Pas un acteur laissé de côté."
        }
        ctaDescription={
          lang === "en"
            ? "Whatever your role in real estate, E-Dome already has a place for you."
            : lang === "th"
              ? "ไม่ว่าบทบาทของคุณในวงการอสังหาฯ จะเป็นอะไร E-Dome มีที่สำหรับคุณแล้ว"
              : "Peu importe ton rôle dans l'immobilier, E-Dome a déjà une place pour toi."
        }
        phoneEyebrow={
          lang === "en" ? "E-Dome" : lang === "th" ? "E-Dome" : "E-Dome"
        }
        phoneTitle={
          lang === "en" ? "Founder" : lang === "th" ? "ผู้ก่อตั้ง" : "Fondateur"
        }
        phoneAvatar="ED"
        floatingBadgeTop={{
          icon: <Crown size={18} className="text-[#1e9df1]" strokeWidth={2.2} />,
          title:
            lang === "en"
              ? "Founder unlocked"
              : lang === "th"
                ? "ปลดล็อกผู้ก่อตั้ง"
                : "Membre fondateur",
          subtitle:
            lang === "en"
              ? "Lifetime perks"
              : lang === "th"
                ? "สิทธิตลอดชีพ"
                : "Avantages à vie",
        }}
        floatingBadgeBottom={{
          icon: "🤝",
          title:
            lang === "en"
              ? "Network connected"
              : lang === "th"
                ? "เครือข่ายเชื่อมต่อแล้ว"
                : "Réseau connecté",
          subtitle:
            lang === "en"
              ? "Pros + individuals"
              : lang === "th"
                ? "มืออาชีพ + บุคคล"
                : "Pros + particuliers",
        }}
        ctaButtons={(() => {
          /* Section "Pas un acteur" entière, déplacée ici à la place du
             CTA fondateur. 36 rôles répartis en 3 rangées qui défilent en
             sens alterné (Marquee), suivies d'une trust line. */
          type Role = {
            icon: React.ReactNode;
            color: string;
            fr: string;
            en: string;
            th: string;
          };
          const roles: Role[] = [
            { icon: <Home size={14} />, color: "#1e9df1", fr: "Hôte", en: "Host", th: "เจ้าของบ้าน" },
            { icon: <KeyRound size={14} />, color: "#1e9df1", fr: "Locataire", en: "Tenant", th: "ผู้เช่า" },
            { icon: <ShoppingBag size={14} />, color: "#1e9df1", fr: "Acheteur", en: "Buyer", th: "ผู้ซื้อ" },
            { icon: <Tags size={14} />, color: "#1e9df1", fr: "Vendeur", en: "Seller", th: "ผู้ขาย" },
            { icon: <TrendingUp size={14} />, color: "#1e9df1", fr: "Investisseur", en: "Investor", th: "นักลงทุน" },
            { icon: <Briefcase size={14} />, color: "#1e9df1", fr: "Agent immobilier", en: "Real-estate agent", th: "นายหน้าอสังหาฯ" },
            { icon: <Building2 size={14} />, color: "#1e9df1", fr: "Agence immobilière", en: "Agency", th: "เอเจนซี่อสังหาฯ" },
            { icon: <UserCheck size={14} />, color: "#1e9df1", fr: "Mandataire", en: "Mandated agent", th: "ตัวแทนที่ได้รับมอบหมาย" },
            { icon: <Store size={14} />, color: "#1e9df1", fr: "Marchand de biens", en: "Property dealer", th: "พ่อค้าทรัพย์สิน" },
            { icon: <Calculator size={14} />, color: "#1e9df1", fr: "Courtier", en: "Mortgage broker", th: "นายหน้าสินเชื่อ" },
            { icon: <Scroll size={14} />, color: "#1e9df1", fr: "Notaire", en: "Notary", th: "ทนายรับรองเอกสาร" },
            { icon: <Scale size={14} />, color: "#1e9df1", fr: "Avocat immobilier", en: "Real-estate lawyer", th: "ทนายอสังหาฯ" },
            { icon: <Receipt size={14} />, color: "#1e9df1", fr: "Conseiller fiscal", en: "Tax advisor", th: "ที่ปรึกษาภาษี" },
            { icon: <ClipboardList size={14} />, color: "#1e9df1", fr: "Expert-comptable", en: "Accountant", th: "นักบัญชี" },
            { icon: <Compass size={14} />, color: "#1e9df1", fr: "Architecte", en: "Architect", th: "สถาปนิก" },
            { icon: <Building size={14} />, color: "#1e9df1", fr: "Promoteur", en: "Property developer", th: "นักพัฒนาอสังหาฯ" },
            { icon: <HardHat size={14} />, color: "#1e9df1", fr: "Constructeur", en: "Builder", th: "ผู้รับเหมาก่อสร้าง" },
            { icon: <Ruler size={14} />, color: "#1e9df1", fr: "Géomètre", en: "Surveyor", th: "ผู้สำรวจ" },
            { icon: <ClipboardCheck size={14} />, color: "#1e9df1", fr: "Diagnostiqueur", en: "Inspector", th: "ผู้ตรวจอาคาร" },
            { icon: <Wrench size={14} />, color: "#1e9df1", fr: "Artisan", en: "Tradesman", th: "ช่างฝีมือ" },
            { icon: <Camera size={14} />, color: "#1e9df1", fr: "Photographe", en: "Photographer", th: "ช่างภาพ" },
            { icon: <Video size={14} />, color: "#1e9df1", fr: "Vidéaste", en: "Videographer", th: "ช่างวิดีโอ" },
            { icon: <Sofa size={14} />, color: "#1e9df1", fr: "Home stager", en: "Home stager", th: "Home stager" },
            { icon: <Paintbrush size={14} />, color: "#1e9df1", fr: "Décorateur", en: "Decorator", th: "นักตกแต่ง" },
            { icon: <Lamp size={14} />, color: "#1e9df1", fr: "Designer d'intérieur", en: "Interior designer", th: "นักออกแบบภายใน" },
            { icon: <Landmark size={14} />, color: "#1e9df1", fr: "Banquier", en: "Banker", th: "นายธนาคาร" },
            { icon: <Shield size={14} />, color: "#1e9df1", fr: "Assureur", en: "Insurer", th: "นักประกัน" },
            { icon: <Search size={14} />, color: "#1e9df1", fr: "Estimateur", en: "Appraiser", th: "ผู้ประเมินราคา" },
            { icon: <GraduationCap size={14} />, color: "#1e9df1", fr: "Formateur", en: "Trainer", th: "ผู้ฝึกอบรม" },
            { icon: <Award size={14} />, color: "#1e9df1", fr: "Coach immobilier", en: "Coach", th: "โค้ชอสังหาฯ" },
            { icon: <Megaphone size={14} />, color: "#1e9df1", fr: "Influenceur", en: "Influencer", th: "อินฟลูเอนเซอร์" },
            { icon: <Handshake size={14} />, color: "#1e9df1", fr: "Apporteur d'affaires", en: "Referrer", th: "ผู้แนะนำธุรกิจ" },
            { icon: <Users size={14} />, color: "#1e9df1", fr: "Communauté locale", en: "Local community", th: "ชุมชนท้องถิ่น" },
            { icon: <MapPin size={14} />, color: "#1e9df1", fr: "Voisin", en: "Neighbour", th: "เพื่อนบ้าน" },
            { icon: <Bell size={14} />, color: "#1e9df1", fr: "Concierge", en: "Concierge", th: "ผู้ดูแลคอนโด" },
            { icon: <Boxes size={14} />, color: "#1e9df1", fr: "Syndic", en: "Building manager", th: "ผู้จัดการอาคาร" },
          ];
          const rows = [roles.slice(0, 12), roles.slice(12, 24), roles.slice(24, 36)];
          const rowConfigs: { direction: "left" | "right"; duration: number }[] = [
            { direction: "left", duration: 60 },
            { direction: "right", duration: 70 },
            { direction: "left", duration: 55 },
          ];
          const Pill = ({ role }: { role: Role }) => {
            const label = lang === "en" ? role.en : lang === "th" ? role.th : role.fr;
            return (
              <div className="group flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-full bg-[#f5f5f5] border border-[#1a1a1a]/10 hover:border-[#1e9df1]/40 transition-colors duration-300 whitespace-nowrap">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `${role.color}1f`,
                    color: role.color,
                    boxShadow: `inset 0 0 0 1px ${role.color}33`,
                  }}
                >
                  {role.icon}
                </span>
                <span className="text-sm font-medium text-[#1a1a1a] tracking-tight">
                  {label}
                </span>
              </div>
            );
          };
          return (
            <div className="w-screen flex flex-col items-center">
              <div className="space-y-3 w-full">
                {rows.map((row, rIdx) => (
                  <Marquee
                    key={rIdx}
                    direction={rowConfigs[rIdx].direction}
                    duration={rowConfigs[rIdx].duration}
                    pauseOnHover
                    fadeAmount={6}
                    className="py-1"
                  >
                    {row.map((role, i) => (
                      <Pill key={`${rIdx}-${i}`} role={role} />
                    ))}
                  </Marquee>
                ))}
              </div>
              <p className="max-w-2xl mx-auto px-6 mt-10 text-center text-[#1a1a1a]/70 text-sm md:text-base leading-relaxed font-light">
                {lang === "en" ? (
                  <>
                    <span className="text-[#1a1a1a] font-semibold">36+ professions</span>{" "}
                    already have a profile, a dashboard and a role in E-Dome.{" "}
                    <span className="text-[#1a1a1a]/40">Yours is probably one of them.</span>
                  </>
                ) : lang === "th" ? (
                  <>
                    <span className="text-[#1a1a1a] font-semibold">36+ อาชีพ</span>{" "}
                    มีโปรไฟล์ แดชบอร์ด และบทบาทใน E-Dome แล้ว{" "}
                    <span className="text-[#1a1a1a]/40">ของคุณอาจเป็นหนึ่งในนั้น</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#1a1a1a] font-semibold">36+ métiers</span>{" "}
                    ont déjà un profil, un tableau de bord et un rôle dans E-Dome.{" "}
                    <span className="text-[#1a1a1a]/40">Le tien en fait sûrement partie.</span>
                  </>
                )}
              </p>
            </div>
          );
        })()}
      />

      {/* Transition entre la fin du cinematic (CTA "Devenez membre fondateur"
          visible) et la section "Pas un acteur". Au lieu d'un scroll
          classique, on enveloppe le ScrollStage suivant dans un fade-in qui
          se déclenche à l'entrée du viewport — la section apparaît via
          transition d'opacité plutôt qu'en arrivant brutalement. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
      <ScrollStage>
      {/* La section "Pas un acteur laissé de côté" (heading + description +
          marquee 36 rôles + trust line) a été déplacée dans le CTA du
          CinematicHero ci-dessus. La ScrollStage commence maintenant
          directement avec le moteur économique. */}

      {/* ═══════════════════════ MOTEUR ÉCONOMIQUE ═══════════════════════
          Slide pleine hauteur avec graphique linéaire animé en BG (qui se
          trace au scroll), 4 différenciateurs (commission fixe / sous-marché
          / traçable / dashboard perso), 3 types de liens d'apporteur et un
          rappel "votre tableau de bord en temps réel". */}
      <MoteurEconomiqueSlide lang={lang} slideIdx={0} />


      {/* ═══════════════════════ 4. LES FONDATEURS (zigzag éditorial) ═════════
          Mise en page asymétrique demandée : Léonard ancré à gauche en
          haut, la citation des fondateurs au centre en-dessous de son
          bloc, Jean-Pierre ancré à droite en bas. Photos rondes. */}
      <section id="fondateurs" className="scroll-slide bg-white overflow-hidden relative">
        {/* Volume géométrique anguleux (Zaha Hadid-esque) coin haut-droit,
            blanc, rotation très lente continue. */}
        <div className="hidden lg:block absolute right-[-3%] top-[4%] w-[28%] z-0 pointer-events-none">
          <ArchAngularVolume className="w-full h-auto" />
        </div>
        {/* Table à dessin d'architecte — ancrée TOUT EN BAS de la section,
            forme horizontale qui s'étire le long du pied. Compas qui tourne,
            lampe gooseneck dont le cône pulse, tasse de café qui fume. */}
        <div className="hidden lg:block absolute bottom-0 left-0 w-[44%] z-0 pointer-events-none">
          <ArchDraftingTable className="w-full h-auto" />
        </div>
        {/* Container plus large (max-w-6xl) + padding latéral réduit pour
            que les blocs aient plus de marge à se "décaler" vers les bords.
            Espacements verticaux resserrés afin que le bloc Jean-Pierre
            ne soit plus rogné par le bas du slide. */}
        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 h-full flex flex-col justify-start pt-20 pb-4">
          {/* ── Heading ── */}
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-7">
            <p className="text-[#1e9df1] text-xs tracking-[0.3em] uppercase font-semibold mb-2">
              {lang === "th" ? "ทีมงาน" : lang === "en" ? "The team" : "L'équipe"}
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl leading-[1.05] mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "th" ? (
                <>ทำความ<br /><span className="text-[#1e9df1]">รู้จักกัน</span></>
              ) : lang === "en" ? (
                <>Get to<br /><span className="text-[#1e9df1]">know us.</span></>
              ) : (
                <>Faites<br /><span className="text-[#1e9df1]">connaissance.</span></>
              )}
            </h2>
            <p className="text-[#1a1a1a]/70 text-[0.78rem] sm:text-sm leading-relaxed font-light">
              {lang === "en"
                ? "Two profiles, one conviction: real estate doesn't change with one more app. It changes when its actors are finally connected."
                : lang === "th"
                  ? "สองโปรไฟล์ ความเชื่อเดียว: อสังหาฯ ไม่เปลี่ยนด้วยแอปอีกตัว แต่เปลี่ยนเมื่อผู้เล่นถูกเชื่อมโยงกัน"
                  : "Deux profils, une conviction : l'immobilier ne changera pas avec une app de plus. Il changera quand ses acteurs seront enfin connectés."}
            </p>
          </motion.div>

          {/* ── Léonard à gauche (max-w-sm, mr-auto → flush gauche) ── */}
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-4 max-w-sm mr-auto mb-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 ring-2 ring-[#1e9df1]/30 shadow-lg shadow-[#1e9df1]/10">
              <img
                src="/images/founders/leonard.jpg"
                alt="Léonard Ansermet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
                Léonard Ansermet
              </h3>
              <p className="text-[#1e9df1] text-[0.62rem] sm:text-[0.66rem] font-semibold uppercase tracking-[0.18em] mt-0.5">
                {t("founders.label_leo")}
              </p>
              <p
                className="text-[#1a1a1a]/50 text-[0.74rem] sm:text-[0.8rem] leading-snug font-light italic mt-1.5 border-l-2 border-[#1e9df1]/30 pl-2.5"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {lang === "en"
                  ? "You don't change a sector by adding another tool — you change it by building the place where everything finally connects."
                  : lang === "th"
                    ? "คุณไม่เปลี่ยนวงการด้วยการเพิ่มเครื่องมืออีกตัว — แต่ด้วยการสร้างที่ที่ทุกอย่างเชื่อมต่อกันในที่สุด"
                    : "On ne change pas un secteur en empilant les outils — on le change en bâtissant l'endroit où tout finit enfin par se rejoindre."}
              </p>
            </div>
          </motion.article>

          {/* ── Citation centrée (entre les deux fondateurs) ── */}
          <motion.blockquote
            {...fadeUp}
            className="relative max-w-2xl mx-auto text-center mb-6 px-4"
          >
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#1e9df1]/25 text-4xl leading-none select-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
              aria-hidden
            >
              "
            </span>
            <p
              className="text-sm sm:text-base md:text-lg text-[#1a1a1a] italic leading-snug px-6 pt-1"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {t("founders.quote")}
            </p>
            <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[#1a1a1a]/40 font-bold mt-2">
              — Léonard Ansermet &amp; Jean-Pierre Medard Garza
            </p>
          </motion.blockquote>

          {/* ── Jean-Pierre à droite (max-w-sm, ml-auto → flush droite) ── */}
          <motion.article
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-4 max-w-sm ml-auto mb-6"
          >
            <div className="min-w-0 flex-1 text-right">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
                Jean-Pierre Medard Garza
              </h3>
              <p className="text-[#1e9df1] text-[0.62rem] sm:text-[0.66rem] font-semibold uppercase tracking-[0.18em] mt-0.5">
                {t("founders.label_jp")}
              </p>
              {/* Crédential : CFC employé de commerce + maturité professionnelle */}
              <p className="text-[#1a1a1a]/40 text-[0.62rem] sm:text-[0.66rem] tracking-wide mt-1">
                {lang === "en"
                  ? "Federal commerce diploma · Professional baccalaureate"
                  : lang === "th"
                    ? "ปวช. พาณิชย์ · มัธยมปลายวิชาชีพ"
                    : "CFC employé de commerce · Maturité professionnelle"}
              </p>
              <p
                className="text-[#1a1a1a]/50 text-[0.74rem] sm:text-[0.8rem] leading-snug font-light italic mt-1.5 border-r-2 border-[#1e9df1]/30 pr-2.5"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {lang === "en"
                  ? "Structures the model, partnerships and execution. Convinced that a good idea is never enough — it takes rigorous foundations to make it grow."
                  : lang === "th"
                    ? "จัดโครงสร้างโมเดล พันธมิตร และการดำเนินงาน เชื่อมั่นว่าแนวคิดที่ดีไม่เพียงพอ ต้องมีรากฐานที่เข้มงวดเพื่อให้เติบโต"
                    : "Structure le modèle, les partenariats et l'exécution. Convaincu qu'une bonne idée ne suffit pas — il faut une fondation rigoureuse pour la faire grandir."}
              </p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 ring-2 ring-[#1e9df1]/30 shadow-lg shadow-[#1e9df1]/10">
              <img
                src="/images/founders/jeanpierre.jpg"
                alt="Jean-Pierre Medard Garza"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.article>

          {/* ── Bandeau de contact direct (sous J-P, footer du slide) ──
              Les pills WhatsApp/Email ont été retirées des cartes pour
              alléger ; on les regroupe ici pour un accès direct quand le
              lecteur veut joindre l'un ou l'autre des fondateurs.
              Pas de fadeUp : ce bloc en bas de slide doit être visible
              immédiatement à l'arrivée sur la section (le whileInView
              avec margin -80px ne se déclenchait pas tant que le bas du
              slide n'était pas suffisamment dans le viewport). */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-5 pt-3 border-t border-neutral-900"
          >
            <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[#1a1a1a]/40 font-bold">
              {lang === "en"
                ? "Direct contact"
                : lang === "th"
                  ? "ติดต่อโดยตรง"
                  : "Contact direct"}
            </p>

            {/* Léonard pills — numéro thaï (+66) affiché brut, lien tel:
                pour appel direct depuis mobile/desktop. */}
            <div className="flex items-center gap-2">
              <span className="text-[0.7rem] text-[#1a1a1a]/70 font-semibold">Léonard</span>
              <a
                href="tel:+66910687928"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[#1e9df1] hover:bg-emerald-500/20 transition-colors text-[0.65rem] font-semibold tabular-nums"
              >
                <Phone size={10} /> +66 91 068 7928
              </a>
              <a
                href="mailto:leonard@edome.world"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e9df1]/10 border border-[#1e9df1]/25 text-[#1e9df1] hover:bg-[#1e9df1]/20 transition-colors text-[0.65rem] font-semibold"
              >
                <Mail size={10} /> Email
              </a>
            </div>

            <div className="hidden sm:block w-px h-4 bg-[#e0e0e0]" />

            {/* Jean-Pierre pills — WhatsApp conservé (numéro CH). */}
            <div className="flex items-center gap-2">
              <span className="text-[0.7rem] text-[#1a1a1a]/70 font-semibold">Jean-Pierre</span>
              <a
                href="https://wa.me/41798267542"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[#1e9df1] hover:bg-emerald-500/20 transition-colors text-[0.65rem] font-semibold"
              >
                <MessageCircle size={10} /> {t("founders.whatsapp")}
              </a>
              <a
                href="mailto:jeanpierre@edome.world"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e9df1]/10 border border-[#1e9df1]/25 text-[#1e9df1] hover:bg-[#1e9df1]/20 transition-colors text-[0.65rem] font-semibold"
              >
                <Mail size={10} /> Email
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════ 4. AIDEZ-NOUS À PROUVER LE BESOIN ══════════
          Refonte : section beaucoup plus développée — texte plus dense,
          esthétique enrichie. Composition :
            · Background décoratif (radial glow + dot grid)
            · Header (chip Phase 2 + h2 + sous-titre serif italique +
              paragraphe long + meta-row stats)
            · 3 cartes "Ce que vos réponses débloquent" (validation,
              orientation, partenaires) — explique la valeur de chaque
              réponse
            · Stepper horizontal compact (4 phases avec ligne de connexion)
              à la place de l'ancienne grille de 4 cartes
            · Double CTA (démo + questionnaire) avec badges enrichis
            · Trust strip footer (RGPD, chiffré, anonyme, pas d'engagement) */}
      <section id="inscriptions" className="scroll-slide py-12 px-6 bg-white relative overflow-hidden">
        {/* Radial glow centré en haut (bleu) — donne un point focal et
            adoucit le noir pur. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[55%] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(30,157,241,0.13), transparent 70%)",
          }}
        />
        {/* Dot grid très subtil — texture blueprint discrète. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        {/* Petit volume bas avec auvent + tour technique, coin haut-gauche,
            bleu, drift horizontal. */}
        <div className="hidden lg:block absolute left-[2%] top-[6%] w-[16%] z-0 pointer-events-none">
          <ArchSmallSlab className="w-full h-auto" />
        </div>
        {/* Immeuble cantilever moderne (étages décalés) côté droit, bleu,
            parallaxe scroll vertical inverse. */}
        <div className="hidden lg:block absolute right-[-3%] top-0 bottom-0 w-[22%] z-0 pointer-events-none">
          <ArchCantilever className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto h-full flex flex-col justify-start pt-12 pb-3">
          {/* ── Header : eyebrow + titre + sous-titre italique +
                  paragraphe développé + meta-row de stats ── */}
          <motion.div {...fadeUp} className="text-center mb-5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e9df1]/10 border border-[#1e9df1]/30 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e9df1] animate-pulse" />
              <span className="text-[#1e9df1] text-[0.62rem] tracking-[0.25em] uppercase font-semibold">
                {lang === "en"
                  ? "Phase 2 — validating the need"
                  : lang === "th"
                    ? "เฟส 2 — กำลังพิสูจน์ความต้องการ"
                    : "Phase 2 — validation du besoin"}
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "en" ? (
                <>
                  Help us
                  <br />
                  <span className="text-[#1e9df1]">prove the need.</span>
                </>
              ) : lang === "th" ? (
                <>
                  ช่วยเรา
                  <br />
                  <span className="text-[#1e9df1]">พิสูจน์ความต้องการ</span>
                </>
              ) : (
                <>
                  Aidez-nous à
                  <br />
                  <span className="text-[#1e9df1]">prouver le besoin.</span>
                </>
              )}
            </h2>
            {/* Sous-titre serif italique — passerelle entre le titre et le
                paragraphe. Cadence émotionnelle. */}
            <p
              className="text-[#1e9df1]/85 text-sm sm:text-base italic mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "en"
                ? "Your voice is the raw material of this project."
                : lang === "th"
                  ? "เสียงของคุณคือวัตถุดิบของโครงการนี้"
                  : "Votre voix est la matière première du projet."}
            </p>
            {/* Paragraphe développé — explique le pourquoi avant le quoi. */}
            <p className="text-[#1a1a1a]/70 text-[0.82rem] sm:text-sm leading-relaxed font-light">
              {lang === "en"
                ? "Before raising funds, before assembling a team, before writing a single production line — we want to be sure we're solving a problem that real people live every day. Each answer becomes concrete proof: a quote we can hand to investors, a priority that shapes the next sprint, a frustration we promise to take seriously. Two minutes of your time, weighed like gold on our side."
                : lang === "th"
                  ? "ก่อนระดมทุน ก่อนรวมทีม ก่อนเขียนโค้ดบรรทัดแรก — เราต้องการมั่นใจว่ากำลังแก้ปัญหาที่ผู้คนเผชิญจริง ทุกคำตอบกลายเป็นหลักฐานที่จับต้องได้ : คำพูดที่ส่งให้นักลงทุน ลำดับความสำคัญที่กำหนดสปรินต์ถัดไป ความหงุดหงิดที่เราสัญญาว่าจะรับฟังอย่างจริงจัง สองนาทีของคุณ มีน้ำหนักดั่งทองคำสำหรับเรา"
                  : "Avant de lever les fonds, avant d'assembler l'équipe, avant d'écrire la moindre ligne de code de production — nous voulons être certains de résoudre un vrai problème, vécu au quotidien par de vraies personnes. Chaque réponse devient une preuve concrète : une citation à présenter aux investisseurs, une priorité qui façonne le prochain sprint, une frustration qu'on s'engage à prendre au sérieux. Deux minutes de votre temps — pesées comme de l'or de notre côté."}
            </p>
            {/* Meta-row : stats inline qui rassurent (durée · format ·
                anonymat · engagement). */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.7rem] text-[#1a1a1a]/50 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={11} className="text-[#1e9df1]" />
                {lang === "en" ? "≈ 2 min" : lang === "th" ? "≈ 2 นาที" : "≈ 2 min"}
              </span>
              <span className="text-neutral-700">·</span>
              <span className="inline-flex items-center gap-1.5">
                <ClipboardList size={11} className="text-[#1e9df1]" />
                {lang === "en" ? "12 questions" : lang === "th" ? "12 คำถาม" : "12 questions"}
              </span>
              <span className="text-neutral-700">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Lock size={11} className="text-[#1e9df1]" />
                {lang === "en" ? "100% anonymous" : lang === "th" ? "100% นิรนาม" : "100 % anonyme"}
              </span>
              <span className="text-neutral-700">·</span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck size={11} className="text-[#1e9df1]" />
                {lang === "en" ? "no commitment" : lang === "th" ? "ไม่ผูกพัน" : "sans engagement"}
              </span>
            </div>
          </motion.div>

          {/* ── 3 cartes : "Ce que vos réponses débloquent" ──
              Validation (emerald) · Orientation (blue) · Partenaires
              (amber). Explique pour chaque axe ce que la voix de
              l'utilisateur fait avancer dans le projet. */}
          <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-4xl mx-auto mb-5">
            {[
              {
                icon: <ClipboardCheck size={16} />,
                tone: "emerald" as const,
                eyebrow: lang === "en" ? "Validation" : lang === "th" ? "การยืนยัน" : "Validation",
                title:
                  lang === "en"
                    ? "Confirm the need"
                    : lang === "th"
                      ? "ยืนยันความต้องการ"
                      : "Confirmer le besoin",
                desc:
                  lang === "en"
                    ? "Every answer joins the fundraising deck — direct evidence the market is asking for this platform."
                    : lang === "th"
                      ? "ทุกคำตอบถูกบรรจุในเอกสารระดมทุน — หลักฐานตรงว่าตลาดต้องการแพลตฟอร์มนี้"
                      : "Chaque réponse est versée au dossier de levée — la preuve directe que le marché demande cette plateforme.",
              },
              {
                icon: <Compass size={16} />,
                tone: "blue" as const,
                eyebrow: lang === "en" ? "Direction" : lang === "th" ? "ทิศทาง" : "Orientation",
                title:
                  lang === "en"
                    ? "Shape the priorities"
                    : lang === "th"
                      ? "กำหนดลำดับความสำคัญ"
                      : "Cibler les priorités",
                desc:
                  lang === "en"
                    ? "Your frustrations dictate what we build first. The features you need most are the ones that ship soonest."
                    : lang === "th"
                      ? "ความหงุดหงิดของคุณกำหนดสิ่งที่เราจะสร้างก่อน ฟีเจอร์ที่คุณต้องการที่สุดจะมาก่อน"
                      : "Vos frustrations dictent l'ordre de construction. Les fonctionnalités que vous attendez le plus arrivent en premier.",
              },
              {
                icon: <Megaphone size={16} />,
                tone: "amber" as const,
                eyebrow: lang === "en" ? "Partners" : lang === "th" ? "พันธมิตร" : "Partenaires",
                title:
                  lang === "en"
                    ? "Convince the ecosystem"
                    : lang === "th"
                      ? "โน้มน้าวระบบนิเวศ"
                      : "Convaincre l'écosystème",
                desc:
                  lang === "en"
                    ? "Investors, providers, first ambassadors — they all want concrete signals. Your voices give them exactly that."
                    : lang === "th"
                      ? "นักลงทุน ผู้ให้บริการ ทูตคนแรก — พวกเขาต้องการสัญญาณที่เป็นรูปธรรม เสียงของคุณคือสิ่งนั้น"
                      : "Investisseurs, prestataires, premiers ambassadeurs : tous veulent des signaux concrets. Vos voix les leur donnent.",
              },
            ].map((card, i) => {
              const tone = {
                emerald: {
                  border: "border-emerald-500/30 hover:border-emerald-500/60",
                  bg: "bg-emerald-500/15",
                  text: "text-[#1e9df1]",
                  ring: "ring-emerald-500/20",
                },
                blue: {
                  border: "border-[#1e9df1]/30 hover:border-[#1e9df1]/60",
                  bg: "bg-[#1e9df1]/15",
                  text: "text-[#1e9df1]",
                  ring: "ring-[#1e9df1]/20",
                },
                amber: {
                  border: "border-amber-500/30 hover:border-amber-500/60",
                  bg: "bg-amber-500/15",
                  text: "text-[#1e9df1]",
                  ring: "ring-amber-500/20",
                },
              }[card.tone];
              return (
                <div
                  key={i}
                  className={`relative rounded-xl border p-3.5 bg-[#f5f5f5]/60 backdrop-blur-sm transition-colors ${tone.border}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}>
                      {card.icon}
                    </div>
                    <span className={`text-[0.55rem] tracking-[0.22em] uppercase font-bold ${tone.text}`}>
                      {card.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-[0.82rem] font-bold text-[#1a1a1a] leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-[0.68rem] text-[#1a1a1a]/50 leading-snug">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* ── Stepper horizontal compact — remplace l'ancienne grille
                de 4 cartes. Une ligne de connexion gradient relie les
                noeuds (Fait → Maintenant → 2× À venir). Plus dense
                visuellement, plus narratif (on lit la progression). ── */}
          <motion.div {...fadeUp} className="mb-5 max-w-3xl mx-auto w-full">
            <div className="relative">
              {/* Ligne de connexion entre les noeuds — gradient
                  emerald → bleu → neutral. Calée à la hauteur des dots. */}
              <div className="absolute left-[12%] right-[12%] top-[14px] h-px bg-gradient-to-r from-emerald-500/60 via-[#1e9df1]/60 to-neutral-700 z-0" />
              <div className="relative grid grid-cols-4 gap-2">
                {phases.map((phase, i) => {
                  const isDone = i === 0;
                  const isCurrent = i === 1;
                  const dotCls = isDone
                    ? "bg-emerald-500 ring-emerald-500/25"
                    : isCurrent
                      ? "bg-[#1e9df1] ring-[#1e9df1]/25"
                      : "bg-[#eeeeee] ring-neutral-700/40";
                  const labelText = isDone
                    ? lang === "en" ? "Done" : lang === "th" ? "เสร็จแล้ว" : "Fait"
                    : isCurrent
                      ? lang === "en" ? "Now" : lang === "th" ? "ตอนนี้" : "Maintenant"
                      : lang === "en" ? "Upcoming" : lang === "th" ? "เร็วๆ นี้" : "À venir";
                  const labelCls = isDone
                    ? "text-[#1e9df1]"
                    : isCurrent
                      ? "text-[#1e9df1]"
                      : "text-[#1a1a1a]/40";
                  const titleCls = isDone || isCurrent ? "text-[#1a1a1a]" : "text-[#1a1a1a]/50";
                  return (
                    <div key={i} className="relative flex flex-col items-center text-center px-1">
                      <div className={`relative z-10 w-7 h-7 rounded-full ring-4 ring-black flex items-center justify-center ${dotCls}`}>
                        {isDone ? (
                          <BadgeCheck size={13} className="text-[#1a1a1a]" strokeWidth={2.6} />
                        ) : isCurrent ? (
                          <span className="text-[0.58rem] font-bold text-[#1a1a1a]">02</span>
                        ) : (
                          <span className="text-[0.58rem] font-bold text-[#1a1a1a]/50">0{i + 1}</span>
                        )}
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full bg-[#1e9df1] opacity-40 animate-ping" />
                        )}
                      </div>
                      <p className={`mt-1.5 text-[0.55rem] tracking-[0.22em] uppercase font-bold ${labelCls}`}>
                        {labelText}
                      </p>
                      <h3 className={`mt-0.5 text-[0.7rem] font-semibold leading-tight ${titleCls}`}>
                        {t(phase.titleKey)}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── Bloc CTA double : 2 façons de contribuer ──
              Card 1 (outline) : voir la démo /feed — bas de l'engagement
              Card 2 (filled)  : répondre au questionnaire /acces — conversion */}
          <motion.div
            {...fadeUp}
            className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto mb-3"
          >
            {/* Voir la démo — outline */}
            <Link
              href="/feed"
              className="group relative bg-[#f5f5f5]/80 hover:bg-[#eeeeee] rounded-2xl p-4 border border-[#1a1a1a]/10 hover:border-[#1e9df1]/40 transition-all flex items-center gap-3 backdrop-blur-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1e9df1]/15 text-[#1e9df1] flex items-center justify-center shrink-0 ring-1 ring-[#1e9df1]/30">
                <Eye size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[#1e9df1] font-bold">
                  {lang === "en" ? "Discover" : lang === "th" ? "ค้นพบ" : "Découvrir"}
                </p>
                <h3 className="text-[0.95rem] font-bold text-[#1a1a1a] tracking-tight mt-0.5 leading-tight">
                  {lang === "en"
                    ? "See the demo"
                    : lang === "th"
                      ? "ดูตัวอย่าง"
                      : "Voir la démo"}
                </h3>
                <p className="text-[0.68rem] text-[#1a1a1a]/50 mt-0.5 leading-tight">
                  {lang === "en"
                    ? "Interactive mockup · 30+ pages"
                    : lang === "th"
                      ? "ตัวอย่างใช้งานได้ · 30+ หน้า"
                      : "Maquette interactive · 30+ pages"}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-[#1a1a1a]/40 group-hover:text-[#1e9df1] group-hover:translate-x-1 transition-all shrink-0"
              />
            </Link>

            {/* Répondre au questionnaire — primary, badge "Recommandé" */}
            <Link
              href="/acces"
              className="group relative bg-gradient-to-br from-[#1e9df1]/20 to-[#1e9df1]/5 hover:from-[#1e9df1]/25 hover:to-[#1e9df1]/10 rounded-2xl p-4 border border-[#1e9df1]/40 hover:border-[#1e9df1]/70 transition-all flex items-center gap-3 shadow-lg shadow-[#1e9df1]/10 overflow-hidden"
            >
              {/* Badge "Recommandé" en haut-droite */}
              <span className="absolute top-1.5 right-1.5 text-[0.5rem] tracking-[0.18em] uppercase font-bold bg-[#1e9df1] text-[#1a1a1a] px-1.5 py-0.5 rounded-md">
                {lang === "en" ? "Recommended" : lang === "th" ? "แนะนำ" : "Recommandé"}
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#1e9df1] text-[#1a1a1a] flex items-center justify-center shrink-0 shadow-md shadow-[#1e9df1]/40">
                <Sparkles size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[#1e9df1] font-bold">
                  {lang === "en" ? "Contribute" : lang === "th" ? "มีส่วนร่วม" : "Contribuer"}
                </p>
                <h3 className="text-[0.95rem] font-bold text-[#1a1a1a] tracking-tight mt-0.5 leading-tight">
                  {lang === "en"
                    ? "Take the survey"
                    : lang === "th"
                      ? "ตอบแบบสอบถาม"
                      : "Répondre au questionnaire"}
                </h3>
                <p className="text-[0.68rem] text-[#1a1a1a]/50 mt-0.5 leading-tight">
                  {lang === "en"
                    ? "2 min · free · no commitment"
                    : lang === "th"
                      ? "2 นาที · ฟรี · ไม่ผูกพัน"
                      : "2 min · gratuit · sans engagement"}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-[#1e9df1] group-hover:translate-x-1 transition-all shrink-0"
              />
            </Link>
          </motion.div>

          {/* ── Trust strip footer — rappel discret des engagements
                (RGPD, données chiffrées, aucune revente, anonymat). ── */}
          <motion.div
            {...fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.6rem] text-[#1a1a1a]/40 font-medium"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-emerald-500/80" />
              {lang === "en" ? "GDPR-compliant" : lang === "th" ? "เป็นไปตาม GDPR" : "Conforme RGPD"}
            </span>
            <span className="text-neutral-800">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={10} className="text-emerald-500/80" />
              {lang === "en" ? "Encrypted data" : lang === "th" ? "ข้อมูลถูกเข้ารหัส" : "Données chiffrées"}
            </span>
            <span className="text-neutral-800">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Eye size={10} className="text-emerald-500/80" />
              {lang === "en" ? "No reselling" : lang === "th" ? "ไม่ขายต่อ" : "Aucune revente"}
            </span>
            <span className="text-neutral-800">·</span>
            <span className="inline-flex items-center gap-1.5">
              <UserCheck size={10} className="text-emerald-500/80" />
              {lang === "en" ? "Anonymous answers" : lang === "th" ? "คำตอบนิรนาม" : "Réponses anonymes"}
            </span>
          </motion.div>
        </div>
      </section>
      </ScrollStage>
      </motion.div>

      {/* ═══════════════════════ VRAIE FAQ PROJET ═══════════════════════
          Section autonome (hors ScrollStage) avec les 8 questions clés
          sur E-Dome — la promesse, l'audience, le calendrier, le coût,
          le système d'apporteur, les données, la portée géographique et
          la façon de contribuer. Accordéon `<details>` numéroté. */}
      <section
        id="faq"
        className="bg-white border-t border-neutral-900 py-20 px-6"
      >
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-[#1e9df1] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              FAQ
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "en" ? (
                <>
                  Your questions,
                  <br />
                  <span className="text-[#1e9df1]">our answers.</span>
                </>
              ) : lang === "th" ? (
                <>
                  คำถามของคุณ
                  <br />
                  <span className="text-[#1e9df1]">คำตอบของเรา</span>
                </>
              ) : (
                <>
                  Vos questions,
                  <br />
                  <span className="text-[#1e9df1]">nos réponses.</span>
                </>
              )}
            </h2>
            <p className="text-[#1a1a1a]/50 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
              {lang === "en"
                ? "The questions we hear most often about E-Dome — the project, the model, the data, the launch."
                : lang === "th"
                  ? "คำถามที่เราได้ยินบ่อยที่สุดเกี่ยวกับ E-Dome — โครงการ โมเดล ข้อมูล การเปิดตัว"
                  : "Les questions qu'on nous pose le plus souvent sur E-Dome — le projet, le modèle, vos données, le lancement."}
            </p>
          </motion.div>

          {/* FAQ accordion */}
          <div className="space-y-2.5">
            {(() => {
              const faqs =
                lang === "en"
                  ? [
                      {
                        q: "What exactly is E-Dome?",
                        a: "E-Dome is an all-in-one platform that brings together the entire real estate ecosystem — hosts, agents, referrers, trainers, service providers — in a single space: a social feed, a marketplace, a training campus, live events, a referral network and a verified service directory.",
                      },
                      {
                        q: "Who is E-Dome for?",
                        a: "Anyone connected — closely or loosely — to real estate: owners, agencies, agents, tenants, investors, photographers, notaries, architects, trainers, referrers, neighbours, service providers. We've already mapped 36+ roles, and the list stays open.",
                      },
                      {
                        q: "When will the platform be available?",
                        a: "Public launch happens after Phase 3 — once we've raised funds, assembled a team of designers and developers, and built the final platform together with them. The exact timeline depends on the validation results we're collecting now. The interactive mockup at /feed already lets you explore the future product.",
                      },
                      {
                        q: "How much does it cost?",
                        a: "All platform tools are free. E-Dome is paid only on platform fees (sales between individuals, long-term rental), marketplace commissions (services, events, lives, training, e-commerce, short-term rental) and B2B revenue share on agency partnerships — never a monthly subscription. Optional visibility boosts remain available à la carte. The platform's share is taken at source on each transaction — never added on top for the host or the client.",
                      },
                      {
                        q: "How does the referral system work?",
                        a: "Digital referral marketing. The referrer activates the programme after identity verification (KYC) and generates a personal link for each referral type (host, client, property, course, service). Each conversion is automatically attributed to them. They see their share in real time on their dashboard. The referrer's share is taken from E-Dome's own platform revenue — never added on top of the price. The seller, organiser or service provider can disable the programme on any listing or piece of content. The referrer never negotiates, never represents either party, and is neither an estate agent nor a broker.",
                      },
                      {
                        q: "Is my data protected?",
                        a: "Yes. No reselling, no sharing with third parties. You stay in control of your profile, your visibility and your data. GDPR-compliant from day one.",
                      },
                      {
                        q: "Where will E-Dome be available?",
                        a: "Switzerland and Thailand are markets under consideration for launch — nothing is fixed yet. The final markets will be defined once the company is set up, depending on the situation at that time and the opportunities on the ground. The platform is multilingual from day one (French, English, Thai), so every market can plug in directly. Local legal validation is mandatory before each new market.",
                      },
                      {
                        q: "How can I contribute right now?",
                        a: "By taking the survey (2 min) — every answer is concrete proof that helps validate the need and shape the right priorities. You can also reach the founders directly if you want to go further.",
                      },
                    ]
                  : lang === "th"
                    ? [
                        {
                          q: "E-Dome คืออะไรกันแน่?",
                          a: "E-Dome คือแพลตฟอร์มแบบครบวงจรที่รวบรวมระบบนิเวศอสังหาริมทรัพย์ทั้งหมด — เจ้าของ นายหน้า ผู้แนะนำ ผู้ฝึกอบรม ผู้ให้บริการ — ในพื้นที่เดียว: ฟีดโซเชียล มาร์เก็ตเพลส แคมปัสฝึกอบรม อีเวนต์สด เครือข่ายผู้แนะนำ และไดเรกทอรีผู้ให้บริการที่ผ่านการยืนยัน",
                        },
                        {
                          q: "E-Dome เหมาะกับใคร?",
                          a: "ทุกคนที่เกี่ยวข้องกับอสังหาฯ ไม่ว่าใกล้ชิดหรือห่างไกล: เจ้าของ เอเจนซี่ นายหน้า ผู้เช่า นักลงทุน ช่างภาพ ทนาย สถาปนิก ผู้ฝึกอบรม ผู้แนะนำ เพื่อนบ้าน ผู้ให้บริการ เราระบุ 36+ บทบาทแล้ว และรายการยังเปิดกว้าง",
                        },
                        {
                          q: "แพลตฟอร์มจะเปิดตัวเมื่อไหร่?",
                          a: "การเปิดตัวสาธารณะจะเกิดขึ้นหลังจากเฟส 3 — เมื่อเราระดมทุนได้แล้ว สร้างทีมนักออกแบบและนักพัฒนา และสร้างแพลตฟอร์มเวอร์ชันสุดท้ายร่วมกับพวกเขา ระยะเวลาขึ้นอยู่กับผลการพิสูจน์ความต้องการที่เรากำลังรวบรวมตอนนี้ ตัวอย่างที่ใช้งานได้ที่ /feed ให้คุณสำรวจผลิตภัณฑ์ในอนาคตได้แล้ว",
                        },
                        {
                          q: "มีค่าใช้จ่ายเท่าไหร่?",
                          a: "เครื่องมือทั้งหมดบนแพลตฟอร์มฟรี E-Dome ได้รับค่าตอบแทนเฉพาะจาก ค่าธรรมเนียมแพลตฟอร์ม (ซื้อขายระหว่างบุคคล เช่ารายยาว) ค่าคอมมิชชัน Marketplace (บริการ อีเวนต์ ไลฟ์ การฝึกอบรม อีคอมเมิร์ซ เช่าระยะสั้น) และ Revenue share B2B จากความร่วมมือกับเอเจนซี่ — ไม่มีการสมัครรายเดือนบังคับ ตัวเลือกการเพิ่มการมองเห็นมีให้แบบ à la carte ส่วนแบ่งของแพลตฟอร์มถูกหักที่แหล่งที่มา — ไม่เพิ่มเข้าไปในราคาสำหรับเจ้าของบ้านหรือลูกค้า",
                        },
                        {
                          q: "ระบบผู้แนะนำทำงานอย่างไร?",
                          a: "การตลาดแบบ Referral ดิจิทัล ผู้แนะนำเปิดใช้งานหลังตรวจยืนยันตัวตน (KYC) แล้วสร้างลิงก์ส่วนตัวสำหรับแต่ละประเภทการแนะนำ (เจ้าของบ้าน ลูกค้า ทรัพย์สิน คอร์ส บริการ) ทุกการแปลงถูกระบุเป็นของพวกเขาโดยอัตโนมัติ พวกเขาเห็นส่วนแบ่งเรียลไทม์บนแดชบอร์ด ส่วนแบ่งของผู้แนะนำหักจากรายได้ของ E-Dome — ไม่เพิ่มเข้าไปในราคา ผู้ขาย ผู้จัดงาน หรือผู้ให้บริการ สามารถปิดโปรแกรมในประกาศหรือเนื้อหาของตน ผู้แนะนำไม่ต่อรองราคา ไม่เป็นตัวแทนคู่สัญญาใด และไม่ใช่ทั้งนายหน้าและตัวแทนอสังหาฯ",
                        },
                        {
                          q: "ข้อมูลของฉันได้รับการปกป้องหรือไม่?",
                          a: "ใช่ ไม่ขายต่อ ไม่แบ่งปันกับบุคคลที่สาม คุณยังควบคุมโปรไฟล์ การมองเห็น และข้อมูลของคุณ ปฏิบัติตาม GDPR ตั้งแต่วันแรก",
                        },
                        {
                          q: "E-Dome จะเปิดให้ใช้งานในประเทศใดบ้าง?",
                          a: "สวิตเซอร์แลนด์และไทยเป็นตลาดที่อยู่ระหว่างการพิจารณา ยังไม่มีการตัดสินใจขั้นสุดท้าย ตลาดจะถูกกำหนดในจังหวะที่ตั้งบริษัท ตามสถานการณ์จริงและโอกาสในพื้นที่ แพลตฟอร์มรองรับหลายภาษาตั้งแต่วันแรก (ฝรั่งเศส อังกฤษ ไทย) ทุกตลาดสามารถเข้าร่วมได้ทันที การตรวจสอบทางกฎหมายในประเทศนั้น ๆ จำเป็นต้องทำก่อนเปิดทุกตลาดใหม่",
                        },
                        {
                          q: "ฉันสามารถมีส่วนร่วมตอนนี้ได้อย่างไร?",
                          a: "โดยตอบแบบสอบถาม (2 นาที) — ทุกคำตอบเป็นหลักฐานที่เป็นรูปธรรมที่ช่วยยืนยันความต้องการและกำหนดลำดับความสำคัญที่ถูกต้อง คุณยังสามารถติดต่อผู้ก่อตั้งโดยตรงได้หากคุณต้องการก้าวต่อไป",
                        },
                      ]
                    : [
                        {
                          q: "Qu'est-ce qu'E-Dome exactement ?",
                          a: "E-Dome est une plateforme tout-en-un qui réunit l'écosystème immobilier — hôtes, agents, apporteurs, formateurs, prestataires — dans un seul espace : un fil social, une marketplace, un campus de formations, des lives, un réseau d'apporteurs et un annuaire de prestataires vérifiés.",
                        },
                        {
                          q: "À qui s'adresse E-Dome ?",
                          a: "À tout acteur lié de près ou de loin à l'immobilier : propriétaires, agences, agents, locataires, investisseurs, photographes, notaires, architectes, formateurs, apporteurs, voisins, prestataires. 36+ rôles déjà identifiés, et la liste reste ouverte.",
                        },
                        {
                          q: "Quand la plateforme sera-t-elle disponible ?",
                          a: "Le lancement public a lieu après la Phase 3 — une fois la levée de fonds bouclée, l'équipe de designers et développeurs constituée, et la plateforme finale construite avec eux. Le calendrier exact dépend des résultats de validation que nous collectons maintenant. La maquette interactive sur /feed vous permet déjà d'explorer le futur produit.",
                        },
                        {
                          q: "Combien ça coûte ?",
                          a: "Tous les outils de la plateforme sont gratuits. E-Dome se rémunère uniquement sur des frais de plateforme (ventes entre particuliers, location longue durée), des commissions marketplace (services, événements, lives, formations, e-commerce, location courte durée) et un revenue share B2B sur les partenariats agences — pas d'abonnement mensuel imposé. Des options de mise en avant restent disponibles à la carte. La part de la plateforme est prélevée à la source sur chaque transaction — jamais ajoutée au prix pour l'hôte ou le client.",
                        },
                        {
                          q: "Comment fonctionne le système d'apporteur ?",
                          a: "Referral marketing digital. L'apporteur active la fonction après vérification d'identité (KYC) puis génère un lien personnel pour chaque type d'apport (hôte, client, bien, formation, prestation). Chaque conversion lui est attribuée automatiquement. Il voit sa part en temps réel sur son tableau de bord. La part de l'apporteur est prélevée sur les revenus de plateforme d'E-Dome — jamais ajoutée au prix. Le vendeur, l'organisateur ou le prestataire peut désactiver le programme sur chaque annonce ou contenu. L'apporteur ne négocie pas, ne représente aucune partie, et n'est ni agent immobilier ni courtier.",
                        },
                        {
                          q: "Mes données sont-elles protégées ?",
                          a: "Oui. Aucune revente, aucun partage à des tiers. Vous gardez le contrôle de votre profil, de votre visibilité et de vos données. Conformité RGPD respectée dès le premier jour.",
                        },
                        {
                          q: "Dans quels pays sera disponible E-Dome ?",
                          a: "La Suisse et la Thaïlande sont des marchés envisagés au lancement — rien n'est figé. Les marchés finaux seront définis au moment de la création de la société, selon la situation réelle et les opportunités terrain. La plateforme est multilingue dès le départ (français, anglais, thaï) — chaque marché peut s'y greffer directement. Une validation juridique locale est indispensable avant chaque nouveau marché.",
                        },
                        {
                          q: "Comment puis-je contribuer dès maintenant ?",
                          a: "En répondant au questionnaire (2 min) — chaque réponse est une preuve concrète qui aide à valider le besoin et à orienter les priorités. Vous pouvez aussi contacter directement les fondateurs si vous voulez aller plus loin.",
                        },
                      ];
              return faqs.map((f, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="group bg-[#f5f5f5] rounded-xl border border-[#1a1a1a]/10 hover:border-[#1e9df1]/30 transition-colors overflow-hidden"
                >
                  <summary className="flex items-center gap-4 cursor-pointer list-none px-5 py-4 select-none">
                    <span className="font-mono text-[0.62rem] tracking-[0.22em] text-[#1a1a1a]/40 shrink-0 w-6">
                      0{i + 1}
                    </span>
                    <span className="text-[0.95rem] sm:text-base font-semibold text-[#1a1a1a] flex-1 leading-snug">
                      {f.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-[#1e9df1] group-open:rotate-180 transition-transform shrink-0"
                    />
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-[#1a1a1a]/50 text-sm leading-relaxed font-light pl-10">
                      {f.a}
                    </p>
                  </div>
                </motion.details>
              ));
            })()}
          </div>

          {/* Petit CTA en bas — pour les questions hors-FAQ */}
          <motion.div {...fadeUp} className="text-center mt-10">
            <p className="text-[#1a1a1a]/40 text-sm font-light">
              {lang === "en" ? (
                <>
                  Another question?{" "}
                  <a
                    href="mailto:contact@edome.world"
                    className="text-[#1e9df1] hover:text-[#1a8fd9] underline-offset-4 hover:underline transition-colors font-medium"
                  >
                    contact@edome.world
                  </a>
                </>
              ) : lang === "th" ? (
                <>
                  มีคำถามอื่น?{" "}
                  <a
                    href="mailto:contact@edome.world"
                    className="text-[#1e9df1] hover:text-[#1a8fd9] underline-offset-4 hover:underline transition-colors font-medium"
                  >
                    contact@edome.world
                  </a>
                </>
              ) : (
                <>
                  Une autre question ?{" "}
                  <a
                    href="mailto:contact@edome.world"
                    className="text-[#1e9df1] hover:text-[#1a8fd9] underline-offset-4 hover:underline transition-colors font-medium"
                  >
                    contact@edome.world
                  </a>
                </>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="bg-gray-900 text-[#1a1a1a] pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-semibold mb-3">
                E-<span className="text-[#1e9df1]">Dome</span>
              </h3>
              <p className="text-[#1a1a1a]/50 text-sm font-light leading-relaxed">
                {t("footer.desc")}
              </p>
              <div className="mt-6">
                <Link
                  href="/acces"
                  className="inline-flex items-center gap-2 bg-[#1e9df1] text-[#1a1a1a] rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#1a8fd9] transition-colors"
                >
                  {t("footer.access")} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Demo links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                {t("footer.demo_label")}
              </h4>
              <ul className="space-y-2.5">
                {[
                  "footer.link_feed",
                  "footer.link_marketplace",
                  "footer.link_dashboard",
                  "footer.link_formations",
                  "footer.link_live",
                  "footer.link_messages",
                ].map((key) => (
                  <li key={key}>
                    <span className="text-[#1a1a1a]/50 text-sm hover:text-[#1e9df1] transition-colors cursor-pointer">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                {t("footer.platform_label")}
              </h4>
              <ul className="space-y-2.5">
                {[
                  "footer.link_apporteurs",
                  "footer.link_reservations",
                  "footer.link_statistiques",
                  "footer.link_evenements",
                  "footer.link_services",
                  "footer.link_investisseurs",
                ].map((key) => (
                  <li key={key}>
                    <span className="text-[#1a1a1a]/50 text-sm hover:text-[#1e9df1] transition-colors cursor-pointer">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* About links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                {t("footer.about_label")}
              </h4>
              <ul className="space-y-2.5">
                {[
                  { key: "footer.link_vision", href: "#vision" },
                  { key: "footer.link_features", href: "#fonctionnalites" },
                  { key: "footer.link_founders", href: "#fondateurs" },
                  { key: "footer.link_roadmap", href: "#roadmap" },
                  { key: "footer.link_conditions", href: "#" },
                  { key: "footer.link_privacy", href: "#" },
                ].map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      className="text-[#1a1a1a]/50 text-sm hover:text-[#1e9df1] transition-colors"
                    >
                      {t(link.key)}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact info */}
              <div className="mt-6 space-y-2">
                <a
                  href="mailto:contact@edome.world"
                  className="flex items-center gap-2 text-[#1a1a1a]/50 text-sm hover:text-[#1e9df1] transition-colors"
                >
                  <Mail size={14} /> contact@edome.world
                </a>
                <a
                  href="https://wa.me/41786091880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#1a1a1a]/50 text-sm hover:text-green-500 transition-colors"
                >
                  <Phone size={14} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-[#1a1a1a]/50 text-xs text-center font-light">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
