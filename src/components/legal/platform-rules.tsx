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
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {PLATFORM_RULES.map((rule, i) => (
        <div
          key={rule.id}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[11px] font-semibold text-[var(--primary)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[13.5px] font-semibold text-[var(--foreground)]">{rule.short}</h3>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--text-muted)]">{rule.full}</p>
          <p className="mt-2 text-[11px] italic leading-snug text-[var(--text-muted)]">{rule.basis}</p>
        </div>
      ))}
    </div>
  );
}
