import type { Metadata } from "next";
import { LoginFlow } from "@/components/shared/LoginFlow";

export const metadata: Metadata = {
  title: "Connexion à votre espace",
  description:
    "Connectez-vous à votre espace AMSANTÉ : assuré, entreprise, prestataire ou cabinet de courtage.",
  robots: { index: false },
};

export default function ConnexionPage() {
  return <LoginFlow />;
}
