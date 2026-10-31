"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  RefreshCw,
  Smartphone,
  Wallet,
  XCircle,
} from "lucide-react";
import { createSubscription, getPaymentStatus, initMobileMoneyPayment } from "@/lib/api";
import { useSubscription } from "@/stores/subscription";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Button } from "@/components/ui/button";
import {
  CONFIRM_SESSION_KEY,
  MOBILE_MONEY_OPERATORS,
  buildSubscriptionPayload,
  mmss,
} from "@/components/funnel/shared";
import type { MobileMoneyOperator } from "@/data/types";
import { duration, ease } from "@/lib/motion/tokens";
import { formatFcfa } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const WAIT_TOTAL = 120; // secondes avant expiration

type Phase = "choose" | "waiting" | "failed" | "expired" | "creating";

/**
 * Paiement Mobile Money : choix de l'opérateur, demande de paiement, écran
 * d'attente avec vibration + compte à rebours, sondage du statut toutes les
 * 3 s, puis création du contrat à la réussite.
 */
export function MobileMoneyPay({ amount }: { amount: number }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("choose");
  const [operator, setOperator] = useState<MobileMoneyOperator>(
    () => (useSubscription.getState().payment.operator as MobileMoneyOperator | null) ?? "orange_money"
  );
  const [phone, setPhone] = useState(() => useSubscription.getState().payment.phone);
  const [payError, setPayError] = useState<string | null>(null);
  const [payee, setPayee] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(WAIT_TOTAL);
  const [starting, setStarting] = useState(false);

  const pollRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const deadlineRef = useRef(0);
  const paidRef = useRef(false);
  const aliveRef = useRef(true);
  const launchingRef = useRef(false);
  /** Paiement reçu MAIS échec de création du contrat (message distinct, honnête). */
  const [contractError, setContractError] = useState(false);

  function stopTimers() {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopTimers();
    };
  }, []);

  async function finalize() {
    setPhase("creating");
    try {
      const result = await createSubscription(buildSubscriptionPayload());
      useSubscription.getState().markCompleted(result.reference);
      try {
        sessionStorage.setItem(CONFIRM_SESSION_KEY, JSON.stringify(result));
      } catch {
        /* stockage indisponible : la confirmation utilisera le store */
      }
      router.push("/souscrire/confirmation");
    } catch {
      /* Le débit a abouti mais le contrat n’a pas pu être créé :
         message spécifique, on ne dit surtout pas « aucun montant débité ». */
      setContractError(true);
      setPhase("failed");
    }
  }

  async function launch(op: MobileMoneyOperator, payeePhone: string) {
    // Garde anti double-soumission (double-clic avant re-render).
    if (launchingRef.current) return;
    launchingRef.current = true;
    try {
      await doLaunch(op, payeePhone);
    } finally {
      launchingRef.current = false;
    }
  }

  async function doLaunch(op: MobileMoneyOperator, payeePhone: string) {
    if (!/^\d{8}$/.test(payeePhone)) {
      setPayError("Ce numéro doit contenir 8 chiffres après +223.");
      return;
    }
    setPayError(null);
    const store = useSubscription.getState();
    store.setPayment({ operator: op, phone: payeePhone });
    paidRef.current = false;
    setContractError(false);
    setPayee(payeePhone);
    setSecondsLeft(WAIT_TOTAL);
    deadlineRef.current = Date.now() + WAIT_TOTAL * 1000;
    setPhase("waiting");
    setStarting(true);

    let paymentId: string;
    try {
      const session = await initMobileMoneyPayment({ operator: op, phone: payeePhone, amount });
      if (!aliveRef.current) return;
      paymentId = session.paymentId;
      store.setPayment({ paymentId });
    } catch {
      if (aliveRef.current) setPhase("failed");
      return;
    } finally {
      if (aliveRef.current) setStarting(false);
    }

    stopTimers();
    const startedAt = Date.now();
    pollRef.current = window.setInterval(async () => {
      if (paidRef.current || !aliveRef.current) return;
      try {
        const status = await getPaymentStatus(paymentId, startedAt);
        if (paidRef.current || !aliveRef.current) return;
        if (status === "succes") {
          paidRef.current = true;
          stopTimers();
          void finalize();
        } else if (status === "echoue") {
          stopTimers();
          setPhase("failed");
        }
      } catch {
        /* réseau indisponible : nouvelle tentative au prochain tick */
      }
    }, 3000);
    tickRef.current = window.setInterval(() => {
      const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && !paidRef.current) {
        stopTimers();
        setPhase("expired");
      }
    }, 1000);
  }

  const operatorInfo = MOBILE_MONEY_OPERATORS.find((o) => o.id === operator) ?? MOBILE_MONEY_OPERATORS[0];

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {/* ── Choix de l'opérateur ─────────────────────────────────── */}
        {phase === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="space-y-5"
          >
            <div role="radiogroup" aria-label="Opérateur Mobile Money" className="grid gap-3 sm:grid-cols-3">
              {MOBILE_MONEY_OPERATORS.map((o) => {
                const active = operator === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setOperator(o.id)}
                    className={cn(
                      "flex min-h-11 flex-col gap-3 rounded-[16px] border bg-white p-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-teal-500",
                      active
                        ? "border-teal-500 shadow-soft ring-1 ring-teal-500/40"
                        : "border-sand-200 hover:border-teal-500/50 hover:shadow-soft"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-14 items-center justify-center gap-2 rounded-[10px] font-display text-[15px] font-bold",
                        o.tileClass
                      )}
                    >
                      <Wallet className="size-5" />
                      {o.name}
                    </span>
                    <span className="text-[12.5px] text-muted-foreground">
                      {o.name === "Wave" ? "Application" : "USSD"} · confirmation sur votre téléphone
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="max-w-sm">
              <p className="mb-1.5 text-[13px] font-semibold">Numéro Mobile Money payeur</p>
              <PhoneInput value={phone} onChange={setPhone} error={payError ?? undefined} aria-label="Numéro Mobile Money payeur" />
              {payError === null && phone.length > 0 && phone.endsWith("0000") && (
                <p className="mt-1.5 text-[12.5px] text-muted-foreground" aria-live="polite">
                  Démo : un numéro finissant par 0000 simule un paiement refusé.
                </p>
              )}
            </div>

            <Button
              type="button"
              size="lg"
              className="min-h-13 w-full sm:w-auto"
              disabled={starting}
              onClick={() => launch(operator, phone)}
            >
              {starting && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Payer <AmountDisplay value={amount} suffix={false} className="font-bold" /> FCFA
            </Button>

            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              Aucun frais supplémentaire : la prime affichée est la prime payée. Vous validez le
              paiement sur votre téléphone, la carte est émise juste après.
            </p>
          </motion.div>
        )}

        {/* ── En attente de validation ─────────────────────────────── */}
        {phase === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="flex flex-col items-center rounded-card-lg border border-teal-100 bg-teal-50/70 px-6 py-10 text-center"
            aria-live="polite"
          >
            <motion.span
              aria-hidden
              className="flex size-20 items-center justify-center rounded-full bg-teal-900 text-sand-50 shadow-soft"
              animate={{ y: [0, -3, 0], rotate: [0, -7, 6, -4, 0] }}
              transition={{ duration: duration.base, repeat: Infinity, ease: ease.inOut }}
            >
              <Smartphone className="size-9" />
            </motion.span>
            <p className="mt-5 font-display text-xl font-bold">Validez le paiement sur votre téléphone</p>
            <p className="mt-1.5 max-w-sm text-[14px] text-muted-foreground">
              Une demande <span className="font-semibold text-teal-900">{operatorInfo.name}</span> de{" "}
              <span className="tnum font-semibold text-teal-900">{formatFcfa(amount)}</span> a été envoyée
              au <span className="tnum font-semibold">+223 {payee.replace(/(\d{2})(?=\d)/g, "$1 ")}</span>.
            </p>
            <p className="tnum mt-5 text-[32px] font-bold leading-none text-teal-900">
              {mmss(Math.max(0, secondsLeft))}
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Ne fermez pas cette page — la confirmation est automatique.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="mt-6 min-h-11"
              onClick={() => {
                stopTimers();
                setPhase("choose");
              }}
            >
              <ChevronLeft className="size-4" aria-hidden />
              Annuler et choisir un autre moyen
            </Button>
          </motion.div>
        )}

        {/* ── Échec ────────────────────────────────────────────────── */}
        {phase === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="rounded-card-lg border border-destructive/40 bg-destructive/5 px-6 py-10 text-center"
            role="alert"
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="size-8" aria-hidden />
            </span>
            <p className="mt-4 font-display text-xl font-bold text-destructive">
              {contractError ? "Paiement reçu — contrat non émis" : "Paiement refusé"}
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[14px] text-muted-foreground">
              {contractError
                ? "Votre paiement est bien arrivé, mais la création du contrat a échoué. Notre équipe vous rembourse ou régularise sous 24 h — contactez le support avec la référence affichée sur votre SMS de débit."
                : "Le paiement n’a pas abouti. Vérifiez votre solde Mobile Money ou utilisez un autre numéro — aucun montant n’a été débité."}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Button type="button" className="min-h-11" onClick={() => launch(operator, payee || phone)}>
                <RefreshCw className="size-4" aria-hidden />
                Réessayer
              </Button>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => setPhase("choose")}>
                Changer de moyen de paiement
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Expiration ───────────────────────────────────────────── */}
        {phase === "expired" && (
          <motion.div
            key="expired"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="rounded-card-lg border border-warning/50 bg-warning/10 px-6 py-10 text-center"
            role="alert"
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning/15 text-warning">
              <AlertTriangle className="size-8" aria-hidden />
            </span>
            <p className="mt-4 font-display text-xl font-bold">Délai dépassé</p>
            <p className="mx-auto mt-1.5 max-w-sm text-[14px] text-muted-foreground">
              La demande de paiement a expiré avant validation. Relancez : vous aurez à nouveau
              2 minutes sur votre téléphone.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Button type="button" className="min-h-11" onClick={() => launch(operator, payee || phone)}>
                <RefreshCw className="size-4" aria-hidden />
                Réessayer
              </Button>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => setPhase("choose")}>
                Changer de moyen de paiement
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Création du contrat ──────────────────────────────────── */}
        {phase === "creating" && (
          <motion.div
            key="creating"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="flex flex-col items-center px-6 py-12 text-center"
            aria-live="polite"
          >
            <Loader2 className="size-9 animate-spin text-teal-700" aria-hidden />
            <p className="mt-4 flex items-center gap-2 font-display text-xl font-bold">
              <CheckCircle2 className="size-5 text-success" aria-hidden />
              Paiement reçu — édition de votre contrat…
            </p>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              Quelques secondes : nous générons votre référence et votre carte d&apos;assuré.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
