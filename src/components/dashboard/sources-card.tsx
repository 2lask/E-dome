"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Globe, Link2, Mail, MessageCircle, MessageSquare, QrCode, Search, Send, Share2, Sparkles } from "lucide-react";
import type { SourceStat } from "@/lib/dashboard-stats";
import { cn } from "@/lib/utils";

/* ── D'où viennent les visiteurs ─────────────────────────────────────────────
   Liste à barres, une ligne par source (WhatsApp, QR code, e-mail…). C'est la
   réponse à « où dois-je partager ? » : le vendeur voit quel canal amène des
   gens, l'apporteur où son lien fonctionne. */

const ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: MessageCircle,
  qr: QrCode,
  email: Mail,
  sms: MessageSquare,
  facebook: Share2,
  instagram: AtSign,
  linkedin: Share2,
  x: AtSign,
  telegram: Send,
  recherche: Search,
  "e-dome": Sparkles,
  direct: Link2,
  autre: Globe,
};

export function SourcesCard({ sources, title, empty }: { sources: SourceStat[] | null; title: string; empty: string }) {
  const max = Math.max(1, ...(sources ?? []).map((s) => s.value));
  return (
    <div>
      <p className="mb-3 text-[14px] font-semibold">{title}</p>
      {!sources ? (
        <p className="text-[13px] leading-relaxed text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {sources.slice(0, 7).map((s, i) => {
            const Icon = ICON[s.key] ?? Globe;
            return (
              <li key={s.key} className="relative overflow-hidden rounded-lg">
                <div aria-hidden
                  className={cn("absolute inset-y-0 left-0 rounded-lg transition-[width] duration-700", i === 0 ? "bg-laiton-soft" : "bg-subtle")}
                  style={{ width: `${Math.max(6, (s.value / max) * 100)}%` }} />
                <div className="relative flex items-center gap-2.5 px-2.5 py-1.5 text-[13px]">
                  <Icon className={cn("h-4 w-4 shrink-0", i === 0 ? "text-laiton" : "text-muted-foreground")} aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  <span className="tabular-nums font-medium">{s.value}</span>
                  <span className="w-10 text-right tabular-nums text-muted-foreground">{s.pct} %</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* Pastille « en ce moment » : visiteurs actifs des 5 dernières minutes. La
   page se recharge chaque minute (onglet visible) pour que le chiffre décroisse
   aussi quand plus personne ne regarde. */
export function LiveNow({ count, what }: { count: number; what: string }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => { if (!document.hidden) router.refresh(); }, 60_000);
    return () => clearInterval(t);
  }, [router]);
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12.5px] text-white/80 backdrop-blur" aria-live="polite">
      <span className={cn("h-2 w-2 rounded-full", count > 0 ? "live-dot bg-[#3ddc97]" : "bg-white/30")} aria-hidden />
      {count > 0 ? `${count} personne${count > 1 ? "s" : ""} ${what} en ce moment` : `Personne ${what} en ce moment`}
    </p>
  );
}
