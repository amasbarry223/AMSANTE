import type { Metadata } from "next";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { ProviderDirectory } from "@/components/shared/ProviderDirectory";

export const metadata: Metadata = {
  title: "Prestataires conventionnés à Bamako",
  description:
    "Trouvez une clinique, un hôpital, une pharmacie ou un laboratoire conventionné AMSANTÉ à Bamako et Kati. Tiers payant, sans avance de frais, carte digitale acceptée.",
  alternates: { canonical: "/prestataires" },
};

export default function PrestatairesPage() {
  return (
    <>
      {/* Hero de page */}
      <section
        aria-label="Annuaire des prestataires"
        className="grain relative overflow-hidden bg-ink pb-16 pt-32 text-sand-50 sm:pb-20 sm:pt-40"
      >
        <BogolanTexture color="#E3F4F1" opacity={0.05} />
        <div className="container-ams relative">
          <Reveal>
            <Eyebrow tone="light">Annuaire</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] font-bold"
          >
            Un soignant conventionné, toujours près de vous.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-sand-50/70">
              Cliniques, hôpitaux, pharmacies, laboratoires : filtrez par commune ou type,
              repérez l’établissement sur la carte et présentez simplement votre carte
              digitale — le tiers payant s’applique, sans avance de frais.
            </p>
          </Reveal>
        </div>
      </section>

      <ProviderDirectory />

      {/* CTA bas de page */}
      <section aria-label="Devenir partenaire" className="pb-20 sm:pb-28">
        <div className="container-ams">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-sand-200 bg-teal-50 p-8 shadow-soft sm:flex-row sm:items-center sm:p-10">
              <div>
                <h2 className="font-display text-2xl font-bold text-teal-900 sm:text-3xl">
                  Vous êtes un établissement de soins ?
                </h2>
                <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                  Rejoignez le réseau AMSANTÉ : des patients orientés vers vous, un tiers
                  payant sans impayé et des paiements rapides.
                </p>
              </div>
              <PrimaryCta href="/prestataires/devenir-partenaire" className="shrink-0">
                Devenir partenaire
              </PrimaryCta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
