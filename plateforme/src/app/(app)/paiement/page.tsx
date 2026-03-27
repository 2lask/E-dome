"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Check,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Fingerprint,
  X,
  Loader2,
  Copy,
  Smartphone,
  Building,
  Tag,
  ChevronDown,
  Download,
  Clock,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { mockPaymentReservation } from "@/lib/mock-data";
import Link from "next/link";

// ─── Page ───────────────────────────────────────────────

type PaymentMethod = "card" | "twint" | "virement";

const timelineSteps = [
  { label: "Réservation", key: "reservation" },
  { label: "Paiement", key: "paiement" },
  { label: "Confirmation", key: "confirmation" },
  { label: "Séjour", key: "sejour" },
];

export default function PaiementPage() {
  const { formatPrice } = useApp();
  const router = useRouter();
  const reservation = mockPaymentReservation;
  const property = reservation.property;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [show3DS, setShow3DS] = useState(false);
  const [threeDSCode, setThreeDSCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [verifying3DS, setVerifying3DS] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  // Copy state for bank details
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Payment history
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyToast, setHistoryToast] = useState<string | null>(null);

  const paymentHistory = [
    { id: "ph1", date: "2026-02-15", description: "R\u00e9servation Chalet Montreux", montant: 2850, methode: "Carte" as const, statut: "Confirm\u00e9" as const },
    { id: "ph2", date: "2026-01-28", description: "Abonnement Premium - F\u00e9vrier", montant: 49, methode: "Twint" as const, statut: "Confirm\u00e9" as const },
    { id: "ph3", date: "2026-01-10", description: "Formation Investissement Locatif", montant: 299, methode: "Carte" as const, statut: "En attente" as const },
    { id: "ph4", date: "2025-12-20", description: "R\u00e9servation Studio Gen\u00e8ve", montant: 1450, methode: "Virement" as const, statut: "Rembours\u00e9" as const },
    { id: "ph5", date: "2025-12-01", description: "Abonnement Premium - D\u00e9cembre", montant: 49, methode: "Twint" as const, statut: "Confirm\u00e9" as const },
  ];

  const statutColors: Record<string, { bg: string; text: string }> = {
    "Confirm\u00e9": { bg: "bg-green-500/15", text: "text-green-400" },
    "En attente": { bg: "bg-yellow-500/15", text: "text-yellow-400" },
    "Rembours\u00e9": { bg: "bg-blue-500/15", text: "text-blue-400" },
  };

  const handleDownloadReceipt = (id: string) => {
    setHistoryToast("Re\u00e7u t\u00e9l\u00e9charg\u00e9 !");
    setTimeout(() => setHistoryToast(null), 3000);
  };

  const nightCount = Math.ceil(
    (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / 86_400_000
  );
  const nightlyTotal = (property.pricePerNight ?? property.price) * nightCount;
  const serviceFee = Math.round(nightlyTotal * 0.08);
  const optionsTotal = reservation.options.reduce((s, o) => s + o.price, 0);
  const subtotal = nightlyTotal + serviceFee + optionsTotal;
  const total = subtotal - couponDiscount;

  // Card type detection
  const getCardType = useCallback((num: string): "visa" | "mastercard" | null => {
    const digits = num.replace(/\D/g, "");
    if (!digits) return null;
    if (digits[0] === "4") return "visa";
    if (digits[0] === "5") return "mastercard";
    return null;
  }, []);

  const cardType = getCardType(cardNumber);

  const handleApplyCoupon = () => {
    if (!couponCode.trim() || couponApplied) return;
    setCouponLoading(true);
    setTimeout(() => {
      setCouponLoading(false);
      setCouponApplied(true);
      setCouponDiscount(Math.round(subtotal * 0.1)); // 10% discount
    }, 800);
  };

  const handleCopyField = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePay = () => {
    if (paymentSuccess || show3DS) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (paymentMethod === "card") {
        setShow3DS(true);
        setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
      } else {
        setPaymentSuccess(true);
      }
    }, 1500);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleCodeInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...threeDSCode];
    newCode[index] = digit;
    setThreeDSCode(newCode);

    // Auto-focus next
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !threeDSCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...threeDSCode];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setThreeDSCode(newCode);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    codeInputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify3DS = () => {
    setVerifying3DS(true);
    setTimeout(() => {
      setVerifying3DS(false);
      setShow3DS(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  // Current timeline step
  const currentStep = paymentSuccess ? 2 : 1;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ── 3D Secure Modal ── */}
      <AnimatePresence>
        {show3DS && (
          <motion.div
            key="3ds-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mx-4 w-full max-w-md rounded-2xl border border-[#C4956A]/20 bg-[var(--card)] p-6 text-center"
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C4956A]/10">
                  <Fingerprint className="h-8 w-8 text-[#C4956A]" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                Vérification 3D Secure
              </h3>
              <p className="mb-6 text-sm text-[var(--text-secondary)]">
                Votre banque vous a envoyé un code de confirmation à 6 chiffres.
                Entrez-le ci-dessous pour finaliser le paiement.
              </p>
              <div className="mx-auto flex max-w-xs gap-2" onPaste={handleCodePaste}>
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={i}
                    ref={(el) => { codeInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={threeDSCode[i]}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="h-12 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-center text-lg font-bold text-[var(--foreground)] outline-none focus:border-[#C4956A]/40 transition-colors"
                  />
                ))}
              </div>
              <button
                onClick={handleVerify3DS}
                disabled={verifying3DS || threeDSCode.some((d) => !d)}
                className={cn(
                  "mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-all",
                  verifying3DS
                    ? "bg-[#C4956A]/50 text-black/50 cursor-wait"
                    : threeDSCode.some((d) => !d)
                    ? "bg-[#C4956A]/30 text-black/30 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                )}
              >
                {verifying3DS ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Vérification...
                  </span>
                ) : (
                  "Vérifier"
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Payment Success ── */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mx-4 w-full max-w-md rounded-2xl border border-emerald-500/20 bg-[var(--card)] p-8 text-center"
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                >
                  <Check className="h-10 w-10 text-emerald-400" />
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-2 text-2xl font-bold text-[var(--foreground)]"
              >
                Paiement confirmé !
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-2 text-sm text-[var(--text-secondary)]"
              >
                Votre réservation pour <span className="font-medium text-[var(--foreground)]">{property.title}</span> a été confirmée.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="mb-6 text-2xl font-bold text-[#C4956A]"
              >
                {formatPrice(total)}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => router.push("/reservations")}
                className="w-full rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Voir ma réservation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">Paiement</h1>
        <p className="mt-1 text-[var(--text-secondary)]">Finalisez votre réservation en toute sécurité</p>
      </motion.div>

      {/* ── Order Timeline ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5"
      >
        <div className="flex items-center justify-between">
          {timelineSteps.map((step, i) => (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                    i <= currentStep
                      ? "bg-[#C4956A]/20 text-[#C4956A]"
                      : "bg-white/5 text-[var(--text-muted)]"
                  )}
                >
                  {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn(
                  "mt-1.5 text-[10px] font-medium",
                  i <= currentStep ? "text-[#C4956A]" : "text-[var(--text-muted)]"
                )}>
                  {step.label}
                </span>
              </div>
              {i < timelineSteps.length - 1 && (
                <div className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full",
                  i < currentStep ? "bg-[#C4956A]/40" : "bg-white/[0.06]"
                )} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ── Left: Payment Form ── */}
        <div className="order-2 space-y-6 lg:order-1 lg:col-span-3">
          {/* Payment method tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-2"
          >
            {([
              { key: "card" as const, label: "Carte bancaire", icon: CreditCard },
              { key: "twint" as const, label: "Twint", icon: Smartphone },
              { key: "virement" as const, label: "Virement", icon: Building },
            ]).map((method) => (
              <button
                key={method.key}
                onClick={() => setPaymentMethod(method.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  paymentMethod === method.key
                    ? "bg-[#C4956A]/15 text-[#C4956A]"
                    : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]"
                )}
              >
                <method.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{method.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Payment form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6"
          >
            {/* Card form */}
            {paymentMethod === "card" && (
              <>
                <div className="mb-5 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#C4956A]" />
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Informations de paiement</h2>
                </div>

                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40"
                      />
                      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-1.5">
                        {cardType === "visa" ? (
                          <span className="rounded bg-blue-600/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">VISA</span>
                        ) : cardType === "mastercard" ? (
                          <span className="rounded bg-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">MC</span>
                        ) : (
                          <>
                            <div className="h-5 w-8 rounded bg-blue-600/20" title="Visa" />
                            <div className="h-5 w-8 rounded bg-red-500/20" title="Mastercard" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expiry + CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                        Expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40"
                      />
                    </div>
                  </div>

                  {/* Name on card */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      placeholder="KARIM BENALI"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Twint */}
            {paymentMethod === "twint" && (
              <div className="flex flex-col items-center py-6">
                <div className="mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-[#C4956A]" />
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Paiement Twint</h2>
                </div>
                {/* QR Code placeholder */}
                <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.1] bg-[var(--background)]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }, (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-3 w-3 rounded-sm",
                            [0,1,2,4,5,6,10,12,14,18,19,20,22,23,24].includes(i)
                              ? "bg-white"
                              : "bg-white/10"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mb-1 text-sm font-medium text-[var(--foreground)]">Scannez avec Twint</p>
                <p className="text-xs text-[var(--text-secondary)]">Ouvrez l&apos;app Twint et scannez le QR code ci-dessus</p>
              </div>
            )}

            {/* Virement */}
            {paymentMethod === "virement" && (
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#C4956A]" />
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Virement bancaire</h2>
                </div>
                <p className="mb-4 text-sm text-[var(--text-secondary)]">
                  Effectuez un virement avec les coordonnées ci-dessous. Votre réservation sera confirmée à réception du paiement.
                </p>
                <div className="space-y-3">
                  {([
                    { label: "IBAN", value: "CH93 0076 2011 6238 5295 7", field: "iban" },
                    { label: "BIC / SWIFT", value: "UBSWCHZH80A", field: "bic" },
                    { label: "Bénéficiaire", value: "E-Dome SA", field: "beneficiary" },
                    { label: "Référence", value: `EDOME-${reservation.id.toUpperCase()}`, field: "ref" },
                    { label: "Montant", value: formatPrice(total), field: "amount" },
                  ]).map((item) => (
                    <div
                      key={item.field}
                      className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
                    >
                      <div>
                        <p className="text-[10px] font-medium uppercase text-[var(--text-secondary)]">{item.label}</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">{item.value}</p>
                      </div>
                      <button
                        onClick={() => handleCopyField(item.value, item.field)}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                          copiedField === item.field
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--foreground)]"
                        )}
                      >
                        {copiedField === item.field ? (
                          <><Check className="h-3 w-3" /> Copié</>
                        ) : (
                          <><Copy className="h-3 w-3" /> Copier</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Coupon code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-[#C4956A]" />
              <span className="text-sm font-medium text-[var(--foreground)]">Code promo</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Entrez votre code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={couponApplied}
                className={cn(
                  "flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40",
                  couponApplied && "opacity-60"
                )}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || couponApplied || couponLoading}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                  couponApplied
                    ? "bg-emerald-500/15 text-emerald-400 cursor-default"
                    : couponLoading
                    ? "bg-[#C4956A]/30 text-black/50 cursor-wait"
                    : "bg-[#C4956A]/15 text-[#C4956A] hover:bg-[#C4956A]/25"
                )}
              >
                {couponApplied ? (
                  <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Appliqué</span>
                ) : couponLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Appliquer"
                )}
              </button>
            </div>
            {couponApplied && (
              <p className="mt-2 text-xs text-emerald-400">
                Réduction de {formatPrice(couponDiscount)} appliquée !
              </p>
            )}
          </motion.div>

          {/* Pay button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handlePay}
              disabled={processing || paymentSuccess || show3DS}
              className={cn(
                "w-full rounded-xl py-4 text-base font-semibold transition-all",
                processing
                  ? "cursor-wait bg-[#C4956A]/50 text-black/50"
                  : paymentSuccess
                  ? "cursor-default bg-emerald-500/20 text-emerald-400"
                  : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
              )}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                  Traitement en cours...
                </span>
              ) : paymentSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-5 w-5" />
                  Paiement effectué
                </span>
              ) : paymentMethod === "virement" ? (
                "Confirmer le virement"
              ) : (
                <>Payer {formatPrice(total)}</>
              )}
            </button>

            {/* Cancel link */}
            <div className="mt-3 text-center">
              <Link
                href="/reservations"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-red-400"
              >
                Annuler
              </Link>
            </div>
          </motion.div>

          {/* Security badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Lock, label: "SSL 256-bit" },
              { icon: ShieldCheck, label: "PCI-DSS" },
              { icon: ShieldCheck, label: "RGPD" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2"
              >
                <badge.icon className="h-3.5 w-3.5 text-green-400" />
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">{badge.label}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Historique des paiements ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]"
          >
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="flex w-full items-center justify-between p-5"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#C4956A]" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Historique des paiements</h2>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-[var(--text-secondary)] transition-transform duration-200",
                  historyOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {historyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--card-border)] px-5 pb-5">
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[var(--card-border)] text-left text-xs text-[var(--text-secondary)]">
                            <th className="pb-3 pr-4 font-medium">Date</th>
                            <th className="pb-3 pr-4 font-medium">Description</th>
                            <th className="pb-3 pr-4 font-medium">Montant</th>
                            <th className="hidden pb-3 pr-4 font-medium sm:table-cell">M&eacute;thode</th>
                            <th className="pb-3 pr-4 font-medium">Statut</th>
                            <th className="pb-3 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {paymentHistory.map((p) => {
                            const s = statutColors[p.statut];
                            return (
                              <tr key={p.id} className="text-sm">
                                <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDate(p.date)}</td>
                                <td className="py-3 pr-4 text-[var(--foreground)]">{p.description}</td>
                                <td className="py-3 pr-4 font-medium text-[var(--foreground)]">{formatPrice(p.montant)}</td>
                                <td className="hidden py-3 pr-4 text-[var(--text-secondary)] sm:table-cell">{p.methode}</td>
                                <td className="py-3 pr-4">
                                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", s.bg, s.text)}>
                                    {p.statut}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <button
                                    onClick={() => handleDownloadReceipt(p.id)}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[#C4956A]"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">T&eacute;l&eacute;charger le re&ccedil;u</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* History toast */}
          <AnimatePresence>
            {historyToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 z-50 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  {historyToast}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Order Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="order-1 lg:order-2 lg:col-span-2"
        >
          <div className="sticky top-6 space-y-4">
            {/* Property card */}
            <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
              <div className="relative h-36 overflow-hidden">
                {property.images && property.images[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)]">{property.title}</h3>
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <MapPin className="h-3 w-3" />
                  {property.location.city}, {property.location.country}
                </div>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Calendar className="h-4 w-4" />
                    Arrivée
                  </div>
                  <span className="font-medium text-[var(--foreground)]">{formatDate(reservation.checkIn)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Calendar className="h-4 w-4" />
                    Départ
                  </div>
                  <span className="font-medium text-[var(--foreground)]">{formatDate(reservation.checkOut)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Users className="h-4 w-4" />
                    Voyageurs
                  </div>
                  <span className="font-medium text-[var(--foreground)]">{reservation.guests}</span>
                </div>
              </div>
            </div>

            {/* Selected options */}
            {reservation.options.length > 0 && (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
                <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Options sélectionnées</h4>
                <div className="space-y-2">
                  {reservation.options.map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-[var(--text-secondary)]">{opt.name}</span>
                      </div>
                      <span className="text-[var(--foreground)]">{formatPrice(opt.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
              <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Détail du prix</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    {formatPrice(property.pricePerNight ?? property.price)} x {nightCount} nuits
                  </span>
                  <span className="text-[var(--foreground)]">{formatPrice(nightlyTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Frais de service</span>
                  <span className="text-[var(--foreground)]">{formatPrice(serviceFee)}</span>
                </div>
                {optionsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Options</span>
                    <span className="text-[var(--foreground)]">{formatPrice(optionsTotal)}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Réduction</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-[var(--card-border)] pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[var(--foreground)]">Total</span>
                    <span className="text-xl font-bold text-[#C4956A]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
