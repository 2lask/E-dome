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
  Share2,
  Star,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { FounderBadge } from "@/components/ui/founder-badge";
import { HeroSideStrip } from "@/components/ui/hero-side-strip";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
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
      <motion.div {...fadeUp} className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
        {label}
      </motion.div>
      <motion.h2
        {...fadeUp}
        className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {title1}
        <br />
        <span className="text-[#C4956A]">{title2}</span>
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
        <span className="block w-8 h-px bg-[#C4956A]" />
        <p className="text-[#C4956A] text-[0.65rem] tracking-[0.3em] uppercase font-semibold">
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
                      ? "border-[#C4956A] bg-[#C4956A] text-black"
                      : "border-[#C4956A]/40 bg-[#C4956A]/5 text-[#C4956A] group-hover:bg-[#C4956A] group-hover:text-black"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.8} />
                </span>
                <span
                  className={`block h-px transition-all duration-300 ${
                    isOpen ? "w-5 bg-[#C4956A]" : "w-3 bg-neutral-700 group-hover:w-5 group-hover:bg-[#C4956A]"
                  }`}
                />
                <span className="text-white text-[0.72rem] font-medium uppercase tracking-[0.15em] flex-1">
                  {b.title}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-[#C4956A] transition-transform duration-300 ${
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
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C4956A]/15" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C4956A]/15" />
    </div>
  );
}

/* ─────────── PhoneSlide ──────────────────────────────────────────────
   Slide ScrollStage : iPhone à droite, texte punch à gauche. À l'intérieur
   de l'écran du téléphone, la galerie radiale (composant fourni par
   l'utilisateur) défile au scroll.
   ─────────────────────────────────────────────────────────────────── */
function PhoneSlide({
  videos,
  punch,
  punchEmphasis,
}: {
  videos: { src: string }[];
  punch: string;
  punchEmphasis: string;
}) {
  return (
    <section className="scroll-slide bg-black relative">
      <div className="min-h-screen flex items-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Texte punch */}
          <div className="order-2 lg:order-1 max-w-xl mx-auto lg:mx-0">
            <div className="border-l-2 border-red-500/60 pl-6 py-1">
              <p className="text-white text-base md:text-lg leading-relaxed font-light">
                {punch}{" "}
                <strong className="font-semibold text-white">{punchEmphasis}</strong>
              </p>
            </div>
          </div>

          {/* iPhone — contenu interne défini par le composant fourni */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div style={{ width: 250, height: 526 }}>
              <IPhoneMockup
                model="15-pro"
                color="natural-titanium"
                scale={0.6}
                safeArea={false}
              >
                <div className="absolute inset-0 bg-black overflow-hidden">
                  <RadialScrollGallery
                    baseRadius={180}
                    mobileRadius={180}
                    visiblePercentage={50}
                    scrollDuration={2000}
                    className="!min-h-0 !h-full"
                  >
                    {(hoveredIndex) =>
                      videos.map((video, index) => {
                        const isActive = hoveredIndex === index;
                        return (
                          <div
                            key={index}
                            className="relative w-[80px] h-[110px] overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800 shadow-lg"
                          >
                            <video
                              src={video.src}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                                isActive ? "scale-110" : "scale-100"
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </div>
                        );
                      })
                    }
                  </RadialScrollGallery>
                </div>
              </IPhoneMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
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
            E-<span className="text-[#C4956A]">Dome</span>
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
                className="text-gray-400 hover:text-[#C4956A] text-sm font-medium transition-colors"
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
                      ? "bg-[#C4956A] text-white"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="#inscriptions"
              className="hidden sm:inline-flex bg-[#C4956A] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#b8856a] transition-colors"
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
                <span className="block w-8 h-px bg-[#C4956A]" />
                <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-semibold">
                  {t("hero.label")}
                </p>
              </div>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.02] mb-8"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t("hero.title1")}
                <br />
                <span className="text-[#C4956A] italic">{t("hero.title2")}</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light mb-10 max-w-xl">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#inscriptions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C4956A] text-white text-sm font-semibold hover:bg-[#b8856a] transition-all"
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
                    intro: "Real estate is shattered across dozens of tools, portals and roles that never talk to each other. And while social media has become the single biggest attention lever of the market, every piece of content has to push its audience elsewhere — to another platform, another login, another set of rules.",
                    stats: [
                      { value: "8", unit: "+", label: "Tools per deal", source: "Deloitte Real Estate Outlook, 2024" },
                      { value: "73", unit: "%", label: "Attention lost in redirects", source: "HubSpot State of Marketing, 2024" },
                      { value: "2", unit: "/ 3", label: "Actors locked out", source: "NAR Profile of Home Buyers & Sellers, 2024" },
                    ],
                    punch: "Social content captures millions of eyes — and ushers them straight out the door. Commissions stay high in a market that never consolidated its stack. And owners, prescribers, local contributors — half the living forces of the ecosystem — have nowhere to belong.",
                    punchEmphasis: "Real estate has built walls where it should have built a roof.",
                  }
                : lang === "th"
                ? {
                    intro: "อสังหาริมทรัพย์ถูกแบ่งแยกระหว่างเครื่องมือ พอร์ทัล และบทบาทมากมายที่ไม่เคยเชื่อมต่อกัน และในขณะที่โซเชียลมีเดียกลายเป็นตัวขับเคลื่อนความสนใจที่ใหญ่ที่สุดในตลาด ทุกคอนเทนต์ต้องส่งผู้ชมออกไปยังแพลตฟอร์มอื่น เข้าสู่ระบบอื่น กฎเกณฑ์อื่น",
                    stats: [
                      { value: "8", unit: "+", label: "เครื่องมือต่อดีล", source: "Deloitte, 2024" },
                      { value: "73", unit: "%", label: "ความสนใจหายในการรีไดเรกต์", source: "HubSpot, 2024" },
                      { value: "2", unit: "/ 3", label: "ผู้เล่นถูกกีดกัน", source: "NAR, 2024" },
                    ],
                    punch: "คอนเทนต์โซเชียลดึงดูดสายตาเป็นล้าน — แล้วผลักออกไปทันที ค่าคอมมิชชันยังสูงในตลาดที่ไม่เคยรวมเครื่องมือเข้าด้วยกัน และเจ้าของ ผู้แนะนำ ผู้ร่วมในท้องถิ่น — ครึ่งหนึ่งของพลังของระบบนิเวศ — ไม่มีที่ให้อยู่",
                    punchEmphasis: "อสังหาฯ สร้างกำแพงในที่ที่ควรสร้างหลังคา",
                  }
                : {
                    intro: "Le secteur immobilier reste fragmenté entre des dizaines d'outils, de portails et de rôles qui ne communiquent pas entre eux. Et alors même que les réseaux sociaux sont devenus le plus grand levier d'attention du marché, chaque contenu doit rediriger son audience ailleurs — vers une autre plateforme, un autre identifiant, une autre logique.",
                    stats: [
                      { value: "8", unit: "+", label: "Outils par dossier", source: "Deloitte Real Estate Outlook, 2024" },
                      { value: "73", unit: "%", label: "Attention perdue en redirection", source: "HubSpot State of Marketing, 2024" },
                      { value: "2", unit: "/ 3", label: "Acteurs laissés à la porte", source: "NAR Profile of Home Buyers & Sellers, 2024" },
                    ],
                    punch: "Du contenu social qui capte des millions de regards — et les envoie aussitôt ailleurs. Des commissions élevées dans un marché qui n'a jamais unifié ses outils. Des particuliers, prescripteurs, contributeurs locaux : la moitié des forces vives de l'écosystème, sans endroit pour exister.",
                    punchEmphasis: "L'immobilier a bâti des murs là où il aurait fallu bâtir un toit.",
                  };

            const problemTag =
              lang === "en" ? "Problem" : lang === "th" ? "ปัญหา" : "Problème";
            const sourceLabel =
              lang === "en" ? "Source" : lang === "th" ? "แหล่งที่มา" : "Source";

            return (
              <>
                {/* ── HEADER : label + titre + intro empilés, alignés à gauche ── */}
                <motion.div {...fadeUp} className="mb-10">
                  <p className="text-[#C4956A] text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-3">
                    {t("problem.label")}
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-white mb-5 max-w-3xl"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {t("problem.title1")}{" "}
                    <span className="text-[#C4956A]">{t("problem.title2")}</span>
                  </h2>
                  <p className="max-w-3xl text-gray-300 text-sm md:text-base leading-relaxed font-light">
                    {data.intro}
                  </p>
                </motion.div>

                {/* ── 3 STATS PROBLÈMES : encadrées par 2 rules pour ancrer le bloc ── */}
                <motion.div
                  {...fadeUp}
                  className="grid sm:grid-cols-3 gap-0 border-t border-b border-neutral-800 py-6"
                >
                  {data.stats.map((s, i) => {
                    const TopicIcon = [Layers, Share2, Users][i];
                    return (
                    <div
                      key={i}
                      className="relative px-5 sm:px-7 py-3 border-l border-neutral-800 first:border-l-0 first:pl-0 sm:first:pl-0"
                    >
                      {/* Topic icon — coin haut droit, subtle red */}
                      <TopicIcon
                        size={24}
                        strokeWidth={1}
                        className="absolute top-3 right-5 sm:right-7 text-red-500/30"
                      />
                      {/* Tag PROBLÈME 0X rouge */}
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={10} className="text-red-500" strokeWidth={2.2} />
                        <p className="font-mono text-red-400 text-[0.6rem] tracking-[0.3em] uppercase font-semibold">
                          {problemTag} 0{i + 1}
                        </p>
                      </div>
                      {/* Grand chiffre */}
                      <p
                        className="font-serif text-4xl md:text-5xl text-white leading-[1]"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {s.value}
                        <span className="text-red-500 text-xl ml-2 font-normal align-top">
                          {s.unit}
                        </span>
                      </p>
                      {/* Label majuscule */}
                      <p className="text-white text-[0.72rem] font-semibold uppercase tracking-[0.18em] mt-3 mb-2 leading-snug">
                        {s.label}
                      </p>
                      {/* Source citée en très petit */}
                      <p className="text-gray-600 text-[0.55rem] font-mono tracking-wider">
                        {sourceLabel} : {s.source}
                      </p>
                    </div>
                    );
                  })}
                </motion.div>

              </>
            );
          })()}
        </div>
        </div>
      </section>

      {/* ═══════════════════════ PHONE SLIDE (snap crossfade) ═══ */}
      <PhoneSlide
        videos={phoneVideos}
        punch={phonePunch}
        punchEmphasis={phonePunchEmphasis}
      />

      {/* ═══════════════════════ VISION ═══════════════════════ */}
      <section id="vision" className="scroll-slide py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            label={t("about.label")}
            title1={t("about.title1")}
            title2={t("about.title2")}
          />

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div {...fadeUp} className="text-gray-400 leading-relaxed font-light">
              {t("about.p1")}
            </motion.div>
            <motion.div {...fadeUp} className="text-gray-400 leading-relaxed font-light">
              {t("about.p2")}
            </motion.div>
          </div>

          {/* Roles pills */}
          <motion.div {...fadeUp} className="text-center">
            <p className="text-sm text-gray-400 mb-6">{t("about.roles_label")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {roles.map((roleKey) => (
                <span
                  key={roleKey}
                  className="px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-gray-400 shadow-sm"
                >
                  {t(roleKey)}
                </span>
              ))}
              <span className="px-4 py-1.5 rounded-full bg-[#C4956A]/5 border border-[#C4956A]/20 text-sm text-[#C4956A] font-medium">
                {t("about.more")}
              </span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ VIDEO PLATEFORME ═══════════════════════ */}
      <section className="scroll-slide py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            label={t("featured.label")}
            title1="E-Dome"
            title2={t("featured.label")}
            description={t("featured.desc")}
          />

          <motion.div {...fadeUp} className="rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <video
              className="w-full"
              muted
              autoPlay
              loop
              playsInline
              src="/videos/plateforme-bg.mp4"
            />
          </motion.div>

          <motion.div {...fadeUp} className="text-center text-xs text-gray-400 mt-6 max-w-xl mx-auto">
            {t("featured.disclaimer")}
          </motion.div>

          <motion.div {...fadeUp} className="text-center mt-8">
            <Link
              href="/acces"
              className="inline-flex items-center gap-2 bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all shadow-lg shadow-[#C4956A]/20"
            >
              {t("featured.cta")} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ FONCTIONNALITES ═══════════════════════ */}
      <section id="fonctionnalites" className="scroll-slide py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label={t("services.label")}
            title1={t("services.title1")}
            title2={t("services.title2")}
            description={t("services.subtitle")}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 hover:border-[#C4956A]/30 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C4956A]/10 text-[#C4956A] flex items-center justify-center mb-4 group-hover:bg-[#C4956A] group-hover:text-white transition-colors">
                  {s.icon}
                </div>
                <p className="text-[#C4956A] text-xs tracking-wider uppercase font-medium mb-2">
                  {t(s.tagKey)}
                </p>
                <h3 className="text-lg font-semibold mb-3 text-white">{t(s.titleKey)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{t(s.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════ POURQUOI E-DOME ═══════════════════════ */}
      <section className="scroll-slide py-20 px-6 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            label={t("philosophy.label")}
            title1={t("philosophy.title1")}
            title2={t("philosophy.title2")}
            description={t("philosophy.desc")}
          />

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {philosophyPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800"
              >
                <h3 className="text-lg font-semibold mb-3 text-white">{t(p.titleKey)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{t(p.descKey)}</p>
              </motion.div>
            ))}
          </div>

          {/* Philosophy video */}
          <motion.div {...fadeUp} className="text-center mb-8">
            <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              {t("philosophy.video_label")}
            </p>
            <h3
              className="text-3xl sm:text-4xl mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {t("philosophy.video_title1")}{" "}
              <span className="text-[#C4956A]">{t("philosophy.video_title2")}</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-2 font-light">
              {t("philosophy.video_desktop_p1")}
            </p>
            <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
              {t("philosophy.video_desktop_p2")}
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <video
              className="w-full"
              muted
              autoPlay
              loop
              playsInline
              src="/videos/philosophy-bg.mp4"
            />
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              "philosophy.tag_recherche",
              "philosophy.tag_publication",
              "philosophy.tag_reservation",
              "philosophy.tag_formation",
              "philosophy.tag_recommandation",
              "philosophy.tag_remuneration",
            ].map((key) => (
              <span
                key={key}
                className="px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-gray-400 shadow-sm"
              >
                {t(key)}
              </span>
            ))}
          </motion.div>

          <motion.div {...fadeUp} className="text-center mt-8">
            <Link
              href="/acces"
              className="inline-flex items-center gap-2 border border-[#C4956A]/30 text-[#C4956A] rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#C4956A] hover:text-white transition-all"
            >
              {t("philosophy.video_cta")} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ FONDATEURS ═══════════════════════ */}
      <section id="fondateurs" className="scroll-slide py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              {lang === "th" ? "ผู้ก่อตั้ง" : lang === "en" ? "Founders" : "Fondateurs"}
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[1.1]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {lang === "th" ? "เบื้องหลัง" : lang === "en" ? "Behind" : "Derriere"}{" "}
              <span className="text-[#C4956A]">E-Dome</span>
            </h2>
          </motion.div>

          {/* Leonard */}
          <motion.div {...fadeUp} className="grid md:grid-cols-[280px_1fr] gap-10 mb-16 items-start">
            <div className="text-center md:text-left">
              <div className="w-48 h-48 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-lg mb-4">
                <img
                  src="/images/founders/leonard.jpg"
                  alt="Leonard"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Leonard Ansermet</h3>
              <p className="text-[#C4956A] text-sm font-medium">{t("founders.label_leo")}</p>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                <a
                  href="https://wa.me/41786091880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors"
                >
                  <MessageCircle size={14} /> {t("founders.whatsapp")}
                </a>
                <a
                  href="mailto:leonard@edome.world"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C4956A] transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </div>
            <div>
              <p className="text-gray-400 leading-relaxed font-light mb-4">{t("founders.leo_p1")}</p>
              <p className="text-gray-400 leading-relaxed font-light">{t("founders.leo_p2")}</p>
            </div>
          </motion.div>

          {/* Jean-Pierre */}
          <motion.div {...fadeUp} className="grid md:grid-cols-[280px_1fr] gap-10 mb-16 items-start">
            <div className="text-center md:text-left">
              <div className="w-48 h-48 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-lg mb-4">
                <img
                  src="/images/founders/jeanpierre.jpg"
                  alt="Jean-Pierre"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Jean-Pierre Fallet</h3>
              <p className="text-[#C4956A] text-sm font-medium">{t("founders.label_jp")}</p>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                <a
                  href="https://wa.me/41798267542"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors"
                >
                  <MessageCircle size={14} /> {t("founders.whatsapp")}
                </a>
                <a
                  href="mailto:jeanpierre@edome.world"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C4956A] transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </div>
            <div>
              <p className="text-gray-400 leading-relaxed font-light mb-4">{t("founders.jp_p1")}</p>
              <p className="text-gray-400 leading-relaxed font-light">{t("founders.jp_p2")}</p>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            {...fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p
              className="text-2xl sm:text-3xl text-gray-800 italic leading-snug"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              &ldquo;{t("founders.quote")}&rdquo;
            </p>
          </motion.blockquote>

          {/* Conviction + Engagement */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp} className="bg-neutral-900 rounded-2xl p-8">
              <p className="text-[#C4956A] text-xs tracking-wider uppercase font-semibold mb-3">
                {t("founders.conviction_label")}
              </p>
              <h4 className="text-lg font-semibold mb-3">{t("founders.conviction_title")}</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-light">{t("founders.conviction_desc")}</p>
            </motion.div>
            <motion.div {...fadeUp} className="bg-neutral-900 rounded-2xl p-8">
              <p className="text-[#C4956A] text-xs tracking-wider uppercase font-semibold mb-3">
                {t("founders.engagement_label")}
              </p>
              <h4 className="text-lg font-semibold mb-3">{t("founders.engagement_title")}</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-light">{t("founders.engagement_desc")}</p>
            </motion.div>
          </div>

          {/* Contact */}
          <motion.div {...fadeUp} className="flex items-center justify-center gap-6 mt-12">
            <a
              href="mailto:contact@edome.world"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#C4956A] transition-colors"
            >
              <Mail size={16} /> {t("founders.email_label")}
            </a>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ ROADMAP ═══════════════════════ */}
      <section id="roadmap" className="scroll-slide py-20 px-6 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            label={t("roadmap.label")}
            title1={t("roadmap.title1")}
            title2={t("roadmap.title2")}
            description={t("roadmap.desc")}
          />

          <motion.div {...fadeUp} className="text-center text-gray-400 text-sm font-light mb-16 max-w-2xl mx-auto">
            {t("roadmap.desc2")}
          </motion.div>

          {/* Phases */}
          <div className="space-y-8 mb-20">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-bold text-gray-700">0{i + 1}</span>
                  <h3 className="text-lg font-semibold flex-1">{t(phase.titleKey)}</h3>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${phase.statusColor}`}>
                    {phase.status}
                  </span>
                </div>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {phase.items.map((itemKey) => (
                    <li key={itemKey} className="flex items-start gap-2 text-sm text-gray-400 font-light">
                      <span className="w-1 h-1 rounded-full bg-[#C4956A] mt-2 flex-shrink-0" />
                      {t(itemKey)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* ─── CTA INSCRIPTIONS ─── */}
          <div id="inscriptions">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
                {t("roadmap.inscriptions_label")}
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-4"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t("roadmap.cta_title1")}
                <br />
                <span className="text-[#C4956A]">{t("roadmap.cta_title2")}</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
                {t("roadmap.cta_subtitle")}
              </p>
            </motion.div>

            {/* Benefits grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="bg-neutral-900 rounded-xl p-6 border border-neutral-800"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#C4956A]/10 text-[#C4956A] flex items-center justify-center mb-3">
                    {b.icon}
                  </div>
                  <h4 className="text-sm font-semibold mb-1">{t(b.titleKey)}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">{t(b.descKey)}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <motion.div {...fadeUp} className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <Link
                href="/acces"
                className="inline-flex items-center gap-2 bg-[#C4956A] text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-[#b8856a] transition-all shadow-lg shadow-[#C4956A]/20"
              >
                {t("roadmap.cta1")} <ArrowRight size={16} />
              </Link>
              <Link
                href="/acces"
                className="inline-flex items-center gap-2 border border-neutral-800 text-gray-400 rounded-xl px-8 py-3.5 text-sm font-medium hover:border-[#C4956A]/40 hover:text-[#C4956A] transition-all bg-white"
              >
                {t("roadmap.cta2")}
              </Link>
            </motion.div>

            <motion.div {...fadeUp} className="text-center text-xs text-gray-400 max-w-lg mx-auto">
              {t("roadmap.cta_disclaimer")}
            </motion.div>
          </div>
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
                E-<span className="text-[#C4956A]">Dome</span>
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {t("footer.desc")}
              </p>
              <div className="mt-6">
                <Link
                  href="/acces"
                  className="inline-flex items-center gap-2 bg-[#C4956A] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[#b8856a] transition-colors"
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
                    <span className="text-gray-400 text-sm hover:text-[#C4956A] transition-colors cursor-pointer">
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
                    <span className="text-gray-400 text-sm hover:text-[#C4956A] transition-colors cursor-pointer">
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
                      className="text-gray-400 text-sm hover:text-[#C4956A] transition-colors"
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
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-[#C4956A] transition-colors"
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
