import { servicesText } from "@/content/services";

/* Étoiles + note dérivée des avis. Sans avis : « Nouveau », jamais
   « 0 (0 avis) ». Partagé par les pôles Services et Formations. */

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width={size}
          height={size}
          className={s <= Math.round(rating) ? "text-amber-400" : "text-[var(--text-muted)] opacity-40"}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export function RatingLine({ summary, className = "" }: { summary: { average: number; count: number } | null; className?: string }) {
  if (!summary) {
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-medium ${className}`}>
        {servicesText.rating.new}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] ${className}`}>
      <Stars rating={summary.average} />
      <span className="tabular-nums text-[var(--text-secondary)]">{summary.average.toFixed(1)}</span>
      <span>({servicesText.rating.reviews(summary.count)})</span>
    </span>
  );
}
