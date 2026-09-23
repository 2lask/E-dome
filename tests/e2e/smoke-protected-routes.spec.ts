import { expect, test } from "@playwright/test";

/* ── Les quatre routes que le chantier ne doit pas casser ───────────────────

   Consigne A.3 du cahier des charges : « Ne casse ni `/`, ni `/merci`, ni
   `/confidentialite`, ni `/admin/leads`. » Ces quatre routes sont figées — la
   landing et ses annexes ne sont pas reprises par ce chantier.

   Jusqu'ici, cette consigne reposait sur l'attention. Ce fichier la rend
   vérifiable : quatre assertions qui échouent avant la revue plutôt qu'après
   la mise en ligne.

   Pourquoi elles sont les plus exposées, malgré les apparences. Personne ne
   les regarde pendant qu'on travaille sur la maquette, et trois d'entre elles
   passent par le même arbre de composants que le reste de l'application. Le
   danger précis identifié à l'audit est le renommage `Role` → `PlatformRole`
   de l'étape 4 : `/confidentialite` est sous `(app)`, donc sous `AppProvider`,
   dont le contexte lit un rôle mémorisé dans le navigateur. Une valeur
   inconnue y produisait un rôle fantôme, sans erreur visible.

   Ce que ce test NE vérifie pas : l'enregistrement d'une inscription. Le
   parcours complet du formulaire est couvert par `interest-form.spec.ts`, qui
   écrit dans le magasin fichier local — aucun projet Supabase n'est nécessaire
   ni utilisé ici. */

const PROTECTED = [
  {
    path: "/",
    name: "landing",
    /* Le titre de la landing vit dans `src/content/landing.ts`, fichier figé. */
    expect: /Dites-nous qui vous êtes|E-Dome/i,
  },
  {
    path: "/merci",
    name: "confirmation",
    expect: /C'est enregistré, merci/i,
  },
  {
    path: "/confidentialite",
    name: "politique de confidentialité",
    expect: /Politique de Confidentialit/i,
  },
  {
    path: "/admin/leads",
    name: "console des inscriptions",
    /* Sans mot de passe configuré, la page montre sa porte d'entrée et non
       une erreur : c'est le comportement attendu, et il suffit à prouver que
       la route répond et que la couche leads se charge. */
    expect: /mot de passe|Manifestations|Connexion/i,
  },
] as const;

for (const route of PROTECTED) {
  test(`${route.path} répond et affiche son contenu (${route.name})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const response = await page.goto(route.path);

    expect(response?.status(), `${route.path} doit répondre 200`).toBe(200);
    await expect(page.locator("body")).toContainText(route.expect);

    /* Une page qui s'affiche mais dont React plante à l'hydratation n'est pas
       une page qui fonctionne : elle est simplement inerte. */
    expect(errors, `${route.path} ne doit lever aucune erreur JavaScript`).toEqual([]);
  });
}

test("la landing reste interactive après hydratation", async ({ page }) => {
  await page.goto("/");

  /* Le formulaire est le seul élément de la landing dont dépend une donnée
     réelle. S'il répond au clavier, React a bien repris la main — ce qui est
     exactement ce que l'audit a vu échouer une fois, pour une raison
     d'origine de serveur de développement et non de code. */
  const firstName = page.locator("#lead-first-name");
  await expect(firstName).toBeVisible();
  await firstName.fill("Test");
  await expect(firstName).toHaveValue("Test");

  /* Le bouton d'étape suivante existe et n'est pas désactivé : la preuve que
     le composant client est monté, sans rien envoyer. */
  await expect(page.getByRole("button", { name: "Continuer" })).toBeEnabled();
});
