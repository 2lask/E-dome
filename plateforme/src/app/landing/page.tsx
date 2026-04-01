"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2, Users, Handshake, GraduationCap, Briefcase, Camera,
  Home, TrendingUp, Scale, Compass, UserCheck, PenTool, Globe,
  ShoppingBag, Network, Award, Wrench, Star, ChevronRight,
  Check, X, ArrowRight, Loader2, Phone, Mail, User, MapPin,
  Play, Shield, Zap, Target, Heart, MessageCircle, BarChart3,
  Layers, BookOpen, Search
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const PAIN_POINTS = [
  {
    icon: Layers,
    title: "Plateformes fragmentees",
    desc: "Airbnb, Immoscout, Instagram, formations... tout est disperse sur des dizaines de plateformes incompatibles.",
  },
  {
    icon: BarChart3,
    title: "Commissions excessives",
    desc: "Jusqu'a 20% de commissions prelevees par les intermediaires, reduisant drastiquement vos marges.",
  },
  {
    icon: Network,
    title: "Aucun reseau social dedie",
    desc: "Pas de lieu central pour echanger, partager et collaborer entre professionnels de l'immobilier.",
  },
  {
    icon: Handshake,
    title: "Pas de systeme d'apporteurs structure",
    desc: "Aucun mecanisme transparent pour remunerer ceux qui referent des clients ou des biens.",
  },
  {
    icon: GraduationCap,
    title: "Formations dispersees et cheres",
    desc: "Des formations immobilieres eparpillees, sans certification reconnue et souvent hors de prix.",
  },
];

const PILLARS = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    desc: "Vente, location court et long terme. Publiez, recherchez et reservez en quelques clics.",
    color: "#C4956A",
  },
  {
    icon: MessageCircle,
    title: "Reseau social immobilier",
    desc: "Feed, stories, groupes, lives. Connectez-vous avec la communaute immobiliere mondiale.",
    color: "#7C9EE5",
  },
  {
    icon: Handshake,
    title: "Apporteurs d'affaires",
    desc: "Systeme de referral avec commissions transparentes. Gagnez en recommandant.",
    color: "#6ECF94",
  },
  {
    icon: Wrench,
    title: "Ecosysteme de services",
    desc: "Photographes, notaires, architectes, courtiers. Tous les pros au meme endroit.",
    color: "#E5A07C",
  },
  {
    icon: GraduationCap,
    title: "Formations et certifications",
    desc: "Apprenez, formez-vous et obtenez des certifications reconnues dans l'immobilier.",
    color: "#C47CE5",
  },
];

const ROLES_DATA = [
  { icon: User, label: "Client", desc: "Rechercher et louer un bien" },
  { icon: Home, label: "Hote", desc: "Mettre en location ses biens" },
  { icon: Building2, label: "Agence", desc: "Gerer un portefeuille immobilier" },
  { icon: TrendingUp, label: "Promoteur", desc: "Developper des projets neufs" },
  { icon: Handshake, label: "Apporteur", desc: "Referer clients et toucher des commissions" },
  { icon: Briefcase, label: "Investisseur", desc: "Investir dans l'immobilier mondial" },
  { icon: GraduationCap, label: "Formateur", desc: "Creer et vendre des formations" },
  { icon: Camera, label: "Photographe", desc: "Services photo immobiliere" },
  { icon: Scale, label: "Courtier", desc: "Accompagner les transactions" },
  { icon: PenTool, label: "Architecte", desc: "Concevoir et renover des espaces" },
  { icon: Shield, label: "Notaire", desc: "Securiser les actes et transactions" },
];

const STATS = [
  { value: "8 240", label: "Utilisateurs" },
  { value: "1 847", label: "Biens" },
  { value: "12", label: "Pays" },
  { value: "CHF 2.1M", label: "Transactions" },
];

const COMPARISON = {
  without: [
    "Plateformes fragmentees (5+ outils)",
    "Commissions de 15-20%",
    "Aucun reseau social immobilier",
    "Pas d'apporteurs d'affaires",
    "Formations dispersees et cheres",
  ],
  with: [
    "Tout-en-un : marketplace + social + services",
    "Commissions reduites et transparentes",
    "Reseau social integre et specialise",
    "Apporteurs remuneres automatiquement",
    "Formations certifiantes integrees",
  ],
};

const TESTIMONIALS = [
  {
    name: "Sophie Muller",
    role: "Agence immobiliere, Zurich",
    quote: "E-Dome a transforme notre facon de travailler. Nous avons centralise toute notre activite sur une seule plateforme et reduit nos couts de 30%.",
    avatar: "SM",
  },
  {
    name: "Karim Benali",
    role: "Investisseur, Dubai",
    quote: "Grace au reseau d'apporteurs, j'ai decouvert des opportunites que je n'aurais jamais trouvees ailleurs. Le ROI est exceptionnel.",
    avatar: "KB",
  },
  {
    name: "Claire Fontaine",
    role: "Formatrice, Paris",
    quote: "J'ai pu lancer ma formation en ligne en quelques jours et toucher des professionnels dans 8 pays differents. Un game-changer.",
    avatar: "CF",
  },
];

const COUNTRIES_LIST = [
  "Suisse", "France", "Belgique", "Luxembourg", "Maroc", "Tunisie",
  "Cote d'Ivoire", "Senegal", "Cameroun", "Emirats arabes unis", "Thailande", "Canada",
];

const ROLE_OPTIONS = [
  "Client", "Hote", "Agence", "Promoteur", "Apporteur d'affaires",
  "Investisseur", "Formateur", "Photographe", "Courtier", "Architecte", "Notaire",
];

const INTEREST_OPTIONS = [
  "Marketplace (achat/vente/location)",
  "Reseau social immobilier",
  "Apporteurs d'affaires",
  "Formations et certifications",
  "Services professionnels",
  "Investissement immobilier",
];

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [formStep, setFormStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formExperience, setFormExperience] = useState("");
  const [formInterests, setFormInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setFormInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFormSubmit = async () => {
    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setFormLoading(false);
    setFormSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]/30 transition-colors";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ─── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C4956A] flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <span className="text-xl font-bold">E-Dome</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <a href="#solution" className="hover:text-[#C4956A] transition-colors">Solution</a>
            <a href="#roles" className="hover:text-[#C4956A] transition-colors">Roles</a>
            <a href="#temoignages" className="hover:text-[#C4956A] transition-colors">Temoignages</a>
            <a href="#fondateur" className="hover:text-[#C4956A] transition-colors">Membre fondateur</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/connexion"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/auth/inscription"
              className="px-4 py-2 rounded-xl bg-[#C4956A] hover:bg-[#b8864f] text-white text-sm font-semibold transition-colors"
            >
              Creer un compte
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C4956A]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#C4956A]/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] text-sm text-[var(--text-secondary)] mb-8">
            <Globe className="w-4 h-4 text-[#C4956A]" />
            Disponible dans 12 pays
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            L&apos;ecosysteme immobilier{" "}
            <span className="text-[#C4956A]">international</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-10 leading-relaxed">
            E-Dome fusionne marketplace, reseau social, apporteurs d&apos;affaires,
            formations et services professionnels en une seule plateforme premium
            dediee a l&apos;immobilier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/inscription"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C4956A] hover:bg-[#b8864f] text-white font-semibold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#C4956A]/20"
            >
              Creer un compte
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/explorer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--hover-bg)] text-[var(--foreground)] font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-5 h-5" />
              Explorer les biens
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Constat du marche ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Le constat du marche
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              L&apos;immobilier souffre de problemes structurels que personne n&apos;a encore resolus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <point.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5 Piliers de la solution ────────────────────────────────────── */}
      <section id="solution" className="py-20 md:py-28 bg-gradient-to-b from-transparent via-[#C4956A]/5 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Les 5 piliers de la solution
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Une plateforme unique qui repond a tous les besoins de l&apos;ecosysteme immobilier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] card-hover ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="w-6 h-6" style={{ color: pillar.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Roles ───────────────────────────────────────────────────────── */}
      <section id="roles" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Un role pour chacun
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Que vous soyez client, professionnel ou investisseur, E-Dome s&apos;adapte a votre activite.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ROLES_DATA.map((role, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] card-hover text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C4956A]/10 flex items-center justify-center mx-auto mb-3">
                  <role.icon className="w-6 h-6 text-[#C4956A]" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{role.label}</h3>
                <p className="text-xs text-[var(--text-muted)]">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Chiffres cles ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-[#C4956A]/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chiffres cles
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#C4956A] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Avant / Apres ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Avant / Apres E-Dome
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sans E-Dome */}
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Sans E-Dome</h3>
              </div>
              <ul className="space-y-4">
                {COMPARISON.without.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avec E-Dome */}
            <div className="p-6 rounded-2xl border border-[#C4956A]/30 bg-[#C4956A]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#C4956A]/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#C4956A]" />
                </div>
                <h3 className="text-lg font-semibold">Avec E-Dome</h3>
              </div>
              <ul className="space-y-4">
                {COMPARISON.with.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#C4956A] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Temoignages ─────────────────────────────────────────────────── */}
      <section id="temoignages" className="py-20 md:py-28 bg-gradient-to-b from-transparent via-[#C4956A]/5 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-[#C4956A] fill-[#C4956A]" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 italic">
                  &laquo; {t.quote} &raquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C4956A]/20 flex items-center justify-center text-[#C4956A] text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Membres Fondateurs ──────────────────────────────────────────── */}
      <section id="fondateur" className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Devenez membre fondateur
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Rejoignez les premiers membres et beneficiez d&apos;avantages exclusifs a vie.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center p-8 rounded-2xl border border-[#C4956A]/30 bg-[#C4956A]/5 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-[#C4956A]/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#C4956A]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Candidature envoyee !</h3>
              <p className="text-[var(--text-secondary)]">
                Merci pour votre interet. Nous reviendrons vers vous tres prochainement
                avec les details de votre adhesion fondateur.
              </p>
            </div>
          ) : (
            <div className="p-6 md:p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        s <= formStep
                          ? "bg-[#C4956A] text-white"
                          : "bg-[var(--input-bg)] text-[var(--text-muted)]"
                      }`}
                    >
                      {s < formStep ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`flex-1 h-0.5 rounded-full transition-colors ${
                          s < formStep ? "bg-[#C4956A]" : "bg-[var(--input-bg)]"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Coordonnees */}
              {formStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Coordonnees</h3>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Jean Dupont"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="jean@exemple.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Telephone</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+41 79 123 45 67"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Pays</label>
                    <select
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Selectionnez un pays</option>
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Role principal</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Selectionnez un role</option>
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Experience */}
              {formStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Votre experience</h3>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">
                      Decrivez votre experience dans l&apos;immobilier
                    </label>
                    <textarea
                      value={formExperience}
                      onChange={(e) => setFormExperience(e.target.value)}
                      placeholder="Parlez-nous de votre parcours, vos projets, vos objectifs..."
                      rows={6}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Interets */}
              {formStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Vos centres d&apos;interet</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Selectionnez les fonctionnalites qui vous interessent le plus :
                  </p>
                  <div className="space-y-3">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label
                        key={interest}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formInterests.includes(interest)
                            ? "border-[#C4956A] bg-[#C4956A]/10"
                            : "border-[var(--card-border)] hover:border-[var(--text-muted)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formInterests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="w-4 h-4 rounded accent-[#C4956A]"
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {formStep > 1 && (
                  <button
                    onClick={() => setFormStep(formStep - 1)}
                    className="px-6 py-3 rounded-xl border border-[var(--card-border)] bg-transparent hover:bg-[var(--hover-bg)] text-[var(--foreground)] font-medium transition-colors"
                  >
                    Retour
                  </button>
                )}
                <button
                  onClick={formStep < 3 ? () => setFormStep(formStep + 1) : handleFormSubmit}
                  disabled={formLoading}
                  className="flex-1 py-3 rounded-xl bg-[#C4956A] hover:bg-[#b8864f] text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {formLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : formStep < 3 ? (
                    <>
                      Suivant
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Envoyer ma candidature
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--divider)] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#C4956A] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">E</span>
                </div>
                <span className="font-bold">E-Dome</span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                L&apos;ecosysteme immobilier international.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Plateforme</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/explorer" className="hover:text-[#C4956A] transition-colors">Explorer</Link></li>
                <li><Link href="/auth/inscription" className="hover:text-[#C4956A] transition-colors">S&apos;inscrire</Link></li>
                <li><Link href="/auth/connexion" className="hover:text-[#C4956A] transition-colors">Connexion</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/conditions" className="hover:text-[#C4956A] transition-colors">Conditions</Link></li>
                <li><Link href="/confidentialite" className="hover:text-[#C4956A] transition-colors">Confidentialite</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/aide" className="hover:text-[#C4956A] transition-colors">Aide</Link></li>
                <li><Link href="/contact" className="hover:text-[#C4956A] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--divider)]">
            <p className="text-sm text-[var(--text-muted)]">
              &copy; 2026 E-Dome. Tous droits reserves.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="w-9 h-9 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#C4956A] transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#C4956A] transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#C4956A] transition-colors" aria-label="X / Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
