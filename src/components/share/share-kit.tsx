"use client";

import { useMemo, useState } from "react";
import {
  AtSign, Check, Copy, Download, Link2, Mail, MessageCircle, MessageSquare, Printer, QrCode, Send, Share2,
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
    { key: "wa", label: "WhatsApp", icon: MessageCircle, cls: "bg-[#1f8f4e] text-white hover:bg-[#197a42] border-transparent shadow-[0_8px_24px_-10px_#1f8f4e]", run: () => openUrl(`https://wa.me/?text=${encodeURIComponent(textFor("whatsapp"))}`) },
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

  const close = "[&>button:last-child]:right-3 [&>button:last-child]:top-3 [&>button:last-child]:flex [&>button:last-child]:h-10 [&>button:last-child]:w-10 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-white/10 [&>button:last-child]:text-white [&>button:last-child]:opacity-100 [&>button:last-child]:backdrop-blur md:[&>button:last-child]:bg-subtle md:[&>button:last-child]:text-foreground";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("block max-h-[92vh] w-[calc(100vw-24px)] max-w-[860px] overflow-y-auto overflow-x-hidden rounded-[1.75rem] border-white/10 p-0 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.75)]", close)}>
        <div className="grid md:grid-cols-[300px_minmax(0,1fr)]">
          {/* ── QR : panneau toujours sombre ── */}
          <div className="cine v3-grain relative overflow-hidden p-6 sm:p-7">
            <div aria-hidden className="cine-aurora" />
            <div aria-hidden className="cine-grid opacity-60" />
            <div aria-hidden className="v3-orb v3-orb--gold -bottom-16 -left-16 h-56 w-56" />
            <div className="relative">
              <p className="v3-eyebrow v3-eyebrow--cine">Kit de partage</p>
              <DialogTitle className="mt-3 pr-10 text-[19px] font-semibold leading-snug tracking-[-0.015em] text-white md:pr-0">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-[13px] text-white/60">{city}{priceLabel ? ` · ${priceLabel}` : ""}</DialogDescription>
              {gainLine && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[rgb(227_184_92/0.45)] bg-[rgb(227_184_92/0.14)] px-3 py-1 text-[12.5px] font-semibold text-[#f6dc9f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f2c66b] shadow-[0_0_8px_#f2c66b]" aria-hidden />{gainLine}
                </p>
              )}
              <div className="relative mx-auto mt-6 w-full max-w-[208px]">
                {/* Coins de visée laiton autour du QR (décor). */}
                <span aria-hidden className="pointer-events-none absolute -inset-3">
                  <span className="absolute left-0 top-0 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-[#e3b85c]/80" />
                  <span className="absolute right-0 top-0 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-[#e3b85c]/80" />
                  <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-[#e3b85c]/80" />
                  <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-[#e3b85c]/80" />
                </span>
                <div className="rounded-2xl bg-white p-3 shadow-[0_24px_70px_-18px_rgb(227_184_92/0.6),0_0_0_1px_rgb(255_255_255/0.6)]">
                  {matrix ? (
                    <svg viewBox={`0 0 ${n} ${n}`} className="block h-auto w-full" shapeRendering="crispEdges" role="img" aria-label="QR code de votre lien">
                      <rect width={n} height={n} fill="#fff" />
                      <path d={qrPath(matrix)} fill="#12110e" />
                    </svg>
                  ) : <p className="p-6 text-center text-[12px] text-[#555]">Lien trop long pour un QR code.</p>}
                </div>
              </div>
              <p className="mt-5 text-center text-[12px] leading-relaxed text-white/60">Chaque scan est compté comme une visite « QR code » sur votre lien.</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <KitBtn onClick={downloadPng} icon={Download} label="PNG" />
                <KitBtn onClick={downloadSvg} icon={QrCode} label="SVG" />
                <KitBtn onClick={printPoster} icon={Printer} label="Affiche" />
              </div>
            </div>
          </div>

          {/* ── Messages et canaux ── */}
          <div className="min-w-0 p-5 sm:p-7">
            <StepLabel n={1}>Choisissez un message</StepLabel>
            <div role="tablist" aria-label="Modèle de message" className="mt-3 flex w-fit rounded-xl border bg-subtle p-1">
              {([["court", "Court"], ["detail", "Détaillé"], ["email", "E-mail"]] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tpl === k} onClick={() => setTpl(k)}
                  className={cn("h-9 rounded-lg px-3.5 text-[13px] transition-colors", tpl === k ? "bg-card font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground")}>{l}</button>
              ))}
            </div>
            <label className="relative mt-3 block">
              <span className="sr-only">Message</span>
              <textarea value={shown} onChange={(e) => setEdits((m) => ({ ...m, [tpl]: e.target.value }))} rows={tpl === "court" ? 4 : 8}
                className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-[13.5px] leading-relaxed shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] outline-none transition-colors focus:border-leman" />
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => void copyText("msg", textFor("direct"))}
                className={cn("inline-flex h-11 items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-medium transition-colors",
                  copied === "msg" ? "border-leman/40 bg-leman-soft text-leman" : "hover:border-foreground/25")}>
                {copied === "msg" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied === "msg" ? "Message copié" : "Copier le message"}
              </button>
              {edits[tpl] !== undefined && (
                <button type="button" onClick={() => setEdits((m) => { const n2 = { ...m }; delete n2[tpl]; return n2; })} className="inline-flex h-11 items-center rounded-xl px-2 text-[12.5px] text-muted-foreground hover:text-foreground">
                  Rétablir le modèle
                </button>
              )}
            </div>

            <StepLabel n={2} className="mt-6">Envoyez-le</StepLabel>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {channels.map((c) => (
                <button key={c.key} type="button" onClick={c.run}
                  className={cn("group inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-card text-[13px] font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-[transform,background-color,border-color] hover:-translate-y-px hover:border-foreground/25 active:scale-[0.97]", c.cls)}>
                  <c.icon className="h-4 w-4" aria-hidden />{c.label}
                </button>
              ))}
            </div>

            <StepLabel n={3} className="mt-6">Ou copiez votre lien</StepLabel>
            <div className="mt-3 flex items-center gap-1.5 rounded-2xl border bg-subtle p-1.5 pl-3.5">
              <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted-foreground">{url}</span>
              <button type="button" onClick={() => void copyText("link", url)}
                className={cn("inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-semibold shadow-xs transition-colors",
                  copied === "link" ? "bg-leman-soft text-leman" : "bg-card")}>
                {copied === "link" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied === "link" ? "Copié" : "Copier le lien"}
              </button>
              <button type="button" onClick={() => void nativeShare()} aria-label="Partager avec une autre application" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card shadow-xs">
                <Share2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepLabel({ n, children, className }: { n: number; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-[13.5px] font-semibold", className)}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-laiton-border bg-laiton-soft text-[11.5px] font-bold tabular-nums text-laiton" aria-hidden>{n}</span>
      {children}
    </p>
  );
}

function KitBtn({ onClick, icon: Icon, label }: { onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] text-[12.5px] font-medium text-white/90 transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b85c]">
      <Icon className="h-3.5 w-3.5" aria-hidden />{label}
    </button>
  );
}
