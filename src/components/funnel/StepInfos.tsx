"use client";

import { useMemo } from "react";
import { useSubscription } from "@/stores/subscription";
import { communeList } from "@/data/guarantees";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/shared/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepCard, StepTitle, FieldError } from "@/components/funnel/shared";
import { infosSchema, fieldErrors } from "@/components/funnel/schemas";

/** Étape 3 — Informations de l'adhérent principal. */
export function StepInfos({ showErrors }: { showErrors: boolean }) {
  const principal = useSubscription((s) => s.principal);
  const setPrincipal = useSubscription((s) => s.setPrincipal);

  const errors = useMemo(() => {
    const parsed = infosSchema.safeParse(principal);
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [principal]);
  const visible = showErrors ? errors : {};

  const err = (key: keyof typeof principal) => visible[key];

  return (
    <StepCard>
      <StepTitle
        title="Vos informations"
        hint="Elles apparaissent sur votre carte d'assuré et servent à vous joindre pour l'activation."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="infos-firstname">Prénom</Label>
          <Input
            id="infos-firstname"
            value={principal.firstName}
            onChange={(e) => setPrincipal({ firstName: e.target.value })}
            autoComplete="given-name"
            aria-invalid={!!err("firstName")}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={err("firstName")} />
        </div>
        <div>
          <Label htmlFor="infos-lastname">Nom</Label>
          <Input
            id="infos-lastname"
            value={principal.lastName}
            onChange={(e) => setPrincipal({ lastName: e.target.value })}
            autoComplete="family-name"
            aria-invalid={!!err("lastName")}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={err("lastName")} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="infos-phone">Téléphone (Mobile Money)</Label>
          <div className="mt-1.5">
            <PhoneInput
              value={principal.phone}
              onChange={(raw) => setPrincipal({ phone: raw })}
              error={err("phone")}
              aria-label="Numéro de téléphone"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="infos-email">
            E-mail <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Input
            id="infos-email"
            type="email"
            value={principal.email}
            onChange={(e) => setPrincipal({ email: e.target.value })}
            placeholder="fatou@example.ml"
            autoComplete="email"
            aria-invalid={!!err("email")}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={err("email")} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="infos-commune">Commune</Label>
          <Select
            value={principal.commune}
            onValueChange={(v) => setPrincipal({ commune: v })}
          >
            <SelectTrigger
              id="infos-commune"
              aria-label="Commune de résidence"
              aria-invalid={!!err("commune")}
              className="mt-1.5 h-12 w-full rounded-[10px] bg-white text-[15px]"
            >
              <SelectValue placeholder="Choisir votre commune" />
            </SelectTrigger>
            <SelectContent>
              {communeList.map((c) => (
                <SelectItem key={c} value={c} className="text-[15px]">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err("commune")} />
        </div>
        <div>
          <Label htmlFor="infos-quartier">Quartier</Label>
          <Input
            id="infos-quartier"
            value={principal.quartier}
            onChange={(e) => setPrincipal({ quartier: e.target.value })}
            placeholder="Ex. Badalabougou"
            autoComplete="address-level3"
            aria-invalid={!!err("quartier")}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={err("quartier")} />
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="infos-id">N° de pièce d&apos;identité (NINA ou autre)</Label>
        <Input
          id="infos-id"
          value={principal.idNumber}
          onChange={(e) => setPrincipal({ idNumber: e.target.value })}
          placeholder="Ex. B-1234-56789"
          aria-invalid={!!err("idNumber")}
          className="tnum mt-1.5 h-12 max-w-sm rounded-[10px]"
        />
        <FieldError message={err("idNumber")} />
      </div>
    </StepCard>
  );
}
