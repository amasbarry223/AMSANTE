import type { Metadata } from "next";
import { Confirmation } from "@/components/funnel/Confirmation";

export const metadata: Metadata = {
  title: "Confirmation de souscription",
  description:
    "Votre contrat AMSANTÉ est actif : référence, carte d'assuré digitale et prochaines étapes.",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return <Confirmation />;
}
