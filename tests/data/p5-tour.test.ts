import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { TOUR_PATHS, TOUR_PERSONAS, tourUi } from "@/content/tour";
import { personById } from "@/lib/demo/directory";
import { properties } from "@/lib/mock-data";

/* ── Chantier P5 — le tutoriel guidé ────────────────────────────────────────

   Le tutoriel ne doit jamais mener nulle part : chaque étape ouvre une route
   qui existe, éclaire une cible posée quelque part dans l'interface, et
   n'incarne que des personnes de l'annuaire. Ces épreuves le vérifient sans
   navigateur, en lisant le contenu et l'arborescence du dépôt. */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = join(ROOT, "src");
const APP = join(SRC, "app", "(app)");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

/** Les valeurs de `data-tour="…"` posées dans `src/`. */
const TOUR_KEYS = (() => {
  const keys = new Set<string>();
  for (const file of walk(SRC)) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/data-tour="([^"]+)"/g)) keys.add(m[1]);
  }
  return keys;
})();

/** Une route du groupe (app) : segment exact, sinon segment dynamique `[x]`.
    Renvoie le nom du paramètre dynamique rencontré, pour vérifier l'instance. */
function resolveRoute(route: string): { ok: boolean; dynamic: { param: string; value: string }[] } {
  const segments = route.split("/").filter(Boolean);
  let dir = APP;
  const dynamic: { param: string; value: string }[] = [];
  for (const seg of segments) {
    const exact = join(dir, seg);
    if (existsSync(exact) && statSync(exact).isDirectory()) {
      dir = exact;
      continue;
    }
    const dyn = readdirSync(dir).find((n) => /^\[[^.\]]+\]$/.test(n) && statSync(join(dir, n)).isDirectory());
    if (!dyn) return { ok: false, dynamic };
    dynamic.push({ param: dyn.slice(1, -1), value: seg });
    dir = join(dir, dyn);
  }
  return { ok: existsSync(join(dir, "page.tsx")), dynamic };
}

const PROPERTY_IDS = new Set(properties.map((p) => p.id));

test("au moins quatre parcours, ids uniques, chacun de 1 à 12 étapes", () => {
  assert.ok(TOUR_PATHS.length >= 4, "au moins les quatre parcours demandés");
  const ids = TOUR_PATHS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, "ids de parcours en double");
  for (const p of TOUR_PATHS) {
    assert.ok(p.steps.length >= 1 && p.steps.length <= 12, `${p.id} : ${p.steps.length} étapes`);
    const stepIds = p.steps.map((s) => s.id);
    assert.equal(new Set(stepIds).size, stepIds.length, `${p.id} : ids d'étape en double`);
    assert.ok(p.minutes > 0, `${p.id} : durée`);
  }
});

test("le parcours découverte existe et compte 8 à 10 étapes", () => {
  const d = TOUR_PATHS.find((p) => p.id === "decouvrir");
  assert.ok(d, "parcours « Découvrir E-Dome »");
  assert.ok(d.steps.length >= 8 && d.steps.length <= 10, `${d.steps.length} étapes`);
  assert.equal(d.steps[0].target, "demo-banner", "on commence par le bandeau « données fictives »");
});

test("chaque route d'étape est une page de src/app/(app)", () => {
  for (const p of TOUR_PATHS) {
    for (const s of p.steps) {
      assert.ok(s.route.startsWith("/") && !s.route.includes("?"), `${p.id}/${s.id} : route ${s.route}`);
      const r = resolveRoute(s.route);
      assert.ok(r.ok, `${p.id}/${s.id} : aucune page pour ${s.route}`);
      for (const d of r.dynamic) {
        if (s.route.startsWith("/explorer/")) {
          assert.ok(PROPERTY_IDS.has(d.value), `${p.id}/${s.id} : bien inconnu ${d.value}`);
        }
      }
    }
  }
});

test("chaque cible (et chaque repli) est posée en data-tour quelque part dans src/", () => {
  for (const p of TOUR_PATHS) {
    for (const s of p.steps) {
      const keys = [s.target, ...(s.fallbackTargets ?? []), ...(s.revealTarget ? [s.revealTarget] : [])];
      for (const k of keys) assert.ok(TOUR_KEYS.has(k), `${p.id}/${s.id} : data-tour="${k}" introuvable`);
    }
  }
});

test("chaque personne incarnée existe dans l'annuaire", () => {
  for (const id of Object.values(TOUR_PERSONAS)) assert.ok(personById(id), `personne ${id}`);
  for (const p of TOUR_PATHS) {
    if (p.persona) assert.ok(personById(p.persona), `${p.id} : ${p.persona}`);
    for (const s of p.steps) {
      if (s.persona) assert.ok(personById(s.persona), `${p.id}/${s.id} : ${s.persona}`);
    }
  }
  /* Les personnes annoncées par le cahier des charges. */
  const byId = (id: string) => personById(id)!;
  assert.equal(byId(TOUR_PERSONAS.bernard).lastName, "Chappuis");
  assert.equal(byId(TOUR_PERSONAS.jeanLuc).lastName, "Hartmann");
  assert.equal(byId(TOUR_PERSONAS.yves).lastName, "Mottiez");
  assert.equal(byId(TOUR_PERSONAS.ana).lastName, "Ferreira");
  assert.equal(byId(TOUR_PERSONAS.helene).lastName, "Marchal");
});

test("tous les textes sont remplis, sans mot interdit", () => {
  const texts: string[] = [];
  for (const p of TOUR_PATHS) {
    texts.push(p.title, p.tagline);
    if (p.persona) texts.push(p.personaLabel ?? "");
    for (const s of p.steps) {
      texts.push(s.title, s.body);
      if (s.await) texts.push(s.awaitHint ?? tourUi.defaultAwaitHint, s.doneText ?? tourUi.defaultDone);
    }
  }
  for (const v of Object.values(tourUi)) if (typeof v === "string") texts.push(v);
  for (const t of texts) {
    assert.ok(t.trim().length > 0, "texte vide");
    assert.doesNotMatch(t, /courti[eè]re?/i, `mot interdit : ${t}`);
  }
});

test("les étapes à geste attendu ont une consigne et une cible cliquable", () => {
  for (const p of TOUR_PATHS) {
    for (const s of p.steps) {
      if (!s.await) continue;
      assert.equal(s.await, "click");
      assert.ok(s.awaitHint && s.awaitHint.length > 0, `${p.id}/${s.id} : consigne`);
    }
  }
});
