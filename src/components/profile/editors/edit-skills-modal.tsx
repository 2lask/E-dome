"use client";

import { useState } from "react";
import { X, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useApp } from "@/lib/context";
import { skillSchema } from "@/lib/profile-schema";
import { newId, type Skill } from "@/lib/profile-types";
import { ModalShell } from "./modal-shell";
import { Field, TextInput } from "./fields";

/* Gère toute la liste des compétences : ajout, suppression et priorisation
   (monter/descendre — l'ordre est celui affiché sur le profil). */
export function EditSkillsModal({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useApp();
  const [skills, setSkills] = useState<Skill[]>(profile.skills);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();

  const add = () => {
    const parsed = skillSchema.safeParse({ name: draft });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    const name = parsed.data.name;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setError("Cette compétence existe déjà");
      return;
    }
    setSkills((prev) => [...prev, { id: newId("sk"), name }]);
    setDraft("");
    setError(undefined);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= skills.length) return;
    setSkills((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const remove = (id: string) => setSkills((prev) => prev.filter((s) => s.id !== id));

  const save = () => {
    updateProfile({ skills });
    onClose();
  };

  return (
    <ModalShell
      title="Modifier les compétences"
      subtitle="Ajoutez vos savoir-faire et classez-les par ordre d'importance."
      onClose={onClose}
      onSubmit={save}
    >
      <Field label="Ajouter une compétence" error={error}>
        <div className="flex gap-2">
          <TextInput
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setError(undefined); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            error={!!error}
            placeholder="Ex : Investissement locatif"
            maxLength={60}
          />
          <button
            type="button"
            onClick={add}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </Field>

      {skills.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-4 text-center">Aucune compétence pour l'instant.</p>
      ) : (
        <ul className="space-y-1.5">
          {skills.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]">
              <span className="text-xs tabular-nums text-[var(--text-muted)] w-4">{i + 1}</span>
              <span className="text-sm text-[var(--foreground)] flex-1 truncate">{s.name}</span>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter" className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] disabled:opacity-30 transition-colors">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === skills.length - 1} aria-label="Descendre" className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] disabled:opacity-30 transition-colors">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => remove(s.id)} aria-label="Supprimer" className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </ModalShell>
  );
}
