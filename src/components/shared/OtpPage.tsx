"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Delete,
  Loader2,
  MailCheck,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/button";
import { requestOtp, verifyOtp } from "@/lib/api";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/lib/utils/format";

/* Clés partagées avec /connexion — le téléphone (ou l’e-mail pro) transite via sessionStorage. */
const OTP_IDENTITY_KEY = "amsante-otp-phone";
const OTP_PROFILE_KEY = "amsante-otp-profile";

const MAX_OTP_ERRORS = 2;
const LOCK_SECONDS = 30;

/* Lecture réactive de sessionStorage — évite tout setState synchrone dans un effet
   et tout décalage d’hydratation (getServerSnapshot → null). */
const subscribeNoop = () => () => {};
const readIdentity = () => window.sessionStorage.getItem(OTP_IDENTITY_KEY);
const readProfile = () => window.sessionStorage.getItem(OTP_PROFILE_KEY);
const readServerNull = () => null;

type Phase = "otp" | "pin" | "opening" | "ready";
type PinStage = "set" | "confirm";

export function OtpPage() {
  const router = useRouter();
  const identity = useSyncExternalStore(subscribeNoop, readIdentity, readServerNull);
  const profileKey = useSyncExternalStore(subscribeNoop, readProfile, readServerNull);
  const profile = profileKey ?? "assure";
  const isPro = profile === "entreprise" || profile === "prestataire" || profile === "cabinet";

  const [phase, setPhase] = useState<Phase>("otp");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpErrors, setOtpErrors] = useState(0);
  const [otpEpoch, setOtpEpoch] = useState(0); // remonte l’input après un verrouillage
  const [lockSeconds, setLockSeconds] = useState(0);
  const [busy, setBusy] = useState(false);

  // PIN (profils pro)
  const [pinStage, setPinStage] = useState<PinStage>("set");
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  const openingTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (openingTimer.current !== null) window.clearTimeout(openingTimer.current);
    },
    []
  );

  // Identifiant absent (accès direct à l’URL) → retour à la connexion.
  useEffect(() => {
    if (identity === null) {
      router.replace("/connexion");
    }
  }, [identity, router]);

  // Compte à rebours du verrouillage après 2 codes erronés.
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const t = setInterval(() => setLockSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [lockSeconds]);

  const openSpace = useCallback(() => {
    window.sessionStorage.removeItem(OTP_IDENTITY_KEY);
    window.sessionStorage.removeItem(OTP_PROFILE_KEY);
    setPhase("opening");
    // Rideau teal 1,2 s puis état final « Votre espace est prêt ».
    openingTimer.current = window.setTimeout(() => setPhase("ready"), 1200);
  }, []);

  const handleComplete = useCallback(
    async (code: string) => {
      if (!identity || busy || lockSeconds > 0) return;
      setBusy(true);
      setOtpError(null);
      try {
        await verifyOtp(identity, code);
        if (isPro) {
          setOtpEpoch((e) => e + 1); // input neuf si l’utilisateur revient au code
          setPinStage("set");
          setPin("");
          setFirstPin("");
          setPinError(null);
          setPhase("pin");
        } else {
          openSpace();
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Code invalide ou expiré. Vérifiez le SMS ou demandez un nouveau code.";
        const next = otpErrors + 1;
        setOtpErrors(next);
        if (next >= MAX_OTP_ERRORS) {
          setOtpEpoch((e) => e + 1);
          setOtpError(null);
          setLockSeconds(LOCK_SECONDS);
          toast.warning("Trop de codes erronés — réessayez dans 30 secondes.");
        } else {
          setOtpError(`${message} Il vous reste ${MAX_OTP_ERRORS - next} tentative.`);
        }
      } finally {
        setBusy(false);
      }
    },
    [identity, busy, lockSeconds, otpErrors, isPro, openSpace]
  );

  const handleResend = useCallback(async () => {
    if (!identity) return;
    // Le mock OTP officiel attend un téléphone ; pour un identifiant e-mail
    // on simule l’envoi localement (parcours pro).
    if (/^\d{8}$/.test(identity)) {
      try {
        await requestOtp(identity);
        toast.success("Nouveau code envoyé par SMS.");
      } catch {
        toast.error("Envoi impossible pour le moment. Réessayez.");
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Nouveau code envoyé à votre adresse e-mail.");
    }
  }, [identity]);

  /* ── Identifiant absent : écran neutre pendant la redirection ─────── */
  if (identity === null) {
    return (
      <div className="flex flex-1 items-center justify-center px-5 py-20">
        <p className="text-sm text-muted-foreground" role="status">
          Redirection vers la connexion…
        </p>
      </div>
    );
  }

  const identityLabel = /^\d{8}$/.test(identity)
    ? `+223 ${formatPhone(identity).replace("+223 ", "")}`
    : identity;

  return (
    <div className="relative flex flex-1 items-center justify-center px-5 py-12 sm:py-16">
      <AnimatePresence>
        {phase === "opening" && (
          <motion.div
            key="curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-teal-500 text-ink"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="size-10 animate-spin" aria-hidden />
            <p className="font-display text-lg font-bold">Ouverture de votre espace…</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {phase !== "ready" ? (
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="w-full max-w-md rounded-[28px] border border-sand-200 bg-white p-7 shadow-soft sm:p-9"
          >
            {phase === "otp" && (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    {isPro ? (
                      <MailCheck className="size-5" aria-hidden />
                    ) : (
                      <MessageSquareText className="size-5" aria-hidden />
                    )}
                  </span>
                  <div>
                    <h1 className="font-display text-xl font-bold text-ink">
                      Confirmez votre identité
                    </h1>
                    <p className="mt-0.5 text-[13.5px] text-muted-foreground">
                      Code envoyé à{" "}
                      <strong className="tnum font-semibold text-foreground">
                        {identityLabel}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  {lockSeconds > 0 ? (
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-[16px] border border-warning/40 bg-warning/10 p-5 text-center"
                    >
                      <p className="text-sm font-bold text-ink">Trop de codes erronés</p>
                      <p className="mt-1 text-[13.5px] text-muted-foreground">
                        Nouvelle tentative dans{" "}
                        <span className="tnum font-bold text-foreground">{lockSeconds}s</span>
                      </p>
                    </div>
                  ) : (
                    <OtpInput
                      key={otpEpoch}
                      onComplete={handleComplete}
                      onResend={handleResend}
                      error={otpError}
                      className={cn(busy && "pointer-events-none opacity-70")}
                    />
                  )}
                  {busy && (
                    <p className="mt-4 flex items-center justify-center gap-2 text-[13.5px] font-medium text-teal-700" role="status">
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Vérification du code…
                    </p>
                  )}
                </div>

                <p className="mt-7 text-center text-[13px] text-muted-foreground">
                  Pas le bon numéro ?{" "}
                  <Link href="/connexion" className="link-underline font-semibold text-teal-700">
                    Retour à la connexion
                  </Link>
                </p>
              </>
            )}

            {phase === "pin" && (
              <>
                <div className="text-center">
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    <ShieldCheck className="size-5" aria-hidden />
                  </span>
                  <h1 className="mt-4 font-display text-xl font-bold text-ink">
                    {pinStage === "set" ? "Créez votre code PIN" : "Confirmez votre code PIN"}
                  </h1>
                  <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">
                    {pinStage === "set"
                      ? "4 chiffres, faciles à retenir : il remplacera votre mot de passe sur mobile."
                      : "Saisissez à nouveau le même code pour valider."}
                  </p>
                </div>

                {/* points masqués */}
                <div className="mt-7 flex items-center justify-center gap-3.5" role="img" aria-label={`Code PIN : ${pin.length} chiffre${pin.length > 1 ? "s" : ""} saisi${pin.length > 1 ? "s" : ""} sur 4`}>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      aria-hidden
                      className={cn(
                        "size-3.5 rounded-full transition-colors",
                        i < pin.length ? "bg-teal-900" : "bg-sand-300"
                      )}
                    />
                  ))}
                </div>

                {pinError && (
                  <p className="mt-4 text-center text-[13px] font-medium text-destructive" role="alert" aria-live="polite">
                    {pinError}
                  </p>
                )}

                {/* pavé numérique */}
                <div className="mx-auto mt-6 grid max-w-[248px] grid-cols-3 gap-2.5" role="group" aria-label="Pavé numérique">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setPin((p) => (p.length < 4 ? p + String(d) : p))}
                      className="tnum size-12 rounded-full bg-sand-100 text-lg font-semibold text-ink transition-colors hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:bg-teal-500/30"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPin((p) => p.slice(0, -1))}
                    className="flex size-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    aria-label="Effacer le dernier chiffre"
                  >
                    <Delete className="size-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPin((p) => (p.length < 4 ? p + "0" : p))}
                    className="tnum size-12 rounded-full bg-sand-100 text-lg font-semibold text-ink transition-colors hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:bg-teal-500/30"
                  >
                    0
                  </button>
                  <span aria-hidden />
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="mt-7 min-h-12 w-full"
                  disabled={pin.length !== 4}
                  onClick={() => {
                    if (pin.length !== 4) return;
                    if (pinStage === "set") {
                      setFirstPin(pin);
                      setPin("");
                      setPinError(null);
                      setPinStage("confirm");
                    } else if (pin === firstPin) {
                      openSpace();
                    } else {
                      setPinError("Les deux codes ne correspondent pas. Recommencez.");
                      setPin("");
                      setFirstPin("");
                      setPinStage("set");
                    }
                  }}
                >
                  {pinStage === "set" ? "Continuer" : "Confirmer"}
                </Button>

                <p className="mt-5 text-center text-[13px] text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => {
                      setPin("");
                      setFirstPin("");
                      setPinError(null);
                      setPinStage("set");
                      setPhase("otp");
                    }}
                    className="link-underline font-semibold text-teal-700"
                  >
                    Revenir au code SMS / e-mail
                  </button>
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="w-full max-w-md rounded-[28px] border border-sand-200 bg-white p-9 text-center shadow-soft"
            role="status"
            aria-live="polite"
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-9 text-success" aria-hidden />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold text-ink">
              Votre espace est prêt
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-[14.5px] leading-relaxed text-muted-foreground">
              Bienvenue sur AMSANTÉ. La suite se passe dans votre espace sécurisé —
              carte, remboursements et proches vous y attendent.
            </p>
            {/* TODO: remplacer par la vraie APP_URL de l'espace client */}
            <Button asChild size="lg" className="mt-7 min-h-12 w-full">
              <a href="https://app.amsante.ml" target="_blank" rel="noreferrer">
                Continuer vers mon espace
              </a>
            </Button>
            <p className="mt-4 text-[12px] text-muted-foreground/80">
              Environnement de démonstration — l’ouverture se fera sur app.amsante.ml.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
