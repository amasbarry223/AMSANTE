"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, FileText, PhoneCall } from "lucide-react";
import { getFormula } from "@/data/products";
import { ease as motionEase } from "@/lib/motion/tokens";
import { Counter } from "@/components/motion/Counter";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { Button } from "@/components/ui/button";
import { B2B_SLOTS } from "@/components/funnel/schemas";
import { Reveal } from "@/components/motion/Reveal";
import type { FormulaId } from "@/data/types";

export interface B2BResultView {
  reference: string;
  estimate: { low: number; high: number; total: number };
  snapshot: {
    company: string;
    contactName: string;
    slot: string;
    formulaId: FormulaId;
    employees: number;
    dependents: number;
  };
}

/** Devis entreprise — écran de confirmation (hors stepper). */
export function B2BConfirmation({ result }: { result: B2BResultView }) {
  const { reference, estimate, snapshot } = result;
  const formula = getFormula(snapshot.formulaId);
  const slotLabel = B2B_SLOTS.find((s) => s.id === snapshot.slot)?.label ?? "N'importe quand";

  return (
    <div className="pb-6">
      <div className="mx-auto max-w-2xl text-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={motionEase.spring}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success"
        >
          <BadgeCheck className="size-8" aria-hidden />
        </motion.span>
        <h1 className="mt-6 font-display text-[clamp(1.9rem,4.5vw,2.9rem)] font-bold leading-tight tracking-tight">
          Demande envoyée, merci&nbsp;!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{snapshot.company.trim()}</span> — un
          conseiller AMSANTÉ rappelle {snapshot.contactName.trim()} sous 24 h ouvrées, créneau
          souhaité : <span className="font-semibold text-foreground">{slotLabel.toLowerCase()}</span>.
        </p>
        <p className="tnum mt-4 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-[13.5px] font-semibold text-teal-900">
          <FileText className="size-4" aria-hidden />
          Référence devis {reference}
        </p>
      </div>

      {/* Fourchette animée */}
      <Reveal className="mx-auto mt-10 max-w-2xl">
        <div className="rounded-[24px] border border-sand-200 bg-white p-6 text-center shadow-soft sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Prime annuelle estimée
          </p>
          <p className="mt-3 font-display text-[clamp(1.7rem,4.5vw,2.6rem)] font-bold leading-none text-teal-900">
            <Counter value={estimate.low} format="fcfa" />
            <span className="mx-2 text-teal-500">–</span>
            <Counter value={estimate.high} format="fcfa" />
          </p>
          <p className="mt-2.5 text-[13.5px] text-muted-foreground" aria-live="polite">
            pour {estimate.total} personnes couvertes · formule {formula.name} · fourchette indicative
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
        <div className="rounded-[16px] border border-sand-200 bg-white p-5 shadow-soft">
          <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-900">
            <PhoneCall className="size-5" aria-hidden />
          </span>
          <p className="mt-3 font-display text-[16px] font-bold">Le rappel</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
            20 minutes pour affiner garanties, tarifs dégressifs et modalités de paiement.
          </p>
        </div>
        <div className="rounded-[16px] border border-sand-200 bg-white p-5 shadow-soft">
          <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-900">
            <FileText className="size-5" aria-hidden />
          </span>
          <p className="mt-3 font-display text-[16px] font-bold">La proposition écrite</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
            Vous recevez ensuite la convention détaillée par e-mail, prête à être signée.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryCta href="/">Retour à l&apos;accueil</PrimaryCta>
        <Button asChild variant="outline" className="min-h-12 bg-white">
          <Link href="/entreprises">Revoir l&apos;offre groupe</Link>
        </Button>
      </div>
    </div>
  );
}
