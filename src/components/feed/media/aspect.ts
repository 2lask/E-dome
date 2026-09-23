
/* Contraintes de format des médias du fil, partagées par le lecteur vidéo
   et la vue image — d'où leur fichier propre. */

// Clamp : on autorise jusqu'au 9:16 pur (0.5625) qui est le ratio standard
// Reels/TikTok/Whop et celui de 24/27 clips du feed. MEDIA_MAX_HEIGHT limite
// déjà la hauteur réelle (72svh ou 620px), donc une vidéo 9:16 ne monopolise
// pas l'écran. Max 1.78 (16:9 standard, ratio des 3 clips landscape : 18, 26, 27).
export const ASPECT_MIN = 0.5625; // 9:16 (portrait Reels)
export const ASPECT_MAX = 1.78;   // 16:9 (landscape standard)
export const clampAspect = (r: number) => Math.max(ASPECT_MIN, Math.min(r, ASPECT_MAX));
export const MEDIA_MAX_HEIGHT = "min(72svh, 620px)";
