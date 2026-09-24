"use client";

import React from "react";
import { SECTIONS, conditionsMeta } from "@/content/conditions";

/* ── /conditions ────────────────────────────────────────────────────────────

   Le contenu — treize sections, les quatre règles en §2, le barème généré —
   vit dans `src/content/conditions.ts`. Cette page ne fait que le disposer. */

export default function ConditionsPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Demo disclaimer */}
      <div className="p-4 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/5 text-xs text-[var(--text-secondary)] leading-relaxed">
        <span className="mr-1">&#9888;&#65039;</span>
        {conditionsMeta.disclaimer}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl page-heading text-[var(--foreground)]">{conditionsMeta.title}</h1>
        <p className="text-[var(--text-secondary)]">{conditionsMeta.updated}</p>
      </div>

      {/* Table of contents */}
      <nav className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2">
        <h2 className="font-semibold text-[var(--foreground)] mb-3">{conditionsMeta.tocTitle}</h2>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="block text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition text-left"
          >
            {s.title}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{s.title}</h2>
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{s.content}</div>
            {s.table && (
              <div className="rounded-lg border border-[var(--card-border)] overflow-x-auto my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--card)]">
                      {s.table[0].map((h, i) => (
                        <th key={i} className="text-left p-3 text-[var(--text-muted)] font-medium border-b border-[var(--card-border)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.slice(1).map((row, ri) => (
                      <tr key={ri} className="border-b border-[var(--card-border)] last:border-0">
                        {row.map((cell, ci) => (
                          <td key={ci} className="p-3 text-[var(--foreground)]">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.contentAfter && (
              <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{s.contentAfter}</div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
