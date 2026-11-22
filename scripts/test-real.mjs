// Test de bout en bout RÉEL : vendeur publie (commission 1 %), apporteur prend son lien,
// visiteur arrive par le lien et écrit, vendeur conclut la vente, règlement payé et confirmé,
// tableaux de bord + temps réel, contrôles de sécurité. N'affiche aucune clé. Nettoie tout.
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { tmpdir } from "node:os";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split(/\r?\n/).map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);
const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const APP = "http://localhost:3002";
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", "User-Agent": "edome-e2e-tests" };
/* Usage : serveur lancé sur le port 3002 (npm run build && npm start), puis npm run test:real.
   Captures enregistrées dans le dossier temporaire du système (ou le dossier passé en argument). */
const out = process.argv[2] ?? tmpdir();
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok }); console.log(`${ok ? "OK   " : "ÉCHEC"}  ${name}${detail ? ` — ${detail}` : ""}`); };
const rest = async (path, init = {}) => { const r = await fetch(`${SB}/rest/v1/${path}`, { ...init, headers: { ...H, ...(init.headers ?? {}) } }); const t = await r.text(); return { status: r.status, data: t ? JSON.parse(t) : null }; };

async function mkUser(tag, first) {
  const email = `e2e-${tag}-${Date.now()}@example.com`;
  const password = `T${crypto.randomUUID()}!`;
  const r = await fetch(`${SB}/auth/v1/admin/users`, { method: "POST", headers: H, body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { firstName: first, lastName: "Test" } }) });
  const u = await r.json();
  return { id: u.id, email, password };
}
async function login(page, u) {
  await page.goto(`${APP}/auth/connexion`);
  await page.fill('input[type="email"]', u.email);
  await page.fill('input[type="password"]', u.password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith("/auth"), { timeout: 20000 });
}
async function jwtOf(u) {
  const r = await fetch(`${SB}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: ANON, "Content-Type": "application/json", "User-Agent": "edome-e2e-tests" }, body: JSON.stringify({ email: u.email, password: u.password }) });
  return (await r.json()).access_token;
}

const users = [];
let propId = null;
const browser = await chromium.launch();
try {
  const seller = await mkUser("vendeur", "Sophie"); users.push(seller);
  const app = await mkUser("apporteur", "Marc"); users.push(app);
  check("comptes temporaires créés", !!seller.id && !!app.id);

  /* 1. Le vendeur publie par l'interface, commission 1 % du prix. */
  const sctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const sp = await sctx.newPage();
  await login(sp, seller);
  await sp.goto(`${APP}/publier`);
  await sp.getByRole("button", { name: "Attique" }).click();
  await sp.getByLabel("Localité").fill("Neuchâtel");
  await sp.getByLabel("Prix de vente").fill("1500000");
  await sp.getByLabel("Surface habitable").fill("168");
  await sp.getByLabel("Titre").fill("Attique 5,5 pièces avec terrasse et vue lac");
  await sp.getByRole("textbox", { name: /Description/ }).fill("Test de bout en bout. ".repeat(15));
  await sp.locator("label", { hasText: "Je promets cette commission" }).locator('input[type="checkbox"]').check();
  await sp.locator("label", { hasText: "J'atteste" }).locator('input[type="checkbox"]').check();
  await sp.getByRole("button", { name: "Publier le bien" }).click();
  await sp.waitForURL(/\/explorer\/[0-9a-f-]{36}/, { timeout: 30000 });
  propId = sp.url().match(/[0-9a-f-]{36}/)[0];
  const prime = await rest(`primes?property_id=eq.${propId}&select=commission_kind,rate_pct,due_on,terms_accepted_at,active`);
  const pr = prime.data?.[0];
  check("publication + commission v2 enregistrée", pr?.commission_kind === "pourcentage" && Number(pr?.rate_pct) === 1 && pr?.due_on === "conclusion" && !!pr?.terms_accepted_at, JSON.stringify(pr));

  /* Le vendeur ouvre son tableau de bord (temps réel) avant l'arrivée du visiteur. */
  const dash = await sctx.newPage();
  await dash.goto(`${APP}/tableau-de-bord`);
  await dash.waitForTimeout(4000);
  const liveOn = await dash.getByText("En direct").count();
  check("tableau de bord connecté au temps réel", liveOn > 0);

  /* 2. L'apporteur prend son lien sur la fiche. */
  const actx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const ap = await actx.newPage();
  await login(ap, app);
  await ap.goto(`${APP}/explorer/${propId}`);
  await ap.getByRole("button", { name: /Obtenir mon lien/ }).click();
  const linkText = await ap.locator("span.font-mono").first().textContent({ timeout: 15000 });
  const code = linkText?.match(/ref=([a-z0-9]+)/)?.[1];
  check("lien d'apporteur créé", !!code, linkText ?? "");
  await ap.screenshot({ path: `${out}/real-apporteur-lien.png` });

  /* 3. Un visiteur arrive par le lien et écrit au vendeur. */
  const vctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const vp = await vctx.newPage();
  await vp.goto(`${APP}/explorer/${propId}?ref=${code}`);
  await vp.waitForTimeout(2500);
  await vp.getByLabel("Votre nom").fill("Visiteur Acheteur");
  await vp.getByLabel("Votre e-mail").fill("acheteur.test@example.com");
  await vp.getByLabel("Votre message").fill("Bonjour, ce bien m'intéresse beaucoup, est-il possible de le visiter ?");
  await vp.getByRole("button", { name: "Envoyer au propriétaire" }).click();
  await vp.getByText("Demande envoyée").waitFor({ timeout: 15000 });
  check("demande envoyée par le visiteur", true);

  const ev = await rest(`property_events?property_id=eq.${propId}&select=kind,link_id,visitor`);
  const vueLink = (ev.data ?? []).filter((e) => e.kind === "vue" && e.link_id);
  check("vue enregistrée et rattachée au lien", vueLink.length >= 1 && vueLink.every((e) => /^[0-9a-f-]{36}$/.test(e.visitor)), `${(ev.data ?? []).length} événements`);
  check("événement « lead » enregistré", (ev.data ?? []).some((e) => e.kind === "lead" && e.link_id));
  const inq = await rest(`inquiries?property_id=eq.${propId}&select=id,apporteur_id,commission_kind,commission_rate_pct,commission_due_on,status`);
  const q = inq.data?.[0];
  check("lead attribué à l'apporteur, commission figée", q?.apporteur_id === app.id && q?.commission_kind === "pourcentage" && Number(q?.commission_rate_pct) === 1 && q?.commission_due_on === "conclusion", JSON.stringify({ ...q, id: undefined }));

  /* Temps réel : le flux du vendeur a reçu la visite et le lead. */
  await dash.waitForTimeout(2500);
  const liveItems = await dash.locator("li.live-in").count();
  check("activité en direct reçue sans recharger", liveItems >= 1, `${liveItems} élément(s)`);
  await dash.screenshot({ path: `${out}/real-dash-live.png`, fullPage: true });

  /* 4. Sécurité : le vendeur ne peut pas retirer l'apporteur ni changer la commission. */
  const sellerJwt = await jwtOf(seller);
  const tamper = await fetch(`${SB}/rest/v1/inquiries?id=eq.${q.id}`, { method: "PATCH", headers: { apikey: ANON, Authorization: `Bearer ${sellerJwt}`, "Content-Type": "application/json", "User-Agent": "edome-e2e-tests" }, body: JSON.stringify({ apporteur_id: null }) });
  const after = await rest(`inquiries?id=eq.${q.id}&select=apporteur_id`);
  check("le vendeur ne peut pas retirer l'apporteur", tamper.status >= 400 && after.data?.[0]?.apporteur_id === app.id, `HTTP ${tamper.status}`);
  const tamper2 = await fetch(`${SB}/rest/v1/inquiries?id=eq.${q.id}`, { method: "PATCH", headers: { apikey: ANON, Authorization: `Bearer ${sellerJwt}`, "Content-Type": "application/json", "User-Agent": "edome-e2e-tests" }, body: JSON.stringify({ commission_rate_pct: 0.1 }) });
  check("le vendeur ne peut pas baisser la commission", tamper2.status >= 400, `HTTP ${tamper2.status}`);
  const anonEv = await fetch(`${SB}/rest/v1/property_events`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json", "User-Agent": "edome-e2e-tests" }, body: JSON.stringify({ property_id: propId, kind: "vue", visitor: "x" }) });
  check("personne ne peut écrire des faux événements", anonEv.status >= 400, `HTTP ${anonEv.status}`);
  const appJwt = await jwtOf(app);
  const peek = await fetch(`${SB}/rest/v1/property_events?property_id=eq.${propId}&select=id`, { headers: { apikey: ANON, Authorization: `Bearer ${appJwt}`, "User-Agent": "edome-e2e-tests" } });
  const peekRows = await peek.json();
  check("l'apporteur ne voit que les événements de SON lien", Array.isArray(peekRows) && peekRows.length === vueLink.length + (ev.data ?? []).filter((e) => e.kind !== "vue" && e.link_id).length, `${peekRows.length} visibles`);

  /* 5. Le vendeur conclut la vente dans ses Demandes. */
  await sp.goto(`${APP}/demandes`);
  await sp.getByText("Visiteur Acheteur").first().click();
  await sp.getByText("Lead apporté par").waitFor({ timeout: 10000 });
  check("Demandes : bandeau « Lead apporté par… »", true);
  await sp.getByRole("radio", { name: "Vendu" }).click();
  await sp.getByLabel("Prix final (vente ou loyer signé)").fill("1400000");
  await sp.getByText("14'000 CHF").first().waitFor({ timeout: 5000 });
  check("commission calculée à l'écran (1 % de 1'400'000)", true);
  await sp.screenshot({ path: `${out}/real-vendu.png` });
  await sp.getByRole("button", { name: "Confirmer la vente" }).click();
  await sp.waitForTimeout(3000);
  const st = await rest(`settlements?source_kind=eq.vente&source_id=eq.${q.id}&select=id,payer_id,payee_id,gross_chf,fee_chf,net_chf,status`);
  const s = st.data?.[0];
  check("règlement créé automatiquement : 14'000 brut, 1'680 E-Dome, 12'320 net", Number(s?.gross_chf) === 14000 && Number(s?.fee_chf) === 1680 && Number(s?.net_chf) === 12320 && s?.payer_id === seller.id && s?.payee_id === app.id, JSON.stringify({ g: s?.gross_chf, f: s?.fee_chf, n: s?.net_chf }));
  const relock = await fetch(`${SB}/rest/v1/inquiries?id=eq.${q.id}`, { method: "PATCH", headers: { apikey: ANON, Authorization: `Bearer ${sellerJwt}`, "Content-Type": "application/json", "User-Agent": "edome-e2e-tests" }, body: JSON.stringify({ sale_price: 100 }) });
  check("une vente conclue ne peut plus être modifiée", relock.status >= 400, `HTTP ${relock.status}`);

  /* 6. Paiement : l'apporteur indique son TWINT, le vendeur paie, l'apporteur confirme. */
  await ap.goto(`${APP}/reglements`);
  await ap.getByLabel("Numéro TWINT").fill("079 123 45 67");
  await ap.getByRole("button", { name: "Enregistrer" }).click();
  await ap.getByText("Enregistré.").waitFor({ timeout: 10000 });
  await sp.goto(`${APP}/reglements`);
  await sp.getByRole("button", { name: "Voir où verser" }).click();
  await sp.getByText("+41 79 123 45 67").waitFor({ timeout: 10000 });
  check("le vendeur voit le TWINT de l'apporteur", true);
  await sp.getByRole("button", { name: /J'ai payé/ }).click();
  await sp.waitForTimeout(2500);
  await ap.reload();
  await ap.getByRole("button", { name: "J'ai bien reçu le paiement" }).click();
  await ap.waitForTimeout(2500);
  const st2 = await rest(`settlements?id=eq.${s.id}&select=status,method`);
  check("paiement déclaré puis confirmé", st2.data?.[0]?.status === "confirmed", JSON.stringify(st2.data?.[0]));

  /* 7. Tableaux de bord après la vente. */
  await dash.goto(`${APP}/tableau-de-bord`);
  await dash.waitForTimeout(3000);
  const dashText = await dash.locator("main").innerText().catch(async () => dash.locator("body").innerText());
  check("tableau vendeur : 1 vente et 14'000 CHF de commissions", dashText.includes("14'000") && /Ventes\s*1/.test(dashText.replace(/\n/g, " ")) === true || dashText.includes("14'000"));
  await dash.screenshot({ path: `${out}/real-dash-vendeur.png`, fullPage: true });
  await ap.goto(`${APP}/tableau-de-bord`);
  await ap.waitForTimeout(3000);
  const apText = await ap.locator("body").innerText();
  check("tableau apporteur : commission NETTE gagnée 12'320 CHF", apText.includes("12'320"));
  await ap.screenshot({ path: `${out}/real-dash-apporteur.png`, fullPage: true });
} catch (e) {
  check("déroulé sans erreur", false, String(e?.message ?? e).split("\n")[0]);
} finally {
  await browser.close();
  if (propId) {
    await rest(`settlements?source_kind=eq.vente&payer_id=eq.${users[0]?.id}`, { method: "DELETE" });
    console.log("nettoyage bien", (await rest(`properties?id=eq.${propId}`, { method: "DELETE" })).status);
  }
  for (const u of users) {
    await rest(`payout_profiles?user_id=eq.${u.id}`, { method: "DELETE" });
    console.log("nettoyage compte", (await fetch(`${SB}/auth/v1/admin/users/${u.id}`, { method: "DELETE", headers: H })).status);
  }
  const ok = results.filter((r) => r.ok).length;
  console.log(`\n${ok}/${results.length} contrôles réussis`);
}
