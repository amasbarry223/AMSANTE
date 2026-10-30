"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { gsap, initGsap, ScrollTrigger } from "@/lib/motion/gsap";
import { Eyebrow } from "@/components/motion/Reveal";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { cn } from "@/lib/utils";

/**
 * « Pour qui ? » — 3 panneaux horizontaux, scroll épinglé (desktop).
 */
const panels = [
  {
    id: "particuliers",
    kicker: "Particuliers & familles",
    title: "Une mutuelle qui vit dans votre poche",
    benefits: ["Souscription 100 % en ligne", "Carte digitale avec QR code", "Remboursements Mobile Money"],
    href: "/assurance-sante",
    cta: "Découvrir les formules",
    accent: "from-teal-700 to-teal-900",
    illustration: "card",
  },
  {
    id: "entreprises",
    kicker: "Entreprises",
    title: "Vos salariés couverts, votre RH sereine",
    benefits: ["Devis groupe sous 24 h ouvrées", "Gestion des ayants droit simplifiée", "Reporting clair pour la direction"],
    href: "/entreprises/devis",
    cta: "Demander un devis groupe",
    accent: "from-ochre-500 to-ochre-500/70",
    illustration: "team",
  },
  {
    id: "prestataires",
    kicker: "Prestataires de soins",
    title: "Des patients pris en charge, zéro impayé",
    benefits: ["Tiers payant instantané", "Vérification des droits par QR", "Versements rapides et tracés"],
    href: "/prestataires/devenir-partenaire",
    cta: "Devenir partenaire",
    accent: "from-ink-soft to-ink",
    illustration: "network",
  },
];

export function ForWho() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      initGsap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const wrap = wrapRef.current;
        if (!track || !wrap) return;
        const distance = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  return (
    <section ref={wrapRef} className="relative overflow-hidden bg-sand-50" aria-label="À qui s'adresse AMSANTÉ">
      <div className="lg:h-screen lg:overflow-hidden">
        <div className="container-ams flex h-full flex-col justify-center py-20">
          <div className="mb-10 max-w-xl">
            <Eyebrow>Pour qui ?</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold">
              Pensé pour chacun de ses acteurs.
            </h2>
          </div>
          <div
            ref={trackRef}
            className="flex flex-col gap-5 lg:flex-row lg:gap-7"
            style={{ width: "max-content" }}
          >
            {panels.map((p) => (
              <article
                key={p.id}
                className={cn(
                  "relative w-full overflow-hidden rounded-[28px] p-8 text-sand-50 shadow-card sm:p-10",
                  "bg-gradient-to-br lg:w-[560px]",
                  p.accent
                )}
              >
                <BogolanTexture color="#E3F4F1" opacity={0.06} />
                <p className="relative text-[12px] font-bold uppercase tracking-[0.22em] text-white/70">
                  {p.kicker}
                </p>
                <h3 className="relative mt-4 max-w-[380px] font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-tight">
                  {p.title}
                </h3>
                <ul className="relative mt-6 space-y-2.5 text-[14.5px] text-white/85">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/70" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
                {/* illustration décorative */}
                <div className="pointer-events-none relative mt-8 h-32" aria-hidden>
                  {p.illustration === "card" && (
                    <div className="absolute right-2 top-0 w-64 rotate-6 rounded-2xl bg-white/10 p-3 ring-1 ring-white/25 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-[10px] font-bold tracking-widest">
                        <span>AMSANTÉ</span><span className="tnum opacity-70">AMSA-2025</span>
                      </div>
                      <div className="mt-8 flex items-end justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">F. Traoré</span>
                        <span className="grid size-8 grid-cols-3 gap-px rounded bg-white/80 p-1">
                          {Array.from({ length: 9 }).map((_, i) => <span key={i} className={i % 2 ? "bg-teal-900" : "bg-white"} />)}
                        </span>
                      </div>
                    </div>
                  )}
                  {p.illustration === "team" && (
                    <div className="absolute right-2 top-0 flex items-end gap-2">
                      {[40, 56, 72, 88].map((h, i) => (
                        <div key={i} className="w-9 rounded-t-lg bg-white/15 ring-1 ring-white/25" style={{ height: h }} />
                      ))}
                    </div>
                  )}
                  {p.illustration === "network" && (
                    <svg viewBox="0 0 220 110" className="absolute right-2 top-0 h-full w-56 text-white/60">
                      <path d="M20 90 60 40 110 70 160 25 200 55" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                      {[[20, 90], [60, 40], [110, 70], [160, 25], [200, 55]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="5" fill="#17A398" stroke="white" strokeWidth="1.5" />
                      ))}
                    </svg>
                  )}
                </div>
                <Link
                  href={p.href}
                  className="relative mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[14px] font-bold text-ink transition-transform hover:scale-[1.03] active:scale-100"
                >
                  {p.cta} <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
      {/* spacer pour la longueur d'épinglage mobile (masqué desktop, GSAP pin gère desktop) */}
      <ScrollGuard />
    </section>
  );
}

function ScrollGuard() {
  // Sur mobile (pas de pin), la section reste naturelle : rien à faire.
  return null;
}
