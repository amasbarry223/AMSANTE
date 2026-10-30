"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Défilement fluide global. Désactivé automatiquement si
 * `prefers-reduced-motion: reduce` (prop `options.autoRaf` + media query).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis
      root
      options={{
        duration: reduced ? 0 : 1.15,
        smoothWheel: !reduced,
        touchMultiplier: 1.4,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
