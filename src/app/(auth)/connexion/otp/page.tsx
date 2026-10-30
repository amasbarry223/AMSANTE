import type { Metadata } from "next";
import { OtpPage } from "@/components/shared/OtpPage";

export const metadata: Metadata = {
  title: "Code de vérification",
  description: "Saisissez le code à 6 chiffres reçu par SMS ou e-mail pour accéder à votre espace AMSANTÉ.",
  robots: { index: false },
};

export default function ConnexionOtpPage() {
  return <OtpPage />;
}
