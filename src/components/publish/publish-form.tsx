"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ImagePlus, Loader2, X, ArrowLeft, Star, Sparkles, Coins, Check, Circle, AlertCircle, Clapperboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/listing/listing-card";
import { uploadPropertyImage, uploadPropertyVideo } from "@/lib/image-upload";
import { createMyProperty, updateMyProperty } from "@/lib/supabase/property-actions";
import { setMyPrime, liftMyPrime } from "@/lib/supabase/prime-actions";
import { repriseOf, type MyProperty } from "@/lib/my-property";
import { CommissionEditor } from "@/components/commission/commission-editor";
import { defaultTerms, estimateChf, validateTerms, type CommissionTerms } from "@/lib/commission";
import { publierObligations } from "@/content/publier-obligations";
import { AI_OPEN_EVENT } from "@/lib/nav";
import { formatNumber } from "@/lib/format";
import type { PropertyType } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── Publier / modifier un bien (REBUILD.md §6) ──────────────────────────────

   UNE page, cinq sections, un aperçu en direct. Retiré par rapport à l'ancien
   tunnel : les options payantes fictives (photographe, visite 3D), le DPE
   (étiquette française — la Suisse utilise le CECB), les valeurs par défaut
   qui passaient pour des faits, la courte durée (autre métier, sans prime).
   Ajouté : de vraies photos (stockage), la prime dès la publication, le
   copilote pour rédiger, un score de qualité. */

type Tx = "vente" | "location-lt";

const TYPES: { v: PropertyType; label: string }[] = [
  { v: "appartement", label: "Appartement" },
  { v: "maison", label: "Maison" },
  { v: "villa", label: "Villa" },
  { v: "chalet", label: "Chalet" },
  { v: "studio", label: "Studio" },
  { v: "penthouse", label: "Attique" },
  { v: "terrain", label: "Terrain" },
  { v: "commercial", label: "Commercial" },
  { v: "bureau", label: "Bureau" },
];

const AMENITIES = [
  "Balcon", "Terrasse", "Jardin", "Parking", "Garage", "Ascenseur", "Cave", "Vue lac", "Vue montagne",
  "Cheminée", "Lave-vaisselle", "Lave-linge", "Accès PMR", "Meublé", "Piscine", "Pompe à chaleur",
];

const MAX_PHOTOS = 15;
const DRAFT_KEY = "edome_publish_v2";

interface Photo {
  key: string;
  url?: string;
  /** Aperçu local pendant l'envoi. */
  preview?: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

interface Draft {
  tx: Tx;
  type: PropertyType | "";
  city: string;
  address: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  title: string;
  description: string;
  amenities: string[];
  charges: string;
  primeOn: boolean;
  /** Commission d'apport (v2). null : conditions par défaut selon le type. */
  commission: CommissionTerms | null;
  /** Reprise de bail : je quitte mon logement et cherche un remplaçant. */
  reprise: boolean;
  availableFrom: string;
  regie: string;
}

const EMPTY: Draft = {
  tx: "vente", type: "", city: "", address: "", price: "", area: "", bedrooms: "", bathrooms: "",
  title: "", description: "", amenities: [], charges: "", primeOn: true, commission: null,
  reprise: false, availableFrom: "", regie: "",
};

/* Les trois façons de publier, lisibles par tous. */
const MODES = [
  { key: "vente", label: "Je vends" },
  { key: "location", label: "Je loue" },
  { key: "reprise", label: "Je remets mon bail" },
] as const;

const digits = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

export function PublishForm({
  initial,
  initialCommission,
  initialMode,
}: {
  /** Mode de départ en création (« Remettre son bail » depuis l'accueil). */
  initialMode?: "reprise" | "location";
  /** Mode modification : le bien existant. */
  initial?: MyProperty | null;
  initialCommission?: CommissionTerms | null;
}) {
  const router = useRouter();
  const editing = !!initial;
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [attest, setAttest] = useState(editing);

  const [d, setD] = useState<Draft>(() =>
    initial
      ? {
          tx: initial.transactionType === "location-lt" ? "location-lt" : "vente",
          type: initial.type,
          city: initial.city,
          address: initial.address ?? "",
          price: String(initial.price || ""),
          area: initial.area ? String(initial.area) : "",
          bedrooms: initial.bedrooms ? String(initial.bedrooms) : "",
          bathrooms: initial.bathrooms ? String(initial.bathrooms) : "",
          title: initial.title,
          description: initial.description,
          amenities: initial.amenities,
          charges: initial.analytics?.chargesAnnuelles ? String(initial.analytics.chargesAnnuelles) : "",
          primeOn: !!initialCommission,
          commission: initialCommission ?? null,
          reprise: !!repriseOf(initial),
          availableFrom: repriseOf(initial)?.availableFrom ?? "",
          regie: repriseOf(initial)?.regie ?? "",
        }
      : initialMode === "reprise"
        ? { ...EMPTY, tx: "location-lt", reprise: true }
        : initialMode === "location"
          ? { ...EMPTY, tx: "location-lt" }
          : EMPTY,
  );
  const [photos, setPhotos] = useState<Photo[]>(() =>
    (initial?.images ?? []).map((url, i) => ({ key: `init-${i}`, url, status: "done" as const })),
  );

  /* Vidéo (une, 50 Mo max) : visite filmée, mise en avant en grand sur l'annonce. */
  const videoRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<{ url?: string; status: "idle" | "uploading" | "done" | "error"; error?: string }>(
    initial?.videos?.[0] ? { url: initial.videos[0], status: "done" } : { status: "idle" },
  );
  const addVideo = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setVideo({ status: "uploading" });
    const res = await uploadPropertyVideo(f);
    setVideo(res.ok ? { url: res.url, status: "done" } : { status: "error", error: res.error });
  };

  /* Brouillon local (création seulement) : on ne perd rien en quittant la page. */
  const restored = useRef(false);
  useEffect(() => {
    if (editing || restored.current) return;
    restored.current = true;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { d: Draft; photos: string[] };
      if (saved?.d) setD({ ...EMPTY, ...saved.d, ...(initialMode === "reprise" ? { tx: "location-lt" as const, reprise: true } : {}) });
      if (Array.isArray(saved?.photos)) setPhotos(saved.photos.map((url, i) => ({ key: `draft-${i}`, url, status: "done" })));
    } catch { /* stockage indisponible : on repart d'un formulaire vide */ }
  }, [editing, initialMode]);
  useEffect(() => {
    if (editing) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ d, photos: photos.filter((p) => p.url).map((p) => p.url) }));
    } catch { /* ignore */ }
  }, [d, photos, editing]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((s) => ({ ...s, [k]: v }));

  /* ── Photos ───────────────────────────────────────────────────────────── */
  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX_PHOTOS - photos.length;
    const list = Array.from(files).slice(0, Math.max(0, room));
    const pending: Photo[] = list.map((f) => ({
      key: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
      preview: URL.createObjectURL(f),
      status: "uploading",
    }));
    setPhotos((p) => [...p, ...pending]);
    await Promise.all(
      list.map(async (file, i) => {
        const key = pending[i].key;
        const res = await uploadPropertyImage(file);
        setPhotos((p) =>
          p.map((ph) =>
            ph.key === key
              ? res.ok
                ? { key, url: res.url, preview: ph.preview, status: "done" }
                : { ...ph, status: "error", error: res.error }
              : ph,
          ),
        );
      }),
    );
  };
  const removePhoto = (key: string) => setPhotos((p) => p.filter((x) => x.key !== key));
  const makeCover = (key: string) => setPhotos((p) => {
    const i = p.findIndex((x) => x.key === key);
    if (i <= 0) return p;
    const next = [...p];
    const [ph] = next.splice(i, 1);
    return [ph, ...next];
  });
  const uploading = photos.some((p) => p.status === "uploading") || video.status === "uploading";
  const photoUrls = photos.filter((p) => p.status === "done" && p.url).map((p) => p.url!);

  /* ── Validation + qualité ─────────────────────────────────────────────── */
  const price = digits(d.price);
  const terms = d.commission ?? defaultTerms(d.tx, price);
  const [termsOk, setTermsOk] = useState(editing && !!initialCommission);
  const termsError = d.primeOn ? validateTerms(terms, d.tx) : null;
  const errors = useMemo(() => {
    const e: Partial<Record<"type" | "city" | "price" | "title" | "prime" | "availableFrom", string>> = {};
    if (d.reprise && !/^\d{4}-\d{2}-\d{2}$/.test(d.availableFrom)) e.availableFrom = "Indiquez la date à laquelle le logement est libre.";
    if (!d.type) e.type = "Choisissez le type de bien.";
    if (d.city.trim().length < 2) e.city = "Indiquez la localité.";
    if (price <= 0) e.price = d.tx === "vente" ? "Indiquez le prix de vente." : "Indiquez le loyer mensuel.";
    if (d.title.trim().length < 8) e.title = "Un titre d'au moins 8 caractères.";
    if (d.primeOn && termsError) e.prime = termsError;
    else if (d.primeOn && !termsOk) e.prime = "Acceptez les conditions de la commission (ou désactivez-la).";
    return e;
  }, [d, price, termsError, termsOk]);
  const valid = Object.keys(errors).length === 0;
  /* Les erreurs ne s'affichent qu'après une tentative d'envoi : un formulaire
     vide n'est pas « en erreur », il est à remplir. */
  const [tried, setTried] = useState(false);
  const shown = tried ? errors : {};

  const quality = [
    { ok: photoUrls.length >= 3, label: "Au moins 3 photos" },
    { ok: d.title.trim().length >= 20, label: "Un titre descriptif" },
    { ok: d.description.trim().length >= 250, label: "Une description de 250 caractères" },
    { ok: digits(d.area) > 0, label: "La surface" },
    { ok: video.status === "done", label: "Une vidéo (visite filmée)" },
    { ok: d.primeOn && !termsError, label: "Une commission pour les apporteurs" },
  ];
  const qualityScore = quality.filter((q) => q.ok).length;

  const preview: MyProperty = {
    id: initial?.id ?? "apercu",
    title: d.title.trim() || "Titre de votre annonce",
    description: d.description,
    type: (d.type || "appartement") as PropertyType,
    transactionType: d.tx,
    price,
    currency: "CHF",
    city: d.city.trim() || "Localité",
    country: "Suisse",
    images: photoUrls,
    videos: video.status === "done" && video.url ? [video.url] : [],
    bedrooms: digits(d.bedrooms),
    bathrooms: digits(d.bathrooms),
    area: digits(d.area),
    amenities: d.amenities,
    featured: false,
    createdAt: "",
    analytics: d.reprise ? { reprise: true, availableFrom: d.availableFrom, regie: d.regie } : null,
    activePrimeChf: d.primeOn && !termsError ? estimateChf(terms, price) : null,
    commission: d.primeOn && !termsError ? terms : null,
  };

  /* ── Copilote : rédiger l'annonce ─────────────────────────────────────── */
  const askCopilot = () => {
    const facts = [
      d.type && TYPES.find((t) => t.v === d.type)?.label,
      d.city && `à ${d.city}`,
      digits(d.area) && `${digits(d.area)} m²`,
      digits(d.bedrooms) && `${digits(d.bedrooms)} chambres`,
      digits(d.bathrooms) && `${digits(d.bathrooms)} salles d'eau`,
      d.amenities.length && `équipements : ${d.amenities.join(", ")}`,
      price && `${d.tx === "vente" ? "prix" : "loyer"} ${formatNumber(price)} CHF`,
    ].filter(Boolean).join(", ");
    window.dispatchEvent(new CustomEvent(AI_OPEN_EVENT, {
      detail: { prompt: `Rédige une annonce immobilière honnête et attrayante (titre de moins de 80 caractères + description de 3 paragraphes) pour : ${d.tx === "vente" ? "vente" : "location"}, ${facts || "bien en Suisse romande"}. N'invente aucun détail que je n'ai pas donné.` },
    }));
  };

  /* ── Envoi ────────────────────────────────────────────────────────────── */
  const submit = () => {
    setError("");
    if (!valid || !attest) {
      setTried(true);
      /* Défilement jusqu'au premier champ à corriger (après le rendu). */
      requestAnimationFrame(() =>
        document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    if (uploading || !d.type) return;
    startTransition(async () => {
      const input = {
        title: d.title.trim().slice(0, 120),
        description: d.description.trim(),
        type: d.type as PropertyType,
        transactionType: d.tx,
        price,
        currency: "CHF" as const,
        city: d.city.trim(),
        address: d.address.trim() || undefined,
        bedrooms: digits(d.bedrooms),
        bathrooms: digits(d.bathrooms),
        area: digits(d.area),
        images: photoUrls,
        videos: video.status === "done" && video.url ? [video.url] : [],
        amenities: d.amenities,
        analytics: d.reprise
          ? { reprise: true, availableFrom: d.availableFrom, regie: d.regie.trim() || null }
          : digits(d.charges) ? { chargesAnnuelles: digits(d.charges) } : null,
      };
      let id = initial?.id ?? "";
      if (editing && id) {
        const res = await updateMyProperty(id, input);
        if (!res.ok) { setError("La modification a échoué. Réessayez."); return; }
      } else {
        const res = await createMyProperty(input);
        if (!res.ok || !res.id) {
          setError(res.error === "non-connecte" ? "Votre session a expiré : reconnectez-vous." : "La publication a échoué. Réessayez.");
          return;
        }
        id = res.id;
      }
      /* La commission : posée, ajustée ou retirée. */
      if (d.primeOn) {
        const pr = await setMyPrime(id, terms, termsOk);
        if (!pr.ok) { setError(`L'annonce est enregistrée, mais pas la commission : ${pr.error ?? "réessayez depuis Mes biens."}`); return; }
      } else if (initialCommission) {
        await liftMyPrime(id);
      }
      try { if (!editing) localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      router.push(`/explorer/${id}?${editing ? "modifie" : "publie"}=1`);
      router.refresh();
    });
  };

  const obligations = d.reprise ? publierObligations.reprise : publierObligations[d.tx];

  return (
    <div className="mx-auto max-w-6xl">
      <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour
      </button>
      <h1 className="page-heading mt-3 text-[30px]">{editing ? "Modifier l'annonce" : "Publier un bien"}</h1>
      <p className="mt-1 text-[14px] text-muted-foreground">
        {editing ? "Les changements sont visibles dès l'enregistrement." : "Gratuit, sans commission d'agence. Comptez cinq minutes."}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {/* 1 · Le bien ────────────────────────────────────────────────── */}
          <Section n={1} title="Le bien">
            <div role="radiogroup" aria-label="Vente, location ou reprise de bail" className="grid grid-cols-3 rounded-xl border bg-subtle p-1">
              {MODES.map((m) => {
                const on = m.key === "reprise" ? d.reprise : m.key === "vente" ? d.tx === "vente" && !d.reprise : d.tx === "location-lt" && !d.reprise;
                return (
                  <button key={m.key} type="button" role="radio" aria-checked={on}
                    onClick={() => setD((s) => ({ ...s, tx: m.key === "vente" ? "vente" : "location-lt", reprise: m.key === "reprise", commission: (m.key === "vente") === (s.tx === "vente") ? s.commission : null }))}
                    className={cn("h-10 rounded-lg px-1 text-[13px] sm:text-[14px]", on ? "bg-card font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground")}>
                    {m.label}
                  </button>
                );
              })}
            </div>
            {d.reprise && (
              <div className="space-y-4 rounded-xl border bg-leman-soft/40 p-4">
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Vous quittez votre logement avant la fin du bail ? Présenter un <strong className="text-foreground">locataire de remplacement</strong> solvable
                  vous libère (art. 264 CO). Publiez-le ici, partagez le lien, et offrez une prime à qui vous trouve ce remplaçant.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Libre dès le" error={shown.availableFrom}>
                    <Input type="date" value={d.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} />
                  </Field>
                  <Field label="Régie ou gérance" hint="Facultatif — aide les candidats à préparer leur dossier.">
                    <Input value={d.regie} onChange={(e) => set("regie", e.target.value)} placeholder="Ex. Régie du Centre" />
                  </Field>
                </div>
              </div>
            )}

            <Field label="Type de bien" error={shown.type} group>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button key={t.v} type="button" aria-pressed={d.type === t.v} onClick={() => set("type", t.v)}
                    className={cn("h-9 rounded-full border px-3.5 text-[13px]", d.type === t.v ? "border-leman bg-leman-soft font-medium text-leman" : "bg-card hover:border-foreground/25")}>
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Localité" error={shown.city}>
                <Input value={d.city} onChange={(e) => set("city", e.target.value)} placeholder="Ex. Lausanne" autoComplete="address-level2" />
              </Field>
              <Field label="Rue" hint="Facultatif — vous pouvez rester vague (« quartier de la gare »).">
                <Input value={d.address} onChange={(e) => set("address", e.target.value)} placeholder="Ex. Avenue de Rumine" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={d.tx === "vente" ? "Prix de vente" : "Loyer mensuel (charges comprises)"} error={shown.price}>
                <Input value={d.price ? formatNumber(digits(d.price)) : ""} onChange={(e) => set("price", e.target.value)} inputMode="numeric" placeholder="0"
                  trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">CHF</span>} />
              </Field>
              <Field label="Surface habitable">
                <Input value={d.area} onChange={(e) => set("area", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="0"
                  trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">m²</span>} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Chambres">
                <Input value={d.bedrooms} onChange={(e) => set("bedrooms", e.target.value.replace(/[^\d]/g, "").slice(0, 2))} inputMode="numeric" placeholder="0" />
              </Field>
              <Field label="Salles d'eau">
                <Input value={d.bathrooms} onChange={(e) => set("bathrooms", e.target.value.replace(/[^\d]/g, "").slice(0, 2))} inputMode="numeric" placeholder="0" />
              </Field>
            </div>
          </Section>

          {/* 2 · Photos ─────────────────────────────────────────────────── */}
          <Section n={2} title="Photos et vidéo" aside={`${photoUrls.length}/${MAX_PHOTOS}`}>
            <p className="-mt-1 text-[13px] text-muted-foreground">La première est la couverture. Lumière du jour, pièces rangées, une photo par pièce.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((ph, i) => (
                <div key={ph.key} className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ph.url ?? ph.preview} alt="" className={cn("h-full w-full object-cover", ph.status === "uploading" && "opacity-50")} />
                  {ph.status === "uploading" && (
                    <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-foreground" aria-label="Envoi en cours" /></span>
                  )}
                  {ph.status === "error" && (
                    <span className="absolute inset-x-2 bottom-2 rounded-md bg-danger-soft px-2 py-1 text-[11px] text-[var(--danger-text)]">{ph.error}</span>
                  )}
                  {i === 0 && ph.status === "done" && (
                    <span className="absolute left-2 top-2 rounded-md bg-white/92 px-1.5 py-0.5 text-[11px] font-medium text-[#15130f]">Couverture</span>
                  )}
                  <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    {i > 0 && ph.status === "done" && (
                      <button type="button" onClick={() => makeCover(ph.key)} aria-label="Utiliser comme couverture"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/92 text-[#15130f] shadow-sm"><Star className="h-3.5 w-3.5" /></button>
                    )}
                    <button type="button" onClick={() => removePhoto(ph.key)} aria-label="Retirer la photo"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/92 text-[#15130f] shadow-sm"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed bg-card text-[13px] text-muted-foreground hover:border-foreground/30 hover:text-foreground">
                  <ImagePlus className="h-6 w-6" aria-hidden />
                  Ajouter des photos
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
              onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />

            <div className="rounded-xl border border-dashed p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Clapperboard className="h-5 w-5 text-leman" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">Vidéo de visite <span className="font-normal text-muted-foreground">(recommandé)</span></p>
                  <p className="text-[12.5px] text-muted-foreground">30 à 60 secondes filmées au téléphone, à l&apos;horizontale. Elle passe en grand en haut de l&apos;annonce. MP4 ou MOV, 50 Mo max.</p>
                </div>
                {video.status === "done" ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => setVideo({ status: "idle" })}><X className="h-4 w-4" aria-hidden /> Retirer</Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" disabled={video.status === "uploading"} onClick={() => videoRef.current?.click()}>
                    {video.status === "uploading" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Envoi…</> : "Ajouter une vidéo"}
                  </Button>
                )}
              </div>
              {video.status === "done" && video.url && (
                <video src={video.url} controls muted playsInline preload="metadata" className="mt-3 aspect-video w-full rounded-lg bg-black object-contain" />
              )}
              {video.status === "error" && <p className="mt-2 text-[12.5px] text-[var(--danger-text)]">{video.error}</p>}
              <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden"
                onChange={(e) => { void addVideo(e.target.files); e.target.value = ""; }} />
            </div>
          </Section>

          {/* 3 · L'annonce ──────────────────────────────────────────────── */}
          <Section n={3} title="L'annonce">
            <Field label="Titre" error={shown.title} hint={`${d.title.length}/90 — ce que l'on lit en premier.`}>
              <Input value={d.title} maxLength={90} onChange={(e) => set("title", e.target.value)} placeholder="Ex. 4,5 pièces lumineux avec balcon, à 5 min de la gare" />
            </Field>
            <Field label="Description" hint={`${d.description.trim().length} caractères${d.description.trim().length < 250 ? " — visez 250 au moins" : ""}`}>
              <textarea value={d.description} onChange={(e) => set("description", e.target.value)} rows={7} maxLength={5000}
                placeholder="L'agencement, la luminosité, l'état, le quartier, les transports, les charges…"
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[14px] leading-relaxed shadow-xs outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus:border-leman" />
            </Field>
            <button type="button" onClick={askCopilot} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-leman hover:underline">
              <Sparkles className="h-4 w-4" aria-hidden /> Rédiger avec le copilote
            </button>
            <Field label="Équipements" group>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const on = d.amenities.includes(a);
                  return (
                    <button key={a} type="button" aria-pressed={on}
                      onClick={() => set("amenities", on ? d.amenities.filter((x) => x !== a) : [...d.amenities, a])}
                      className={cn("h-8 rounded-full border px-3 text-[12.5px]", on ? "border-leman bg-leman-soft font-medium text-leman" : "bg-card hover:border-foreground/25")}>
                      {a}
                    </button>
                  );
                })}
              </div>
            </Field>
            {d.tx === "vente" && (
              <Field label="Charges annuelles (PPE)" hint="Facultatif. Une information que les acheteurs demandent toujours.">
                <Input value={d.charges ? formatNumber(digits(d.charges)) : ""} onChange={(e) => set("charges", e.target.value)} inputMode="numeric" placeholder="0"
                  trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">CHF / an</span>} containerClassName="sm:max-w-xs" />
              </Field>
            )}
          </Section>

          {/* 4 · Commission d'apport ────────────────────────────────────── */}
          <Section n={4} title="Commission pour les apporteurs" aside="Recommandé" prime>
            <p className="-mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
              Chaque apporteur reçoit un lien personnel tracé vers votre annonce. S&apos;il vous amène l&apos;{d.reprise ? "repreneur" : d.tx === "vente" ? "acheteur" : "locataire"},
              la commission est calculée et suivie automatiquement. <strong className="text-foreground">Sans vente, rien n&apos;est dû.</strong>
            </p>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={d.primeOn} onChange={(e) => set("primeOn", e.target.checked)} className="h-4.5 w-4.5 accent-[var(--laiton)]" />
              <span className="text-[14px] font-medium">Proposer une commission sur ce bien</span>
            </label>
            {d.primeOn && (
              <div className="rounded-xl border border-laiton-border bg-laiton-soft/50 p-4">
                <CommissionEditor tx={d.tx} price={price} value={terms} onChange={(t) => set("commission", t)} accepted={termsOk} onAccept={setTermsOk} />
                {shown.prime && <span data-field-error className="mt-2 block text-[12px] font-medium text-[var(--danger-text)]">{shown.prime}</span>}
              </div>
            )}
          </Section>

          {/* 5 · Publication ────────────────────────────────────────────── */}
          <Section n={5} title={obligations.title}>
            <ul className="space-y-2.5">
              {obligations.obligations.map((o) => (
                <li key={o.label} className="rounded-xl border bg-card p-3.5">
                  <p className="text-[13.5px] font-semibold">{o.label}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{o.body}</p>
                </li>
              ))}
            </ul>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={attest} onChange={(e) => setAttest(e.target.checked)} className="mt-0.5 h-4.5 w-4.5 accent-[var(--leman)]" />
              <span className="text-[13.5px] leading-snug">
                J&apos;atteste {d.reprise ? "être le locataire actuel de ce logement" : `être en droit de ${d.tx === "vente" ? "vendre" : "louer"} ce bien`}, que les informations sont exactes, et
                j&apos;accepte les <a href="/conditions" className="text-leman underline underline-offset-2">conditions d&apos;utilisation</a>.
              </span>
            </label>
            {tried && !attest && (
              <span data-field-error className="block text-[12px] font-medium text-[var(--danger-text)]">
                Cette attestation est nécessaire pour publier.
              </span>
            )}
          </Section>

          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-[13.5px] text-[var(--danger-text)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button size="lg" onClick={submit} disabled={uploading || isPending} className="sm:min-w-[220px]">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {editing ? "Enregistrer les modifications" : "Publier le bien"}
            </Button>
            <p className="text-[12.5px] text-muted-foreground">
              {uploading
                ? "Envoi des photos en cours…"
                : !valid
                  ? `À compléter : ${Object.values(errors)[0]}`
                  : !attest
                    ? "Cochez l'attestation pour publier."
                    : editing ? "Prêt à enregistrer." : "Prêt : votre annonce sera en ligne immédiatement."}
            </p>
          </div>
        </div>

        {/* ── Aperçu en direct + qualité ─────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <p className="eyebrow mb-3">Aperçu dans l&apos;Explorer</p>
            <div className="pointer-events-none">
              <ListingCard p={preview} />
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold">Qualité de l&apos;annonce</p>
              <span className="text-[12.5px] tabular-nums text-muted-foreground">{qualityScore}/{quality.length}</span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
              <div className="h-full rounded-full bg-leman transition-[width]" style={{ width: `${(qualityScore / quality.length) * 100}%` }} />
            </div>
            <ul className="mt-3 space-y-1.5">
              {quality.map((q) => (
                <li key={q.label} className={cn("flex items-center gap-2 text-[13px]", q.ok && "text-muted-foreground")}>
                  {q.ok
                    ? <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-leman text-white dark:text-[#0d1513]"><Check className="h-3 w-3" aria-hidden /></span>
                    : <Circle className="h-4.5 w-4.5 text-muted-foreground/60" aria-hidden />}
                  {q.label}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-muted-foreground">Une annonce complète reçoit plus de demandes.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ n, title, aside, prime = false, children }: { n: number; title: string; aside?: string; prime?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6" aria-labelledby={`sec-${n}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-[12.5px] font-semibold",
          prime ? "border border-laiton-border bg-laiton-soft text-laiton" : "bg-subtle")}>
          {prime ? <Coins className="h-3.5 w-3.5" aria-hidden /> : n}
        </span>
        <h2 id={`sec-${n}`} className="flex-1 text-[16px] font-semibold tracking-[-0.01em]">{title}</h2>
        {aside && <span className="text-[12.5px] text-muted-foreground">{aside}</span>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* Un champ libellé. `group` : pour un ensemble de boutons (types, équipements)
   — un <label> englobant ferait basculer le premier bouton au moindre clic. */
function Field({
  label, hint, error, group = false, children,
}: { label: string; hint?: string; error?: string; group?: boolean; children: React.ReactNode }) {
  const note = error ? (
    <span data-field-error className="mt-1 block text-[12px] font-medium text-[var(--danger-text)]">{error}</span>
  ) : hint ? (
    <span className="mt-1 block text-[12px] text-muted-foreground">{hint}</span>
  ) : null;
  if (group) {
    return (
      <div role="group" aria-label={label}>
        <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
        {children}
        {note}
      </div>
    );
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
      {children}
      {note}
    </label>
  );
}
