"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

/**
 * CTA primaire unique du site : même forme (pill), même couleur (teal-900),
 * même comportement magnétique, partout. Utiliser pour « Simuler ma prime »,
 * les CTA finaux, etc.
 */
export function PrimaryCta({
  href,
  children,
  className,
  size = "lg",
  variant = "default",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "lg" | "xl";
  /** Sur fond sombre, utiliser "on-dark". */
  variant?: "default" | "on-dark";
}) {
  return (
    <Magnetic>
      <Button asChild size={size} variant={variant} className={cn("min-h-11", className)}>
        <Link href={href}>
          {children}
        </Link>
      </Button>
    </Magnetic>
  );
}
