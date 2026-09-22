import { defineConfig, devices } from "@playwright/test";

/* ── Tests de bout en bout ──────────────────────────────────────────────────

   Le seul parcours couvert est celui du formulaire de la landing : c'est le
   seul endroit de l'application qui écrit vraiment quelque part, et le seul
   qu'aucune vérification statique ne peut valider de bout en bout.

   Le serveur tourne en mode développement, et ce n'est pas un raccourci :
   `src/lib/leads/store.ts` refuse délibérément le stockage fichier en
   production, pour ne pas accepter des inscriptions et les perdre en silence
   sur un système de fichiers éphémère. Un `next start` ferait donc échouer
   chaque envoi. Le test s'exécute avec le magasin JSON local, sans projet
   Supabase — la couche de stockage étant derrière une interface commune, le
   chemin exercé est celui de la production, à l'implémentation près.

   Port dédié : un `npm run dev` déjà ouvert sur 3002 ne perturbe pas les
   tests, et les tests ne lui écrasent pas ses données.

   L'hôte est `localhost`, pas `127.0.0.1`. Le serveur de développement de
   Next traite les deux comme des origines distinctes et refuse alors de
   servir ses propres ressources à la seconde. La page s'affiche mais React
   ne s'hydrate jamais : rien n'est cliquable, aucune erreur n'apparaît, et
   cela ressemble trait pour trait à un bug applicatif. */

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  /* Le magasin fichier est partagé par toutes les épreuves : elles doivent
     s'exécuter l'une après l'autre. */
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 60_000,
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
    env: {
      /* Sel de test : la limite de débit passe alors par le magasin, comme en
         production. Sans lui, elle retomberait sur le compteur mémoire et le
         test n'exercerait pas le bon chemin. */
      LEAD_IP_SALT: "sel-de-test-uniquement-pour-playwright",
    },
  },
});
