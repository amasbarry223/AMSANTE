/**
 * État partagé entre le scroll GSAP (section hero épinglée) et la boucle
 * de rendu R3F. Objet mutable module-level : zéro re-render React.
 */
export const heroState = {
  /** 0 → 1 sur la longueur de la section épinglée. */
  progress: 0,
  /** Position pointeur normalisée -1 → 1. */
  mouseX: 0,
  mouseY: 0,
};

export function resetHeroState() {
  heroState.progress = 0;
  heroState.mouseX = 0;
  heroState.mouseY = 0;
}
