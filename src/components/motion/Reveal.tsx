"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

/**
 * Apparition de bloc au scroll : opacity 0→1, y 24→0, une seule fois,
 * déclenchée quand le bloc entre à 80 % du viewport.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: duration.base, ease: ease.out, delay }}
    >
      {children}
    </Comp>
  );
}

/** Stagger container : children directs utilisent `<StaggerItem>`. */
export function StaggerContainer({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: duration.base, ease: ease.out },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Petit label de section en pill. */
export function Eyebrow({
  children,
  className,
  tone = "teal",
}: {
  children: ReactNode;
  className?: string;
  tone?: "teal" | "ochre" | "light";
}) {
  const tones = {
    teal: "bg-teal-100 text-teal-900",
    ochre: "bg-ochre-100 text-ochre-500",
    light: "bg-white/10 text-teal-100 border border-white/15",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
