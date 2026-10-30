"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, initGsap } from "@/lib/motion/gsap";

/**
 * Tracé au scroll : stroke-dashoffset animé (motifs bogolan, timelines).
 * Le path doit avoir une longueur mesurable ; on la calcule au runtime.
 */
export function DrawPath({
  children,
  className,
  duration = 1.6,
  scrub = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  scrub?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      initGsap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const paths = root.querySelectorAll<SVGPathElement | SVGLineElement | SVGPolylineElement | SVGEllipseElement>("path, line, polyline, ellipse, circle");
      paths.forEach((p) => {
        const el = p as SVGPathElement;
        const len = el.getTotalLength?.() ?? 0;
        if (!len) return;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(el, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: scrub
            ? { trigger: root, start: "top 90%", end: "bottom 45%", scrub: 1 }
            : { trigger: root, start: "top 85%", once: true },
          duration: scrub ? undefined : duration,
          delay: scrub ? undefined : delay,
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
