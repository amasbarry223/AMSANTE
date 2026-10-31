"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { quote } from "@/lib/pricing";
import { products } from "@/data/products";
import { useSubscription } from "@/stores/subscription";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { duration, ease, stagger } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import type { CoverageType, FormulaId } from "@/data/types";

const coverages: { id: CoverageType; label: string }[] = [
  { id: "seul", label: "Seul·e" },
  { id: "couple", label: "Couple" },
  { id: "famille", label: "Famille" },
];

/** Formule mise en avant — source unique data/products.ts (jamais codée en dur). */
const POPULAR = products.find((p) => p.popular) ?? products[0];

/** Avatars enfants simulés — tons foncés uniquement : chiffres blancs lisibles
 *  (≥ 4,5:1) et le badge ocre-500 « Recommandée » reste le seul accent ocre vif
 *  de l'écran (règle : 1 usage par écran). */
function ChildAvatar({ index, onRemove }: { index: number; onRemove: () => void }) {
  const hues = ["bg-teal-700", "bg-ochre-700", "bg-teal-900", "bg-ink-soft"];
  return (
    <motion.button
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: duration.fast, ease: ease.out }}
      type="button"
      onClick={onRemove}
      aria-label={`Retirer un enfant (${index + 1})`}
      className={cn(
        "group relative size-11 rounded-full ring-2 ring-background",
        hues[index % hues.length]
      )}
    >
      <span className="flex size-full items-center justify-center text-sm font-bold text-white">
        {index + 1}
      </span>
      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-opacity group-hover:opacity-100">
        <Minus className="size-3" />
      </span>
    </motion.button>
  );
}

/**
 * Simulateur express intégré à l'accueil : 3 contrôles seulement,
 * primes animées en temps réel, CTA qui pré-remplit /souscrire.
 */
export function ExpressSimulator() {
  const router = useRouter();
  const [coverage, setCoverage] = useState<CoverageType>("famille");
  const [children, setChildren] = useState(2);
  const [age, setAge] = useState(32);

  const store = useSubscription();

  const quotes = useMemo(
    () =>
      products.map((p) =>
        quote({ coverage, children: coverage === "famille" ? children : 0, age, formula: p.id, frequency: "mensuel" })
      ),
    [coverage, children, age]
  );

  /** Écrit le pré-remplissage dans le store + un flag session pour que le
   *  tunnel ne l'écrase pas en assainissant un brouillon déjà finalisé. */
  const prefillAndGo = (formula: FormulaId) => {
    store.setCoverage(coverage);
    store.setChildrenCount(coverage === "famille" ? children : 0);
    store.setAge(age);
    store.setFormula(formula);
    store.setFrequency("mensuel");
    try {
      sessionStorage.setItem(
        "amsante-prefill",
        JSON.stringify({
          coverage,
          childrenCount: coverage === "famille" ? children : 0,
          age,
          formula,
          frequency: "mensuel",
        })
      );
    } catch {
      /* sessionStorage indisponible : le store persisté suffit */
    }
    router.push("/souscrire");
  };

  const go = () => prefillAndGo(POPULAR.id);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" aria-label="Simulateur express">
      <div aria-hidden className="absolute -right-40 top-10 size-[480px] rounded-full bg-teal-100/70 blur-3xl" />
      <div className="container-ams relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><Eyebrow>Simulateur express</Eyebrow></Reveal>
          <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold">
            Combien coûte votre tranquillité ?
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[17px] text-muted-foreground">
              Trois réponses suffisent. Votre prime s&apos;ajuste en direct, sans engagement.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-[980px]">
          {/* contrôles */}
          <div className="rounded-[28px] border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="grid gap-6 md:grid-cols-3 md:items-center">
              {/* 1. couverture */}
              <div>
                <p className="mb-2.5 text-[13px] font-semibold text-foreground">1 · Je m&apos;assure…</p>
                <div className="flex rounded-full bg-sand-100 p-1" role="group" aria-label="Type de couverture">
                  {coverages.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCoverage(c.id)}
                      aria-pressed={coverage === c.id}
                      className={cn(
                        "relative min-h-11 flex-1 rounded-full px-3 text-[13px] font-semibold transition-colors",
                        coverage === c.id ? "text-sand-50" : "text-muted-foreground hover:text-ink"
                      )}
                    >
                      {coverage === c.id && (
                        <motion.span
                          layoutId="express-coverage"
                          className="absolute inset-0 rounded-full bg-teal-900"
                          transition={{ duration: duration.fast, ease: ease.out }}
                        />
                      )}
                      <span className="relative">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. enfants */}
              <div className={cn("transition-opacity", coverage !== "famille" && "pointer-events-none opacity-40")}>
                <p className="mb-2.5 text-[13px] font-semibold text-foreground">
                  2 · Nombre d&apos;enfants <span className="tnum text-teal-700">({coverage === "famille" ? children : 0})</span>
                </p>
                <div className="flex h-11 items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Retirer un enfant"
                    disabled={coverage !== "famille" || children === 0}
                    onClick={() => setChildren((n) => Math.max(0, n - 1))}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-white transition-colors hover:border-teal-500 hover:text-teal-700 disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <div className="flex flex-1 items-center">
                    {coverage === "famille" ? (
                      <div className="flex items-center">
                        {Array.from({ length: children }).map((_, i) => (
                          <div key={i} className="-ml-1.5 first:ml-0">
                            <ChildAvatar index={i} onRemove={() => setChildren(i)} />
                          </div>
                        ))}
                        {children === 0 && (
                          <span className="text-[13px] text-muted-foreground">Aucun enfant</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[13px] text-muted-foreground">—</span>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Ajouter un enfant"
                    disabled={coverage !== "famille" || children >= 6}
                    onClick={() => setChildren((n) => Math.min(6, n + 1))}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-white transition-colors hover:border-teal-500 hover:text-teal-700 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* 3. âge */}
              <div>
                <p className="mb-2.5 flex items-baseline justify-between text-[13px] font-semibold text-foreground">
                  3 · Âge de l&apos;adhérent
                  <span className="tnum text-[15px] text-teal-700">{age} ans</span>
                </p>
                <Slider
                  value={[age]}
                  min={18}
                  max={70}
                  step={1}
                  onValueChange={([v]) => setAge(v)}
                  aria-label="Âge de l'adhérent principal"
                  className="mt-3"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* formules */}
        <div className="mx-auto mt-8 grid max-w-[980px] gap-4 md:grid-cols-3">
          {products.map((p, i) => {
            const q = quotes[i];
            return (
              <Reveal key={p.id} delay={i * stagger.base}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-card-lg border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8",
                    p.popular ? "border-teal-500 shadow-soft ring-1 ring-teal-500/30" : "border-sand-200"
                  )}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-ochre-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
                      Recommandée
                    </span>
                  )}
                  <p className="font-display text-xl font-bold">{p.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{p.tagline}</p>
                  <p className="mt-5 text-[32px] font-bold leading-none text-teal-900" aria-live="polite">
                    <AmountDisplay value={q.monthly} />
                  </p>
                  <p className="mt-1 text-[12px] text-muted-foreground">par mois, tout inclus</p>
                  <ul className="mt-4 space-y-1.5 text-[13px] text-muted-foreground">
                    {p.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-teal-500" /> {h}
                      </li>
                    ))}
                  </ul>
                  {p.popular ? (
                    <Button onClick={go} className="mt-6 w-full" size="lg">
                      Continuer avec {POPULAR.name} <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => prefillAndGo(p.id)} variant="outline" className="mt-6 w-full" size="lg">
                      Choisir {p.name}
                    </Button>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[12.5px] text-muted-foreground">
          Estimation indicative — le détail exact s&apos;affiche à la souscription.{" "}
          <Link href="/simulateur" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            Besoin d&apos;un calcul détaillé ?
          </Link>
        </p>
      </div>
    </section>
  );
}
