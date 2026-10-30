"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/button";
import { InsuranceCard2D } from "@/components/cards/InsuranceCard2D";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { duration, ease } from "@/lib/motion/tokens";

/** CTA final : grande carte teal plein écran, carte 2D flottante, bouton magnétique. */
export function FinalCta() {
  return (
    <section className="container-ams pb-28" aria-label="Passer à l'action">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0F5B57_0%,#0B1F1E_75%)] px-8 py-16 text-sand-50 shadow-card sm:px-14 sm:py-20">
          <BogolanTexture color="#E3F4F1" opacity={0.06} />
          <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-teal-500/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SplitHeading
                trigger={false}
                className="font-display text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.03]"
              >
                Prêt à dire adieu aux papiers ?
              </SplitHeading>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-teal-100/80">
                Simulez votre prime en 30 secondes. Votre carte d&apos;assuré digitale arrive
                dès que le paiement passe — souvent avant même d&apos;avoir refermé votre téléphone.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Magnetic>
                  <Button asChild size="xl" variant="on-dark" className="min-h-13">
                    <Link href="/simulateur">
                      Simuler ma prime <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </Magnetic>
                <Button asChild size="xl" variant="outline-light" className="min-h-13">
                  <Link href="/comment-ca-marche">Comprendre le parcours</Link>
                </Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: duration.story, ease: ease.out }}
              className="mx-auto w-[min(440px,85%)]"
            >
              <div className="animate-float">
                <InsuranceCard2D size="md" tilt={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
