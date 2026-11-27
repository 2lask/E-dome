"use client";

import { useEffect, useState } from "react";

/* ── Sommaire collant ────────────────────────────────────────────────────────
   Des ancres ordinaires (fonctionnent sans JavaScript) ; une fois hydraté, la
   section visible est mise en évidence (aria-current). */

export function TocNav({
  items,
  label,
  title,
  numbered = false,
}: {
  items: { id: string; label: string }[];
  label: string;
  title?: string;
  numbered?: boolean;
}) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label={label}>
      {title && <p className="mb-3 px-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>}
      <ul className="relative space-y-0.5 border-l border-border">
        {items.map((it, i) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={`relative -ml-px flex min-h-[44px] items-center gap-2.5 border-l-2 py-2 pl-4 pr-3 text-[13.5px] leading-snug transition-colors ${
                  on ? "border-laiton font-medium text-foreground" : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {numbered && <span className={`font-mono text-[11px] tabular-nums ${on ? "text-laiton" : "text-muted-foreground/70"}`}>{String(i + 1).padStart(2, "0")}</span>}
                <span>{it.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
