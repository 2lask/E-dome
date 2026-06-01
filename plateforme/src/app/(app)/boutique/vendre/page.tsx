"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useApp } from "@/lib/context";

/* Formulaire « Vendre un produit » — pôle E-commerce V1.0.
   Reprend le pattern simple de /services/proposer.
   Cadrage : les vendeurs restent responsables de leurs produits, du SAV et
   des expéditions. E-Dome fournit la vitrine, le paiement sécurisé et la
   visibilité. Commission marketplace 4–8 % au lancement. */

interface ProductForm {
  titre: string;
  categorie: string;
  description: string;
  prix: number;
  stock: number;
  delaiExpedition: string;
  poids: number;
  photos: string[];
  autoriserApporteurs: boolean;
  termsAccepted: boolean;
}

const CATEGORIES = ["Meubles", "Décoration", "Matériaux", "Cuisines", "Équipements", "Électroménager"];

const emptyForm: ProductForm = {
  titre: "", categorie: "", description: "", prix: 0, stock: 1,
  delaiExpedition: "5–7 jours ouvrés", poids: 0, photos: [],
  autoriserApporteurs: true, termsAccepted: false,
};

const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

export default function VendreProduitPage() {
  const { formatPrice } = useApp();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [published, setPublished] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addPhoto = () => {
    if (photoUrl.trim()) {
      update("photos", [...form.photos, photoUrl.trim()]);
      setPhotoUrl("");
    }
  };

  const removePhoto = (idx: number) => {
    update("photos", form.photos.filter((_, i) => i !== idx));
  };

  const isValid = form.titre.trim() && form.categorie && form.description.trim() && form.prix > 0 && form.stock > 0 && form.termsAccepted;

  if (published) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
          <Check size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold">Produit mis en ligne</h1>
        <p className="text-[var(--text-secondary)]">
          Votre produit est en cours de validation par l&apos;équipe E-Dome. Vous serez notifié(e) dès qu&apos;il sera visible dans la boutique. Les premières commandes apparaîtront dans votre dashboard.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/boutique" className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
            Retour à la boutique
          </Link>
          <Link href="/dashboard" className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">
            Voir mon dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl page-heading">Vendre un produit</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Listez votre produit sur le pôle Boutique d&apos;E-Dome. Vous restez responsable du produit, de l&apos;expédition et du SAV.
        </p>
      </div>

      {/* Cadrage V1.0 */}
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
        <p>
          <strong className="text-[var(--foreground)]">Ce qu&apos;E-Dome fournit :</strong> la vitrine, le paiement sécurisé via un PSP agréé, la visibilité dans la boutique et les outils de gestion.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Ce qui reste à votre charge :</strong> la qualité du produit, l&apos;expédition, le SAV, le droit de rétractation consommateurs, la TVA si applicable.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Modèle économique :</strong> commission marketplace 4–8 % par vente, prélevée sur ce qu&apos;E-Dome encaisse via le PSP. Aucun abonnement mensuel imposé.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Titre du produit *</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ex : Canapé d'angle modulable lin naturel"
            value={form.titre}
            onChange={(e) => update("titre", e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls}>Catégorie *</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => update("categorie", cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.categorie === cat ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Description *</label>
          <textarea
            className={`${inputCls} min-h-[120px] resize-y`}
            placeholder="Matériaux, dimensions, finitions, garantie, particularités…"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Prix *</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              placeholder="0"
              value={form.prix || ""}
              onChange={(e) => update("prix", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Stock disponible *</label>
            <input
              type="number"
              min={1}
              className={inputCls}
              placeholder="1"
              value={form.stock || ""}
              onChange={(e) => update("stock", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Poids (kg)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              className={inputCls}
              placeholder="0"
              value={form.poids || ""}
              onChange={(e) => update("poids", Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Délai d&apos;expédition</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ex : 5–7 jours ouvrés"
            value={form.delaiExpedition}
            onChange={(e) => update("delaiExpedition", e.target.value)}
          />
        </div>

        {/* Photos */}
        <div>
          <label className={labelCls}>Photos du produit</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            <input
              type="url"
              className={`${inputCls} flex-1 min-w-[200px]`}
              placeholder="URL https://… ou téléverser →"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())}
            />
            <button
              type="button"
              onClick={addPhoto}
              className="px-4 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl text-sm font-medium transition-colors"
            >
              Ajouter
            </button>
            <label
              className="cursor-pointer px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--card-border)", background: "var(--card)", color: "var(--foreground)" }}
            >
              Téléverser
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length === 0) return;
                  const urls = files.map((f) => URL.createObjectURL(f));
                  update("photos", [...form.photos, ...urls]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.photos.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-[var(--card-border)]" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apporteurs toggle */}
        <button
          type="button"
          onClick={() => update("autoriserApporteurs", !form.autoriserApporteurs)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${form.autoriserApporteurs ? "bg-[#1e9df1]/10 border-[#1e9df1]" : "bg-[var(--card)] border-[var(--card-border)] hover:border-[#1e9df1]/40"}`}
        >
          <div className="text-left">
            <h3 className="font-medium">Autoriser les apporteurs d&apos;affaires</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Les apporteurs pourront partager votre fiche produit. Leur part (10–30 %) est prélevée sur la commission marketplace d&apos;E-Dome — jamais ajoutée au prix.
            </p>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${form.autoriserApporteurs ? "bg-[#1e9df1]" : "bg-[var(--card-border)]"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.autoriserApporteurs ? "translate-x-6" : "translate-x-0.5"}`} />
          </div>
        </button>

        {/* Récap commission */}
        {form.prix > 0 && (
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Prix de vente affiché</span>
              <span className="font-medium">{formatPrice(form.prix)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Commission E-Dome (8 % indicatif)</span>
              <span className="text-[#1e9df1]">−{formatPrice(form.prix * 0.08)}</span>
            </div>
            <div className="h-px bg-[var(--card-border)]" />
            <div className="flex justify-between">
              <span className="font-medium">Vous recevez par vente</span>
              <span className="font-bold text-green-400">{formatPrice(form.prix * 0.92)}</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] italic pt-1">
              Commission prélevée sur ce qu&apos;encaisse E-Dome via le PSP, jamais ajoutée au prix payé par l&apos;acheteur. Taux exact défini selon votre catégorie (fourchette 4–8 %).
            </p>
          </div>
        )}

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => update("termsAccepted", !form.termsAccepted)}
            className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${form.termsAccepted ? "bg-[#1e9df1] border-[#1e9df1]" : "border-[var(--text-muted)]"}`}
          >
            {form.termsAccepted && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </button>
          <span className="text-sm text-[var(--text-secondary)]">
            J&apos;atteste être responsable de ce produit (conformité, SAV, expédition, droit de rétractation) et j&apos;accepte les conditions générales d&apos;utilisation et la politique vendeurs d&apos;E-Dome.
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/boutique" className="px-6 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
            Annuler
          </Link>
          <button
            type="button"
            onClick={() => setPublished(true)}
            disabled={!isValid}
            className={`px-8 py-3 rounded-xl font-medium transition-colors ${isValid ? "bg-[#1e9df1] hover:bg-[#1583c9] text-white" : "bg-[var(--card)] text-[var(--text-muted)] cursor-not-allowed"}`}
          >
            Publier le produit
          </button>
        </div>
      </div>
    </div>
  );
}
