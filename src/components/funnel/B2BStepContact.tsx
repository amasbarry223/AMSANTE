"use client";

import { useMemo } from "react";
import { useB2BQuote } from "@/stores/b2bQuote";
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
import { B2B_SLOTS, contactSchema, fieldErrors } from "@/components/funnel/schemas";

/** Devis entreprise — étape 4 : contact et créneau de rappel. */
export function B2BStepContact({ showErrors }: { showErrors: boolean }) {
  const contactName = useB2BQuote((s) => s.contactName);
  const contactRole = useB2BQuote((s) => s.contactRole);
  const phone = useB2BQuote((s) => s.phone);
  const email = useB2BQuote((s) => s.email);
  const slot = useB2BQuote((s) => s.slot);
  const patch = useB2BQuote((s) => s.patch);

  const errors = useMemo(() => {
    const parsed = contactSchema.safeParse({ contactName, contactRole, phone, email, slot });
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [contactName, contactRole, phone, email, slot]);
  const visible = showErrors ? errors : {};

  return (
    <StepCard>
      <StepTitle
        title="Qui doit-on rappeler ?"
        hint="Un conseiller dédié vous appelle sous 24 h ouvrées, au créneau qui vous arrange."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="b2b-contact-name">Nom et prénom</Label>
          <Input
            id="b2b-contact-name"
            value={contactName}
            onChange={(e) => patch({ contactName: e.target.value })}
            placeholder="Ex. Aïssata Coulibaly"
            autoComplete="name"
            aria-invalid={!!visible["contactName"]}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={visible["contactName"]} />
        </div>
        <div>
          <Label htmlFor="b2b-contact-role">Fonction</Label>
          <Input
            id="b2b-contact-role"
            value={contactRole}
            onChange={(e) => patch({ contactRole: e.target.value })}
            placeholder="Ex. DRH"
            autoComplete="organization-title"
            aria-invalid={!!visible["contactRole"]}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={visible["contactRole"]} />
        </div>

        <div>
          <Label htmlFor="b2b-phone">Téléphone</Label>
          <div className="mt-1.5">
            <PhoneInput
              value={phone}
              onChange={(raw) => patch({ phone: raw })}
              error={visible["phone"]}
              aria-label="Numéro de téléphone"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="b2b-email">E-mail professionnel</Label>
          <Input
            id="b2b-email"
            type="email"
            value={email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder="a.coulibaly@entreprise.ml"
            autoComplete="email"
            aria-invalid={!!visible["email"]}
            className="mt-1.5 h-12 rounded-[10px]"
          />
          <FieldError message={visible["email"]} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="b2b-slot">Créneau de rappel</Label>
          <Select value={slot} onValueChange={(v) => patch({ slot: v })}>
            <SelectTrigger
              id="b2b-slot"
              aria-label="Créneau de rappel"
              aria-invalid={!!visible["slot"]}
              className="mt-1.5 h-12 w-full max-w-sm rounded-[10px] bg-white text-[15px]"
            >
              <SelectValue placeholder="Choisir un créneau" />
            </SelectTrigger>
            <SelectContent>
              {B2B_SLOTS.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-[15px]">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={visible["slot"]} />
        </div>
      </div>
    </StepCard>
  );
}
