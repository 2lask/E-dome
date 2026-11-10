import assert from "node:assert/strict";
import { test } from "node:test";

import { CURRENT_USER_ID } from "@/lib/demo/identity";
import { users, properties as CATALOGUE } from "@/lib/mock-data";
import { DEFAULT_PERSONA_ID, PERSONAS, personaIdForRole } from "@/content/roles";
import { actorSummary, navFor, personaGroups, resolveActorId } from "@/lib/demo/actors";
import { actorDashboard } from "@/lib/demo/actor-dashboard";
import * as derive from "@/lib/demo/derive";
import { emptySession, recordEvent } from "@/lib/demo/session-store";
import { notificationsFor, threadsFor } from "@/lib/demo/session-views";
import { incarnate, recordSessionEvent } from "@/lib/use-session";
import { getMockProfile } from "@/lib/profile-data";

/* ── Être un profil (chantier P3) ───────────────────────────────────────────

   On n'incarne plus un rôle mais une personne de l'annuaire. Ces épreuves
   vérifient qu'incarner X change l'acteur (au nom de qui on agit), le profil
   courant, les notifications et le périmètre du tableau de bord — et que
   personne ne voit jamais le tableau de bord de Léo à sa place. */

const CELINE = "user-002";
const ANA = "user-006";
const BERNARD = "user-007";
const JEANLUC = "user-015";
const ALINE = "user-004";
const YVES = "user-012";
const SANDRINE = "user-011";

test("le sélecteur propose les seize personnes, chacune une fois, Léo par défaut", () => {
  const ids = PERSONAS.map((p) => p.id);
  assert.equal(ids.length, 16);
  assert.equal(new Set(ids).size, 16);
  assert.deepEqual([...ids].sort(), users.map((u) => u.id).sort(), "les seize de l'annuaire, ni plus ni moins");
  assert.equal(DEFAULT_PERSONA_ID, CURRENT_USER_ID);
  const groups = personaGroups();
  assert.equal(groups.length, 6);
  for (const g of groups) assert.ok(g.people.length > 0, `groupe vide : ${g.label}`);
  assert.equal(groups.flatMap((g) => g.people).length, 16);
});

test("chaque personne a un visage et une ligne « rôle · ville »", () => {
  for (const p of PERSONAS) {
    const a = actorSummary(p.id);
    assert.ok(a.avatar.startsWith("/avatars/"), a.name);
    assert.ok(a.line.endsWith(` · ${a.city}`), a.line);
    assert.ok(a.legend.endsWith(` à ${a.city}`), a.legend);
    assert.ok(!/courti/i.test(a.as), "jamais « courtier » (D16)");
  }
  assert.equal(actorSummary(CELINE).legend, "agente immobilière à Lutry");
});

test("les favoris de départ sont des biens du catalogue, jamais les siens", () => {
  for (const p of PERSONAS) {
    for (const id of p.favorites) {
      const prop = CATALOGUE.find((c) => c.id === id);
      assert.ok(prop, `favori inconnu : ${id}`);
      assert.notEqual(prop.host.id, p.id, `${p.id} a son propre bien en favori`);
    }
  }
});

test("un id inconnu ramène à Léo ; la visite guidée incarne une personne, jamais un rôle", () => {
  assert.equal(resolveActorId("user-999"), CURRENT_USER_ID);
  assert.equal(resolveActorId(null), CURRENT_USER_ID);
  assert.equal(resolveActorId(CELINE), CELINE);
  for (const role of ["proprietaire", "hote", "agence", "admin"] as const) {
    assert.ok(users.some((u) => u.id === personaIdForRole(role)));
  }
  assert.equal(personaIdForRole("agence"), JEANLUC);
});

test("incarner X change l'acteur : les actions sont faites en son nom", () => {
  incarnate(CELINE);
  const ev = recordSessionEvent({ kind: "follow", data: { toId: CURRENT_USER_ID } });
  assert.equal(ev.actorId, CELINE);
  incarnate("inconnu");
  assert.equal(recordSessionEvent({ kind: "follow", data: { toId: CELINE } }).actorId, CURRENT_USER_ID);
  incarnate(CURRENT_USER_ID);
});

test("incarner X change le profil courant", () => {
  const p = getMockProfile(CELINE)!;
  assert.equal(p.firstName, "Céline");
  assert.equal(p.location.city, "Lutry");
  assert.notEqual(getMockProfile(CURRENT_USER_ID)!.id, p.id);
});

test("messagerie et notifications du point de vue de la personne incarnée", () => {
  let state = emptySession();
  state = recordEvent(state, CURRENT_USER_ID, {
    kind: "contact.sent",
    data: { toId: CELINE, propertyId: "prop19", subject: "Maison vigneronne", text: "Bonjour Céline" },
  }).state;
  const celineNotifs = notificationsFor(state, CELINE);
  const leoNotifs = notificationsFor(state, CURRENT_USER_ID);
  assert.equal(celineNotifs.length, notificationsFor(emptySession(), CELINE).length + 1, "Céline est notifiée");
  assert.equal(leoNotifs.length, notificationsFor(emptySession(), CURRENT_USER_ID).length, "Léo ne se notifie pas lui-même");
  const thread = threadsFor(state, CELINE).find((t) => t.otherIds.includes(CURRENT_USER_ID) && t.messages.some((m) => m.text === "Bonjour Céline"));
  assert.ok(thread, "Céline voit ce que Léo lui a écrit");
  assert.ok(thread.unreadCount > 0, "et son propre compteur");
  const leoThread = threadsFor(state, CURRENT_USER_ID).find((t) => t.id === thread.id)!;
  assert.equal(leoThread.unreadCount, 0, "l'expéditeur n'a rien de non lu dans ce fil");
});

test("le tableau de bord de Céline ne montre que SES montants (journal filtré par ownerId)", () => {
  const d = actorDashboard(CELINE, emptySession());
  const expected = derive.bySourceYear(CELINE).reduce((s, x) => s + x.value, 0);
  assert.equal(d.revenue12m, expected);
  assert.notEqual(d.revenue12m, derive.bySourceYear(CURRENT_USER_ID).reduce((s, x) => s + x.value, 0));
  assert.ok(d.gmv > 0, "volume de ventes (mandat conclu)");
  assert.ok(d.hosted.length > 0);
  for (const h of d.hosted) assert.equal(CATALOGUE.find((c) => c.id === h.id)!.host.id, CELINE);
  assert.equal(d.focus, "agence");
});

test("une personne sans biens a un tableau de bord qui a du sens pour elle", () => {
  const ana = actorDashboard(ANA, emptySession(), PERSONAS.find((p) => p.id === ANA)!.favorites);
  assert.equal(ana.earns, false);
  assert.equal(ana.revenue12m, 0);
  assert.equal(ana.hosted.length, 0);
  assert.equal(ana.focus, "recherche");
  assert.ok(ana.favorites.length > 0 && ana.searches.length > 0);
  assert.ok(ana.conversations.count > 0, "Ana écrit à Léo pour son 4,5 pièces");
  assert.ok(ana.purchases.some((p) => p.label.startsWith("Séjour")), "son séjour à Montreux");
  assert.ok(!ana.sections.includes("reservations"));

  const bernard = actorDashboard(BERNARD, emptySession());
  assert.equal(bernard.focus, "vente");
  assert.ok(bernard.hosted.some((h) => h.id === "prop3" && h.status === "en vente"));
});

test("aucun des seize n'a un tableau de bord vide", () => {
  for (const p of PERSONAS) {
    const d = actorDashboard(p.id, emptySession(), p.favorites);
    const content =
      d.hosted.length + d.formations.length + d.serviceSales.length + d.favorites.length +
      d.searches.length + d.conversations.count + d.purchases.length + d.followers;
    assert.ok(content > 0, `tableau de bord vide : ${p.id}`);
    assert.ok(d.sections.includes("audience"));
  }
});

test("la navigation suit les rôles de la personne", () => {
  const keys = (id: string) => navFor(id).map((i) => i.key);
  assert.ok(!keys(ANA).includes("agence"), "un particulier n'a pas l'espace agence");
  assert.ok(!keys(ANA).includes("apporteurs"));
  assert.ok(keys(JEANLUC).includes("agence"));
  assert.ok(keys(ALINE).includes("agence"));
  assert.ok(!keys(CELINE).includes("agence"), "Céline, indépendante, pilote depuis son tableau de bord");
  assert.ok(keys(YVES).includes("apporteurs"));
  assert.ok(keys(SANDRINE).includes("formations"));
  for (const p of PERSONAS) {
    const k = keys(p.id);
    assert.equal(k[0], "dashboard");
    assert.ok(k.includes("profil"));
  }
});
