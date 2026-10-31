import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Fingerprint,
  HeartPulse,
  LineChart,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Users,
  FileText,
  Wallet,
} from "lucide-react";
import { Eyebrow, Reveal, StaggerContainer, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { DemoModal } from "@/components/shared/DemoModal";
import { PricingToggle } from "@/components/shared/PricingToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AMSANTÉ pour les cabinets — Plateforme de gestion",
  description:
    "Clients, contrats, sinistres, Mobile Money, commissions, reporting : la plateforme qui outille les cliniques, pharmacies et laboratoires du Mali comme une fintech. Demandez une démo.",
  alternates: { canonical: "/cabinets" },
};

/** Les 6 modules du bento : icône, description, mock décoratif CSS. */
const modules = [
  {
    icon: Users,
    name: "Clients",
    description:
      "Fiches assurés et ayants droit, historique de soins, documents centralisés : tout le dossier patient, cherchable en une seconde.",
    mock: "avatars" as const,
  },
  {
    icon: FileText,
    name: "Contrats",
    description:
      "Souscriptions, renouvellements, quittances et échéances au même endroit, avec alertes avant chaque expiration.",
    mock: "lines" as const,
  },
  {
    icon: HeartPulse,
    name: "Sinistres",
    description:
      "Chaque dossier suivi en temps réel : reçu, en analyse, validé, payé. Fini les cahiers et les relances téléphoniques.",
    mock: "pills" as const,
  },
  {
    icon: Smartphone,
    name: "Mobile Money",
    description:
      "Encaissement Orange Money, Moov Africa Money et Wave intégré, réconciliation automatique à la fin de la journée.",
    mock: "operators" as const,
  },
  {
    icon: Wallet,
    name: "Commissions",
    description:
      "Calcul automatique des commissions des apporteurs, validations en un clic, reçus générés sans tableur.",
    mock: "bars" as const,
  },
  {
    icon: LineChart,
    name: "Reporting",
    description:
      "Portefeuille, recettes, sinistralité : vos indicateurs en direct, exportables en CSV et PDF pour le conseil d'administration.",
    mock: "ring" as const,
  },
];

const securityItems = [
  {
    icon: ShieldCheck,
    title: "Rôles et permissions (RBAC)",
    text: "Chaque membre de l'équipe voit ce qui le concerne : le caissier encaisse, le gestionnaire valide, l'administrateur supervise. Rien de plus.",
  },
  {
    icon: Fingerprint,
    title: "Double authentification",
    text: "Connexion protégée par un code à usage unique envoyé sur le téléphone du compte : même un mot de passe volé ne suffit plus.",
  },
  {
    icon: ScrollText,
    title: "Journal d'audit",
    text: "Qui a modifié quoi, quand, sur quel dossier : chaque action est tracée et consultable, pour des contrôles internes sans stress.",
  },
];

/** Petit mock décoratif CSS par module (aucune image externe). */
function Mock({ kind }: { kind: (typeof modules)[number]["mock"] }) {
  if (kind === "avatars") {
    return (
      <div className="mt-5 flex items-center gap-2" aria-hidden>
        {["AT", "MD", "SC", "IB"].map((t, i) => (
          <span
            key={t}
            className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-teal-100 font-display text-[11px] font-bold text-teal-900"
            style={{ marginLeft: i === 0 ? 0 : -14 }}
          >
            {t}
          </span>
        ))}
        <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-teal-900 text-[11px] font-bold text-sand-50">
          +24
        </span>
      </div>
    );
  }
  if (kind === "lines") {
    return (
      <div className="mt-5 space-y-2" aria-hidden>
        <span className="block h-2 w-4/5 rounded-full bg-teal-100" />
        <span className="block h-2 w-3/5 rounded-full bg-sand-200" />
        <span className="block h-2 w-2/3 rounded-full bg-teal-100" />
        <span className="block h-2 w-2/5 rounded-full bg-sand-200" />
      </div>
    );
  }
  if (kind === "pills") {
    return (
      <div className="mt-5 flex flex-wrap gap-2" aria-hidden>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-[11px] font-bold text-teal-900">Reçu · 12</span>
        <span className="rounded-full bg-ochre-100 px-3 py-1 text-[11px] font-bold text-ochre-500">En analyse · 4</span>
        <span className="rounded-full bg-success/15 px-3 py-1 text-[11px] font-bold text-success">Payé · 38</span>
      </div>
    );
  }
  if (kind === "operators") {
    return (
      <div className="mt-5 flex gap-2" aria-hidden>
        <span className="flex h-9 flex-1 items-center justify-center rounded-[10px] bg-ochre-500 text-[11px] font-bold text-sand-50">OM</span>
        <span className="flex h-9 flex-1 items-center justify-center rounded-[10px] bg-teal-700 text-[11px] font-bold text-sand-50">Moov</span>
        <span className="flex h-9 flex-1 items-center justify-center rounded-[10px] bg-sand-300 text-[11px] font-bold text-ink">Wave</span>
      </div>
    );
  }
  if (kind === "bars") {
    return (
      <div className="mt-5 flex h-12 items-end gap-1.5" aria-hidden>
        {[30, 45, 38, 60, 52, 78].map((h, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-t-md",
              i === 5 ? "bg-teal-900" : "bg-teal-500/50"
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-5 flex items-center gap-4" aria-hidden>
      <svg viewBox="0 0 64 64" className="size-14">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#E3F4F1" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke="#0F5B57"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="131 163"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="space-y-2">
        <span className="block h-2 w-24 rounded-full bg-teal-100" />
        <span className="block h-2 w-16 rounded-full bg-sand-200" />
      </div>
    </div>
  );
}

export default function CabinetsPage() {
  return (
    <>
      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="bg-sand-50" aria-label="AMSANTÉ pour les cabinets">
        <div className="container-ams pt-32 pb-16 sm:pt-40 sm:pb-20">
          <Reveal>
            <Eyebrow>Pour les cabinets</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold leading-[1.05]"
          >
            Votre cabinet, outillé comme une fintech.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              Cliniques, pharmacies, laboratoires : gérez assurés, contrats, sinistres et
              encaissements Mobile Money depuis une seule plateforme. Conçue avec des gestionnaires
              maliens, pour le quotidien réel de vos équipes.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <DemoModal label="Demander une démo" size="lg" />
              <Button asChild variant="outline" size="lg">
                <Link href="/entreprises">
                  Vous êtes une entreprise ? <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">
              30 minutes en visio · sans engagement · données de démonstration fournies
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── Bento 6 modules ─────────────────────── */}
      <section className="bg-sand-50 pb-24 sm:pb-32" aria-label="Les modules de la plateforme">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>Plateforme</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold">
              Six modules, un seul outil.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Chaque module existe seul, mais c&apos;est ensemble qu&apos;ils remplacent vos
                cahiers, vos tableurs et vos groupes WhatsApp de suivi.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <StaggerItem key={m.name} className="h-full">
                  <div className="group h-full rounded-[16px] border border-sand-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift hover:ring-1 hover:ring-teal-500/40">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900 transition-colors group-hover:bg-teal-900 group-hover:text-sand-50">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-[17px] font-bold text-ink">{m.name}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                      {m.description}
                    </p>
                    <Mock kind={m.mock} />
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ────────────────────── Sécurité (sombre) ────────────────────── */}
      <section className="bg-ink py-24 text-sand-50 sm:py-32" aria-label="Sécurité de la plateforme">
        <div className="container-ams">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <Reveal>
                <Eyebrow tone="light">Sécurité</Eyebrow>
              </Reveal>
              <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
                Les données de santé se protègent sérieusement.
              </SplitHeading>
              <Reveal delay={0.1}>
                <p className="mt-4 text-[16px] leading-relaxed text-teal-100/80">
                  Chiffrement en transit et au repos, hébergement maîtrisé et contrôles réguliers :
                  la plateforme est construite pour des données sensibles, pas pour une démo de
                  plus. {/* TODO: détail des certifications et de l'hébergement à confirmer */}
                </p>
              </Reveal>
            </div>

            <StaggerContainer className="grid gap-4">
              {securityItems.map((s) => {
                const Icon = s.icon;
                return (
                  <StaggerItem key={s.title}>
                    <div className="flex items-start gap-4 rounded-[16px] border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-sm">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-100">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-[16px] font-bold text-sand-50">{s.title}</h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-teal-100/80">{s.text}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Tarifs ─────────────────────────── */}
      <section className="py-24 sm:py-32" aria-label="Tarifs de la plateforme">
        <div className="container-ams">
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <Eyebrow>Tarifs</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold">
              Un prix lisible, sans frais cachés.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Payez en Mobile Money, changez de plan quand votre cabinet grandit. L&apos;abonnement
                annuel vous offre deux mois.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-10">
            <PricingToggle />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── CTA final ─────────────────────────── */}
      <section id="final-cta" className="container-ams pb-28" aria-label="Réserver une démo">
        <Reveal>
          <div className="bg-panel-ink relative overflow-hidden rounded-[28px] px-8 py-16 text-sand-50 shadow-card sm:px-14 sm:py-20">
            <BogolanTexture color="#E3F4F1" opacity={0.06} />
            <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <SplitHeading
                  trigger={false}
                  className="font-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.05]"
                >
                  Voyez la plateforme tourner, avec vos cas réels.
                </SplitHeading>
                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-teal-100/80">
                  Un conseiller produit vous montre tout : création d&apos;assuré, scan de carte,
                  sinistre, encaissement Wave, reporting. Vous repartez avec une méthode de test
                  claire, même si vous ne signez pas.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3.5 lg:items-end">
                <DemoModal label="Réserver une démo" variant="on-dark" size="xl" />
                <p className="text-[13px] text-teal-100/70">
                  Réponse sous 48 h ouvrées · Lun–Sam, 8h–20h
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

