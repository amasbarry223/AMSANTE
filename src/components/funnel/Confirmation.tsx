"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarClock, Check, FileDown, UserRound } from "lucide-react";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { Button } from "@/components/ui/button";
import { InsuranceCard2D } from "@/components/cards/InsuranceCard2D";
import { useSubscription } from "@/stores/subscription";
import { getFormula } from "@/data/products";
import { CONFIRM_SESSION_KEY } from "@/components/funnel/shared";
import { toast } from "sonner";
import { ease } from "@/lib/motion/tokens";
import type { SubscriptionResult } from "@/lib/api";
import { canRender3D } from "@/lib/utils/device";

const CardScene = dynamic(() => import("@/components/three/CardScene"), { ssr: false });

interface ConfirmationData {
  reference: string;
  cardCode: string;
  validUntil: string;
  holderName: string;
  formulaName: string;
  firstName: string;
}

const CONFETTI_COLORS = ["#17A398", "#E07A3F", "#7CCFC8"];

function fallbackCardCode(): string {
  return `AMSA-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function ConfirmationSkeleton() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" aria-hidden>
      <span className="size-10 animate-spin rounded-full border-[3px] border-teal-500 border-t-transparent" />
      <p className="text-[14px] text-muted-foreground">Préparation de votre confirmation…</p>
    </div>
  );
}

/**
 * Confirmation de souscription : confettis sobres, carte 3D (ou 2D selon
 * l'appareil), références du contrat et prochaines étapes.
 */
export function Confirmation() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [show3D, setShow3D] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  /* Garde + capture des données avant reset du store. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const s = useSubscription.getState();
      if (!s.completedAt || !s.reference) {
        router.replace("/souscrire");
        return;
      }

      let saved: Partial<SubscriptionResult> = {};
      try {
        saved = JSON.parse(sessionStorage.getItem(CONFIRM_SESSION_KEY) ?? "{}") as Partial<SubscriptionResult>;
      } catch {
        saved = {};
      }

      const holderName =
        saved.holderName ??
        (`${s.principal.firstName} ${s.principal.lastName}`.trim() || "Assuré AMSANTÉ");

      setData({
        reference: s.reference,
        cardCode: saved.cardCode ?? fallbackCardCode(),
        validUntil:
          saved.validUntil ??
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        holderName,
        // Jamais de fallback "Confort" en dur : le nom vient du store (la
        // session peut être indisponible, le formule du store reste fiable).
        formulaName: saved.formulaName ?? getFormula(s.formula).name,
        firstName: holderName.split(" ")[0] ?? "",
      });

      useSubscription.getState().reset();
      setReady(true);
      setShow3D(canRender3D());

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setConfetti(false);
      } else {
        setConfetti(true);
        timerRef.current = window.setTimeout(() => setConfetti(false), 2400);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [router]);

  /* 24 particules maison — pas de librairie. */
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 460,
        y: 120 + Math.random() * 260,
        rotate: Math.random() * 420 - 210,
        delay: Math.random() * 0.3,
        d: 1.4 + Math.random() * 0.8,
        size: 6 + Math.random() * 7,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    []
  );

  if (!ready || !data) return <ConfirmationSkeleton />;

  return (
    <div className="relative pb-10">
      {confetti && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute left-1/2 top-1/3 rounded-[2px]"
              style={{ width: p.size, height: p.size, backgroundColor: p.color }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: 0 }}
              transition={{ duration: p.d, delay: p.delay, ease: ease.out }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={ease.spring}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success"
        >
          <Check className="size-8" aria-hidden />
        </motion.span>

        <h1 className="mt-6 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-tight">
          Bienvenue chez AMSANTÉ, {data.firstName} !
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
          Votre contrat <span className="font-semibold text-foreground">{data.formulaName}</span> est
          actif. Voici votre carte d&apos;assuré digitale — présentez son QR code chez tout
          prestataire conventionné.
        </p>
        <p className="tnum mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-[13.5px] font-semibold text-teal-900">
          Référence {data.reference}
        </p>
      </div>

      {/* Carte — 3D quand l'appareil le permet, 2D sinon */}
      <div className="mt-10">
        {show3D ? (
          <div className="relative mx-auto h-[400px] w-full max-w-2xl sm:h-[440px]">
            <CardScene cardCode={data.cardCode} holder={data.holderName} formula={data.formulaName} />
            <p className="pointer-events-none absolute inset-x-0 -bottom-1 text-center text-[12px] text-muted-foreground">
              Cliquez sur la carte pour la retourner.
            </p>
          </div>
        ) : (
          <div className="flex justify-center px-4">
            <InsuranceCard2D
              size="lg"
              cardCode={data.cardCode}
              validUntil={data.validUntil}
              holderName={data.holderName}
              formula={data.formulaName}
            />
          </div>
        )}
      </div>

      {/* Prochaines étapes */}
      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="rounded-[16px] border border-sand-200 bg-white p-5 text-left shadow-soft">
          <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-900">
            <CalendarClock className="size-5" aria-hidden />
          </span>
          <p className="mt-3 font-display text-[16px] font-bold">Délai de carence : 10 jours</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
            Votre couverture démarre 10 jours après la souscription (30 jours pour la maternité).
            En cas d&apos;urgence vitale, la prise en charge est immédiate.
          </p>
        </div>
        <div className="rounded-[16px] border border-sand-200 bg-white p-5 text-left shadow-soft">
          <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-900">
            <UserRound className="size-5" aria-hidden />
          </span>
          <p className="mt-3 font-display text-[16px] font-bold">Activez votre espace client</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
            Connectez-vous avec votre numéro Mobile Money pour suivre vos remboursements, vos
            ayants droit et télécharger vos attestations.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="min-h-12 bg-white"
          onClick={() => toast.info("La génération du PDF arrive bientôt")}
        >
          <FileDown className="size-4" aria-hidden />
          Télécharger ma carte (PDF)
        </Button>
        <PrimaryCta href="/connexion" className="min-h-12">
          Accéder à mon espace
        </PrimaryCta>
        <Button asChild variant="ghost" className="min-h-12">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
