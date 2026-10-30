import type { Metadata } from "next";
import { BarChart3, CalendarClock, FileSignature, ListChecks, TrendingDown, UserPlus, UsersRound } from "lucide-react";
import { faq } from "@/data/faq";
import { Reveal, StaggerContainer, StaggerItem, Eyebrow } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { DrawPath } from "@/components/motion/DrawPath";
import { Counter } from "@/components/motion/Counter";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Assurance santé groupe pour entreprises",
  description:
    "Couvrez vos salariés et leurs ayants droit avec AMSANTÉ Entreprises : tarifs dégressifs, gestion des ayants droit en ligne, reporting clair. Devis sous 24 h ouvrées.",
};

const BENEFITS = [
  {
    icon: UsersRound,
    title: "Gestion simplifiée des ayants droit",
    text: "Chaque salarié déclare son conjoint et ses enfants depuis son espace. Les entrées et sorties se font en quelques clics, sans aller-retour de papiers avec nos équipes.",
  },
  {
    icon: BarChart3,
    title: "Reporting clair",
    text: "Un tableau de bord mensuel vous montre la consommation de votre dispositif, garanties par garanties. Vous savez où va chaque franc — et ce que vous pouvez ajuster.",
  },
  {
    icon: TrendingDown,
    title: "Tarifs dégressifs",
    text: "Plus l'effectif couvert est grand, plus la prime par personne baisse. Votre convention est ajustée à votre réalité, du premier salarié au millième.",
  },
];

const SETUP_STEPS = [
  {
    icon: CalendarClock,
    title: "Devis",
    text: "Vous décrivez votre effectif et vos besoins en 2 minutes. Un conseiller vous rappelle sous 24 h ouvrées avec une proposition chiffrée.",
  },
  {
    icon: FileSignature,
    title: "Conventions",
    text: "Nous signons ensemble la convention d'entreprise : tarifs négociés, date d'effet et modalités de paiement (mensuel ou trimestriel).",
  },
  {
    icon: UserPlus,
    title: "Téléchargement des salariés",
    text: "Vous importez la liste des salariés et de leurs ayants droit depuis un fichier simple. Les cartes d'assurés digitales sont générées automatiquement.",
  },
  {
    icon: ListChecks,
    title: "Activation des cartes",
    text: "Chaque salarié reçoit sa carte avec QR code. Le tiers payant est actif immédiatement chez nos prestataires conventionnés de Bamako et Kati.",
  },
];

export default function EntreprisesPage() {
  const b2bFaq = faq.filter((f) => f.category === "Entreprises");

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink pb-20 pt-32 text-sand-50 sm:pb-24 sm:pt-40" aria-label="Offre entreprises">
        <BogolanTexture color="#E3F4F1" opacity={0.05} />
        <div aria-hidden className="absolute -right-32 top-16 size-[480px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="container-ams relative">
          <Reveal>
            <Eyebrow tone="light">AMSANTÉ Entreprises</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-4xl font-display text-[clamp(2.3rem,5.5vw,4.4rem)] font-bold leading-[1.02]"
          >
            Couvrir vos salariés, sans y passer vos journées.
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-teal-100/80">
              Une assurance santé groupe 100 % digitale : souscription en ligne, cartes
              d&apos;assurés avec QR code, tiers payant chez nos prestataires conventionnés et
              remboursements en Mobile Money. Vous nous confiez la santé de vos équipes — on
              s&apos;occupe du reste.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <PrimaryCta href="/entreprises/devis" variant="on-dark">
                Demander un devis groupe
              </PrimaryCta>
              <p className="text-[13.5px] text-teal-100/70">
                Réponse sous 24 h ouvrées · Sans engagement
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Bénéfices ─────────────────────────────────────────────── */}
      <section className="container-ams py-20 sm:py-24" aria-label="Vos bénéfices">
        <Reveal>
          <Eyebrow>Ce que vous y gagnez</Eyebrow>
        </Reveal>
        <SplitHeading className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold">
          Une mutuelle d&apos;entreprise qui se gère comme un tableau de bord.
        </SplitHeading>
        <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-3" gap={0.1}>
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <StaggerItem key={b.title} className="h-full">
                <article className="flex h-full flex-col rounded-[22px] border border-sand-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex size-11 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-[18px] font-bold">{b.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{b.text}</p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* ── Mise en place ─────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24" aria-label="Comment se passe la mise en place">
        <div className="container-ams">
          <Reveal>
            <Eyebrow>Mise en place</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold">
            Quatre étapes, deux semaines, zéro papier.
          </SplitHeading>

          <div className="relative mt-12 max-w-2xl">
            <DrawPath className="absolute bottom-8 left-[27px] top-8 w-[3px]">
              <svg className="h-full w-full" viewBox="0 0 3 100" preserveAspectRatio="none" aria-hidden>
                <path
                  d="M1.5 0 L1.5 100"
                  fill="none"
                  stroke="#17A398"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
              </svg>
            </DrawPath>
            <ol className="space-y-10">
              {SETUP_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal as="li" key={s.title} delay={i * 0.08} className="relative flex gap-5">
                    <span className="z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-teal-500 bg-white font-display text-lg font-bold text-teal-900 shadow-soft">
                      <span className="tnum">{i + 1}</span>
                      <Icon className="ml-1 size-4 text-teal-500" aria-hidden />
                    </span>
                    <div className="pt-1.5">
                      <h3 className="font-display text-[18px] font-bold">{s.title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">{s.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Chiffres groupe ───────────────────────────────────────── */}
      <section className="bg-ink py-20 text-sand-50 sm:py-24" aria-label="AMSANTÉ en chiffres">
        <div className="container-ams">
          <Reveal>
            <Eyebrow tone="light">Le dispositif groupe</Eyebrow>
          </Reveal>
          {/* TODO: remplacer par les chiffres réels du portefeuille entreprises AMSANTÉ (placeholders). */}
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <Reveal>
              <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold text-teal-300">
                <Counter value={120} format="number" />
              </p>
              <p className="mt-1 text-[14.5px] text-teal-100/75">entreprises accompagnées</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold text-teal-300">
                <Counter value={8500} format="number" />
              </p>
              <p className="mt-1 text-[14.5px] text-teal-100/75">salariés et ayants droit couverts</p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold text-teal-300">
                <Counter value={5} format="number" />
              </p>
              <p className="mt-1 text-[14.5px] text-teal-100/75">jours pour activer un dispositif complet</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ entreprise ────────────────────────────────────────── */}
      <section className="container-ams py-20 sm:py-24" aria-label="Questions fréquentes entreprises">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Eyebrow>Questions fréquentes</Eyebrow>
          </Reveal>
          <SplitHeading className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold">
            Vous vous demandez sûrement…
          </SplitHeading>
          <Reveal delay={0.1} className="mt-8">
            <Accordion type="single" collapsible className="rounded-[20px] border border-sand-200 bg-white px-5 shadow-soft">
              {b2bFaq.map((f, i) => (
                <AccordionItem key={f.id} value={f.id} className={i === b2bFaq.length - 1 ? "border-b-0" : undefined}>
                  <AccordionTrigger className="py-5 text-left text-[15.5px] font-semibold hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[14.5px] leading-relaxed text-muted-foreground">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────── */}
      <section className="container-ams pb-24" aria-label="Demander un devis">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0F5B57_0%,#0B1F1E_75%)] px-8 py-14 text-center text-sand-50 shadow-card sm:px-14">
            <BogolanTexture color="#E3F4F1" opacity={0.06} />
            <div aria-hidden className="absolute -left-24 -top-24 size-80 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight">
                Prêt à chouchouter vos équipes ?
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-teal-100/80">
                Décrivez votre effectif en 2 minutes : un conseiller vous rappelle sous 24 h
                ouvrées avec une estimation sur mesure.
              </p>
              <div className="mt-8 flex justify-center">
                <PrimaryCta href="/entreprises/devis" variant="on-dark">
                  Demander un devis groupe
                </PrimaryCta>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
