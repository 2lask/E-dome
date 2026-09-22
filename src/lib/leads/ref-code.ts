/* ── Codes de parrainage ─────────────────────────────────────────────────────

   Un code court, lisible à voix haute et transcriptible sans ambiguïté : il
   finit dans une URL qu'on partage par message, parfois dictée.

   L'alphabet exclut donc les caractères qui se confondent à la lecture ou à
   la saisie : O contre 0, I et L contre 1, U contre V. Il reste 28 symboles
   sur 7 positions, soit environ 10^10 combinaisons — largement assez, et la
   collision éventuelle est de toute façon rattrapée par la contrainte
   d'unicité en base et la boucle de réessai côté store.

   `crypto.getRandomValues` est disponible aussi bien sous Node que sur le
   runtime edge, contrairement à `require("crypto")`. Le rejet des valeurs
   au-delà du plus grand multiple de la taille de l'alphabet évite le biais
   qu'introduirait un simple modulo. */

const ALPHABET = "ABCDEFGHJKMNPQRSTWXYZ23456789";
const CODE_LENGTH = 7;

export function generateRefCode(length = CODE_LENGTH): string {
  const n = ALPHABET.length;
  /* Plus grand multiple de `n` représentable sur un octet : au-delà, on
     retire, sinon les premiers symboles sortiraient plus souvent. */
  const limit = Math.floor(256 / n) * n;
  const out: string[] = [];

  while (out.length < length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < limit) {
        out.push(ALPHABET[b % n]!);
        if (out.length === length) break;
      }
    }
  }

  return out.join("");
}

/** Normalise un code reçu d'une URL ou d'un cookie avant comparaison. */
export function normalizeRefCode(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length < 4 || cleaned.length > 16) return undefined;
  return cleaned;
}
