"use client";

import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { quote } from "@/lib/pricing";
import { getFormula, frequencyLabel } from "@/data/products";
import { formatFcfa } from "@/lib/utils/format";
import { useSubscription } from "@/stores/subscription";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Separator } from "@/components/ui/separator";
import { ageFactorLabel, coverageLabel } from "@/components/funnel/shared";
import { cn } from "@/lib/utils";

/**
 * Récapitulatif vivant du tunnel : formule, couverture, prime recalculée à
 * chaque saisie (aria-live via <AmountDisplay>), détail de calcul.
 */
export function LiveSummaryBody({ className }: { className?: string }) {
  const coverage = useSubscription((s) => s.coverage);
  const childrenCount = useSubscription((s) => s.childrenCount);
  const age = useSubscription((s) => s.age);
  const formulaId = useSubscription((s) => s.formula);
  const frequency = useSubscription((s) => s.frequency);

  const formula = getFormula(formulaId);
  const children = coverage === "famille" ? childrenCount : 0;

  const q = useMemo(
    () => quote({ coverage, children, age, formula: formulaId, frequency }),
    [coverage, children, age, formulaId, frequency]
  );

  return (
    <div className={cn("space-y-5", className)}>
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Votre formule
        </p>
        <p className="mt-1.5 font-display text-xl font-bold tracking-tight">{formula.name}</p>
        <p className="text-[13px] text-muted-foreground">{formula.tagline}</p>
      </div>

      <div className="flex items-center justify-between gap-3 text-[14px]">
        <span className="text-muted-foreground">Couverture</span>
        <span className="text-right font-semibold">
          {coverageLabel[coverage]}
          {children > 0 && <span className="tnum text-muted-foreground"> · {children} enfant{children > 1 ? "s" : ""}</span>}
        </span>
      </div>

      <div className="rounded-[16px] bg-teal-50 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-teal-900">
          Prime {frequencyLabel[frequency].replace("par ", "")}
        </p>
        <p className="mt-1 font-display text-[30px] font-bold leading-none text-teal-900">
          <AmountDisplay value={q.period} />
        </p>
        {q.discount > 0 ? (
          <p className="mt-2 text-[13px] font-medium text-teal-700">
            Remise {Math.round(q.discount * 100)} % incluse — soit{" "}
            <span className="tnum">{formatFcfa(q.monthlyEquivalent)}</span>/mois équivalent
          </p>
        ) : (
          <p className="mt-2 text-[13px] text-muted-foreground">Sans engagement, modifiable à tout moment.</p>
        )}
      </div>

      <Separator />

      {/* Détail du calcul (montants en clair, non animés) */}
      <dl className="space-y-2 text-[13.5px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">
            Adulte{q.breakdown.adults > 1 ? "s" : ""} couvert{q.breakdown.adults > 1 ? "s" : ""}
          </dt>
          <dd className="tnum font-semibold">{formatFcfa(q.breakdown.adultLine)}</dd>
        </div>
        {children > 0 && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">
              Enfant{children > 1 ? "s" : ""} <span className="tnum">({children})</span>
            </dt>
            <dd className="tnum font-semibold">{formatFcfa(q.breakdown.childLine)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Facteur âge</dt>
          <dd className="tnum font-semibold">{ageFactorLabel(q.breakdown.ageFactor)}</dd>
        </div>
      </dl>

      <p className="flex items-center gap-2 rounded-[10px] bg-sand-100 px-3.5 py-2.5 text-[12.5px] text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-teal-700" aria-hidden />
        Montant ferme à la souscription, aucun frais caché.
      </p>
    </div>
  );
}

/** Colonne sticky desktop. */
export function LiveSummary() {
  return (
    <div className="rounded-card-lg border border-sand-200 bg-white p-6 shadow-soft">
      <LiveSummaryBody />
    </div>
  );
}
