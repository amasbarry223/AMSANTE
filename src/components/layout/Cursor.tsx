"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Curseur personnalisé : point + anneau qui grossit sur les éléments
 * interactifs. Uniquement sur pointeur fin ; le curseur natif reste visible
 * (jamais masqué, notamment sur les champs de saisie).
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(
        !!target?.closest("a, button, [role='button'], input, textarea, select, [data-cursor-grow]")
      );
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* point */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500"
        style={{ x, y }}
      />
      {/* anneau */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-teal-500/70"
        style={{ x: rx, y: ry }}
        animate={{
          width: hovering ? 44 : 26,
          height: hovering ? 44 : 26,
          opacity: hovering ? 0.9 : 0.55,
        }}
        transition={{ duration: 0.18 }}
      />
    </>
  );
}
