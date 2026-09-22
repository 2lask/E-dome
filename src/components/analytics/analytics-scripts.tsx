import Script from "next/script";

/* ── Scripts de mesure, conditionnels ───────────────────────────────────────

   Ce composant ne rend RIEN si aucune variable d'environnement n'est
   renseignée. C'est le comportement par défaut : la landing n'installe alors
   aucun cookie de mesure et ne contacte aucun tiers, ce qui est cohérent avec
   la politique de confidentialité.

   Plausible est privilégié : sans cookie, sans donnée personnelle, hébergé en
   Europe. Une bannière de consentement n'est pas nécessaire pour lui, ce qui
   n'est pas le cas de la plupart des alternatives.

   PostHog est proposé pour un besoin plus fin (entonnoirs, enregistrements).
   Attention si vous l'activez : il installe des cookies et identifie les
   visiteurs, ce qui impose alors une bannière de consentement ET une mise à
   jour de la politique de confidentialité, qui affirme aujourd'hui
   n'utiliser aucun traçage tiers. Ne l'activez pas sans traiter ces deux
   points.

   `afterInteractive` : la mesure ne doit pas retarder l'affichage. */

export function AnalyticsScripts() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

  if (!plausibleDomain && !posthogKey) return null;

  return (
    <>
      {plausibleDomain && (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
          strategy="afterInteractive"
        />
      )}

      {posthogKey && (
        /* Amorce officielle de PostHog. Elle définit `window.posthog` avant le
           chargement du paquet, pour que `track()` ne perde pas les évènements
           déclenchés tôt. */
        <Script id="posthog-init" strategy="afterInteractive">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init(${JSON.stringify(
            posthogKey,
          )},{api_host:${JSON.stringify(posthogHost)},person_profiles:"identified_only"});`}
        </Script>
      )}
    </>
  );
}
