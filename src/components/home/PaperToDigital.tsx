"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Bell, QrCode, Smartphone, Calculator, BadgeCheck } from "lucide-react";
import { gsap, initGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";

/**
 * « Du papier au digital » — storytelling épinglé en 4 étapes.
 * À gauche les étapes, à droite une maquette d'interface qui se transforme.
 */
const steps = [
  {
    id: 1,
    icon: Calculator,
    title: "Je simule et je souscris en 5 minutes",
    text: "Choisissez vos garanties, ajoutez vos proches, payez en Mobile Money. Tout se fait en ligne, sans formulaire papier ni déplacement.",
  },
  {
    id: 2,
    icon: Smartphone,
    title: "Je reçois ma carte digitale",
    text: "Votre carte d'assuré arrive instantanément dans votre espace, avec son QR code personnel. Fini les attestations perdues.",
  },
  {
    id: 3,
    icon: QrCode,
    title: "Je me soigne sans avancer les frais",
    text: "À l'accueil de la clinique, on scanne votre QR : « Droits ouverts ». La part de votre formule est réglée directement, c'est le tiers payant.",
  },
  {
    id: 4,
    icon: Bell,
    title: "Je suis remboursé en Mobile Money",
    text: "Pour les soins hors tiers payant, le remboursement tombe sur votre Orange Money, Moov Money ou Wave — sous 72 h en moyenne.",
  },
];

/** Maquettes d'interface (mocks purement décoratifs). */
function Panel({ index }: { index: number }) {
  if (index === 0) {
    return (
      <MockShell title="Simulateur — 30 secondes">
        <div className="space-y-3">
          <div className="flex gap-2">
            {["Seul·e", "Couple", "Famille"].map((c, i) => (
              <span key={c} className={cn("flex-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-semibold", i === 2 ? "bg-teal-900 text-sand-50" : "bg-sand-100 text-muted-foreground")}>
                {c}
              </span>
            ))}
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">2 adultes · 2 enfants</span>
              <span className="tnum font-bold text-teal-900">27 400 FCFA/mois</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-200">
              <div className="h-full w-[68%] rounded-full bg-teal-500" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-teal-100 p-3 text-[12px] font-semibold text-teal-900">
            <span>Formule Confort recommandée</span>
            <BadgeCheck className="size-4" />
          </div>
        </div>
      </MockShell>
    );
  }
  if (index === 1) {
    return (
      <div className="relative mx-auto w-[230px] rounded-[28px] border-[6px] border-ink bg-ink p-1 shadow-card">
        <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(150deg,#12766F,#0B1F1E)] p-3">
          <div className="mx-auto mb-2 h-4 w-16 rounded-full bg-black/60" />
          <div className="rounded-2xl bg-white/95 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-900">Ma carte</p>
            <div className="mt-2 rounded-lg bg-[linear-gradient(128deg,#12766F,#0B1F1E)] p-2.5 text-white">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold">AMSANTÉ</span>
                <span className="tnum text-[8px] opacity-80">AMSA-2025-8K4T</span>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase">F. Traoré</p>
              <div className="mt-1 flex justify-between items-center">
                <span className="rounded bg-teal-500/30 px-1.5 py-0.5 text-[7px] font-bold uppercase">Confort</span>
                <div className="grid size-6 grid-cols-3 gap-px bg-sand-50 p-0.5 rounded-sm">
                  {Array.from({ length: 9 }).map((_, i) => <span key={i} className={i % 2 ? "bg-ink" : "bg-sand-50"} />)}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-success">
              <Check className="size-3" /> Carte active · valide 12 mois
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <MockShell title="Clinique Pasteur — Accueil">
        <div className="flex flex-col items-center py-2">
          <div className="relative flex size-24 items-center justify-center">
            <span className="absolute inset-0 rounded-2xl border-2 border-teal-500/40" />
            <span className="absolute inset-0 animate-pulse-dot rounded-2xl border-2 border-teal-500/60" aria-hidden />
            <QrCode className="size-12 text-teal-900" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: duration.base, ease: ease.out }}
            className="mt-4 flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-[12px] font-bold text-success"
          >
            <Check className="size-4" /> Droits ouverts ✓
          </motion.div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Consultation couverte à 90 % · Rien à avancer
          </p>
        </div>
      </MockShell>
    );
  }
  return (
    <MockShell title="Notifications">
      <div className="space-y-2.5">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: duration.base, ease: ease.out }}
          className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-sand-200"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-ochre-100 text-ochre-500">
            <Bell className="size-4" />
          </span>
          <div>
            <p className="text-[12px] font-bold text-ink">Orange Money</p>
            <p className="tnum text-[13px] font-bold text-success">+ 25 000 FCFA reçus</p>
          </div>
        </motion.div>
        <p className="pl-1 text-[11px] text-muted-foreground">
          Remboursement dossier #SIN-2025-0412 · analyses laboratoire
        </p>
        <div className="rounded-xl bg-teal-100 p-3 text-[12px] font-semibold text-teal-900">
          Traitement moyen : 72 h ✓
        </div>
      </div>
    </MockShell>
  );
}

function MockShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[330px] rounded-[16px] glass-panel p-4 shadow-lift">
      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-teal-900/70">
        <span className="size-1.5 rounded-full bg-teal-500" /> {title}
      </p>
      {children}
    </div>
  );
}

export function PaperToDigital() {
  const wrapRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      initGsap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setActive(Math.min(3, Math.floor(self.progress * 4.35)));
          const line = lineRef.current?.querySelector(".progress-line");
          if (line) line.setAttribute("y2", String(220 * self.progress));
        },
      });
    },
    { scope: wrapRef }
  );

  return (
    <section ref={wrapRef} className="relative h-[380vh] bg-ink text-sand-50" aria-label="Comment AMSANTÉ fonctionne">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-ams grid items-center gap-10 py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Eyebrow tone="light">Du papier au digital</Eyebrow>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-bold">
              Le parcours de soin, simplifié.
            </SplitHeading>

            {/* barre de progression verticale SVG */}
            <div className="relative mt-10 hidden lg:block">
              <svg ref={lineRef} viewBox="0 0 4 220" className="absolute -left-6 top-2 h-[200px] w-1" aria-hidden>
                <line x1="2" y1="0" x2="2" y2="220" stroke="rgba(247,244,238,0.15)" strokeWidth="2" />
                <line className="progress-line" x1="2" y1="0" x2="2" y2="220" stroke="#17A398" strokeWidth="2" />
              </svg>
              <ol className="space-y-6">
                {steps.map((s, i) => (
                  <li key={s.id} className="flex gap-4">
                    <span
                      className={cn(
                        "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                        i <= active
                          ? "border-teal-500 bg-teal-500/20 text-teal-300"
                          : "border-white/12 text-sand-50/40"
                      )}
                    >
                      <s.icon className="size-[18px]" />
                    </span>
                    <div className={cn("transition-opacity duration-300", i === active ? "opacity-100" : "opacity-45")}>
                      <p className="font-display text-[17px] font-semibold">{s.title}</p>
                      <p className="mt-1 max-w-[440px] text-[14px] leading-relaxed text-sand-50/60">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* panneau transformant */}
          <div className="relative hidden h-[420px] items-center justify-center lg:flex" aria-hidden>
            <div className="absolute inset-x-8 top-1/2 -z-0 h-56 -translate-y-1/2 rounded-full bg-teal-500/15 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -26, scale: 0.98 }}
                transition={{ duration: duration.base, ease: ease.out }}
                className="flex w-full justify-center"
              >
                <Panel index={active} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* version mobile : liste simple */}
          <div className="lg:hidden">
            <ol className="space-y-5">
              {steps.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.05}>
                  <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="flex items-center gap-2.5 font-display text-[16px] font-semibold">
                      <s.icon className="size-4 text-teal-300" /> {s.title}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-sand-50/60">{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
