import {
  Briefcase,
  Building2,
  GraduationCap,
  Handshake,
  Heart,
  LayoutDashboard,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import type { NavIcon } from "@/lib/demo/actors";

/* Les icônes de « Mon espace » (navigation de la personne incarnée), pour la
   barre latérale permanente et le tiroir mobile. */
export const ACTOR_NAV_ICONS: Readonly<Record<NavIcon, LucideIcon>> = {
  dashboard: LayoutDashboard,
  agency: Building2,
  referral: Handshake,
  formations: GraduationCap,
  services: Briefcase,
  favorites: Heart,
  profile: UserIcon,
};
