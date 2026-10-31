"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Search } from "lucide-react";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/button";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * 500 AMSANTÉ — page d'erreur serveur (composant client obligatoire) :
 * même vocabulaire visuel que la 404 (fond ink, motif bogolan, filigrane),
 * bouton « Réessayer » qui relance le rendu de la page sans perte de navigation.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: brancher l'outil de monitoring (Sentry ou équivalent) ici.
    console.error(error);
  }, [error]);

  return (
    <main className="grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-20 text-sand-50">
      <BogolanTexture color="#E3F4F1" opacity={0.05} />

      {/* Mention 500 géante en filigrane */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[clamp(6rem,20vw,14rem)] font-extrabold leading-none opacity-10"
      >
        500
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="relative flex max-w-2xl flex-col items-center text-center"
        role="alert"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-teal-100">
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          Erreur 500
        </span>

        <SplitHeading
          as="h1"
          trigger={false}
          className="mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] font-bold"
        >
          Un grain de sable dans la machine.
        </SplitHeading>

        <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-sand-50/70">
          Le service a rencontré une erreur inattendue. Rien d&apos;urgent : vos données
          sont en sécurité. Réessayez dans un instant — si le problème persiste, notre
          équipe est prévenue et vous répond sur WhatsApp.
        </p>

        {error?.digest ? (
          <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-sand-50/60">
            Référence&nbsp;: <span className="tnum">{error.digest}</span>
          </p>
        ) : null}

        <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row">
          <PrimaryCta onClick={reset} variant="on-dark">
            <RefreshCw className="size-4" aria-hidden />
            Réessayer
          </PrimaryCta>
          <Button asChild variant="outline-light" size="lg">
            <Link href="/aide">
              <Search className="size-4" aria-hidden />
              Contacter le support
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
