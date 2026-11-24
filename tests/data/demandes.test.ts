import assert from "node:assert/strict";
import { test } from "node:test";

import { swissToIntl } from "@/lib/demandes";

test("DM1 · numéro suisse → format WhatsApp", () => {
  assert.equal(swissToIntl("079 123 45 67"), "41791234567");
  assert.equal(swissToIntl("+41 79 123 45 67"), "41791234567");
  assert.equal(swissToIntl("0041791234567"), "41791234567");
  assert.equal(swissToIntl("+33 6 12 34 56 78"), "33612345678");
  assert.equal(swissToIntl("12"), null);
  assert.equal(swissToIntl("pas de numéro"), null);
});
