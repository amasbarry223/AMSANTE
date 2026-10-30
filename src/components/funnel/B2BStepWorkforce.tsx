"use client";

import { useMemo, useState } from "react";
import { useB2BQuote } from "@/stores/b2bQuote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StepCard, StepTitle, FieldError } from "@/components/funnel/shared";
import { fieldErrors, workforceSchema } from "@/components/funnel/schemas";

function WorkforceRow({
  id,
  label,
  value,
  min,
  max,
  suffix,
  error,
  onChange,
  onCommit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  error?: string;
  onChange: (n: number) => void;
  onCommit: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className="rounded-[16px] border border-sand-200 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-[14px] font-semibold">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="text"
            inputMode="numeric"
            value={focused && draft !== null ? draft : String(value)}
            onFocus={() => {
              setFocused(true);
              setDraft(String(value));
            }}
            onBlur={() => {
              setFocused(false);
              setDraft(null);
              onCommit();
            }}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
              setDraft(raw);
              const n = parseInt(raw, 10);
              onChange(Number.isNaN(n) ? 0 : Math.min(max, n));
            }}
            aria-label={`${label} (saisie numérique)`}
            className="tnum h-11 w-24 rounded-[10px] text-right"
          />
          <span className="w-24 text-[13px] text-muted-foreground">{suffix}</span>
        </div>
      </div>
      <Slider
        value={[Math.min(max, Math.max(min, value))]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
        className="mt-4"
      />
      <FieldError message={error} />
    </div>
  );
}

/** Devis entreprise — étape 2 : effectif (salariés + ayants droit). */
export function B2BStepWorkforce({ showErrors }: { showErrors: boolean }) {
  const employees = useB2BQuote((s) => s.employees);
  const dependents = useB2BQuote((s) => s.dependents);
  const patch = useB2BQuote((s) => s.patch);

  const errors = useMemo(() => {
    const parsed = workforceSchema.safeParse({ employees, dependents });
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [employees, dependents]);
  const visible = showErrors ? errors : {};

  const commitEmployees = () =>
    patch({ employees: Math.min(500, Math.max(5, useB2BQuote.getState().employees)) });
  const commitDependents = () =>
    patch({ dependents: Math.min(300, Math.max(0, useB2BQuote.getState().dependents)) });

  return (
    <StepCard>
      <StepTitle
        title="Votre effectif"
        hint="Salariés + ayants droit (conjoint·e et enfants). Vous pourrez ajuster la liste à l'activation."
      />

      <div className="space-y-4">
        <WorkforceRow
          id="b2b-employees"
          label="Salariés à couvrir"
          value={employees}
          min={5}
          max={500}
          suffix="salariés"
          error={visible["employees"]}
          onChange={(n) => patch({ employees: n })}
          onCommit={commitEmployees}
        />
        <WorkforceRow
          id="b2b-dependents"
          label="Ayants droit déclarés"
          value={dependents}
          min={0}
          max={300}
          suffix="ayants droit"
          error={visible["dependents"]}
          onChange={(n) => patch({ dependents: n })}
          onCommit={commitDependents}
        />
      </div>

      <p className="mt-5 rounded-[12px] bg-teal-50 px-4 py-3 text-[14px] text-teal-900" aria-live="polite">
        Effectif total à couvrir :{" "}
        <span className="tnum font-bold">{employees + dependents} personnes</span>
      </p>
    </StepCard>
  );
}
