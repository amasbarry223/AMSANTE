/**
 * AMSANTÉ — Motion tokens.
 * Source unique de vérité : aucune durée ni courbe ne doit être codée en dur
 * ailleurs dans le codebase.
 */

export const ease = {
  /** "expo.out" : entrées, révélations */
  out: [0.16, 1, 0.3, 1] as const,
  /** transitions de page, morphings */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** UI interactive */
  spring: { type: "spring", stiffness: 260, damping: 26 } as const,
  /** ressort plus doux pour les montants */
  softSpring: { type: "spring", stiffness: 120, damping: 24 } as const,
} as const;

export const duration = {
  micro: 0.18,
  fast: 0.35,
  base: 0.6,
  slow: 1.0,
  story: 1.4,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** Variantes Motion réutilisables — le vocabulaire de mouvement du site. */

/** Révélation de bloc : opacity 0→1, y 24→0. */
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.base, ease: ease.out },
} as const;

/** Apparition simple (fondu). */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: duration.slow, ease: ease.out },
} as const;

/** Glissement horizontal entre étapes d'un tunnel. */
export const stepSlide = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -40 : 40 }),
  transition: { duration: duration.fast, ease: ease.out },
} as const;

/** Hover carte : élévation. */
export const cardHover = { y: -4 } as const;

/** Conteneur stagger pour les listes. */
export const staggerContainer = (gap: number = stagger.base) => ({
  animate: { transition: { staggerChildren: gap } },
});

export const staggerItem = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
} as const;
