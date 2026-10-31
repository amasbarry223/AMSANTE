"use client";

import { useMemo } from "react";
import { groupEstimate } from "@/lib/pricing";
import { getFormula } from "@/data/products";
import { useB2BQuote } from "@/stores/b2bQuote";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Separator } from "@/components/ui/separator";

/** Résumé vivant du devis entreprise : entreprise, effectif, formule, fourchette. */
export function B2BLiveSummary() {
  const company = useB2BQuote((s) => s.company);
  const employees = useB2BQuote((s) => s.employees);
  const dependents = useB2BQuote((s) => s.dependents);
  const formulaId = useB2BQuote((s) => s.formula);

  const formula = getFormula(formulaId);
  const est = useMemo(() => groupEstimate(employees, dependents, formulaId), [employees, dependents, formulaId]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Votre entreprise
        </p>
        <p className="mt-1.5 font-display text-xl font-bold tracking-tight">
          {company.trim() || "À compléter"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 text-[14px]">
        <span className="text-muted-foreground">Effectif à couvrir</span>
        <span className="tnum font-semibold" aria-live="polite">
          {employees + dependents}
          <span className="font-normal text-muted-foreground">
            {" "}· dont {employees} salarié{employees > 1 ? "s" : ""}
          </span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-[14px]">
        <span className="text-muted-foreground">Formule souhaitée</span>
        <span className="font-semibold">{formula.name}</span>
      </div>

      <div className="rounded-[16px] bg-teal-50 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-teal-900">
          Prime annuelle estimée
        </p>
        <p className="tnum mt-1 font-display text-[22px] font-bold leading-none text-teal-900">
          <AmountDisplay value={est.low} suffix={false} /> –{" "}
          <AmountDisplay value={est.high} suffix={false} />{" "}
          <span className="text-[13px] font-semibold text-teal-700">FCFA / an</span>
        </p>
        <p className="mt-2 text-[12.5px] text-muted-foreground">
          Fourchette indicative — votre conseiller l&apos;affine selon vos garanties prioritaires.
        </p>
      </div>

      <Separator />

      <p className="text-[12.5px] leading-relaxed text-muted-foreground">
        Vos réponses restent enregistrées sur cet appareil : vous pouvez fermer la page et
        reprendre le devis plus tard.
      </p>
    </div>
  );
}
