"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Trash2, Eye, Loader2, ShieldCheck, Check, Circle, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import {
  createDossierUpload, deleteDossierDoc, openMyDoc, registerDossierDoc, revokeAllMyShares, saveMyDossier,
} from "@/lib/supabase/dossier-actions";
import { DOC_KINDS, PERMITS, SITUATIONS, dossierScore, type DocKind, type Dossier, type DossierDoc } from "@/lib/dossier";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Mon dossier de location ─────────────────────────────────────────────────
   Rempli une fois, joint en un clic à toute demande de location. Les pièces
   sont privées : seul·e le/la titulaire et les propriétaires à qui il/elle
   écrit (lien temporaire, 30 jours, révocable) peuvent les ouvrir. */

const MAX_BYTES = 10 * 1024 * 1024;
const selectCls = "h-10 w-full rounded-lg border border-input bg-card px-3 text-[14px] shadow-xs outline-none focus:border-leman";

export function DossierEditor({ initial, docs, ready }: { initial: Dossier; docs: DossierDoc[]; ready: boolean }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [d, setD] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState<DocKind | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [kindToUpload, setKindToUpload] = useState<DocKind>("poursuites");
  const set = <K extends keyof Dossier>(k: K, v: Dossier[K]) => setD((s) => ({ ...s, [k]: v }));
  const score = dossierScore(d, docs);

  const save = () =>
    startTransition(async () => {
      const res = await saveMyDossier(d);
      if (!res.ok) { addToast(res.error, "error"); return; }
      addToast("Dossier enregistré.", "success");
      router.refresh();
    });

  const pick = (kind: DocKind) => { setKindToUpload(kind); fileRef.current?.click(); };
  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES) { addToast("Fichier trop lourd (10 Mo au plus).", "error"); return; }
    setUploading(kindToUpload);
    try {
      /* Le dossier doit exister avant d'y rattacher une pièce. */
      if (!d.updatedAt) await saveMyDossier(d);
      const signed = await createDossierUpload(file.type);
      if (!signed.ok) { addToast(signed.error, "error"); return; }
      const supabase = createClient();
      const up = await supabase?.storage.from("dossiers").uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type });
      if (!up || up.error) { addToast("L'envoi a échoué.", "error"); return; }
      const reg = await registerDossierDoc(kindToUpload, signed.path, file.name);
      if (!reg.ok) { addToast(reg.error, "error"); return; }
      addToast("Pièce ajoutée.", "success");
      router.refresh();
    } finally {
      setUploading(null);
    }
  };

  const open = async (id: string) => {
    const res = await openMyDoc(id);
    if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
    else addToast(res.error, "error");
  };
  const remove = (id: string) =>
    startTransition(async () => {
      const res = await deleteDossierDoc(id);
      if (!res.ok) { addToast(res.error, "error"); return; }
      router.refresh();
    });
  const revoke = () =>
    startTransition(async () => {
      const res = await revokeAllMyShares();
      if (res.ok) addToast(res.count ? `${res.count} lien${res.count > 1 ? "s" : ""} de partage révoqué${res.count > 1 ? "s" : ""}.` : "Aucun lien actif.", "info");
    });

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-heading text-[30px]">Mon dossier de location</h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">
            Remplissez-le une fois. Joignez-le ensuite en un clic à chaque demande de location : le propriétaire reçoit un dossier
            complet, vous ne refaites plus jamais les mêmes copies.
          </p>
        </div>
      </header>

      {!ready && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border bg-card p-4 text-[13px]">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <p><strong>Base à mettre à jour.</strong> Le dossier attend la migration <code className="rounded bg-subtle px-1">supabase/migrations/005_dossier.sql</code>.</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
            <h2 className="text-[16px] font-semibold">Votre situation</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Situation</span>
                <select className={selectCls} value={d.situation} onChange={(e) => set("situation", e.target.value)}>
                  <option value="">Choisir…</option>{SITUATIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select></label>
              <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Employeur ou école</span>
                <Input value={d.employer} onChange={(e) => set("employer", e.target.value)} placeholder="Ex. HE-Arc, Migros, indépendant" /></label>
              <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Revenu mensuel net (ménage)</span>
                <Input value={d.monthlyIncome ? formatNumber(d.monthlyIncome) : ""} onChange={(e) => set("monthlyIncome", Number(e.target.value.replace(/[^\d]/g, "")) || null)}
                  inputMode="numeric" placeholder="0" trailing={<span className="pr-2 text-[12px] text-muted-foreground">CHF</span>} /></label>
              <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Nationalité ou permis</span>
                <select className={selectCls} value={d.permit} onChange={(e) => set("permit", e.target.value)}>
                  <option value="">Choisir…</option>{PERMITS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select></label>
              <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Adultes</span>
                <Input value={String(d.occupants)} onChange={(e) => set("occupants", Number(e.target.value.replace(/[^\d]/g, "")) || 1)} inputMode="numeric" /></label>
              <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Enfants</span>
                <Input value={String(d.children)} onChange={(e) => set("children", Number(e.target.value.replace(/[^\d]/g, "")) || 0)} inputMode="numeric" /></label>
            </div>
            <div className="flex flex-wrap gap-5 text-[14px]">
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[var(--leman)]" checked={d.pets} onChange={(e) => set("pets", e.target.checked)} /> Animaux</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[var(--leman)]" checked={d.smoker} onChange={(e) => set("smoker", e.target.checked)} /> Fumeur·se</label>
            </div>
            <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Présentation</span>
              <textarea value={d.intro} onChange={(e) => set("intro", e.target.value)} rows={4} maxLength={2000}
                placeholder="Qui vous êtes, pourquoi vous déménagez, ce qui fait de vous un bon locataire."
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[14px] leading-relaxed shadow-xs outline-none placeholder:text-muted-foreground focus:border-leman" /></label>
            <Button onClick={save} disabled={isPending}>{isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Enregistrer</Button>
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
              <h2 className="text-[16px] font-semibold">Pièces justificatives</h2>
            </div>
            <p className="text-[13px] text-muted-foreground">PDF ou photo, 10 Mo au plus. Stockées en privé ; jamais visibles publiquement.</p>
            <ul className="divide-y rounded-xl border">
              {DOC_KINDS.map((k) => {
                const mine = docs.filter((x) => x.kind === k.kind);
                return (
                  <li key={k.kind} className="p-3.5">
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-[14px] font-medium">
                          {mine.length ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Circle className="h-4 w-4 text-muted-foreground/50" aria-hidden />}
                          {k.label}{k.required ? "" : <span className="text-[12px] font-normal text-muted-foreground"> · facultatif</span>}
                        </p>
                        <p className="ml-6 text-[12.5px] text-muted-foreground">{k.hint}</p>
                      </div>
                      <Button size="sm" variant="outline" disabled={uploading !== null || !ready} onClick={() => pick(k.kind)}>
                        {uploading === k.kind ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />} Ajouter
                      </Button>
                    </div>
                    {mine.length > 0 && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {mine.map((doc) => (
                          <li key={doc.id} className="flex items-center gap-2 text-[13px]">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                            <span className="min-w-0 flex-1 truncate">{doc.name || "Document"}</span>
                            <button type="button" onClick={() => void open(doc.id)} className="text-muted-foreground hover:text-foreground" aria-label="Ouvrir"><Eye className="h-4 w-4" /></button>
                            <button type="button" onClick={() => remove(doc.id)} className="text-muted-foreground hover:text-foreground" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold">Dossier complet à</p>
              <span className={cn("text-[22px] font-semibold tabular-nums", score.pct === 100 ? "text-leman" : "")}>{score.pct} %</span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
              <div className="h-full rounded-full bg-leman transition-[width]" style={{ width: `${score.pct}%` }} />
            </div>
            {score.missing.length > 0 ? (
              <ul className="mt-3 space-y-1 text-[13px] text-muted-foreground">
                {score.missing.map((m) => <li key={m} className="flex items-center gap-2"><Circle className="h-3.5 w-3.5" aria-hidden />{m}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-[13px] text-muted-foreground">Prêt à être joint à vos demandes de location.</p>
            )}
          </div>
          <div className="rounded-2xl border bg-card p-5 text-[13px] leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground"><ShieldCheck className="h-4 w-4 text-leman" aria-hidden /> Qui voit votre dossier ?</p>
            <p className="mt-1.5">Seulement les propriétaires à qui vous écrivez en cochant « Joindre mon dossier », via un lien personnel valable 30 jours. Vous pouvez tout révoquer à tout moment.</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={revoke} disabled={isPending}>Révoquer tous mes liens</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
