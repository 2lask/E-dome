import { PLATFORM_RULES } from "@/lib/model/rules";

/* ── Les quatre règles, ensemble ────────────────────────────────────────────

   Ce composant affiche `PLATFORM_RULES` en entier, toujours. Il n'a PAS de
   prop pour choisir une règle ou un sous-ensemble : c'est volontaire, et c'est
   la traduction en code de la réserve du fondateur sur D1.

   La règle 3 seule — « aucune rémunération conditionnée à une vente » — couvre
   la conditionnalité (art. 413 CO), pas l'activité (art. 412). Un forfait non
   conditionné versé à un intermédiaire reste du courtage. Les règles 1 (aucun
   mandat) et 2 (aucune négociation) portent le critère d'activité ; sans
   elles, la 3 ne protège de rien. Elles doivent donc apparaître au même rang,
   et la seule façon d'en être sûr est qu'aucun appelant ne puisse en retirer.

   Deux densités, `full` et `compact` — mais les quatre règles dans les deux. */

export function PlatformRules({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <ul className={`space-y-1 ${className}`}>
        {PLATFORM_RULES.map((rule) => (
          <li key={rule.id} className="flex gap-2 text-[12.5px] leading-snug text-[var(--text-muted)]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]" aria-hidden />
            <span>{rule.short}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {PLATFORM_RULES.map((rule, i) => (
        <div
          key={rule.id}
          className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card p-5 transition-colors hover:border-laiton-border sm:p-6"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[96px] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.05] transition-colors group-hover:text-laiton/15"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="relative flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft font-mono text-[12px] font-semibold text-laiton">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-foreground">{rule.short}</h3>
          </div>
          <p className="relative mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">{rule.full}</p>
          <p className="relative mt-4 border-t pt-3 text-[12px] italic leading-snug text-muted-foreground">{rule.basis}</p>
        </div>
      ))}
    </div>
  );
}
