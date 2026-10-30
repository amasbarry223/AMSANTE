import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";

/** Contenu de travail : générique, honnête, à faire valider par un juriste. */
type LegalSection = { title: string; paragraphs: string[]; list?: string[] };
type LegalDoc = {
  title: string;
  description: string;
  /** Date de mise à jour affichée (fictive pour l'instant). */
  updated: string;
  sections: LegalSection[];
};

/* TODO: faire valider l'ensemble de ces documents par le juriste avant mise en
   production. Les mentions réglementaires (agrément n° XXXX, RCCM, forme
   juridique, autorité de contrôle) sont des placeholders explicites. */

const legalDocs: Record<string, LegalDoc> = {
  "mentions-legales": {
    title: "Mentions légales",
    description:
      "Éditeur du site AMSANTÉ, agrément, directeur de publication, hébergement et propriété intellectuelle.",
    updated: "1er juillet 2025",
    sections: [
      {
        title: "Éditeur du site",
        paragraphs: [
          "Le site AMSANTÉ est édité par AMSANTÉ, entreprise spécialisée dans la distribution digitale de produits d'assurance santé, dont le siège est situé à Bamako, Mali.",
          "Pour toute question relative au site ou à nos services, écrivez-nous depuis le centre d'aide ou sur WhatsApp : nous répondons du lundi au samedi, de 8h à 20h.",
        ],
      },
      {
        title: "Agrément et réglementation",
        paragraphs: [
          "L'activité d'assurance est une activité réglementée. AMSANTÉ exerce dans le cadre des textes en vigueur au Mali et de la réglementation régionale applicable aux sociétés d'assurance, sous réserve des agréments requis.",
          "Agrément n° XXXX — à compléter.",
          "Autorité de contrôle : [à compléter].",
        ],
      },
      {
        title: "Directeur de la publication",
        paragraphs: ["Directeur de la publication : [nom et fonction à compléter]."],
      },
      {
        title: "Hébergement",
        paragraphs: [
          "Le site est hébergé par : [hébergeur, adresse et coordonnées à compléter].",
          "Les données des assurés font l'objet de mesures de protection spécifiques, détaillées dans notre politique de confidentialité.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus du site (textes, visuels, logo, interface, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.",
          "La marque AMSANTÉ et les éléments distinctifs associés ne peuvent être utilisés sans accord préalable de l'éditeur.",
        ],
      },
      {
        title: "Signalement",
        paragraphs: [
          "Si vous constatez une erreur, un contenu inexact ou une faille de sécurité sur le site, signalez-le-nous : nous corrigeons rapidement et nous vous remercions, publiquement ou anonymement, comme vous préférez.",
        ],
      },
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    description:
      "Données collectées par AMSANTÉ, finalités, accès, durées de conservation, sécurité et droits des assurés.",
    updated: "1er juillet 2025",
    sections: [
      {
        title: "Notre approche, en une phrase",
        paragraphs: [
          "Nous collectons le minimum nécessaire pour assurer et rembourser, nous ne vendons aucune donnée et vous pouvez demander à voir, corriger ou supprimer vos informations à tout moment.",
        ],
      },
      {
        title: "Données collectées",
        paragraphs: [
          "Dans le cadre de la souscription et de la gestion d'un contrat AMSANTÉ, nous collectons notamment :",
        ],
        list: [
          "données d'identité et de contact : nom, prénoms, date de naissance, téléphone, e-mail, commune et quartier ;",
          "pièces justificatives : photo d'identité et numéro de pièce (NINA ou équivalent) ;",
          "données de santé et de soins : actes réalisés, montants, dossiers de remboursement ;",
          "données de paiement : numéro de compte Mobile Money et historique des transactions liées au contrat.",
        ],
      },
      {
        title: "Finalités",
        paragraphs: [
          "Ces données servent exclusivement à : établir et gérer votre contrat, vérifier vos droits chez les prestataires conventionnés, traiter les remboursements, vous adresser des informations liées à votre contrat et respecter nos obligations légales. Elles ne sont jamais utilisées pour de la publicité ciblée ni revendues à des tiers.",
        ],
      },
      {
        title: "Qui peut y accéder",
        paragraphs: [
          "Vos données sont accessibles aux équipes habilitées d'AMSANTÉ, aux prestataires conventionnés pour la part strictement nécessaire à la vérification de vos droits, et à notre prestataire de paiement pour l'exécution des transactions. Les autorités publiques ne peuvent y accéder que dans les cas prévus par la loi.",
        ],
      },
      {
        title: "Durée de conservation",
        paragraphs: [
          "Vos données sont conservées pendant la durée du contrat, puis selon les durées de prescription légales applicables aux opérations d'assurance. Vous pouvez nous demander le détail de ces durées à tout moment.",
        ],
      },
      {
        title: "Sécurité",
        paragraphs: [
          "Les données sont chiffrées en transit et au repos, les accès sont restreints selon le rôle de chaque collaborateur et chaque action est tracée dans un journal d'audit. En cas d'incident affectant vos données, nous vous en informerions sans délai ainsi que l'autorité compétente.",
        ],
      },
      {
        title: "Vos droits",
        paragraphs: [
          "Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition sur vos données personnelles. Pour l'exercer, écrivez-nous depuis le centre d'aide ou par WhatsApp : une réponse vous est apportée dans un délai de trente (30) jours.",
          "Responsable de la protection des données : [contact à compléter].",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Le site utilise uniquement des cookies nécessaires à son bon fonctionnement et des outils de mesure d'audience anonyme. Aucun cookie publicitaire de tiers n'est déposé sans votre accord.",
        ],
      },
    ],
  },
  cgu: {
    title: "Conditions générales d'utilisation",
    description:
      "Règles d'utilisation du site et des services AMSANTÉ : souscription, primes, carte digitale, résiliation et réclamations.",
    updated: "1er juillet 2025",
    sections: [
      {
        title: "Objet",
        paragraphs: [
          "Les présentes conditions régissent l'utilisation du site AMSANTÉ et des services digitaux associés : simulation de prime, souscription en ligne, carte d'assuré digitale, déclaration de soins et suivi des remboursements. Elles ne remplacent pas les conditions générales du contrat d'assurance, qui régissent la couverture elle-même.",
        ],
      },
      {
        title: "Le service AMSANTÉ",
        paragraphs: [
          "AMSANTÉ permet de souscrire une assurance santé en ligne en quelques minutes, de recevoir une carte d'assuré digitale avec QR code, de bénéficier du tiers payant chez les prestataires conventionnés et d'être remboursé sur un compte Mobile Money.",
        ],
      },
      {
        title: "Souscription et obligations de l'assuré",
        paragraphs: [
          "Les informations déclarées lors de la souscription doivent être exactes et complètes. Toute fausse déclaration peut entraîner la nullité du contrat ou la réduction des indemnités, conformément à la réglementation applicable.",
          "Le contrat comporte un délai de carence de 10 jours pour les soins courants et de 30 jours pour la maternité. Les urgences vitales sont prises en charge immédiatement, dès le premier jour.",
        ],
      },
      {
        title: "Primes et paiement",
        paragraphs: [
          "Les primes sont payables par Mobile Money (Orange Money, Moov Money, Wave), au choix mensuel, trimestriel ou annuel. Les remises éventuelles (−2 % trimestriel, −5 % annuel) s'appliquent automatiquement au moment du paiement.",
          "Un impayé peut entraîner la suspension des garanties puis, après mise en demeure restée sans effet, la résiliation du contrat, selon les conditions prévues au contrat d'assurance.",
        ],
      },
      {
        title: "Carte d'assuré digitale",
        paragraphs: [
          "La carte digitale et son QR code sont strictement personnels. Leur prêt, leur cession ou toute utilisation destinée à faire couvrir un tiers non assuré constitue une fraude : elle peut entraîner la résiliation du contrat et des poursuites.",
          "En cas de perte de téléphone, la carte reste accessible depuis n'importe quel appareil via votre compte.",
        ],
      },
      {
        title: "Résiliation",
        paragraphs: [
          "Vous pouvez résilier votre contrat à l'échéance annuelle, ou dans les cas prévus par la réglementation. La demande se fait depuis votre espace ou par écrit. Les primes acquises restent dues au prorata de la période couverte.",
        ],
      },
      {
        title: "Réclamations et médiation",
        paragraphs: [
          "Toute réclamation est d'abord traitée par notre service client (WhatsApp, téléphone ou centre d'aide). Sans réponse satisfaisante, vous pouvez adresser une réclamation écrite à notre siège ; elle sera étudiée par un interlocuteur distinct du traitement initial.",
          "Vous pouvez également saisir l'autorité de contrôle compétente : [référence à compléter].",
        ],
      },
      {
        title: "Évolution des présentes conditions",
        paragraphs: [
          "Ces conditions peuvent être modifiées pour refléter l'évolution du service ou de la réglementation. Toute modification substantielle vous est notifiée avant son entrée en vigueur, avec un délai raisonnable pour l'accepter.",
        ],
      },
      {
        title: "Droit applicable",
        paragraphs: [
          "Les présentes conditions sont soumises au droit malien. En cas de litige non résolu à l'amiable, les tribunaux compétents de Bamako sont saisis.",
        ],
      },
    ],
  },
};

type LegalSlug = keyof typeof legalDocs;

export function generateStaticParams() {
  return Object.keys(legalDocs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocs[slug];
  if (!doc) return {};
  return {
    title: `${doc.title} — AMSANTÉ`,
    description: doc.description,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalDocs[slug];
  if (!doc) notFound();

  return (
    <section className="bg-sand-50" aria-label={doc.title}>
      <div className="container-ams pt-32 pb-28 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          {/* TODO: date de mise à jour fictive — synchroniser avec la validation du juriste */}
          <Reveal>
            <Eyebrow>Informations légales</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.05] text-ink">
              {doc.title}
            </h1>
            <p className="mt-3 text-[13.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Dernière mise à jour : {doc.updated}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-8 flex items-start gap-2.5 rounded-[16px] border border-ochre-100 bg-ochre-100/60 px-5 py-4 text-[13.5px] leading-relaxed text-ink">
              <Info className="mt-0.5 size-4 shrink-0 text-ochre-500" aria-hidden />
              Document de travail, version bêta : les mentions réglementaires (agrément n° XXXX,
              autorités et contacts) seront complétées et validées avant la mise en ligne.{" "}
              {/* TODO: faire valider par le juriste */}
            </p>
          </Reveal>

          <div className="mt-10 space-y-12">
            {doc.sections.map((section, i) => (
              <Reveal key={section.title} delay={Math.min(i * 0.04, 0.2)}>
                <article>
                  <h2 className="font-display text-[20px] font-bold text-ink sm:text-[22px]">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map((p) => (
                      <p key={p} className="text-[15px] leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="mt-3 space-y-2">
                      {section.list.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground"
                        >
                          <span
                            className="mt-[9px] size-1.5 shrink-0 rounded-full bg-teal-500"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-sand-200 bg-white px-6 py-5 shadow-soft">
              <p className="text-[14.5px] font-semibold text-ink">
                Une question juridique précise ?
              </p>
              <Link
                href="/aide"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-900 px-5 py-2.5 text-[13.5px] font-semibold text-sand-50 transition-colors hover:bg-teal-700"
              >
                Passer par le centre d&apos;aide
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
