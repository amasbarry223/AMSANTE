"use client";

import { useEffect, useRef, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Saisie OTP 6 cases : collage du code, autosubmit, renvoi après 60 s
 * avec compte à rebours. Style AMSANTÉ (cases 48 px, teal actif).
 */
export function OtpInput({
  onComplete,
  onResend,
  error,
  className,
}: {
  onComplete: (code: string) => void;
  onResend?: () => void;
  error?: string | null;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const submitted = useRef("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (value.length === 6 && value !== submitted.current) {
      submitted.current = value;
      onComplete(value);
    }
    if (value.length < 6) submitted.current = "";
  }, [value, onComplete]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await onResend?.();
      setValue("");
      submitted.current = "";
      setCooldown(60);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        pattern={REGEXP_ONLY_DIGITS}
        containerClassName="justify-start sm:justify-center gap-2 sm:gap-3"
        aria-label="Code de vérification à 6 chiffres"
        autoComplete="one-time-code"
      >
        <InputOTPGroup>
          {[0, 1, 2].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="size-12 rounded-[10px] border-sand-300 bg-white text-lg font-semibold shadow-xs data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30"
            />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator className="text-sand-300" />
        <InputOTPGroup>
          {[3, 4, 5].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="size-12 rounded-[10px] border-sand-300 bg-white text-lg font-semibold shadow-xs data-[active=true]:border-teal-500 data-[active=true]:ring-teal-500/30"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {error && (
        <p className="text-center text-[13px] font-medium text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {onResend && (
        <div className="flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
          {cooldown > 0 ? (
            <span aria-live="polite">
              Nouveau code dans <span className="tnum font-semibold text-foreground">{cooldown}s</span>
            </span>
          ) : (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-teal-700"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Envoi…" : "Renvoyer le code"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
