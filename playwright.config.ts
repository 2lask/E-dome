import { defineConfig, devices } from "@playwright/test";

/* ── Tests de bout en bout (REBUILD.md §8) ───────────────────────────────────

   Trois fichiers :
     · smoke.spec.ts        — routes publiques, routes de membre fermées,
                              pôles parqués redirigés ;
     · honesty.spec.ts      — aucune preuve sociale fabriquée ni affirmation
                              non vérifiée sur les pages publiques ;
     · publish-flow.spec.ts — le parcours complet (compte, photos, prime,
                              modification, retrait). DÉSACTIVÉ par défaut :
                              il crée et supprime de vrais comptes dans la base
                              Supabase configurée. Activer : E2E_SUPABASE=1.

   Port dédié (3100) : un `npm run dev` ouvert sur 3002 n'est pas perturbé.
   Hôte `localhost` et non `127.0.0.1` : le serveur de développement de Next
   les traite comme deux origines et refuserait d'hydrater la page. */

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 90_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    locale: "fr-CH",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    command: `npx next dev --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
