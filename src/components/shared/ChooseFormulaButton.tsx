"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/stores/subscription";
import type { FormulaId } from "@/data/types";

/**
 * CTA « Choisir {formule} » : pré-sélectionne la formule dans le store du
 * tunnel (flag session anti-écrasement) puis navigue vers /souscrire —
 * ainsi le libellé du bouton correspond toujours à l'état du tunnel.
 */
export function ChooseFormulaButton({
  formulaId,
  label,
}: {
  formulaId: FormulaId;
  label: string;
}) {
  const router = useRouter();

  function choose() {
    const s = useSubscription.getState();
    s.setFormula(formulaId);
    try {
      sessionStorage.setItem(
        "amsante-prefill",
        JSON.stringify({
          coverage: s.coverage,
          childrenCount: s.childrenCount,
          age: s.age,
          formula: formulaId,
          frequency: s.frequency,
        })
      );
    } catch {
      /* sessionStorage indisponible : le store persisté suffit */
    }
    router.push("/souscrire");
  }

  return (
    <Button onClick={choose} variant="outline" size="lg" className="w-full">
      {label}
    </Button>
  );
}
