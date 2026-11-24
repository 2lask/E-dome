# Feuille de route — de la spécification « Module de disruption » à E-Dome

Source : `MODULE DE DISRUPTION IMMOBILIÈRE — Spé.md` (24.11.2026). Ce document
relie chaque section de la spécification à l'état réel du produit, et dit ce
qui bloque (légal, partenaires, données). Mis à jour le 24.11.2026.

**Légende :** ✅ livré · 🟡 partiel · 🔜 prochaine étape · ⛔ bloqué (prérequis externe)

## Les 10 fonctions d'agence (§3)

| # | Fonction | État | Dans E-Dome | Prochaine étape / prérequis |
|---|---|---|---|---|
| 1 | Estimation | ⛔ | Prix au m² affiché sur l'annonce | Données de transactions réelles (registre foncier, indices sous licence). Pas d'estimation tant qu'elle serait inventée. |
| 2 | Création de l'annonce | ✅ | Photos, vidéo, texte rédigé avec le copilote IA, score de qualité | Plans, visite 360° |
| 3 | Diffusion multi-portails | ⛔ | Partage tracé (WhatsApp, lien d'apporteur), aperçu de partage soigné | Accords de diffusion (Homegate, ImmoScout24, Newhome) |
| 4 | Prospection vendeur | 🔜 | — | Uniquement sur signaux internes et consentis (nLPD) ; pas de données de divorce ou de décès |
| 5 | Matching acheteur–bien | 🟡 | Apporteurs qui recommandent avec un lien tracé | Recherches enregistrées + alertes |
| 6 | Visites | 🟡 | Demande de visite avec date souhaitée | Agenda de créneaux ; « Local Helpers » (§7) |
| 7 | Qualification acheteur | 🟡 | Statut de financement noté sur chaque offre | Open Banking suisse (bLink/SIX) : partenariat |
| 8 | Négociation | ✅ | Offres : montant, financement, conditions, validité ; accepter, refuser, contre-offre ; écart au prix demandé | Assistant IA d'analyse d'offre |
| 9 | Documents juridiques | ⛔ | Rappels légaux (Lex Koller, art. 216 CO) | En Suisse, l'acte de vente est rédigé par le notaire ; signature électronique qualifiée (Skribble) pour les documents annexes |
| 10 | Suivi jusqu'au closing | ✅ | Pipeline lead → visite → offre → étapes jusqu'à l'acte → vendu ; commission calculée et réglée | Notifications de relance (e-mail : Resend à configurer) |

## Les autres modules

| Section | État | Raison |
|---|---|---|
| §14 Séquestre / escrow, flux de fonds | ⛔ | Tenir des fonds de tiers = intermédiaire financier (LBA : affiliation à un OAR) ou partenaire agréé. Aujourd'hui : règlements directs suivis, E-Dome ne détient rien. |
| §10 Courtage hypothécaire | ⛔ | Activité encadrée (LSFin/LEFin selon le modèle) ; partenariat bancaire nécessaire. |
| §11 KYC / AML | 🔜 | Prestataire d'identité (contrat) avant toute transaction financière. |
| §15 Gestion locative | 🟡 | Annonces de location et dossier locataire existent dans le code, hors navigation du lancement. |
| §16 Assurances | ⛔ | Intermédiation d'assurance : cadre LSA, inscription au registre FINMA selon le statut (à vérifier avec un juriste). |
| §18 Économie « gig » | ✅ (apporteurs) | Les apporteurs gagnent une commission d'indication (art. 412 ss CO). Local Helpers : 🔜, après cadrage du statut (indépendant / travail sur appel). |

## Alternatives aux points bloqués

Pour chaque point ⛔, ce qui est faisable sans autorisation ni partenaire, et
le partenaire qui le débloquera ensuite.

| Point bloqué | Alternative livrée ou possible maintenant | Partenaire pour la suite |
|---|---|---|
| Estimation (§4) | Prix au m² sur l'annonce ; comparables E-Dome dès qu'il y aura assez de biens par ville | PriceHubble (API d'estimation et widget « Lead Generator », déjà utilisés par des banques suisses) ; indice IMPI de l'OFS pour les tendances (conditions « OPEN-BY-ASK » : demander l'autorisation à impi@bfs.admin.ch) |
| Diffusion multi-portails (§5) | ✅ **Kit de diffusion** dans Mes biens : texte prêt à coller, newhome.ch (publication gratuite, portail des banques cantonales), Homegate, ImmoScout24, groupes locaux ; le lien E-Dome garde le suivi | Accord de diffusion (flux XML) avec un portail |
| Séquestre / escrow (§14) | ✅ Les étapes suivent les mécanismes suisses existants : **promesse de paiement irrévocable** de la banque de l'acheteur, **acompte déposé chez le notaire** ; commission réglée en direct (TWINT, virement) et suivie | QR-facture suisse pour la commission (bibliothèque libre `swissqrbill` ; il faut ajouter NPA et localité au profil de paiement) ; prestataire de paiement agréé plus tard |
| Courtage hypothécaire (§10) | ✅ **Calculateur « Puis-je me l'offrir ? »** sur chaque bien à vendre : règle usuelle des banques (taux théorique 5 %, amortissement et entretien ~1 %, charges ≤ 1/3 du revenu, 20 % de fonds propres) ; indicatif, rien n'est enregistré | Programme d'apport avec un intermédiaire hypothécaire autorisé : il conseille, E-Dome oriente |
| Documents juridiques (§12) | ✅ **Liste des documents pour le notaire** dans le parcours de vente ; rappels art. 216 CO et Lex Koller | Signature électronique qualifiée (Skribble) pour les documents annexes |
| KYC (§11) | E-mail vérifié ; le notaire vérifie l'identité de chaque partie à l'acte | Vérification d'identité (SwissID ou prestataire) avant tout flux financier |
| Assurances (§16) | Aucune recommandation de produit (risque d'intermédiation) | Partenaire inscrit comme intermédiaire |

Sources consultées le 24.11.2026 : UBS (capacité financière, fonds propres,
promesses de paiement irrévocables), PostFinance (charges de 1 %), RealAdvisor
et immobilier.ch (paiement et acompte chez le notaire), alle-immobilien.ch
(newhome.ch gratuit), OFS (IMPI), PriceHubble (cas clients suisses), npm
`swissqrbill`.

## Données de marché de la spécification

Les chiffres de marché de la spécification (taille du marché, part FSBO, volumes
de Neho, projections à 5 ans) sont **à sourcer** avant tout usage public : ne
reprendre dans un pitch que ceux dont la source primaire a été vérifiée.

## Ordre proposé après le lancement

1. Activer les e-mails (Resend) : relances et notifications du parcours.
2. Assistant IA d'analyse d'offre (copilote existant + offres de la migration 010).
3. Recherches enregistrées + alertes (matching §6.2, sur données internes).
4. Agenda de visites par créneaux.
5. Partenariats : un portail de diffusion, un prestataire d'identité, une banque.
