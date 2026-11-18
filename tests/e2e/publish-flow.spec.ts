import { readFileSync, existsSync } from "node:fs";
import { test, expect, request as pwRequest, type APIRequestContext } from "@playwright/test";

/* ── Parcours complet de publication (REBUILD.md §6) ─────────────────────────

   Compte de test → connexion → formulaire → 3 vraies photos → prime →
   publication → photos servies depuis le stockage → modification du prix →
   retrait → fichiers effacés du stockage → compte supprimé.

   DÉSACTIVÉ par défaut : il écrit dans la base Supabase configurée (compte,
   bien, prime, fichiers), puis nettoie tout. Lancer explicitement :
     E2E_SUPABASE=1 npx playwright test publish-flow
   Ne jamais l'exécuter contre une base de production sans le vouloir. */

test.skip(process.env.E2E_SUPABASE !== "1", "Parcours réel désactivé (E2E_SUPABASE=1 pour l'activer)");

function env(): Record<string, string> {
  if (!existsSync(".env.local")) return {};
  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
  );
}

test("publier, modifier, retirer un bien avec de vraies photos", async ({ page }) => {
  const e = env();
  const SB = e.NEXT_PUBLIC_SUPABASE_URL;
  const KEY = e.SUPABASE_SERVICE_ROLE_KEY;
  test.skip(!SB || !KEY, "Supabase non configuré");
  const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
  /* Contexte d'API distinct, SANS User-Agent de navigateur : Supabase refuse
     une clé secrète accompagnée d'un User-Agent de navigateur (celui que le
     contexte par défaut de Playwright imite). */
  const request = await pwRequest.newContext({ userAgent: "edome-e2e-tests" });

  const listStorage = async (req: APIRequestContext, uid: string) => {
    const r = await req.post(`${SB}/storage/v1/object/list/property-images`, { headers: H, data: { prefix: `${uid}/`, limit: 100 } });
    return r.ok() ? ((await r.json()) as { name: string }[]).filter((o) => o.name && !o.name.startsWith(".")) : [];
  };

  const email = `e2e-${Date.now()}@example.com`;
  const password = `T3st-${Math.random().toString(36).slice(2)}-Aa1!`;
  const created = await request.post(`${SB}/auth/v1/admin/users`, {
    headers: H,
    data: { email, password, email_confirm: true, user_metadata: { firstName: "Marc", lastName: "Essai" } },
  });
  expect(created.ok(), `création du compte de test : ${created.status()} ${(await created.text()).slice(0, 200)}`).toBe(true);
  const user = (await created.json()) as { id: string };

  try {
    const imgs: Buffer[] = [];
    for (const color of ["#c9b79c", "#8fa8a3", "#b98b73"]) {
      await page.setContent(`<body style="margin:0;background:${color};width:1200px;height:900px"></body>`);
      imgs.push(await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 900 } }));
    }

    await page.goto("/auth/connexion?redirect=/publier");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/publier/);

    await page.getByRole("button", { name: "Appartement", exact: true }).click();
    await page.getByLabel("Localité").fill("Lausanne");
    await page.getByLabel("Prix de vente").fill("1150000");
    await page.getByLabel("Surface habitable").fill("95");
    await page.setInputFiles('input[type="file"]', imgs.map((buffer, i) => ({ name: `photo-${i + 1}.png`, mimeType: "image/png", buffer })));
    await expect(page.locator('[aria-label="Envoi en cours"]')).toHaveCount(0, { timeout: 60_000 });
    await page.getByLabel("Titre").fill("3,5 pièces rénové proche du métro, balcon au calme");
    await page.getByLabel("Description").fill("Bien de TEST automatique, supprimé à la fin du test. ".repeat(6));
    await page.getByText("Activer une prime sur ce bien").click();
    await page.getByRole("button", { name: "800 CHF" }).click();
    await page.getByText("J'atteste être en droit").click();
    await page.getByRole("button", { name: "Publier le bien" }).click();

    await page.waitForURL(/\/explorer\/[0-9a-f-]{36}\?publie=1/, { timeout: 30_000 });
    await expect(page.getByText("Votre annonce est en ligne")).toBeVisible();
    const srcs = await page.$$eval("section[aria-label='Photos'] img", (els) => els.map((el) => el.getAttribute("src") ?? ""));
    expect(srcs.length).toBeGreaterThanOrEqual(3);
    for (const s of srcs) expect(s).toContain("/storage/v1/object/public/property-images/");
    expect(await listStorage(request, user.id)).toHaveLength(3);

    await page.getByRole("link", { name: "Modifier" }).first().click();
    await page.waitForURL(/\/publier\?edit=/);
    await page.getByLabel("Prix de vente").fill("1090000");
    await page.getByRole("button", { name: "Enregistrer les modifications" }).click();
    await page.waitForURL(/\?modifie=1/, { timeout: 30_000 });
    await expect(page.getByText("CHF 1'090'000").first()).toBeVisible();

    await page.goto("/mes-biens");
    await page.getByRole("button", { name: "Retirer", exact: true }).first().click();
    await page.getByRole("button", { name: "Confirmer le retrait" }).click();
    await expect(page.getByText("Aucune annonce pour l'instant")).toBeVisible({ timeout: 20_000 });
    expect(await listStorage(request, user.id)).toHaveLength(0);
  } finally {
    const left = await listStorage(request, user.id);
    if (left.length) {
      await request.delete(`${SB}/storage/v1/object/property-images`, { headers: H, data: { prefixes: left.map((o) => `${user.id}/${o.name}`) } });
    }
    await request.delete(`${SB}/auth/v1/admin/users/${user.id}`, { headers: H });
  }
});
