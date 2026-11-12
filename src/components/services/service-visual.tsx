import { createElement } from "react";
import {
  Camera, Palette, Ruler, Hammer, Hotel, Car, Scale, Briefcase, Package, HardHat, Wrench, type LucideIcon,
} from "lucide-react";

/* Visuel d'un service : un dégradé et l'icône de sa catégorie. Pas de photo
   d'illustration générique — le visage, c'est celui du prestataire. */

const ICONS: Record<string, LucideIcon> = {
  Photographie: Camera,
  Décoration: Palette,
  Architecture: Ruler,
  "Architecture & Design": Ruler,
  Rénovation: Hammer,
  Conciergerie: Hotel,
  Transport: Car,
  Juridique: Scale,
  Finance: Briefcase,
  Déménagement: Package,
  "Construction & Gros œuvre": HardHat,
};

const GRADIENTS: Record<string, string> = {
  Photographie: "from-emerald-500 to-teal-600",
  Décoration: "from-rose-500 to-pink-600",
  Architecture: "from-indigo-500 to-violet-600",
};

export function categoryIcon(category: string): LucideIcon {
  return ICONS[category] ?? Wrench;
}

/** L'icône d'une catégorie (créée par `createElement`, pas un composant local). */
export function CategoryIcon({ category, size = 14, className, strokeWidth }: { category: string; size?: number; className?: string; strokeWidth?: number }) {
  return createElement(categoryIcon(category), { size, className, strokeWidth, "aria-hidden": true });
}

export function ServiceCover({ category, className = "h-32", iconSize = 48 }: { category: string; className?: string; iconSize?: number }) {
  return (
    <div className={`bg-gradient-to-br ${GRADIENTS[category] ?? "from-sky-500 to-blue-600"} flex items-center justify-center ${className}`}>
      <CategoryIcon category={category} size={iconSize} className="text-white/90" strokeWidth={1.5} />
    </div>
  );
}
