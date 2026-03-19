"use client";

import { Home, Smartphone, Link2, Settings, BookOpen, TrendingDown, Lock, Megaphone, Handshake, User, Building2, HardHat, GraduationCap, BarChart3, Award, Rocket, Users, Percent, MessageSquare, ArrowRight, Camera, Key, Briefcase, PenTool, Scale } from "lucide-react";
import { TextReveal, GradientText } from "@/components/ui/text-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { AuroraBackground } from "@/components/ui/aurora-bg";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { Counter } from "@/components/ui/counter";
import { GridBackground, DotBackground } from "@/components/ui/grid-bg";
import { useState } from "react";
import { MarketplacePhoneMockup, SocialFeedPhoneMockup, DashboardMockup, ReferralMockup, TrainingMockup } from "@/components/ui/app-mockups";
import { ImagesBadge } from "@/components/ui/images-badge";
import { FloorPlanSVG, BuildingElevationSVG, IsometricVillaSVG, SkylineSVG, ArchDivider, BlueprintOverlay } from "@/components/ui/arch-visuals";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import dynamic from "next/dynamic";
const BeamsBackground = dynamic(() => import("@/components/ui/beams-hero").then(m => ({ default: m.BeamsBackground })), { ssr: false });
import { HouseIcon, TowerThin, VillaLarge, TwinTowers, NeighborhoodPlan, ChaletSVG, ApartmentBlock, CraneSVG, WindowDetail, StairSection, WallSection } from "@/components/ui/arch-extras";
import { ComparisonCards } from "@/components/ui/comparison-cards";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-6 text-left group">
        <span className="text-lg font-semibold pr-4 group-hover:text-[#C4956A] transition-colors">{q}</span>
        <span className={`w-10 h-10 rounded-full bg-[#C4956A]/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          <span className="text-[#C4956A] text-xl">+</span>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-60 pb-6" : "max-h-0"}`}>
        <p className="text-white/60 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

const problems = [
  { icon: TrendingDown, title: "Commissions excessives", desc: "Les plateformes traditionnelles captent une part significative de chaque transaction. Vos marges fondent avant m\u00eame de commencer." },
  { icon: Lock, title: "D\u00e9pendance aux plateformes", desc: "Aucun contr\u00f4le sur votre client\u00e8le. Algorithmes opaques, suspension sans pr\u00e9avis. Vos donn\u00e9es ne vous appartiennent pas." },
  { icon: Megaphone, title: "Visibilit\u00e9 co\u00fbteuse", desc: "Sans budget publicitaire cons\u00e9quent, vos biens restent invisibles. La visibilit\u00e9 organique n\u2019existe plus sur les plateformes actuelles." },
  { icon: Handshake, title: "Recommandations non structur\u00e9es", desc: "Le bouche-\u00e0-oreille g\u00e9n\u00e8re la majorit\u00e9 des transactions, mais aucun outil ne permet de le tracer ni de le r\u00e9mun\u00e9rer automatiquement." },
];

const pillars = [
  { num: "01", icon: Home, title: "Marketplace immobili\u00e8re", desc: "Vente, location courte et longue dur\u00e9e r\u00e9unies dans un seul parcours. Des commissions nettement inf\u00e9rieures au march\u00e9." },
  { num: "02", icon: Smartphone, title: "R\u00e9seau social professionnel", desc: "Publiez du contenu immobilier, b\u00e2tissez votre audience et attirez des prospects de mani\u00e8re organique." },
  { num: "03", icon: Link2, title: "Syst\u00e8me d\u2019apporteurs", desc: "Un lien unique et tra\u00e7able par utilisateur. Commissions calcul\u00e9es et vers\u00e9es automatiquement." },
  { num: "04", icon: Settings, title: "Services int\u00e9gr\u00e9s", desc: "Conciergerie, transport, exp\u00e9riences locales : r\u00e9servables directement depuis chaque bien. Chaque service g\u00e9n\u00e8re des revenus." },
  { num: "05", icon: BookOpen, title: "Formations & communaut\u00e9", desc: "Acc\u00e9dez \u00e0 des formations, webinars et coaching anim\u00e9s par des experts du secteur." },
];

const roles = [
  { icon: User, name: "Client" },
  { icon: Home, name: "H\u00f4te" },
  { icon: Building2, name: "Agence" },
  { icon: HardHat, name: "Promoteur" },
  { icon: Handshake, name: "Apporteur" },
  { icon: BarChart3, name: "Investisseur" },
  { icon: GraduationCap, name: "Formateur" },
  { icon: Key, name: "Propri\u00e9taire" },
  { icon: Camera, name: "Photographe" },
  { icon: Briefcase, name: "Courtier" },
  { icon: PenTool, name: "Architecte" },
  { icon: Scale, name: "Notaire" },
];

const stats = [
  { value: 32, prefix: "$", suffix: "B", label: "March\u00e9 immobilier digital d\u2019ici 2030", src: "Grand View Research" },
  { value: 193, prefix: "$", suffix: "B", label: "March\u00e9 location courte dur\u00e9e 2029", src: "Statista, 2024" },
  { value: 82, prefix: "", suffix: "%", label: "Des transactions impliquent le bouche-\u00e0-oreille", src: "NAR, 2023" },
];

const founders = [
  { icon: Award, label: "Badge fondateur permanent" },
  { icon: Rocket, label: "Acc\u00e8s b\u00eata anticip\u00e9" },
  { icon: BookOpen, label: "Formations offertes" },
  { icon: Users, label: "R\u00e9seau de 100 fondateurs" },
  { icon: Percent, label: "Conditions pr\u00e9f\u00e9rentielles" },
  { icon: MessageSquare, label: "Voix dans les d\u00e9cisions produit" },
];

const faqs = [
  { q: "E-Dome est-il d\u00e9j\u00e0 lanc\u00e9 ?", a: "E-Dome est actuellement en d\u00e9veloppement. Les membres fondateurs b\u00e9n\u00e9ficieront d\u2019un acc\u00e8s b\u00eata exclusif plusieurs semaines avant l\u2019ouverture publique, pr\u00e9vue au second semestre 2025." },
  { q: "La manifestation d\u2019int\u00e9r\u00eat m\u2019engage-t-elle ?", a: "Non. C\u2019est gratuit, confidentiel et sans aucun engagement. Vous pouvez vous d\u00e9sinscrire \u00e0 tout moment." },
  { q: "\u00c0 qui s\u2019adresse E-Dome ?", a: "Tous les acteurs de l\u2019immobilier : agences, h\u00f4tes, propri\u00e9taires, promoteurs, courtiers, architectes, photographes, notaires \u2014 partout dans le monde." },
  { q: "Quelle diff\u00e9rence avec Airbnb ou Booking ?", a: "E-Dome est un \u00e9cosyst\u00e8me complet : r\u00e9seau social professionnel, marketplace multi-services, syst\u00e8me d\u2019apporteurs r\u00e9mun\u00e9r\u00e9s et formations int\u00e9gr\u00e9es. Avec des commissions nettement inf\u00e9rieures." },
  { q: "Comment fonctionne le syst\u00e8me d\u2019apporteurs ?", a: "Chaque utilisateur re\u00e7oit un lien de parrainage unique et tra\u00e7able. Lorsqu\u2019une transaction est g\u00e9n\u00e9r\u00e9e via ce lien, une commission est calcul\u00e9e et vers\u00e9e automatiquement \u2014 sans co\u00fbt suppl\u00e9mentaire pour le client." },
  { q: "Mes donn\u00e9es sont-elles prot\u00e9g\u00e9es ?", a: "Absolument. E-Dome est conforme au RGPD europ\u00e9en. Les paiements transitent par des prestataires certifi\u00e9s PCI-DSS. Vos donn\u00e9es ne sont jamais vendues \u00e0 des tiers." },
  { q: "Comment devenir membre fondateur ?", a: "Remplissez le formulaire de manifestation d\u2019int\u00e9r\u00eat. Notre \u00e9quipe analyse votre profil et vous contacte pour un \u00e9change. Les membres s\u00e9lectionn\u00e9s re\u00e7oivent des avantages permanents d\u00e8s le lancement." },
  { q: "E-Dome est-il limit\u00e9 \u00e0 un seul pays ?", a: "Non. E-Dome est con\u00e7u comme une plateforme internationale. Le lancement initial cible l\u2019Europe francophone, avec une expansion progressive vers le reste du monde." },
];

export default function Page() {
  return (
    <>
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-[4vw] h-[72px] flex items-center justify-between">
          <a href="#" className="text-2xl font-bold tracking-tight">E-<span className="text-[#C4956A]">Dome</span></a>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#probleme" className="text-sm text-white/40 hover:text-white transition-colors">Constat</a>
            <a href="#solution" className="text-sm text-white/40 hover:text-white transition-colors">Solution</a>
            <a href="#marche" className="text-sm text-white/40 hover:text-white transition-colors">March&eacute;</a>
            <a href="#faq" className="text-sm text-white/40 hover:text-white transition-colors">FAQ</a>
            <a href="#rejoindre" className="px-5 py-2 rounded-full bg-[#C4956A] text-[#080808] text-sm font-semibold hover:bg-[#D4A574] transition-all hover:shadow-[0_0_25px_rgba(196,149,106,0.4)]">Rejoindre</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <div className="relative min-h-screen flex items-center justify-center text-center px-6 pt-24 overflow-hidden">
          <BeamsBackground />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080808]/60 via-transparent to-[#080808]/30" />
          <div className="relative z-10 max-w-[900px]">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">Plateforme Immobili&egrave;re Nouvelle G&eacute;n&eacute;ration</span>
              </div>
            </ScrollReveal>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
              <TextReveal>E-Dome</TextReveal>
            </h1>
            <div className="mt-3 text-[clamp(1.3rem,3vw,2.2rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-white/70">
              <TextReveal delay={0.2}>L&apos;&eacute;cosyst&egrave;me immobilier international</TextReveal>
            </div>
            <div className="mt-6 text-[clamp(1.2rem,2.5vw,1.8rem)] font-medium leading-[1.3]">
              <LayoutTextFlip
                text="Une plateforme pour "
                words={["les agences", "les h\u00f4tes", "les promoteurs", "les apporteurs", "les investisseurs", "les architectes", "les notaires", "les photographes", "chaque acteur"]}
                interval={2000}
                className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-medium leading-[1.3]"
              />
            </div>
            <ScrollReveal delay={0.4}>
              <p className="text-white/45 text-base md:text-lg mt-8 max-w-xl mx-auto leading-relaxed">Marketplace, r&eacute;seau social, apporteurs d&apos;affaires, formations et services r&eacute;unis pour chaque professionnel de l&apos;immobilier &mdash; partout dans le monde.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.6}>
              <div className="mt-10">
                <MagneticButton href="#rejoindre">Rejoindre les Fondateurs <ArrowRight className="w-5 h-5" /></MagneticButton>
              </div>
              <p className="text-white/30 text-sm mt-6">Sans engagement &middot; Gratuit &middot; Confidentiel</p>
            </ScrollReveal>
            <ScrollReveal delay={0.8}>
              <div className="mt-12 flex justify-center">
                <ImagesBadge
                  text="Rejoindre les premiers fondateurs"
                  images={[
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop&crop=faces",
                  ]}
                />
              </div>
            </ScrollReveal>
            <div className="mt-16">
              <div className="w-px h-16 mx-auto bg-gradient-to-b from-[#C4956A] to-transparent animate-[scroll-line_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* SKYLINE + SMALL BUILDINGS */}
        <div className="relative overflow-hidden">
          <SkylineSVG className="opacity-30" />
          <div className="absolute top-4 left-[5%] opacity-15"><HouseIcon /></div>
          <div className="absolute top-2 right-[8%] opacity-15"><ChaletSVG /></div>
        </div>

        {/* STATS BAR */}
        <div className="border-y border-white/[0.06] py-16 px-[4vw]">
          <StaggerContainer className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <div className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#C4956A] tracking-tight">
                  <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p className="text-sm text-white/50 mt-2">{s.label}</p>
                <p className="text-xs text-white/25 mt-1 italic">{s.src}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* ARCH DIVIDER */}
        <ArchDivider />

        {/* LE CONSTAT */}
        <GridBackground className="py-32 px-[4vw] relative" id="probleme">
          <BlueprintOverlay />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">Le Constat</span>
              </div>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em] max-w-2xl">
                Le march&eacute; immobilier est <GradientText>fragment&eacute;.</GradientText>
              </h2>
              <p className="text-white/40 mt-4 text-lg max-w-xl">Les acteurs du secteur jonglent entre des outils d&eacute;connect&eacute;s, des commissions &eacute;lev&eacute;es et une visibilit&eacute; d&eacute;pendante de la publicit&eacute;.</p>
            </ScrollReveal>
            <StaggerContainer className="grid md:grid-cols-2 gap-5 mt-14" stagger={0.12}>
              {problems.map((p) => (
                <StaggerItem key={p.title}>
                  <TiltCard className="p-8 h-full">
                    <div className="w-14 h-14 rounded-xl bg-[#C4956A]/10 flex items-center justify-center mb-5">
                      <p.icon className="w-6 h-6 text-[#C4956A]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                    <p className="text-white/50 leading-relaxed">{p.desc}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </GridBackground>

        {/* FLOOR PLAN + DECORATIVE BUILDINGS */}
        <div className="py-8 px-[4vw] max-w-[900px] mx-auto opacity-20 relative">
          <FloorPlanSVG />
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-60"><TowerThin /></div>
          <div className="absolute -right-4 top-1/4 opacity-50"><ApartmentBlock /></div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <section className="py-28 px-[4vw]">
          <div className="max-w-[1000px] mx-auto">
            <ScrollReveal className="text-center mb-12">
              <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-3">Aper&ccedil;u de la plateforme</p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                Votre tableau de bord <GradientText>E-Dome.</GradientText>
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto">G&eacute;rez vos biens, suivez vos revenus et pilotez votre activit&eacute; depuis une interface unique.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <DashboardMockup />
            </ScrollReveal>
          </div>
        </section>

        {/* COMPARAISON SANS / AVEC */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.04em]">Avant et apr&egrave;s <GradientText>E-Dome.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg">Ce qui change concr&egrave;tement pour les professionnels de l&apos;immobilier.</p>
            </ScrollReveal>
            <ComparisonCards />
          </div>
        </section>

        {/* BUILDING ELEVATION + CRANE + DETAILS */}
        <div className="py-8 px-[4vw] relative">
          <div className="max-w-[700px] mx-auto opacity-25">
            <BuildingElevationSVG />
          </div>
          <div className="absolute left-[3%] top-8 opacity-20"><CraneSVG /></div>
          <div className="absolute right-[5%] bottom-12 opacity-20 flex gap-4">
            <WindowDetail />
            <WindowDetail />
            <WindowDetail />
          </div>
          <div className="absolute right-[15%] top-4 opacity-15"><StairSection /></div>
        </div>

        {/* LA SOLUTION — 5 PILIERS */}
        <DotBackground className="py-32 px-[4vw]" id="solution">
          <div className="max-w-[1200px] mx-auto">
            <ScrollReveal className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">La Solution</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">
                Cinq piliers. <GradientText>Un seul &eacute;cosyst&egrave;me.</GradientText>
              </h2>
              <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">E-Dome r&eacute;unit pour la premi&egrave;re fois marketplace, r&eacute;seau social, syst&egrave;me d&apos;apporteurs, services et formations dans une seule plateforme.</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 items-start">
              <div className="space-y-2">
                {pillars.map((p, i) => (
                  <ScrollReveal key={p.title} delay={i * 0.08}>
                    <div className="flex items-center gap-8 md:gap-12 py-10 border-b border-white/[0.06] group hover:bg-white/[0.01] transition-colors rounded-lg px-4 -mx-4">
                      <span className="text-[clamp(3rem,7vw,7rem)] font-extrabold text-white/[0.04] tracking-[-0.05em] hidden md:block min-w-[130px] text-right group-hover:text-white/[0.08] transition-colors">{p.num}</span>
                      <div className="w-16 h-16 rounded-2xl bg-[#C4956A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C4956A]/20 transition-colors">
                        <p.icon className="w-7 h-7 text-[#C4956A]" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-2">{p.title}</h3>
                        <p className="text-white/50 max-w-lg leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="hidden lg:block sticky top-24">
                <MarketplacePhoneMockup />
              </div>
            </div>
          </div>
        </DotBackground>

        {/* LES PROFILS */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 items-center">
              <div className="text-center lg:text-left">
                <ScrollReveal>
                  <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Un compte. <GradientText>Tous les r&ocirc;les.</GradientText></h2>
                  <p className="text-white/40 mt-4 text-lg max-w-xl">Quel que soit votre m&eacute;tier dans l&apos;immobilier, E-Dome s&apos;adapte. Un seul profil, plusieurs r&ocirc;les activables selon votre activit&eacute;.</p>
                </ScrollReveal>
                <StaggerContainer className="flex flex-wrap justify-center lg:justify-start gap-4 mt-12" stagger={0.06}>
                  {roles.map((r) => (
                    <StaggerItem key={r.name}>
                      <TiltCard className="w-[120px] py-7 flex flex-col items-center gap-3">
                        <r.icon className="w-6 h-6 text-[#C4956A]" />
                        <span className="text-xs font-medium text-white/70">{r.name}</span>
                      </TiltCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
              <div className="hidden lg:block">
                <SocialFeedPhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* VILLA + NEIGHBORHOOD + TWIN TOWERS */}
        <ArchDivider />
        <div className="py-12 px-[4vw] relative">
          <div className="max-w-[600px] mx-auto opacity-25">
            <IsometricVillaSVG />
          </div>
          <div className="absolute left-[2%] top-0 opacity-15"><TwinTowers /></div>
          <div className="absolute right-[3%] top-8 opacity-10 max-w-[350px]"><NeighborhoodPlan /></div>
          <div className="absolute left-[20%] bottom-4 opacity-15"><WallSection /></div>
          <div className="absolute right-[25%] bottom-0 opacity-15"><HouseIcon /></div>
        </div>
        {/* FULL-WIDTH VILLA */}
        <div className="py-6 px-[4vw] opacity-15">
          <VillaLarge />
        </div>

        {/* APPORTEURS D'AFFAIRES */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">Apporteurs d&apos;affaires</span>
              </div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.04em]">Recommandez. <GradientText>Gagnez.</GradientText></h2>
              <p className="text-white/50 mt-6 text-lg leading-relaxed max-w-xl">Partagez un lien tra&ccedil;able unique. Chaque transaction g&eacute;n&eacute;r&eacute;e vous rapporte une commission automatique &mdash; sans aucun frais pour le client final.</p>
              <div className="mt-10 space-y-4">
                {[
                  { step: "1", title: "Activez votre lien", desc: "Depuis votre tableau de bord E-Dome" },
                  { step: "2", title: "Partagez", desc: "Biens, clients ou partenaires" },
                  { step: "3", title: "Encaissez", desc: "Commission automatique \u00e0 chaque conversion" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C4956A]/15 border border-[#C4956A]/30 flex items-center justify-center text-[#C4956A] font-bold text-sm shrink-0">{s.step}</div>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-white/40 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <TrainingMockup />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <ReferralMockup />
            </ScrollReveal>
          </div>
        </section>

        {/* MARCH&Eacute; */}
        <GridBackground className="py-32 px-[4vw] min-h-screen flex items-center" id="marche">
          <div className="max-w-[1200px] mx-auto text-center w-full">
            <ScrollReveal>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">
                Un march&eacute; mondial en <GradientText>pleine transformation.</GradientText>
              </h2>
              <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">Aucune plateforme existante ne combine marketplace, r&eacute;seau social, apporteurs, formations et services. E-Dome est le premier &agrave; unifier ces cinq march&eacute;s.</p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16" stagger={0.1}>
              {stats.map((s) => (
                <StaggerItem key={s.label}>
                  <TiltCard className="p-8 text-center h-full">
                    <div className="text-3xl md:text-4xl font-extrabold text-[#C4956A] tracking-tight">
                      <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                    </div>
                    <p className="text-sm text-white/60 mt-3">{s.label}</p>
                    <p className="text-xs text-white/25 mt-1 italic">{s.src}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </GridBackground>

        {/* PROGRAMME FONDATEURS */}
        <AuroraBackground className="py-32 px-[4vw] min-h-screen flex items-center" id="rejoindre">
          <div className="max-w-[1200px] mx-auto text-center w-full">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">Programme Fondateurs</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Fa&ccedil;onnez E-Dome <GradientText>avec nous.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg max-w-xl mx-auto">100 places. S&eacute;lection sur dossier. Avantages permanents d&egrave;s le lancement.</p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-14 max-w-[800px] mx-auto" stagger={0.08}>
              {founders.map((f) => (
                <StaggerItem key={f.label}>
                  <TiltCard className="py-8 flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#C4956A]/10 flex items-center justify-center">
                      <f.icon className="w-7 h-7 text-[#C4956A]" />
                    </div>
                    <h4 className="text-sm font-semibold">{f.label}</h4>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <ScrollReveal delay={0.5} className="mt-14">
              <MagneticButton href="#rejoindre" className="text-xl px-10 py-5">Manifester mon int&eacute;r&ecirc;t <ArrowRight className="w-5 h-5" /></MagneticButton>
            </ScrollReveal>
          </div>
        </AuroraBackground>

        {/* FAQ */}
        <section className="py-32 px-[4vw]" id="faq">
          <div className="max-w-[700px] mx-auto">
            <ScrollReveal className="text-center mb-14">
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Questions <GradientText>fr&eacute;quentes.</GradientText></h2>
            </ScrollReveal>
            <ScrollReveal>
              {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </ScrollReveal>
          </div>
        </section>

        {/* CTA FINAL */}
        <DotBackground className="py-40 px-[4vw] min-h-[80vh] flex items-center justify-center text-center bg-[#0e0e0e]">
          <ScrollReveal>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.05em]">Construisez l&apos;avenir<br />de <GradientText>l&apos;immobilier.</GradientText></h2>
            <p className="text-white/40 mt-6 text-lg max-w-lg mx-auto">Rejoignez les premiers acteurs qui fa&ccedil;onnent la plateforme de demain.</p>
            <div className="mt-12">
              <MagneticButton href="#rejoindre" className="text-xl px-10 py-5">Manifester mon int&eacute;r&ecirc;t <ArrowRight className="w-5 h-5" /></MagneticButton>
            </div>
          </ScrollReveal>
        </DotBackground>
      </main>

      <footer className="py-16 px-[4vw] border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-xl font-bold">E-<span className="text-[#C4956A]">Dome</span></p>
            <p className="text-sm text-white/40 mt-1">&Eacute;cosyst&egrave;me Immobilier International</p>
          </div>
          <div className="flex gap-8 flex-wrap justify-center">
            {[
              { label: "Constat", href: "#probleme" },
              { label: "Solution", href: "#solution" },
              { label: "March\u00e9", href: "#marche" },
              { label: "FAQ", href: "#faq" },
              { label: "Rejoindre", href: "#rejoindre" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-white/30 hover:text-[#C4956A] transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-white/25">&copy; 2024&ndash;2026 E-Dome. Tous droits r&eacute;serv&eacute;s.</p>
        </div>
      </footer>
    </>
  );
}
