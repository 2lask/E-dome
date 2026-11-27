"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Compass, Globe, Link2, Mail, MessageCircle, MessageSquare, QrCode, Search, Send, Share2, Sparkles } from "lucide-react";
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
  const total = (sources ?? []).reduce((n, s) => n + s.value, 0);
  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="v3-icon h-9 w-9 rounded-[0.7rem]"><Compass className="h-[17px] w-[17px]" aria-hidden /></span>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold leading-tight tracking-[-0.01em]">{title}</h2>
            {sources && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{total} visite{total > 1 ? "s" : ""} dont la provenance est connue</p>}
          </div>
        </div>
      </div>
      {!sources ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed p-4">
          {/* Aperçu d'illustration : barres vides, sans aucun chiffre. */}
          <div aria-hidden className="space-y-2 opacity-60">
            {[78, 52, 34, 20].map((wd, i) => {
              const Icon = [MessageCircle, QrCode, Mail, Share2][i];
              return (
                <div key={wd} className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-subtle text-muted-foreground"><Icon className="h-3.5 w-3.5" /></span>
                  <span className="h-2 flex-1 rounded-full bg-subtle"><span className="block h-2 rounded-full bg-gradient-to-r from-foreground/15 to-foreground/5" style={{ width: `${wd}%` }} /></span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">{empty}</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {sources.slice(0, 7).map((s, i) => {
            const Icon = ICON[s.key] ?? Globe;
            const top = i === 0;
            return (
              <li key={s.key} className="flex items-center gap-3 text-[13px]">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", top ? "border-laiton-border bg-laiton-soft text-laiton" : "bg-subtle text-muted-foreground")}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={cn("truncate", top && "font-semibold")}>{s.label}</span>
                    <span className="shrink-0 tabular-nums">
                      <span className="font-semibold">{s.value}</span>
                      <span className="ml-2 inline-block w-10 text-right text-[12px] text-muted-foreground">{s.pct} %</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
                    <div className={cn("h-full origin-left rounded-full", top ? "bg-gradient-to-r from-laiton/60 to-laiton" : "bg-gradient-to-r from-leman/40 to-leman/80")}
                      style={{ width: `${Math.max(4, (s.value / max) * 100)}%` }} />
                  </div>
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
    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1 pl-2 pr-3 text-[12.5px] text-white/80 backdrop-blur" aria-live="polite">
      <span className="relative flex h-2 w-2" aria-hidden>
        {count > 0 && <span className="absolute inset-0 rounded-full bg-[#3ddc97]/70 motion-safe:animate-ping" />}
        <span className={cn("relative h-2 w-2 rounded-full", count > 0 ? "bg-[#3ddc97] shadow-[0_0_8px_#3ddc97]" : "bg-white/30")} />
      </span>
      {count > 0 ? `${count} personne${count > 1 ? "s" : ""} ${what} en ce moment` : `Personne ${what} en ce moment`}
    </p>
  );
}
