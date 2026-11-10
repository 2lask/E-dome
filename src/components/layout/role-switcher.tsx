"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { personaPicker } from "@/content/roles";
import { personaGroups } from "@/lib/demo/actors";
import { incarnate } from "@/lib/use-session";
import { useActor } from "@/lib/use-actor";
import { cn } from "@/lib/utils";

/* ── « Entrer dans la peau de… » — le sélecteur de personne (chantier P3) ───

   On ne visite plus la plateforme en tant que rôle : on EST une des seize
   personnes de l'annuaire (DECISIONS-2 §D2). Le sélecteur les liste avec leur
   photo, leur nom et une ligne (rôle · ville), rangées par ce qu'elles font.
   Choisir quelqu'un l'incarne (`incarnate`, mémorisé) et ouvre SON tableau de
   bord : messagerie, notifications, navigation et actions suivent.

   Le déclencheur dit clairement qui l'on est : « Vous êtes Céline Bovard ·
   agente immobilière à Lutry — changer ». Au rendu serveur, c'est toujours
   Léo ; la personne mémorisée n'apparaît qu'après l'hydratation. */

export function PersonaSwitcher() {
  const actor = useActor();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => personaGroups(), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: string) => {
    setOpen(false);
    if (id === actor.id) return;
    incarnate(id);
    router.push("/dashboard");
  };

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${personaPicker.youAre} ${actor.name}, ${actor.legend}. ${personaPicker.title}`}
        data-testid="persona-switcher"
        className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] py-0.5 pl-0.5 pr-2 text-left transition-colors hover:border-[var(--primary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
      >
        <img src={actor.avatar} alt="" className="h-6 w-6 shrink-0 rounded-md object-cover" />
        <span className="min-w-0 truncate text-[12px] text-[var(--text-muted)]">
          <span className="hidden sm:inline">{personaPicker.youAre} </span>
          <span className="font-semibold text-[var(--foreground)]">
            <span className="sm:hidden">{actor.firstName}</span>
            <span className="hidden sm:inline">{actor.name}</span>
          </span>
          <span className="hidden lg:inline"> · {actor.legend}</span>
          <span className="text-[var(--primary)] underline underline-offset-2"> — {personaPicker.change}</span>
        </span>
        <ChevronsUpDown size={13} className="shrink-0 text-[var(--text-muted)]" aria-hidden />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={personaPicker.title}
          className="absolute right-0 top-full z-50 mt-2 max-h-[75vh] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1.5 shadow-xl"
        >
          <p className="px-2 pt-1.5 text-[13px] font-semibold text-[var(--foreground)]">{personaPicker.title}</p>
          <p className="px-2 pb-1.5 pt-0.5 text-[11px] leading-snug text-[var(--text-muted)]">{personaPicker.hint}</p>
          {groups.map((g) => (
            <div key={g.group} className="mt-1" role="group" aria-label={g.label}>
              <p className="px-2 pb-0.5 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {g.label}
              </p>
              {g.people.map((p) => {
                const active = p.id === actor.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(p.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50",
                      active ? "bg-[var(--primary)]/[0.07]" : "hover:bg-[var(--hover-bg)]",
                    )}
                  >
                    <img src={p.avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-semibold text-[var(--foreground)]">{p.name}</span>
                        {active && <Check size={13} className="shrink-0 text-[var(--primary)]" aria-hidden />}
                      </span>
                      <span className="block truncate text-[11.5px] text-[var(--text-muted)]">{p.line}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
