"use client";

import React, { Suspense, useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/context";
import type { Currency } from "@/lib/types";
import { getPropertyById } from "@/lib/mock-data";
import { DEMO_TODAY, iso } from "@/lib/demo/clock";
import { chf } from "@/lib/model/billing";
import { MoneyFlow } from "@/components/pricing/money-flow";

/* ─── La vraie commande, pas un ORDER codé en dur ────────────────────────────

   Cette page affichait un `ORDER` figé (« Appartement vue lac », 180 × 5),
   déconnecté de ce qu'on venait de réserver : on réservait le chalet à 850/nuit
   et on payait 995 CHF d'un autre bien. La commande vient désormais du CTA
   « Réserver » d'`explorer/[id]`, par query params (propertyId, checkIn,
   checkOut, nights, options, total), et un panneau `MoneyFlow` montre le flux
   réel : commission `location-ct` de 12 %, PRÉLEVÉE SUR L'HÔTE, jamais ajoutée
   au prix payé par le voyageur. Sans param, un exemple par défaut cohérent —
   pas de plantage. */

interface Order {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  currency: Currency;
  pricePerNight: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  optionsCount: number;
  optionsTotal: number;
  total: number;
}

function defaultOrder(): Order {
  /* Dérivé de DEMO_TODAY (constante) — jamais de `new Date()` en plein rendu. */
  const start = new Date(DEMO_TODAY);
  start.setUTCDate(start.getUTCDate() + 20);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 5);
  const p = getPropertyById("prop5");
  const pricePerNight = p?.price ?? 350;
  const nights = 5;
  return {
    propertyId: p?.id ?? "prop5",
    propertyTitle: p?.title ?? "Chalet de luxe · Verbier",
    propertyImage: p?.images?.[0] ?? "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=250&fit=crop",
    currency: p?.currency ?? "CHF",
    pricePerNight,
    nights,
    checkIn: iso(start),
    checkOut: iso(end),
    optionsCount: 0,
    optionsTotal: 0,
    total: pricePerNight * nights,
  };
}

function orderFromParams(params: URLSearchParams): Order {
  const propertyId = params.get("propertyId");
  if (!propertyId) return defaultOrder();
  const p = getPropertyById(propertyId);
  if (!p) return defaultOrder();

  const nights = Math.max(1, Math.round(Number(params.get("nights")) || 1));
  const optionsTotal = Math.max(0, Math.round(Number(params.get("optionsTotal")) || 0));
  const optionsCount = (params.get("options") ?? "").split(",").filter(Boolean).length;
  const subtotal = p.price * nights;
  const total = Math.max(0, Math.round(Number(params.get("total")) || subtotal + optionsTotal));
  const fallback = defaultOrder();

  return {
    propertyId: p.id,
    propertyTitle: p.title,
    propertyImage: p.images?.[0] ?? fallback.propertyImage,
    currency: p.currency,
    pricePerNight: p.price,
    nights,
    checkIn: params.get("checkIn") || fallback.checkIn,
    checkOut: params.get("checkOut") || fallback.checkOut,
    optionsCount,
    optionsTotal,
    total,
  };
}

const COUPON_CODES: Record<string, number> = { EDOME10: 10, BIENVENUE: 15, VIP20: 20 };

/* ─── Page (avec bornes Suspense pour useSearchParams) ───────────────────── */

export default function PaiementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
          <p className="text-[var(--text-muted)]">Chargement...</p>
        </div>
      }
    >
      <PaiementInner />
    </Suspense>
  );
}

function PaiementInner() {
  const { formatPrice } = useApp();
  const searchParams = useSearchParams();

  const order = useMemo(() => orderFromParams(searchParams), [searchParams]);

  // Payment method
  const [method, setMethod] = useState<"carte" | "twint" | "virement">("carte");

  /* Formulaire carte — VERROUILLE EN MODE DEMONSTRATION.
     Cette page n'a aucun prestataire de paiement : rien n'est transmis, rien
     n'est chiffre, et le "3-D Secure" plus bas est un setTimeout. Laisser la
     saisie ouverte revenait a inviter un visiteur a taper un vrai numero de
     carte sur une page publique. Les champs sont donc pre-remplis avec la
     carte de test 4242… (jamais debitable) et passes en lecture seule : le
     parcours reste demontrable, aucune donnee bancaire reelle ne peut entrer.
     A remplacer par Stripe Payment Element — le PAN ne doit jamais transiter
     par notre code (hors perimetre PCI-DSS). */
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");
  const [cardName, setCardName] = useState("DEMONSTRATION E-DOME");

  // 3D Secure
  const [show3DS, setShow3DS] = useState(false);
  const [code3DS, setCode3DS] = useState(["", "", "", "", "", ""]);
  const [verifying3DS, setVerifying3DS] = useState(false);

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // State
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── Card formatting ────────────────────────────────────────────────── */

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const cardType = useMemo(() => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.startsWith("4")) return "visa";
    if (digits.startsWith("5") || digits.startsWith("2")) return "mastercard";
    return null;
  }, [cardNumber]);

  /* ── Price calculations ─────────────────────────────────────────────── */

  const subtotal = order.pricePerNight * order.nights;
  const totalBeforeDiscount = order.total;
  const discountAmount = appliedCoupon ? Math.round(totalBeforeDiscount * appliedCoupon.discount / 100) : 0;
  const total = totalBeforeDiscount - discountAmount;

  /* Référence de virement STABLE (pas de Math.random() en plein rendu, qui
     casserait l'hydratation) : dérivée de la commande. */
  const virementRef = useMemo(
    () => `ED-${order.propertyId}-${order.checkIn.replace(/-/g, "")}`.toUpperCase(),
    [order.propertyId, order.checkIn],
  );

  /* ── Coupon ─────────────────────────────────────────────────────────── */

  const applyCoupon = () => {
    const discount = COUPON_CODES[couponInput.toUpperCase()];
    if (discount) {
      setAppliedCoupon({ code: couponInput.toUpperCase(), discount });
      setCouponError("");
    } else {
      setCouponError("Code invalide");
      setAppliedCoupon(null);
    }
  };

  /* ── 3DS code input ─────────────────────────────────────────────────── */

  const handle3DSInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code3DS];
    next[index] = value;
    setCode3DS(next);
    if (value && index < 5) {
      const el = document.getElementById(`code3ds-${index + 1}`);
      el?.focus();
    }
  };

  const verify3DS = () => {
    setVerifying3DS(true);
    setTimeout(() => {
      setVerifying3DS(false);
      setShow3DS(false);
      setSuccess(true);
    }, 2000);
  };

  /* ── Payment handler ────────────────────────────────────────────────── */

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (method === "carte") {
        setShow3DS(true);
      } else {
        setSuccess(true);
      }
    }, 1500);
  };

  /* ── Success ────────────────────────────────────────────────────────── */

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl page-heading mb-2">Paiement reussi !</h1>
          <p className="text-[var(--text-secondary)] mb-2">Montant : <strong className="text-[var(--primary)]">{formatPrice(total, order.currency)}</strong></p>
          <p className="text-sm text-[var(--text-muted)] mb-6">Un email de confirmation a été envoyé.</p>
          <a href="/dashboard/reservations" className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors inline-block">
            Voir mes reservations
          </a>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 transition-colors";
  const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl page-heading mb-8">Paiement</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Payment form ──────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Method tabs */}
            <div className="flex gap-2">
              {([["carte", "Carte bancaire"], ["twint", "Twint"], ["virement", "Virement"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setMethod(key)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors border ${method === key ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]" : "bg-[var(--card)] border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── Card form ─────────────────────────────────────────── */}
            {method === "carte" && (
              <div className="p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-4 animate-fade-in">
                <div
                  role="note"
                  className="flex gap-3 p-3 rounded-xl border border-[var(--warning)] bg-[var(--warning-soft)] text-[var(--warning-text)]"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs leading-relaxed">
                    <strong>Demonstration — ne saisissez aucune vraie carte.</strong> Aucun
                    prestataire de paiement n&apos;est connecte : rien n&apos;est transmis ni
                    debite. Les champs sont pre-remplis avec une carte de test et verrouilles.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Numero de carte</label>
                  <div className="relative">
                    <input
                      className={`${inputCls} opacity-70 cursor-not-allowed`}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      readOnly
                      aria-readonly="true"
                    />
                    {cardType && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)] uppercase">
                        {cardType === "visa" ? "VISA" : "MC"}
                      </span>
                    )}
                  </div>
                </div>
                <div><label className={labelCls}>Nom du titulaire</label><input className={`${inputCls} opacity-70 cursor-not-allowed`} placeholder="Jean Dupont" value={cardName} onChange={(e) => setCardName(e.target.value)} readOnly aria-readonly="true" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Expiration</label>
                    <input className={`${inputCls} opacity-70 cursor-not-allowed`} placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} maxLength={5} readOnly aria-readonly="true" />
                  </div>
                  <div>
                    <label className={labelCls}>CVC</label>
                    <input className={`${inputCls} opacity-70 cursor-not-allowed`} placeholder="123" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} readOnly aria-readonly="true" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Twint ─────────────────────────────────────────────── */}
            {method === "twint" && (
              <div className="p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl text-center animate-fade-in">
                <div className="w-16 h-16 bg-[#000] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h3 className="font-semibold mb-2">Payer avec Twint</h3>
                <p className="text-sm text-[var(--text-secondary)]">Vous serez redirige vers l&apos;application Twint pour confirmer le paiement de <strong className="text-[var(--primary)]">{formatPrice(total, order.currency)}</strong>.</p>
              </div>
            )}

            {/* ── Virement ──────────────────────────────────────────── */}
            {method === "virement" && (
              <div className="p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-3 animate-fade-in">
                <h3 className="font-semibold">Coordonnees bancaires</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">IBAN</span><span className="text-[var(--foreground)] font-mono">CH93 0076 2011 6238 5295 7</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">BIC/SWIFT</span><span className="text-[var(--foreground)] font-mono">UBSWCHZH80A</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Beneficiaire</span><span className="text-[var(--foreground)]">E-Dome SA</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Montant</span><span className="text-[var(--primary)] font-bold">{formatPrice(total, order.currency)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Reference</span><span className="text-[var(--foreground)] font-mono">{virementRef}</span></div>
                </div>
                <p className="text-xs text-[var(--text-muted)] pt-2">La reservation sera confirmee apres reception du virement (1-3 jours ouvrables).</p>
              </div>
            )}

            {/* ── Coupon ─────────────────────────────────────────────── */}
            <div className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Code promo</h3>
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} placeholder="Entrez votre code" value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }} />
                <button onClick={applyCoupon} className="px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--primary)]/40 transition-colors">
                  Appliquer
                </button>
              </div>
              {couponError && <p className="text-xs text-red-400 mt-1">{couponError}</p>}
              {appliedCoupon && <p className="text-xs text-green-400 mt-1">Code {appliedCoupon.code} applique : -{appliedCoupon.discount}%</p>}
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={processing}
              className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${processing ? "bg-[var(--primary)]/60 text-white" : "bg-[var(--primary)] hover:bg-[var(--primary)] text-white"}`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Traitement en cours...
                </span>
              ) : (
                `Payer ${formatPrice(total, order.currency)}`
              )}
            </button>
          </div>

          {/* ── Right: Order summary ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-4 p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-4">
              <h2 className="font-semibold">Resume de la commande</h2>
              <img src={order.propertyImage} alt={order.propertyTitle} className="w-full h-36 object-cover rounded-xl" />
              <h3 className="font-medium">{order.propertyTitle}</h3>
              <div className="text-sm text-[var(--text-secondary)] space-y-1">
                <div className="flex justify-between"><span>Du {new Date(order.checkIn).toLocaleDateString("fr-CH")}</span><span>au {new Date(order.checkOut).toLocaleDateString("fr-CH")}</span></div>
              </div>
              <div className="border-t border-[var(--card-border)] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{formatPrice(order.pricePerNight, order.currency)} x {order.nights} nuit{order.nights > 1 ? "s" : ""}</span>
                  <span>{formatPrice(subtotal, order.currency)}</span>
                </div>
                {order.optionsTotal > 0 && (
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Options{order.optionsCount > 0 ? ` (${order.optionsCount})` : ""}</span>
                    <span>{formatPrice(order.optionsTotal, order.currency)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400">
                    <span>Reduction ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount, order.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[var(--foreground)] pt-2 border-t border-[var(--card-border)]">
                  <span>Total</span>
                  <span className="text-[var(--primary)]">{formatPrice(total, order.currency)}</span>
                </div>
              </div>
            </div>

            {/* Flux d'argent : la commission location-ct (12 %) est PRÉLEVÉE SUR
                L'HÔTE, jamais ajoutée au prix payé par le voyageur — la phrase
                générée par `quote()` le dit. En CHF, la devise du modèle. */}
            {order.currency === "CHF" && total > 0 && (
              <MoneyFlow
                charge={{ kind: "commission", pole: "location-ct", gross: chf(total) }}
                grossLabel="Ce que vous payez (voyageur)"
                beneficiaryLabel="L'hôte reçoit"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── 3D Secure Modal ──────────────────────────────────────────────── */}
      {show3DS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 max-w-sm w-full animate-scale-in text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h2 className="text-lg font-bold mb-1">Verification 3D Secure</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Un code à 6 chiffres a été envoyé à votre téléphone. Entrez-le ci-dessous.</p>
            <div className="flex justify-center gap-2 mb-6">
              {code3DS.map((digit, i) => (
                <input
                  key={i}
                  id={`code3ds-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handle3DSInput(i, e.target.value)}
                  className="w-11 h-14 text-center text-xl font-bold bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShow3DS(false); setCode3DS(["", "", "", "", "", ""]); }} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Annuler
              </button>
              <button
                onClick={verify3DS}
                disabled={code3DS.some((d) => !d) || verifying3DS}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${code3DS.every((d) => d) && !verifying3DS ? "bg-[var(--primary)] hover:bg-[var(--primary)] text-white" : "bg-[var(--card)] text-[var(--text-muted)] cursor-not-allowed"}`}
              >
                {verifying3DS ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Verification...
                  </span>
                ) : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
