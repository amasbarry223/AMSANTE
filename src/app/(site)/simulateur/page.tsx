import type { Metadata } from "next";
import { Reveal, Eyebrow } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SimulatorPanel } from "@/components/simulator/SimulatorPanel";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { BogolanTexture } from "@/components/layout/BogolanPattern";

export const metadata: Metadata = {
  title: "Simulateur de prime d'assurance santé",
  description:
    "Estimez votre prime d'assurance santé en 30 secondes : couverture, nombre d'enfants, âge et fréquence de paiement. Résultat en direct, sans engagement.",
};

export default function SimulateurPage() {
  return (
    <>
      {/* Hero court */}
      <section className="relative overflow-hidden bg-ink pb-14 pt-32 text-sand-50 sm:pb-16 sm:pt-40" aria-label="Introduction du simulateur">
        <BogolanTexture color="#E3F4F1" opacity={0.05} />
        <div aria-hidden className="absolute -left-32 top-20 size-[420px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="container-ams relative">
          <Reveal>
            <Eyebrow tone="light">Simulateur</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-3xl font-display text-[clamp(2.3rem,5.5vw,4.2rem)] font-bold leading-[1.02]"
          >
            Votre prime santé, en toute transparence.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-teal-100/80">
              Ajustez votre profil : la prime se recalcule à chaque geste, avec le détail du
              calcul. Ce qui est affiché est ce que vous paierez — rien de plus.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Simulateur */}
      <section className="container-ams -mt-8 pb-8 sm:-mt-10" aria-label="Simulateur de prime">
        <SimulatorPanel />
      </section>

      {/* CTA final : vers l'offre groupe */}
      <section className="container-ams pb-24 pt-10" aria-label="Offre pour les entreprises">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0F5B57_0%,#0B1F1E_75%)] px-8 py-12 text-sand-50 shadow-card sm:px-12">
            <BogolanTexture color="#E3F4F1" opacity={0.06} />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-tight">
                  Vous assurez une équipe ?
                </h2>
                <p className="mt-2 max-w-xl text-[15.5px] leading-relaxed text-teal-100/80">
                  Tarifs dégressifs dès 5 salariés, gestion des ayants droit en quelques clics et
                  un conseiller dédié. Demandez votre devis groupe — réponse sous 24 h ouvrées.
                </p>
              </div>
              <PrimaryCta href="/entreprises/devis" variant="on-dark" className="shrink-0">
                Demander un devis groupe
              </PrimaryCta>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
