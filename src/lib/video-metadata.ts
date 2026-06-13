/* Metadata statique des clips MP4 du feed.
   Source : ffprobe (Gyan.FFmpeg v8.1) sur les 27 clips de /public/videos/feed/.
   But : connaitre le ratio AVANT que le <video> charge ses metadonnees,
   pour que le container ait le bon aspect-ratio des le 1er render
   (evite le flash 16:9 -> 9:16 visible avec onLoadedMetadata).

   Sur 27 clips :
   - 24 PORTRAIT 9:16 (720x1280 ou 360x640) — ratio 0.5625
   - 3 LANDSCAPE 16:9 (~1276x720) — ratio ~1.7722
*/

export type VideoMeta = {
  width: number;
  height: number;
  /** width / height — utilise directement comme CSS aspect-ratio. */
  ratio: number;
};

/* Map URL publique -> metadonnees. Les cles correspondent EXACTEMENT
   au format genere par `clip(n)` dans feed/page.tsx :
   `/videos/feed/clip-${nn}.mp4` avec nn zero-padded. */
export const VIDEO_RATIOS: Record<string, VideoMeta> = {
  "/videos/feed/clip-01.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-02.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-03.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-04.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-05.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-06.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-07.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-08.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-09.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-10.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-11.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-12.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-13.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-14.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-15.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-16.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-17.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-18.mp4": { width: 1276, height: 720, ratio: 1276 / 720 },
  "/videos/feed/clip-19.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-20.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-21.mp4": { width: 360, height: 640, ratio: 360 / 640 },
  "/videos/feed/clip-22.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-23.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-24.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-25.mp4": { width: 720, height: 1280, ratio: 720 / 1280 },
  "/videos/feed/clip-26.mp4": { width: 1278, height: 720, ratio: 1278 / 720 },
  "/videos/feed/clip-27.mp4": { width: 1276, height: 720, ratio: 1276 / 720 },
};

/* Fallback : la majorite des clips du feed sont en portrait 9:16 (Reels-like),
   donc en cas d'URL inconnue (blob: du composer, mock random), on parie
   portrait. C'est aussi le format le plus "lisible" en feed mobile. */
export const FALLBACK_PORTRAIT_RATIO = 9 / 16; // 0.5625

/** Retourne le metadata du clip si connu, sinon null. */
export function getVideoMetadata(src: string): VideoMeta | null {
  if (!src) return null;
  /* Normalise : on tolere des prefixes type host absolu ou query strings. */
  try {
    /* Si c'est une URL absolue, on garde uniquement le pathname pour matcher. */
    if (/^https?:\/\//.test(src)) {
      const u = new URL(src);
      return VIDEO_RATIOS[u.pathname] ?? null;
    }
    /* Strip query / hash eventuels. */
    const clean = src.split("?")[0].split("#")[0];
    return VIDEO_RATIOS[clean] ?? null;
  } catch {
    return VIDEO_RATIOS[src] ?? null;
  }
}
