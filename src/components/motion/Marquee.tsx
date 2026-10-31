"use client";

import { cn } from "@/lib/utils";

/**
 * Défilement infini (bandeau partenaires). Pause au survol.
 * Le contenu est dupliqué deux fois pour une boucle parfaite.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  duration = 42,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div
        className="flex w-max items-center motion-safe:animate-[marquee_var(--marquee-dur)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={
          {
            "--marquee-dur": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-16 pr-16">{children}</div>
        {/* Le duplicata est masqué aux lecteurs d'écran : la boucle reste purement visuelle. */}
        <div aria-hidden className="flex items-center gap-16 pr-16">{children}</div>
      </div>
      {/* Fondu latéral */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
