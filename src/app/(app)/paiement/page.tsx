"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const ORDER = {
  propertyTitle: "Appartement vue lac - Montreux",
  propertyImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
  nights: 5,
  pricePerNight: 180,
  cleaningFee: 50,
  serviceFee: 45,
  checkIn: "2026-05-10",
  checkOut: "2026-05-15",
};

const HISTORY = [
  { id: "p1", description: "Reservation - Villa Lausanne", amount: 1250, date: "2026-03-15", status: "completed" as const },
  { id: "p2", description: "Formation - Investissement immobilier", amount: 299, date: "2026-02-20", status: "completed" as const },
  { id: "p3", description: "Service - Photographie immobiliere", amount: 350, date: "2026-01-10", status: "completed" as const },
  { id: "p4", description: "Reservation - Studio Geneve", amount: 480, date: "2025-12-05", status: "completed" as const },
];

const COUPON_CODES: Record<string, number> = { EDOME10: 10, BIENVENUE: 15, VIP20: 20 };

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function PaiementPage() {
  const { formatPrice } = useApp();

  // Payment method
  const [method, setMethod] = useState<"carte" | "twint" | "virement">("carte");

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

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

  const subtotal = ORDER.pricePerNight * ORDER.nights;
  const totalBeforeDiscount = subtotal + ORDER.cleaningFee + ORDER.serviceFee;
  const discountAmount = appliedCoupon ? Math.round(totalBeforeDiscount * appliedCoupon.discount / 100) : 0;
  const total = totalBeforeDiscount - discountAmount;

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
          <p className="text-[var(--text-secondary)] mb-2">Montant : <strong className="text-[var(--primary)]">{formatPrice(total)}</strong></p>
          <p className="text-sm text-[var(--text-muted)] mb-6">Un email de confirmation a été envoyé.</p>
          <a href="/reservations" className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors inline-block">
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
                <div>
                  <label className={labelCls}>Numero de carte</label>
                  <div className="relative">
                    <input
                      className={inputCls}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                    {cardType && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)] uppercase">
                        {cardType === "visa" ? "VISA" : "MC"}
                      </span>
                    )}
                  </div>
                </div>
                <div><label className={labelCls}>Nom du titulaire</label><input className={inputCls} placeholder="Jean Dupont" value={cardName} onChange={(e) => setCardName(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Expiration</label>
                    <input className={inputCls} placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} maxLength={5} />
                  </div>
                  <div>
                    <label className={labelCls}>CVC</label>
                    <input className={inputCls} placeholder="123" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} type="password" />
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
                <p className="text-sm text-[var(--text-secondary)]">Vous serez redirige vers l&apos;application Twint pour confirmer le paiement de <strong className="text-[var(--primary)]">{formatPrice(total)}</strong>.</p>
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
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Montant</span><span className="text-[var(--primary)] font-bold">{formatPrice(total)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Reference</span><span className="text-[var(--foreground)] font-mono">ED-2026-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span></div>
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
                `Payer ${formatPrice(total)}`
              )}
            </button>
          </div>

          {/* ── Right: Order summary ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-4 p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-4">
              <h2 className="font-semibold">Resume de la commande</h2>
              <img src={ORDER.propertyImage} alt={ORDER.propertyTitle} className="w-full h-36 object-cover rounded-xl" />
              <h3 className="font-medium">{ORDER.propertyTitle}</h3>
              <div className="text-sm text-[var(--text-secondary)] space-y-1">
                <div className="flex justify-between"><span>Du {new Date(ORDER.checkIn).toLocaleDateString("fr-CH")}</span><span>au {new Date(ORDER.checkOut).toLocaleDateString("fr-CH")}</span></div>
              </div>
              <div className="border-t border-[var(--card-border)] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{formatPrice(ORDER.pricePerNight)} x {ORDER.nights} nuits</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Frais de menage</span>
                  <span>{formatPrice(ORDER.cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Frais de service</span>
                  <span>{formatPrice(ORDER.serviceFee)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400">
                    <span>Reduction ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[var(--foreground)] pt-2 border-t border-[var(--card-border)]">
                  <span>Total</span>
                  <span className="text-[var(--primary)]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment history */}
            <div className="p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
              <h2 className="font-semibold mb-4">Historique des paiements</h2>
              <div className="space-y-3">
                {HISTORY.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-[var(--foreground)]">{h.description}</p>
                      <p className="text-xs text-[var(--text-muted)]">{new Date(h.date).toLocaleDateString("fr-CH")}</p>
                    </div>
                    <span className="font-medium text-[var(--foreground)]">{formatPrice(h.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
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
