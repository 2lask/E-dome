import { VideoOff } from "lucide-react";
import { formationsText } from "@/content/formations";

/* Pas de fichier vidéo dans la maquette : on le dit, plutôt qu'un lecteur
   cassé ou un extrait sans rapport avec le sujet. */
export function VideoPlaceholder({ title }: { title?: string }) {
  return (
    <div
      role="img"
      aria-label={formationsText.lesson.video}
      className="w-full aspect-video rounded-xl border border-dashed border-[var(--card-border)] bg-[var(--card)] flex flex-col items-center justify-center gap-2 px-6 text-center"
    >
      <VideoOff size={36} className="text-[var(--text-muted)]" strokeWidth={1.5} aria-hidden />
      <p className="text-sm font-medium text-[var(--foreground)]">{formationsText.lesson.video}</p>
      {title && <p className="text-xs text-[var(--text-muted)] max-w-md">{title}</p>}
      <p className="text-xs text-[var(--text-muted)] max-w-md">{formationsText.lesson.videoHint}</p>
    </div>
  );
}
