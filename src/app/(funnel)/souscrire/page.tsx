import type { Metadata } from "next";
import { SubscriptionFunnel } from "@/components/funnel/SubscriptionFunnel";

export const metadata: Metadata = {
  title: "Souscrire en ligne",
  description:
    "Souscrivez votre assurance santé AMSANTÉ en 5 minutes : formule, bénéficiaires, documents et paiement Mobile Money — tout se fait depuis votre téléphone.",
  alternates: { canonical: "/souscrire" },
};

export default function SouscrirePage() {
  return <SubscriptionFunnel />;
}
