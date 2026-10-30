"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Building2, Smartphone, MapPin } from "lucide-react";
import { gsap, initGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/button";
import { InsuranceCard2D } from "@/components/cards/InsuranceCard2D";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { canRender3D } from "@/lib/utils/device";
import { heroState } from "@/components/three/heroState";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

const reassurance = [
  { icon: Smartphone, label: "Remboursé en Mobile Money" },
  { icon: Check, label: "Carte digitale immédiate" },
  { icon: MapPin, label: "Réseau de soins à Bamako" },
];

export function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setUse3D(canRender3D()));
    return () => {
      cancelAnimationFrame(raf);
      // libérer l'état en quittant la page
      heroState.progress = 0;
    };
  }, []);

  useGSAP(
    () => {
      initGsap();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // scrub de la section épinglée → chorégraphie 3D
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          heroState.progress = self.progress;
        },
      });

      // le texte s'efface pendant la rotation de la carte
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "45% top",
          scrub: true,
        },
      });
    },
    { scope: wrapRef }
  );

  return (
    <section ref={wrapRef} className="relative h-[280vh] bg-ink text-sand-50" aria-label="Présentation AMSANTÉ">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* fond */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_20%,#124E4A_0%,#0B1F1E_62%)]" />
        <BogolanTexture color="#E3F4F1" opacity={0.05} />

        {/* scène 3D ou fallback carte 2D */}
        <div className="absolute inset-0" aria-hidden={!use3D}>
          {use3D ? (
            <HeroScene />
          ) : (
            <div className="absolute inset-0 flex items-center justify-end pr-[6vw] lg:pr-[10vw]">
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: duration.story, ease: ease.out, delay: 0.3 }}
                className="w-[min(520px,88vw)]"
              >
                <div className="animate-float">
                  <InsuranceCard2D size="lg" />
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* contenu */}
        <div ref={contentRef} className="container-ams relative z-10 w-full">
          <div className="max-w-[640px]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.fast, ease: ease.out, delay: 0.15 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-medium text-teal-100"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
              </span>
              Assurance santé 100 % digitale, pensée pour le Mali
            </motion.div>

            <SplitHeading
              as="h1"
              trigger={false}
              delay={0.25}
              className="font-display text-[clamp(2.6rem,6.4vw,5.2rem)] font-bold leading-[1.02]"
            >
              Votre santé, couverte. Sans papier, sans attente.
            </SplitHeading>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, ease: ease.out, delay: 0.55 }}
              className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-sand-50/75 sm:text-lg"
            >
              Souscrivez en 5 minutes, présentez votre carte digitale chez le médecin,
              soyez remboursé directement sur votre Mobile Money.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, ease: ease.out, delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Magnetic>
                <Button asChild size="xl" variant="on-dark" className="min-h-12">
                  <Link href="/simulateur">Simuler ma prime</Link>
                </Button>
              </Magnetic>
              <Magnetic strength={8}>
                <Button asChild size="xl" variant="outline-light" className="min-h-12">
                  <Link href="/entreprises">
                    <Building2 className="size-4" /> Je suis une entreprise
                  </Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.slow, delay: 0.95 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-sand-50/60"
            >
              {reassurance.map((r) => (
                <li key={r.label} className="flex items-center gap-2">
                  <r.icon className="size-4 text-teal-500" aria-hidden />
                  {r.label}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* indication de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: duration.slow }}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-1.5 text-sand-50/45">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em]">Faites défiler</span>
            <ChevronDown className="size-4 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
