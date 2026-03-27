"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon,
  Copy,
  Check,
  Share2,
  QrCode,
  Mail,
  MessageCircle,
  TrendingUp,
  Users,
  Clock,
  Filter,
  Award,
  CreditCard,
  MousePointerClick,
  UserCheck,
  Home,
  ShoppingBag,
  Building,
  Camera,
  Handshake,
  Megaphone,
  Network,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { useApp } from "@/lib/context";

// ─── Mock Data (inline) ─────────────────────────────────

const userId = "KARIM2024";

const referralLinks = [
  {
    id: "hote",
    type: "hote" as const,
    title: "Amener un hôte",
    description:
      "Recrutez un nouvel hôte sur E-Dome. Vous touchez une commission dès l'activation de son premier bien sur la plateforme.",
    url: `edome.world/ref/hote/${userId}`,
    clicks: 342,
    conversions: 28,
    icon: Home,
    color: "text-emerald-400",
    colorBg: "bg-emerald-500/15",
  },
  {
    id: "client",
    type: "client" as const,
    title: "Amener un client",
    description:
      "Envoyez un voyageur, acheteur ou locataire. Aucun surcoût pour le client — la commission est prélevée sur la part plateforme.",
    url: `edome.world/ref/client/${userId}`,
    clicks: 518,
    conversions: 45,
    icon: ShoppingBag,
    color: "text-blue-400",
    colorBg: "bg-blue-500/15",
  },
  {
    id: "bien",
    type: "bien" as const,
    title: "Amener un bien",
    description:
      "Référencez une propriété ou un mandat. Suivi en temps réel de l'avancement, de la publication à la première transaction.",
    url: `edome.world/ref/bien/${userId}`,
    clicks: 187,
    conversions: 12,
    icon: Building,
    color: "text-purple-400",
    colorBg: "bg-purple-500/15",
  },
];

const apportTypes = [
  {
    icon: Building,
    title: "Bien / mandat",
    description: "Accès à une propriété, agence ou propriétaire souhaitant mettre en location ou en vente.",
  },
  {
    icon: UserCheck,
    title: "Client qualifié",
    description: "Acheteur, locataire ou voyageur prêt à réserver ou à signer.",
  },
  {
    icon: Camera,
    title: "Prestataire",
    description: "Photographe, nettoyeur, décorateur ou tout autre professionnel du secteur.",
  },
  {
    icon: Handshake,
    title: "Partenariat local",
    description: "Contacts dans une ville ou un marché spécifique, réseau local de confiance.",
  },
  {
    icon: Megaphone,
    title: "Audience ciblée",
    description: "Influenceur, média, créateur de contenu avec une audience pertinente.",
  },
  {
    icon: Network,
    title: "Parrainage réseau",
    description: "Hôtes, agences ou prestataires qualifiés à intégrer dans le réseau E-Dome.",
  },
];

const mockApports = [
  { id: "a1", type: "Bien / mandat", reference: "Villa Lac Neuchâtel", date: "2026-03-18", status: "suivi" as const },
  { id: "a2", type: "Client qualifié", reference: "M. Dupont — achat", date: "2026-03-15", status: "valide" as const },
  { id: "a3", type: "Prestataire", reference: "Photo Pro Lausanne", date: "2026-03-10", status: "verse" as const },
  { id: "a4", type: "Partenariat local", reference: "Office Tourisme Montreux", date: "2026-03-05", status: "suivi" as const },
  { id: "a5", type: "Client qualifié", reference: "Mme Keller — location", date: "2026-02-28", status: "valide" as const },
  { id: "a6", type: "Audience ciblée", reference: "@swiss_travel (12k)", date: "2026-02-20", status: "verse" as const },
  { id: "a7", type: "Bien / mandat", reference: "Chalet Grindelwald", date: "2026-02-15", status: "suivi" as const },
  { id: "a8", type: "Parrainage réseau", reference: "Agence ImmoPlus SA", date: "2026-02-10", status: "valide" as const },
];

const apportStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  suivi: { label: "Suivi actif", bg: "bg-yellow-500/15", text: "text-yellow-400" },
  valide: { label: "Validé", bg: "bg-green-500/15", text: "text-green-400" },
  verse: { label: "Versé ✓", bg: "bg-blue-500/15", text: "text-blue-400" },
};

const commissionData = {
  totalEarned: 12450,
  pending: 3200,
  paidOut: 9250,
};

const mockVersements = [
  { id: "v1", date: "2026-03-01", amount: 2800, reference: "VIR-2026-003", status: "completed" as const },
  { id: "v2", date: "2026-02-01", amount: 3150, reference: "VIR-2026-002", status: "completed" as const },
  { id: "v3", date: "2026-01-01", amount: 3300, reference: "VIR-2026-001", status: "completed" as const },
  { id: "v4", date: "2026-04-01", amount: 3200, reference: "VIR-2026-004", status: "pending" as const },
];

const versementStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: "Payé", bg: "bg-green-500/15", text: "text-green-400" },
  pending: { label: "En attente", bg: "bg-yellow-500/15", text: "text-yellow-400" },
};

const leaderboardData = [
  { id: "u1", name: "Karim Benali", avatar: "KB", apports: 47, commission: 18500, isCurrentUser: true },
  { id: "u10", name: "Yasmine Khoury", avatar: "YK", apports: 62, commission: 24300 },
  { id: "u11", name: "Thomas Müller", avatar: "TM", apports: 55, commission: 21800 },
  { id: "u12", name: "Fatima Zahra", avatar: "FZ", apports: 38, commission: 15200 },
  { id: "u13", name: "Luca Rossi", avatar: "LR", apports: 34, commission: 13600 },
  { id: "u14", name: "Chloé Mercier", avatar: "CM", apports: 29, commission: 11400 },
  { id: "u15", name: "Ahmed Mansour", avatar: "AM", apports: 25, commission: 9800 },
  { id: "u16", name: "Elena Petrova", avatar: "EP", apports: 21, commission: 8200 },
  { id: "u17", name: "Nicolas Blanc", avatar: "NB", apports: 18, commission: 7100 },
  { id: "u18", name: "Sara Ben Ali", avatar: "SB", apports: 14, commission: 5500 },
];

const leaderboardDataAllTime = [...leaderboardData].sort((a, b) => b.commission - a.commission);
const leaderboardDataMonth = [
  { id: "u10", name: "Yasmine Khoury", avatar: "YK", apports: 8, commission: 3200 },
  { id: "u1", name: "Karim Benali", avatar: "KB", apports: 6, commission: 2400, isCurrentUser: true },
  { id: "u11", name: "Thomas Müller", avatar: "TM", apports: 5, commission: 2100 },
  { id: "u13", name: "Luca Rossi", avatar: "LR", apports: 5, commission: 1900 },
  { id: "u12", name: "Fatima Zahra", avatar: "FZ", apports: 4, commission: 1600 },
  { id: "u14", name: "Chloé Mercier", avatar: "CM", apports: 3, commission: 1200 },
  { id: "u15", name: "Ahmed Mansour", avatar: "AM", apports: 3, commission: 1100 },
  { id: "u16", name: "Elena Petrova", avatar: "EP", apports: 2, commission: 800 },
  { id: "u17", name: "Nicolas Blanc", avatar: "NB", apports: 2, commission: 700 },
  { id: "u18", name: "Sara Ben Ali", avatar: "SB", apports: 1, commission: 400 },
];

const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

// ─── QR Code SVG Component ──────────────────────────────

function QRCodeSVG({ label }: { label?: string }) {
  const size = 21;
  const moduleSize = 6;
  const svgSize = size * moduleSize;

  const pattern: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    pattern[y] = [];
    for (let x = 0; x < size; x++) {
      const inTopLeft = x < 7 && y < 7;
      const inTopRight = x >= size - 7 && y < 7;
      const inBottomLeft = x < 7 && y >= size - 7;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const lx = inTopRight ? x - (size - 7) : x;
        const ly = inBottomLeft ? y - (size - 7) : y;
        if (lx === 0 || lx === 6 || ly === 0 || ly === 6) {
          pattern[y][x] = true;
        } else if (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4) {
          pattern[y][x] = true;
        } else {
          pattern[y][x] = false;
        }
      } else if (y === 6) {
        pattern[y][x] = x % 2 === 0;
      } else if (x === 6) {
        pattern[y][x] = y % 2 === 0;
      } else {
        const seed = (x * 7 + y * 13 + x * y * 3 + (label?.charCodeAt(0) ?? 0)) % 17;
        pattern[y][x] = seed < 8;
      }
    }
  }

  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="mx-auto">
      <rect width={svgSize} height={svgSize} fill="#ffffff" rx="4" />
      {pattern.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x * moduleSize}
              y={y * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#080808"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── Animated Counter Hook ──────────────────────────────

function useCountUp(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

// ─── Toast Component ────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-white/[0.06] bg-[#1a1a1a] px-5 py-3 text-sm font-medium text-white shadow-2xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ───────────────────────────────────────────────

export default function ApporteursPage() {
  const { availableRoles, formatPrice } = useApp();
  const REQUIRED_ROLES = ['apporteur'];
  const hasAccess = REQUIRED_ROLES.some(r => availableRoles.includes(r as any));

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showQR, setShowQR] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"month" | "alltime">("alltime");
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  const animatedTotal = useCountUp(commissionData.totalEarned, 1500);
  const animatedPending = useCountUp(commissionData.pending, 1200);
  const animatedPaid = useCountUp(commissionData.paidOut, 1500);

  const filteredApports =
    statusFilter === "all"
      ? mockApports
      : mockApports.filter((a) => a.status === statusFilter);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleCopy = (url: string, linkId: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopiedLink(linkId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleWhatsApp = (url: string, title: string) => {
    const text = encodeURIComponent(
      `Découvrez E-Dome ! ${title} via mon lien : https://${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleEmail = (url: string, title: string) => {
    const subject = encodeURIComponent(`E-Dome — ${title}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nJe vous invite à découvrir E-Dome.\n\n${title} : https://${url}\n\nÀ bientôt !`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Accès restreint</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">Cette page est réservée aux apporteurs. Activez ce rôle dans vos paramètres.</p>
          <Link href="/parametres" className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold">Gérer mes rôles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Toast message={toastMessage} visible={toastVisible} />

      {/* ══════════════ 1. HERO ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#C4956A]/20 via-[#0e0e0e] to-[#0e0e0e] p-8 md:p-12"
      >
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-[#C4956A]" />
            <span className="text-sm font-medium text-[#C4956A]">Programme Apporteur</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Programme Apporteurs d&apos;Affaires
          </h1>
          <p className="mb-4 max-w-2xl text-[#888]">
            Amenez des hôtes, des clients ou des biens sur E-Dome et touchez une commission
            sur chaque transaction réussie. La commission est prélevée sur la part plateforme
            — jamais un surcoût pour l&apos;hôte ou le client.
          </p>
          <div className="mb-6 flex max-w-2xl items-start gap-6 rounded-xl border border-white/[0.04] bg-[#080808]/60 p-4 text-xs text-[#888]">
            <div className="flex flex-col items-center gap-1 text-center">
              <MousePointerClick className="h-4 w-4 text-yellow-400" />
              <span className="font-medium text-yellow-400">1. Lien cliqué</span>
              <span>Soumission suivie</span>
            </div>
            <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 text-white/20" />
            <div className="flex flex-col items-center gap-1 text-center">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="font-medium text-green-400">2. Conversion</span>
              <span>Réservation ou vente</span>
            </div>
            <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 text-white/20" />
            <div className="flex flex-col items-center gap-1 text-center">
              <CircleDollarSign className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-blue-400">3. Commission</span>
              <span>Part plateforme redistribuée</span>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("referral-links-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Obtenir mes liens
          </button>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C4956A]/10 blur-3xl" />
      </motion.div>

      {/* ══════════════ 2. THREE REFERRAL LINK CARDS ══════════════ */}
      <div id="referral-links-section" className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {referralLinks.map((link, i) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", link.colorBg)}>
                  <link.icon className={cn("h-5 w-5", link.color)} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{link.title}</h3>
                </div>
              </div>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-[#888]">{link.description}</p>

            {/* Link display */}
            <div className="mb-3 flex items-center rounded-lg border border-white/[0.06] bg-[#080808] px-3 py-2.5">
              <LinkIcon className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#C4956A]" />
              <span className="flex-1 truncate text-xs text-[#666]">{link.url}</span>
              <button
                onClick={() => handleCopy(link.url, link.id)}
                className={cn(
                  "ml-2 flex-shrink-0 rounded-md p-1.5 transition-colors",
                  copiedLink === link.id
                    ? "bg-green-500/15 text-green-400"
                    : "bg-white/5 text-[#888] hover:text-white"
                )}
              >
                {copiedLink === link.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Share buttons */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => handleWhatsApp(link.url, link.title)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600/15 px-3 py-2 text-xs text-green-400 transition-colors hover:bg-green-600/25"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </button>
              <button
                onClick={() => handleEmail(link.url, link.title)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600/15 px-3 py-2 text-xs text-blue-400 transition-colors hover:bg-blue-600/25"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                onClick={() => setShowQR(showQR === link.id ? null : link.id)}
                className={cn(
                  "flex items-center justify-center rounded-lg px-3 py-2 text-xs transition-colors",
                  showQR === link.id
                    ? "bg-purple-600/25 text-purple-300"
                    : "bg-purple-600/15 text-purple-400 hover:bg-purple-600/25"
                )}
              >
                <QrCode className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* QR Code */}
            <AnimatePresence>
              {showQR === link.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="flex flex-col items-center rounded-lg border border-white/[0.06] bg-[#080808] p-4">
                    <div className="rounded-lg bg-white p-2">
                      <QRCodeSVG label={link.id} />
                    </div>
                    <p className="mt-2 text-[10px] text-[#666]">{link.url}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="flex items-center gap-4 rounded-lg border border-white/[0.04] bg-[#080808] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#888]" />
                <span className="text-xs font-medium text-white">{link.clicks}</span>
                <span className="text-[10px] text-[#666]">clics</span>
              </div>
              <div className="h-4 w-px bg-white/[0.06]" />
              <div className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#C4956A]" />
                <span className="text-xs font-medium text-white">{link.conversions}</span>
                <span className="text-[10px] text-[#666]">conversions</span>
              </div>
              <div className="h-4 w-px bg-white/[0.06]" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-[#C4956A]">
                  {link.clicks > 0 ? Math.round((link.conversions / link.clicks) * 100) : 0}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══════════════ 3. SIX TYPES D'APPORT ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="mb-5 text-lg font-semibold text-white">Les 6 types d&apos;apport</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apportTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="group rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-5 transition-colors hover:border-[#C4956A]/20"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#C4956A]/10">
                <type.icon className="h-5 w-5 text-[#C4956A]" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">{type.title}</h3>
              <p className="text-xs leading-relaxed text-[#888]">{type.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══════════════ 4. COMMISSION FLOW VISUAL ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6 md:p-8"
      >
        <h2 className="mb-2 text-lg font-semibold text-white">Parcours de la commission</h2>
        <p className="mb-8 text-xs text-[#888]">
          La commission n&apos;est jamais un surcoût. Elle est prélevée sur la commission existante de la plateforme.
        </p>

        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-0">
          {/* Step 1 */}
          <div className="flex flex-1 flex-col items-center rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/15">
              <MousePointerClick className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="mb-1 text-xs font-bold text-yellow-400">ÉTAPE 1</span>
            <h3 className="mb-1 text-sm font-semibold text-white">Lien cliqué</h3>
            <p className="text-[11px] text-[#888]">Soumission suivie automatiquement</p>
            <span className="mt-3 inline-flex rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[10px] font-medium text-yellow-400">
              Suivi actif
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden items-center px-3 md:flex">
            <ArrowRight className="h-5 w-5 text-white/20" />
          </div>
          <div className="flex items-center justify-center md:hidden">
            <ChevronDown className="h-5 w-5 text-white/20" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-1 flex-col items-center rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <span className="mb-1 text-xs font-bold text-green-400">ÉTAPE 2</span>
            <h3 className="mb-1 text-sm font-semibold text-white">Conversion confirmée</h3>
            <p className="text-[11px] text-[#888]">Réservation, vente ou activation</p>
            <span className="mt-3 inline-flex rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-medium text-green-400">
              Validé
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden items-center px-3 md:flex">
            <ArrowRight className="h-5 w-5 text-white/20" />
          </div>
          <div className="flex items-center justify-center md:hidden">
            <ChevronDown className="h-5 w-5 text-white/20" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-1 flex-col items-center rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15">
              <CircleDollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <span className="mb-1 text-xs font-bold text-blue-400">ÉTAPE 3</span>
            <h3 className="mb-1 text-sm font-semibold text-white">Commission versée</h3>
            <p className="text-[11px] text-[#888]">Part plateforme redistribuée</p>
            <span className="mt-3 inline-flex rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium text-blue-400">
              Versé ✓
            </span>
          </div>
        </div>
      </motion.div>

      {/* ══════════════ 5. DASHBOARD — 3 BLOCKS ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="mb-5 text-lg font-semibold text-white">Tableau de bord</h2>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* ── Block 1: Apports ── */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-5 xl:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#C4956A]" />
                <h3 className="text-sm font-semibold text-white">Mes apports</h3>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[#888]">
                  {mockApports.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-[#888]" />
                {["all", "suivi", "valide", "verse"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                      statusFilter === s
                        ? "bg-[#C4956A]/15 text-[#C4956A]"
                        : "text-[#888] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {s === "all" ? "Tous" : apportStatusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-xs text-[#888]">
                    <th className="pb-3 pr-4 font-medium">Type</th>
                    <th className="pb-3 pr-4 font-medium">Référence</th>
                    <th className="hidden pb-3 pr-4 font-medium sm:table-cell">Date</th>
                    <th className="pb-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredApports.map((apport) => {
                    const status = apportStatusConfig[apport.status];
                    return (
                      <tr key={apport.id} className="text-sm">
                        <td className="py-3 pr-4 text-xs text-[#888]">{apport.type}</td>
                        <td className="py-3 pr-4 text-xs font-medium text-white">{apport.reference}</td>
                        <td className="hidden py-3 pr-4 text-xs text-[#888] sm:table-cell">
                          {formatDate(apport.date)}
                        </td>
                        <td className="py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                              status.bg,
                              status.text
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Block 2: Commission (partagée plateforme) ── */}
          <div className="space-y-5">
            <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-5">
              <div className="mb-4 flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-[#C4956A]" />
                <h3 className="text-sm font-semibold text-white">Commission</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-[#888]">Total gagné</p>
                  <p className="text-2xl font-bold text-white">{formatPrice(animatedTotal)}</p>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[#888]">En attente</p>
                    <p className="text-lg font-semibold text-yellow-400">{formatPrice(animatedPending)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#888]">Versé</p>
                    <p className="text-lg font-semibold text-green-400">{formatPrice(animatedPaid)}</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                    style={{
                      width: `${(commissionData.paidOut / commissionData.totalEarned) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-center text-[10px] text-[#666]">
                  Prélevée sur la part plateforme — jamais de surcoût
                </p>
              </div>
            </div>

            {/* ── Block 3: Suivi des versements ── */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-5">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#C4956A]" />
                <h3 className="text-sm font-semibold text-white">Suivi des versements</h3>
              </div>
              <div className="space-y-3">
                {mockVersements.map((v) => {
                  const status = versementStatusConfig[v.status];
                  return (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-[#080808] px-4 py-3"
                    >
                      <div>
                        <p className="text-xs font-medium text-white">{formatPrice(v.amount)}</p>
                        <p className="text-[10px] text-[#666]">
                          {formatDate(v.date)} · {v.reference}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                          status.bg,
                          status.text
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════════ 6. LEADERBOARD ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#C4956A]" />
            <h2 className="text-lg font-semibold text-white">Classement des Apporteurs</h2>
          </div>
          <div className="flex rounded-lg border border-white/[0.06] bg-[#080808] p-0.5">
            <button
              onClick={() => setLeaderboardPeriod("month")}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-medium transition-all",
                leaderboardPeriod === "month"
                  ? "bg-[#C4956A]/15 text-[#C4956A]"
                  : "text-[#888] hover:text-white"
              )}
            >
              Ce mois
            </button>
            <button
              onClick={() => setLeaderboardPeriod("alltime")}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-medium transition-all",
                leaderboardPeriod === "alltime"
                  ? "bg-[#C4956A]/15 text-[#C4956A]"
                  : "text-[#888] hover:text-white"
              )}
            >
              Tout le temps
            </button>
          </div>
        </div>

        {(() => {
          const data = leaderboardPeriod === "month" ? leaderboardDataMonth : leaderboardDataAllTime;
          const top3 = data.slice(0, 3);
          const rest = data.slice(3);

          return (
            <>
              {/* Podium */}
              <div className="mb-6 flex items-end justify-center gap-4">
                {[1, 0, 2].map((podiumIdx) => {
                  const entry = top3[podiumIdx];
                  if (!entry) return null;
                  const heights = ["h-32", "h-24", "h-20"];
                  const podiumHeight = heights[podiumIdx];
                  return (
                    <div key={entry.id} className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{medals[podiumIdx]}</span>
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                          entry.isCurrentUser
                            ? "bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-black ring-2 ring-[#C4956A]/50"
                            : "bg-gradient-to-br from-[#333] to-[#555] text-white"
                        )}
                      >
                        {entry.avatar}
                      </div>
                      <div className="text-center">
                        <Link
                          href={`/profil/${entry.id}`}
                          className={cn(
                            "text-xs font-semibold transition-colors hover:text-[#C4956A]",
                            entry.isCurrentUser ? "text-[#C4956A]" : "text-white"
                          )}
                        >
                          {entry.name}
                        </Link>
                        <p className="text-[10px] text-[#888]">{entry.apports} apports</p>
                        <p className="text-xs font-bold text-[#C4956A]">{formatPrice(entry.commission)}</p>
                      </div>
                      <div
                        className={cn(
                          "w-20 rounded-t-lg",
                          podiumHeight,
                          podiumIdx === 0
                            ? "bg-gradient-to-t from-[#C4956A]/20 to-[#C4956A]/40"
                            : podiumIdx === 1
                            ? "bg-gradient-to-t from-gray-500/20 to-gray-400/30"
                            : "bg-gradient-to-t from-amber-700/20 to-amber-600/30"
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Table positions 4-10 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-xs text-[#888]">
                      <th className="pb-3 pr-4 font-medium">#</th>
                      <th className="pb-3 pr-4 font-medium">Apporteur</th>
                      <th className="pb-3 pr-4 font-medium">Apports</th>
                      <th className="pb-3 font-medium">Commission totale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {rest.map((entry, i) => (
                      <tr
                        key={entry.id}
                        className={cn("text-sm", entry.isCurrentUser && "bg-[#C4956A]/10 rounded-lg")}
                      >
                        <td className="py-3 pr-4 font-medium text-[#888]">{i + 4}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold",
                                entry.isCurrentUser
                                  ? "bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-black"
                                  : "bg-gradient-to-br from-[#333] to-[#555] text-white"
                              )}
                            >
                              {entry.avatar}
                            </div>
                            <Link
                              href={`/profil/${entry.id}`}
                              className={cn(
                                "font-medium transition-colors hover:text-[#C4956A]",
                                entry.isCurrentUser ? "text-[#C4956A]" : "text-white"
                              )}
                            >
                              {entry.name}
                              {entry.isCurrentUser && (
                                <span className="ml-2 text-[10px] text-[#C4956A]">(Vous)</span>
                              )}
                            </Link>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-[#888]">{entry.apports}</td>
                        <td className="py-3 font-medium text-white">{formatPrice(entry.commission)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}
      </motion.div>

      {/* ══════════════ 7. QR CODES FOR EACH LINK TYPE ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
      >
        <div className="mb-5 flex items-center gap-2">
          <QrCode className="h-5 w-5 text-[#C4956A]" />
          <h2 className="text-lg font-semibold text-white">QR Codes de partage</h2>
        </div>
        <p className="mb-6 text-xs text-[#888]">
          Imprimez ou partagez ces QR codes pour chaque type de lien de parrainage.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {referralLinks.map((link) => (
            <div
              key={link.id}
              className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-[#080808] p-6"
            >
              <div className={cn("mb-3 flex items-center gap-2", link.color)}>
                <link.icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{link.title}</span>
              </div>
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG label={link.id} />
              </div>
              <p className="mt-3 text-[10px] text-[#666]">{link.url}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
