# E-Dome — thèse d'investissement

*Document de travail pour un incubateur ou une levée pré-seed (2026-11-19).
Règle : aucun chiffre de traction inventé. Les chiffres marqués **[à sourcer]**
doivent être confirmés avant toute présentation ; la traction réelle se lit dans
`/admin/traction`.*

## En une phrase
**E-Dome est la couche de récompenses de l'immobilier** : n'importe qui gagne de
l'argent en reliant la bonne personne au bon bien — et chaque transaction trouve
plus vite son acheteur, son locataire ou son vendeur.

## Le problème (réel, déjà vécu)
- **Trouver un logement** en Suisse romande est une épreuve : taux de vacance
  autour de 1 % au niveau national, plus bas à Genève et Lausanne **[à sourcer :
  OFS, dénombrement des logements vacants]**. Les gens offrent déjà des
  récompenses dans les groupes Facebook pour qu'on leur trouve un appartement.
- **Partir avant la fin du bail** oblige à trouver un locataire de remplacement
  (art. 264 CO) — dans l'urgence, sans outil.
- **Les agences paient déjà des apporteurs** (ex. Millenium Properties : au
  moins 5'000 CHF par vendeur amené), mais chacune avec son propre programme,
  opaque, payé seulement si la vente aboutit.
- **Les portails** (SMG : ImmoScout24, Homegate, Flatfox) monétisent la
  visibilité et ont augmenté leurs prix (+15 % sur les abonnements premium,
  intervention du Surveillant des prix). Ils ne mobilisent pas le réseau des gens.

## L'idée clé : la récompense dans les deux sens
| Côté | Qui | Ce qu'il offre |
|---|---|---|
| **Offre** | Propriétaire, locataire sortant, agence | Une **prime** fixe à qui amène le bon acheteur ou locataire |
| **Demande** | Chercheur de logement, agence en quête de mandats | Une **récompense** fixe à qui trouve le bon bien ou le bon vendeur |

Un seul moteur (mise en relation traçable → acceptation → montant figé dû) et
**tout le monde est apporteur**. Règles qui gardent le modèle hors du courtage
réglementé : montant fixe, dû à l'acceptation du contact, jamais un pourcentage,
E-Dome ne détient jamais les fonds (voir `MODELE.md`).

## Pourquoi ça peut devenir très grand
1. **Effet de réseau à deux faces + viralité intégrée** : chaque annonce et
   chaque recherche est un lien partageable (aperçu avec la récompense) qui
   circule sur WhatsApp et Facebook. L'acquisition est dans le produit.
2. **Fréquence** : on déménage plusieurs fois dans une vie ; le dossier de
   location réutilisable et la boîte « Demandes » ramènent les gens.
3. **Actif de données** : dossiers de locataires, recherches qualifiées
   (budget, quartier, échéance), mandats — une carte de la demande que les
   portails n'ont pas.
4. **Réplicable** ville par ville, puis vers le commercial, puis vers d'autres
   marchés tendus où le modèle est licite (à valider pays par pays — la France,
   l'Allemagne et le Portugal sont exclus en l'état, voir `MODELE.md`).

## Modèle de revenus
| Source | Mécanique | Statut |
|---|---|---|
| Part sur primes et récompenses | 12 % (3 CHF minimum) de chaque montant **accepté** | Codé ; encaissement via PSP agréé à brancher |
| Agences | Abonnement à frais fixes : programme d'apporteurs clé en main (page publique, récompenses vendeurs, primes, suivi) | Espace agence codé (`/agence`, `/agences/<adresse>`) ; formule pilote gratuite, tarif à fixer avec les agences pilotes |
| Services du déménagement | Contacts qualifiés vendus à prix fixe (nettoyage de fin de bail, déménageurs) | Planifié |
| Dossier de location | Gratuit pour le locataire ; options payantes possibles (ex. commande d'extrait des poursuites) | Dossier codé ; options à étudier |

## Indicateurs suivis (dès le premier jour)
Comptes et inscriptions hebdomadaires · annonces par type (vente, location,
reprise) · recherches actives et récompenses offertes · demandes reçues ·
mises en relation et propositions **acceptées** · volume accepté et revenu
théorique · dossiers remplis · densité par ville. → `/admin/traction`.

## Ce qui existe (produit, novembre 2026)
Publication avec vraies photos, reprise de bail, recherches à récompense,
primes, mises en relation sécurisées (coordonnées révélées après acceptation),
boîte de demandes avec historique horodaté, dossier de location réutilisable,
espace agence (programme d'apporteurs à leur nom, badge vérifié par E-Dome),
aperçus partageables, espace apporteur, copilote IA. Stack : Next.js 16,
Supabase (RLS partout), tests de bout en bout.

## Plan de lancement
1. **Neuchâtel et Lausanne** : densité avant étendue. Ambassadeurs étudiants
   (logement + revenu d'appoint), présence dans les groupes de logement,
   partenariat avec 3 à 5 agences qui ont déjà un programme d'apporteurs.
2. Suisse romande, puis Suisse alémanique (traduction allemande).
3. Agences à l'abonnement, services du déménagement, versement intégré.

## Risques et réponses
| Risque | Réponse |
|---|---|
| Cadre légal (courtage, frais à charge du locataire selon les cantons) | Modèle à montant fixe et décision de l'acceptant ; points listés dans `JURIDIQUE-A-VALIDER.md` à faire valider avant le lancement public des récompenses en location |
| Démarrage à froid | Lancement local + recherches (contenu côté demande) + agences partenaires |
| Contournement (on s'arrange hors plateforme) | Coordonnées révélées seulement après acceptation ; traçabilité horodatée |
| Paiements | PSP agréé (Stripe Connect ou Payrexx) ; E-Dome ne détient jamais les fonds |

## Où candidater (à vérifier)
Venture Kick (financement pré-seed par étapes), Innosuisse (coaching),
Fongit (Genève), Neode (parc scientifique de Neuchâtel), Platinn
(accompagnement en Suisse romande).
