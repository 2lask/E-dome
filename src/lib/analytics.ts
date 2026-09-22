/* ── Mesure d'audience, sans rien charger par défaut ────────────────────────

   Rien n'est chargé ni envoyé tant qu'une variable d'environnement n'est pas
   renseignée. Le composant `AnalyticsScripts` n'insère aucun script si
   `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` et `NEXT_PUBLIC_POSTHOG_KEY` sont absentes,
   et `track()` devient alors une fonction vide.

   Conséquence voulue : par défaut, la landing n'installe aucun cookie de
   mesure et ne contacte aucun tiers. C'est cohérent avec la politique de
   confidentialité, qui annonce l'absence de traçage publicitaire — une
   promesse que l'audit avait relevée comme tenue, et qu'il ne faut pas
   casser en ajoutant un script « juste pour voir ».

   Plausible et PostHog sont tous deux gérés : celui qui est configuré reçoit
   l'évènement, les deux si les deux le sont. */

export type AnalyticsEvent =
  | "form_started"
  | "form_step_completed"
  | "form_submitted"
  | "demo_clicked"
  | "referral_copied";

type Props = Record<string, string | number | boolean>;

interface PlausibleFn {
  (event: string, options?: { props?: Props }): void;
}

interface PostHogLike {
  capture: (event: string, props?: Props) => void;
}

declare global {
  interface Window {
    plausible?: PlausibleFn;
    posthog?: PostHogLike;
  }
}

export function isPlausibleEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
}

export function isPostHogEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

export function isAnalyticsEnabled(): boolean {
  return isPlausibleEnabled() || isPostHogEnabled();
}

/**
 * Envoie un évènement aux outils réellement configurés.
 *
 * Ne lève jamais : une mesure d'audience ne doit pas pouvoir casser un envoi
 * de formulaire. En cas de problème, l'évènement est simplement perdu.
 */
export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    window.posthog?.capture(event, props);
  } catch {
    /* Silence volontaire. */
  }
}
