"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, initGsap, SplitText, ScrollTrigger } from "@/lib/motion/gsap";
import { duration, stagger } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

/**
 * Révélation de titre : SplitText par lignes, chaque ligne monte depuis un
 * masque (yPercent 110 → 0), duration.slow, stagger.base, amsOut.
 * Une seule façon de révéler un titre dans tout le site.
 */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  trigger = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** false = révèle immédiatement au montage (au-dessus de la ligne de flottaison). */
  trigger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      initGsap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = new SplitText(el, {
        type: "lines",
        linesClass: "ams-line",
        mask: "lines",
      });

      gsap.fromTo(
        split.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: duration.slow,
          ease: "amsOut",
          stagger: stagger.base,
          delay,
          ...(trigger
            ? {
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }
            : {}),
          onComplete: () => ScrollTrigger.refresh(),
        }
      );

      return () => split.revert();
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <Tag ref={ref} className={cn("[&_.ams-line]:will-change-transform", className)}>
      {children}
    </Tag>
  );
}
