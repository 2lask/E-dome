"use client";

import React, { useState, use, useMemo, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data/products";
import {
  ChevronRight,
  ChevronLeft,
  Share2,
  Truck,
  Undo2,
  ShieldCheck,
  Building2,
  MapPin,
  ZoomIn,
  X,
  ExternalLink,
  Info,
  MessageSquareText,
  Check,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { BlurImage } from "@/components/ui/blur-image";
import { BackButton } from "@/components/ui/back-button";
import { RecommendButton } from "@/components/affiliate/recommend-button";
import { ReferralBanner } from "@/components/affiliate/referral-banner";
import {
  AFFILIATION_NOTICE,
  AffiliationChip,
  ConditionChip,
  LeavingInterstitial,
} from "@/components/boutique/affiliation";

/* /boutique/[id] — fiche produit EN AFFILIATION (Mission 2, P4b).

   Ce qu'elle était : une fiche de marketplace façon eBay — « Acheter
   maintenant », panier E-Dome, « Paiement sécurisé E-Dome, protection
   acheteur incluse », cinq avis génériques partagés par les seize produits
   avec un badge « Achat vérifié » sans transaction, et « commission
   marketplace 4–8 % ». Exactement le vendeur apparent que l'art. 20a LTVA
   rend fournisseur de la livraison (`DECISIONS.md` §1.8).

   Ce qu'elle est : une recommandation. Le marchand — une entreprise — est
   identifié ; « Voir chez le marchand » ouvre un interstitiel honnête ; la
   mention d'affiliation est visible ; il n'y a ni note ni avis produit,
   puisque l'achat a lieu chez le marchand (`DECISIONS-2.md` §D5). */

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { formatPrice } = useApp();
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [shared, setShared] = useState(false);

  const similar = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [product]);

  const merchantOtherProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id && p.vendorId === product.vendorId).slice(0, 3);
  }, [product]);

  const closeLeaving = useCallback(() => setLeaving(false), []);

  // Esc ferme le lightbox, flèches = navigation
  React.useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft" && product) {
        setSelectedImg((i) => (i - 1 + product.gallery.length) % product.gallery.length);
      }
      if (e.key === "ArrowRight" && product) {
        setSelectedImg((i) => (i + 1) % product.gallery.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, product]);

  if (!product) return notFound();

  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const prevImg = () => setSelectedImg((i) => (i - 1 + product.gallery.length) % product.gallery.length);
  const nextImg = () => setSelectedImg((i) => (i + 1) % product.gallery.length);

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">

        <div className="md:hidden -mt-2">
          <BackButton fallbackHref="/boutique" />
        </div>

        <nav aria-label="Fil d'Ariane" className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/boutique" className="hover:underline" style={{ color: "var(--text-secondary)" }}>
            Boutique
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text-secondary)" }}>{product.category}</span>
          <ChevronRight size={12} />
          <span style={{ color: "var(--foreground)" }} className="font-medium truncate max-w-[260px]">
            {product.title}
          </span>
        </nav>

        <ReferralBanner kind="produit" id={product.id} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Galerie */}
          <section className="lg:col-span-7 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-[var(--hover-bg)]" style={{ aspectRatio: "4/3" }}>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute inset-0 w-full cursor-zoom-in group"
                aria-label="Agrandir l'image"
              >
                <BlurImage src={product.gallery[selectedImg]} alt={product.title} eager />
                <span
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                >
                  <ZoomIn size={12} /> Agrandir
                </span>
              </button>
              {product.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.gallery.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImg(i)}
                    className="relative rounded-lg overflow-hidden bg-[var(--hover-bg)] transition-all"
                    style={{
                      aspectRatio: "1/1",
                      border: selectedImg === i ? "2px solid var(--primary)" : "2px solid transparent",
                      opacity: selectedImg === i ? 1 : 0.75,
                    }}
                    aria-label={`Image ${i + 1}`}
                    aria-current={selectedImg === i}
                  >
                    <BlurImage src={g} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Infos + CTA */}
          <section className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
                  style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}>
                  {product.category}
                </span>
                <ConditionChip condition={product.condition} className="text-[11px]" />
                <AffiliationChip className="text-[11px]" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold leading-tight mt-3" style={{ color: "var(--foreground)" }}>
                {product.title}
              </h1>
              <p className="mt-1.5 text-sm inline-flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <Building2 size={14} style={{ color: "var(--text-muted)" }} />
                Vendu par <strong style={{ color: "var(--foreground)" }}>{product.vendor}</strong>
              </p>
            </div>

            {/* Prix indicatif du marchand */}
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                Prix indicatif chez {product.vendor}
              </p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
                  {formatPrice(product.price)}
                </span>
                {product.unit && (
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{product.unit}</span>
                )}
                {product.oldPrice && (
                  <span className="text-sm line-through tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Le prix final, les frais de port et la disponibilité sont ceux affichés par le marchand au moment de l&apos;achat.
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setLeaving(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                Voir chez le marchand
                <ExternalLink size={15} />
              </button>
              <p className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: "var(--text-muted)" }}>
                <Info size={12} className="shrink-0 mt-0.5" />
                <span>{AFFILIATION_NOTICE}</span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-[var(--hover-bg)]"
                  style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)", background: "var(--card)" }}
                >
                  {shared ? <Check size={14} /> : <Share2 size={14} />}
                  {shared ? "Lien copié" : "Partager"}
                </button>
              </div>
              <RecommendButton
                kind="produit"
                id={product.id}
                title={product.title}
                image={product.gallery?.[0]}
                price={product.price}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-[var(--primary)]/40 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
              />
            </div>

            {/* Conditions du marchand */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                Conditions annoncées par {product.vendor}
              </h3>
              <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-2">
                  <Truck size={14} style={{ color: "var(--text-muted)", marginTop: 1 }} />
                  <span>
                    {product.shipping === 0 ? "Livraison offerte" : `Livraison ${formatPrice(product.shipping)}`} · {product.shippingDays}, par le marchand.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Undo2 size={14} style={{ color: "var(--text-muted)", marginTop: 1 }} />
                  <span>
                    {product.returnDays > 0
                      ? `Retour sous ${product.returnDays} jours, selon la politique du marchand.`
                      : "Produit sur mesure : non repris, selon la politique du marchand."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={14} style={{ color: "var(--text-muted)", marginTop: 1 }} />
                  <span>Contrat de vente, paiement, garantie et service après-vente : ceux du marchand. E-Dome n&apos;est pas partie à l&apos;achat.</span>
                </li>
              </ul>
            </div>

            {/* Le marchand : une entreprise, pas un visage */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-start gap-3">
                <span className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[var(--hover-bg)]">
                  <BlurImage src={product.vendorAvatar} alt="" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                    {product.vendor}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    <Building2 size={11} />
                    <span>Marchand partenaire</span>
                    <span>·</span>
                    <MapPin size={11} />
                    <span>{product.vendorCity}</span>
                  </p>
                  <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Vend, expédie (annonce : {product.vendorShipsIn}) et garantit ce produit. E-Dome le référence en affiliation.
                  </p>
                </div>
              </div>
              {merchantOtherProducts.length > 0 && (
                <div>
                  <p className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>
                    Autres produits de {product.vendor} référencés :
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {merchantOtherProducts.map((p) => (
                      <Link key={p.id} href={`/boutique/${p.id}`} className="block group">
                        <div className="relative rounded-lg overflow-hidden bg-[var(--hover-bg)]" style={{ aspectRatio: "1/1" }}>
                          <BlurImage src={p.gallery[0]} alt={p.title} />
                        </div>
                        <p className="text-[11px] mt-1 truncate font-medium" style={{ color: "var(--foreground)" }}>
                          {p.title}
                        </p>
                        <p className="text-[11px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                          {formatPrice(p.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Caractéristiques + Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h2 className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
              Caractéristiques
            </h2>
            <dl className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5 text-sm">
                  <dt style={{ color: "var(--text-secondary)" }}>{s.label}</dt>
                  <dd className="font-medium tabular-nums text-right max-w-[60%]" style={{ color: "var(--foreground)" }}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h2 className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
              Description du marchand
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {product.description}
            </p>
          </section>
        </div>

        {/* Avis : aucune note inventée */}
        <section id="avis" className="rounded-xl px-5 py-4 flex items-start gap-3"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <MessageSquareText size={18} className="shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Avis</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Les avis sont sur le site du marchand. L&apos;achat se fait chez {product.vendor} : E-Dome n&apos;a aucune
              transaction à laquelle rattacher un avis, et n&apos;en affiche donc pas.
            </p>
          </div>
        </section>

        {/* Ce qu'est la boutique */}
        <div className="rounded-xl px-4 py-3 text-xs flex items-start gap-2"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}>
          <Building2 size={14} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <span>
            <strong style={{ color: "var(--foreground)" }}>E-Dome ne vend pas ce produit.</strong>{" "}
            La boutique référence des produits de marchands partenaires et vous redirige vers eux. E-Dome ne tient ni
            panier, ni paiement, ni stock, et ne garantit pas l&apos;achat. Sa rémunération d&apos;affiliation est payée
            par le marchand et convenue avec lui — jamais ajoutée au prix que vous payez.
          </span>
        </div>

        {/* Produits similaires */}
        {similar.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Produits similaires
              </h2>
              <Link href="/boutique" className="text-xs hover:underline" style={{ color: "var(--primary)" }}>
                Toute la boutique →
              </Link>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {similar.map((p) => (
                <li key={p.id} className="rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
                  style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <Link href={`/boutique/${p.id}`} className="block">
                    <div className="relative bg-[var(--hover-bg)]" style={{ aspectRatio: "4/3" }}>
                      <BlurImage src={p.gallery[0]} alt={p.title} />
                      <ConditionChip condition={p.condition} className="absolute bottom-2 left-2" />
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-[13px] font-medium leading-tight line-clamp-2" style={{ color: "var(--foreground)" }}>
                        {p.title}
                      </p>
                      <p className="text-sm font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
                        {formatPrice(p.price)}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                        chez {p.vendor} · en affiliation
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {leaving && (
        <LeavingInterstitial merchant={product.vendor} productTitle={product.title} onClose={closeLeaving} />
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            <X size={20} />
          </button>
          {product.gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                aria-label="Image précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                aria-label="Image suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.gallery[selectedImg]}
            alt={product.title}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg animate-scale-in"
          />
          <p
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tabular-nums px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            {selectedImg + 1} / {product.gallery.length}
          </p>
        </div>
      )}
    </div>
  );
}
