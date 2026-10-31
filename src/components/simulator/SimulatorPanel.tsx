"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { quote } from "@/lib/pricing";
import { products, frequencyDiscount, frequencyLabel } from "@/data/products";
import { formatFcfa } from "@/lib/utils/format";
import { communeList } from "@/data/guarantees";
import type { BillingFrequency, CoverageType, FormulaId } from "@/data/types";
import { useSubscription } from "@/stores/subscription";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Segmented, ageFactorLabel, coverageLabel } from "@/components/funnel/shared";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const COVERAGES: { id: CoverageType; label: string }[] = [
  { id: "seul", label: "Seul·e" },
  { id: "couple", label: "Couple" },
  { id: "famille", label: "Famille" },
];

const FREQUENCIES: { id: BillingFrequency; label: string }[] = [
  { id: "mensuel", label: "Mensuel" },
  { id: "trimestriel", label: "Trimestriel −2 %" },
  { id: "annuel", label: "Annuel −5 %" },
];

/**
 * Simulateur complet (page /simulateur) : primes recalculées en direct via le
 * moteur pur, détail ligne par ligne, CTA qui pré-remplit le tunnel.
 */
export function SimulatorPanel() {
  const router = useRouter();
  const [coverage, setCoverage] = useState<CoverageType>("famille");
  const [children, setChildren] = useState(2);
  const [age, setAge] = useState(32);
  const [commune, setCommune] = useState<string>("");
  const [frequency, setFrequency] = useState<BillingFrequency>("mensuel");

  const setStore = {
    setCoverage: useSubscription((s) => s.setCoverage),
    setChildrenCount: useSubscription((s) => s.setChildrenCount),
    setAge: useSubscription((s) => s.setAge),
    setFormula: useSubscription((s) => s.setFormula),
    setFrequency: useSubscription((s) => s.setFrequency),
  };

  const effectiveChildren = coverage === "famille" ? children : 0;

  const quotes = useMemo(
    () =>
      products.map((p) =>
        quote({ coverage, children: effectiveChildren, age, formula: p.id, frequency })
      ),
    [coverage, effectiveChildren, age, frequency]
  );

  function subscribe(formulaId: FormulaId) {
    setStore.setCoverage(coverage);
    setStore.setChildrenCount(effectiveChildren);
    setStore.setAge(age);
    setStore.setFormula(formulaId);
    setStore.setFrequency(frequency);
    // Flag session : le tunnel ne doit pas écraser ce pré-remplissage
    // s'il assainit un brouillon déjà finalisé.
    try {
      sessionStorage.setItem(
        "amsante-prefill",
        JSON.stringify({ coverage, childrenCount: effectiveChildren, age, formula: formulaId, frequency })
      );
    } catch {
      /* sessionStorage indisponible : le store persisté suffit */
    }
    router.push("/souscrire");
  }

  return (
    <div className="space-y-8">
      {/* ── Contrôles ─────────────────────────────────────────────── */}
      <div className="rounded-[28px] border border-sand-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="grid gap-7 md:grid-cols-2">
          <div>
            <p className="mb-2.5 text-[13px] font-semibold">1 · Je m&apos;assure…</p>
            <Segmented
              name="sim-coverage"
              label="Type de couverture"
              options={COVERAGES}
              value={coverage}
              onChange={setCoverage}
            />
          </div>
          <div>
            <p className="mb-2.5 text-[13px] font-semibold">2 · Fréquence de paiement</p>
            <Segmented
              name="sim-frequency"
              label="Fréquence de paiement"
              options={FREQUENCIES}
              value={frequency}
              onChange={setFrequency}
            />
            {frequencyDiscount[frequency] > 0 && (
              <p className="mt-2 text-[12.5px] font-medium text-teal-700">
                Remise de {Math.round(frequencyDiscount[frequency] * 100)} % appliquée
                automatiquement.
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 grid gap-7 md:grid-cols-3">
          {/* Enfants (famille) */}
          <div className={cn(coverage !== "famille" && "pointer-events-none opacity-40")}>
            <p className="mb-2.5 text-[13px] font-semibold">
              3 · Nombre d&apos;enfants{" "}
              <span className="tnum text-teal-700">({effectiveChildren})</span>
            </p>
            <div className="flex h-11 items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Retirer un enfant"
                disabled={coverage !== "famille" || children === 0}
                onClick={() => setChildren((n) => Math.max(0, n - 1))}
                className="size-11 shrink-0 rounded-full bg-white"
              >
                <Minus className="size-4" />
              </Button>
              <div className="flex flex-1 items-center justify-center">
                {coverage === "famille" ? (
                  <span className="font-display text-xl font-bold">{children}</span>
                ) : (
                  <span className="text-[13px] text-muted-foreground">—</span>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Ajouter un enfant"
                disabled={coverage !== "famille" || children >= 6}
                onClick={() => setChildren((n) => Math.min(6, n + 1))}
                className="size-11 shrink-0 rounded-full bg-white"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* Âge */}
          <div>
            <p className="mb-2.5 flex items-baseline justify-between text-[13px] font-semibold">
              4 · Âge de l&apos;adhérent
              <span className="tnum text-[15px] text-teal-700">{age} ans</span>
            </p>
            <Slider
              value={[age]}
              min={18}
              max={70}
              step={1}
              onValueChange={([v]) => setAge(v)}
              aria-label="Âge de l'adhérent principal"
              className="mt-4"
            />
          </div>

          {/* Commune (informatif) */}
          <div>
            <p className="mb-2.5 text-[13px] font-semibold">
              5 · Votre commune <span className="font-normal text-muted-foreground">(informatif)</span>
            </p>
            <Select value={commune} onValueChange={setCommune}>
              <SelectTrigger
                aria-label="Commune de résidence"
                className="h-11 w-full rounded-[10px] bg-white"
              >
                <SelectValue placeholder="Choisir (Bamako / Kati)" />
              </SelectTrigger>
              <SelectContent>
                {communeList.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Résultats ─────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {products.map((p, i) => {
          const q = quotes[i];
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: duration.base, ease: ease.out, delay: i * 0.07 }}
              className={cn(
                "relative flex h-full flex-col rounded-[24px] border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8",
                p.popular ? "border-teal-500 shadow-soft ring-1 ring-teal-500/30" : "border-sand-200"
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-ochre-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Recommandée
                </span>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{p.tagline}</p>

              <p className="mt-5 font-display text-[32px] font-bold leading-none text-teal-900" aria-live="polite">
                <AmountDisplay value={q.period} />
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {frequencyLabel[frequency]}, tout inclus
                {q.discount > 0 && (
                  <> · remise {Math.round(q.discount * 100)} % incluse</>
                )}
              </p>

              {/* Détail du calcul */}
              <dl className="mt-4 space-y-1 rounded-[10px] bg-sand-50 px-3.5 py-3 text-[12.5px]">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">
                    Adulte{q.breakdown.adults > 1 ? "s" : ""} ({q.breakdown.adults})
                  </dt>
                  <dd className="tnum font-semibold">
                    {formatFcfa(q.breakdown.adultLine)}
                  </dd>
                </div>
                {effectiveChildren > 0 && (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">
                      Enfant{effectiveChildren > 1 ? "s" : ""} ({effectiveChildren})
                    </dt>
                    <dd className="tnum font-semibold">
                      {formatFcfa(q.breakdown.childLine)}
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">Facteur âge</dt>
                  <dd className="tnum font-semibold">{ageFactorLabel(q.breakdown.ageFactor)}</dd>
                </div>
              </dl>

              <ul className="mt-4 space-y-1.5 text-[13px] text-muted-foreground">
                {p.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal-500" aria-hidden /> {h}
                  </li>
                ))}
              </ul>

              <Button onClick={() => subscribe(p.id)} className="mt-6 min-h-11 w-full" size="lg">
                Souscrire avec {p.name} <ArrowRight className="size-4" aria-hidden />
              </Button>
            </motion.article>
          );
        })}
      </div>

      {/* Bandeau confiance */}
      <p className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-sand-200 bg-white px-5 py-2.5 text-center text-[12.5px] text-muted-foreground">
        <ShieldCheck className="size-4 text-teal-700" aria-hidden />
        Estimation sans engagement · Aucune donnée stockée · Prime ferme à la souscription
        {coverage !== "seul" && (
          <span className="sr-only"> — profil : {coverageLabel[coverage]}</span>
        )}
      </p>
    </div>
  );
}
