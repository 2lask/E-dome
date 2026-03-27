"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Home, Building2, Smartphone, Link2, Settings, BookOpen,
  TrendingDown, Lock, Megaphone, ExternalLink, Handshake, User, HardHat,
  BarChart3, GraduationCap, Key, Camera, Briefcase, PenTool, Scale,
  ChevronDown, Award, Rocket, Users, Calendar, MessageSquare,
} from "lucide-react";

/* ── Data ── */

const problems = [
  { icon: TrendingDown, title: "Secteur fragment\u00e9", desc: "Chaque acteur travaille en silo, sans infrastructure commune." },
  { icon: Lock, title: "Revenus captur\u00e9s", desc: "Les plateformes absorbent une part importante de chaque transaction." },
  { icon: Megaphone, title: "Aucune propri\u00e9t\u00e9", desc: "Donn\u00e9es et r\u00e9putation construites sur des plateformes lou\u00e9es." },
  { icon: ExternalLink, title: "Attention perdue", desc: "Le contenu redirige toujours ailleurs. L\u2019utilisateur se perd." },
];

const pillars = [
  { num: "01", icon: Home, title: "Marketplace", desc: "Achetez, vendez, louez avec des frais nettement inf\u00e9rieurs.", color: "#3B82F6" },
  { num: "02", icon: Smartphone, title: "R\u00e9seau social", desc: "Publiez, connectez et construisez votre r\u00e9putation.", color: "#8B5CF6" },
  { num: "03", icon: Link2, title: "Apporteurs", desc: "Liens tra\u00e7ables, commissions automatiques.", color: "#F59E0B" },
  { num: "04", icon: Settings, title: "\u00c9cosyst\u00e8me", desc: "Services, analytics, conformit\u00e9 \u2014 tout int\u00e9gr\u00e9.", color: "#10B981" },
  { num: "05", icon: BookOpen, title: "Formations", desc: "Webinars, coaching et certifications.", color: "#EC4899" },
];

const roles = [
  { icon: User, name: "Client", color: "#8B5CF6" },
  { icon: Home, name: "H\u00f4te", color: "#3B82F6" },
  { icon: Building2, name: "Agence", color: "#8B5CF6" },
  { icon: HardHat, name: "Promoteur", color: "#10B981" },
  { icon: Handshake, name: "Apporteur", color: "#F59E0B" },
  { icon: BarChart3, name: "Investisseur", color: "#EF4444" },
  { icon: GraduationCap, name: "Formateur", color: "#EC4899" },
  { icon: Key, name: "Propri\u00e9taire", color: "#06B6D4" },
  { icon: Camera, name: "Photographe", color: "#F97316" },
  { icon: Briefcase, name: "Courtier", color: "#6366F1" },
  { icon: PenTool, name: "Architecte", color: "#C4956A" },
  { icon: Scale, name: "Notaire", color: "#14B8A6" },
];

const founders = [
  { icon: Award, label: "Badge fondateur permanent" },
  { icon: Rocket, label: "Acc\u00e8s b\u00eata anticip\u00e9" },
  { icon: BookOpen, label: "Formations offertes" },
  { icon: Users, label: "R\u00e9seau exclusif" },
  { icon: Calendar, label: "Parcours avant lancement" },
  { icon: MessageSquare, label: "Voix dans les d\u00e9cisions" },
];

const faqs = [
  { q: "E-Dome est-il d\u00e9j\u00e0 lanc\u00e9 ?", a: "Non, le lancement est pr\u00e9vu pour 2026. Les membres fondateurs auront un acc\u00e8s anticip\u00e9." },
  { q: "La manifestation d\u2019int\u00e9r\u00eat engage-t-elle ?", a: "Aucun engagement, aucun paiement. Simple expression d\u2019int\u00e9r\u00eat." },
  { q: "\u00c0 qui s\u2019adresse E-Dome ?", a: "Tout acteur li\u00e9 \u00e0 l\u2019immobilier : agents, h\u00f4tes, investisseurs, promoteurs, photographes, notaires, architectes et bien d\u2019autres." },
  { q: "E-Dome est-il limit\u00e9 \u00e0 un seul pays ?", a: "Non, plateforme internationale accessible partout dans le monde." },
  { q: "Comment devenir membre fondateur ?", a: "Formulaire, s\u00e9lection, conf\u00e9rence explicative, configuration du compte avant le lancement officiel." },
];

/* ── Reusable Components ── */

function Section({ children, className = "", id, bg = "" }: { children: React.ReactNode; className?: string; id?: string; bg?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section ref={ref} id={id}
      className={`relative py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden ${bg} ${className}`}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
      {children}
    </motion.section>
  );
}

function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const x = direction === "left" ? -50 : direction === "right" ? 50 : 0;
  const y = direction === "up" ? 40 : 0;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x, y }} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C4956A] font-medium mb-6">
      <span className="w-8 h-px bg-[#C4956A]" />{children}
    </span>
  );
}

function ArchSVG({ variant, className = "" }: { variant: "tower" | "villa" | "plan"; className?: string }) {
  if (variant === "tower") return (
    <svg viewBox="0 0 300 500" className={`absolute pointer-events-none opacity-[0.04] ${className}`} fill="none" stroke="#C4956A" strokeWidth="0.5">
      <motion.rect x="80" y="40" width="140" height="420" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5 }} />
      {[120, 200, 280, 360].map((y, i) => <motion.line key={i} x1="80" y1={y} x2="220" y2={y} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 + i * 0.2 }} />)}
      {[100, 150].map((x, i) => [60, 140, 220, 300, 380].map((y, j) => (
        <motion.rect key={`${i}-${j}`} x={x} y={y} width="25" height="35" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 + (i + j) * 0.08 }} />
      )))}
    </svg>
  );
  if (variant === "villa") return (
    <svg viewBox="0 0 500 250" className={`absolute pointer-events-none opacity-[0.05] ${className}`} fill="none" stroke="#C4956A" strokeWidth="0.5">
      <motion.rect x="40" y="80" width="420" height="150" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
      <motion.polygon points="40,80 250,15 460,80" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} />
      {[80, 170, 310, 400].map((x, i) => <motion.rect key={i} x={x} y={120} width="40" height="60" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 + i * 0.12 }} />)}
      <motion.line x1="0" y1="230" x2="500" y2="230" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
    </svg>
  );
  return (
    <svg viewBox="0 0 400 400" className={`absolute pointer-events-none opacity-[0.04] ${className}`} fill="none" stroke="#C4956A" strokeWidth="0.5">
      <motion.rect x="50" y="50" width="300" height="300" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
      <motion.line x1="50" y1="200" x2="350" y2="200" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.4 }} />
      <motion.line x1="200" y1="50" x2="200" y2="350" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.6 }} />
      <motion.line x1="50" y1="125" x2="200" y2="125" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.8 }} />
      <motion.rect x="220" y="220" width="60" height="80" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1 }} />
    </svg>
  );
}

function Divider() {
  return (
    <div className="relative h-px max-w-[1200px] mx-auto">
      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4956A]/20 to-transparent"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }} />
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#C4956A]/20 transition-all duration-500">
        <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left" aria-expanded={open}>
          <span className="font-medium pr-4">{q}</span>
          <ChevronDown className={`w-4 h-4 text-[#C4956A] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              <p className="px-6 pb-5 text-white/40 leading-relaxed">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/* ── Page ── */

export default function Page() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <main className="bg-[#080808] text-[#f5f0eb]">

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#080808]/80 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold">Projet E-<span className="text-[#C4956A]">Dome</span></a>
          <nav className="hidden md:flex items-center gap-8">
            {[["Constat","constat"],["Solution","solution"],["R\u00f4les","roles"],["Fondateurs","fondateurs"],["FAQ","faq"]].map(([label, href]) => (
              <a key={href} href={`#${href}`} className="text-sm text-white/40 hover:text-white transition-colors">{label}</a>
            ))}
            <a href="#rejoindre" className="px-5 py-2 rounded-full bg-[#C4956A] text-[#080808] text-sm font-semibold hover:bg-[#D4A574] transition-all">Rejoindre</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center justify-center text-center px-6 pt-16 arch-grid">
        <ArchSVG variant="tower" className="w-[350px] h-[500px] right-[5%] top-[8%]" />
        <ArchSVG variant="villa" className="w-[450px] h-[230px] left-[3%] bottom-[8%]" />
        <div className="max-w-[800px] relative z-10">
          <Reveal delay={0.2}><Badge>Projet E-Dome</Badge></Reveal>
          <Reveal delay={0.4}>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
              L&apos;&eacute;cosyst&egrave;me qui r&eacute;unit l&apos;immobilier <span className="text-[#C4956A]">mondial.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.6}>
            <p className="text-white/40 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
              Marketplace, r&eacute;seau social, apporteurs d&apos;affaires, formations et services &mdash; r&eacute;unis pour la premi&egrave;re fois.
            </p>
          </Reveal>
          <Reveal delay={0.8}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#rejoindre" className="px-8 py-4 rounded-full bg-[#C4956A] text-[#080808] font-semibold text-lg hover:bg-[#D4A574] transition-all inline-flex items-center gap-2">
                Rejoindre les Fondateurs <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#constat" className="px-8 py-4 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all text-lg">
                D&eacute;couvrir
              </a>
            </div>
          </Reveal>
        </div>
      </motion.section>

      <Divider />

      {/* CONSTAT */}
      <Section id="constat" bg="dot-grid">
        <ArchSVG variant="tower" className="w-[280px] h-[400px] right-[2%] top-0 rotate-6" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal><Badge>Le constat</Badge></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Un march&eacute; immobilier <span className="text-[#C4956A]">fragment&eacute;.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 mt-4 text-lg max-w-2xl leading-relaxed">
              Les professionnels jonglent entre des outils d&eacute;connect&eacute;s, perdent des revenus et n&apos;ont aucun contr&ocirc;le sur leurs donn&eacute;es.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 hover:border-[#C4956A]/20 transition-all duration-500">
                  <p.icon className="w-5 h-5 text-[#C4956A] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* SOLUTION */}
      <Section id="solution" bg="blueprint-grid">
        <ArchSVG variant="villa" className="w-[550px] h-[280px] left-0 bottom-[5%]" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal><Badge>La solution</Badge></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Cinq piliers. <span className="text-[#C4956A]">Un &eacute;cosyst&egrave;me.</span>
            </h2>
          </Reveal>
          <div className="mt-14 space-y-4">
            {pillars.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.08} direction="left">
                <div className="group flex items-start gap-6 md:gap-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-[#C4956A]/20 transition-all duration-500">
                  <span className="text-4xl font-extrabold tracking-[-0.05em] min-w-[50px] opacity-[0.08]">{p.num}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${p.color}15` }}>
                      <p.icon className="w-4 h-4" style={{ color: p.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="text-white/40 text-sm mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* RÔLES */}
      <Section id="roles" bg="arch-grid">
        <ArchSVG variant="plan" className="w-[350px] h-[350px] left-[3%] top-[8%]" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal><Badge>Multi-r&ocirc;les</Badge></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Un compte. <span className="text-[#C4956A]">Tous les r&ocirc;les.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 mt-4 text-lg max-w-xl leading-relaxed">
              Chaque profil est configurable. Quel que soit votre m&eacute;tier, E-Dome s&apos;adapte.
            </p>
          </Reveal>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-14">
            {roles.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.04}>
                <motion.a href="#rejoindre" whileHover={{ y: -4 }}
                  className="block text-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[#C4956A]/20 transition-all duration-500">
                  <div className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-2" style={{ background: `${r.color}15` }}>
                    <r.icon className="w-4 h-4" style={{ color: r.color }} />
                  </div>
                  <p className="text-xs font-medium">{r.name}</p>
                </motion.a>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.5}>
            <p className="text-center text-white/25 text-sm mt-8">Et bien d&apos;autres &mdash; chaque profil est enti&egrave;rement configurable.</p>
          </Reveal>
        </div>
      </Section>

      <Divider />

      {/* FONDATEURS */}
      <Section id="fondateurs" bg="dot-grid">
        <ArchSVG variant="villa" className="w-[480px] h-[240px] right-0 bottom-[8%]" />
        <div className="max-w-[900px] mx-auto text-center relative z-10">
          <Reveal><Badge>Programme Fondateurs</Badge></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Fa&ccedil;onnez E-Dome <span className="text-[#C4956A]">avec nous.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
              Les premiers membres fondateurs construisent la plateforme de l&apos;int&eacute;rieur. Places limit&eacute;es.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {founders.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06}>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-left hover:border-[#C4956A]/20 transition-all duration-500">
                  <f.icon className="w-5 h-5 text-[#C4956A] mb-3" />
                  <p className="text-sm font-medium">{f.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4}>
            <a href="#rejoindre" className="inline-flex items-center gap-2 mt-12 px-8 py-4 rounded-full bg-[#C4956A] text-[#080808] font-semibold text-lg hover:bg-[#D4A574] transition-all">
              Manifester mon int&eacute;r&ecirc;t <ArrowRight className="w-5 h-5" />
            </a>
          </Reveal>
        </div>
      </Section>

      <Divider />

      {/* FAQ */}
      <Section id="faq" bg="blueprint-grid">
        <div className="max-w-[700px] mx-auto relative z-10">
          <Reveal><Badge>Questions</Badge></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Besoin de <span className="text-[#C4956A]">clart&eacute; ?</span>
            </h2>
          </Reveal>
          <div className="mt-12 space-y-3">
            {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </Section>

      <Divider />

      {/* FORMULAIRE */}
      <Section id="rejoindre" bg="arch-grid">
        <div className="max-w-[550px] mx-auto text-center relative z-10">
          <Reveal><Badge>Rejoindre</Badge></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Devenez <span className="text-[#C4956A]">fondateur.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 mt-4 text-lg leading-relaxed">
              Laissez vos coordonn&eacute;es et nous vous recontacterons.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <form className="mt-10 space-y-4 text-left" onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              const params = new URLSearchParams();
              fd.forEach((v, k) => params.append(k, v as string));
              fetch(`https://script.google.com/macros/s/AKfycby_TI8c1iuF9PjO1Ohu_0zVJThqjZ03f-pSOgioCFdr-NdQI_N-5Ar4a1rQxR0oyDSW/exec?${params}`)
                .then(() => alert("Merci ! Nous avons bien re\u00e7u votre demande."))
                .catch(() => alert("Erreur, veuillez r\u00e9essayer."));
            }}>
              <div className="grid grid-cols-2 gap-3">
                <input name="prenom" placeholder="Pr\u00e9nom" required className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#C4956A]/40 focus:outline-none transition-colors" />
                <input name="nom" placeholder="Nom" required className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#C4956A]/40 focus:outline-none transition-colors" />
              </div>
              <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#C4956A]/40 focus:outline-none transition-colors" />
              <input name="pays" placeholder="Pays / Ville" required className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#C4956A]/40 focus:outline-none transition-colors" />
              <select name="role" required className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 focus:border-[#C4956A]/40 focus:outline-none transition-colors">
                <option value="">Votre r&ocirc;le principal</option>
                {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                <option value="Autre">Autre</option>
              </select>
              <button type="submit" className="w-full py-4 rounded-xl bg-[#C4956A] text-[#080808] font-semibold text-lg hover:bg-[#D4A574] transition-all">
                Envoyer
              </button>
            </form>
          </Reveal>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold">Projet E-<span className="text-[#C4956A]">Dome</span></p>
            <p className="text-white/25 text-sm mt-1">contact@edome.world</p>
          </div>
          <p className="text-xs text-white/20">&copy; 2026 E-Dome</p>
        </div>
      </footer>
    </main>
  );
}
