# E-Dome — App Expo Go

Wrapper Expo minimal qui charge la maquette web déployée sur Vercel
(`https://edome-demo.vercel.app/feed`) dans un WebView natif.

**Avantage** : tu n'as RIEN à rebuild côté mobile chaque fois qu'on push
sur le web — l'app récupère la dernière version Vercel à chaque ouverture.

## Premier lancement

Depuis le dossier `mobile/` :

```bash
npm install
npm start
```

`expo start --tunnel` lance Metro avec un tunnel ngrok (utile sur Windows
où le LAN bloque souvent). Un QR code s'affiche dans le terminal.

## Sur ton iPhone

1. Ouvre **Expo Go** (déjà installé).
2. Scanne le QR code (appareil photo iOS marche aussi).
3. Le bundle JS se télécharge → l'app s'ouvre sur le feed de la maquette.

## Pour pointer ailleurs que /feed

Édite `App.tsx`, change `DEMO_URL` :

```ts
const DEMO_URL = "https://edome-demo.vercel.app/explorer"; // ou /, /aide, etc.
```

## Limitations connues (WebView vs natif réel)

- Pas de pull-to-refresh natif (juste celui du browser, lent).
- Caméra/Apple Pay/notifications push hors de portée — c'est un WebView.
- Les gestes iOS (edge-swipe back) marchent via `allowsBackForwardNavigationGestures`,
  mais seulement entre pages web déjà visitées.

Pour ces features-là, il faudrait passer en vraie app React Native — plusieurs
semaines de réécriture (voir conversation).
