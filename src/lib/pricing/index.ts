/* Tarification E-Dome — point d'import unique.

   `import { quote, PLANS } from "@/lib/pricing"`

   Le modèle est décrit dans `DECISIONS.md` §1.1 à §1.8, et les points encore
   soumis à un avis juridique dans `JURIDIQUE-A-VALIDER.md`.

   Deux règles structurent ce module, et elles sont portées par les types
   plutôt que par des commentaires :

   1. **`CommissionPole` exclut `vente` et `location-lt`.** Une commission
      proportionnelle sur un bien immobilier est l'assiette du courtage :
      `quote({ kind: "commission", pole: "vente" })` ne compile pas.
   2. **`quote()` vérifie que la somme tombe juste** avant de rendre son
      résultat. Le panneau de flux d'argent de la Partie C n'a donc rien à
      recalculer, et ne peut pas afficher un total faux.

   Rappel, parce que l'erreur a déjà été commise une fois dans ce projet : la
   règle 3 seule ne protège de rien. Ce sont les règles 1 et 2 — aucun mandat,
   aucune négociation — qui portent le critère de l'activité au sens de
   l'art. 412 CO. Voir `@/lib/model/rules`. */

export * from "./charge";
export * from "./catalog";
export * from "./quote";
