"use client";

import { forwardRef, useState } from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { parsePhone } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

/**
 * Champ téléphone malien avec masque de saisie : `+223 XX XX XX XX`.
 * Affiche une erreur humaine si invalide (8 chiffres attendus).
 */
export const PhoneInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> & {
    value?: string;
    onChange?: (raw: string) => void;
    error?: string;
  }
>(function PhoneInput({ value = "", onChange, error, className, ...props }, ref) {
  const [focused, setFocused] = useState(false);
  // Affichage : chiffres locaux groupés par 2 (le préfixe +223 est statique).
  const groups = value.replace(/\D/g, "").match(/.{1,2}/g) ?? [];
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm font-semibold text-foreground/70">
          +223
        </span>
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="70 00 00 00"
          className={cn(
            "h-12 rounded-[10px] pl-[92px] text-[15px]",
            error && "border-destructive focus-visible:ring-destructive/30",
            className
          )}
          value={groups.join(" ")}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange?.(parsePhone(e.target.value))}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-[13px] font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : focused && value.length > 0 && value.length < 8 ? (
        <p className="text-[13px] text-muted-foreground" aria-live="polite">
          {8 - value.length} chiffre{8 - value.length > 1 ? "s" : ""} restant
          {8 - value.length > 1 ? "s" : ""}
        </p>
      ) : null}
    </div>
  );
});
