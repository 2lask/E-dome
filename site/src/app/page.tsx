"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Home, Smartphone, Link2, Settings, BookOpen, TrendingDown, Lock, Megaphone, Handshake, User, Building2, HardHat, GraduationCap, BarChart3, Award, Rocket, Users, MessageSquare, ArrowRight, Camera, Key, Briefcase, PenTool, Scale, ExternalLink, Calendar, ChevronDown, Menu, X, Zap, MapPin } from "lucide-react";

/* ═══════════════════ DATA ═══════════════════ */

const problems = [
  { icon: TrendingDown, title: "Secteur fragmenté", desc: "Chacun travaille en silo. Aucune infrastructure partagée pour collaborer." },
  { icon: Lock, title: "Revenus capturés", desc: "Les plateformes absorbent une part importante de chaque transaction." },
  { icon: Megaphone, title: "Aucune propriété", desc: "Votre réputation est construite sur des plateformes louées." },
  { icon: Handshake, title: "Recommandations perdues", desc: "Le bouche-à-oreille génère les transactions mais n'est jamais rémunéré." },
  { icon: ExternalLink, title: "Attention dispersée", desc: "Votre contenu redirige toujours vers un site externe." },
];

const pillars = [
  { num: "01", icon: Home, title: "Marketplace", color: "#3B82F6", desc: "Achetez, vendez, louez et investissez avec des frais nettement inférieurs." },
  { num: "02", icon: Smartphone, title: "Réseau social", color: "#8B5CF6", desc: "Partagez vos annonces, construisez votre réputation, connectez l'écosystème." },
  { num: "03", icon: Link2, title: "Apporteurs", color: "#F59E0B", desc: "Liens traçables, commissions partagées depuis les revenus de la plateforme." },
  { num: "04", icon: Settings, title: "Écosystème pro", color: "#10B981", desc: "Services intégrés, données, événements — tout au même endroit." },
  { num: "05", icon: BookOpen, title: "Formations", color: "#EC4899", desc: "Formations certifiantes, webinars et coaching directement intégrés." },
];

const roles = [
  { icon: User, name: "Client", color: "#A855F7", desc: "Réservez, louez ou achetez des biens depuis une seule interface." },
  { icon: Home, name: "Hôte", color: "#3B82F6", desc: "Gérez vos biens avec moins de commissions." },
  { icon: Building2, name: "Agence", color: "#0EA5E9", desc: "Publiez vos mandats, générez des leads organiques." },
  { icon: HardHat, name: "Promoteur", color: "#10B981", desc: "Présentez vos projets à une audience qualifiée." },
  { icon: Handshake, name: "Apporteur", color: "#F59E0B", desc: "Commission prélevée sur les revenus de la plateforme, pas sur l'hôte." },
  { icon: BarChart3, name: "Investisseur", color: "#EF4444", desc: "Opportunités vérifiées et rendements en temps réel." },
  { icon: GraduationCap, name: "Formateur", color: "#EC4899", desc: "Créez et vendez vos formations sur la plateforme." },
  { icon: Key, name: "Propriétaire", color: "#06B6D4", desc: "Pilotez vos biens et revenus locatifs." },
  { icon: Camera, name: "Photographe", color: "#F97316", desc: "Portfolio visible, demandes de shooting directes." },
  { icon: Briefcase, name: "Courtier", color: "#6366F1", desc: "Développez votre réseau et gérez vos transactions." },
  { icon: PenTool, name: "Architecte", color: "#C4956A", desc: "Présentez vos projets et collaborez avec les promoteurs." },
  { icon: Scale, name: "Notaire", color: "#14B8A6", desc: "Simplifiez vos transactions et signez numériquement." },
];

const founders = [
  { icon: Award, label: "Badge fondateur permanent", color: "#F59E0B", desc: "Un marqueur de confiance visible sur votre profil." },
  { icon: Rocket, label: "Accès bêta anticipé", color: "#3B82F6", desc: "Testez chaque fonctionnalité avant l'ouverture." },
  { icon: BookOpen, label: "Formations offertes", color: "#EC4899", desc: "Webinars exclusifs et coaching individuel inclus." },
  { icon: Users, label: "Réseau exclusif", color: "#8B5CF6", desc: "Cercle de professionnels sélectionnés." },
  { icon: Calendar, label: "Parcours avant lancement", color: "#10B981", desc: "Inscription, sélection, conférence, configuration." },
  { icon: MessageSquare, label: "Voix dans les décisions", color: "#06B6D4", desc: "Influencez la roadmap en avant-première." },
];

const faqs = [
  { q: "E-Dome est-il déjà lancé ?", a: "E-Dome est en développement. Lancement prévu en 2026. Les membres fondateurs auront un accès bêta exclusif." },
  { q: "La manifestation d'intérêt m'engage-t-elle ?", a: "Non. C'est gratuit, confidentiel et sans engagement." },
  { q: "À qui s'adresse E-Dome ?", a: "Tous les acteurs de l'immobilier : agences, hôtes, propriétaires, promoteurs, courtiers, architectes, photographes, notaires — partout dans le monde." },
  { q: "Quelle différence avec Airbnb ou Booking ?", a: "E-Dome est un écosystème complet : réseau social, marketplace multi-services, apporteurs rémunérés et formations intégrées. Avec des commissions nettement inférieures." },
  { q: "Comment fonctionne le système d'apporteurs ?", a: "Chaque utilisateur reçoit un lien traçable. Les commissions sont prélevées sur les revenus de la plateforme — aucun coût supplémentaire pour l'hôte ni pour le client." },
  { q: "Mes données sont-elles protégées ?", a: "Absolument. E-Dome est conforme au RGPD. Les paiements transitent par des prestataires certifiés PCI-DSS." },
  { q: "Comment devenir membre fondateur ?", a: "Inscrivez-vous via le formulaire. Votre profil est analysé, puis vous participez à une conférence en ligne explicative avant de configurer votre compte." },
  { q: "E-Dome est-il limité à un seul pays ?", a: "Non. E-Dome est international. Lancement initial en Europe francophone, puis expansion mondiale." },
];

/* ═══════════════════ COMPONENTS ═══════════════════ */

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >{children}</motion.div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="bg-gradient-to-r from-[#C4956A] via-[#D4A574] to-[#E8C9A0] bg-clip-text text-transparent">{children}</span>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left group">
        <span className="font-medium pr-4 group-hover:text-[#C4956A] transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#C4956A] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="pb-5 text-white/50 leading-relaxed text-sm">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / dur, 1); setCount(Math.round(p * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ═══════════════════ PAGE ═══════════════════ */

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <>
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/70 border-b border-white/[0.06]">
        <div className="max-w-[1300px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight">E-<span className="text-[#C4956A]">Dome</span></a>
          <nav className="hidden md:flex items-center gap-8">
            {["Constat", "Solution", "Rôles", "Fondateurs", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="text-sm text-white/40 hover:text-white transition-colors">{l}</a>
            ))}
            <a href="#rejoindre" className="px-5 py-2 rounded-full bg-[#C4956A] text-[#0a0a0a] text-sm font-semibold hover:bg-[#D4A574] transition-all">Rejoindre</a>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-white/[0.06]">
              <div className="flex flex-col gap-4 p-6">
                {["Constat", "Solution", "Rôles", "Fondateurs", "FAQ"].map((l) => (
                  <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} onClick={() => setMenuOpen(false)} className="text-white/60">{l}</a>
                ))}
                <a href="#rejoindre" onClick={() => setMenuOpen(false)} className="px-5 py-3 rounded-full bg-[#C4956A] text-[#0a0a0a] font-semibold text-center">Rejoindre</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO */}
        <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
          <div className="absolute inset-0 opacity-[0.04]"><svg className="w-full h-full"><defs><pattern id="hg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="#C4956A" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#hg)"/></svg></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C4956A]/[0.06] blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/[0.04] blur-[120px]" />
          <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
            <Reveal><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-8"><span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[pulse-dot_2s_ease_infinite]" /><span className="text-sm text-[#C4956A]">Plateforme Immobilière Nouvelle Génération</span></div></Reveal>
            <Reveal delay={0.1}><h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-[-0.04em]">Projet <GradientText>E-Dome</GradientText></h1></Reveal>
            <Reveal delay={0.2}><p className="text-[clamp(1.1rem,2.5vw,1.6rem)] text-white/50 mt-6 max-w-2xl mx-auto leading-relaxed">Marketplace, réseau social, apporteurs d'affaires, formations et services — réunis pour la première fois pour chaque acteur de l'immobilier.</p></Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <a href="#rejoindre" className="px-8 py-4 rounded-full bg-[#C4956A] text-[#0a0a0a] font-semibold text-lg hover:bg-[#D4A574] hover:shadow-[0_0_40px_rgba(196,149,106,0.3)] transition-all flex items-center justify-center gap-2">Rejoindre les Fondateurs <ArrowRight className="w-5 h-5" /></a>
              </div>
              <p className="text-white/25 text-sm mt-4">Sans engagement · Gratuit · Confidentiel</p>
            </Reveal>
            <Reveal delay={0.5}><div className="mt-16"><div className="w-px h-12 mx-auto bg-gradient-to-b from-[#C4956A]/50 to-transparent" /></div></Reveal>
          </div>
        </motion.section>

        {/* LE CONSTAT */}
        <section className="py-28 px-6" id="constat">
          <div className="max-w-[1100px] mx-auto">
            <Reveal><p className="text-[#EF4444] text-sm font-medium tracking-wider uppercase mb-4">Le Constat</p><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight max-w-2xl">Le marché immobilier est <GradientText>fragmenté.</GradientText></h2></Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
              {problems.map((p, i) => (<Reveal key={p.title} delay={i * 0.08}><div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#EF4444]/20 transition-colors h-full"><p.icon className="w-6 h-6 text-[#EF4444]/60 mb-4" /><h3 className="font-semibold mb-2">{p.title}</h3><p className="text-sm text-white/40 leading-relaxed">{p.desc}</p></div></Reveal>))}
            </div>
          </div>
        </section>

        {/* LA SOLUTION */}
        <section className="py-28 px-6 border-t border-white/[0.04]" id="solution">
          <div className="max-w-[1100px] mx-auto">
            <Reveal><p className="text-[#10B981] text-sm font-medium tracking-wider uppercase mb-4">La Solution</p><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">Cinq piliers. <GradientText>Un seul écosystème.</GradientText></h2></Reveal>
            <div className="mt-14 space-y-0">
              {pillars.map((p, i) => (<Reveal key={p.title} delay={i * 0.06}><div className="flex items-start gap-6 py-8 border-b border-white/[0.04] group"><span className="text-5xl font-bold text-white/[0.06] tracking-tighter hidden sm:block w-20 shrink-0 text-right">{p.num}</span><div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}15` }}><p.icon className="w-6 h-6" style={{ color: p.color }} /></div><div><h3 className="text-lg font-semibold mb-1">{p.title}</h3><p className="text-sm text-white/40 max-w-md">{p.desc}</p></div></div></Reveal>))}
            </div>
          </div>
        </section>

        {/* MARKETPLACE */}
        <section className="py-28 px-6 border-t border-white/[0.04]">
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <Reveal><div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-sm"><img src="/villa.jpg" alt="Villa" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-6"><p className="text-xs text-[#C4956A] font-medium mb-1">Location · Villa</p><p className="text-lg font-semibold">Villa Méditerranée</p><div className="flex items-center gap-2 mt-2 text-sm text-white/50"><MapPin className="w-3.5 h-3.5" /> Côte d'Azur<span className="ml-auto text-[#C4956A] font-bold">245 CHF/nuit</span></div></div></div></Reveal>
            <Reveal delay={0.15}><p className="text-[#3B82F6] text-sm font-medium tracking-wider uppercase mb-4">Marketplace</p><h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight">Achetez. Vendez. Louez. <GradientText>Investissez.</GradientText></h2><p className="text-white/40 mt-4 leading-relaxed">Location courte durée, longue durée et vente réunies dans un seul parcours. Des frais nettement inférieurs.</p><div className="grid grid-cols-2 gap-3 mt-8">{[{ label: "Location CT", color: "#3B82F6" },{ label: "Location LT", color: "#06B6D4" },{ label: "Vente", color: "#10B981" },{ label: "Investissement", color: "#F59E0B" }].map((t) => (<div key={t.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} /><span className="text-sm text-white/60">{t.label}</span></div>))}</div></Reveal>
          </div>
        </section>

        {/* RÉSEAU SOCIAL */}
        <section className="py-28 px-6 border-t border-white/[0.04]">
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <Reveal><p className="text-[#8B5CF6] text-sm font-medium tracking-wider uppercase mb-4">Réseau social</p><h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight">Créez du contenu. <GradientText>Bâtissez votre audience.</GradientText></h2><p className="text-white/40 mt-4 leading-relaxed">Posts, reels, stories, lives, séminaires — tout reste sur la plateforme. Votre contenu génère de la visibilité organique.</p><div className="flex flex-wrap gap-2 mt-6">{["Posts & reels", "Stories & lives", "Séminaires", "Communauté"].map((t) => (<span key={t} className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">{t}</span>))}</div></Reveal>
            <Reveal delay={0.15}><div className="rounded-2xl overflow-hidden"><video src="/demo-reel.mp4" autoPlay muted loop playsInline className="w-full rounded-2xl" /></div></Reveal>
          </div>
        </section>

        {/* APPORTEURS */}
        <section className="py-28 px-6 border-t border-white/[0.04]">
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <Reveal><div className="rounded-2xl overflow-hidden"><img src="/chalet.jpg" alt="Chalet" className="w-full rounded-2xl" /></div></Reveal>
            <Reveal delay={0.15}><p className="text-[#F59E0B] text-sm font-medium tracking-wider uppercase mb-4">Apporteurs d'affaires</p><h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight">Recommandez. <GradientText>Gagnez.</GradientText></h2><p className="text-white/40 mt-4 leading-relaxed">Partagez un lien traçable. Chaque transaction vous rapporte une commission <strong className="text-white">prélevée sur les revenus de la plateforme</strong> — <strong className="text-white">aucun coût supplémentaire</strong> pour l'hôte ni pour le client.</p><div className="mt-8 space-y-4">{["Activez votre lien", "Partagez", "Encaissez"].map((s, i) => (<div key={s} className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] font-bold text-sm">{i + 1}</div><span className="text-white/60">{s}</span></div>))}</div></Reveal>
          </div>
        </section>

        {/* RÔLES */}
        <section className="py-28 px-6 border-t border-white/[0.04]" id="roles">
          <div className="max-w-[1100px] mx-auto">
            <Reveal className="text-center mb-14"><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">Un compte. <GradientText>Tous les rôles.</GradientText></h2><p className="text-white/40 mt-4 max-w-xl mx-auto">Quel que soit votre métier dans l'immobilier, E-Dome s'adapte.</p></Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {roles.map((r, i) => (<Reveal key={r.name} delay={i * 0.04}><div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"><div className="flex items-center gap-2.5 mb-2"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${r.color}15` }}><r.icon className="w-4 h-4" style={{ color: r.color }} /></div><span className="text-sm font-semibold">{r.name}</span></div><p className="text-xs text-white/35 leading-relaxed">{r.desc}</p></div></Reveal>))}
            </div>
            <Reveal delay={0.3}><div className="mt-8 flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full border-2 border-dashed border-[#C4956A]/30 flex items-center justify-center"><span className="text-[#C4956A] text-xl">+</span></div><p className="text-xs text-white/25">Et bien d'autres rôles configurables</p></div></Reveal>
          </div>
        </section>

        {/* STATS */}
        <section className="py-20 px-6 border-t border-white/[0.04]">
          <div className="max-w-[900px] mx-auto grid grid-cols-3 gap-8 text-center">
            {[{ target: 32, prefix: "$", suffix: "B", label: "Marché immobilier digital d'ici 2030", src: "Grand View Research" },{ target: 193, prefix: "$", suffix: "B", label: "Marché location courte durée 2029", src: "Statista" },{ target: 82, suffix: "%", label: "Des transactions impliquent le bouche-à-oreille", src: "NAR, 2023" }].map((s) => (<Reveal key={s.label}><p className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#C4956A]"><Counter target={s.target} prefix={s.prefix || ""} suffix={s.suffix} /></p><p className="text-sm text-white/40 mt-1">{s.label}</p><p className="text-[10px] text-white/20 mt-1">{s.src}</p></Reveal>))}
          </div>
        </section>

        {/* COMPARAISON */}
        <section className="py-28 px-6 border-t border-white/[0.04]">
          <div className="max-w-[900px] mx-auto">
            <Reveal className="text-center mb-14"><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">Avant et après <GradientText>E-Dome.</GradientText></h2></Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              <Reveal><div className="p-6 rounded-2xl bg-[#EF4444]/[0.04] border border-[#EF4444]/10"><p className="text-sm font-semibold text-[#EF4444] mb-4">Sans E-Dome</p>{["Commissions élevées sur chaque transaction", "Visibilité uniquement via publicité payante", "Relation client captée par les plateformes", "Outils fragmentés et déconnectés", "Bouche-à-oreille non traçable ni rémunéré", "Données dispersées, aucune vue d'ensemble"].map((t) => (<div key={t} className="flex items-start gap-2 py-2"><X className="w-4 h-4 text-[#EF4444]/50 mt-0.5 shrink-0" /><span className="text-sm text-white/40">{t}</span></div>))}</div></Reveal>
              <Reveal delay={0.1}><div className="p-6 rounded-2xl bg-[#10B981]/[0.04] border border-[#10B981]/10"><p className="text-sm font-semibold text-[#10B981] mb-4">Avec E-Dome</p>{["Commissions nettement inférieures au marché", "Visibilité organique gratuite et illimitée", "Relation directe avec vos clients", "Écosystème unifié tout-en-un", "Apporteurs rémunérés automatiquement", "Analytics centralisés en temps réel"].map((t) => (<div key={t} className="flex items-start gap-2 py-2"><Zap className="w-4 h-4 text-[#10B981]/50 mt-0.5 shrink-0" /><span className="text-sm text-white/40">{t}</span></div>))}</div></Reveal>
            </div>
          </div>
        </section>

        {/* PROGRAMME FONDATEURS */}
        <section className="py-28 px-6 border-t border-white/[0.04]" id="fondateurs">
          <div className="max-w-[900px] mx-auto text-center">
            <Reveal><p className="text-[#8B5CF6] text-sm font-medium tracking-wider uppercase mb-4">Programme Membres Fondateurs</p><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">Façonnez E-Dome <GradientText>avec nous.</GradientText></h2><p className="text-white/40 mt-4 max-w-xl mx-auto">Places limitées, sélection sur dossier. Aucun engagement, aucun paiement requis.</p></Reveal>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-14">
              {founders.map((f, i) => (<Reveal key={f.label} delay={i * 0.06}><div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left h-full"><div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${f.color}15` }}><f.icon className="w-5 h-5" style={{ color: f.color }} /></div><h4 className="text-sm font-semibold mb-1">{f.label}</h4><p className="text-xs text-white/35 leading-relaxed">{f.desc}</p></div></Reveal>))}
            </div>
            <Reveal delay={0.3}><div className="mt-12"><a href="#rejoindre" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C4956A] text-[#0a0a0a] font-semibold text-lg hover:bg-[#D4A574] hover:shadow-[0_0_40px_rgba(196,149,106,0.3)] transition-all">Manifester mon intérêt <ArrowRight className="w-5 h-5" /></a><p className="text-white/25 text-sm mt-4">Sans engagement · Gratuit · Confidentiel</p></div></Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 px-6 border-t border-white/[0.04]" id="faq">
          <div className="max-w-[700px] mx-auto">
            <Reveal className="text-center mb-14"><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">Tout savoir sur <GradientText>E-Dome.</GradientText></h2></Reveal>
            <Reveal>{faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}</Reveal>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-28 px-6 border-t border-white/[0.04] text-center" id="rejoindre">
          <div className="max-w-[600px] mx-auto">
            <Reveal><h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">Construisez l'avenir de <GradientText>l'immobilier.</GradientText></h2><p className="text-white/40 mt-4">Rejoignez les premiers acteurs qui façonnent la plateforme de demain.</p></Reveal>
            <Reveal delay={0.2}><div className="mt-10"><a href="mailto:contact@edome.world" className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[#C4956A] text-[#0a0a0a] font-semibold text-xl hover:bg-[#D4A574] hover:shadow-[0_0_50px_rgba(196,149,106,0.35)] transition-all">Manifester mon intérêt <ArrowRight className="w-6 h-6" /></a></div></Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/[0.04]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div><p className="text-lg font-bold">E-<span className="text-[#C4956A]">Dome</span></p><p className="text-sm text-white/30 mt-2 max-w-xs">Le premier écosystème unifié pour l'immobilier. Une plateforme, chaque acteur, partout.</p><p className="text-xs text-white/20 mt-3">Neuchâtel, Suisse · Opérations mondiales</p></div>
          <div className="flex gap-12">
            <div><p className="text-xs text-white/25 uppercase tracking-wider mb-3">Navigation</p><div className="flex flex-col gap-2">{["Constat", "Solution", "Rôles", "Fondateurs", "FAQ"].map((l) => (<a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="text-sm text-white/30 hover:text-[#C4956A] transition-colors">{l}</a>))}</div></div>
            <div><p className="text-xs text-white/25 uppercase tracking-wider mb-3">Contact</p><a href="mailto:contact@edome.world" className="text-sm text-[#C4956A]">contact@edome.world</a><p className="text-xs text-white/20 mt-3">Lancement prévu : 2026</p></div>
          </div>
        </div>
        <div className="max-w-[1100px] mx-auto mt-8 pt-6 border-t border-white/[0.04] text-center"><p className="text-xs text-white/20">&copy; 2026 E-Dome. Tous droits réservés.</p></div>
      </footer>
    </>
  );
}
