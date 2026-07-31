"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useApp } from "@/lib/context";
import { linkSchema } from "@/lib/profile-schema";
import { LINK_TYPE_LABELS, newId, type LinkType, type ProfileLink } from "@/lib/profile-types";
import { ModalShell } from "./modal-shell";
import { Field, TextInput, SelectInput, zodErrors } from "./fields";

/* Gère la liste des liens (site, réseaux, portfolio). Ajout formulaire +
   liste supprimable. */
export function EditLinksModal({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useApp();
  const [links, setLinks] = useState<ProfileLink[]>(profile.links);
  const [type, setType] = useState<LinkType>("website");
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [touched, setTouched] = useState(false);

  const errors = zodErrors(linkSchema, { type, url, label });
  const urlError = touched ? errors.url : undefined;

  const add = () => {
    setTouched(true);
    if (Object.keys(errors).length > 0) return;
    setLinks((prev) => [...prev, { id: newId("ln"), type, url: url.trim(), label: label.trim() || undefined }]);
    setUrl("");
    setLabel("");
    setTouched(false);
  };

  const remove = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));

  const save = () => {
    updateProfile({ links });
    onClose();
  };

  return (
    <ModalShell
      title="Modifier les liens"
      subtitle="Site web, réseaux sociaux, portfolio…"
      onClose={onClose}
      onSubmit={save}
    >
      <div className="rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] p-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <SelectInput value={type} onChange={(e) => setType(e.target.value as LinkType)}>
              {(Object.keys(LINK_TYPE_LABELS) as LinkType[]).map((t) => (
                <option key={t} value={t}>{LINK_TYPE_LABELS[t]}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Libellé (optionnel)">
            <TextInput value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e-dome.ch" />
          </Field>
        </div>
        <Field label="URL" required error={urlError}>
          <TextInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            error={!!urlError}
            placeholder="https://…"
          />
        </Field>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Ajouter le lien
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-2 text-center">Aucun lien pour l'instant.</p>
      ) : (
        <ul className="space-y-1.5">
          {links.map((l) => (
            <li key={l.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--card-border)]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)] w-20 shrink-0">
                {LINK_TYPE_LABELS[l.type]}
              </span>
              <span className="text-sm text-[var(--foreground)] flex-1 truncate">{l.label || l.url}</span>
              <button type="button" onClick={() => remove(l.id)} aria-label="Supprimer" className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </ModalShell>
  );
}
