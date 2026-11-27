/* ── Squelette de l'Explorer ─────────────────────────────────────────────────
   Affiché pendant la lecture des biens (Suspense dans /explorer). Il reprend
   la silhouette exacte de la page : en-tête, barre de filtres, cartes.
   Pulsation par opacité seule ; immobile si l'utilisateur réduit les
   animations. */

function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-foreground/[0.07] motion-reduce:animate-none ${className}`} />;
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-foreground/[0.06] motion-reduce:animate-none" />
      <div className="space-y-2.5 px-4 pb-4 pt-3.5">
        <Block className="h-4 w-3/4" />
        <Block className="h-3 w-1/3" />
        <div className="flex gap-3 border-t pt-3">
          <Block className="h-3 w-14" />
          <Block className="h-3 w-12" />
          <Block className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ExplorerSkeleton() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement des biens…</span>
      <div className="cine relative overflow-hidden rounded-[28px] border border-white/10 px-6 py-9 md:px-10 md:py-12">
        <div aria-hidden className="cine-aurora" />
        <div className="relative space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
          <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-white/10 motion-reduce:animate-none" />
          <div className="h-4 w-64 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
          <div className="h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-white/[0.08] motion-reduce:animate-none" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {["w-32", "w-24", "w-28", "w-36", "w-24"].map((w, i) => (
          <Block key={i} className={`h-11 rounded-full ${w}`} />
        ))}
      </div>
      <Block className="mt-7 h-3 w-24" />
      <div className="mt-4 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => <ListingCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
