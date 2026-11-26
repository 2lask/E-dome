"use client";

import { useMemo, useState } from "react";
import {
  AtSign, Check, Copy, Download, Mail, MessageCircle, MessageSquare, Printer, QrCode, Send, Share2,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { track } from "@/components/listing/track";
import { encodeQr, qrPath, qrSvg } from "@/lib/qr";
import { withSource, type SourceKey } from "@/lib/tracking";
import { cn } from "@/lib/utils";

/* ── Kit de partage ──────────────────────────────────────────────────────────
   Inspiré des « ressources partenaires » des programmes d'affiliation : tout
   ce qu'il faut pour diffuser UN bien avec SON lien, sans rien retaper.
   · le QR code du lien (SVG, PNG, affiche A5 à imprimer) ;
   · trois messages prêts (court, détaillé, e-mail), modifiables ;
   · un bouton par canal. Chaque lien porte `src=` : le tableau de bord
     sait ensuite quel canal a amené chaque visite.
   Utilisé par l'apporteur (lien `?ref=`) et par le vendeur (lien direct). */

export interface ShareKitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  /** Lien complet à partager (avec `?ref=` pour un apporteur). */
  url: string;
  title: string;
  city: string;
  /** Ex. « 1'200'000 CHF » ou « 2'150 CHF/mois ». */
  priceLabel?: string;
  /** Ex. « 4,5 pièces · 112 m² ». */
  facts?: string;
  cover?: string;
  /** Mention pour l'apporteur (« Vous touchez ≈ 9'504 CHF net »). */
  gainLine?: string;
}

type Tpl = "court" | "detail" | "email";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function ShareKit({ open, onOpenChange, propertyId, url, title, city, priceLabel, facts, cover, gainLine }: ShareKitProps) {
  const [tpl, setTpl] = useState<Tpl>("court");
  const [edits, setEdits] = useState<Partial<Record<Tpl, string>>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const qrUrl = withSource(url, "qr");
  const matrix = useMemo(() => { try { return encodeQr(qrUrl); } catch { return null; } }, [qrUrl]);

  const base = (src: SourceKey) => withSource(url, src);
  const templates = (src: SourceKey): Record<Tpl, string> => {
    const link = base(src);
    const price = priceLabel ? `, ${priceLabel}` : "";
    return {
      court: `Salut ! ${title} à ${city}${price}. Je pense que ça peut t'intéresser : ${link}`,
      detail: [
        `Bonjour,`,
        ``,
        `Je vous transmets ce bien qui pourrait vous intéresser :`,
        `${title} — ${city}`,
        ...(facts ? [facts] : []),
        ...(priceLabel ? [priceLabel] : []),
        ``,
        `Photos, vidéo et contact direct avec le propriétaire ici : ${link}`,
      ].join("\n"),
      email: [
        `Objet : ${title} à ${city}`,
        ``,
        `Bonjour,`,
        ``,
        `J'ai pensé à vous en voyant ce bien : ${title}, à ${city}${price}.${facts ? ` ${facts}.` : ""}`,
        ``,
        `L'annonce complète (photos, vidéo, informations) et le contact du propriétaire : ${link}`,
        ``,
        `Belle journée,`,
      ].join("\n"),
    };
  };
  const textFor = (src: SourceKey) => edits[tpl] !== undefined
    ? (edits[tpl] as string).replaceAll(base("direct"), base(src))
    : templates(src)[tpl];
  const shown = edits[tpl] ?? templates("direct")[tpl];

  const flash = (k: string) => { setCopied(k); setTimeout(() => setCopied((c) => (c === k ? null : c)), 1800); };
  const copyText = async (k: string, text: string) => {
    try { await navigator.clipboard.writeText(text); track(propertyId, "partage"); flash(k); } catch { /* presse-papiers refusé */ }
  };
  const openUrl = (href: string) => {
    track(propertyId, "partage");
    const w = window.open(href, "_blank");
    if (w) w.opener = null;
  };

  const emailParts = () => {
    const t = tpl === "email" ? textFor("email") : templates("email").email;
    const [first, , ...rest] = t.split("\n");
    return { subject: first.replace(/^Objet : /, ""), body: rest.join("\n") };
  };

  const channels: { key: string; label: string; icon: React.ComponentType<{ className?: string }>; cls?: string; run: () => void }[] = [
    { key: "wa", label: "WhatsApp", icon: MessageCircle, cls: "bg-[#1f8f4e] text-white hover:bg-[#197a42] border-transparent", run: () => openUrl(`https://wa.me/?text=${encodeURIComponent(textFor("whatsapp"))}`) },
    { key: "mail", label: "E-mail", icon: Mail, run: () => { const e = emailParts(); track(propertyId, "partage"); window.location.assign(`mailto:?subject=${encodeURIComponent(e.subject)}&body=${encodeURIComponent(e.body)}`); } },
    { key: "sms", label: "SMS", icon: MessageSquare, run: () => { track(propertyId, "partage"); window.location.assign(`sms:?&body=${encodeURIComponent(textFor("sms"))}`); } },
    { key: "tg", label: "Telegram", icon: Send, run: () => openUrl(`https://t.me/share/url?url=${encodeURIComponent(base("telegram"))}&text=${encodeURIComponent(`${title} à ${city}`)}`) },
    { key: "fb", label: "Facebook", icon: Share2, run: () => openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(base("facebook"))}`) },
    { key: "li", label: "LinkedIn", icon: AtSign, run: () => openUrl(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(base("linkedin"))}`) },
  ];

  const download = (name: string, href: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    a.click();
  };
  const svgText = () => qrSvg(qrUrl);
  const downloadSvg = () => {
    const href = URL.createObjectURL(new Blob([svgText()], { type: "image/svg+xml" }));
    download("qr-e-dome.svg", href);
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    track(propertyId, "partage");
  };
  const downloadPng = () => {
    if (!matrix) return;
    const quiet = 4, scale = 16, n = matrix.length + quiet * 2;
    const c = document.createElement("canvas");
    c.width = c.height = n * scale;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#12110e";
    matrix.forEach((row, y) => row.forEach((on, x) => { if (on) ctx.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale); }));
    download("qr-e-dome.png", c.toDataURL("image/png"));
    track(propertyId, "partage");
  };
  /* Affiche A5 : titre, prix, QR, adresse courte. Ouverte dans un onglet et
     imprimée par le navigateur (aucun service tiers). */
  const printPoster = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.opener = null;
    const shortUrl = qrUrl.replace(/^https?:\/\//, "").split("?")[0];
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>@page{size:A5;margin:12mm}*{box-sizing:border-box}body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#12110e;margin:0;text-align:center}
.photo{width:100%;height:58mm;object-fit:cover;border-radius:6mm}h1{font-size:20pt;line-height:1.15;margin:7mm 0 2mm}.meta{font-size:12pt;color:#555;margin:0}
.price{font-size:18pt;font-weight:700;margin:3mm 0 6mm}.qr{width:52mm;height:52mm}.cta{font-size:12pt;font-weight:600;margin:3mm 0 1mm}.url{font-size:9pt;color:#777;word-break:break-all}
.brand{margin-top:6mm;font-size:9pt;letter-spacing:.2em;text-transform:uppercase;color:#a07a2c}</style></head><body>
${cover ? `<img class="photo" src="${esc(cover)}" alt="">` : ""}
<h1>${esc(title)}</h1><p class="meta">${esc(city)}${facts ? ` · ${esc(facts)}` : ""}</p>
${priceLabel ? `<p class="price">${esc(priceLabel)}</p>` : ""}
<div class="qr">${svgText().replace(/width="\d+" height="\d+"/, 'width="100%" height="100%"')}</div>
<p class="cta">Scannez pour voir photos, vidéo et contact</p><p class="url">${esc(shortUrl)}</p>
<p class="brand">E-Dome</p>
<script>window.onload=function(){setTimeout(function(){window.print()},300)}</script></body></html>`);
    w.document.close();
    track(propertyId, "partage");
  };
  const nativeShare = async () => {
    if (!navigator.share) return copyText("link", url);
    try { await navigator.share({ title, text: `${title} à ${city}`, url: base("direct") }); track(propertyId, "partage"); } catch { /* annulé */ }
  };

  const n = matrix ? matrix.length + 8 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="block max-h-[92vh] w-[calc(100vw-24px)] max-w-3xl overflow-y-auto overflow-x-hidden rounded-3xl p-0">
        <div className="grid md:grid-cols-[280px_minmax(0,1fr)]">
          {/* ── QR ── */}
          <div className="cine relative overflow-hidden rounded-t-3xl p-6 md:rounded-l-3xl md:rounded-tr-none">
            <div aria-hidden className="cine-aurora" />
            <div className="relative">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Kit de partage</p>
              <DialogTitle className="mt-2 text-[18px] font-semibold leading-snug text-white">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-[13px] text-white/60">{city}{priceLabel ? ` · ${priceLabel}` : ""}</DialogDescription>
              {gainLine && <p className="mt-3 inline-flex rounded-lg border border-[rgb(227_184_92/0.4)] bg-[rgb(227_184_92/0.12)] px-2.5 py-1 text-[12.5px] font-medium text-[#f0d79a]">{gainLine}</p>}
              <div className="mx-auto mt-5 w-full max-w-[220px] rounded-2xl bg-white p-3 shadow-[0_20px_60px_-20px_rgb(227_184_92/0.5)]">
                {matrix ? (
                  <svg viewBox={`0 0 ${n} ${n}`} className="block h-auto w-full" shapeRendering="crispEdges" role="img" aria-label="QR code de votre lien">
                    <rect width={n} height={n} fill="#fff" />
                    <path d={qrPath(matrix)} fill="#12110e" />
                  </svg>
                ) : <p className="p-6 text-center text-[12px] text-[#555]">Lien trop long pour un QR code.</p>}
              </div>
              <p className="mt-3 text-center text-[12px] text-white/55">Chaque scan est compté comme une visite « QR code » sur votre lien.</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <KitBtn onClick={downloadPng} icon={Download} label="PNG" />
                <KitBtn onClick={downloadSvg} icon={QrCode} label="SVG" />
                <KitBtn onClick={printPoster} icon={Printer} label="Affiche" />
              </div>
            </div>
          </div>

          {/* ── Messages et canaux ── */}
          <div className="min-w-0 p-6">
            <div role="tablist" aria-label="Modèle de message" className="flex w-fit rounded-xl border bg-subtle p-1">
              {([["court", "Court"], ["detail", "Détaillé"], ["email", "E-mail"]] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tpl === k} onClick={() => setTpl(k)}
                  className={cn("h-8 rounded-lg px-3 text-[13px] transition-colors", tpl === k ? "bg-card font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground")}>{l}</button>
              ))}
            </div>
            <label className="mt-3 block">
              <span className="sr-only">Message</span>
              <textarea value={shown} onChange={(e) => setEdits((m) => ({ ...m, [tpl]: e.target.value }))} rows={tpl === "court" ? 4 : 8}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-[13.5px] leading-relaxed outline-none focus:border-leman" />
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => void copyText("msg", textFor("direct"))}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors hover:border-foreground/25">
                {copied === "msg" ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied === "msg" ? "Message copié" : "Copier le message"}
              </button>
              {edits[tpl] !== undefined && (
                <button type="button" onClick={() => setEdits((m) => { const n2 = { ...m }; delete n2[tpl]; return n2; })} className="text-[12.5px] text-muted-foreground hover:text-foreground">
                  Rétablir le modèle
                </button>
              )}
            </div>

            <p className="mt-5 text-[13px] font-semibold">Envoyer par</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {channels.map((c) => (
                <button key={c.key} type="button" onClick={c.run}
                  className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-[13px] font-medium transition-[transform,background-color,border-color] active:scale-[0.97] hover:border-foreground/25", c.cls)}>
                  <c.icon className="h-4 w-4" aria-hidden />{c.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border bg-subtle p-1.5 pl-3">
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted-foreground">{url}</span>
              <button type="button" onClick={() => void copyText("link", url)} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-card px-3 text-[12.5px] font-medium shadow-xs">
                {copied === "link" ? <Check className="h-3.5 w-3.5 text-leman" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied === "link" ? "Copié" : "Copier le lien"}
              </button>
              <button type="button" onClick={() => void nativeShare()} aria-label="Partager avec une autre application" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-xs">
                <Share2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KitBtn({ onClick, icon: Icon, label }: { onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 text-[12.5px] font-medium text-white/85 transition-colors hover:bg-white/10">
      <Icon className="h-3.5 w-3.5" aria-hidden />{label}
    </button>
  );
}
