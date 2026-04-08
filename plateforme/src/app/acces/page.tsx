"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Globe } from "lucide-react";
import Link from "next/link";

const activites = [
  "Agent immobilier",
  "Hôte / Propriétaire",
  "Investisseur",
  "Apporteur d'affaires",
  "Formateur",
  "Photographe immobilier",
  "Courtier / Financement",
  "Notaire",
  "Architecte",
  "Promoteur",
  "Home stager",
  "Gestionnaire de biens",
  "Autre",
];

const sources = [
  "Réseaux sociaux",
  "Bouche à oreille",
  "Recherche Google",
  "Recommandation professionnelle",
  "Événement / Conférence",
  "Autre",
];

export default function AccesPage() {
  const router = useRouter();
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-white text-3xl font-semibold mb-4 tracking-tight">
            Merci, {form.prenom} !
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-3">
            Votre manifestation d&apos;intérêt a bien été enregistrée.
            {form.premierMembre === "oui" && (
              <span className="text-[#C4956A]"> Vous faites partie des premiers membres fondateurs.</span>
            )}
          </p>
          <p className="text-white/40 text-sm mb-3">
            Vous pouvez maintenant explorer la maquette interactive d&apos;E-Dome
            avec toutes ses fonctionnalités.
          </p>
          <p className="text-white/25 text-xs mb-8">
            Rappel : cette maquette est un modèle de visualisation avec des données
            fictives. Elle permet de découvrir les fonctionnalités prévues pour la
            plateforme finale.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-8 py-4 text-sm font-semibold hover:bg-[#d4a57a] transition-colors"
          >
            Accéder à la maquette <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Globe size={20} className="text-[#C4956A]" />
          <span className="text-white font-semibold text-lg">E-<span className="text-[#C4956A]">Dome</span></span>
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-[#C4956A] w-8" : "bg-white/10 w-4"
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
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">Étape 1 / {totalSteps}</p>
              <h2 className="text-white text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Faisons connaissance.
              </h2>
              <p className="text-white/50 text-sm mb-3">
                Ces informations nous permettent de vous contacter et de
                personnaliser votre expérience.
              </p>
              <p className="text-white/30 text-xs mb-10">
                Ce formulaire est une manifestation d&apos;intérêt sans engagement
                ni obligation. La maquette que vous allez explorer est un modèle
                de visualisation — toutes les données présentées sont fictives.
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Prénom *</label>
                    <input
                      type="text" value={form.prenom}
                      onChange={(e) => update("prenom", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Nom *</label>
                    <input
                      type="text" value={form.nom}
                      onChange={(e) => update("nom", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Email *</label>
                  <input
                    type="email" value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Téléphone</label>
                  <input
                    type="tel" value={form.telephone}
                    onChange={(e) => update("telephone", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                    placeholder="+41 79 000 00 00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Activité */}
          {step === 2 && (
            <div>
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">Étape 2 / {totalSteps}</p>
              <h2 className="text-white text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Parlez-nous de vous.
              </h2>
              <p className="text-white/50 text-sm mb-10">
                Votre profil nous aide à adapter E-Dome aux vrais besoins du terrain.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Vos activités * <span className="text-white/20">(plusieurs choix possibles)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {activites.map((a) => {
                      const selected = form.activites.includes(a);
                      return (
                        <button
                          key={a}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              activites: selected
                                ? prev.activites.filter((x) => x !== a)
                                : [...prev.activites, a],
                            }));
                          }}
                          className={`text-xs px-4 py-2.5 rounded-lg border transition-colors ${
                            selected
                              ? "bg-[#C4956A]/15 border-[#C4956A]/40 text-[#C4956A]"
                              : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
                          }`}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                  {form.activites.includes("Autre") && (
                    <input
                      type="text" value={form.activiteAutre}
                      onChange={(e) => update("activiteAutre", e.target.value)}
                      className="w-full mt-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                      placeholder="Précisez votre activité"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Ville</label>
                    <input
                      type="text" value={form.ville}
                      onChange={(e) => update("ville", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                      placeholder="Votre ville"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Pays *</label>
                    <input
                      type="text" value={form.pays}
                      onChange={(e) => update("pays", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20"
                      placeholder="Suisse, France..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Années d&apos;expérience dans l&apos;immobilier</label>
                  <div className="flex gap-2">
                    {["Débutant", "1-3 ans", "3-10 ans", "10+ ans"].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => update("experience", exp)}
                        className={`text-xs px-4 py-2.5 rounded-lg border transition-colors flex-1 ${
                          form.experience === exp
                            ? "bg-[#C4956A]/15 border-[#C4956A]/40 text-[#C4956A]"
                            : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {exp}
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
              <p className="text-[#C4956A] text-xs tracking-widest uppercase mb-3 font-medium">Étape 3 / {totalSteps}</p>
              <h2 className="text-white text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Dernière étape.
              </h2>
              <p className="text-white/50 text-sm mb-10">
                Dites-nous comment vous voyez votre place dans l&apos;écosystème E-Dome.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-white/40 text-xs mb-3 block">
                    Souhaitez-vous faire partie des premiers membres au lancement ?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "oui", label: "Oui, je veux être parmi les premiers", sub: "Accès anticipé, badge fondateur, visibilité prioritaire" },
                      { value: "peut-etre", label: "Peut-être, je veux d'abord en savoir plus", sub: "Recevez les actualités et décidez plus tard" },
                      { value: "non", label: "Non, je souhaite juste explorer la maquette", sub: "Accès libre à la démonstration" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update("premierMembre", opt.value)}
                        className={`w-full text-left rounded-xl p-5 border transition-colors ${
                          form.premierMembre === opt.value
                            ? "bg-[#C4956A]/10 border-[#C4956A]/30"
                            : "bg-white/3 border-white/8 hover:border-white/15"
                        }`}
                      >
                        <p className={`text-sm font-medium mb-1 ${form.premierMembre === opt.value ? "text-[#C4956A]" : "text-white/80"}`}>
                          {opt.label}
                        </p>
                        <p className="text-white/35 text-xs">{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Comment avez-vous entendu parler d&apos;E-Dome ?</label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s) => (
                      <button
                        key={s}
                        onClick={() => update("source", s)}
                        className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                          form.source === s
                            ? "bg-[#C4956A]/15 border-[#C4956A]/40 text-[#C4956A]"
                            : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Un message, une question, une idée ? (optionnel)</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C4956A]/50 transition-colors placeholder:text-white/20 resize-none"
                    placeholder="Partagez-nous ce que vous pensez du projet..."
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) => update("newsletter", e.target.checked)}
                    className="mt-1 accent-[#C4956A]"
                  />
                  <span className="text-white/50 text-xs leading-relaxed">
                    Je souhaite recevoir les actualités d&apos;E-Dome et être informé(e)
                    des prochaines étapes du projet.
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
                <ArrowLeft size={16} /> Retour
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors">
                <ArrowLeft size={16} /> Retour au site
              </Link>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => canNext() && setStep(step + 1)}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
                  canNext()
                    ? "bg-[#C4956A] text-black hover:bg-[#d4a57a]"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                Continuer <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-[#C4956A] text-black rounded-lg px-6 py-3 text-sm font-semibold hover:bg-[#d4a57a] transition-colors"
              >
                Accéder à la maquette <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
