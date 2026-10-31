"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * Stepper de tunnel : indicateur animé avec Motion `layoutId`,
 * progression en %, étapes validées cochées.
 */
export function Stepper({
  steps,
  current,
  className,
  onStepClick,
}: {
  steps: string[];
  current: number;
  className?: string;
  onStepClick?: (index: number) => void;
}) {
  const progress = Math.round((current / (steps.length - 1)) * 100);
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em]">
        <span className="text-muted-foreground">
          Étape <span className="tnum text-foreground">{current + 1}</span> /{" "}
          <span className="tnum">{steps.length}</span>
        </span>
        <span className="tnum text-teal-700" aria-live="polite">
          {progress} %
        </span>
      </div>
      {/* barre de progression */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-teal-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: duration.base, ease: ease.out }}
        />
      </div>
      {/* étiquettes */}
      <ol className="mt-3 hidden gap-1.5 md:flex">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <li key={label} className="relative flex-1">
              <button
                type="button"
                disabled={i >= current || !onStepClick}
                onClick={() => onStepClick?.(i)}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium transition-colors",
                  state === "active" && "text-teal-900",
                  state === "done" && "text-muted-foreground hover:text-teal-700",
                  state === "todo" && "text-muted-foreground/50",
                  i < current && onStepClick && "cursor-pointer"
                )}
              >
                <span
                  className={cn(
                    "relative flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                    state === "active" && "bg-teal-900 text-sand-50",
                    state === "done" && "bg-teal-100 text-teal-900",
                    state === "todo" && "bg-sand-200 text-muted-foreground"
                  )}
                >
                  {state === "active" && (
                    <motion.span
                      layoutId="stepper-active"
                      className="absolute inset-0 rounded-full bg-teal-900"
                      transition={{ duration: duration.fast, ease: ease.out }}
                    />
                  )}
                  <span className={cn("relative", state === "active" && "text-sand-50")}>
                    {state === "done" ? <Check className="size-3" /> : <span className="tnum">{i + 1}</span>}
                  </span>
                </span>
                <span className="hidden xl:inline">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-2.5 text-center text-[13px] font-medium text-foreground md:hidden">
        {steps[current]}
      </p>
    </div>
  );
}
