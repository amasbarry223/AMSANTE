"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/button";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * 404 AMSANTÉ — page racine (composant client autorisé) :
 * fond ink, motif bogolan, mention « 404 » géante en filigrane,
 * titre SplitHeading et deux issues : accueil ou annuaire prestataires.
 */
export default function NotFound() {
  return (
    <main className="grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-20 text-sand-50">
      <BogolanTexture color="#E3F4F1" opacity={0.05} />

      {/* Mention 404 géante en filigrane */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[clamp(6rem,20vw,14rem)] font-extrabold leading-none opacity-10"
      >
        404
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="relative flex max-w-2xl flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-teal-100">
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          Erreur 404
        </span>

        <SplitHeading
          as="h1"
          trigger={false}
          className="mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] font-bold"
        >
          Cette page s’est égarée comme un dossier papier.
        </SplitHeading>

        <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-sand-50/70">
          Pas d’inquiétude : vos données, elles, sont bien au numérique. Reprenez la
          route vers l’accueil ou retrouvez un soignant conventionné près de vous.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row">
          <PrimaryCta href="/" variant="on-dark">
            Retour à l’accueil
          </PrimaryCta>
          <Button asChild variant="outline-light" size="lg" className="min-h-12">
            <Link href="/prestataires">
              <Search className="size-4" aria-hidden />
              Trouver un prestataire
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
