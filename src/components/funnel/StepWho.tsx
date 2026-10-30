"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Baby, Heart, Minus, Plus, Trash2, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSubscription } from "@/stores/subscription";
import type { Beneficiary } from "@/stores/subscription";
import type { CoverageType } from "@/data/types";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { whoSchema, fieldErrors } from "@/components/funnel/schemas";
import {
  FieldError,
  StepCard,
  StepTitle,
  formatBirthDate,
  newBeneficiary,
} from "@/components/funnel/shared";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const COVERAGE_OPTIONS: {
  id: CoverageType;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { id: "seul", label: "Seul·e", desc: "Une carte, pour moi.", icon: User },
  { id: "couple", label: "En couple", desc: "Moi et mon conjoint·e.", icon: Heart },
  { id: "famille", label: "En famille", desc: "Conjoint·e + jusqu'à 6 enfants.", icon: Users },
];

const AVATAR_TONES = ["bg-teal-500", "bg-ochre-500", "bg-teal-700", "bg-ink-soft", "bg-warning", "bg-teal-300"];

/** Ajuste le nombre de cartes « enfant » sur le compteur (famille). */
function syncChildren(target: number) {
  const st = useSubscription.getState();
  const kids = st.beneficiaries.filter((b) => b.relation === "enfant");
  if (kids.length < target) {
    for (let i = kids.length; i < target; i++) st.addBeneficiary(newBeneficiary("enfant"));
  } else if (kids.length > target) {
    kids.slice(target).forEach((k) => st.removeBeneficiary(k.id));
  }
}

function BeneficiaryCard({
  b,
  index,
  errors,
  onRemove,
}: {
  b: Beneficiary;
  index: number;
  errors: Record<string, string>;
  onRemove?: () => void;
}) {
  const update = useSubscription((s) => s.updateBeneficiary);
  const isChild = b.relation === "enfant";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: duration.fast, ease: ease.out }}
      className="rounded-[16px] border border-sand-200 bg-sand-50/60 p-4"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-white",
            isChild ? AVATAR_TONES[(index + 1) % AVATAR_TONES.length] : "bg-teal-900"
          )}
        >
          {isChild ? <Baby className="size-4.5" /> : <Heart className="size-4.5" />}
        </span>
        <p className="flex-1 text-[14px] font-semibold">
          {isChild ? `Enfant ${index + 1}` : "Conjoint·e"}
        </p>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Retirer ${isChild ? `l'enfant ${index + 1}` : "le ou la conjoint·e"}`}
            onClick={onRemove}
            className="size-11 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
        <div>
          <label className="text-[12px] font-semibold text-muted-foreground" htmlFor={`ben-firstname-${b.id}`}>
            Prénom
          </label>
          <Input
            id={`ben-firstname-${b.id}`}
            value={b.firstName}
            onChange={(e) => update(b.id, { firstName: e.target.value })}
            placeholder="Prénom"
            autoComplete="off"
            aria-invalid={!!errors[`beneficiaries.${index}.firstName`]}
            className="mt-1 h-11 rounded-[10px] bg-white"
          />
          <FieldError message={errors[`beneficiaries.${index}.firstName`]} />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-muted-foreground" htmlFor={`ben-birth-${b.id}`}>
            Naissance
          </label>
          <Input
            id={`ben-birth-${b.id}`}
            value={b.birthDate}
            onChange={(e) => update(b.id, { birthDate: formatBirthDate(e.target.value) })}
            placeholder="JJ/MM/AAAA"
            inputMode="numeric"
            maxLength={10}
            autoComplete="off"
            aria-invalid={!!errors[`beneficiaries.${index}.birthDate`]}
            className="tnum mt-1 h-11 rounded-[10px] bg-white"
          />
          <FieldError message={errors[`beneficiaries.${index}.birthDate`]} />
        </div>
      </div>
    </motion.li>
  );
}

/** Étape 1 — Qui assurer : couverture, bénéficiaires, âge de l'adhérent. */
export function StepWho({ showErrors }: { showErrors: boolean }) {
  const coverage = useSubscription((s) => s.coverage);
  const childrenCount = useSubscription((s) => s.childrenCount);
  const age = useSubscription((s) => s.age);
  const beneficiaries = useSubscription((s) => s.beneficiaries);
  const setCoverage = useSubscription((s) => s.setCoverage);
  const setChildrenCount = useSubscription((s) => s.setChildrenCount);
  const setAge = useSubscription((s) => s.setAge);
  const addBeneficiary = useSubscription((s) => s.addBeneficiary);
  const removeBeneficiary = useSubscription((s) => s.removeBeneficiary);
  const updateBeneficiary = useSubscription((s) => s.updateBeneficiary);

  const errors = useMemo(() => {
    const parsed = whoSchema.safeParse({ beneficiaries, age });
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [beneficiaries, age]);
  const visible = showErrors ? errors : {};

  const spouse = beneficiaries.find((b) => b.relation === "conjoint");
  const kids = beneficiaries.filter((b) => b.relation === "enfant");

  function selectCoverage(id: CoverageType) {
    setCoverage(id);
    if (id === "seul") return;
    const st = useSubscription.getState();
    if (!st.beneficiaries.some((b) => b.relation === "conjoint")) {
      st.addBeneficiary(newBeneficiary("conjoint"));
    }
    if (id === "famille") syncChildren(st.childrenCount);
  }

  function changeChildren(next: number) {
    const clamped = Math.min(6, Math.max(0, next));
    setChildrenCount(clamped);
    if (coverage === "famille") syncChildren(clamped);
  }

  function removeChild(id: string) {
    removeBeneficiary(id);
    if (coverage === "famille") {
      const remaining = useSubscription
        .getState()
        .beneficiaries.filter((b) => b.relation === "enfant").length;
      setChildrenCount(remaining);
    }
  }

  return (
    <StepCard>
      <StepTitle
        title="Qui souhaitez-vous assurer ?"
        hint="Vous pourrez ajouter ou retirer des bénéficiaires plus tard, à tout moment."
      />

      {/* Grandes cartes radio */}
      <div role="radiogroup" aria-label="Type de couverture" className="grid gap-3 sm:grid-cols-3">
        {COVERAGE_OPTIONS.map((o) => {
          const active = coverage === o.id;
          const Icon = o.icon;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => selectCoverage(o.id)}
              className={cn(
                "flex min-h-11 flex-col items-start gap-2 rounded-[16px] border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-teal-500",
                active
                  ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500/40"
                  : "border-sand-200 bg-white hover:border-teal-500/50 hover:shadow-soft"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  active ? "bg-teal-900 text-sand-50" : "bg-sand-100 text-teal-900"
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="font-display text-[16px] font-bold">{o.label}</span>
              <span className="text-[13px] leading-snug text-muted-foreground">{o.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Bénéficiaires */}
      <AnimatePresence initial={false}>
        {coverage !== "seul" && (
          <motion.div
            key="beneficiaries"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-6">
              <h3 className="text-[15px] font-semibold">Les personnes à assurer avec vous</h3>

              {spouse && (
                <BeneficiaryCard
                  b={spouse}
                  index={0}
                  errors={visible}
                />
              )}

              {coverage === "famille" && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-sand-100 px-4 py-3">
                    <p className="text-[14px] font-semibold">
                      Enfants à assurer{" "}
                      <span className="tnum text-teal-700">({childrenCount})</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Retirer un enfant"
                        disabled={childrenCount === 0}
                        onClick={() => changeChildren(childrenCount - 1)}
                        className="size-11 rounded-full bg-white"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Ajouter un enfant"
                        disabled={childrenCount >= 6}
                        onClick={() => changeChildren(childrenCount + 1)}
                        className="size-11 rounded-full bg-white"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {kids.map((b, i) => (
                        <BeneficiaryCard
                          key={b.id}
                          b={b}
                          index={(spouse ? 1 : 0) + i}
                          errors={visible}
                          onRemove={() => removeChild(b.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Âge de l'adhérent principal (entre dans le calcul de la prime) */}
      <div className="mt-7 rounded-[16px] border border-sand-200 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="who-age" className="text-[14px] font-semibold">
            Âge de l&apos;adhérent principal
          </label>
          <span className="tnum text-[15px] font-bold text-teal-700">{age} ans</span>
        </div>
        <Slider
          id="who-age"
          value={[age]}
          min={18}
          max={70}
          step={1}
          onValueChange={([v]) => setAge(v)}
          aria-label="Âge de l'adhérent principal"
          className="mt-3"
        />
        <FieldError message={visible["age"]} />
      </div>
    </StepCard>
  );
}
