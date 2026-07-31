"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/context";
import { aboutSchema } from "@/lib/profile-schema";
import { ModalShell } from "./modal-shell";
import { Field, TextArea, zodErrors } from "./fields";

/* Édition de la section « À propos » (résumé long). */
export function EditAboutModal({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useApp();
  const [about, setAbout] = useState(profile.about);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => zodErrors(aboutSchema, { about }), [about]);
  const error = submitted ? errors.about : undefined;

  const save = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    updateProfile({ about: about.trim() });
    onClose();
  };

  return (
    <ModalShell
      title="Modifier À propos"
      subtitle="Présentez votre parcours, vos spécialités et ce qui vous distingue."
      onClose={onClose}
      onSubmit={save}
    >
      <Field label="À propos" error={error} counter={{ value: about.length, max: 2600 }}>
        <TextArea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={10}
          error={!!error}
          placeholder="Parlez de votre expérience, vos réalisations, votre approche…"
        />
      </Field>
    </ModalShell>
  );
}
