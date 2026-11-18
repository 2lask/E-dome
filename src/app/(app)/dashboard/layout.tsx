/* ── /dashboard — parqué (REBUILD.md §3.2) ───────────────────────────────────

   Le « tableau de bord » était une application dans l'application : sa propre
   en-tête, sa propre navigation, des badges calculés sur des données fictives.
   Il est remplacé par Accueil (ce qui demande votre attention), Mes biens,
   Demandes et Gagner. Toutes les routes /dashboard/* sont redirigées par
   `next.config.ts` ; ce layout ne fait plus que passer la main, au cas où une
   page y serait rendue. Le code des sous-pages est conservé (git) pour un
   éventuel retour. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
