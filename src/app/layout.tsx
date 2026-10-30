import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://amsante.ml"),
  title: {
    default: "AMSANTÉ — Assurance santé 100 % digitale au Mali",
    template: "%s · AMSANTÉ",
  },
  description:
    "Souscrivez votre assurance santé en ligne en 5 minutes. Carte d'assuré digitale, tiers payant chez les prestataires conventionnés et remboursements en Mobile Money.",
  keywords: [
    "assurance santé Mali",
    "mutuelle Bamako",
    "carte d'assuré digitale",
    "Mobile Money",
    "tiers payant",
    "AMSANTÉ",
  ],
  openGraph: {
    title: "AMSANTÉ — Le soin, sans papier",
    description:
      "L'assurance santé 100 % digitale au Mali : souscription en ligne, carte digitale immédiate, remboursement Mobile Money.",
    locale: "fr_ML",
    type: "website",
    siteName: "AMSANTÉ",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMSANTÉ — Le soin, sans papier",
    description:
      "L'assurance santé 100 % digitale au Mali : souscription en ligne, carte digitale immédiate, remboursement Mobile Money.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
