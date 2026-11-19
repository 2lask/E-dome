import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Wallet, BedDouble, MapPin, ShieldCheck, Coins } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getSearch, listMySearches } from "@/lib/supabase/search-actions";
import { AnswerForm } from "@/components/recherches/answer-form";
import { CloseSearchButton } from "@/components/recherches/close-search-button";
import { ShareButton } from "@/components/listing/share-button";
import { Button } from "@/components/ui/button";
import { apporteurNetChf, frDay } from "@/lib/my-property";
import { initialsAvatar } from "@/lib/current-user-profile";
import { formatNumber } from "@/lib/format";
import { KIND_LABEL, searchTitle } from "@/lib/recherches";

/* ── /recherches/[id] — une recherche à récompense ───────────────────────────
   La récompense, ce qui est cherché, qui cherche — et le formulaire pour
   proposer. Partageable : l'aperçu (opengraph-image) affiche la récompense. */

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = await getSearch((await params).id);
  if (!s) return { title: "Recherche introuvable" };
  return {
    title: `${searchTitle(s)} — récompense ${formatNumber(s.rewardChf)} CHF`,
    description: s.description.slice(0, 160),
  };
}

export default async function RecherchePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ publie?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [s, user] = await Promise.all([getSearch(id), getCurrentUser()]);
  if (!s) notFound();
  const isAuthor = !!user && user.id === s.author.id;
  const answers = isAuthor ? (await listMySearches()).find((m) => m.id === s.id)?.answersCount ?? 0 : 0;
  const [first, ...rest] = s.author.name.split(" ");
  const avatar = s.author.avatar || initialsAvatar(first ?? "", rest.join(" "));
  const title = searchTitle(s);

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/recherches" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Recherches
      </Link>

      {isAuthor && (
        <div role={sp.publie ? "status" : undefined} className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border bg-leman-soft/60 px-4 py-3 text-[13px]">
          <ShieldCheck className="h-4 w-4 text-leman" aria-hidden />
          <p className="flex-1">
            <strong>{sp.publie ? "Votre recherche est en ligne. " : "C'est votre recherche. "}</strong>
            {answers} proposition{answers > 1 ? "s" : ""} reçue{answers > 1 ? "s" : ""} — à décider dans vos Demandes. Partagez-la : plus elle circule, plus vite vous trouvez.
          </p>
          <Button asChild size="sm" variant="outline"><Link href="/demandes">Demandes</Link></Button>
          {s.active && <CloseSearchButton id={s.id} />}
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="eyebrow">{KIND_LABEL[s.kind]}{s.active ? "" : " · close"}</p>
            <ShareButton
              path={`/recherches/${s.id}`}
              title={title}
              text={`${s.kind === "vendeurs" ? "Recherche de vendeurs" : "Je cherche un logement"} à ${s.city} — récompense de ${formatNumber(s.rewardChf)} CHF à qui m'aide`}
            />
          </div>
          <h1 className="page-heading mt-2 text-[30px] sm:text-[34px]">{title}</h1>
          <ul className="mt-4 flex flex-wrap gap-2 text-[13px]">
            <li className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5"><MapPin className="h-4 w-4 text-muted-foreground" aria-hidden />{[s.area, s.city].filter(Boolean).join(", ")}</li>
            {s.budgetMax ? <li className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5"><Wallet className="h-4 w-4 text-muted-foreground" aria-hidden />max CHF {formatNumber(s.budgetMax)}{s.kind === "logement" && s.transaction === "location" ? " / mois" : ""}</li> : null}
            {s.roomsMin ? <li className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5"><BedDouble className="h-4 w-4 text-muted-foreground" aria-hidden />{s.roomsMin} pièces et +</li> : null}
            {s.neededBy ? <li className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5"><CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />avant le {frDay(s.neededBy)}</li> : null}
          </ul>
          <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">{s.description}</p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-card p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div><p className="text-[14px] font-medium">{s.author.name}</p><p className="text-[12.5px] text-muted-foreground">Membre E-Dome</p></div>
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
            La récompense est fixée par l&apos;auteur et due quand il accepte une proposition — jamais un pourcentage, jamais
            avant. E-Dome ne négocie rien et ne représente personne.
          </p>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-laiton-border bg-laiton-soft/70 p-5">
            <div className="flex items-center gap-2"><Coins className="h-4 w-4 text-laiton" aria-hidden /><p className="text-[13px] font-semibold text-laiton">Récompense</p></div>
            <p className="mt-1 text-[30px] font-semibold tabular-nums tracking-[-0.02em] text-laiton">{formatNumber(s.rewardChf)} CHF</p>
            <p className="text-[13px] text-muted-foreground">Vous touchez <strong className="tabular-nums text-foreground">{formatNumber(apporteurNetChf(s.rewardChf))} CHF</strong> net si votre proposition est acceptée.</p>
          </div>
          {!isAuthor && s.active && (
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="mb-3 text-[15px] font-semibold">{s.kind === "vendeurs" ? "Vous connaissez un vendeur ?" : "Vous connaissez un logement ?"}</p>
              {user ? (
                <AnswerForm searchId={s.id} kind={s.kind} />
              ) : (
                <>
                  <p className="text-[13px] text-muted-foreground">Créez un compte gratuit pour proposer et toucher la récompense.</p>
                  <Button asChild className="mt-3 w-full"><Link href={`/auth/inscription?redirect=${encodeURIComponent(`/recherches/${s.id}`)}`}>Proposer</Link></Button>
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
