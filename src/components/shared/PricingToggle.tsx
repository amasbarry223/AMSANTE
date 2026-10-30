"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { formatFcfa } from "@/lib/utils/format";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { DemoModal } from "@/components/shared/DemoModal";
import { Button } from "@/components/ui/button";

/* TODO: grille tarifaire SaaS à confirmer par l'équipe commerciale
   (les montants ci-dessous sont des valeurs de travail). */
const plans = [
  {
    id: "essentiel",
    name: "Essentiel",
    monthly: 75000,
    description: "Pour digitaliser le quotidien : assurés, contrats et sinistres.",
    features: [
      "Gestion des assurés et ayants droit",
      "Suivi des sinistres en temps réel",
      "Scan des cartes digitales (QR)",
      "1 poste de travail inclus",
    ],
    popular: false,
    onQuote: false,
  },
  {
    id: "professionnel",
    name: "Professionnel",
    monthly: 200000,
    description: "Pour les cabinets qui encaissent et pilotent la croissance.",
    features: [
      "Tout Essentiel, plus :",
      "Encaissement Mobile Money intégré",
      "Commissions automatiques (apporteurs)",
      "Reporting exportable (CSV, PDF)",
      "Postes illimités + support prioritaire",
    ],
    popular: true,
    onQuote: false,
  },
  {
    id: "entreprise",
    name: "Entreprise",
    monthly: null,
    description: "Pour les groupes multi-sites et les intégrations sur mesure.",
    features: [
      "Tout Professionnel, plus :",
      "Intégration à votre système existant (API)",
      "Multi-cabinets et rôles avancés",
      "Accompagnement dédié",
    ],
    popular: false,
    onQuote: true,
  },
];

/** Prix annuel = mensuel × 10 (2 mois offerts). */
const ANNUAL_FACTOR = 10;

/**
 * Grille tarifaire SaaS AMSANTÉ : 3 plans + toggle mensuel / annuel animé
 * (Motion layout). Le prix annuel affiche le total et l'équivalent mensuel.
 */
export function PricingToggle() {
  const [cycle, setCycle] = useState<"mensuel" | "annuel">("mensuel");

  return (
    <div>
      {/* Toggle mensuel / annuel */}
      <div className="flex justify-center">
        <div
          className="flex rounded-full bg-white p-1 shadow-xs ring-1 ring-sand-200"
          role="group"
          aria-label="Fréquence de facturation"
        >
          {(["mensuel", "annuel"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCycle(c)}
              aria-pressed={cycle === c}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-[13.5px] font-semibold transition-colors",
                cycle === c ? "text-sand-50" : "text-muted-foreground hover:text-ink"
              )}
            >
              {cycle === c && (
                <motion.span
                  layoutId="pricing-cycle"
                  className="absolute inset-0 rounded-full bg-teal-900"
                  transition={{ duration: duration.fast, ease: ease.out }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {c === "annuel" && (
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10.5px] font-bold text-teal-900">
                    2 mois offerts
                  </span>
                )}
                <span className="capitalize">{c}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const monthly = plan.monthly;
          const annualTotal = monthly !== null ? monthly * ANNUAL_FACTOR : null;
          const annualMonthlyEquiv = annualTotal !== null ? Math.round(annualTotal / 12) : null;
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-[24px] border bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8",
                plan.popular ? "border-teal-700/40 ring-1 ring-teal-700/30" : "border-sand-200"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-[20px] font-bold text-ink">{plan.name}</h3>
                {plan.popular && (
                  <span className="rounded-full bg-ochre-500 px-3.5 py-1 text-[12px] font-bold uppercase tracking-wide text-sand-50">
                    Le plus choisi
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6 min-h-[68px]" aria-live="polite">
                {plan.onQuote ? (
                  <>
                    <p className="font-display text-[30px] font-bold text-ink">Sur devis</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Tarif établi selon vos volumes et vos intégrations.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="flex items-baseline gap-1.5">
                      {cycle === "mensuel" ? (
                        <AmountDisplay
                          value={monthly ?? 0}
                          className="font-display text-[30px] font-bold text-ink"
                        />
                      ) : (
                        <AmountDisplay
                          value={annualTotal ?? 0}
                          className="font-display text-[30px] font-bold text-ink"
                        />
                      )}
                      <span className="text-[13px] text-muted-foreground">
                        {cycle === "mensuel" ? "/ mois" : "/ an"}
                      </span>
                    </p>
                    {cycle === "annuel" ? (
                      <p className="tnum mt-1 text-[13px] text-teal-700">
                        soit {formatFcfa(annualMonthlyEquiv ?? 0)} / mois
                      </p>
                    ) : (
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        Sans engagement, résiliable chaque mois.
                      </p>
                    )}
                  </>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 border-t border-sand-200 pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex-1" aria-hidden />

              {plan.onQuote ? (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href="#final-cta">Nous contacter</a>
                </Button>
              ) : (
                <DemoModal
                  label={`Démarrer avec ${plan.name}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
