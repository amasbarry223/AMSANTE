"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

/**
 * CTA primaire unique du site : même forme (pill), même couleur (teal-900),
 * même comportement magnétique, partout. Utiliser pour « Simuler ma prime »,
 * les CTA finaux, etc.
 * - `href` : navigation interne (cas général).
 * - `onClick` : action directe sans navigation (ex. « Réessayer » de la 500).
 */
export function PrimaryCta({
  href,
  onClick,
  children,
  className,
  size = "lg",
  variant = "default",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "lg" | "xl";
  /** Sur fond sombre, utiliser "on-dark". */
  variant?: "default" | "on-dark";
}) {
  return (
    <Magnetic>
      {href ? (
        <Button asChild size={size} variant={variant} className={cn("min-h-11", className)}>
          <Link href={href}>
            {children}
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onClick}
          size={size}
          variant={variant}
          className={cn("min-h-11", className)}
        >
          {children}
        </Button>
      )}
    </Magnetic>
  );
}
