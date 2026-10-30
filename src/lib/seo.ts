import { faq } from "@/data/faq";
import type { FaqItem } from "@/data/types";

/**
 * Données structurées JSON-LD (§10) : InsuranceAgency sur l'accueil,
 * FAQPage sur l'accueil et le centre d'aide. Aucune donnée inventée
 * présentée comme réelle : les coordonnées sont des placeholders TODO.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://amsante.ml";

/** TODO: coordonnées réelles de l'agence à confirmer (mêmes mocks que /aide). */
export function insuranceAgencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: "AMSANTÉ",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      "Plateforme d'assurance santé 100 % digitale au Mali : souscription en ligne, carte d'assuré digitale avec QR code, tiers payant chez les prestataires conventionnés et remboursements en Mobile Money.",
    areaServed: { "@type": "Country", name: "Mali" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bamako",
      addressCountry: "ML",
    },
    /* TODO: remplacer par le téléphone réel du service client. */
    telephone: "+223 80 00 11 22",
    openingHours: "Mo-Sa 08:00-20:00",
    availableService: [
      { "@type": "InsuranceService", name: "Assurance santé particuliers & familles" },
      { "@type": "InsuranceService", name: "Assurance santé groupe salariés" },
    ],
    paymentAccepted: "Orange Money, Moov Africa Money, Wave",
  };
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** FAQ complète (pour /aide). */
export function allFaqJsonLd() {
  return faqPageJsonLd(faq);
}
