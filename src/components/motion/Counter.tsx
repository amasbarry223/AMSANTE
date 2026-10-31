"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatFcfa } from "@/lib/utils/format";
import { duration as motionDuration, ease as motionEase } from "@/lib/motion/tokens";

/**
 * Compteur animé : montants interpolés avec un ressort (jamais de saut brut).
 * Montants en FCFA (Geist Mono tabulaire) ou nombres simples.
 */
export function Counter({
  value,
  format = "number",
  className,
  duration = motionDuration.slow,
}: {
  value: number;
  format?: "number" | "fcfa";
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const from = reduced ? value : 0;
    if (reduced) {
      el.textContent =
        format === "fcfa" ? formatFcfa(value) : new Intl.NumberFormat("fr-FR").format(value);
      return;
    }
    const controls = animate(from, value, {
      duration,
      ease: motionEase.out,
      onUpdate: (v) => {
        el.textContent =
          format === "fcfa"
            ? formatFcfa(v)
            : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, value, format, reduced, duration]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {format === "fcfa" ? formatFcfa(0) : "0"}
    </span>
  );
}
