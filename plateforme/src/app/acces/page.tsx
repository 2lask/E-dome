"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Globe } from "lucide-react";
import Link from "next/link";
import { useLandingLang, LandingLanguageProvider } from "@/components/landing/landing-i18n";

function AccesPageContent() {
  const router = useRouter();
  const { t } = useLandingLang();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    activites: [] as string[],
    activiteAutre: "",
    ville: "",
    pays: "",
    experience: "",
    source: "",
    premierMembre: "",
    newsletter: true,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;

  const activites = [
    { key: "form.activity_agent", label: t("form.activity_agent") },
    { key: "form.activity_hote", label: t("form.activity_hote") },
    { key: "form.activity_investisseur", label: t("form.activity_investisseur") },
    { key: "form.activity_apporteur", label: t("form.activity_apporteur") },
    { key: "form.activity_formateur", label: t("form.activity_formateur") },
    { key: "form.activity_photographe", label: t("form.activity_photographe") },
    { key: "form.activity_courtier", label: t("form.activity_courtier") },
    { key: "form.activity_notaire", label: t("form.activity_notaire") },
    { key: "form.activity_architecte", label: t("form.activity_architecte") },
    { key: "form.activity_promoteur", label: t("form.activity_promoteur") },
    { key: "form.activity_home_stager", label: t("form.activity_home_stager") },
    { key: "form.activity_gestionnaire", label: t("form.activity_gestionnaire") },
    { key: "form.activity_autre", label: t("form.activity_autre") },
  ];

  const sources = [
    { key: "form.source_social", label: t("form.source_social") },
    { key: "form.source_word_of_mouth", label: t("form.source_word_of_mouth") },
    { key: "form.source_google", label: t("form.source_google") },
    { key: "form.source_recommendation", label: t("form.source_recommendation") },
    { key: "form.source_event", label: t("form.source_event") },
    { key: "form.source_other", label: t("form.source_other") },
  ];

  const experiences = [
    { key: "form.experience_beginner", label: t("form.experience_beginner") },
    { key: "form.experience_1_3", label: t("form.experience_1_3") },
    { key: "form.experience_3_10", label: t("form.experience_3_10") },
    { key: "form.experience_10_plus", label: t("form.experience_10_plus") },
  ];

  const memberOptions = [
    { value: "oui", label: t("form.member_yes"), sub: t("form.member_yes_sub") },
    { value: "peut-etre", label: t("form.member_maybe"), sub: t("form.member_maybe_sub") },
    { value: "non", label: t("form.member_no"), sub: t("form.member_no_sub") },
  ];

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 1) return form.prenom && form.nom && form.email;
    if (step === 2) return form.activites.length > 0 && form.pays;
    return true;
  };

  const handleSubmit = () => {
    // Store in localStorage to remember access
    localStorage.setItem("edome_access_granted", "true");
    localStorage.setItem("edome_member_name", `${form.prenom} ${form.nom}`);
    setSubmitted(true);
  };

  const stepOf = t("form.step_of")
    .replace("{current}", String(step))
    .replace("{total}", String(totalSteps));

  if (submitted) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-white text-3xl font-semibold mb-4 tracking-tight">
            {t("form.success_title").replace("{name}", form.prenom)}
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-3">
            {t("form.success_desc")}
            {form.premierMembre === "oui" && (
              <span className="text-[#1e9df1]"> {t("form.success_founder")}</span>
            )}
          </p>

          {/* Desktop: access demo */}
          <div className="hidden md:block">
            <p className="text-white/40 text-sm mb-3">
              {t("form.success_desktop_desc")}
            </p>
            <p className="text-white/25 text-xs mb-8">
              {t("form.success_desktop_disclaimer")}
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 bg-[#1e9df1] text-black rounded-lg px-8 py-4 text-sm font-semibold hover:bg-[#d4a57a] transition-colors"
            >
              {t("form.success_desktop_cta")} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile: desktop only message */}
          <div className="md:hidden">
            <div className="rounded-2xl border border-[#1e9df1]/20 p-6 mb-6" style={{ background: "rgba(30, 157, 242, 0.05)" }}>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1e9df1]">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h2 className="text-white text-lg font-semibold mb-3">
                {t("form.success_mobile_title")}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-2">
                {t("form.success_mobile_desc")}
              </p>
              <p className="text-white/30 text-xs">
                edome-demo.vercel.app
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors"
            >
              <ArrowLeft size={16} /> {t("form.nav_back_site")}
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Globe size={20} className="text-[#1e9df1]" />
          <span className="text-white font-semibold text-lg">E-<span className="text-[#1e9df1]">Dome</span></span>
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-[#1e9df1] w-8" : "bg-white/10 w-4"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="max-w-xl w-full">

          {/* Step 1: Contact */}
          {step === 1 && (
            <div>
              <p className="text-[#1e9df1] text-xs tracking-widest uppercase mb-3 font-medium">
                {t("form.step_of").replace("{current}", "1").replace("{total}", String(totalSteps))}
              </p>
              <h2 className="text-white text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                {t("form.step1_title")}
              </h2>
              <p className="text-white/50 text-sm mb-3">
                {t("form.step1_desc")}
              </p>
              <p className="text-white/30 text-xs mb-10">
                {t("form.step1_disclaimer")}
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_prenom")}</label>
                    <input
                      type="text" value={form.prenom}
                      onChange={(e) => update("prenom", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                      placeholder={t("form.placeholder_prenom")}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_nom")}</label>
                    <input
                      type="text" value={form.nom}
                      onChange={(e) => update("nom", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                      placeholder={t("form.placeholder_nom")}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_email")}</label>
                  <input
                    type="email" value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                    placeholder={t("form.placeholder_email")}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_telephone")}</label>
                  <input
                    type="tel" value={form.telephone}
                    onChange={(e) => update("telephone", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                    placeholder={t("form.placeholder_telephone")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Activite */}
          {step === 2 && (
            <div>
              <p className="text-[#1e9df1] text-xs tracking-widest uppercase mb-3 font-medium">
                {t("form.step_of").replace("{current}", "2").replace("{total}", String(totalSteps))}
              </p>
              <h2 className="text-white text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                {t("form.step2_title")}
              </h2>
              <p className="text-white/50 text-sm mb-10">
                {t("form.step2_desc")}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_activites")} <span className="text-white/20">{t("form.label_activites_multi")}</span></label>
                  <div className="flex flex-wrap gap-2">
                    {activites.map((a) => {
                      const selected = form.activites.includes(a.key);
                      return (
                        <button
                          key={a.key}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              activites: selected
                                ? prev.activites.filter((x) => x !== a.key)
                                : [...prev.activites, a.key],
                            }));
                          }}
                          className={`text-xs px-4 py-3 rounded-lg border transition-colors ${
                            selected
                              ? "bg-[#1e9df1]/15 border-[#1e9df1]/40 text-[#1e9df1]"
                              : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
                          }`}
                        >
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                  {form.activites.includes("form.activity_autre") && (
                    <input
                      type="text" value={form.activiteAutre}
                      onChange={(e) => update("activiteAutre", e.target.value)}
                      className="w-full mt-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                      placeholder={t("form.label_activite_autre")}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_ville")}</label>
                    <input
                      type="text" value={form.ville}
                      onChange={(e) => update("ville", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                      placeholder={t("form.placeholder_ville")}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_pays")}</label>
                    <input
                      type="text" value={form.pays}
                      onChange={(e) => update("pays", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20"
                      placeholder={t("form.placeholder_pays")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_experience")}</label>
                  <div className="grid grid-cols-2 sm:flex gap-2">
                    {experiences.map((exp) => (
                      <button
                        key={exp.key}
                        onClick={() => update("experience", exp.key)}
                        className={`text-xs px-4 py-2.5 rounded-lg border transition-colors ${
                          form.experience === exp.key
                            ? "bg-[#1e9df1]/15 border-[#1e9df1]/40 text-[#1e9df1]"
                            : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Engagement */}
          {step === 3 && (
            <div>
              <p className="text-[#1e9df1] text-xs tracking-widest uppercase mb-3 font-medium">
                {t("form.step_of").replace("{current}", "3").replace("{total}", String(totalSteps))}
              </p>
              <h2 className="text-white text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                {t("form.step3_title")}
              </h2>
              <p className="text-white/50 text-sm mb-10">
                {t("form.step3_desc")}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-white/40 text-xs mb-3 block">
                    {t("form.label_premier_membre")}
                  </label>
                  <div className="space-y-2">
                    {memberOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update("premierMembre", opt.value)}
                        className={`w-full text-left rounded-xl p-5 border transition-colors ${
                          form.premierMembre === opt.value
                            ? "bg-[#1e9df1]/10 border-[#1e9df1]/30"
                            : "bg-white/3 border-white/8 hover:border-white/15"
                        }`}
                      >
                        <p className={`text-sm font-medium mb-1 ${form.premierMembre === opt.value ? "text-[#1e9df1]" : "text-white/80"}`}>
                          {opt.label}
                        </p>
                        <p className="text-white/35 text-xs">{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_source")}</label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => update("source", s.key)}
                        className={`text-xs px-3 py-3 rounded-lg border transition-colors ${
                          form.source === s.key
                            ? "bg-[#1e9df1]/15 border-[#1e9df1]/40 text-[#1e9df1]"
                            : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">{t("form.label_message")}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#1e9df1]/50 transition-colors placeholder:text-white/20 resize-none"
                    placeholder={t("form.placeholder_message")}
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) => update("newsletter", e.target.checked)}
                    className="mt-1 accent-[#1e9df1]"
                  />
                  <span className="text-white/50 text-xs leading-relaxed">
                    {t("form.label_newsletter")}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors"
              >
                <ArrowLeft size={16} /> {t("form.nav_back")}
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors">
                <ArrowLeft size={16} /> {t("form.nav_back_site")}
              </Link>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => canNext() && setStep(step + 1)}
                className={`flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors ${
                  canNext()
                    ? "bg-[#1e9df1] text-black hover:bg-[#d4a57a]"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {t("form.nav_continue")} <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-[#1e9df1] text-black rounded-lg px-6 py-3.5 text-sm font-semibold hover:bg-[#d4a57a] transition-colors"
              >
                {t("form.nav_submit")} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccesPage() {
  return (
    <LandingLanguageProvider>
      <AccesPageContent />
    </LandingLanguageProvider>
  );
}
