"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatFcfa } from "@/lib/utils/format";
import { duration as motionDuration, ease as motionEase } from "@/lib/motion/tokens";

/**
 * Montant animé (prime) : interpolation douce, aria-live pour les lecteurs
 * d'écran, Geist Mono tabulaire. Durées/courbes issues des tokens motion.
 */
export function AmountDisplay({
  value,
  className,
  suffix = true,
  duration = motionDuration.fast,
}: {
  value: number;
  className?: string;
  suffix?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  /** Dernière valeur réellement affichée (mise à jour dans les callbacks anim). */
  const shown = useRef(value);

  useEffect(() => {
    const from = shown.current;
    if (from === value) return; // déjà affiché : rien à animer, aucun setState
    const controls = animate(from, value, {
      duration,
      ease: motionEase.out,
      onUpdate: (v) => {
        shown.current = v;
        setDisplay(v);
      },
      onComplete: () => {
        shown.current = value;
        setDisplay(value);
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span ref={ref} className={cn("tnum", className)} aria-live="polite">
      {formatFcfa(display, { suffix })}
    </span>
  );
}
