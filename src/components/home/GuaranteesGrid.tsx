"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope, Pill, BedDouble, Baby, FlaskConical, Scan, Smile, Glasses, Plane,
} from "lucide-react";
import { guarantees } from "@/data/guarantees";
import { products } from "@/data/products";
import type { FormulaId } from "@/data/types";
import { formatFcfa } from "@/lib/utils/format";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { duration, ease, cardHover } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ElementType> = {
  Stethoscope, Pill, BedDouble, Baby, FlaskConical, Scan, Smile, Glasses, Plane,
};

/**
 * Garanties interactives : 9 tuiles qui s'étendent au survol/focus
 * (Motion layout) et affichent taux + plafond pour la formule choisie.
 */
export function GuaranteesGrid() {
  const [formula, setFormula] = useState<FormulaId>("confort");

  const list = useMemo(() => guarantees, []);

  return (
    <section className="bg-sand-100/60 py-24 sm:py-32" aria-label="Garanties">
      <div className="container-ams">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal><Eyebrow>Garanties</Eyebrow></Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold">
              Ce qui est couvert, en clair.
            </SplitHeading>
          </div>
          {/* segmented control formule */}
          <Reveal>
            <div className="flex rounded-full bg-white p-1 shadow-xs ring-1 ring-sand-200" role="group" aria-label="Choisir une formule">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormula(p.id)}
                  aria-pressed={formula === p.id}
                  className={cn(
                    "relative min-h-11 rounded-full px-5 text-[13.5px] font-semibold transition-colors",
                    formula === p.id ? "text-sand-50" : "text-muted-foreground hover:text-ink"
                  )}
                >
                  {formula === p.id && (
                    <motion.span
                      layoutId="guarantee-formula"
                      className="absolute inset-0 rounded-full bg-teal-900"
                      transition={{ duration: duration.fast, ease: ease.out }}
                    />
                  )}
                  <span className="relative">{p.name}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9 lg:grid-rows-1">
          {list.map((g, i) => {
            const Icon = icons[g.icon] ?? Stethoscope;
            const cov = g.coverage[formula];
            const included = cov.taux > 0;
            return (
              <div key={g.key}>
                <motion.div
                  layout
                  whileHover={cardHover}
                  transition={{ duration: duration.fast, ease: ease.out }}
                  className="group relative min-h-[148px] cursor-default overflow-hidden rounded-[16px] border border-sand-200 bg-white p-4 transition-shadow hover:shadow-lift hover:ring-1 hover:ring-teal-500/40 focus-within:ring-1 focus-within:ring-teal-500/40"
                  tabIndex={0}
                  aria-label={`${g.label} : ${included ? `${cov.taux} % couverts, plafond ${formatFcfa(cov.plafond)} par an` : "non incluse dans cette formule"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-900 transition-colors group-hover:bg-teal-900 group-hover:text-sand-50">
                      <Icon className="size-[18px]" />
                    </span>
                  </div>
                  <p className="mt-3 text-[13.5px] font-bold leading-tight text-ink">{g.label}</p>
                  {/* valeur compacte */}
                  <p className="mt-1 text-[12px] font-semibold text-teal-700">
                    {included ? `${cov.taux} %` : "—"}
                  </p>
                  {/* extension au survol */}
                  <AnimatePresence>
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full overflow-hidden bg-teal-900 p-4 text-sand-50 transition-transform duration-300 ease-ams-out group-hover:translate-y-0 group-focus-within:translate-y-0"
                    >
                      <p className="text-[11px] leading-snug text-teal-100/85">{g.description}</p>
                      {included ? (
                        <div className="mt-2.5 flex items-end justify-between">
                          <p className="text-[20px] font-bold leading-none">
                            <span className="tnum">{cov.taux}</span> %
                          </p>
                          <p className="tnum text-[12px] text-teal-100/90">
                            max {formatFcfa(cov.plafond)}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-[12px] font-semibold text-ochre-100">
                          Non incluse dans {products.find((p) => p.id === formula)?.name}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[12.5px] text-muted-foreground">
          Survolez une garantie pour le détail · Plafonds annuels par personne ·{" "}
          {/* TODO: valeurs définitives à confirmer par les compagnies partenaires */}
          Valeurs indicatives à confirmer à la souscription
        </p>
      </div>
    </section>
  );
}
