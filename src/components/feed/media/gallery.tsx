"use client";
import { BlurImage, ImageView } from "./image-view";


export function MediaGallery({ media }: { media: string[] }) {
  const n = Math.min(media.length, 4);
  const extra = media.length - 4;

  if (n === 1) return <ImageView src={media[0]} />;

  const tileCls = "relative overflow-hidden bg-[var(--hover-bg)]";

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {media.slice(0, 2).map((src, i) => (
          <div key={i} className={tileCls}>
            <BlurImage src={src} />
          </div>
        ))}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <div className={tileCls + " row-span-2"}>
          <BlurImage src={media[0]} />
        </div>
        <div className={tileCls}>
          <BlurImage src={media[1]} />
        </div>
        <div className={tileCls}>
          <BlurImage src={media[2]} />
        </div>
      </div>
    );
  }

  // n === 4
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-2xl overflow-hidden" style={{ aspectRatio: "1/1" }}>
      {media.slice(0, 4).map((src, i) => (
        <div key={i} className={tileCls}>
          <BlurImage src={src} />
          {i === 3 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-2xl font-semibold">
              +{extra}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Légende avec ellipsis automatique + lien « Voir plus » en bleu (style Twitter)
// quand le texte est tronqué. Détecte le débordement via scrollHeight vs
// clientHeight (ref-based) après le rendu, recalcule à chaque changement
// de contenu et au resize.
/* `clamp={false}` : le texte est rendu en entier, sans « Voir plus ».

   Ajouté pour l'avis d'accueil. Clampé à trois lignes comme les autres, il
   s'arrêtait sur « Tout ce qui suit est un exemple : les profils, les
   biens… » — la phrase qui désamorce la maquette disparaissait derrière un
   bouton. Un avertissement qu'il faut déplier n'avertit personne. */
