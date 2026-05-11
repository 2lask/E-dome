/**
 * Barrel d'esquisses architecturales — chaque composant vit dans son propre
 * fichier sous arch/, ce barrel les ré-exporte pour que les imports
 * existants (page.tsx, cinematic-landing-hero.tsx) continuent de fonctionner.
 *
 * Style cible : plan de construction / blueprint d'architecte. Chaque
 * composant cumule plusieurs centaines de strokes (axes, grille, dim
 * lines, mullions, hachures, callouts) avec un tracé progressif au
 * whileInView once + une animation continue (drift, pulse, parallax,
 * window flicker, blinking light, etc.).
 */
export { ArchTower, ArchDraftingTable } from "./arch/tower-spiral";
export { ArchTallFacade, ArchCantilever } from "./arch/facades-blue";
export { ArchRoof, ArchFactoryFragment, ArchClockTower } from "./arch/cinematic-arch";
export { ArchAngularVolume, ArchSmallSlab } from "./arch/volumes-mixed";
