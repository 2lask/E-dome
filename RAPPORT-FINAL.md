# Rapport final — reprise de la plateforme E-Dome

*Écrit pour le fondateur. Branche `feat/plateforme-v2`, non fusionnée.*

Vous m'avez confié le projet en entier, avec un critère ultime : **quelqu'un qui
ouvre la maquette sans vous à côté doit comprendre en trente secondes ce qu'est
E-Dome, qui paie quoi, et ce qui existe déjà par rapport à ce qui viendra.** Ce
rapport dit ce que j'ai fait, ce que j'ai décidé seul, ce qui reste ouvert, ce
que je recommande, et ce que je referais autrement.

---

## 1. Ce qui a été fait

Huit étapes, une par thème, chacune vérifiée verte (typecheck, lint, build,
tests) avant la suivante. Le détail est dans `CHANGELOG-V2.md` ; l'essentiel :

**Le socle d'abord, l'écran neuf ensuite.** Rien de neuf ne s'est affiché tant
que les chiffres pouvaient se contredire. Les trois premières étapes ont posé un
modèle de domaine (dont les quatre règles comme objet, impossibles à afficher à
moitié), fait converger les revenus sur un journal unique — le « facteur 5 » a
disparu — et rendu le fil crédible. Le premier écran neuf, `/demo`, n'est arrivé
qu'après.

**Le critère des trente secondes est atteignable.** `/demo` répond aux trois
questions dans l'ordre, « qui paie quoi » avant les fonctionnalités. Le sélecteur
de rôle laisse parcourir toute la plateforme en huit clics — je l'ai chronométré
à onze secondes de temps machine. La visite guidée enchaîne six écrans qui
racontent le modèle.

**Le modèle économique est lisible et honnête.** `/vendre` montre « 0 CHF à
E-Dome » des deux côtés ; le panneau de flux d'argent décompose chaque
transaction, frais de paiement compris ; `/tarifs` est générée depuis le
catalogue, donc incapable de mentir ; les conditions énoncent les quatre règles
en §2, avant les prix. La commission de courte durée, qui était ajoutée au prix
du voyageur, est revenue du bon côté — sur l'hôte.

**Toute affirmation de traction sur E-Dome a été retirée**, et un test empêche
son retour. Les données fictives d'un utilisateur restent, parce que c'est le
rôle d'une démonstration ; ce qui dégage, ce sont les chiffres qui parlaient
d'E-Dome elle-même.

---

## 2. Ce que j'ai décidé seul (et que vous devez pouvoir défaire)

- **Le sélecteur de rôle vit dans le bandeau global, pas dans une sidebar.**
  Parce que le tableau de bord a sa propre chrome : c'était le seul emplacement
  présent sur toutes les routes. Sans quoi la visite s'interrompait au premier
  tableau de bord.
- **Le panneau de flux d'argent n'est posé, pour l'instant, que sur une fiche de
  bien.** Le plan le voulait sur six écrans. Le composant est générique et prêt ;
  je l'ai posé là où il est le plus parlant pour un investisseur, et j'ai noté
  les cinq autres emplacements dans `TODO.md` plutôt que de les bâcler.
- **La porte « Propriétaire » de la visite a d'abord visé `/publier`**, faute de
  `/vendre`, puis a été repointée. Une porte ne mène jamais sur un 404 : c'est la
  règle que je me suis donnée pour la maquette.
- **`/demo` sur téléphone masque la ligne d'explication de chaque pôle** pour que
  les trois blocs tiennent. C'est un compromis de densité ; sur un très petit
  écran, la visite scrolle un peu pour atteindre les portes.
- **Les icônes ont été générées avec `sharp`** (déjà présent, installé par Next),
  sans nouvelle dépendance — mais leur typographie dépend de la machine qui
  rastérise, ce que le script documente.

---

## 3. Ce qui reste ouvert

**Reliquat de l'étape 8** (dans `TODO.md`) : un balayage complet des boutons sans
gestionnaire (j'ai traité les deux réellement morts sur quatre suspects), les
encarts pointant vers des adresses inexistantes, et deux épreuves Playwright
supplémentaires (`no-dead-buttons`, cohérence du flux d'argent).

**Sécurité, et c'est le point le plus sérieux.** `/admin` reste atteignable sans
compte tant que Supabase n'est pas configuré — la console de modération est donc
publique en production. Un bandeau prévient, mais **ce n'est pas une porte**.
`/api/ai/chat` appelle l'API avec la clé du projet sans vérifier l'appelant. Ces
deux points sont dans `TODO.md`, section Sécurité, avec le correctif à côté.

**Les questions à l'avocat** sont dans `JURIDIQUE-A-VALIDER.md`, tenu à jour au
fil des étapes. La plus urgente reste le **numéro d'enregistrement de courte
durée**, exigible depuis mai 2026. L'arbitrage frais directs / frais
destinataires y est documenté comme un choix à trancher, pas comme une dépendance
résolue.

**La viabilité économique** : le §8 de `DECISIONS.md` porte le risque tel que le
comptable l'a formulé, sans l'adoucir. Il tient toujours.

---

## 4. Ce que je recommande ensuite

1. **Vous testez la préproduction.** Le déroulement prévu était : nettoyer,
   déployer, vous testez, puis production. Rien n'est fusionné ; la décision de
   passer sur `edome-demo.vercel.app` vous revient.
2. **Fermer `/admin` avant toute fusion** — c'est un correctif d'une heure
   (mot de passe serveur, comme `/admin/leads`), et il ne devrait pas attendre.
3. **Faire relire `JURIDIQUE-A-VALIDER.md` par l'avocat**, en priorité l'arbitrage
   des frais et le numéro d'enregistrement. Le modèle représente déjà les deux
   schémas d'encaissement, donc son verdict ne casse pas l'architecture.
4. **Étendre le panneau de flux d'argent** aux quatre autres écrans de
   transaction — c'est ce qui parle le mieux à un investisseur, et le composant
   est prêt.
5. **Finir le reliquat de l'étape 8** avant la démonstration à un tiers.

---

## 5. Ce que je ferais différemment

- **J'aurais posé le panneau de flux d'argent partout dès sa création.** L'avoir
  construit générique puis posé à un seul endroit était prudent pour le budget,
  mais ça laisse une brique à moitié branchée que je dois documenter au lieu de
  livrer.
- **J'ai diagnostiqué `appleWebApp` faux trois fois avant de lire les sources de
  Next.** La leçon — vérifier dans le code de l'outil plutôt que supposer — je
  l'ai appliquée ensuite (les conventions d'icônes, les invariants qui se
  comparaient à eux-mêmes), mais elle m'a coûté un aller-retour au début.
- **Le sélecteur de rôle et le bandeau-légende auraient pu être pensés ensemble
  dès le départ.** Je les ai construits séparément avant de comprendre qu'ils
  devaient partager le même emplacement global ; les fusionner après a demandé
  de défaire un peu.

---

*Portes de qualité au dernier commit : typecheck 0, lint 0 erreur, build 66
pages, Playwright 13/13, test:data 18/18. Documents de reprise à jour : `PLAN.md`
(avec un « point de reprise » en tête), `DECISIONS.md`, `TODO.md`,
`JURIDIQUE-A-VALIDER.md`, `CHANGELOG-V2.md`.*
