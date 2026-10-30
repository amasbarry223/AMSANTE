"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

/**
 * Bouton magnétique pour les CTA principaux : attraction ≤ 10 px vers le
 * curseur, ressort ease.spring. Desktop uniquement (pointeur fin).
 */
export function Magnetic({
  children,
  className,
  strength = 10,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, ease.spring as { stiffness: number; damping: number });
  const sy = useSpring(y, ease.spring as { stiffness: number; damping: number });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);
        const max = Math.max(rect.width, rect.height) / 2 + 24;
        if (dist < max) {
          x.set(Math.max(-strength, Math.min(strength, dx * 0.35)));
          y.set(Math.max(-strength, Math.min(strength, dy * 0.35)));
        } else {
          x.set(0);
          y.set(0);
        }
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
