import type { Metadata } from "next";
import { Banknote, ShieldCheck, Users } from "lucide-react";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { Counter } from "@/components/motion/Counter";
import { Eyebrow, Reveal, StaggerContainer, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProviderApplication } from "@/components/shared/ProviderApplication";

export const metadata: Metadata = {
  title: "Devenir partenaire — établissements de soins",
  description:
    "Rejoignez le réseau AMSANTÉ : flux de patients assurés, tiers payant sans impayé et paiements rapides. Déposez votre candidature en 4 étapes.",
  alternates: { canonical: "/prestataires/devenir-partenaire" },
};

const ADVANTAGES = [
  {
    icon: Users,
    title: "Un flux de patients assurés",
    text: "Nos adhérents cherchent un soignant conventionné près de chez eux : votre établissement apparaît dans l’annuaire et reçoit de nouveaux patients.",
  },
  {
    icon: ShieldCheck,
    title: "Tiers payant, zéro impayé",
    text: "L’assuré ne fait pas d’avance de frais : nous réglons directement notre part. Fini les dossiers de remboursement et les créances à recouvrer.",
  },
  {
    icon: Banknote,
    title: "Paiement rapide",
    /* TODO: délai de paiement à confirmer par l'équipe partenariats (7 jours ?) */
    text: "Vos factures sont réglées sous 7 jours, par Mobile Money ou virement bancaire, avec un relevé clair pour votre comptabilité.",
  },
] as const;

export default function DevenirPartenairePage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-label="Devenir partenaire AMSANTÉ"
        className="grain relative overflow-hidden bg-ink pb-16 pt-32 text-sand-50 sm:pb-20 sm:pt-40"
      >
        <BogolanTexture color="#E3F4F1" opacity={0.05} />
        <div className="container-ams relative">
          <Reveal>
            <Eyebrow tone="light">Partenaires</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] font-bold"
          >
            Croissez avec le réseau AMSANTÉ.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-sand-50/70">
              Cliniques, hôpitaux, pharmacies, laboratoires, cabinets dentaires et
              d’optique : rejoignez le tiers payant digital et concentrez-vous sur les
              soins, pas sur la paperasse.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Avantages */}
      <section aria-label="Vos avantages" className="py-16 sm:py-24">
        <div className="container-ams">
          <StaggerContainer className="grid gap-5 md:grid-cols-3">
            {ADVANTAGES.map((a) => (
              <StaggerItem key={a.title}>
                <article className="h-full rounded-[24px] border border-sand-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex size-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    <a.icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-bold text-ink">{a.title}</h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
                    {a.text}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Chiffres placeholders */}
          {/* TODO: remplacer par les vraies données du réseau (délais, volumes) */}
          <Reveal delay={0.1}>
            <dl className="mt-12 grid gap-5 rounded-[24px] border border-sand-200 bg-teal-50 p-8 sm:grid-cols-3">
              <div>
                <dd className="font-display text-[34px] font-bold leading-none text-teal-900">
                  <Counter value={18} />
                </dd>
                <dt className="mt-1.5 text-[13px] font-medium text-muted-foreground">
                  établissements déjà conventionnés
                </dt>
              </div>
              <div>
                <dd className="font-display text-[34px] font-bold leading-none text-teal-900">
                  <Counter value={1200} />
                </dd>
                <dt className="mt-1.5 text-[13px] font-medium text-muted-foreground">
                  patients orientés vers le réseau chaque mois
                </dt>
              </div>
              <div>
                <dd className="font-display text-[34px] font-bold leading-none text-teal-900">
                  <Counter value={7} />
                </dd>
                <dt className="mt-1.5 text-[13px] font-medium text-muted-foreground">
                  jours ouvrés pour recevoir votre paiement
                </dt>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Formulaire de candidature */}
      <section aria-label="Formulaire de candidature" className="bg-sand-100/60 py-16 sm:py-24">
        <div className="container-ams">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Candidature</Eyebrow>
              <SplitHeading className="mt-5 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold text-ink">
                Déposez votre dossier en 4 étapes.
              </SplitHeading>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">
                Établissement, responsable, services et agréments : 10 minutes suffisent.
                Notre équipe partenariats étudie chaque dossier avec attention.
              </p>
            </div>
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl">
            <ProviderApplication />
          </div>
        </div>
      </section>
    </>
  );
}
