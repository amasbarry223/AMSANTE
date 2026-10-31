import type { Metadata } from "next";
import { B2BQuoteFunnel } from "@/components/funnel/B2BQuoteFunnel";

export const metadata: Metadata = {
  title: "Devis groupe entreprise",
  description:
    "Décrivez votre effectif en 2 minutes : un conseiller AMSANTÉ vous rappelle sous 24 h ouvrées avec une estimation sur mesure pour vos salariés et leurs ayants droit.",
  robots: { index: false },
};

/**
 * Devis entreprise — tunnel plein écran (chrome identique à (funnel)).
 * Le takeover couvre la Navbar/Footer du site et utilise le scroll natif.
 */
export default function DevisEntreprisePage() {
  return <B2BQuoteFunnel />;
}
