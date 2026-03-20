"use client";

import { Home, Smartphone, Link2, Settings, BookOpen, TrendingDown, Lock, Megaphone, Handshake, User, Building2, HardHat, GraduationCap, BarChart3, Award, Rocket, Users, Percent, MessageSquare, ArrowRight, Camera, Key, Briefcase, PenTool, Scale, ExternalLink, Calendar } from "lucide-react";
import { TextReveal, GradientText } from "@/components/ui/text-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { AuroraBackground } from "@/components/ui/aurora-bg";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { Counter } from "@/components/ui/counter";
import { GridBackground, DotBackground } from "@/components/ui/grid-bg";
import { useState } from "react";
import { MarketplacePhoneMockup, SocialFeedPhoneMockup, DashboardMockup, ReferralMockup, TrainingMockup, MiniDashboard, PropertyAnalyticsMockup, OptionsMockup } from "@/components/ui/app-mockups";
import { ImagesBadge } from "@/components/ui/images-badge";
import { FloorPlanSVG, BuildingElevationSVG, IsometricVillaSVG, SkylineSVG, ArchDivider, BlueprintOverlay } from "@/components/ui/arch-visuals";
import { FounderForm } from "@/components/ui/founder-form";
import { ArchBg3DBuilding, ArchBg3DVilla, ArchBg3DComplex, ArchBgLuxuryVilla } from "@/components/ui/arch-backgrounds";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { SparklesCore } from "@/components/ui/sparkles";
import dynamic from "next/dynamic";
const BeamsBackground = dynamic(() => import("@/components/ui/beams-hero").then(m => ({ default: m.BeamsBackground })), { ssr: false });
import { HouseIcon, TowerThin, VillaLarge, TwinTowers, NeighborhoodPlan, ChaletSVG, ApartmentBlock, CraneSVG, WindowDetail, StairSection, WallSection, SkyscraperDetailed, LuxuryVillaPlan, InteriorPerspective, BuildingCrossSection, ArtDecoFacade, CityBlockPlan, SpiralStaircase, RoofDetail, OfficeIsometric, BridgeSVG } from "@/components/ui/arch-extras";
import { ComparisonCards } from "@/components/ui/comparison-cards";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { RoleCard } from "@/components/ui/role-card";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex justify-between items-center py-6 text-left group">
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
  { icon: TrendingDown, title: "Un secteur fragment\u00e9", color: "#EF4444", desc: "Agences, investisseurs, photographes, notaires \u2014 chacun travaille en silo. Aucune infrastructure partag\u00e9e pour collaborer ou recommander des clients." },
  { icon: Lock, title: "Revenus captur\u00e9s", color: "#F97316", desc: "Les plateformes traditionnelles absorbent une part importante de chaque transaction. Vos marges fondent avant m\u00eame de commencer." },
  { icon: Megaphone, title: "Aucune propri\u00e9t\u00e9", color: "#F59E0B", desc: "Vous construisez votre r\u00e9putation sur des plateformes lou\u00e9es. Quand elles changent leurs r\u00e8gles, vos donn\u00e9es, avis et r\u00e9seau disparaissent." },
  { icon: Handshake, title: "Recommandations perdues", color: "#EC4899", desc: "Le bouche-\u00e0-oreille g\u00e9n\u00e8re la majorit\u00e9 des transactions, mais aucun outil ne permet de le tracer ni de le r\u00e9mun\u00e9rer." },
  { icon: ExternalLink, title: "Attention dispers\u00e9e", color: "#6366F1", desc: "Sur les r\u00e9seaux sociaux, votre contenu immobilier redirige toujours vers un site externe. L\u2019utilisateur quitte, se perd, et l\u2019attention est d\u00e9finitivement perdue." },
];

const pillars = [
  { num: "01", icon: Home, title: "Marketplace immobili\u00e8re", color: "#3B82F6", desc: "Achetez, vendez, louez et investissez avec des frais nettement inf\u00e9rieurs aux plateformes traditionnelles." },
  { num: "02", icon: Smartphone, title: "R\u00e9seau social immobilier", color: "#8B5CF6", desc: "Partagez vos annonces, construisez votre r\u00e9putation et connectez tous les acteurs de l\u2019\u00e9cosyst\u00e8me." },
  { num: "03", icon: Link2, title: "Syst\u00e8me d\u2019apporteurs", color: "#F59E0B", desc: "Recommandations automatiques, liens tra\u00e7ables, commissions vers\u00e9es sans intervention. Le parrainage devient un revenu." },
  { num: "04", icon: Settings, title: "\u00c9cosyst\u00e8me professionnel", color: "#10B981", desc: "Services int\u00e9gr\u00e9s, donn\u00e9es investisseurs, \u00e9v\u00e9nements \u2014 tout ce dont les professionnels ont besoin, au m\u00eame endroit." },
  { num: "05", icon: BookOpen, title: "Formation & \u00e9v\u00e9nements", color: "#EC4899", desc: "Formations certifiantes, webinars d\u2019experts et coaching individuel directement int\u00e9gr\u00e9s \u00e0 la plateforme." },
];

const roles = [
  { icon: User, name: "Client", color: "#8B5CF6", desc: "R\u00e9servez, louez ou achetez des biens dans le monde entier depuis une seule interface." },
  { icon: Home, name: "H\u00f4te", color: "#3B82F6", desc: "G\u00e9rez vos biens, recevez des r\u00e9servations et augmentez vos revenus avec moins de commissions." },
  { icon: Building2, name: "Agence", color: "#8B5CF6", desc: "Publiez vos mandats, g\u00e9n\u00e9rez des leads organiques et pilotez votre activit\u00e9 depuis un dashboard." },
  { icon: HardHat, name: "Promoteur", color: "#10B981", desc: "Pr\u00e9sentez vos projets \u00e0 une audience qualifi\u00e9e et suivez les manifestations d\u2019int\u00e9r\u00eat." },
  { icon: Handshake, name: "Apporteur", color: "#F59E0B", desc: "Partagez un lien tra\u00e7able et touchez automatiquement une commission sur chaque transaction." },
  { icon: BarChart3, name: "Investisseur", color: "#EF4444", desc: "Acc\u00e9dez \u00e0 des opportunit\u00e9s immobili\u00e8res v\u00e9rifi\u00e9es et suivez vos rendements en temps r\u00e9el." },
  { icon: GraduationCap, name: "Formateur", color: "#EC4899", desc: "Cr\u00e9ez et vendez vos formations, webinars et coaching directement sur la plateforme." },
  { icon: Key, name: "Propri\u00e9taire", color: "#06B6D4", desc: "Pilotez vos biens, suivez vos revenus locatifs et acc\u00e9dez \u00e0 des services de gestion." },
  { icon: Camera, name: "Photographe", color: "#F97316", desc: "Montrez votre portfolio, recevez des demandes de shooting directement depuis les annonces." },
  { icon: Briefcase, name: "Courtier", color: "#6366F1", desc: "D\u00e9veloppez votre r\u00e9seau, trouvez des mandats et g\u00e9rez vos transactions immobili\u00e8res." },
  { icon: PenTool, name: "Architecte", color: "#C4956A", desc: "Pr\u00e9sentez vos projets, attirez de nouveaux clients et collaborez avec les promoteurs." },
  { icon: Scale, name: "Notaire", color: "#14B8A6", desc: "Simplifiez vos transactions, recevez des dossiers compl\u00e9t\u00e9s et signez num\u00e9riquement." },
];

const stats = [
  { value: 32, prefix: "$", suffix: "B", label: "March\u00e9 immobilier digital d\u2019ici 2030", src: "Grand View Research", color: "#3B82F6", icon: Building2 },
  { value: 193, prefix: "$", suffix: "B", label: "March\u00e9 location courte dur\u00e9e 2029", src: "Statista, 2024", color: "#10B981", icon: Home },
  { value: 82, prefix: "", suffix: "%", label: "Des transactions impliquent le bouche-\u00e0-oreille", src: "NAR, 2023", color: "#F59E0B", icon: Handshake },
];

const founders = [
  { icon: Award, label: "Badge fondateur permanent", color: "#F59E0B", desc: "Un marqueur de confiance visible sur votre profil, pour toujours." },
  { icon: Rocket, label: "Acc\u00e8s b\u00eata anticip\u00e9", color: "#3B82F6", desc: "Explorez et testez chaque fonctionnalit\u00e9 avant l\u2019ouverture publique." },
  { icon: BookOpen, label: "Formations offertes", color: "#EC4899", desc: "Webinars exclusifs et coaching individuel inclus dans le programme." },
  { icon: Users, label: "R\u00e9seau exclusif de fondateurs", color: "#8B5CF6", desc: "Rejoignez un cercle de professionnels s\u00e9lectionn\u00e9s, pr\u00eats \u00e0 collaborer." },
  { icon: Calendar, label: "Parcours avant lancement", color: "#10B981", desc: "Inscription, s\u00e9lection, conf\u00e9rence explicative, configuration de votre compte \u2014 tout avant l\u2019ouverture officielle." },
  { icon: MessageSquare, label: "Voix dans les d\u00e9cisions", color: "#06B6D4", desc: "Acc\u00e9dez \u00e0 la roadmap en avant-premi\u00e8re et influencez les prochaines \u00e9tapes." },
];

const faqs = [
  { q: "E-Dome est-il d\u00e9j\u00e0 lanc\u00e9 ?", a: "E-Dome est actuellement en d\u00e9veloppement. Le lancement mondial est pr\u00e9vu en 2026. Les membres fondateurs b\u00e9n\u00e9ficieront d\u2019un acc\u00e8s b\u00eata exclusif avant l\u2019ouverture publique." },
  { q: "La manifestation d\u2019int\u00e9r\u00eat m\u2019engage-t-elle ?", a: "Non. C\u2019est gratuit, confidentiel et sans aucun engagement. Vous pouvez vous d\u00e9sinscrire \u00e0 tout moment." },
  { q: "\u00c0 qui s\u2019adresse E-Dome ?", a: "Tous les acteurs de l\u2019immobilier : agences, h\u00f4tes, propri\u00e9taires, promoteurs, courtiers, architectes, photographes, notaires \u2014 partout dans le monde." },
  { q: "Quelle diff\u00e9rence avec Airbnb ou Booking ?", a: "E-Dome est un \u00e9cosyst\u00e8me complet : r\u00e9seau social professionnel, marketplace multi-services, syst\u00e8me d\u2019apporteurs r\u00e9mun\u00e9r\u00e9s et formations int\u00e9gr\u00e9es. Avec des commissions nettement inf\u00e9rieures." },
  { q: "Comment fonctionne le syst\u00e8me d\u2019apporteurs ?", a: "Chaque utilisateur re\u00e7oit un lien de parrainage unique et tra\u00e7able. Lorsqu\u2019une transaction est g\u00e9n\u00e9r\u00e9e via ce lien, une commission est calcul\u00e9e et vers\u00e9e automatiquement \u2014 sans co\u00fbt suppl\u00e9mentaire pour le client." },
  { q: "Mes donn\u00e9es sont-elles prot\u00e9g\u00e9es ?", a: "Absolument. E-Dome est conforme au RGPD europ\u00e9en. Les paiements transitent par des prestataires certifi\u00e9s PCI-DSS. Vos donn\u00e9es ne sont jamais vendues \u00e0 des tiers." },
  { q: "Comment devenir membre fondateur ?", a: "Inscrivez-vous via le formulaire membre fondateur. Votre profil est analys\u00e9 et s\u00e9lectionn\u00e9 avant le lancement. Vous participez ensuite \u00e0 une conf\u00e9rence en ligne o\u00f9 toutes les fonctionnalit\u00e9s et options de la plateforme sont pr\u00e9sent\u00e9es en d\u00e9tail, avec un temps de questions-r\u00e9ponses. Enfin, vous configurez votre compte avant l\u2019ouverture officielle." },
  { q: "E-Dome est-il limit\u00e9 \u00e0 un seul pays ?", a: "Non. E-Dome est con\u00e7u comme une plateforme internationale. Le lancement initial cible l\u2019Europe francophone, avec une expansion progressive vers le reste du monde." },
];

export default function Page() {
  return (
    <>
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-[4vw] h-[72px] flex items-center justify-between">
          <a href="#" className="text-2xl font-bold tracking-tight">E-<span className="text-[#C4956A]">Dome</span></a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#probleme" className="text-sm text-white/40 hover:text-white transition-colors">Constat</a>
            <a href="#solution" className="text-sm text-white/40 hover:text-white transition-colors">Solution</a>
            <a href="#marketplace" className="text-sm text-white/40 hover:text-white transition-colors">Marketplace</a>
            <a href="#social" className="text-sm text-white/40 hover:text-white transition-colors">R&eacute;seau social</a>
            <a href="#apporteurs" className="text-sm text-white/40 hover:text-white transition-colors">Apporteurs</a>
            <a href="#formations" className="text-sm text-white/40 hover:text-white transition-colors">Formations</a>
            <a href="#faq" className="text-sm text-white/40 hover:text-white transition-colors">FAQ</a>
            <a href="#rejoindre" className="px-5 py-2 rounded-full bg-[#C4956A] text-[#080808] text-sm font-semibold hover:bg-[#D4A574] transition-all hover:shadow-[0_0_25px_rgba(196,149,106,0.4)]">Rejoindre</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
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
              <TextReveal>Projet E-Dome</TextReveal>
            </h1>
            <div className="mt-3 text-[clamp(1.3rem,3vw,2.2rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-white/70">
              <TextReveal delay={0.2}>Unifions l&apos;&eacute;cosyst&egrave;me immobilier mondial</TextReveal>
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
              <p className="text-white/40 text-base md:text-lg mt-8 max-w-xl mx-auto leading-relaxed">Marketplace, r&eacute;seau social, apporteurs d&apos;affaires, formations et services &mdash; tout ce dont les professionnels de l&apos;immobilier ont besoin, r&eacute;uni pour la premi&egrave;re fois.</p>
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

        {/* LE CONSTAT */}
        <GridBackground className="py-32 px-[4vw] relative" id="probleme">

          <BlueprintOverlay />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#EF4444] font-medium">Le Constat</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em] max-w-2xl">
                Le march&eacute; immobilier est <GradientText>fragment&eacute;.</GradientText>
              </h2>
              <p className="text-white/40 mt-4 text-lg max-w-xl">Les acteurs du secteur jonglent entre des outils d&eacute;connect&eacute;s, des commissions &eacute;lev&eacute;es et une visibilit&eacute; d&eacute;pendante de la publicit&eacute;.</p>
            </ScrollReveal>
            <StaggerContainer className="grid md:grid-cols-2 gap-5 mt-14" stagger={0.12}>
              {problems.map((p) => (
                <StaggerItem key={p.title}>
                  <TiltCard className="p-8 h-full relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 group-hover:h-[4px]" style={{ backgroundColor: p.color }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" style={{ background: `radial-gradient(circle at 50% 0%, ${p.color}10, transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-shadow duration-300 group-hover:shadow-lg" style={{ backgroundColor: `${p.color}15` }}>
                        <p.icon className="w-6 h-6" style={{ color: p.color }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                      <p className="text-white/40 leading-relaxed">{p.desc}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
              <StaggerItem>
                <div className="p-8 h-full flex flex-col justify-center space-y-5">
                  <p className="text-white/60 leading-relaxed"><span className="text-[#C4956A] font-semibold">69,8%</span> des utilisateurs abandonnent lorsqu&apos;ils sont redirig&eacute;s vers un site externe pour finaliser une action. <span className="text-white/30 text-xs italic">&mdash; Baymard Institute</span></p>
                  <p className="text-white/60 leading-relaxed"><span className="text-[#C4956A] font-semibold">53%</span> des visiteurs mobiles quittent une page qui met plus de 3 secondes &agrave; charger. Chaque redirection ajoute du d&eacute;lai. <span className="text-white/30 text-xs italic">&mdash; Google</span></p>
                  <p className="text-white/60 leading-relaxed">Les parcours fragment&eacute;s <span className="text-[#C4956A] font-semibold">r&eacute;duisent les conversions de 20 &agrave; 30%</span> par rapport &agrave; une exp&eacute;rience unifi&eacute;e. <span className="text-white/30 text-xs italic">&mdash; Forrester Research</span></p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </GridBackground>

        {/* 2. LA SOLUTION — 5 PILIERS */}
        <DotBackground className="py-32 px-[4vw]" id="solution">
        <ArchBg3DBuilding />
          <div className="max-w-[1200px] mx-auto">
            <ScrollReveal className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#10B981] font-medium">La Solution</span>
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
                    <div className="flex items-center gap-8 md:gap-12 py-10 border-b border-white/[0.06] group hover:bg-white/[0.01] transition-colors rounded-lg px-4 -mx-4 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: p.color }} />
                      <span className="text-[clamp(3rem,7vw,7rem)] font-extrabold tracking-[-0.05em] hidden md:block min-w-[130px] text-right transition-colors duration-500" style={{ color: `${p.color}08` }}>{p.num}</span>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-lg" style={{ backgroundColor: `${p.color}12` }}>
                        <p.icon className="w-7 h-7" style={{ color: p.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-2">{p.title}</h3>
                        <p className="text-white/40 max-w-lg leading-relaxed">{p.desc}</p>
                        <div className="w-12 h-[2px] rounded-full mt-3 opacity-50" style={{ backgroundColor: p.color }} />
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="hidden lg:block sticky top-24 w-[380px] scale-[0.85] origin-top-right">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </DotBackground>


        {/* LES PROFILS */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto">
            <div>
              <div className="text-center mb-4">
                <ScrollReveal>
                  <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Un compte. <GradientText>Tous les r&ocirc;les.</GradientText></h2>
                  <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">Quel que soit votre m&eacute;tier dans l&apos;immobilier, E-Dome s&apos;adapte. Un seul profil, plusieurs r&ocirc;les activables selon votre activit&eacute;.</p>
                </ScrollReveal>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12" stagger={0.06}>
                  {roles.map((r) => (
                    <StaggerItem key={r.name}>
                      <RoleCard icon={r.icon} name={r.name} color={r.color} desc={r.desc} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal delay={0.4}>
                  <div className="mt-12 text-center max-w-2xl mx-auto rounded-2xl bg-white/[0.03] border border-[#C4956A]/20 p-8">
                    <p className="text-lg font-semibold text-white">Un profil, des r&ocirc;les illimit&eacute;s.</p>
                    <p className="text-white/50 mt-3 leading-relaxed">Chaque profil est enti&egrave;rement configurable. Si votre m&eacute;tier a un lien avec l&apos;immobilier, <span className="text-[#C4956A] font-medium">vous avez votre place sur E-Dome.</span></p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* MARKETPLACE */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]" id="marketplace">

          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="space-y-6">
                <MarketplacePhoneMockup />
                <PropertyAnalyticsMockup />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#3B82F6] font-medium">Marketplace</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Achetez. Vendez. Louez. <GradientText>Investissez.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg max-w-xl leading-relaxed">Location courte dur&eacute;e, longue dur&eacute;e et vente r&eacute;unies dans un seul parcours fluide. Des frais nettement inf&eacute;rieurs aux plateformes traditionnelles.</p>
              <StaggerContainer className="grid grid-cols-2 gap-4 mt-10" stagger={0.08}>
                {[
                  { icon: Home, title: "Location courte dur\u00e9e", desc: "G\u00e9rez vos biens saisonniers avec un calendrier int\u00e9gr\u00e9 et des r\u00e9servations directes.", color: "#3B82F6" },
                  { icon: Key, title: "Location longue dur\u00e9e", desc: "Trouvez des locataires qualifi\u00e9s, g\u00e9rez les baux et les paiements depuis la plateforme.", color: "#06B6D4" },
                  { icon: Building2, title: "Vente immobili\u00e8re", desc: "Publiez vos biens en vente, recevez des offres et suivez les transactions.", color: "#10B981" },
                  { icon: BarChart3, title: "Investissement", desc: "Acc\u00e9dez \u00e0 des opportunit\u00e9s v\u00e9rifi\u00e9es, analysez les rendements et investissez en confiance.", color: "#F59E0B" },
                  { icon: Settings, title: "Options vendables", desc: "Spa, transport a\u00e9roport, d\u00e9cor romantique, menu restaurant \u2014 l\u2019h\u00f4te active les options, payantes ou non, depuis son annonce.", color: "#EC4899" },
                  { icon: Briefcase, title: "Services int\u00e9gr\u00e9s", desc: "Conciergerie, shooting photo, check-in personnalis\u00e9, exp\u00e9riences locales \u2014 r\u00e9servables en un clic par le client.", color: "#F97316" },
                ].map((f) => (
                  <StaggerItem key={f.title}>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] h-full group hover:bg-white/[0.05] transition-colors relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: f.color }} />
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${f.color}15` }}>
                        <f.icon className="w-5 h-5" style={{ color: f.color }} />
                      </div>
                      <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                      <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <div className="mt-8">
                <OptionsMockup />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* RÉSEAU SOCIAL IMMOBILIER */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]" id="social">
        <ArchBg3DVilla />
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#8B5CF6] font-medium">R&eacute;seau social immobilier</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Cr&eacute;ez du contenu. <GradientText>B&acirc;tissez votre audience.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg max-w-xl leading-relaxed">E-Dome int&egrave;gre un v&eacute;ritable r&eacute;seau social pens&eacute; pour l&apos;immobilier. Pas de redirection, pas de site externe &mdash; tout reste sur la plateforme.</p>
              <StaggerContainer className="grid grid-cols-2 gap-4 mt-10" stagger={0.08}>
                {[
                  { icon: Smartphone, title: "Posts & reels", desc: "Publiez photos, vid\u00e9os courtes et visites virtuelles de vos biens.", color: "#8B5CF6" },
                  { icon: Camera, title: "Stories & lives", desc: "Partagez en direct vos visites, \u00e9v\u00e9nements et coulisses de votre activit\u00e9.", color: "#EC4899" },
                  { icon: BookOpen, title: "S\u00e9minaires & webinars", desc: "Organisez et diffusez des formations en direct depuis votre profil.", color: "#F59E0B" },
                  { icon: Users, title: "Communaut\u00e9 & r\u00e9seau", desc: "Suivez d\u2019autres professionnels, commentez, partagez et collaborez.", color: "#3B82F6" },
                ].map((f) => (
                  <StaggerItem key={f.title}>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] h-full group hover:bg-white/[0.05] transition-colors relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: f.color }} />
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${f.color}15` }}>
                        <f.icon className="w-5 h-5" style={{ color: f.color }} />
                      </div>
                      <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                      <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <p className="text-white/30 text-sm mt-8">Votre contenu g&eacute;n&egrave;re de la visibilit&eacute; organique, attire des prospects qualifi&eacute;s et reste accessible directement depuis votre profil &mdash; sans d&eacute;pendance publicitaire.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <SocialFeedPhoneMockup />
            </ScrollReveal>
          </div>
        </section>

        {/* APPORTEURS D'AFFAIRES */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06] relative" id="apporteurs">
        <ArchBgLuxuryVilla />

          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#F59E0B] font-medium">Apporteurs d&apos;affaires</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Recommandez. <GradientText>Gagnez.</GradientText></h2>
              <p className="text-white/40 mt-6 text-lg leading-relaxed max-w-xl">Partagez un lien tra&ccedil;able unique. Chaque transaction g&eacute;n&eacute;r&eacute;e vous rapporte une commission automatique &mdash; sans aucun frais pour le client final.</p>
              <div className="mt-10 space-y-4">
                {[
                  { step: "1", title: "Activez votre lien", desc: "Depuis votre tableau de bord E-Dome" },
                  { step: "2", title: "Partagez", desc: "Biens, clients ou partenaires" },
                  { step: "3", title: "Encaissez", desc: "Commission automatique \u00e0 chaque conversion" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] font-bold text-sm shrink-0">{s.step}</div>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-white/40 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <ReferralMockup />
            </ScrollReveal>
          </div>
        </section>


        {/* ÉCOSYSTÈME PROFESSIONNEL */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto">
            <ScrollReveal className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#10B981] font-medium">&Eacute;cosyst&egrave;me professionnel</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Tout au m&ecirc;me endroit. <GradientText>Rien &agrave; chercher ailleurs.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">E-Dome centralise les outils, les donn&eacute;es et les connexions dont chaque professionnel de l&apos;immobilier a besoin au quotidien.</p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.08}>
              {[
                { icon: BarChart3, title: "Dashboard centralis\u00e9", desc: "Revenus, r\u00e9servations, apports, conversions \u2014 toute votre activit\u00e9 dans une seule vue.", color: "#10B981" },
                { icon: Users, title: "R\u00e9seau de professionnels", desc: "Connectez-vous avec des agents, promoteurs, notaires et autres acteurs pour collaborer.", color: "#8B5CF6" },
                { icon: Link2, title: "Parrainage int\u00e9gr\u00e9", desc: "Chaque recommandation est trac\u00e9e, chaque commission est calcul\u00e9e automatiquement.", color: "#F59E0B" },
                { icon: Briefcase, title: "Services \u00e0 la carte", desc: "Conciergerie, shooting photo, transport \u2014 proposez ou r\u00e9servez directement depuis la plateforme.", color: "#F97316" },
                { icon: BarChart3, title: "Donn\u00e9es & analytics", desc: "Suivez vos performances, analysez vos tendances et prenez des d\u00e9cisions \u00e9clair\u00e9es.", color: "#06B6D4" },
                { icon: Scale, title: "Conformit\u00e9 & s\u00e9curit\u00e9", desc: "RGPD, v\u00e9rification KYC, paiements s\u00e9curis\u00e9s \u2014 un cadre de confiance pour tous.", color: "#6366F1" },
              ].map((s) => (
                <StaggerItem key={s.title}>
                  <TiltCard className="p-6 h-full relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 group-hover:h-[4px]" style={{ backgroundColor: s.color }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}10, transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-shadow duration-300 group-hover:shadow-lg" style={{ backgroundColor: `${s.color}15` }}>
                        <s.icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <ScrollReveal delay={0.3} className="mt-16 flex justify-center">
              <InteractiveGlobe size={380} />
            </ScrollReveal>
          </div>
        </section>

        {/* FORMATIONS & ÉVÉNEMENTS */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06] relative overflow-hidden" id="formations">
        {/* Fond quadrillé animé */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
            <defs>
              <pattern id="grid-fine" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C4956A" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid-bold" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#C4956A" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-fine)" />
            <rect width="100%" height="100%" fill="url(#grid-bold)" />
          </svg>
          {/* Cross marks aux intersections */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
            <defs>
              <pattern id="cross-marks" width="200" height="200" patternUnits="userSpaceOnUse">
                <line x1="95" y1="100" x2="105" y2="100" stroke="#C4956A" strokeWidth="0.8" />
                <line x1="100" y1="95" x2="100" y2="105" stroke="#C4956A" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cross-marks)" />
          </svg>
          {/* Glow central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#EC4899]/[0.03] blur-[120px]" />
          {/* Scan line horizontale */}
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/20 to-transparent animate-[scan_6s_linear_infinite]" style={{ top: "30%" }} />
        </div>
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#EC4899] font-medium">Formations &amp; &eacute;v&eacute;nements</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Apprenez. Formez. <GradientText>Certifiez.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg max-w-xl leading-relaxed">Acc&eacute;dez &agrave; un catalogue de formations cr&eacute;&eacute;es par des experts du secteur ou cr&eacute;ez et vendez les v&ocirc;tres directement sur votre profil.</p>
              <StaggerContainer className="grid grid-cols-2 gap-4 mt-10" stagger={0.08}>
                {[
                  { icon: BookOpen, title: "Cours en ligne", desc: "Modules vid\u00e9o, quiz et certifications pour monter en comp\u00e9tence \u00e0 votre rythme.", color: "#EC4899" },
                  { icon: Users, title: "Webinars en direct", desc: "Sessions live avec des experts, questions-r\u00e9ponses et replays disponibles.", color: "#8B5CF6" },
                  { icon: Award, title: "Certifications", desc: "Obtenez des badges visibles sur votre profil qui renforcent votre cr\u00e9dibilit\u00e9.", color: "#F59E0B" },
                  { icon: GraduationCap, title: "S\u00e9minaires & conf\u00e9rences", desc: "\u00c9v\u00e9nements en pr\u00e9sentiel ou en ligne organis\u00e9s par la communaut\u00e9 E-Dome.", color: "#3B82F6" },
                ].map((f) => (
                  <StaggerItem key={f.title}>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] h-full group hover:bg-white/[0.05] transition-colors relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: f.color }} />
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${f.color}15` }}>
                        <f.icon className="w-5 h-5" style={{ color: f.color }} />
                      </div>
                      <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                      <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <TrainingMockup />
            </ScrollReveal>
          </div>
        </section>

        {/* COMPARAISON SANS / AVEC */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06] relative overflow-hidden">
          {/* Sparkles background */}
          <div className="absolute inset-0 w-full h-full">
            <SparklesCore
              id="comparison-sparkles"
              background="transparent"
              minSize={0.4}
              maxSize={1.2}
              particleDensity={80}
              className="w-full h-full"
              particleColor="#C4956A"
              speed={0.8}
            />
          </div>
          {/* Gradient line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-[#C4956A]/40 to-transparent blur-sm" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-[#C4956A]/60 to-transparent" />

          <div className="max-w-[1200px] mx-auto relative z-10">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Avant et apr&egrave;s <GradientText>E-Dome.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg">Ce qui change concr&egrave;tement pour les professionnels de l&apos;immobilier.</p>
            </ScrollReveal>
            <ComparisonCards />
          </div>
        </section>


        {/* PROGRAMME FONDATEURS */}
        <AuroraBackground className="py-32 px-[4vw] min-h-screen flex items-center justify-center" id="rejoindre">
          <div className="max-w-[900px] mx-auto text-center w-full flex flex-col items-center">

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#8B5CF6] font-medium">Programme Membres Fondateurs</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Fa&ccedil;onnez E-Dome <GradientText>avec nous.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">Les premiers membres fondateurs construisent la plateforme de l&apos;int&eacute;rieur. Places limit&eacute;es, s&eacute;lection sur dossier. Aucun engagement, aucun paiement requis.</p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-14 max-w-[900px] mx-auto" stagger={0.08}>
              {founders.map((f) => (
                <StaggerItem key={f.label}>
                  <TiltCard className="p-6 flex flex-col items-center gap-3 relative overflow-hidden group h-full">
                    <div className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 group-hover:h-[4px]" style={{ backgroundColor: f.color }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" style={{ background: `radial-gradient(circle at 50% 0%, ${f.color}10, transparent 70%)` }} />
                    <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center transition-shadow duration-300 group-hover:shadow-lg" style={{ backgroundColor: `${f.color}15` }}>
                      <f.icon className="w-7 h-7" style={{ color: f.color }} />
                    </div>
                    <h4 className="relative z-10 text-sm font-semibold">{f.label}</h4>
                    <p className="relative z-10 text-xs text-white/35 leading-relaxed text-center">{f.desc}</p>
                    <div className="w-8 h-[2px] rounded-full mt-auto" style={{ backgroundColor: f.color, opacity: 0.4 }} />
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <ScrollReveal delay={0.3} className="mt-14">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-6">Les &eacute;tapes</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 max-w-3xl mx-auto mb-10">
                {[
                  { step: "1", text: "Inscription via le formulaire" },
                  { step: "2", text: "S\u00e9lection des profils" },
                  { step: "3", text: "Conf\u00e9rence en ligne explicative" },
                  { step: "4", text: "Configuration de votre compte" },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center gap-2 sm:gap-0">
                    <div className="flex flex-col items-center text-center px-3">
                      <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] font-bold text-sm mb-2">{s.step}</div>
                      <p className="text-[11px] text-white/50 max-w-[120px]">{s.text}</p>
                    </div>
                    {i < 3 && <div className="hidden sm:block w-10 h-px bg-white/[0.1] mt-[-14px]" />}
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-sm max-w-lg mx-auto mb-6">Sans engagement &middot; Gratuit &middot; Confidentiel</p>
            </ScrollReveal>
            <ScrollReveal delay={0.4} className="w-full max-w-xl mx-auto">
              <FounderForm />
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

      </main>

      <footer className="py-16 px-[4vw] border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="text-xl font-bold">E-<span className="text-[#C4956A]">Dome</span></p>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">Le premier &eacute;cosyst&egrave;me unifi&eacute; pour l&apos;immobilier mondial. Une plateforme, chaque acteur, partout.</p>
            <p className="text-xs text-white/25 mt-4">Neuch&acirc;tel, Suisse &middot; Op&eacute;rations mondiales</p>
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-4">Navigation</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Constat", href: "#probleme" },
                { label: "Solution", href: "#solution" },
                { label: "Marketplace", href: "#marketplace" },
                { label: "R\u00e9seau social", href: "#social" },
                { label: "Apporteurs", href: "#apporteurs" },
                { label: "Formations", href: "#formations" },
                { label: "FAQ", href: "#faq" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="text-sm text-white/40 hover:text-[#C4956A] transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-4">Contact</p>
            <a href="mailto:contact@edome.world" className="text-sm text-[#C4956A] hover:text-[#D4A574] transition-colors">contact@edome.world</a>
            <p className="text-xs text-white/25 mt-4">Lancement pr&eacute;vu : 2026</p>
            <p className="text-xs text-white/25 mt-1">Places limit&eacute;es &mdash; Membres Fondateurs</p>
            <div className="mt-6">
              <a href="#rejoindre" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 text-sm text-[#C4956A] hover:bg-[#C4956A]/20 transition-colors">Rejoindre <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">&copy; 2026 E-Dome. Tous droits r&eacute;serv&eacute;s.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/25 hover:text-white/40 transition-colors">Mentions l&eacute;gales</a>
            <a href="#" className="text-xs text-white/25 hover:text-white/40 transition-colors">Conditions g&eacute;n&eacute;rales</a>
            <a href="#" className="text-xs text-white/25 hover:text-white/40 transition-colors">Confidentialit&eacute;</a>
          </div>
        </div>
      </footer>
    </>
  );
}
