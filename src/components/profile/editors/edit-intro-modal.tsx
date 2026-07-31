"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/context";
import { introSchema } from "@/lib/profile-schema";
import { ModalShell } from "./modal-shell";
import { Field, TextInput, zodErrors } from "./fields";

/* Édition de l'identité : prénom, nom, titre professionnel, localisation.
   La photo et la bannière ont leur propre modale (edit-image-modal). */
export function EditIntroModal({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useApp();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [headline, setHeadline] = useState(profile.headline);
  const [city, setCity] = useState(profile.location.city);
  const [country, setCountry] = useState(profile.location.country);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const values = { firstName, lastName, headline, city, country };
  const errors = useMemo(() => zodErrors(introSchema, values), [firstName, lastName, headline, city, country]);
  const show = (k: string) => (touched[k] || submitted ? errors[k] : undefined);
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const save = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      headline: headline.trim(),
      location: { city: city.trim(), country: country.trim() },
    });
    onClose();
  };

  return (
    <ModalShell title="Modifier l'introduction" onClose={onClose} onSubmit={save}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" required error={show("firstName")}>
          <TextInput value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => touch("firstName")} error={!!show("firstName")} />
        </Field>
        <Field label="Nom" required error={show("lastName")}>
          <TextInput value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => touch("lastName")} error={!!show("lastName")} />
        </Field>
      </div>

      <Field
        label="Titre professionnel"
        hint="Ex : Investisseur & formateur immobilier"
        error={show("headline")}
        counter={{ value: headline.length, max: 160 }}
      >
        <TextInput
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          onBlur={() => touch("headline")}
          error={!!show("headline")}
          placeholder="Votre accroche professionnelle"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ville" error={show("city")}>
          <TextInput value={city} onChange={(e) => setCity(e.target.value)} onBlur={() => touch("city")} error={!!show("city")} placeholder="Lausanne" />
        </Field>
        <Field label="Pays" error={show("country")}>
          <TextInput value={country} onChange={(e) => setCountry(e.target.value)} onBlur={() => touch("country")} error={!!show("country")} placeholder="Suisse" />
        </Field>
      </div>
    </ModalShell>
  );
}
