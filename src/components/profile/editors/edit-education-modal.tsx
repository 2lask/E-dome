"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/context";
import { educationSchema } from "@/lib/profile-schema";
import { newId, type Education } from "@/lib/profile-types";
import { ModalShell } from "./modal-shell";
import { Field, TextInput, TextArea, SelectInput, zodErrors } from "./fields";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR + 4 - i);

/* Créer ou éditer une formation / un diplôme. */
export function EditEducationModal({
  initial,
  onClose,
}: {
  initial?: Education;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useApp();
  const [school, setSchool] = useState(initial?.school ?? "");
  const [degree, setDegree] = useState(initial?.degree ?? "");
  const [field, setField] = useState(initial?.field ?? "");
  const [startYear, setStartYear] = useState<number | undefined>(initial?.startYear);
  const [endYear, setEndYear] = useState<number | undefined>(initial?.endYear);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitted, setSubmitted] = useState(false);

  const values = { school, degree, field, startYear, endYear, description };
  const errors = useMemo(() => zodErrors(educationSchema, values), [school, degree, field, startYear, endYear, description]);
  const show = (k: string) => (submitted ? errors[k] : undefined);

  const save = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    const item: Education = {
      id: initial?.id ?? newId("edu"),
      school: school.trim(),
      degree: degree.trim() || undefined,
      field: field.trim() || undefined,
      startYear,
      endYear,
      description: description.trim() || undefined,
    };
    const list = initial
      ? profile.education.map((e) => (e.id === initial.id ? item : e))
      : [item, ...profile.education];
    updateProfile({ education: list });
    onClose();
  };

  const remove = () => {
    if (!initial) return;
    updateProfile({ education: profile.education.filter((e) => e.id !== initial.id) });
    onClose();
  };

  return (
    <ModalShell
      title={initial ? "Modifier la formation" : "Ajouter une formation"}
      onClose={onClose}
      onSubmit={save}
      onDelete={initial ? remove : undefined}
    >
      <Field label="Établissement" required error={show("school")}>
        <TextInput value={school} onChange={(e) => setSchool(e.target.value)} error={!!show("school")} placeholder="Ex : HEC Lausanne (UNIL)" />
      </Field>
      <Field label="Diplôme">
        <TextInput value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Ex : Master en finance" />
      </Field>
      <Field label="Domaine d'étude">
        <TextInput value={field} onChange={(e) => setField(e.target.value)} placeholder="Ex : Finance & immobilier" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Année de début">
          <SelectInput value={startYear ?? ""} onChange={(e) => setStartYear(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">—</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </SelectInput>
        </Field>
        <Field label="Année de fin" error={show("endYear")}>
          <SelectInput value={endYear ?? ""} error={!!show("endYear")} onChange={(e) => setEndYear(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">—</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </SelectInput>
        </Field>
      </div>
      <Field label="Description" counter={{ value: description.length, max: 1200 }}>
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Spécialisation, distinctions, activités…" />
      </Field>
    </ModalShell>
  );
}
