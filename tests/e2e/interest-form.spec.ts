import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";

/* ── Parcours d'inscription, de bout en bout ────────────────────────────────

   Ce que ces épreuves vérifient vraiment : qu'un formulaire rempli dans un
   navigateur aboutit à une ligne correcte dans le magasin. La validation, le
   score et le code de parrainage sont recalculés côté serveur ; les assertions
   portent donc sur ce qui a été écrit, pas seulement sur ce qui s'affiche.

   Les épreuves partagent un fichier : elles s'exécutent en série (voir
   playwright.config.ts) et chacune repart d'un magasin vide. */

const STORE = join(process.cwd(), ".leads.local.json");
const SUBMISSIONS = join(process.cwd(), ".leads-submissions.local.json");

interface StoredLead {
  email: string;
  firstName: string;
  profile: string;
  canton: string;
  country: string | null;
  profileAnswers: Record<string, string | string[]>;
  engagements: string[];
  consentPrivacy: boolean;
  consentAt: string | null;
  consentNewsletter: boolean;
  refCode: string;
  referredBy: string | null;
  engagementScore: number;
  landingPath: string | null;
}

async function readStore(): Promise<StoredLead[]> {
  try {
    return JSON.parse(await readFile(STORE, "utf8")) as StoredLead[];
  } catch {
    return [];
  }
}

/** Attend que l'adresse apparaisse dans le magasin, et renvoie la ligne. */
async function leadFor(email: string): Promise<StoredLead> {
  await expect
    .poll(async () => (await readStore()).some((l) => l.email === email), {
      message: `aucune ligne enregistrée pour ${email}`,
      timeout: 10_000,
    })
    .toBe(true);
  return (await readStore()).find((l) => l.email === email)!;
}

/* Une adresse par épreuve : deux envois de la même adresse déclencheraient la
   branche de mise à jour, qui n'est pas ce qu'on teste ici. */
const uniqueEmail = (tag: string) => `${tag}-${Date.now()}@exemple-test.ch`;

test.beforeEach(async () => {
  await rm(STORE, { force: true });
  await rm(SUBMISSIONS, { force: true });
});

/* ── Étape 1 : identité ─────────────────────────────────────────────────── */

async function fillIdentity(
  page: Page,
  opts: { firstName: string; email: string; profile: string; canton: string; country?: string },
) {
  await page.getByLabel("Prénom", { exact: true }).fill(opts.firstName);
  await page.getByLabel("E-mail", { exact: true }).fill(opts.email);
  await page.locator("#lead-profile").selectOption({ label: opts.profile });
  await page.locator("#lead-canton").selectOption({ label: opts.canton });
  /* Le champ pays n'apparaît que si le canton vaut « Hors de Suisse ». Il est
     rempli avant de quitter l'étape, comme le ferait un visiteur. */
  if (opts.country !== undefined) await page.locator("#lead-country").fill(opts.country);
  await page.getByRole("button", { name: "Continuer" }).click();
}

test("profil agence : les trois couches, puis /merci et le lien de parrainage", async ({
  page,
}) => {
  const email = uniqueEmail("agence");
  await page.goto("/#formulaire");

  await fillIdentity(page, {
    firstName: "Claire",
    email,
    profile: "Agence ou agent immobilier",
    canton: "Neuchâtel",
  });

  /* Couche 2 — questions propres au profil agence. */
  await expect(page.getByText("Combien de biens avez-vous en portefeuille")).toBeVisible();
  await page
    .getByLabel("Combien de biens avez-vous en portefeuille actuellement ?")
    .selectOption({ label: "6 à 20" });
  await page.getByRole("checkbox", { name: "Homegate", exact: true }).check();
  await page.getByRole("checkbox", { name: "ImmoScout24", exact: true }).check();
  await page
    .getByLabel("Votre budget mensuel actuel en portails et publicité")
    .selectOption({ label: "500 à 1 500 CHF" });
  await page
    .getByLabel(/Ce qui vous coûte le plus de temps/)
    .fill("La double saisie des annonces sur chaque portail.");
  await page.getByRole("button", { name: "Continuer" }).click();

  /* Couche 3 — engagement et consentement. */
  await page.getByRole("checkbox", { name: /appel de 20 minutes/ }).check();
  await page.getByRole("checkbox", { name: /lettre d'intérêt/ }).check();
  await page.locator("#consent-privacy").check();
  await page.locator("#consent-newsletter").check();
  await page.getByRole("button", { name: "Envoyer" }).click();

  /* Redirection vers /merci, avec le code en paramètre. */
  await page.waitForURL(/\/merci\?ref=/);
  await expect(page.getByRole("heading", { name: "C'est enregistré, merci" })).toBeVisible();

  /* Lien de parrainage affiché et porteur du code. */
  const refField = page.locator("#referral-url");
  await expect(refField).toBeVisible();
  const shared = await refField.inputValue();
  const code = new URL(page.url()).searchParams.get("ref")!;
  expect(code).toMatch(/^[A-Z0-9]{7}$/);
  expect(shared).toContain(`ref=${code}`);

  /* Ce qui compte vraiment : la ligne écrite. */
  const lead = await leadFor(email);
  expect(lead.firstName).toBe("Claire");
  expect(lead.profile).toBe("agence");
  expect(lead.canton).toBe("Neuchâtel");
  expect(lead.country).toBeNull();
  expect(lead.profileAnswers.biens_actifs).toBe("6 à 20");
  expect(lead.profileAnswers.portails).toEqual(["Homegate", "ImmoScout24"]);
  expect(lead.engagements).toEqual(expect.arrayContaining(["appel", "lettre"]));
  expect(lead.consentPrivacy).toBe(true);
  expect(lead.consentNewsletter).toBe(true);
  expect(lead.consentAt).not.toBeNull();
  expect(lead.refCode).toBe(code);
  expect(lead.referredBy).toBeNull();
  /* Score recalculé par le serveur : identité (1) + profil (2) + appel (2)
     + lettre (5). La valeur n'est jamais reprise du client. */
  expect(lead.engagementScore).toBe(10);
});

test("profil « Rejoindre l'équipe » : questions et engagements propres", async ({ page }) => {
  const email = uniqueEmail("equipe");
  await page.goto("/#formulaire");

  await fillIdentity(page, {
    firstName: "Sami",
    email,
    profile: "Rejoindre l'équipe",
    canton: "Hors de Suisse",
    country: "France",
  });

  await page.getByLabel("Le rôle qui vous intéresse").selectOption({ label: "Développement back-end" });
  await page.getByLabel("Vos technologies et outils").fill("TypeScript, React, Next.js, Postgres");
  await page.getByLabel("Votre disponibilité").selectOption({ label: "Temps partiel" });
  await page.getByLabel("Votre LinkedIn, GitHub ou portfolio").fill("https://github.com/exemple");
  await page
    .getByLabel("Une association avec participation au capital vous intéresse-t-elle ?")
    .selectOption({ label: "À discuter" });
  await page.getByRole("button", { name: "Continuer" }).click();

  /* Jeu d'engagements distinct : celui du profil « équipe ». */
  await expect(page.getByRole("checkbox", { name: /appel de découverte/ })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /lettre d'intérêt/ })).toHaveCount(0);

  await page.getByRole("checkbox", { name: /appel de découverte/ }).check();
  await page.locator("#consent-privacy").check();
  await page.getByRole("button", { name: "Envoyer" }).click();

  await page.waitForURL(/\/merci\?ref=/);
  await expect(page.locator("#referral-url")).toBeVisible();

  const lead = await leadFor(email);
  expect(lead.profile).toBe("equipe");
  expect(lead.canton).toBe("Hors de Suisse");
  expect(lead.country).toBe("France");
  expect(lead.profileAnswers.role).toBe("Développement back-end");
  expect(lead.profileAnswers.lien).toBe("https://github.com/exemple");
  expect(lead.engagements).toEqual(["appel_decouverte"]);
  expect(lead.consentNewsletter).toBe(false);
});

test("?ref=CODE est enregistré dans referred_by", async ({ page }) => {
  /* Premier inscrit : il fournit le code qui servira de parrain. */
  const parrainEmail = uniqueEmail("parrain");
  await page.goto("/#formulaire");
  await fillIdentity(page, {
    firstName: "Parrain",
    email: parrainEmail,
    profile: "Investisseur",
    canton: "Vaud",
  });
  await completeRemainingSteps(page);
  await page.waitForURL(/\/merci\?ref=/);

  const parrain = await leadFor(parrainEmail);
  expect(parrain.refCode).toMatch(/^[A-Z0-9]{7}$/);

  /* Second inscrit, arrivé par le lien de parrainage. Le code est déposé en
     cookie à l'arrivée, puis relu côté serveur à l'envoi : il n'est jamais
     repris du corps de la requête, donc non falsifiable par le formulaire. */
  const filleulEmail = uniqueEmail("filleul");
  await page.goto(`/?ref=${parrain.refCode}#inscription`);
  await fillIdentity(page, {
    firstName: "Filleul",
    email: filleulEmail,
    profile: "Investisseur",
    canton: "Genève",
  });
  await completeRemainingSteps(page);
  await page.waitForURL(/\/merci\?ref=/);

  const filleul = await leadFor(filleulEmail);
  expect(filleul.referredBy).toBe(parrain.refCode);
  expect(filleul.refCode).not.toBe(parrain.refCode);
});

test("sans consentement, l'envoi est refusé et rien n'est écrit", async ({ page }) => {
  const email = uniqueEmail("sans-consentement");
  await page.goto("/#formulaire");

  await fillIdentity(page, {
    firstName: "Refus",
    email,
    profile: "Propriétaire",
    canton: "Fribourg",
  });
  await answerProfileStep(page);
  await page.getByRole("button", { name: "Continuer" }).click();

  /* Consentement laissé décoché, volontairement. */
  await expect(page.locator("#consent-privacy")).not.toBeChecked();
  await page.getByRole("button", { name: "Envoyer" }).click();

  /* On reste sur la page, une erreur est annoncée, et le magasin reste vide. */
  await expect(page.locator("#consent-privacy-error")).toBeVisible();
  expect(page.url()).not.toContain("/merci");

  await page.waitForTimeout(1_000);
  expect((await readStore()).some((l) => l.email === email)).toBe(false);

  /* Et le consentement coché, le même formulaire passe : l'échec venait bien
     de la case, pas d'autre chose. */
  await page.locator("#consent-privacy").check();
  await page.getByRole("button", { name: "Envoyer" }).click();
  await page.waitForURL(/\/merci\?ref=/);
  expect((await leadFor(email)).consentPrivacy).toBe(true);
});

/* ── Aides ──────────────────────────────────────────────────────────────── */

/** Répond à toutes les questions obligatoires de l'étape 2, quel que soit le profil. */
async function answerProfileStep(page: Page) {
  const selects = page.locator("form select:not(#lead-profile):not(#lead-canton)");
  for (let i = 0; i < (await selects.count()); i++) {
    const select = selects.nth(i);
    const values = await select.locator("option").evaluateAll((options) =>
      (options as HTMLOptionElement[]).map((o) => o.value).filter((v) => v !== ""),
    );
    if (values.length > 0) await select.selectOption(values[0]!);
  }

  const textareas = page.locator("form textarea");
  for (let i = 0; i < (await textareas.count()); i++) {
    await textareas.nth(i).fill("Réponse de test.");
  }

  const urls = page.locator('form input[type="url"]');
  for (let i = 0; i < (await urls.count()); i++) {
    await urls.nth(i).fill("https://exemple.ch");
  }

  /* Une question à choix multiples obligatoire exige au moins une case. */
  const groups = page.locator("form fieldset");
  for (let i = 0; i < (await groups.count()); i++) {
    const boxes = groups.nth(i).locator('input[type="checkbox"]');
    if ((await boxes.count()) > 0) await boxes.first().check();
  }
}

/** Étapes 2 et 3 au minimum requis, consentement compris, puis envoi. */
async function completeRemainingSteps(page: Page) {
  await answerProfileStep(page);
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.locator("#consent-privacy").check();
  await page.getByRole("button", { name: "Envoyer" }).click();
}
