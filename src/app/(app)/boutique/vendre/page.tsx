"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Building2, ExternalLink, Handshake } from "lucide-react";

/* /boutique/vendre — « Proposer vos produits en affiliation » (Mission 2, P4b).

   Ce que c'était : « Vendre un produit » façon eBay — mise en ligne validée
   « par l'équipe E-Dome », paiement encaissé via le PSP d'E-Dome, « commission
   marketplace 4–8 % » et une part apporteur de 10–30 % d'une commission qui
   vaut 0 (`RATES.boutique`). Le vendeur apparent que l'art. 20a LTVA vise.

   Ce que c'est : une demande de PARTENARIAT d'un marchand (une entreprise).
   E-Dome référence ses produits et redirige vers son site ; le marchand garde
   la vente, l'encaissement, la livraison, le SAV et la TVA. La rémunération
   d'affiliation est convenue avec chaque marchand — aucun pourcentage n'est
   affiché ni inventé ici (`DECISIONS-2.md` §D5, `DECISIONS.md` §1.8). */

interface MerchantForm {
  entreprise: string;
  ide: string;
  site: string;
  contact: string;
  email: string;
  categories: string[];
  references: string;
  message: string;
  attestation: boolean;
}

const CATEGORIES = ["Meubles", "Décoration", "Matériaux", "Cuisines", "Équipements", "Électroménager"];

const emptyForm: MerchantForm = {
  entreprise: "", ide: "", site: "", contact: "", email: "",
  categories: [], references: "", message: "", attestation: false,
};

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

const ROLES: { title: string; items: string[] }[] = [
  {
    title: "Ce que fait E-Dome",
    items: [
      "Référence vos produits dans la boutique, avec votre nom d'entreprise.",
      "Redirige l'acheteur vers votre site, après un écran « Vous quittez E-Dome ».",
      "Signale chaque fiche comme recommandation en affiliation.",
    ],
  },
  {
    title: "Ce qui reste chez vous",
    items: [
      "La vente : le contrat est conclu sur votre site, à votre prix.",
      "L'encaissement, la livraison, les retours et la garantie.",
      "Le service après-vente, et la TVA sur vos ventes.",
    ],
  },
];

export default function ProposerProduitsPage() {
  const [form, setForm] = useState<MerchantForm>(emptyForm);
  const [sent, setSent] = useState(false);

  const update = <K extends keyof MerchantForm>(key: K, value: MerchantForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (cat: string) => {
    update("categories", form.categories.includes(cat) ? form.categories.filter((c) => c !== cat) : [...form.categories, cat]);
  };

  const isValid =
    form.entreprise.trim() && form.contact.trim() && /.+@.+\..+/.test(form.email) && form.categories.length > 0 && form.attestation;

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full chip-success-soft flex items-center justify-center">
          <Check size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold">Demande de partenariat enregistrée</h1>
        <p className="text-[var(--text-secondary)]">
          Merci, {form.entreprise.trim()}. En service, E-Dome reviendrait vers {form.contact.trim()} pour convenir des
          conditions d&apos;affiliation propres à votre enseigne. Rien n&apos;est mis en vente sur E-Dome : vos produits
          seraient référencés avec un renvoi vers votre site.
        </p>
        <p className="text-xs text-[var(--text-muted)]">Démonstration : aucune demande n&apos;est transmise.</p>
        <div className="flex gap-3 justify-center pt-2 flex-wrap">
          <Link href="/boutique" className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-medium transition-opacity hover:opacity-90">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl page-heading">Proposer vos produits en affiliation</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Pour les marchands — fabricants, enseignes, ateliers — qui veulent être recommandés aux propriétaires et
          rénovateurs d&apos;E-Dome. E-Dome référence, vous gardez la vente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <div key={r.title} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">{r.title}</h2>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
              {r.items.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <Check size={12} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2.5">
        <Handshake size={16} className="shrink-0 mt-0.5 text-[var(--primary)]" />
        <p>
          <strong className="text-[var(--foreground)]">Rémunération :</strong> une rémunération d&apos;affiliation,
          payée par vous sur les ventes que nos recommandations vous apportent, convenue avec chaque marchand. Elle ne
          s&apos;ajoute jamais au prix payé par l&apos;acheteur, et E-Dome n&apos;encaisse rien de lui.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="m-entreprise" className={labelCls}>Raison sociale *</label>
            <input id="m-entreprise" type="text" className={inputCls} placeholder="Ex : Atelier du Bois SA"
              value={form.entreprise} onChange={(e) => update("entreprise", e.target.value)} />
          </div>
          <div>
            <label htmlFor="m-ide" className={labelCls}>Numéro IDE</label>
            <input id="m-ide" type="text" className={inputCls} placeholder="CHE-123.456.789"
              value={form.ide} onChange={(e) => update("ide", e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="m-site" className={labelCls}>Site marchand</label>
          <div className="relative">
            <ExternalLink size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input id="m-site" type="text" className={`${inputCls} pl-10`} placeholder="Le site où vos clients achètent"
              value={form.site} onChange={(e) => update("site", e.target.value)} />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">C&apos;est vers lui que les fiches renverront.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="m-contact" className={labelCls}>Personne de contact *</label>
            <input id="m-contact" type="text" className={inputCls} placeholder="Prénom Nom"
              value={form.contact} onChange={(e) => update("contact", e.target.value)} />
          </div>
          <div>
            <label htmlFor="m-email" className={labelCls}>E-mail professionnel *</label>
            <input id="m-email" type="email" className={inputCls} placeholder="contact@entreprise.ch"
              value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
        </div>

        <div>
          <p className={labelCls}>Catégories proposées *</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const on = form.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${on ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="m-refs" className={labelCls}>Nombre approximatif de références</label>
          <input id="m-refs" type="text" className={inputCls} placeholder="Ex : une quarantaine"
            value={form.references} onChange={(e) => update("references", e.target.value)} />
        </div>

        <div>
          <label htmlFor="m-message" className={labelCls}>Votre gamme en quelques mots</label>
          <textarea id="m-message" className={`${inputCls} min-h-[110px] resize-y`}
            placeholder="Ce que vous fabriquez ou distribuez, votre zone de livraison, ce qui vous distingue…"
            value={form.message} onChange={(e) => update("message", e.target.value)} />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.attestation}
            onChange={(e) => update("attestation", e.target.checked)}
            className="mt-1 accent-[var(--primary)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            Je confirme que mon entreprise reste le vendeur de ses produits : elle conclut la vente, encaisse le prix,
            livre, garantit et assure le service après-vente. E-Dome se limite à recommander mes produits.
          </span>
        </label>

        <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
          <p className="text-[11px] text-[var(--text-muted)] inline-flex items-center gap-1.5">
            <Building2 size={12} /> Réservé aux entreprises.
          </p>
          <div className="flex gap-3">
            <Link href="/boutique" className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
              Annuler
            </Link>
            <button
              type="button"
              onClick={() => setSent(true)}
              disabled={!isValid}
              className={`px-8 py-3 rounded-xl font-medium transition-colors ${isValid ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] text-[var(--text-muted)] cursor-not-allowed"}`}
            >
              Envoyer la demande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
