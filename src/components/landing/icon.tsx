import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  GraduationCap,
  Handshake,
  Home,
  KeyRound,
  Layers,
  LifeBuoy,
  MessagesSquare,
  Radio,
  Rocket,
  Share2,
  ShoppingBag,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

/* Résolution d'une icône depuis son nom, tel qu'écrit dans
   `src/content/landing.ts`.

   Le contenu reste déclaratif (des chaînes, pas des composants React), sans
   pour autant importer toute la bibliothèque lucide : seules les icônes
   réellement citées figurent dans cette table, donc seules celles-là entrent
   dans le bundle. Ajouter une icône au contenu impose de l'ajouter ici. */

const ICONS = {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  GraduationCap,
  Handshake,
  Home,
  KeyRound,
  Layers,
  LifeBuoy,
  MessagesSquare,
  Radio,
  Rocket,
  Share2,
  ShoppingBag,
  TrendingUp,
  Users,
  Wrench,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 1.7 }: IconProps) {
  const Cmp = ICONS[name as IconName];
  if (!Cmp) {
    /* Nom inconnu : on ne rend rien plutôt que de casser la page. Le nom
       fautif reste visible dans le DOM pour le repérer en développement. */
    return <span data-unknown-icon={name} aria-hidden="true" />;
  }
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
