"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, Loader2, RotateCcw } from "lucide-react";
import { submitB2BQuote } from "@/lib/api";
import { useB2BQuote } from "@/stores/b2bQuote";
import { FunnelHeader } from "@/components/funnel/FunnelHeader";
import { Stepper } from "@/components/funnel/Stepper";
import { B2BLiveSummary } from "@/components/funnel/B2BLiveSummary";
import { B2BStepCompany } from "@/components/funnel/B2BStepCompany";
import { B2BStepWorkforce } from "@/components/funnel/B2BStepWorkforce";
import { B2BStepNeeds } from "@/components/funnel/B2BStepNeeds";
import { B2BStepContact } from "@/components/funnel/B2BStepContact";
import { B2BConfirmation, type B2BResultView } from "@/components/funnel/B2BConfirmation";
import { companySchema, contactSchema, needsSchema, workforceSchema } from "@/components/funnel/schemas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { stepSlide } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Entreprise", "Effectif", "Besoins", "Contact"];

function B2BSkeleton() {
  return (
    <div className="space-y-6 py-6" aria-hidden>
      <div className="h-2 w-48 animate-pulse rounded-full bg-sand-200" />
      <div className="h-64 animate-pulse rounded-[28px] bg-white/70" />
    </div>
  );
}

/**
 * Devis groupe AMSANTÉ — tunnel 4 étapes + confirmation, store persisté
 * (reprise automatique). Rendu en takeover plein écran avec le même chrome
 * que (funnel) : en-tête minimal, scroll natif, sans Navbar/Footer.
 */
export function B2BQuoteFunnel() {
  const state = useB2BQuote();
  const reduced = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<B2BResultView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Reprise du brouillon persisté, après hydratation. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const current = Math.min(state.step, STEP_LABELS.length - 1);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [current, result]);

  const stepValid = useMemo(() => {
    switch (current) {
      case 0:
        return companySchema.safeParse({ company: state.company, sector: state.sector, city: state.city, rccm: state.rccm }).success;
      case 1:
        return workforceSchema.safeParse({ employees: state.employees, dependents: state.dependents }).success;
      case 2:
        return needsSchema.safeParse({ formula: state.formula, priorities: state.priorities, budget: state.budget }).success;
      case 3:
        return contactSchema.safeParse(state).success;
      default:
        return true;
    }
  }, [current, state]);

  const variants = useMemo(
    () =>
      reduced
        ? { enter: () => ({ opacity: 0 }), center: { opacity: 1 }, exit: () => ({ opacity: 0 }) }
        : { enter: stepSlide.enter, center: stepSlide.center, exit: stepSlide.exit },
    [reduced]
  );

  function goTo(next: number, direction: number) {
    const clamped = Math.max(0, Math.min(STEP_LABELS.length - 1, next));
    setDir(direction);
    state.setStep(clamped);
    setShowErrors(false);
  }

  function handleContinue() {
    if (!stepValid) {
      setShowErrors(true);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (current === STEP_LABELS.length - 1) {
      void handleSubmit();
      return;
    }
    goTo(current + 1, 1);
  }

  async function handleSubmit() {
    const s = useB2BQuote.getState();
    if (!contactSchema.safeParse(s).success) {
      setShowErrors(true);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitB2BQuote({
        company: s.company,
        sector: s.sector,
        city: s.city,
        employees: s.employees,
        dependents: s.dependents,
        formula: s.formula,
        contactName: s.contactName,
        contactRole: s.contactRole,
        phone: s.phone,
        email: s.email,
      });
      setResult({
        reference: res.reference,
        estimate: res.estimate,
        snapshot: {
          company: s.company,
          contactName: s.contactName,
          slot: s.slot,
          formulaId: s.formula,
          employees: s.employees,
          dependents: s.dependents,
        },
      });
      useB2BQuote.getState().reset();
    } catch {
      toast.error("L'envoi a échoué — vérifiez votre connexion puis réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const hasProgress =
    state.step > 0 || state.company.trim() !== "" || state.contactName.trim() !== "";

  if (!mounted) {
    return (
      <div ref={containerRef} className="fixed inset-0 z-[80] overflow-y-auto bg-sand-50" data-lenis-prevent>
        <FunnelHeader exitHref="/entreprises" exitLabel="Quitter" />
        <main className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
          <B2BSkeleton />
        </main>
      </div>
    );
  }

  if (result) {
    return (
      <div ref={containerRef} className="fixed inset-0 z-[80] overflow-y-auto bg-sand-50" data-lenis-prevent>
        <FunnelHeader exitHref="/entreprises" exitLabel="Quitter" />
        <main className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
          <B2BConfirmation result={result} />
        </main>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-[80] overflow-y-auto bg-sand-50" data-lenis-prevent>
      <FunnelHeader exitHref="/entreprises" exitLabel="Quitter" />

      <main className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[22px] font-bold tracking-tight sm:text-[26px]">
              Demande de devis groupe
            </h1>
            <p className="mt-0.5 text-[14px] text-muted-foreground">
              4 étapes, 2 minutes — réponse d&apos;un conseiller sous 24 h ouvrées.
            </p>
          </div>
          {hasProgress && (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 text-muted-foreground"
              onClick={() => {
                state.reset();
                setShowErrors(false);
                toast.info("Devis réinitialisé");
              }}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Recommencer
            </Button>
          )}
        </div>

        <Stepper steps={STEP_LABELS} current={current} onStepClick={(i) => goTo(i, -1)} />

        {/* Résumé repliable (mobile / tablette) */}
        <details className="group mt-5 rounded-[16px] border border-sand-200 bg-white lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="text-[13.5px] font-semibold">Mon devis en direct</span>
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="px-4 pb-4">
            <B2BLiveSummary />
          </div>
        </details>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepSlide.transition}
              >
                {current === 0 && <B2BStepCompany showErrors={showErrors} />}
                {current === 1 && <B2BStepWorkforce showErrors={showErrors} />}
                {current === 2 && <B2BStepNeeds showErrors={showErrors} />}
                {current === 3 && <B2BStepContact showErrors={showErrors} />}
              </motion.div>
            </AnimatePresence>

            <div
              className={cn(
                "sticky bottom-0 z-20 -mx-4 mt-8 border-t border-sand-200 bg-sand-50/95 px-4 py-3 backdrop-blur",
                "sm:-mx-6 sm:px-6",
                "lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-0"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                {current > 0 ? (
                  <Button variant="ghost" className="min-h-11" onClick={() => goTo(current - 1, -1)}>
                    <ArrowLeft className="size-4" aria-hidden />
                    Retour
                  </Button>
                ) : (
                  <span aria-hidden />
                )}
                <Button
                  className="min-h-12 min-w-[190px]"
                  onClick={handleContinue}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
                  {current === STEP_LABELS.length - 1
                    ? submitting
                      ? "Envoi…"
                      : "Envoyer ma demande"
                    : "Continuer"}
                  {!submitting && <ArrowRight className="size-4" aria-hidden />}
                </Button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block" aria-label="Résumé vivant de votre devis">
            <div className="sticky top-24">
              <div className="rounded-[24px] border border-sand-200 bg-white p-6 shadow-soft">
                <B2BLiveSummary />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
