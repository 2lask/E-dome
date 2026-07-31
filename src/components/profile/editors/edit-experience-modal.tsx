"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/context";
import { experienceSchema } from "@/lib/profile-schema";
import { EMPLOYMENT_TYPE_LABELS, newId, type Experience, type EmploymentType } from "@/lib/profile-types";
import { ModalShell } from "./modal-shell";
import { Field, TextInput, TextArea, SelectInput, MonthYearPicker, Toggle, zodErrors } from "./fields";

/* Créer (initial absent) ou éditer une expérience. Écrit l'array complet via
   updateProfile({ experiences: [...] }). */
export function EditExperienceModal({
  initial,
  onClose,
}: {
  initial?: Experience;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useApp();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">(initial?.employmentType ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [current, setCurrent] = useState(initial?.current ?? false);
  const [startMonth, setStartMonth] = useState<number | undefined>(initial?.startMonth);
  const [startYear, setStartYear] = useState<number | undefined>(initial?.startYear);
  const [endMonth, setEndMonth] = useState<number | undefined>(initial?.endMonth);
  const [endYear, setEndYear] = useState<number | undefined>(initial?.endYear);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitted, setSubmitted] = useState(false);

  const values = {
    title,
    company,
    employmentType: employmentType || undefined,
    location,
    current,
    startMonth,
    startYear,
    endMonth: current ? undefined : endMonth,
    endYear: current ? undefined : endYear,
    description,
  };
  const errors = useMemo(() => zodErrors(experienceSchema, values), [
    title, company, employmentType, location, current, startMonth, startYear, endMonth, endYear, description,
  ]);
  const show = (k: string) => (submitted ? errors[k] : undefined);

  const save = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    const item: Experience = {
      id: initial?.id ?? newId("exp"),
      title: title.trim(),
      company: company.trim(),
      employmentType: (employmentType || undefined) as EmploymentType | undefined,
      location: location.trim() || undefined,
      current,
      startMonth: startMonth!,
      startYear: startYear!,
      endMonth: current ? undefined : endMonth,
      endYear: current ? undefined : endYear,
      description: description.trim() || undefined,
    };
    const list = initial
      ? profile.experiences.map((e) => (e.id === initial.id ? item : e))
      : [item, ...profile.experiences];
    updateProfile({ experiences: list });
    onClose();
  };

  const remove = () => {
    if (!initial) return;
    updateProfile({ experiences: profile.experiences.filter((e) => e.id !== initial.id) });
    onClose();
  };

  return (
    <ModalShell
      title={initial ? "Modifier l'expérience" : "Ajouter une expérience"}
      onClose={onClose}
      onSubmit={save}
      onDelete={initial ? remove : undefined}
    >
      <Field label="Intitulé du poste" required error={show("title")}>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} error={!!show("title")} placeholder="Ex : Investisseur immobilier" />
      </Field>

      <Field label="Entreprise" required error={show("company")}>
        <TextInput value={company} onChange={(e) => setCompany(e.target.value)} error={!!show("company")} placeholder="Ex : E-Dome" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Type d'emploi">
          <SelectInput value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType | "")}>
            <option value="">—</option>
            {(Object.keys(EMPLOYMENT_TYPE_LABELS) as EmploymentType[]).map((t) => (
              <option key={t} value={t}>{EMPLOYMENT_TYPE_LABELS[t]}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Lieu">
          <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lausanne, Suisse" />
        </Field>
      </div>

      <Toggle checked={current} onChange={setCurrent} label="J'occupe actuellement ce poste" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date de début" required error={show("startYear") || show("startMonth")}>
          <MonthYearPicker month={startMonth} year={startYear} onMonth={setStartMonth} onYear={setStartYear} />
        </Field>
        <Field label="Date de fin" error={show("endYear") || show("endMonth")} hint={current ? "Poste en cours" : undefined}>
          <MonthYearPicker month={endMonth} year={endYear} onMonth={setEndMonth} onYear={setEndYear} disabled={current} />
        </Field>
      </div>

      <Field label="Description" counter={{ value: description.length, max: 2000 }}>
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Missions, réalisations, résultats…" />
      </Field>
    </ModalShell>
  );
}
