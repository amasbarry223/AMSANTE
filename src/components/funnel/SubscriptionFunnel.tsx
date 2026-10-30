"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, History } from "lucide-react";
import { hasDraft, useSubscription } from "@/stores/subscription";
import { Stepper } from "@/components/funnel/Stepper";
import { LiveSummary, LiveSummaryBody } from "@/components/funnel/LiveSummary";
import { StepWho } from "@/components/funnel/StepWho";
import { StepFormula } from "@/components/funnel/StepFormula";
import { StepInfos } from "@/components/funnel/StepInfos";
import { StepDocs } from "@/components/funnel/StepDocs";
import { StepSummary } from "@/components/funnel/StepSummary";
import { StepPayment } from "@/components/funnel/StepPayment";
import { newBeneficiary } from "@/components/funnel/shared";
import { docsOk, infosSchema, summarySchema, whoSchema } from "@/components/funnel/schemas";
import { Button } from "@/components/ui/button";
import { stepSlide, duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Qui assurer",
  "Formule",
  "Informations",
  "Documents",
  "Récapitulatif",
  "Paiement",
];

function FunnelSkeleton() {
  return (
    <div className="space-y-6 py-6" aria-hidden>
      <div className="h-2 w-48 animate-pulse rounded-full bg-sand-200" />
      <div className="h-72 animate-pulse rounded-[28px] bg-white/70" />
      <div className="h-12 animate-pulse rounded-full bg-white/70" />
    </div>
  );
}

/**
 * Orchestrateur du tunnel de souscription : stepper, transitions glissées,
 * navigation validée par étape, LiveSummary sticky (colonne desktop, repli
 * mobile) et reprise de brouillon.
 */
export function SubscriptionFunnel() {
  const state = useSubscription();
  const reduced = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [signed, setSigned] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  /* Reprise / assainissement du brouillon persisté, après hydratation. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const s = useSubscription.getState();
      if (s.completedAt) {
        s.reset(); // souscription déjà finalisée : on repart d'une base saine
      }
      const st = useSubscription.getState();
      if (st.coverage !== "seul" && !st.beneficiaries.some((b) => b.relation === "conjoint")) {
        st.addBeneficiary(newBeneficiary("conjoint"));
      }
      if (st.coverage === "famille") {
        const kids = st.beneficiaries.filter((b) => b.relation === "enfant");
        if (kids.length < st.childrenCount) {
          for (let i = kids.length; i < st.childrenCount; i++) st.addBeneficiary(newBeneficiary("enfant"));
        } else if (kids.length > st.childrenCount) {
          kids.slice(st.childrenCount).forEach((k) => st.removeBeneficiary(k.id));
        }
      }
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const current = Math.min(state.step, STEP_LABELS.length - 1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const stepValid = useMemo(() => {
    switch (current) {
      case 0:
        return whoSchema.safeParse({ beneficiaries: state.beneficiaries, age: state.age }).success;
      case 1:
        return true;
      case 2:
        return infosSchema.safeParse(state.principal).success;
      case 3:
        return docsOk(state.documents, state.beneficiaries.map((b) => b.id));
      case 4:
        return summarySchema.safeParse(state.consents).success && signed;
      default:
        return true;
    }
  }, [current, state.beneficiaries, state.age, state.principal, state.documents, state.consents, signed]);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    goTo(current + 1, 1);
  }

  if (!mounted) return <FunnelSkeleton />;

  const showBanner = bannerVisible && hasDraft(state);

  return (
    <div className="pb-2">
      {/* Bandeau de reprise de brouillon */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="mb-6 flex flex-col gap-3 rounded-[16px] border border-ochre-100 bg-ochre-100/40 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <History className="mt-0.5 size-5 shrink-0 text-ochre-500" aria-hidden />
              <div>
                <p className="text-[14px] font-semibold">Reprendre ma souscription</p>
                <p className="text-[13px] text-muted-foreground">
                  Une souscription entamée est sauvegardée sur cet appareil
                  {state.step > 0 && (
                    <> — vous étiez à l&apos;étape « {STEP_LABELS[Math.min(state.step, STEP_LABELS.length - 1)]} »</>
                  )}
                  .
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                className="min-h-11"
                onClick={() => {
                  goTo(state.step, 1);
                  setBannerVisible(false);
                }}
              >
                Reprendre
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="min-h-11 bg-white"
                onClick={() => {
                  state.reset();
                  setSigned(false);
                  setBannerVisible(false);
                }}
              >
                Recommencer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Stepper steps={STEP_LABELS} current={current} onStepClick={(i) => goTo(i, -1)} />

      {/* LiveSummary repliable (mobile / tablette) */}
      <details className="group mt-5 rounded-[16px] border border-sand-200 bg-white lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className="text-[13.5px] font-semibold">Ma prime en direct</span>
          <ChevronDown
            className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="px-4 pb-4">
          <LiveSummaryBody />
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
              {current === 0 && <StepWho showErrors={showErrors} />}
              {current === 1 && <StepFormula />}
              {current === 2 && <StepInfos showErrors={showErrors} />}
              {current === 3 && <StepDocs showErrors={showErrors} />}
              {current === 4 && (
                <StepSummary
                  showErrors={showErrors}
                  signed={signed}
                  onSigned={() => setSigned(true)}
                />
              )}
              {current === 5 && <StepPayment />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation d'étape — collée en bas sur mobile */}
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
              {current < STEP_LABELS.length - 1 ? (
                <Button className="min-h-12 min-w-[190px]" onClick={handleContinue}>
                  Continuer
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              ) : (
                <span className="text-[12.5px] text-muted-foreground">
                  Le paiement se règle ci-dessus.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* LiveSummary sticky (desktop) */}
        <aside className="hidden lg:block" aria-label="Résumé vivant de votre souscription">
          <div className="sticky top-24">
            <LiveSummary />
          </div>
        </aside>
      </div>
    </div>
  );
}
