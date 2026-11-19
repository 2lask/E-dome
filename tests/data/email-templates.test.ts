import assert from "node:assert/strict";
import { test } from "node:test";

import { buildEmail, escapeHtml, type Notice } from "@/lib/email/templates";

const SITE = "https://e-dome.example/";

test("E1 · le texte d'un membre est échappé dans le HTML", () => {
  const e = buildEmail({ kind: "demande", propertyTitle: "<script>x</script>", senderName: "A&B", visit: false }, SITE);
  assert.ok(!e.html.includes("<script>x</script>"));
  assert.ok(e.html.includes("&lt;script&gt;"));
  assert.ok(e.html.includes("A&amp;B"));
  assert.equal(escapeHtml(`"'`), "&quot;&#39;");
});

test("E2 · chaque e-mail mène au bon endroit et propose de se désabonner", () => {
  const cases: [Notice, string][] = [
    [{ kind: "demande", propertyTitle: "3 pièces", senderName: "Léa", visit: true }, "/demandes"],
    [{ kind: "mise-en-relation", propertyTitle: "Villa", amountChf: 1500 }, "/demandes"],
    [{ kind: "proposition", searchTitle: "Logement à louer · Lausanne", rewardChf: 500 }, "/demandes"],
    [{ kind: "decision-relation", propertyTitle: "Villa", accepted: true, netChf: 1320 }, "/apporteurs"],
    [{ kind: "decision-proposition", searchTitle: "Logement", accepted: false, netChf: 440 }, "/recherches"],
  ];
  for (const [n, path] of cases) {
    const e = buildEmail(n, SITE);
    assert.ok(e.text.includes(`https://e-dome.example${path}`), `${n.kind} → ${path}`);
    assert.ok(e.text.includes("/parametres/notifications"));
    assert.ok(e.html.includes("/parametres/notifications"));
    assert.ok(e.subject.length <= 90, `${n.kind} : sujet trop long`);
  }
});

test("E3 · montants au format suisse, sujet qui dit l'argent", () => {
  const e = buildEmail({ kind: "decision-relation", propertyTitle: "Villa", accepted: true, netChf: 2640 }, SITE);
  assert.equal(e.subject, "Accepté : 2'640 CHF pour vous");
  const r = buildEmail({ kind: "decision-relation", propertyTitle: "Villa", accepted: false, netChf: 2640 }, SITE);
  assert.ok(r.text.includes("Rien n'est dû"));
});

test("E4 · aucun e-mail ne contient de coordonnées (le modèle n'en reçoit pas)", () => {
  const e = buildEmail({ kind: "mise-en-relation", propertyTitle: "Villa", amountChf: 800 }, SITE);
  assert.ok(!/@|\+41|\b0\d{2} ?\d{3}/.test(e.text.replace(/https?:\/\/\S+/g, "")));
});
