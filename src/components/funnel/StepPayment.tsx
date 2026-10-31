"use client";

import { useMemo } from "react";
import { useSubscription } from "@/stores/subscription";
import { quote } from "@/lib/pricing";
import { frequencyLabel } from "@/data/products";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { StepCard, StepTitle, coverageLabel } from "@/components/funnel/shared";
import { MobileMoneyPay } from "@/components/funnel/MobileMoneyPay";

/** Étape 6 — Paiement Mobile Money. */
export function StepPayment() {
  const coverage = useSubscription((s) => s.coverage);
  const childrenCount = useSubscription((s) => s.childrenCount);
  const age = useSubscription((s) => s.age);
  const formulaId = useSubscription((s) => s.formula);
  const frequency = useSubscription((s) => s.frequency);

  const q = useMemo(
    () =>
      quote({
        coverage,
        children: coverage === "famille" ? childrenCount : 0,
        age,
        formula: formulaId,
        frequency,
      }),
    [coverage, childrenCount, age, formulaId, frequency]
  );

  return (
    <StepCard>
      <StepTitle
        title="Paiement Mobile Money"
        hint="Orange Money, Moov Africa Money ou Wave — la carte d'assuré est émise dès la confirmation."
      />
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 rounded-[16px] bg-teal-50 px-4 py-3.5">
        <p className="text-[14px] text-teal-900">
          <span className="font-semibold">{coverageLabel[coverage]}</span> · à régler{" "}
          {frequencyLabel[frequency]}
        </p>
        <p className="font-display text-[22px] font-bold leading-none text-teal-900">
          <AmountDisplay value={q.period} />
        </p>
      </div>
      <MobileMoneyPay amount={q.period} />
    </StepCard>
  );
}
