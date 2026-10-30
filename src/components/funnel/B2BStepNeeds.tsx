"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useB2BQuote } from "@/stores/b2bQuote";
import { products } from "@/data/products";
import { guarantees } from "@/data/guarantees";
import type { FormulaId } from "@/data/types";
import { groupEstimate } from "@/lib/pricing";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { StepCard, StepTitle, FieldError } from "@/components/funnel/shared";
import { fieldErrors, needsSchema } from "@/components/funnel/schemas";
import { cn } from "@/lib/utils";

const MAX_PRIORITIES = 4;

/** Devis entreprise — étape 3 : besoins (formule, garanties, budget). */
export function B2BStepNeeds({ showErrors }: { showErrors: boolean }) {
  const employees = useB2BQuote((s) => s.employees);
  const dependents = useB2BQuote((s) => s.dependents);
  const formula = useB2BQuote((s) => s.formula);
  const priorities = useB2BQuote((s) => s.priorities);
  const budget = useB2BQuote((s) => s.budget);
  const patch = useB2BQuote((s) => s.patch);

  const errors = useMemo(() => {
    const parsed = needsSchema.safeParse({ formula, priorities, budget });
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [formula, priorities, budget]);
  const visible = showErrors ? errors : {};

  const estimates = useMemo(
    () =>
      Object.fromEntries(
        products.map((p) => [p.id, groupEstimate(employees, dependents, p.id)])
      ) as Record<FormulaId, ReturnType<typeof groupEstimate>>,
    [employees, dependents]
  );

  function togglePriority(label: string) {
    if (priorities.includes(label)) {
      patch({ priorities: priorities.filter((p) => p !== label) });
    } else if (priorities.length < MAX_PRIORITIES) {
      patch({ priorities: [...priorities, label] });
    }
  }

  const atMax = priorities.length >= MAX_PRIORITIES;

  return (
    <StepCard>
      <StepTitle
        title="Vos besoins"
        hint="Une base de travail pour votre conseiller — tout reste ajustable dans la convention."
      />

      {/* Formule souhaitée */}
      <p className="mb-2.5 text-[13px] font-semibold">Formule souhaitée</p>
      <div role="radiogroup" aria-label="Formule souhaitée" className="grid gap-3 sm:grid-cols-3">
        {products.map((p) => {
          const active = formula === p.id;
          const est = estimates[p.id];
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => patch({ formula: p.id })}
              className={cn(
                "flex min-h-11 flex-col rounded-[16px] border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-teal-500",
                active
                  ? "border-teal-500 bg-teal-50/60 shadow-soft ring-1 ring-teal-500/40"
                  : "border-sand-200 bg-white hover:border-teal-500/50 hover:shadow-soft"
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-[16px] font-bold">{p.name}</span>
                {active && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-teal-900 text-sand-50">
                    <Check className="size-3" aria-hidden />
                  </span>
                )}
              </span>
              <span className="mt-0.5 text-[12.5px] text-muted-foreground">{p.tagline}</span>
              <span className="tnum mt-3 text-[12.5px] font-semibold text-teal-700">
                <AmountDisplay value={est.low} suffix={false} /> –{" "}
                <AmountDisplay value={est.high} suffix={false} /> FCFA/an
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={visible["formula"]} />

      {/* Garanties prioritaires */}
      <div className="mt-7">
        <p className="mb-2.5 text-[13px] font-semibold">
          Garanties prioritaires{" "}
          <span className="tnum text-muted-foreground">
            ({priorities.length}/{MAX_PRIORITIES})
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {guarantees.map((g) => {
            const active = priorities.includes(g.label);
            const disabled = !active && atMax;
            return (
              <motion.button
                key={g.key}
                type="button"
                aria-pressed={active}
                disabled={disabled}
                onClick={() => togglePriority(g.label)}
                whileTap={disabled ? undefined : { scale: 0.96 }}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-500",
                  active
                    ? "border-teal-500 bg-teal-900 text-sand-50"
                    : disabled
                      ? "cursor-not-allowed border-sand-200 bg-sand-100 text-muted-foreground/60"
                      : "border-sand-300 bg-white text-ink hover:border-teal-500/60 hover:bg-teal-100/50"
                )}
              >
                {g.label}
              </motion.button>
            );
          })}
        </div>
        {atMax ? (
          <p className="mt-2 text-[12.5px] text-muted-foreground" aria-live="polite">
            4 garanties prioritaires maximum — retirez-en une pour changer.
          </p>
        ) : (
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Les garanties qui comptent le plus pour vos équipes.
          </p>
        )}
        <FieldError message={visible["priorities"]} />
      </div>

      {/* Budget indicatif */}
      <div className="mt-7 rounded-[16px] border border-sand-200 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Label htmlFor="b2b-budget" className="text-[14px] font-semibold">
            Budget indicatif par salarié
          </Label>
          <span className="tnum font-display text-lg font-bold text-teal-900">
            <AmountDisplay value={budget} />
            <span className="text-[12px] font-semibold text-muted-foreground"> /mois</span>
          </span>
        </div>
        <Slider
          id="b2b-budget"
          value={[budget]}
          min={5000}
          max={30000}
          step={500}
          onValueChange={([v]) => patch({ budget: v })}
          aria-label="Budget indicatif par salarié et par mois"
          className="mt-4"
        />
        <FieldError message={visible["budget"]} />
      </div>
    </StepCard>
  );
}
