import Image from "next/image";
import { cn } from "@/lib/utils";

/* ── Emplacement réservé à un visuel ─────────────────────────────────────────

   TODO visuel — à remplacer par les captures définitives de la maquette.

   Tant qu'aucun fichier n'est fourni, le composant rend un cadre neutre et
   explicitement marqué, jamais une fausse image : il doit être évident qu'il
   manque quelque chose, y compris pour quelqu'un qui découvre le code.

   Pour brancher un visuel, déposer le fichier dans `public/landing/` et
   passer son chemin en `src`. Le rendu bascule alors sur `next/image`, qui
   gère le format moderne, le dimensionnement et le chargement différé. Les
   dimensions sont imposées pour réserver la place et éviter que la page ne
   saute pendant le chargement. */

interface PlaceholderVisualProps {
  /** Chemin sous `public/`, par exemple `/landing/apercu-feed.png`. */
  src?: string;
  /** Texte alternatif. Obligatoire dès qu'une image réelle est fournie. */
  alt?: string;
  /** Légende affichée sous le cadre. */
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
  /** Charge l'image sans différé — à réserver au visuel du hero. */
  priority?: boolean;
}

export function PlaceholderVisual({
  src,
  alt,
  caption,
  width = 1200,
  height = 750,
  className,
  priority = false,
}: PlaceholderVisualProps) {
  const ratio = `${width} / ${height}`;

  return (
    <figure className={cn("w-full", className)}>
      <div
        className="relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)]"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? ""}
            width={width}
            height={height}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="rounded-md border border-dashed border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              TODO visuel
            </span>
            {caption && (
              <span className="max-w-xs text-sm text-[var(--text-muted)]">{caption}</span>
            )}
          </div>
        )}
      </div>
      {src && caption && (
        <figcaption className="mt-3 text-center text-sm text-[var(--text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
