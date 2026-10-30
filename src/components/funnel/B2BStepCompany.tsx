"use client";

import { useMemo } from "react";
import { useB2BQuote } from "@/stores/b2bQuote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepCard, StepTitle, FieldError } from "@/components/funnel/shared";
import { B2B_SECTORS, companySchema, fieldErrors } from "@/components/funnel/schemas";

/** Devis entreprise — étape 1 : l'entreprise. */
export function B2BStepCompany({ showErrors }: { showErrors: boolean }) {
  const company = useB2BQuote((s) => s.company);
  const sector = useB2BQuote((s) => s.sector);
  const city = useB2BQuote((s) => s.city);
  const rccm = useB2BQuote((s) => s.rccm);
  const patch = useB2BQuote((s) => s.patch);

  const errors = useMemo(() => {
    const parsed = companySchema.safeParse({ company, sector, city, rccm });
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [company, sector, city, rccm]);
  const visible = showErrors ? errors : {};

  return (
    <StepCard>
      <StepTitle
        title="Votre entreprise"
        hint="Deux minutes suffisent : un conseiller construit ensuite la proposition avec vous."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="b2b-company">Raison sociale</Label>
          <Input
            id="b2b-company"
            value={company}
            onChange={(e) => patch({ company: e.target.value })}
            placeholder="Ex. Sahel Logistique SARL"
            autoComplete="organization"
            aria-invalid={!!visible["company"]}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={visible["company"]} />
        </div>

        <div>
          <Label htmlFor="b2b-sector">Secteur d&apos;activité</Label>
          <Select value={sector} onValueChange={(v) => patch({ sector: v })}>
            <SelectTrigger
              id="b2b-sector"
              aria-label="Secteur d'activité"
              aria-invalid={!!visible["sector"]}
              className="mt-1.5 h-12 w-full rounded-[10px] bg-white text-[15px]"
            >
              <SelectValue placeholder="Choisir un secteur" />
            </SelectTrigger>
            <SelectContent>
              {B2B_SECTORS.map((s) => (
                <SelectItem key={s} value={s} className="text-[15px]">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={visible["sector"]} />
        </div>

        <div>
          <Label htmlFor="b2b-city">Ville du siège</Label>
          <Input
            id="b2b-city"
            value={city}
            onChange={(e) => patch({ city: e.target.value })}
            placeholder="Ex. Bamako"
            autoComplete="address-level2"
            aria-invalid={!!visible["city"]}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={visible["city"]} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="b2b-rccm">
            N° RCCM <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Input
            id="b2b-rccm"
            value={rccm}
            onChange={(e) => patch({ rccm: e.target.value })}
            placeholder="Ex. MA.BKO.2025.B.1234"
            className="tnum mt-1.5 h-12 max-w-sm rounded-[10px]"
          />
        </div>
      </div>
    </StepCard>
  );
}
