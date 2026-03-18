"use client";

import { Home, Smartphone, Link2, Settings, BookOpen, TrendingDown, Lock, Megaphone, Handshake, User, Building2, HardHat, GraduationCap, BarChart3, Award, Rocket, Users, Percent, MessageSquare, ArrowRight } from "lucide-react";
import { TextReveal, GradientText } from "@/components/ui/text-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { AuroraBackground } from "@/components/ui/aurora-bg";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { Counter } from "@/components/ui/counter";
import { GridBackground, DotBackground } from "@/components/ui/grid-bg";
import { useState } from "react";

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
      <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-40 pb-6" : "max-h-0"}`}>
        <p className="text-white/60 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

const problems = [
  { icon: TrendingDown, title: "Commissions \u00e9lev\u00e9es", desc: "14 \u00e0 25% pr\u00e9lev\u00e9s par les plateformes traditionnelles sur chaque transaction." },
  { icon: Lock, title: "D\u00e9pendance totale", desc: "Z\u00e9ro contr\u00f4le sur la relation client. Algorithmes opaques. Risque de suspension." },
  { icon: Megaphone, title: "Visibilit\u00e9 payante", desc: "Des centaines d\u2019euros par mois en publicit\u00e9. Sans budget, vos biens sont invisibles." },
  { icon: Handshake, title: "Apporteurs = chaos", desc: "Aucun tracking transparent. Calculs manuels, erreurs, litiges fr\u00e9quents." },
];

const pillars = [
  { num: "01", icon: Home, title: "Marketplace immobilier", desc: "Vente, location courte et longue dur\u00e9e. Commissions nettement inf\u00e9rieures. Un seul parcours." },
  { num: "02", icon: Smartphone, title: "R\u00e9seau social immobilier", desc: "Reels, stories, audience organique. Attirez des prospects sans budget publicitaire." },
  { num: "03", icon: Link2, title: "Syst\u00e8me d\u2019apporteurs", desc: "Lien unique, tracking transparent, commissions automatiques. Bouche-\u00e0-oreille r\u00e9mun\u00e9r\u00e9." },
  { num: "04", icon: Settings, title: "Services additionnels", desc: "Conciergerie, transport, exp\u00e9riences locales. Chaque r\u00e9servation ouvre de nouveaux revenus." },
  { num: "05", icon: BookOpen, title: "Formations & communaut\u00e9", desc: "Formations, webinars, experts. Une communaut\u00e9 de professionnels ambitieux." },
];

const roles = [
  { icon: User, name: "Client" },
  { icon: Home, name: "H\u00f4te" },
  { icon: Building2, name: "Agence" },
  { icon: HardHat, name: "Promoteur" },
  { icon: Handshake, name: "Apporteur" },
  { icon: BarChart3, name: "Investisseur" },
  { icon: GraduationCap, name: "Formateur" },
];

const stats = [
  { value: 32, prefix: "$", suffix: "B", label: "Immobilier digital 2030", src: "Grand View Research" },
  { value: 193, prefix: "$", suffix: "B", label: "Location courte dur\u00e9e 2029", src: "Statista" },
  { value: 82, prefix: "", suffix: "%", label: "Transactions via bouche-\u00e0-oreille", src: "NAR, 2023" },
];

const founders = [
  { icon: Award, label: "Badge permanent" },
  { icon: Rocket, label: "Acc\u00e8s b\u00eata" },
  { icon: BookOpen, label: "Formations offertes" },
  { icon: Users, label: "R\u00e9seau exclusif" },
  { icon: Percent, label: "Conditions pr\u00e9f\u00e9rentielles" },
  { icon: MessageSquare, label: "Voix d\u00e9cisionnelle" },
];

const faqs = [
  { q: "E-Dome est-il d\u00e9j\u00e0 lanc\u00e9 ?", a: "E-Dome est en d\u00e9veloppement. Les fondateurs auront un acc\u00e8s b\u00eata exclusif avant l\u2019ouverture publique." },
  { q: "La manifestation d\u2019int\u00e9r\u00eat engage-t-elle ?", a: "Non. Gratuite, confidentielle, sans engagement." },
  { q: "\u00c0 qui s\u2019adresse E-Dome ?", a: "Tous les acteurs de l\u2019immobilier : agences, h\u00f4tes, propri\u00e9taires, promoteurs, courtiers, architectes \u2014 partout dans le monde." },
  { q: "Diff\u00e9rence avec Airbnb ou Booking ?", a: "\u00c9cosyst\u00e8me complet : r\u00e9seau social, marketplace, apporteurs r\u00e9mun\u00e9r\u00e9s, formations. Commissions nettement inf\u00e9rieures." },
  { q: "Comment fonctionne le syst\u00e8me d\u2019apporteurs ?", a: "Lien tra\u00e7able unique. Commission automatique sur chaque transaction \u2014 sans co\u00fbt pour le client." },
  { q: "Mes donn\u00e9es sont-elles prot\u00e9g\u00e9es ?", a: "Conforme RGPD. Paiements certifi\u00e9s PCI-DSS. Donn\u00e9es jamais vendues." },
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
            <a href="#marche" className="text-sm text-white/40 hover:text-white transition-colors">March\u00e9</a>
            <a href="#faq" className="text-sm text-white/40 hover:text-white transition-colors">FAQ</a>
            <a href="#rejoindre" className="px-5 py-2 rounded-full bg-[#C4956A] text-[#080808] text-sm font-semibold hover:bg-[#D4A574] transition-all hover:shadow-[0_0_25px_rgba(196,149,106,0.4)]">Rejoindre</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <AuroraBackground className="min-h-screen flex items-center justify-center text-center px-6 pt-24">
          <div className="max-w-[900px]">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">Plateforme Immobili\u00e8re Nouvelle G\u00e9n\u00e9ration</span>
              </div>
            </ScrollReveal>
            <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
              <TextReveal>L&apos;\u00e9cosyst\u00e8me qui</TextReveal><br />
              <GradientText className="text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">r\u00e9unit l&apos;immobilier</GradientText><br />
              <TextReveal delay={0.3}>mondial.</TextReveal>
            </h1>
            <ScrollReveal delay={0.4}>
              <p className="text-white/40 text-lg mt-8 tracking-wide">Marketplace &middot; R\u00e9seau social &middot; Apporteurs &middot; Formations &middot; Services</p>
            </ScrollReveal>
            <ScrollReveal delay={0.6}>
              <div className="mt-10">
                <MagneticButton href="#rejoindre">Rejoindre les Fondateurs <ArrowRight className="w-5 h-5" /></MagneticButton>
              </div>
              <p className="text-white/30 text-sm mt-6">Sans engagement &middot; Gratuit &middot; Confidentiel</p>
            </ScrollReveal>
            <div className="mt-20">
              <div className="w-px h-16 mx-auto bg-gradient-to-b from-[#C4956A] to-transparent animate-[scroll-line_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </AuroraBackground>

        {/* STATS */}
        <div className="border-y border-white/[0.06] py-16 px-[4vw]">
          <StaggerContainer className="max-w-[1200px] mx-auto flex justify-between flex-wrap gap-8">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="text-center flex-1 min-w-[140px]">
                <div className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#C4956A] tracking-tight">
                  <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* PROBLEME */}
        <GridBackground className="py-32 px-[4vw]" id="probleme">
          <div className="max-w-[1200px] mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">Le Constat</span>
              </div>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Le secteur immobilier est <GradientText>fragment\u00e9.</GradientText></h2>
            </ScrollReveal>
            <StaggerContainer className="grid md:grid-cols-2 gap-5 mt-12" stagger={0.12}>
              {problems.map((p) => (
                <StaggerItem key={p.title}>
                  <TiltCard className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-[#C4956A]/10 flex items-center justify-center mb-5">
                      <p.icon className="w-6 h-6 text-[#C4956A]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                    <p className="text-white/50 leading-relaxed">{p.desc}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </GridBackground>

        {/* COMPARAISON */}
        <div className="flex flex-col md:flex-row min-h-screen border-t border-white/[0.06]">
          <ScrollReveal direction="left" className="flex-1 p-12 md:p-16 flex flex-col justify-center bg-[#0a0606] border-r border-white/[0.06]">
            <h3 className="text-xs uppercase tracking-[0.15em] text-red-400 mb-10 pb-4 border-b border-white/[0.06]">Sans E-Dome</h3>
            <ul className="space-y-5">
              {["Revenus grignot\u00e9s par les commissions", "Publicit\u00e9 payante obligatoire", "Relation client capt\u00e9e par des tiers", "Outils multiples et fragment\u00e9s", "Donn\u00e9es dispers\u00e9es"].map((item) => (
                <li key={item} className="flex items-center gap-4 text-white/60 text-lg">
                  <span className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 text-red-400 font-semibold text-sm">\u2715</span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal direction="right" className="flex-1 p-12 md:p-16 flex flex-col justify-center bg-[#060a06]">
            <h3 className="text-xs uppercase tracking-[0.15em] text-[#C4956A] mb-10 pb-4 border-b border-white/[0.06]">Avec E-Dome</h3>
            <ul className="space-y-5">
              {["Commissions nettement inf\u00e9rieures", "Visibilit\u00e9 organique gratuite", "Relation directe, donn\u00e9es propri\u00e9taires", "\u00c9cosyst\u00e8me unifi\u00e9 tout-en-un", "Analytics centralis\u00e9s en temps r\u00e9el"].map((item) => (
                <li key={item} className="flex items-center gap-4 text-white/60 text-lg">
                  <span className="w-9 h-9 rounded-full bg-[#C4956A]/10 flex items-center justify-center shrink-0 text-[#C4956A] font-semibold text-sm">\u2713</span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        {/* SOLUTION */}
        <DotBackground className="py-32 px-[4vw]" id="solution">
          <div className="max-w-[1200px] mx-auto">
            <ScrollReveal className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-[dot-pulse_2s_ease_infinite]" />
                <span className="text-sm text-[#C4956A] font-medium">La Solution</span>
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Cinq piliers. <GradientText>Un seul \u00e9cosyst\u00e8me.</GradientText></h2>
            </ScrollReveal>
            <div className="space-y-6">
              {pillars.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 0.08}>
                  <div className="flex items-center gap-8 md:gap-12 py-10 border-b border-white/[0.06] group">
                    <span className="text-[clamp(3rem,7vw,7rem)] font-extrabold text-white/[0.04] tracking-[-0.05em] hidden md:block min-w-[130px] text-right">{p.num}</span>
                    <div className="w-16 h-16 rounded-2xl bg-[#C4956A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C4956A]/20 transition-colors">
                      <p.icon className="w-7 h-7 text-[#C4956A]" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-1">{p.title}</h3>
                      <p className="text-white/50 max-w-lg leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </DotBackground>

        {/* PROFILS */}
        <section className="py-32 px-[4vw] border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Un compte. <GradientText>Tous les r\u00f4les.</GradientText></h2>
            </ScrollReveal>
            <StaggerContainer className="flex flex-wrap justify-center gap-4 mt-16" stagger={0.08}>
              {roles.map((r) => (
                <StaggerItem key={r.name}>
                  <TiltCard className="w-[130px] py-8 flex flex-col items-center gap-3">
                    <r.icon className="w-7 h-7 text-[#C4956A]" />
                    <span className="text-sm font-medium text-white/70">{r.name}</span>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* MARCHE */}
        <GridBackground className="py-32 px-[4vw] min-h-screen flex items-center" id="marche">
          <div className="max-w-[1200px] mx-auto text-center w-full">
            <ScrollReveal>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Un march\u00e9 mondial en <GradientText>pleine transformation.</GradientText></h2>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16" stagger={0.1}>
              {stats.map((s) => (
                <StaggerItem key={s.label}>
                  <TiltCard className="p-8 text-center">
                    <div className="text-4xl md:text-5xl font-extrabold text-[#C4956A] tracking-tight">
                      <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                    </div>
                    <p className="text-sm text-white/60 mt-3">{s.label}</p>
                    <p className="text-xs text-white/30 mt-1 italic">{s.src}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </GridBackground>

        {/* FONDATEURS */}
        <AuroraBackground className="py-32 px-[4vw] min-h-screen flex items-center" id="rejoindre">
          <div className="max-w-[1200px] mx-auto text-center w-full">
            <ScrollReveal>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Fa\u00e7onnez E-Dome <GradientText>avec nous.</GradientText></h2>
              <p className="text-white/40 mt-4 text-lg">100 places. S\u00e9lection sur dossier. Avantages permanents.</p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-14 max-w-[700px] mx-auto" stagger={0.08}>
              {founders.map((f) => (
                <StaggerItem key={f.label}>
                  <TiltCard className="py-8 flex flex-col items-center gap-3">
                    <f.icon className="w-7 h-7 text-[#C4956A]" />
                    <h4 className="text-sm font-semibold">{f.label}</h4>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <ScrollReveal delay={0.5} className="mt-14">
              <MagneticButton href="#rejoindre" className="text-xl px-10 py-5">Manifester mon int\u00e9r\u00eat <ArrowRight className="w-5 h-5" /></MagneticButton>
            </ScrollReveal>
          </div>
        </AuroraBackground>

        {/* FAQ */}
        <section className="py-32 px-[4vw]" id="faq">
          <div className="max-w-[700px] mx-auto">
            <ScrollReveal className="text-center mb-14">
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.04em]">Questions <GradientText>fr\u00e9quentes.</GradientText></h2>
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
            <div className="mt-12">
              <MagneticButton href="#rejoindre" className="text-xl px-10 py-5">Manifester mon int\u00e9r\u00eat <ArrowRight className="w-5 h-5" /></MagneticButton>
            </div>
          </ScrollReveal>
        </DotBackground>
      </main>

      <footer className="py-16 px-[4vw] border-t border-white/[0.06] text-center">
        <p className="text-xl font-bold">E-<span className="text-[#C4956A]">Dome</span></p>
        <p className="text-sm text-white/40 mt-2">\u00c9cosyst\u00e8me Immobilier International</p>
        <div className="flex justify-center gap-8 mt-8 flex-wrap">
          {["Constat", "Solution", "March\u00e9", "FAQ"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-white/30 hover:text-[#C4956A] transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-8">&copy; 2024\u20132026 E-Dome. Tous droits r\u00e9serv\u00e9s.</p>
      </footer>
    </>
  );
}
