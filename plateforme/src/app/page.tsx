"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  ChevronDown,
  Clock,
  Eye,
  Gem,
  Gift,
  GraduationCap,
  Handshake,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { FounderBadge } from "@/components/ui/founder-badge";
import { HeroSideStrip } from "@/components/ui/hero-side-strip";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import {
  LandingLanguageProvider,
  useLandingLang,
} from "@/components/landing/landing-i18n";
import { ScrollStage } from "@/components/landing/scroll-stage";

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
  label: string;
  title1: string;
  title2: string;
  description?: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <motion.div {...fadeUp} className="text-[#1e9df1] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
        {label}
      </motion.div>
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
        <motion.div {...fadeUp} className="text-gray-400 text-base sm:text-lg leading-relaxed font-light">
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
    <div className="border-l border-neutral-800 pl-8 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-[#1e9df1]" />
        <p className="text-[#1e9df1] text-[0.65rem] tracking-[0.3em] uppercase font-semibold">
          {eyebrow}
        </p>
      </div>

      {/* Badge premium en tête */}
      <div className="mb-7">
        <FounderBadge brand="E-DOME" title={badgeTitle} />
      </div>

      {/* Liste accordéon des 6 avantages */}
      <ul>
        {benefits.map((b, i) => {
          const Icon = ICONS[i];
          const isOpen = open.includes(i);
          return (
            <li key={i} className="border-t border-neutral-800 first:border-t-0">
              <button
                type="button"
                onClick={() => toggle(i)}
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
                    isOpen ? "w-5 bg-[#1e9df1]" : "w-3 bg-neutral-700 group-hover:w-5 group-hover:bg-[#1e9df1]"
                  }`}
                />
                <span className="text-white text-[0.72rem] font-medium uppercase tracking-[0.15em] flex-1">
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
                    <p className="text-gray-400 text-[0.7rem] leading-relaxed font-light pl-10 pr-2 pb-3">
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
      statusColor: "bg-emerald-900/40 text-emerald-300",
      items: [1, 2, 3, 4, 5, 6, 7].map((n) => `roadmap.phase1_item${n}`),
    },
    {
      titleKey: "roadmap.phase2_title",
      status: t("roadmap.status_current"),
      statusColor: "bg-amber-900/40 text-amber-300",
      items: [1, 2, 3, 4, 5].map((n) => `roadmap.phase2_item${n}`),
    },
    {
      titleKey: "roadmap.phase3_title",
      status: t("roadmap.status_upcoming"),
      statusColor: "bg-neutral-800 text-gray-400",
      items: [1, 2, 3, 4, 5, 6].map((n) => `roadmap.phase3_item${n}`),
    },
    {
      titleKey: "roadmap.phase4_title",
      status: t("roadmap.status_upcoming"),
      statusColor: "bg-neutral-800 text-gray-400",
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
    <div className="bg-black text-white antialiased" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
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
                className="text-gray-400 hover:text-[#1e9df1] text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-lg border border-neutral-800 overflow-hidden">
              {(["fr", "en", "th"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs font-medium px-2.5 py-1.5 transition-colors uppercase ${
                    lang === l
                      ? "bg-[#1e9df1] text-white"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="#inscriptions"
              className="hidden sm:inline-flex bg-[#1e9df1] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#1a8fd9] transition-colors"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </nav>

      <ScrollStage>
      {/* ═══════════════════════ HERO (left-aligned, brutaliste) ═══════════════════════ */}
      <section className="scroll-slide bg-black relative">
        {/* Strip vertical d'architecture sur le bord droit (se déforme au scroll) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 z-20 pointer-events-none">
          <HeroSideStrip />
        </div>

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
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.02] mb-8"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t("hero.title1")}
                <br />
                <span className="text-[#1e9df1] italic">{t("hero.title2")}</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light mb-10 max-w-xl">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#inscriptions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1e9df1] text-white text-sm font-semibold hover:bg-[#1a8fd9] transition-all"
                >
                  {t("hero.cta")} <ArrowRight size={16} />
                </Link>
                <Link
                  href="#vision"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-neutral-700 text-gray-300 text-sm font-medium hover:bg-neutral-900 hover:border-neutral-600 transition-all"
                >
                  {t("hero.learn")}
                </Link>
              </div>
            </motion.div>

            {/* Colonne droite : badge fondateur + 6 avantages (accordéon cliquable) */}
            <motion.div {...fadeUp} className="hidden lg:block lg:col-span-5">
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

      {/* ═══════════════════════ LE CONSTAT ═══════════════════════ */}
      <section id="probleme" className="scroll-slide bg-black relative">
        <div className="min-h-screen flex items-center px-6 py-12">
        <div className="max-w-5xl mx-auto w-full">
          {(() => {
            const data =
              lang === "en"
                ? {
                    intro:
                      "Real estate is a business of network and visibility. Yet today, every actor works in their own silo, on tools that don't talk to each other, and gives away their audience to platforms that don't belong to them. Three invisible walls, that everyone has come to find normal.",
                    problems: [
                      {
                        title: "One activity, ten tools.",
                        body: "An agent posts listings on one portal, chats on another, tracks bookings in a spreadsheet, runs trainings on Zoom, follows commissions by hand. Every added tool is one more wall between them and their own activity.",
                      },
                      {
                        title: "The audience we hand away.",
                        body: "Real-estate content lives on Instagram, TikTok, Facebook — where every day we build an audience that never belongs to us. Every outbound click is a relationship that evaporates to the next platform.",
                      },
                      {
                        title: "Roles kept apart.",
                        body: "Host, referrer, trainer, photographer, prescriber, neighbour — they all make the market run. But each is locked in their own tool, with no way to compensate one another or share a single community.",
                      },
                    ],
                  }
                : lang === "th"
                ? {
                    intro:
                      "อสังหาริมทรัพย์เป็นธุรกิจของเครือข่ายและการมองเห็น แต่วันนี้ ทุกผู้เล่นทำงานในไซโลของตัวเอง บนเครื่องมือที่ไม่สื่อสารกัน และยกผู้ชมให้กับแพลตฟอร์มที่ไม่ได้เป็นของพวกเขา กำแพงที่มองไม่เห็นสามด้าน ที่ทุกคนได้เริ่มมองว่าเป็นเรื่องปกติ",
                    problems: [
                      {
                        title: "หนึ่งกิจกรรม สิบเครื่องมือ",
                        body: "นายหน้าลงประกาศบนพอร์ทัลหนึ่ง แชทบนอีกอันหนึ่ง ติดตามการจองในสเปรดชีต จัดอบรมบน Zoom ตามค่าคอมมิชชันด้วยมือ ทุกเครื่องมือที่เพิ่มเข้ามาคือกำแพงระหว่างเขาและกิจกรรมของเขาเอง",
                      },
                      {
                        title: "ผู้ชมที่เรายกให้ไป",
                        body: "คอนเทนต์อสังหาฯ อยู่บน Instagram, TikTok, Facebook — ที่ซึ่งเราสร้างผู้ชมทุกวัน แต่ผู้ชมเหล่านั้นไม่เคยเป็นของเรา ทุกคลิกออกคือความสัมพันธ์ที่ระเหยไปยังแพลตฟอร์มถัดไป",
                      },
                      {
                        title: "บทบาทที่แยกจากกัน",
                        body: "เจ้าของบ้าน ผู้แนะนำ ผู้ฝึกอบรม ช่างภาพ ผู้บอกต่อ เพื่อนบ้าน — ทุกคนทำให้ตลาดเดินไป แต่แต่ละคนถูกล็อกไว้ในเครื่องมือของตัวเอง โดยไม่มีทางได้รับค่าตอบแทนซึ่งกันและกัน หรือแบ่งปันชุมชนเดียวกัน",
                      },
                    ],
                  }
                : {
                    intro:
                      "L'immobilier est un métier de réseau et de visibilité. Pourtant, aujourd'hui, ses acteurs travaillent chacun dans leur silo, sur des outils qui ne se parlent pas, et cèdent leur audience à des plateformes qui ne leur appartiennent pas. Trois murs invisibles, que tout le monde a fini par trouver normaux.",
                    problems: [
                      {
                        title: "Une activité, dix outils.",
                        body: "Un agent publie ses biens sur un portail, échange sur un autre, suit ses réservations dans un tableur, anime ses formations sur Zoom, traque ses commissions à la main. Chaque outil ajouté est un mur de plus entre lui et sa propre activité.",
                      },
                      {
                        title: "L'audience que l'on cède.",
                        body: "Le contenu immobilier vit sur Instagram, TikTok, Facebook — où l'on construit chaque jour une audience qui n'est jamais à nous. Chaque clic sortant est une relation qui s'évapore au profit de la plateforme suivante.",
                      },
                      {
                        title: "Des rôles tenus à l'écart.",
                        body: "Hôte, apporteur, formateur, photographe, prescripteur, voisin — tous font tourner le marché. Mais chacun reste enfermé dans son outil, sans pouvoir se rémunérer mutuellement ni partager une même communauté.",
                      },
                    ],
                  };

            const problemTag =
              lang === "en" ? "Problem" : lang === "th" ? "ปัญหา" : "Problème";

            return (
              <>
                {/* ── HEADER : label + titre + intro empilés, alignés à gauche ── */}
                <motion.div {...fadeUp} className="mb-8">
                  <p className="text-[#1e9df1] text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-3">
                    {t("problem.label")}
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-white mb-5 max-w-3xl"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {t("problem.title1")}{" "}
                    <span className="text-[#1e9df1]">{t("problem.title2")}</span>
                  </h2>
                  <p className="max-w-3xl text-gray-300 text-sm md:text-base leading-relaxed font-light">
                    {data.intro}
                  </p>
                </motion.div>

                {/* ── 3 PROBLÈMES — phrases concrètes, pas de chiffres ── */}
                <motion.div
                  {...fadeUp}
                  className="grid sm:grid-cols-3 gap-0 border-t border-b border-neutral-800 py-7"
                >
                  {data.problems.map((p, i) => (
                    <div
                      key={i}
                      className="relative px-5 sm:px-7 py-3 border-l border-neutral-800 first:border-l-0 first:pl-0 sm:first:pl-0"
                    >
                      {/* Tag PROBLÈME 0X rouge */}
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={10} className="text-red-500" strokeWidth={2.2} />
                        <p className="font-mono text-red-400 text-[0.6rem] tracking-[0.3em] uppercase font-semibold">
                          {problemTag} 0{i + 1}
                        </p>
                      </div>
                      {/* Titre court — serif, le constat verbalisé */}
                      <h3
                        className="font-serif text-xl md:text-2xl text-white leading-snug mb-3"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {p.title}
                      </h3>
                      {/* Description concrète */}
                      <p className="text-gray-400 text-[0.78rem] md:text-sm leading-relaxed font-light">
                        {p.body}
                      </p>
                    </div>
                  ))}
                </motion.div>
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
            ? "The whole ecosystem, one space."
            : lang === "th"
              ? "ระบบนิเวศทั้งหมด ที่เดียว"
              : "Tout l'écosystème, un seul espace."
        }
        cardDescription={
          lang === "en" ? (
            <>
              <span className="text-white font-semibold">E-Dome</span> connects
              professionals, individuals, prescribers and local contributors in
              a single platform. Content, transactions, conversations, signatures —
              with no redirection, no lost attention.
            </>
          ) : lang === "th" ? (
            <>
              <span className="text-white font-semibold">E-Dome</span>{" "}
              เชื่อมโยงมืออาชีพ บุคคลทั่วไป ผู้แนะนำ และผู้ร่วมในท้องถิ่น
              ไว้ในแพลตฟอร์มเดียว — คอนเทนต์ ธุรกรรม บทสนทนา การลงนาม
              โดยไม่ต้องเปลี่ยนแพลตฟอร์ม
            </>
          ) : (
            <>
              <span className="text-white font-semibold">E-Dome</span> relie pros,
              particuliers, prescripteurs et contributeurs locaux dans une seule
              plateforme. Contenu, transactions, conversations, signatures —
              sans redirection, sans déperdition.
            </>
          )
        }
        metricValue={100}
        metricLabel={
          lang === "en" ? "Founders" : lang === "th" ? "ผู้ก่อตั้ง" : "Fondateurs"
        }
        ctaHeading={
          lang === "en"
            ? "Become a founding member."
            : lang === "th"
              ? "เป็นสมาชิกผู้ก่อตั้ง"
              : "Devenez membre fondateur."
        }
        ctaDescription={
          lang === "en"
            ? "The first 100 profiles get exclusive perks and shape the platform with us."
            : lang === "th"
              ? "100 โปรไฟล์แรกได้รับสิทธิประโยชน์พิเศษและร่วมสร้างแพลตฟอร์มกับเรา"
              : "Les 100 premiers profils accèdent à des avantages exclusifs et façonnent la plateforme avec nous."
        }
        phoneEyebrow={
          lang === "en" ? "E-Dome" : lang === "th" ? "E-Dome" : "E-Dome"
        }
        phoneTitle={
          lang === "en" ? "Founder" : lang === "th" ? "ผู้ก่อตั้ง" : "Fondateur"
        }
        phoneAvatar="ED"
        floatingBadgeTop={{
          icon: "🏛",
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
        ctaButtons={
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/acces"
              className="btn-modern-light flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group"
            >
              <Sparkles size={20} className="text-[#1e9df1]" />
              <div className="text-left">
                <div className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-[-2px]">
                  {lang === "en"
                    ? "Reserve your spot"
                    : lang === "th"
                      ? "จองที่นั่งของคุณ"
                      : "Réservez votre place"}
                </div>
                <div className="text-xl font-bold leading-none tracking-tight">
                  {lang === "en"
                    ? "Become founder"
                    : lang === "th"
                      ? "เป็นผู้ก่อตั้ง"
                      : "Devenir fondateur"}
                </div>
              </div>
            </Link>
            <Link
              href="#fonctionnalites"
              className="btn-modern-dark flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group"
            >
              <ArrowRight size={20} />
              <div className="text-left">
                <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-[-2px]">
                  {lang === "en"
                    ? "What's inside"
                    : lang === "th"
                      ? "สิ่งที่อยู่ภายใน"
                      : "Ce qu'il y a dedans"}
                </div>
                <div className="text-xl font-bold leading-none tracking-tight">
                  {lang === "en"
                    ? "Discover"
                    : lang === "th"
                      ? "ค้นพบ"
                      : "Découvrir"}
                </div>
              </div>
            </Link>
          </div>
        }
      />

      <ScrollStage>
      {/* ═══════════════════════ 1. CINQ PLATEFORMES, UN COMPTE ═══════════════
          Section unique pour décrire E-Dome : ce qui se remplace dans la
          stack (6 features) + la liste des 12 rôles supportés en pied. La
          section "L'écosystème" autonome a été retirée — la promesse est
          déjà portée par CinematicHero juste au-dessus. */}
      <section id="fonctionnalites" className="scroll-slide py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label={
              lang === "en"
                ? "What it replaces"
                : lang === "th"
                  ? "สิ่งที่ถูกแทนที่"
                  : "Ce que ça remplace"
            }
            title1={
              lang === "en"
                ? "Five platforms."
                : lang === "th"
                  ? "ห้าแพลตฟอร์ม"
                  : "Cinq plateformes."
            }
            title2={
              lang === "en"
                ? "One account."
                : lang === "th"
                  ? "บัญชีเดียว"
                  : "Un compte."
            }
            description={
              lang === "en"
                ? "Stop juggling a portal, a feed, a course platform, a video conferencing tool, a spreadsheet and a directory. E-Dome rolls them into one."
                : lang === "th"
                  ? "หยุดสลับใช้พอร์ทัล ฟีด แพลตฟอร์มคอร์ส เครื่องมือประชุม สเปรดชีต และไดเรกทอรี E-Dome รวมทั้งหมดไว้เป็นหนึ่งเดียว"
                  : "Plus besoin de jongler entre un portail, un fil social, une plateforme de cours, un outil de visio, un tableur et un annuaire. E-Dome les regroupe."
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-neutral-900 rounded-2xl p-7 border border-neutral-800 hover:border-[#1e9df1]/30 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1e9df1]/10 text-[#1e9df1] flex items-center justify-center mb-4 group-hover:bg-[#1e9df1] group-hover:text-white transition-colors">
                  {s.icon}
                </div>
                <p className="text-[#1e9df1] text-[0.65rem] tracking-[0.18em] uppercase font-semibold mb-2">
                  {t(s.tagKey)}
                </p>
                <h3 className="text-base font-semibold mb-2 text-white">{t(s.titleKey)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{t(s.descKey)}</p>
              </motion.div>
            ))}
          </div>

          {/* Pour qui — 12 rôles en pied de section */}
          <motion.div {...fadeUp} className="text-center border-t border-neutral-800 pt-10">
            <p className="text-xs text-gray-500 uppercase tracking-[0.25em] mb-5">
              {lang === "en"
                ? "For every role"
                : lang === "th"
                  ? "สำหรับทุกบทบาท"
                  : "Pour chaque rôle"}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {roles.map((roleKey) => (
                <span
                  key={roleKey}
                  className="px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-gray-400"
                >
                  {t(roleKey)}
                </span>
              ))}
              <span className="px-3.5 py-1 rounded-full bg-[#1e9df1]/5 border border-[#1e9df1]/30 text-xs text-[#1e9df1] font-medium">
                {t("about.more")}
              </span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ 3. CHACUN GAGNE SA PART ═════════════════════
          L'apporteur d'affaires comme moteur économique transparent.
          3 types de liens visibles : amener un hôte, un client, un bien. */}
      <section className="scroll-slide py-20 px-6 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            label={
              lang === "en"
                ? "The economic engine"
                : lang === "th"
                  ? "เครื่องยนต์เศรษฐกิจ"
                  : "Le moteur économique"
            }
            title1={
              lang === "en"
                ? "Every role"
                : lang === "th"
                  ? "ทุกบทบาท"
                  : "Chaque rôle"
            }
            title2={
              lang === "en"
                ? "earns a share."
                : lang === "th"
                  ? "ได้รับส่วนแบ่ง"
                  : "a sa part."
            }
            description={
              lang === "en"
                ? "Recommend a host, a client or a property — every connection generates a traceable, automatic commission. No paper, no informal deal, no opacity. Each actor sees their own dashboard in real time."
                : lang === "th"
                  ? "แนะนำเจ้าของบ้าน ลูกค้า หรือทรัพย์สิน — ทุกการเชื่อมต่อสร้างค่าคอมมิชชันที่ติดตามได้และเป็นอัตโนมัติ ไม่มีกระดาษ ไม่มีข้อตกลงนอกระบบ ไม่มีความคลุมเครือ"
                  : "Recommandez un hôte, un client ou un bien — chaque connexion génère une commission traçable, automatique. Pas de paperasse, pas d'accord informel, pas d'opacité. Chacun suit son tableau de bord en temps réel."
            }
          />

          {/* 3 types de liens */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              {
                icon: <Handshake size={22} />,
                tag:
                  lang === "en" ? "Bring a host" : lang === "th" ? "นำเจ้าของบ้าน" : "Amener un hôte",
                title:
                  lang === "en"
                    ? "Reward per activation"
                    : lang === "th"
                      ? "รางวัลต่อการเปิดใช้งาน"
                      : "Récompense par activation",
                body:
                  lang === "en"
                    ? "A property owner publishes their first listing thanks to your link — you earn a fixed commission, paid out monthly."
                    : lang === "th"
                      ? "เจ้าของทรัพย์สินลงประกาศแรกผ่านลิงก์ของคุณ — คุณได้รับค่าคอมมิชชันคงที่ จ่ายรายเดือน"
                      : "Un propriétaire publie son premier bien via votre lien — vous touchez une commission fixe, payée chaque mois.",
              },
              {
                icon: <Users size={22} />,
                tag:
                  lang === "en" ? "Bring a client" : lang === "th" ? "นำลูกค้า" : "Amener un client",
                title:
                  lang === "en"
                    ? "Percent of booking"
                    : lang === "th"
                      ? "เปอร์เซ็นต์ของการจอง"
                      : "Pourcentage sur la réservation",
                body:
                  lang === "en"
                    ? "Your contact books a property they discovered through you — you earn a percentage of every transaction, automatically."
                    : lang === "th"
                      ? "ผู้ติดต่อของคุณจองทรัพย์สินที่พวกเขาค้นพบผ่านคุณ — คุณได้รับเปอร์เซ็นต์ของทุกธุรกรรมโดยอัตโนมัติ"
                      : "Votre contact réserve un bien qu'il a découvert via vous — vous touchez un pourcentage sur chaque transaction, automatiquement.",
              },
              {
                icon: <BadgeCheck size={22} />,
                tag:
                  lang === "en" ? "Bring a property" : lang === "th" ? "นำทรัพย์สิน" : "Amener un bien",
                title:
                  lang === "en"
                    ? "Percent on the sale"
                    : lang === "th"
                      ? "เปอร์เซ็นต์ของการขาย"
                      : "Pourcentage sur la vente",
                body:
                  lang === "en"
                    ? "A property is sold thanks to a referral chain you started — you stay in the chain and you stay paid."
                    : lang === "th"
                      ? "ทรัพย์สินถูกขายผ่านห่วงโซ่การแนะนำที่คุณเริ่มต้น — คุณยังอยู่ในห่วงโซ่และยังคงได้รับเงิน"
                      : "Un bien est vendu via une chaîne de recommandation que vous avez initiée — vous restez dans la chaîne, vous restez payé.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-black/40 rounded-2xl p-7 border border-neutral-800 hover:border-[#1e9df1]/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1e9df1]/10 text-[#1e9df1] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <p className="text-[#1e9df1] text-[0.65rem] tracking-[0.18em] uppercase font-semibold mb-2">
                  {item.tag}
                </p>
                <h3 className="text-base font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust line */}
          <motion.div
            {...fadeUp}
            className="max-w-2xl mx-auto text-center border-t border-neutral-800 pt-8"
          >
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
              {lang === "en" ? (
                <>
                  100% traceable. 100% automatic.{" "}
                  <strong className="text-white font-semibold">No hidden cost</strong> for the
                  host or the client.
                </>
              ) : lang === "th" ? (
                <>
                  ตรวจสอบได้ 100% อัตโนมัติ 100%{" "}
                  <strong className="text-white font-semibold">ไม่มีค่าใช้จ่ายแอบแฝง</strong>{" "}
                  สำหรับเจ้าของบ้านหรือลูกค้า
                </>
              ) : (
                <>
                  100 % traçable. 100 % automatique.{" "}
                  <strong className="text-white font-semibold">Aucun coût caché</strong> pour
                  l'hôte ou le client.
                </>
              )}
            </p>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ 4. LES FONDATEURS (compressé) ═══════════════
          2 cartes côte-à-côte, 1 quote forte, contact unique. */}
      <section id="fondateurs" className="scroll-slide py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-[#1e9df1] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              {lang === "th" ? "ผู้ก่อตั้ง" : lang === "en" ? "Founders" : "Les fondateurs"}
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-5"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "th" ? "เบื้องหลัง" : lang === "en" ? "Behind" : "Derrière"}{" "}
              <span className="text-[#1e9df1]">E-Dome</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto">
              {lang === "en"
                ? "Two profiles, one conviction: real estate doesn't change with one more app. It changes when its actors are finally connected."
                : lang === "th"
                  ? "สองโปรไฟล์ ความเชื่อเดียว: อสังหาฯ ไม่เปลี่ยนด้วยแอปอีกตัว แต่เปลี่ยนเมื่อผู้เล่นถูกเชื่อมโยงกัน"
                  : "Deux profils, une conviction : l'immobilier ne changera pas avec une app de plus. Il changera quand ses acteurs seront enfin connectés."}
            </p>
          </motion.div>

          {/* 2 founder cards side by side */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                name: "Léonard Ansermet",
                role: t("founders.label_leo"),
                photo: "/images/founders/leonard.jpg",
                whatsapp: "https://wa.me/41786091880",
                email: "leonard@edome.world",
              },
              {
                name: "Jean-Pierre Fallet",
                role: t("founders.label_jp"),
                photo: "/images/founders/jeanpierre.jpg",
                whatsapp: "https://wa.me/41798267542",
                email: "jeanpierre@edome.world",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 flex items-center gap-5"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg shrink-0">
                  <img src={f.photo} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white">{f.name}</h3>
                  <p className="text-[#1e9df1] text-xs font-medium mb-2">{f.role}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={f.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[0.7rem] text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <MessageCircle size={12} /> {t("founders.whatsapp")}
                    </a>
                    <a
                      href={`mailto:${f.email}`}
                      className="flex items-center gap-1.5 text-[0.7rem] text-gray-400 hover:text-[#1e9df1] transition-colors"
                    >
                      <Mail size={12} /> Email
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Founders quote */}
          <motion.blockquote
            {...fadeUp}
            className="text-center max-w-3xl mx-auto border-l-2 border-[#1e9df1]/50 pl-6 py-2"
          >
            <p
              className="text-xl sm:text-2xl text-white italic leading-snug"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              «&nbsp;{t("founders.quote")}&nbsp;»
            </p>
          </motion.blockquote>
        </div>
      </section>


      {/* ═══════════════════════ 4. REJOINDRE LES 100 FONDATEURS ════════════
          Section finale conversion qui agrège : la mini-timeline Phase 2
          comme argument d'urgence + 100 places + 6 avantages + FAQ + CTA. */}
      <section id="inscriptions" className="scroll-slide py-20 px-6 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          {/* Header — Phase 2 + 100 places fondues en une seule entrée */}
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e9df1]/10 border border-[#1e9df1]/30 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e9df1] animate-pulse" />
              <span className="text-[#1e9df1] text-[0.65rem] tracking-[0.25em] uppercase font-semibold">
                {lang === "en"
                  ? "Phase 2 — happening now"
                  : lang === "th"
                    ? "เฟส 2 — เกิดขึ้นตอนนี้"
                    : "Phase 2 — en cours"}
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-5"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "en" ? (
                <>
                  100 spots.
                  <br />
                  <span className="text-[#1e9df1]">Not one more.</span>
                </>
              ) : lang === "th" ? (
                <>
                  100 ที่นั่ง
                  <br />
                  <span className="text-[#1e9df1]">ไม่มากกว่านั้น</span>
                </>
              ) : (
                <>
                  100 places.
                  <br />
                  <span className="text-[#1e9df1]">Pas une de plus.</span>
                </>
              )}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
              {lang === "en"
                ? "Concept proven, mockup live. Every interest registered now is the proof that lets us raise funds, build the team and ship the platform — and that's why founding members keep their badge for life."
                : lang === "th"
                  ? "แนวคิดได้รับการพิสูจน์แล้ว ตัวอย่างใช้งานได้จริง ทุกความสนใจที่ลงทะเบียนตอนนี้คือหลักฐานที่ทำให้เราสามารถระดมทุน สร้างทีม และเปิดตัวแพลตฟอร์มได้ — และนั่นคือเหตุผลที่สมาชิกผู้ก่อตั้งจะเก็บป้ายไว้ตลอดชีวิต"
                  : "Concept prouvé, maquette en ligne. Chaque manifestation d'intérêt qu'on récolte maintenant est la preuve qui nous permettra de lever les fonds, constituer l'équipe et lancer la plateforme — c'est pour ça que les membres fondateurs gardent leur badge à vie."}
            </p>
          </motion.div>

          {/* Mini-timeline 4 phases — Phase 2 highlightée */}
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
            {phases.map((phase, i) => {
              const isCurrent = i === 1;
              const isDone = i === 0;
              return (
                <div
                  key={i}
                  className={`rounded-xl p-4 border transition-all ${
                    isCurrent
                      ? "bg-[#1e9df1]/10 border-[#1e9df1]/50"
                      : "bg-black/40 border-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[0.7rem] font-mono ${
                        isDone
                          ? "text-gray-600"
                          : isCurrent
                            ? "text-[#1e9df1]"
                            : "text-gray-500"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[#1e9df1]">
                        {lang === "en" ? "Now" : lang === "th" ? "ตอนนี้" : "Maintenant"}
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-gray-500">
                        {lang === "en" ? "Done" : lang === "th" ? "เสร็จแล้ว" : "Fait"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold leading-snug text-white">
                    {t(phase.titleKey)}
                  </h3>
                </div>
              );
            })}
          </motion.div>

          {/* 6 benefits compact grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1e9df1]/10 text-[#1e9df1] flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold mb-1 text-white">{t(b.titleKey)}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">
                    {t(b.descKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ — handle objections inline */}
          <motion.div {...fadeUp} className="max-w-2xl mx-auto mb-12">
            <p className="text-center text-[0.65rem] tracking-[0.3em] uppercase font-semibold text-gray-500 mb-5">
              {lang === "en" ? "Common questions" : lang === "th" ? "คำถามที่พบบ่อย" : "Questions fréquentes"}
            </p>
            <div className="border-t border-neutral-800">
              {(() => {
                const faqs =
                  lang === "en"
                    ? [
                        {
                          q: "Is it free?",
                          a: "Yes, completely. Registering is a no-commitment expression of interest — no card, no payment.",
                        },
                        {
                          q: "When does the platform launch?",
                          a: "Phase 3 — fundraising and team — starts as soon as we have enough proof. Phase 4 — public launch — follows. The mockup at /feed already shows what's being built.",
                        },
                        {
                          q: "Who can become a founding member?",
                          a: "Anyone who fits one of the 12 ecosystem roles: host, agent, agency, referrer, trainer, photographer, broker, notary, architect, developer, investor, or simply a future client.",
                        },
                        {
                          q: "What if I change my mind later?",
                          a: "You haven't signed up to anything binding. The form is a market signal, not a contract.",
                        },
                      ]
                    : lang === "th"
                      ? [
                          {
                            q: "ฟรีหรือไม่?",
                            a: "ใช่ ฟรีทั้งหมด การลงทะเบียนเป็นการแสดงความสนใจโดยไม่ผูกพัน ไม่ต้องใช้บัตร ไม่มีการชำระเงิน",
                          },
                          {
                            q: "แพลตฟอร์มเปิดตัวเมื่อไหร่?",
                            a: "เฟส 3 — การระดมทุนและทีม — เริ่มต้นทันทีที่เรามีหลักฐานเพียงพอ จากนั้นเฟส 4 — การเปิดตัวสาธารณะ — จะตามมา ตัวอย่างที่ /feed แสดงสิ่งที่กำลังสร้างอยู่แล้ว",
                          },
                          {
                            q: "ใครสามารถเป็นสมาชิกผู้ก่อตั้งได้?",
                            a: "ทุกคนที่อยู่ใน 12 บทบาทของระบบนิเวศ: เจ้าของบ้าน นายหน้า เอเจนซี่ ผู้แนะนำ ผู้ฝึกอบรม ช่างภาพ ที่ปรึกษาสินเชื่อ ทนาย สถาปนิก ผู้พัฒนา นักลงทุน หรือเพียงแค่ลูกค้าในอนาคต",
                          },
                          {
                            q: "ถ้าฉันเปลี่ยนใจในภายหลังล่ะ?",
                            a: "คุณไม่ได้ลงนามในสิ่งที่มีผลผูกพัน แบบฟอร์มเป็นสัญญาณตลาด ไม่ใช่สัญญา",
                          },
                        ]
                      : [
                          {
                            q: "Est-ce gratuit ?",
                            a: "Oui, totalement. S'inscrire est une simple manifestation d'intérêt sans engagement — pas de carte, pas de paiement.",
                          },
                          {
                            q: "Quand sort la plateforme ?",
                            a: "La phase 3 — levée de fonds et constitution de l'équipe — démarre dès que la preuve est suffisante. La phase 4 — lancement public — suit. La maquette sur /feed montre déjà ce qui est en construction.",
                          },
                          {
                            q: "Qui peut devenir membre fondateur ?",
                            a: "Tous les profils qui correspondent à l'un des 12 rôles de l'écosystème : hôte, agent, agence, apporteur, formateur, photographe, courtier, notaire, architecte, promoteur, investisseur ou simplement futur client.",
                          },
                          {
                            q: "Et si je change d'avis ensuite ?",
                            a: "Vous ne vous êtes engagé à rien de contraignant. Le formulaire est un signal de marché, pas un contrat.",
                          },
                        ];
                return faqs.map((f, i) => (
                  <details
                    key={i}
                    className="group border-b border-neutral-800 py-4 cursor-pointer"
                  >
                    <summary className="flex items-start gap-3 list-none select-none">
                      <ChevronDown
                        size={16}
                        className="text-[#1e9df1] mt-0.5 transition-transform group-open:rotate-180 shrink-0"
                      />
                      <span className="text-sm font-medium text-white flex-1">{f.q}</span>
                    </summary>
                    <p className="text-gray-400 text-sm leading-relaxed font-light mt-3 pl-7">
                      {f.a}
                    </p>
                  </details>
                ));
              })()}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div {...fadeUp} className="text-center">
            <Link
              href="/acces"
              className="inline-flex items-center gap-3 bg-[#1e9df1] text-white rounded-xl px-10 py-4 text-base font-semibold hover:bg-[#1a8fd9] transition-all shadow-lg shadow-[#1e9df1]/30"
            >
              <Sparkles size={18} />
              {lang === "en"
                ? "Become a founding member"
                : lang === "th"
                  ? "เป็นสมาชิกผู้ก่อตั้ง"
                  : "Devenir membre fondateur"}
              <ArrowRight size={18} />
            </Link>
            <p className="text-[0.7rem] text-gray-500 mt-4 max-w-md mx-auto">
              {lang === "en"
                ? "Two minutes. Free. No commitment. The form helps us prove the demand and build what you actually need."
                : lang === "th"
                  ? "สองนาที ฟรี ไม่ผูกพัน แบบฟอร์มช่วยให้เราพิสูจน์ความต้องการและสร้างสิ่งที่คุณต้องการจริงๆ"
                  : "Deux minutes. Gratuit. Sans engagement. Le formulaire nous aide à prouver la demande et à construire ce dont vous avez vraiment besoin."}
            </p>
          </motion.div>
        </div>
      </section>
      </ScrollStage>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-semibold mb-3">
                E-<span className="text-[#1e9df1]">Dome</span>
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {t("footer.desc")}
              </p>
              <div className="mt-6">
                <Link
                  href="/acces"
                  className="inline-flex items-center gap-2 bg-[#1e9df1] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#1a8fd9] transition-colors"
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
                    <span className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors cursor-pointer">
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
                    <span className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors cursor-pointer">
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
                      className="text-gray-400 text-sm hover:text-[#1e9df1] transition-colors"
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
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-[#1e9df1] transition-colors"
                >
                  <Mail size={14} /> contact@edome.world
                </a>
                <a
                  href="https://wa.me/41786091880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-green-500 transition-colors"
                >
                  <Phone size={14} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-xs text-center font-light">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
