"use client";

import { Marquee } from "@/components/motion/Marquee";

/**
 * Bandeau partenaires : défilement infini de logos placeholders gris.
 * TODO: remplacer par les vrais logos (compagnies, prestataires) autorisés.
 */
const placeholderPartners = [
  "LOGO COMPAGNIE 1",
  "LOGO COMPAGNIE 2",
  "LOGO CLINIQUE",
  "LOGO PHARMACIE",
  "LOGO LABORATOIRE",
  "LOGO OPERATEUR",
  "LOGO BANQUE",
  "LOGO INSTITUT",
];

export function PartnersBand() {
  return (
    <section aria-label="Partenaires" className="border-y border-sand-200 bg-background py-8">
      <p className="mb-5 text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Ils nous font confiance
      </p>
      <Marquee duration={38}>
        {placeholderPartners.map((p) => (
          <div
            key={p}
            className="flex h-12 w-36 shrink-0 items-center justify-center rounded-lg border border-dashed border-sand-300 bg-sand-100 text-[11px] font-semibold tracking-wider text-muted-foreground/60"
            aria-label={`${p} — logo à remplacer`}
          >
            {p}
            {/* TODO: remplacer par un vrai logo partenaire */}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
