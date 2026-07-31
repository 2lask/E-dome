"use client";

import { ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import type { Profile } from "@/lib/profile-types";
import { computeProfileCompletion } from "@/lib/profile-schema";
import { editorForAction, type OpenEditor } from "./editor-types";

/* Carte « Profil complété à X% » (owner uniquement). Anneau de progression +
   liste des éléments manquants ; chaque item route vers la bonne modale via
   editorForAction(). Une fois à 100 %, affiche un état de félicitation. */
export function ProfileCompletion({
  profile,
  open,
}: {
  profile: Profile;
  open: OpenEditor;
}) {
  const { percent, missing } = computeProfileCompletion(profile);
  const complete = percent >= 100;

  // Anneau SVG.
  const R = 26;
  const C = 2 * Math.PI * R;
  const dash = (percent / 100) * C;

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
          <svg width={64} height={64} className="-rotate-90">
            <circle cx={32} cy={32} r={R} fill="none" stroke="var(--hover-bg)" strokeWidth={6} />
            <circle
              cx={32}
              cy={32}
              r={R}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              style={{ transition: "stroke-dasharray 500ms ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--foreground)] tabular-nums">
            {percent}%
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--foreground)] inline-flex items-center gap-1.5">
            {complete ? <CheckCircle2 size={18} className="text-[var(--success)]" /> : <Sparkles size={16} className="text-[var(--primary)]" />}
            {complete ? "Profil complet" : "Renforcez votre profil"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {complete
              ? "Beau travail — votre profil inspire confiance."
              : "Complétez ces éléments pour un profil plus convaincant."}
          </p>
        </div>
      </div>

      {!complete && missing.length > 0 && (
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {missing.slice(0, 4).map((item) => (
            <li key={item.key}>
              <button
                onClick={() => open(editorForAction(item.action))}
                className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl border border-[var(--card-border)] hover:border-[var(--primary)]/50 hover:bg-[var(--hover-bg)] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.label}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{item.hint}</p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-[var(--text-muted)]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
