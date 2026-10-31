"use client";

import { useMemo } from "react";
import { Lock } from "lucide-react";
import { useSubscription } from "@/stores/subscription";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { StepCard, StepTitle, FieldError, relationLabel } from "@/components/funnel/shared";
import { docsOk } from "@/components/funnel/schemas";

/** Étape 4 — Documents : pièce d'identité du principal + photos des bénéficiaires. */
export function StepDocs({ showErrors }: { showErrors: boolean }) {
  const documents = useSubscription((s) => s.documents);
  const beneficiaries = useSubscription((s) => s.beneficiaries);
  const setDocument = useSubscription((s) => s.setDocument);

  const principalOk = Boolean(documents["doc-principal"]);
  const allOk = useMemo(
    () => docsOk(documents, beneficiaries.map((b) => b.id)),
    [documents, beneficiaries]
  );

  const principalError =
    showErrors && !principalOk
      ? "Ajoutez la photo de votre pièce d'identité pour continuer."
      : undefined;
  const beneficiariesError =
    showErrors && principalOk && !allOk
      ? "Chaque bénéficiaire doit avoir sa photo d'identité."
      : undefined;

  return (
    <StepCard>
      <StepTitle
        title="Vos documents"
        hint="Photographiez depuis votre téléphone : tout est compressé et chiffré avant l'envoi, rien ne circule ailleurs."
      />

      <div className="space-y-6">
        <div>
          <FileDropzone
            label="Pièce d'identité de l'adhérent principal"
            hint="NINA, passeport ou carte de séjour · JPG ou PNG, compressée automatiquement"
            value={documents["doc-principal"] || null}
            onChange={(dataUrl) => setDocument("doc-principal", dataUrl ?? "")}
          />
          <FieldError message={principalError} />
        </div>

        {beneficiaries.length > 0 && (
          <div className="space-y-5">
            <h3 className="text-[15px] font-semibold">Photo d&apos;identité de chaque bénéficiaire</h3>
            {beneficiaries.map((b) => (
              <FileDropzone
                key={b.id}
                label={`Photo d'identité — ${b.firstName.trim() || relationLabel[b.relation]}`}
                value={documents[`doc-${b.id}`] || null}
                onChange={(dataUrl) => setDocument(`doc-${b.id}`, dataUrl ?? "")}
              />
            ))}
            <FieldError message={beneficiariesError} />
          </div>
        )}

        <p className="flex items-center gap-2 rounded-[10px] bg-teal-50 px-3.5 py-2.5 text-[12.5px] text-teal-900">
          <Lock className="size-4 shrink-0 text-teal-700" aria-hidden />
          Vos documents servent uniquement à l&apos;étude du dossier. Vous pouvez les retirer à tout moment.
        </p>
      </div>
    </StepCard>
  );
}
