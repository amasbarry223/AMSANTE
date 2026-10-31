import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  BellRing,
  CalendarClock,
  MousePointerClick,
  QrCode,
  Siren,
  Smartphone,
  ScanLine,
  Wallet,
} from "lucide-react";
import { Eyebrow, Reveal, StaggerContainer, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { DrawPath } from "@/components/motion/DrawPath";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { Button } from "@/components/ui/button";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Comment ça marche — AMSANTÉ",
  description:
    "De la souscription en ligne au remboursement en Mobile Money : découvrez le parcours de soin AMSANTÉ, le tiers payant, les délais de carence et les opérateurs partenaires.",
  alternates: { canonical: "/comment-ca-marche" },
};

const steps = [
  {
    icon: MousePointerClick,
    title: "Je souscris en ligne",
    text: "Cinq minutes sur votre téléphone : vous choisissez votre formule, vous ajoutez vos bénéficiaires, vous payez en Mobile Money. Aucun formulaire papier, aucun déplacement.",
  },
  {
    icon: ScanLine,
    title: "Je reçois ma carte digitale",
    text: "Dès la validation du paiement, votre carte d'assuré avec QR code unique apparaît dans votre espace. Chaque membre de la famille reçoit la sienne, prête à l'emploi.",
  },
  {
    icon: QrCode,
    title: "Je scanne chez le prestataire",
    text: "À l'accueil de la clinique, du laboratoire ou de la pharmacie conventionnée, on scanne votre QR code : vos droits s'affichent instantanément. C'est le tiers payant — vous n'advancez rien sur la part couverte.",
  },
  {
    icon: BellRing,
    title: "Je reçois ma notification de remboursement",
    text: "Pour un soin hors tiers payant (facture à déclarer), vous suivez votre dossier en temps réel : reçu, en analyse, validé, payé. Vous êtes alerté à chaque étape, sans avoir à rappeler personne.",
  },
  {
    icon: Wallet,
    title: "Je suis remboursé en Mobile Money",
    text: "Le remboursement arrive directement sur votre compte Orange Money, Moov Africa Money ou Wave — en général sous 72 heures après validation du dossier. Pas de chèque, pas de file d'attente.",
  },
];

const operators = [
  {
    name: "Orange Money",
    className: "bg-ochre-500 text-sand-50",
  },
  {
    name: "Moov Africa Money",
    className: "bg-teal-700 text-sand-50",
  },
  {
    name: "Wave",
    className: "bg-sand-300 text-ink",
  },
];

export default function CommentCaMarchePage() {
  return (
    <>
      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="bg-sand-50" aria-label="Parcours de soin">
        <div className="container-ams pt-32 pb-16 sm:pt-40 sm:pb-20">
          <Reveal>
            <Eyebrow>Parcours de soin</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold leading-[1.05]"
          >
            Du scan du QR au remboursement, le parcours est limpide.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              Cinq étapes, zéro papier. Voici exactement ce qui se passe entre le moment où vous
              souscrivez et celui où votre remboursement atterrit sur votre Mobile Money.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Timeline 5 étapes ───────────────────── */}
      <section className="bg-sand-50 pb-24 sm:pb-32" aria-label="Les cinq étapes du parcours">
        <div className="container-ams">
          <div className="relative mx-auto max-w-2xl">
            {/* Ligne qui se trace au scroll (GSAP DrawPath, scrub) */}
            <DrawPath
              scrub
              className="absolute top-2 bottom-2 left-[27px] w-[3px] sm:left-[35px]"
            >
              <svg
                viewBox="0 0 3 100"
                preserveAspectRatio="none"
                className="h-full w-[3px]"
                aria-hidden
              >
                <path
                  d="M1.5 0 V100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  className="text-teal-500/50"
                />
              </svg>
            </DrawPath>

            <ol className="relative space-y-12">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="flex items-start gap-5 sm:gap-7">
                    <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-sand-200 bg-white text-teal-900 shadow-soft sm:size-[72px] sm:rounded-[16px]">
                      <Icon className="size-6 sm:size-7" aria-hidden />
                      <span className="tnum absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-teal-900 text-[11px] font-bold text-sand-50">
                        {i + 1}
                      </span>
                    </span>
                    <Reveal className="pt-1">
                      <h2 className="font-display text-[19px] font-bold text-ink sm:text-[22px]">
                        {s.title}
                      </h2>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                        {s.text}
                      </p>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────────────── Délai de carence ───────────────────── */}
      <section className="bg-sand-100/60 py-24 sm:py-32" aria-label="Délai de carence">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>À savoir avant de partir</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
              Le délai de carence, expliqué simplement.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Le délai de carence est le temps qui sépare votre souscription du premier soin
                remboursé. Il court à partir de la date de validation du paiement.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-[16px] border border-sand-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <CalendarClock className="size-5" aria-hidden />
                </span>
                <p className="mt-5 font-display text-[34px] font-bold text-ink tnum">10 jours</p>
                <h3 className="mt-1 font-display text-[16px] font-bold text-teal-900">
                  Soins courants
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Consultations, pharmacie, analyses, imagerie et hospitalisation : couverts dès le
                  11ᵉ jour après votre souscription.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-[16px] border border-sand-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <Baby className="size-5" aria-hidden />
                </span>
                <p className="mt-5 font-display text-[34px] font-bold text-ink tnum">30 jours</p>
                <h3 className="mt-1 font-display text-[16px] font-bold text-teal-900">Maternité</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Suivi de grossesse, accouchement et soins du nouveau-né : couverts après 30 jours
                  de contrat. Anticipez pour être sereine jusqu&apos;au bout.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="relative h-full overflow-hidden rounded-[16px] bg-teal-900 p-7 text-sand-50 shadow-card">
                <BogolanTexture color="#E3F4F1" opacity={0.05} />
                <span className="relative flex size-11 items-center justify-center rounded-xl bg-white/10 text-teal-100">
                  <Siren className="size-5" aria-hidden />
                </span>
                <p className="relative mt-5 font-display text-[20px] font-bold">Urgences vitales</p>
                <p className="relative mt-2 text-[14px] leading-relaxed text-teal-100/85">
                  En cas d&apos;urgence vitale, la prise en charge est immédiate — dès le premier
                  jour, même pendant le délai de carence. Présentez simplement votre carte ou votre
                  code assuré dans la structure.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────── Tiers payant (section sombre) ─────────────── */}
      <section className="bg-ink py-24 text-sand-50 sm:py-32" aria-label="Le tiers payant">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow tone="light">Tiers payant</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold">
              Ne plus rien avancer à la caisse.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-teal-100/80">
                Le mot qui change tout dans une assurance santé. Voici, en trois volets, ce que le
                tiers payant change concrètement pour vous.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="mt-12 grid gap-5 md:grid-cols-3">
            <StaggerItem>
              <div className="h-full rounded-[16px] border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-sm">
                <h3 className="font-display text-[18px] font-bold text-sand-50">
                  Qu&apos;est-ce que le tiers payant ?
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-teal-100/80">
                  C&apos;est le fait de ne rien avancer aux caisses. Sur la part couverte par votre
                  formule, AMSANTÉ règle directement le prestataire : vous ne sortez pas votre
                  portefeuille, ni votre carte bancaire, ni vos économies.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-[16px] border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-sm">
                <h3 className="font-display text-[18px] font-bold text-sand-50">
                  Ce que vous ne payez pas
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-teal-100/80">
                  Rien sur la part remboursable : consultation, médicaments prescrits, analyses,
                  actes couverts par votre formule. Chez les prestataires conventionnés, la facture
                  de cette part part directement de notre côté.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-[16px] border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-sm">
                <h3 className="font-display text-[18px] font-bold text-sand-50">
                  Le reste à charge
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-teal-100/80">
                  Certains soins ne sont couverts qu&apos;en partie (par exemple 80 %) : le solde
                  reste à votre charge et se paie sur place, au tarif conventionné. Il est toujours
                  affiché avant le soin — jamais de surprise après.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ─────────────── Remboursements Mobile Money ─────────────── */}
      <section className="py-24 sm:py-32" aria-label="Remboursements Mobile Money">
        <div className="container-ams">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Reveal>
                <Eyebrow>Remboursements</Eyebrow>
              </Reveal>
              <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
                Payé directement sur votre Mobile Money.
              </SplitHeading>
              <Reveal delay={0.1}>
                <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                  Un soin déclaré hors tiers payant, un dossier validé, et le virement part. En
                  général sous 72 heures, avec une notification à chaque étape. Vous suivez tout
                  depuis votre espace, comme un colis.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                {/* TODO: brancher la route /sinistres/nouveau quand l'espace assuré sera livré */}
                <Button asChild variant="outline" size="lg" className="mt-7">
                  <Link href="/connexion?redirect=/sinistres/nouveau">
                    Déclarer un remboursement <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </Reveal>
            </div>

            <StaggerContainer className="grid gap-4 sm:grid-cols-3">
              {operators.map((op) => (
                <StaggerItem key={op.name}>
                  <div
                    className={cn(
                      "flex h-36 flex-col items-center justify-center rounded-[16px] shadow-soft transition-transform hover:-translate-y-1",
                      op.className
                    )}
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                      <Smartphone className="size-4.5" aria-hidden />
                    </span>
                    <span className="mt-3 font-display text-[16px] font-bold tracking-tight">
                      {op.name}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CTA final ─────────────────────────── */}
      <section className="container-ams pb-28" aria-label="Passer à l'action">
        <Reveal>
          <div className="bg-panel-ink relative overflow-hidden rounded-[28px] px-8 py-16 text-sand-50 shadow-card sm:px-14 sm:py-20">
            <BogolanTexture color="#E3F4F1" opacity={0.06} />
            <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <SplitHeading
                trigger={false}
                className="font-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.05]"
              >
                Le plus dur, c&apos;est de choisir sa formule.
              </SplitHeading>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-teal-100/80">
                Après, tout roule : carte digitale, scan, tiers payant, remboursement Mobile Money.
                Commencez par simuler votre prime en 30 secondes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <PrimaryCta href="/souscrire" variant="on-dark" size="xl">
                  Souscrire maintenant <ArrowRight className="size-4" aria-hidden />
                </PrimaryCta>
                <Button asChild size="xl" variant="outline-light">
                  <Link href="/assurance-sante">Voir les formules</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
