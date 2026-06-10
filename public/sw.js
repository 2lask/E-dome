/* Kill-switch Service Worker — vide les caches accumulees par les
   anciennes versions (edome-v10 etc.), se desinscrit, puis force le
   reload des onglets ouverts.

   Contexte : l'ancien sw.js precachait /dashboard en network-first
   avec fallback cache. Les utilisateurs qui ont visite le site avant
   2026-06-10 voient l'ancien /dashboard servi depuis ce cache, malgre
   les deploiements (34 reservations, Studio Centre-Ville, etc.).
   Ce stub neutralise le SW chez tout visiteur deja "infecte". */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        try {
          client.navigate(client.url);
        } catch {
          /* navigate peut echouer si le client n'est plus controle ;
             on ignore silencieusement, le prochain reload manuel
             chargera la version a jour. */
        }
      }
    })(),
  );
});

/* Fetch handler intentionnellement absent : on laisse le navigateur
   faire ses requetes reseau normalement, plus aucune mise en cache. */
