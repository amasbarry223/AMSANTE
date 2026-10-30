"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatFcfa } from "@/lib/utils/format";

/**
 * Montant animé (prime) : interpolation douce, aria-live pour les lecteurs
 * d'écran, Geist Mono tabulaire.
 */
export function AmountDisplay({
  value,
  className,
  suffix = true,
  duration = 0.5,
}: {
  value: number;
  className?: string;
  suffix?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    if (from === value) return;
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => {
        prev.current = value;
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
