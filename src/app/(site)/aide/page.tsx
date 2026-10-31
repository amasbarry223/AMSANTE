import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, FileText, MessageCircle, Phone, Send, Wallet } from "lucide-react";
import { Eyebrow, Reveal, StaggerContainer, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { HelpSearch } from "@/components/shared/HelpSearch";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { allFaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Centre d'aide — AMSANTÉ",
  description:
    "Souscription, carte digitale, tiers payant, remboursements Mobile Money : cherchez une réponse instantanée ou écrivez-nous sur WhatsApp, du lundi au samedi de 8h à 20h.",
  alternates: { canonical: "/aide" },
};

/* TODO: numéros et horaires de service client à confirmer. */
const PHONE_HREF = "tel:+22380001122";
const PHONE_DISPLAY = "+223 80 00 11 22";
const WHATSAPP_URL = "https://wa.me/22376005566";

export default function AidePage() {
  return (
    <>
      {/* Données structurées : FAQPage complète (les 14 questions du centre d'aide) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(allFaqJsonLd()) }}
      />

      {/* ─────────────────────────── Hero sombre ─────────────────────────── */}
      <section className="relative overflow-hidden bg-ink pt-32 pb-10 text-sand-50 sm:pt-40 sm:pb-12" aria-label="Centre d'aide">
        <div className="container-ams">
          <BogolanTexture color="#E3F4F1" opacity={0.05} />
          <div className="relative">
            <Reveal>
              <Eyebrow tone="light">Centre d&apos;aide</Eyebrow>
            </Reveal>
            <SplitHeading
              as="h1"
              trigger={false}
              className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,5.2vw,4rem)] font-bold leading-[1.05]"
            >
              Une question ? La réponse existe déjà.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-teal-100/80">
                Tapez votre question comme vous la poseriez à un collègue. Toutes les réponses sont
                écrites en français clair — et si ça ne suffit pas, une vraie personne vous répond
                sur WhatsApp.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Recherche + catégories + articles (îlot client) ── */}
      <HelpSearch />

      {/* ── Sinistres : procédure de déclaration (ancre #sinistres) ── */}
      <section id="sinistres" className="scroll-mt-24 bg-white py-24 sm:py-32" aria-label="Déclarer un remboursement">
        <div className="container-ams">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>Sinistres</Eyebrow>
            </Reveal>
            <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold">
              Un soin payé d&apos;avance ? Déclarez-le en trois étapes.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                Consultation, pharmacie ou analyses réglées hors tiers payant&nbsp;? Envoyez
                vos justificatifs : le remboursement part sur votre Mobile Money sous 72&nbsp;h
                en moyenne après validation.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3">
            <StaggerItem>
              <div className="h-full rounded-[24px] border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <FileText className="size-5" aria-hidden />
                </span>
                <p className="tnum mt-5 text-[12px] font-bold uppercase tracking-widest text-teal-700">Étape 1</p>
                <h3 className="mt-1 font-display text-[17px] font-bold text-ink">Rassemblez vos documents</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  La facture acquittée, l&apos;ordonnance ou le décompte de la structure — une
                  photo nette suffit, pas besoin de scanner.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-[24px] border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <Send className="size-5" aria-hidden />
                </span>
                <p className="tnum mt-5 text-[12px] font-bold uppercase tracking-widest text-teal-700">Étape 2</p>
                <h3 className="mt-1 font-display text-[17px] font-bold text-ink">Envoyez-les sur WhatsApp</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Écrivez-nous avec votre nom et votre référence d&apos;assuré. Un agent accuse
                  réception en quelques minutes pendant les horaires d&apos;ouverture.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-[24px] border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <Wallet className="size-5" aria-hidden />
                </span>
                <p className="tnum mt-5 text-[12px] font-bold uppercase tracking-widest text-teal-700">Étape 3</p>
                <h3 className="mt-1 font-display text-[17px] font-bold text-ink">Soyez remboursé</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  Après validation, le virement arrive sur votre Orange Money, Moov Africa Money
                  ou Wave — avec une notification à chaque étape.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-success px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" aria-hidden />
                Déclarer sur WhatsApp
              </a>
              <a
                href={PHONE_HREF}
                className="tnum inline-flex min-h-11 items-center gap-2 rounded-full border border-sand-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-teal-500/60 hover:bg-teal-100/60"
              >
                <Phone className="size-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">
              La déclaration en ligne depuis votre espace assuré arrive bientôt — la connexion
              à votre espace reste disponible ci-dessous.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── Bandeau contact ───────────────────────── */}
      <section className="bg-sand-100/60 py-24 sm:py-32" aria-label="Contacter le service client">
        <div className="container-ams">
          <Reveal>
            <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr]">
              <div className="rounded-[24px] border border-sand-200 bg-white p-7 shadow-soft lg:col-span-1">
                <span className="flex size-11 items-center justify-center rounded-xl bg-success/15 text-success">
                  <MessageCircle className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-[18px] font-bold text-ink">WhatsApp</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                  Le plus rapide : envoyez votre question (et la photo d&apos;une facture si besoin),
                  un agent vous répond en quelques minutes pendant les horaires d&apos;ouverture.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-success px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Ouvrir WhatsApp
                </a>
              </div>

              <div className="rounded-[24px] border border-sand-200 bg-white p-7 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <Phone className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-[18px] font-bold text-ink">Par téléphone</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                  Pour une urgence ou une démarche en cours, appelez notre service client, sans
                  robot ni musique d&apos;attente interminable.
                </p>
                <a
                  href={PHONE_HREF}
                  className="tnum mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-sand-300 px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-teal-500/60 hover:bg-teal-100/60"
                >
                  <Phone className="size-4" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </div>

              <div className="rounded-[24px] border border-sand-200 bg-white p-7 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-900">
                  <Clock className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-[18px] font-bold text-ink">Horaires</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                  Lundi – samedi, de 8h à 20h. En dehors de ces horaires, laissez un message :
                  nous rappelons dès l&apos;ouverture.
                </p>
                <p className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-100 px-5 py-2.5 text-[14px] font-semibold text-teal-900">
                  <Clock className="size-4" aria-hidden />
                  Lun–Sam, 8h–20h
                </p>
              </div>
            </div>
          </Reveal>

          {/* Parcours assuré : déclarer un remboursement (espace connecté) */}
          <Reveal delay={0.1}>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-sand-300 bg-white px-6 py-5 shadow-soft">
              <p className="text-[15px] font-semibold text-ink">
                Vous préférez vous connecter pour déclarer&nbsp;?
              </p>
              <Link
                href="/connexion?redirect=/sinistres/nouveau"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal-900/25 bg-teal-100/70 px-5 py-2.5 text-[13.5px] font-semibold text-teal-900 transition-colors hover:bg-teal-500/25"
              >
                Se connecter et déclarer <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>

          {/* Lien vers le parcours prestataire */}
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-teal-700/25 bg-teal-100/60 px-6 py-5">
              <p className="text-[15px] font-semibold text-teal-900">
                Vous êtes prestataire de santé et vous voulez rejoindre le réseau ?
              </p>
              <Link
                href="/prestataires/devenir-partenaire"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-900 px-5 py-2.5 text-[13.5px] font-semibold text-sand-50 transition-colors hover:bg-teal-700"
              >
                Devenir partenaire <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
