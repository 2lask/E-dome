import { expect, test } from "@playwright/test";

/* ── Aucune affirmation de traction sur E-Dome ──────────────────────────────

   La règle de tri du fondateur : les données FICTIVES d'un utilisateur
   restent (ses revenus, ses réservations) — c'est le rôle d'une démonstration.
   Mais toute affirmation sur E-Dome ELLE-MÊME — nombre d'inscrits, montants
   versés, indice de marché, deals conclus, chiffre d'affaires de la plateforme
   — a été retirée aux phases A, 2 et 3.

   Ce fichier empêche leur retour. Chaque assertion correspond à une occurrence
   réellement supprimée ; si l'une reparaît, le test échoue avant la revue.

   On teste des routes de `(app)`, sous `AppProvider` : le serveur de test est
   le même `next dev` que les autres épreuves, aucun backend requis. */

async function bodyText(page: import("@playwright/test").Page, path: string): Promise<string> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);
  return (await page.locator("body").innerText()).toLowerCase();
}

test("la console d'administration n'affiche plus de chiffre d'affaires de plateforme", async ({ page }) => {
  const text = await bodyText(page, "/admin");
  /* Le KPI « Chiffre d'affaires » (387 500 CHF) et le compteur « 2 847
     utilisateurs actifs » affirmaient la traction d'E-Dome sur une page
     publique. Retirés à l'étape 3 ; les compteurs restants se calculent sur
     les listes affichées. */
  expect(text).not.toContain("chiffre d'affaires");
  expect(text).not.toContain("2 847");
  expect(text).not.toContain("387 500");
});

test("le classement des apporteurs n'affiche plus de montants versés", async ({ page }) => {
  const text = await bodyText(page, "/apporteurs");
  /* Le podium portait 4 200 / 3 380 / 3 010 CHF à côté de trois noms —
     E-Dome affirmant avoir versé des milliers de francs. Retirés à l'étape 3 ;
     le classement reste, sans les montants, marqué « exemple ». */
  expect(text).not.toContain("4 200");
  expect(text).not.toContain("3 380");
  expect(text).toContain("exemple de classement");
});

test("le fil ne contient pas de brève de marché chiffrée ni de deal E-Dome", async ({ page }) => {
  const text = await bodyText(page, "/feed");
  /* Les brèves inventées (« la BNS maintient son taux à 1,5 % », « le m²
     dépasse 14 500 CHF ») sont devenues des sujets de veille sans chiffre.
     Le bloc s'intitule désormais « Sujets suivis ». */
  expect(text).toContain("sujets suivis");
  expect(text).not.toContain("14 500 chf");
});

test("l'écran d'entrée /demo répond aux trois questions sans chiffre de traction", async ({ page }) => {
  const text = await bodyText(page, "/demo");
  /* /demo doit porter le modèle « qui paie quoi » et le « 0 CHF à E-Dome »,
     sans jamais annoncer un nombre d'inscrits ou de membres. */
  expect(text).toContain("0 chf à e-dome");
  expect(text).toContain("qui paie quoi");
  expect(text).not.toMatch(/\b\d[\d '.]*\s*(inscrits|membres|utilisateurs actifs)\b/);
});
