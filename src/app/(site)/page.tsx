import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { PartnersBand } from "@/components/home/PartnersBand";
import { PaperToDigital } from "@/components/home/PaperToDigital";
import { ExpressSimulator } from "@/components/home/ExpressSimulator";
import { GuaranteesGrid } from "@/components/home/GuaranteesGrid";
import { ForWho } from "@/components/home/ForWho";
import { CareNetwork } from "@/components/home/CareNetwork";
import { StatsTrust } from "@/components/home/StatsTrust";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCta } from "@/components/home/FinalCta";
import { faq, homeFaqIds } from "@/data/faq";
import {
  insuranceAgencyJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "AMSANTÉ — Assurance santé 100 % digitale au Mali",
  description:
    "Souscrivez en 5 minutes, présentez votre carte digitale chez le médecin, soyez remboursé en Mobile Money. Essentiel, Confort, Premium — à partir de 7 500 FCFA/mois.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const homeFaq = homeFaqIds
    .map((id) => faq.find((f) => f.id === id))
    .filter((f): f is (typeof faq)[number] => Boolean(f));

  return (
    <>
      {/* Données structurées : InsuranceAgency + FAQPage (questions de l'accueil) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insuranceAgencyJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(homeFaq)) }}
      />

      <Hero />
      <PartnersBand />
      <PaperToDigital />
      <ExpressSimulator />
      <GuaranteesGrid />
      <ForWho />
      <CareNetwork />
      <StatsTrust />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
