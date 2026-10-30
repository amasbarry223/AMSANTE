"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Navigation, Phone } from "lucide-react";
import { providers } from "@/data/providers";
import type { Provider } from "@/data/types";
import { Counter } from "@/components/motion/Counter";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/button";
import { duration, ease } from "@/lib/motion/tokens";

const typeColors: Record<string, string> = {
  clinique: "#17A398",
  hopital: "#0F5B57",
  pharmacie: "#E07A3F",
  laboratoire: "#D9A21B",
  imagerie: "#7CCFC8",
  dentaire: "#1F9D55",
  optique: "#B98A2F",
};

/**
 * Réseau de soins : carte SVG stylisée de Bamako avec points pulsants.
 * (Sur l'accueil, on reste en SVG léger — MapLibre est chargé sur /prestataires.)
 */
export function CareNetwork() {
  const [hovered, setHovered] = useState<Provider | null>(null);
  const shown = useMemo(() => providers.slice(0, 14), []);

  return (
    <section className="py-24 sm:py-32" aria-label="Réseau de soins">
      <div className="container-ams grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal><Eyebrow>Réseau de soins</Eyebrow></Reveal>
          <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold">
            Un soignant conventionné, toujours près de vous.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
              Cliniques, hôpitaux, pharmacies, laboratoires : chez nos partenaires conventionnés,
              vous ne faites pas d&apos;avance de frais. Le tiers payant s&apos;applique dès le scan de votre carte.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="rounded-2xl border border-sand-200 bg-white px-6 py-4 shadow-soft">
                <p className="font-display text-[34px] font-bold leading-none text-teal-900">
                  <Counter value={providers.length} />
                </p>
                <p className="mt-1 text-[12.5px] font-medium text-muted-foreground">
                  prestataires conventionnés
                  <span className="ml-1.5 rounded bg-ochre-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ochre-500">
                    démo
                  </span>
                </p>
              </div>
              <Button asChild size="lg" className="min-h-12">
                <Link href="/prestataires">
                  <MapPin className="size-4" /> Trouver un prestataire
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* carte SVG stylisée */}
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[28px] border border-sand-200 bg-[linear-gradient(160deg,#F0FAF8,#F7F4EE)] p-4 shadow-soft">
            <svg viewBox="0 0 100 100" className="w-full" role="img" aria-label="Carte stylisée de Bamako avec les prestataires conventionnés">
              {/* fleuve Niger */}
              <path
                d="M-2 34 C 15 30, 28 42, 42 38 S 66 26, 82 30 S 96 40, 104 38"
                fill="none"
                stroke="#7CCFC8"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d="M-2 37 C 15 33, 28 45, 42 41 S 66 29, 82 33 S 96 43, 104 41"
                fill="none"
                stroke="#17A398"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />
              {/* axes routiers */}
              <g stroke="#EAE3D6" strokeWidth="1.6" strokeLinecap="round">
                <path d="M14 8 L 20 78 L 30 96" fill="none" />
                <path d="M8 60 L 48 52 L 88 62" fill="none" />
                <path d="M34 6 L 40 44 L 58 84" fill="none" />
                <path d="M62 10 L 60 40 L 70 90" fill="none" />
                <path d="M20 20 L 60 14 L 92 20" fill="none" />
              </g>
              {/* zones */}
              <g fill="#0F5B57" opacity="0.05">
                <circle cx="20" cy="44" r="13" />
                <circle cx="38" cy="32" r="11" />
                <circle cx="55" cy="58" r="15" />
                <circle cx="70" cy="64" r="11" />
                <circle cx="12" cy="14" r="8" />
              </g>
              {/* points prestataires */}
              {shown.map((p) => (
                <g
                  key={p.id}
                  transform={`translate(${p.x} ${p.y})`}
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`${p.name}, ${p.commune}`}
                >
                  <circle r="3.4" fill={typeColors[p.type] ?? "#17A398"} opacity="0.25">
                    <animate attributeName="r" values="3.4;7;3.4" dur="2.4s" begin={`${p.x % 1}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" begin={`${p.x % 1}s`} repeatCount="indefinite" />
                  </circle>
                  <circle r="2" fill={typeColors[p.type] ?? "#17A398"} stroke="#fff" strokeWidth="0.7" />
                </g>
              ))}
            </svg>

            {/* tooltip au survol */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key={hovered.id}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: duration.micro + 0.1, ease: ease.out }}
                  className="pointer-events-none absolute left-1/2 bottom-4 w-[min(320px,90%)] -translate-x-1/2 rounded-2xl bg-ink/90 p-3.5 text-sand-50 shadow-lift backdrop-blur"
                >
                  <p className="text-[13.5px] font-bold">{hovered.name}</p>
                  <p className="mt-0.5 text-[12px] text-sand-50/65">
                    {hovered.quartier} · {hovered.commune} {hovered.open24 && "· 24 h/24"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-xs backdrop-blur">
              <Navigation className="size-3 text-teal-600" />
              Bamako · Kati
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
