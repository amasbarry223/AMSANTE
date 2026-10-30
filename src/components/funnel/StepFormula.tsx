"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { useSubscription } from "@/stores/subscription";
import { products, frequencyDiscount, frequencyLabel } from "@/data/products";
import { guarantees } from "@/data/guarantees";
import type { BillingFrequency, FormulaId } from "@/data/types";
import { quote } from "@/lib/pricing";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Segmented, StepCard, StepTitle, ageFactorLabel, coverageLabel } from "@/components/funnel/shared";
import { formatFcfa } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const FREQUENCIES: { id: BillingFrequency; label: string }[] = [
  { id: "mensuel", label: "Mensuel" },
  { id: "trimestriel", label: "Trimestriel −2 %" },
  { id: "annuel", label: "Annuel −5 %" },
];

/** Étape 2 — Formule : comparatif des 3 offres + fréquence de paiement. */
export function StepFormula() {
  const coverage = useSubscription((s) => s.coverage);
  const childrenCount = useSubscription((s) => s.childrenCount);
  const age = useSubscription((s) => s.age);
  const formula = useSubscription((s) => s.formula);
  const frequency = useSubscription((s) => s.frequency);
  const setFormula = useSubscription((s) => s.setFormula);
  const setFrequency = useSubscription((s) => s.setFrequency);

  const children = coverage === "famille" ? childrenCount : 0;

  const quotes = useMemo(
    () =>
      Object.fromEntries(
        products.map((p) => [
          p.id,
          quote({ coverage, children, age, formula: p.id, frequency }),
        ])
      ) as Record<FormulaId, ReturnType<typeof quote>>,
    [coverage, children, age, frequency]
  );

  const selected = quotes[formula];

  return (
    <StepCard>
      <StepTitle
        title="Choisissez votre formule"
        hint="Trois niveaux de couverture, le même réseau de prestataires conventionnés."
      />

      {/* Fréquence de paiement */}
      <div className="mb-6">
        <p className="mb-2 text-[13px] font-semibold text-foreground">Fréquence de paiement</p>
        <Segmented
          name="formula-frequency"
          label="Fréquence de paiement"
          options={FREQUENCIES}
          value={frequency}
          onChange={setFrequency}
          className="max-w-md"
        />
        {frequency !== "mensuel" && (
          <p className="mt-2 text-[13px] font-medium text-teal-700">
            Vous payez {frequencyLabel[frequency].replace("par ", "une fois par ")} et économisez{" "}
            {Math.round((frequencyDiscount[frequency] ?? 0) * 100)} % sur l&apos;année.
          </p>
        )}
      </div>

      {/* Cartes comparatives */}
      <div className="grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Formule">
        {products.map((p) => {
          const active = formula === p.id;
          const q = quotes[p.id];
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFormula(p.id)}
              className={cn(
                "relative flex min-h-11 flex-col rounded-[20px] border p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-teal-500",
                active
                  ? "border-teal-500 bg-teal-50/60 shadow-soft ring-1 ring-teal-500/40"
                  : "border-sand-200 bg-white hover:border-teal-500/50 hover:-translate-y-0.5 hover:shadow-soft"
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 left-5 rounded-full bg-ochre-500 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white">
                  Recommandée
                </span>
              )}
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-lg font-bold">{p.name}</span>
                {active && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-teal-900 text-sand-50">
                    <Check className="size-3.5" />
                  </span>
                )}
              </span>
              <span className="mt-0.5 text-[13px] text-muted-foreground">{p.tagline}</span>

              <span className="mt-4 font-display text-[26px] font-bold leading-none text-teal-900">
                <AmountDisplay value={q.period} />
              </span>
              <span className="mt-1 text-[12px] text-muted-foreground">
                {frequencyLabel[frequency]}
                {frequency !== "mensuel" && (
                  <> · soit <span className="tnum">{q.monthlyEquivalent.toLocaleString("fr-FR")}</span> FCFA/mois</>
                )}
              </span>

              <span className="mt-4 space-y-1.5 border-t border-sand-200 pt-3.5">
                {p.highlights.map((h) => (
                  <span key={h} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal-500" aria-hidden /> {h}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {/* Détail des garanties de la formule sélectionnée */}
      <Accordion type="single" collapsible className="mt-6 rounded-[16px] border border-sand-200 px-4">
        <AccordionItem value="guarantees" className="border-b-0">
          <AccordionTrigger className="text-[14px] font-semibold hover:no-underline">
            Détail des garanties — {products.find((p) => p.id === formula)?.name}
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <table className="w-full text-[13px]">
              <caption className="sr-only">
                Taux de remboursement et plafonds annuels par garantie pour la formule sélectionnée
              </caption>
              <thead>
                <tr className="border-b border-sand-200 text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="py-2 pr-2 font-semibold">Garantie</th>
                  <th scope="col" className="py-2 pr-2 text-right font-semibold">Taux</th>
                  <th scope="col" className="py-2 text-right font-semibold">Plafond / an</th>
                </tr>
              </thead>
              <tbody>
                {guarantees.map((g) => {
                  const cov = g.coverage[formula];
                  const included = cov.taux > 0;
                  return (
                    <tr key={g.key} className="border-b border-sand-100 last:border-b-0">
                      <td className={cn("py-2 pr-2 font-medium", !included && "text-muted-foreground")}>
                        {g.label}
                      </td>
                      <td className="tnum py-2 pr-2 text-right font-semibold">
                        {included ? `${cov.taux} %` : "—"}
                      </td>
                      <td className="tnum py-2 text-right">
                        {included ? formatFcfa(cov.plafond) : <span className="text-muted-foreground">Non inclus</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Rappel silencieux du calcul courant pour les lecteurs d'écran */}
      <p aria-live="polite" className="sr-only">
        {`Formule ${products.find((p) => p.id === formula)?.name}, couverture ${coverageLabel[coverage]}, ${children} enfant(s), âge ${age}, facteur ${ageFactorLabel(selected.breakdown.ageFactor)}, prime ${selected.period} francs CFA ${frequencyLabel[frequency]}.`}
      </p>
    </StepCard>
  );
}
