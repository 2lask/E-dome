"use client";

import { useRef, useState } from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { useApp } from "@/lib/context";
import { ModalShell } from "./modal-shell";
import { Field, TextInput } from "./fields";

/* Édition de la photo de profil ou de la bannière. Deux entrées : upload
   d'un fichier (converti en data URL, pas de storage en démo) ou collage
   d'une URL d'image. Aperçu en direct avant enregistrement. */
export function EditImageModal({
  kind,
  onClose,
}: {
  kind: "avatar" | "banner";
  onClose: () => void;
}) {
  const { profile, updateProfile } = useApp();
  const current = kind === "avatar" ? profile.avatar : profile.banner ?? "";
  const [value, setValue] = useState(current);
  const [error, setError] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Image trop lourde (max 3 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setValue(String(reader.result)); setError(undefined); };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (kind === "avatar") {
      if (!value.trim()) { setError("Une photo est requise."); return; }
      updateProfile({ avatar: value.trim() });
    } else {
      updateProfile({ banner: value.trim() || undefined });
    }
    onClose();
  };

  const isBanner = kind === "banner";

  return (
    <ModalShell
      title={isBanner ? "Photo de couverture" : "Photo de profil"}
      onClose={onClose}
      onSubmit={save}
    >
      {/* Aperçu */}
      <div className="rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--hover-bg)]">
        {value ? (
          isBanner ? (
            <img src={value} alt="" className="w-full h-32 object-cover" />
          ) : (
            <div className="flex justify-center py-5">
              <img src={value} alt="" className="w-28 h-28 rounded-full object-cover" />
            </div>
          )
        ) : (
          <div className={`flex items-center justify-center text-xs text-[var(--text-muted)] ${isBanner ? "h-32" : "h-36"}`}>
            Aucune image
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
      >
        <Upload size={16} /> Téléverser une image
      </button>

      <Field label="… ou coller une URL d'image" error={error}>
        <div className="relative">
          <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <TextInput
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => { setValue(e.target.value); setError(undefined); }}
            error={!!error}
            placeholder="https://…"
            style={{ paddingLeft: 34 }}
          />
        </div>
      </Field>
      {value.startsWith("data:") && (
        <p className="text-[11px] text-[var(--text-muted)]">Image importée depuis votre appareil.</p>
      )}
    </ModalShell>
  );
}
