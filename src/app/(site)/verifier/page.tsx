import type { Metadata } from "next";
import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { VerifyTool } from "@/components/shared/VerifyTool";

export const metadata: Metadata = {
  title: "Vérifier une carte d’assuré",
  description:
    "Prestataires de soins : vérifiez en quelques secondes la validité d’une carte d’assuré AMSANTÉ — par QR code ou par code d’attestation. Anonyme, sans donnée médicale.",
  alternates: { canonical: "/verifier" },
};

const REASSURANCES = [
  { icon: ShieldCheck, label: "Vérification instantanée, sans compte" },
  { icon: LockKeyhole, label: "Anonyme — aucune donnée médicale dévoilée" },
  { icon: Clock3, label: "Disponible 24 h/24, y compris en urgence" },
] as const;

export default function VerifierPage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-label="Vérification d’une carte d’assuré"
        className="grain relative overflow-hidden bg-ink pb-14 pt-32 text-sand-50 sm:pb-16 sm:pt-40"
      >
        <BogolanTexture color="#E3F4F1" opacity={0.05} />
        <div className="container-ams relative text-center">
          <Reveal>
            <Eyebrow tone="light">Prestataires</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            trigger={false}
            className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] font-bold"
          >
            Vérifiez une carte d’assuré en 5 secondes.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-sand-50/70">
              Scannez le QR code de la carte ou saisissez son code : vous savez
              immédiatement si les droits sont ouverts, avant d’ouvrir le dossier de soins.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Outil */}
      <section aria-label="Outil de vérification" className="py-24 sm:py-32">
        <div className="container-ams">
          <VerifyTool />

          <Reveal delay={0.1}>
            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {REASSURANCES.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center gap-2 text-[13.5px] font-medium text-muted-foreground"
                >
                  <r.icon className="size-4 text-teal-700" aria-hidden />
                  {r.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
