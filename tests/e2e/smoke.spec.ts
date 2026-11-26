import { existsSync } from "node:fs";
import { test, expect } from "@playwright/test";

/* ── Fumée : la carte des routes de la nouvelle génération (REBUILD.md) ──────
   Les redirections sont vérifiées sans les suivre (`maxRedirects: 0`). Les
   routes de membre supposent Supabase configuré (.env.local) : sans lui, le
   proxy laisse tout passer (mode sans backend) et ces cas sont ignorés. */

const PUBLIC = ["/", "/explorer", "/recherches", "/apporteurs", "/vendre", "/a-propos", "/aide", "/tarifs", "/agences", "/demenagement", "/ville/neuchatel", "/ville/lausanne", "/auth/connexion", "/auth/inscription"];
const MEMBER = ["/demandes", "/mes-biens", "/publier", "/parametres", "/profil", "/recherches/nouvelle", "/agence", "/dossier", "/parametres/notifications", "/reglements", "/tableau-de-bord", "/messages", "/bienvenue"];
const PARKED: [string, string][] = [
  ["/feed", "/"],
  ["/formations", "/"],
  ["/boutique/x", "/"],
  ["/dashboard", "/"],
  ["/dashboard/annonces", "/mes-biens"],
  ["/recherche?q=lausanne", "/explorer?q=lausanne"],
  ["/vendre/accompagnement", "/vendre"],
  ["/agence/abonnement", "/agence"],
];

const backend = !!process.env.NEXT_PUBLIC_SUPABASE_URL || existsSync(".env.local");

for (const path of PUBLIC) {
  test(`public · ${path} répond 200`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });
}

for (const path of MEMBER) {
  test(`membre · ${path} renvoie un visiteur vers la connexion`, async ({ request }) => {
    test.skip(!backend, "Supabase non configuré : pas de zone fermée");
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toContain(`/auth/connexion?redirect=${encodeURIComponent(path)}`);
  });
}

for (const [from, to] of PARKED) {
  test(`parqué · ${from} → ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(new URL(res.headers().location, "http://x").pathname + new URL(res.headers().location, "http://x").search).toBe(to);
  });
}

test("un visiteur ne voit jamais de compte fictif", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Créer un compte" }).first()).toBeVisible();
  await expect(page.getByText(/Bonjour Léo|Léo Martin/)).toHaveCount(0);
});

test("le menu de commande s'ouvre au clavier et cherche dans l'Explorer", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox", { name: "Commande ou recherche" });
  await expect(input).toBeVisible();
  await input.fill("Neuchâtel");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/explorer\?q=Neuch%C3%A2tel/);
});

test("l'IA refuse un visiteur anonyme (crédits protégés)", async ({ request }) => {
  test.skip(!backend, "sans Supabase, la démo locale reste ouverte");
  for (const sessionId of ["a", "b"]) {
    const res = await request.post("/api/ai/chat", { data: { messages: [{ role: "user", content: "Bonjour" }], sessionId } });
    expect(res.status()).toBe(401);
    expect((await res.json()).error).toBe("auth_required");
  }
});
