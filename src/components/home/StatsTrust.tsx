"use client";

import { Counter } from "@/components/motion/Counter";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Lock, FileCheck2, Smartphone } from "lucide-react";

/**
 * Chiffres et confiance : compteurs animés (placeholders marqués),
 * badges sécurité, zone témoignages prête (TODO visible en dev).
 */
const stats = [
  { value: 4200, suffix: "+", label: "assurés et leurs familles", note: "TODO: chiffre réel" },
  { value: 72, suffix: " h", label: "délai moyen de remboursement", note: "TODO: à confirmer" },
  { value: 97, suffix: " %", label: "de soins réglés sans avance", note: "TODO: à confirmer" },
  { value: 24, suffix: "/7", label: "assistance et urgences", note: "" },
];

const badges = [
  { icon: Lock, title: "Données chiffrées", text: "Vos documents sont chiffrés et hébergés de manière sécurisée." },
  { icon: FileCheck2, title: "Conformité réglementaire", text: "Plateforme opérée par un cabinet de courtage agréé." },
  { icon: Smartphone, title: "Paiements agréés", text: "Orange Money, Moov Africa Money et Wave, transactions tracées." },
];

export function StatsTrust() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-sand-50 sm:py-32" aria-label="Confiance">
      <div aria-hidden className="absolute -left-32 top-0 size-[420px] rounded-full bg-teal-500/10 blur-3xl" />
      <div className="container-ams relative">
        <div className="max-w-xl">
          <Eyebrow tone="light">Chiffres & confiance</Eyebrow>
          <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold">
            La confiance se mesure.
          </SplitHeading>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-6">
                <p className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold leading-none text-teal-300">
                  <Counter value={s.value} />
                  <span className="text-[0.6em]">{s.suffix}</span>
                </p>
                <p className="mt-2.5 text-[13.5px] leading-snug text-sand-50/70">{s.label}</p>
                {s.note && (
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-ochre-100/50">{s.note}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {badges.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div className="flex h-full items-start gap-4 rounded-[16px] border border-white/10 bg-white/[0.04] p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                  <b.icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-[15.5px] font-semibold">{b.title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-sand-50/60">{b.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* zone témoignages : volontairement vide pour l'instant */}
        <Reveal delay={0.1}>
          <div className="mt-6 rounded-[16px] border border-dashed border-white/15 bg-transparent p-8 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sand-50/40">
              Témoignages d&apos;assurés
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13.5px] text-sand-50/45">
              {/* TODO: remplacer par de vrais témoignages validés — jamais de faux avis */}
              Espace réservé aux vrais témoignages. Aucun avis fictif n&apos;est affiché.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
