import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, XCircle, Wallet } from "lucide-react";
import { products, frequencyDiscount, frequencyLabel } from "@/data/products";
import { quote } from "@/lib/pricing";
import { guarantees } from "@/data/guarantees";
import { faq } from "@/data/faq";
import { formatFcfa } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { Eyebrow, Reveal, StaggerContainer, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { PrimaryCta } from "@/components/shared/PrimaryCta";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChooseFormulaButton } from "@/components/shared/ChooseFormulaButton";
import { BogolanTexture } from "@/components/layout/BogolanPattern";

export const metadata: Metadata = {
  title: "Formules & garanties — AMSANTÉ",
  description:
    "Essentiel, Confort, Premium : comparez les trois formules d'assurance santé AMSANTÉ, garanties, plafonds, fréquences de paiement et exclusions, en toute transparence.",
  alternates: { canonical: "/assurance-sante" },
};

const souscriptionFaq = ["f1", "f2", "f3"]
  .map((id) => faq.find((f) => f.id === id))
  .filter((f): f is NonNullable<(typeof faq)[number]> => Boolean(f));

/** Ce qui n'est jamais couvert — exclusions générales rédigées honnêtement. */
const exclusions = [
  {
    title: "Expérimentations et dopage",
    text: "Les soins consécutifs à des expérimentations médicales non autorisées, à la prise de produits dopants ou à des pratiques à haut risque volontairement recherchées.",
  },
  {
    title: "Soins esthétiques",
    text: "La chirurgie et la médecine esthétique, les produits de confort (cosmétiques, compléments sans prescription) et tout acte sans finalité médicale démontrée.",
  },
  {
    title: "Soins hors réseau sans accord",
    text: "Les soins réalisés dans des structures non conventionnées, sauf urgence vitale ou évacuation organisée par nos équipes — dans ce cas, présentez simplement votre facture.",
  },
  {
    title: "Fraudes et fausses déclarations",
    text: "Les demandes fondées sur des documents falsifiés ou des informations cachées à la souscription : le contrat peut alors être résilié et les sommes réclamées.",
  },
];

export default function AssuranceSantePage() {
  return (
    <>
      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="bg-sand-50" aria-label="Formules et garanties">
        <div className="container-ams pt-32 pb-16 sm:pt-40 sm:pb-20">
          <Reveal>
            <Eyebrow>Formules</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-bold leading-[1.05]"
          >
            Trois formules, une même promesse.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              Des soins du quotidien à la sérénité maximale : choisissez la couverture qui
              correspond à votre famille. Mêmes prestataires conventionnés, même carte digitale,
              même remboursement en Mobile Money — seule l&apos;étendue des garanties change.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────── Comparateur de formules ──────────────────── */}
      <section className="bg-sand-50 pb-24 sm:pb-32" aria-label="Comparer les formules">
        <div className="container-ams">
          <StaggerContainer className="grid gap-5 lg:grid-cols-3">
            {products.map((p) => {
              const featured = Boolean(p.popular);
              return (
                <StaggerItem key={p.id} className="h-full">
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-card-lg border bg-white p-6 shadow-soft transition-shadow hover:shadow-lift sm:p-8",
                      featured ? "border-teal-700/40 ring-1 ring-teal-700/30" : "border-sand-200"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-display text-[22px] font-bold text-ink">{p.name}</h2>
                      {featured && (
                        <span className="rounded-full bg-ochre-500 px-3.5 py-1 text-[12px] font-bold uppercase tracking-wide text-ink">
                          Recommandée
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13.5px] font-semibold text-teal-700">{p.tagline}</p>

                    <p className="mt-6 flex items-baseline gap-2">
                      <AmountDisplay value={p.adultMonthly} className="font-display text-[34px] font-bold text-ink" />
                      <span className="text-[13px] text-muted-foreground">/ mois par adulte</span>
                    </p>
                    <p className="tnum mt-1 text-[13px] text-muted-foreground">
                      Enfant : {formatFcfa(p.childMonthly)} / mois
                    </p>

                    <ul className="mt-6 space-y-3 border-t border-sand-200 pt-6">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3 text-[14.5px] leading-snug text-ink">
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                            <Check className="size-3" strokeWidth={3} aria-hidden />
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 text-[13.5px] leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>

                    <div className="mt-8 flex-1" aria-hidden />

                    {/* Le CTA passe TOUJOURS par ChooseFormulaButton : la formule
                        pré-remplie dans le tunnel correspond au libellé affiché. */}
                    <ChooseFormulaButton
                      formulaId={p.id}
                      label={`Souscrire à ${p.name}`}
                      variant={featured ? "default" : "outline"}
                    />
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
          <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
            Primes de base pour l&apos;adhérent principal · dégressives selon la fréquence de paiement ·{" "}
            {/* TODO: grille tarifaire définitive à confirmer avec les compagnies partenaires */}
            valeurs indicatives
          </p>
        </div>
      </section>

      {/* ─────────────────── Tableau détaillé des garanties ─────────────────── */}
      <section className="bg-sand-100/60 py-24 sm:py-32" aria-label="Détail des garanties par formule">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>Comparatif détaillé</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold">
              Le détail, garantie par garantie.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Taux de remboursement et plafonds annuels par personne. Ce qui n&apos;est pas inclus
                dans une formule est dit clairement — jamais caché en bas de page.
              </p>
            </Reveal>
          </div>

          {/* Desktop : vrai tableau en grille 4 colonnes */}
          <Reveal className="mt-12 hidden md:block">
            <div className="overflow-hidden rounded-card-lg border border-sand-200 bg-white shadow-soft">
              <div className="grid grid-cols-4 bg-teal-900 text-sand-50">
                <div className="px-7 py-5 text-[13px] font-bold uppercase tracking-wide">Garantie</div>
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={cn(
                      "px-4 py-5 text-center font-display text-[16px] font-bold",
                      p.popular && "bg-white/10"
                    )}
                  >
                    {p.name}
                    {p.popular && (
                      <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-ochre-100">
                        Recommandée
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {guarantees.map((g, i) => (
                <div
                  key={g.key}
                  className={cn("grid grid-cols-4", i % 2 === 1 && "bg-sand-100/50")}
                >
                  <div className="px-7 py-5">
                    <p className="text-[15px] font-semibold text-ink">{g.label}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                      {g.description}
                    </p>
                  </div>
                  {products.map((p) => {
                    const cov = g.coverage[p.id];
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          "flex flex-col items-center justify-center px-4 py-5 text-center",
                          p.popular && "bg-white/60"
                        )}
                      >
                        {cov.taux > 0 ? (
                          <>
                            <span className="tnum font-display text-[18px] font-bold text-teal-900">
                              {cov.taux} %
                            </span>
                            <span className="tnum mt-0.5 text-[12px] text-muted-foreground">
                              max {formatFcfa(cov.plafond)}
                            </span>
                          </>
                        ) : (
                          <span className="text-[13px] font-medium text-muted-foreground">
                            Non incluse
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Mobile : cartes empilées */}
          <div className="mt-10 space-y-4 md:hidden">
            {guarantees.map((g) => (
              <Reveal key={g.key}>
                <div className="rounded-[16px] border border-sand-200 bg-white p-5 shadow-soft">
                  <p className="font-display text-[16px] font-bold text-ink">{g.label}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
                    {g.description}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-sand-200 pt-4">
                    {products.map((p) => {
                      const cov = g.coverage[p.id];
                      return (
                        <div key={p.id} className="text-center">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            {p.name}
                          </p>
                          {cov.taux > 0 ? (
                            <>
                              <p className="tnum mt-1 text-[15px] font-bold text-teal-900">
                                {cov.taux} %
                              </p>
                              <p className="tnum text-[11px] text-muted-foreground">
                                max {formatFcfa(cov.plafond)}
                              </p>
                            </>
                          ) : (
                            <p className="mt-1.5 text-[11.5px] font-medium text-muted-foreground">
                              Non incluse
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-[12.5px] text-muted-foreground">
            Plafonds annuels par personne, remis à zéro chaque année de contrat ·{" "}
            {/* TODO: taux et plafonds à valider par le juriste et les compagnies partenaires */}
            valeurs indicatives, confirmées à la souscription
          </p>
        </div>
      </section>

      {/* ──────────────────── Fréquences de paiement ──────────────────── */}
      <section className="py-24 sm:py-32" aria-label="Fréquences de paiement">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>Paiement</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
              Payez à votre rythme.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Mensuel, trimestriel ou annuel : la remise s&apos;applique automatiquement dans le
                simulateur. Exemple affiché pour la formule Confort, un adulte.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3">
            {(["mensuel", "trimestriel", "annuel"] as const).map((freq) => {
              const discount = frequencyDiscount[freq];
              // Moteur officiel (lib/pricing) — exemples alignés au simulateur.
              const periodPrice = quote({
                coverage: "seul",
                children: 0,
                age: 29,
                formula: "confort",
                frequency: freq,
              }).period;
              return (
                <StaggerItem key={freq}>
                  <div className="h-full rounded-[16px] border border-sand-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-[18px] font-bold capitalize text-ink">{freq}</h3>
                      {discount > 0 ? (
                        <span className="tnum rounded-full bg-teal-100 px-3 py-1 text-[12px] font-bold text-teal-900">
                          −{Math.round(discount * 100)} %
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                          <Wallet className="size-3.5" aria-hidden /> Sans engagement
                        </span>
                      )}
                    </div>
                    <p className="mt-5">
                      <AmountDisplay
                        value={periodPrice}
                        className="font-display text-[26px] font-bold text-ink"
                      />
                      <span className="ml-1.5 text-[13px] text-muted-foreground">{frequencyLabel[freq]}</span>
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                      {freq === "mensuel" &&
                        "La flexibilité totale : le prélèvement Mobile Money chaque mois, résiliable en quelques clics."}
                      {freq === "trimestriel" &&
                        "Un peu d'économie et moins d'oublis : une seule démarche tous les trois mois."}
                      {freq === "annuel" &&
                        `La meilleure offre : une année entière couverte, ${Math.round(frequencyDiscount.annuel * 100)} % d'économie au passage.`}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ──────────────────────── Exclusions ──────────────────────── */}
      <section className="bg-sand-100/60 py-24 sm:py-32" aria-label="Exclusions de garantie">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow tone="ochre">Transparence</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
              Ce qui n&apos;est jamais couvert.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Aucun contrat d&apos;assurance ne couvre tout, et nous préférons vous le dire avant
                de signer. Voici les exclusions générales, valables sur les trois formules.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-2">
            {exclusions.map((ex) => (
              <StaggerItem key={ex.title}>
                <div className="flex h-full items-start gap-4 rounded-[16px] border border-sand-200 bg-white p-6 shadow-soft">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-sand-200 text-ink-soft">
                    <XCircle className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-[16px] font-bold text-ink">{ex.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{ex.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal delay={0.1}>
            <p className="mt-8 flex items-start gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden />
              Les exclusions complètes figurent dans les conditions générales du contrat.{" "}
              {/* TODO: renvoyer vers le PDF des CG une fois validé par le juriste */}
              En cas de doute sur un soin, écrivez-nous avant : on vous répond en français clair.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── FAQ souscription ───────────────────────── */}
      <section className="py-24 sm:py-32" aria-label="Questions fréquentes sur la souscription">
        <div className="container-ams grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Reveal>
              <Eyebrow>Questions fréquentes</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
              Avant de souscrire.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-muted-foreground">
                Les trois questions qui reviennent le plus au moment de choisir sa formule. Le
                centre d&apos;aide couvre le reste, en détail.
              </p>
              <Link
                href="/aide"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-100 px-5 py-2.5 text-[14px] font-semibold text-teal-900 transition-colors hover:bg-teal-500/25"
              >
                Voir le centre d&apos;aide <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="rounded-card-lg border border-sand-200 bg-white px-6 shadow-soft">
              {souscriptionFaq.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="border-sand-200 last:border-0">
                  <AccordionTrigger className="py-5 text-left font-display text-[16px] font-semibold hover:no-underline hover:text-teal-900">
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

      {/* ─────────────────────────── CTA final ─────────────────────────── */}
      <section className="container-ams pb-28" aria-label="Simuler ma prime">
        <Reveal>
          <div className="bg-panel-ink relative overflow-hidden rounded-[28px] px-8 py-16 text-sand-50 shadow-card sm:px-14 sm:py-20">
            <BogolanTexture color="#E3F4F1" opacity={0.06} />
            <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <SplitHeading
                trigger={false}
                className="font-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.05]"
              >
                Votre formule vous attend.
              </SplitHeading>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-teal-100/80">
                Trente secondes dans le simulateur pour connaître votre prime exacte, selon votre
                couverture, votre âge et votre fréquence de paiement.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <PrimaryCta href="/simulateur" variant="on-dark" size="xl">
                  Simuler ma prime <ArrowRight className="size-4" aria-hidden />
                </PrimaryCta>
                <Button asChild size="xl" variant="outline-light">
                  <Link href="/comment-ca-marche">Comprendre le parcours</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
