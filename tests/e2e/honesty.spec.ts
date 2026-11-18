import { test, expect } from "@playwright/test";

/* ── Honnêteté : rien d'inventé sur les pages publiques (REBUILD.md §1) ──────
   Garde-fou contre le retour de ce que la reconstruction a retiré : la fausse
   note « 4.14 · 487 avis », les affirmations de sécurité non vérifiées, le
   vocabulaire de maquette, le compte de démonstration. */

const PAGES = ["/", "/explorer", "/apporteurs", "/vendre", "/a-propos", "/aide", "/auth/connexion", "/auth/inscription"];

const FORBIDDEN: [RegExp, string][] = [
  [/\b\d[.,]\d{1,2}\s*·?\s*\d{2,}\s*avis\b/i, "note + nombre d'avis fabriqués"],
  [/ISO\s*27001/i, "certification non vérifiée"],
  [/hébergés? en Suisse/i, "hébergement non vérifié"],
  [/maquette|démonstration en cours|données fictives/i, "vocabulaire de maquette"],
  [/Léo Martin|Bonjour Léo/i, "compte de démonstration"],
  [/examinée? par notre équipe|vérification d'une annonce prend/i, "examen d'annonce inexistant"],
];

for (const path of PAGES) {
  test(`${path} ne contient aucune affirmation inventée`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const text = await page.locator("body").innerText();
    for (const [re, why] of FORBIDDEN) {
      expect(re.test(text), `${path} : ${why} (${re})`).toBe(false);
    }
  });
}
