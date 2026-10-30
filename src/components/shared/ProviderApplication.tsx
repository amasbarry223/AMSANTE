"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { Stepper } from "@/components/funnel/Stepper";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { communeList, guarantees } from "@/data/guarantees";
import { providerTypes } from "@/data/providers";
import type { GuaranteeKey } from "@/data/types";
import { submitProviderApplication } from "@/lib/api";
import { duration, ease } from "@/lib/motion/tokens";
import { isValidMalianPhone } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

/* ── Schémas zod, validation par étape ───────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROVIDER_TYPE_IDS = providerTypes.filter((t) => t.id !== "tous").map((t) => t.id);

const step1Schema = z.object({
  name: z.string().trim().min(2, "Indiquez le nom de l’établissement."),
  type: z
    .string()
    .refine((v) => (PROVIDER_TYPE_IDS as string[]).includes(v), "Sélectionnez un type d’établissement."),
  commune: z.string().min(1, "Sélectionnez une commune."),
  quartier: z.string().trim().min(2, "Indiquez le quartier."),
  phone: z.string().refine((v) => isValidMalianPhone(v), "Numéro malien invalide (8 chiffres attendus)."),
});

const step2Schema = z.object({
  contactName: z.string().trim().min(2, "Indiquez le nom du responsable."),
  contactRole: z.string().trim().min(2, "Indiquez la fonction du responsable."),
  email: z.string().trim().refine((v) => EMAIL_RE.test(v), "Adresse e-mail invalide."),
  contactPhone: z
    .string()
    .refine((v) => isValidMalianPhone(v), "Numéro malien invalide (8 chiffres attendus)."),
});

const step3Schema = z.object({
  services: z
    .array(z.string())
    .min(1, "Sélectionnez au moins un service proposé."),
  tarifFile: z.string().nullable(),
});

const step4Schema = z.object({
  agrementFile: z.string().min(1, "Joignez l’agrément ou l’autorisation d’exercer."),
  ninaFile: z.string().min(1, "Joignez la copie de la NINA du responsable."),
});

const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema, step4Schema];

const STEPS = ["Établissement", "Responsable", "Services & tarifs", "Agréments"];

/* ── État du formulaire ──────────────────────────────────────────────── */

interface FormData {
  name: string;
  type: string;
  commune: string;
  quartier: string;
  phone: string;
  contactName: string;
  contactRole: string;
  email: string;
  contactPhone: string;
  services: GuaranteeKey[];
  tarifFile: string | null;
  agrementFile: string | null;
  ninaFile: string | null;
}

const INITIAL: FormData = {
  name: "",
  type: "",
  commune: "",
  quartier: "",
  phone: "",
  contactName: "",
  contactRole: "",
  email: "",
  contactPhone: "",
  services: [],
  tarifFile: null,
  agrementFile: null,
  ninaFile: null,
};

const SERVICE_PILLS: { key: GuaranteeKey; label: string }[] = guarantees.map((g) => ({
  key: g.key,
  label: g.label,
}));

type SubmitResult = Awaited<ReturnType<typeof submitProviderApplication>>;

/* ── Composant ───────────────────────────────────────────────────────── */

export function ProviderApplication() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<FormData>) => {
    setData((d) => ({ ...d, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  };

  const validateStep = (index: number): boolean => {
    const parsed = STEP_SCHEMAS[index].safeParse(data);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const map: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!map[field]) map[field] = issue.message;
    }
    setErrors(map);
    return false;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const goBack = () => {
    setDir(-1);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const submit = async () => {
    if (!validateStep(step) || submitting) return;
    setSubmitting(true);
    try {
      const res = await submitProviderApplication({
        name: data.name,
        type: data.type,
        commune: data.commune,
        quartier: data.quartier,
        phone: data.phone,
        contactName: data.contactName,
        contactRole: data.contactRole,
        email: data.email,
        contactPhone: data.contactPhone,
        services: data.services.join(","),
        tarifFile: data.tarifFile ?? "",
        agrementFile: data.agrementFile ?? "",
        ninaFile: data.ninaFile ?? "",
      });
      setResult(res);
      topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    } catch {
      setErrors({ form: "L’envoi a échoué. Vérifiez votre connexion et réessayez." });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Écran de confirmation ─────────────────────────────────────────── */
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="rounded-[28px] border border-sand-200 bg-white p-8 text-center shadow-soft sm:p-12"
        role="status"
      >
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-9 text-success" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
          Candidature envoyée, merci !
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Votre numéro de dossier :{" "}
          <strong className="tnum font-semibold text-teal-900">{result.dossierNumber}</strong>
          {result.contactEmail && (
            <>
              {" "}
              — un accusé de réception arrive à{" "}
              <strong className="font-semibold text-foreground">{result.contactEmail}</strong>.
            </>
          )}
        </p>
        {/* TODO: délai de traitement à confirmer par l'équipe partenariats */}
        <p className="mt-4 inline-block rounded-full bg-teal-100 px-4 py-2 text-[13.5px] font-semibold text-teal-900">
          Notre équipe partenariats vous contacte sous 5 jours ouvrés.
        </p>
      </motion.div>
    );
  }

  /* ── Formulaire 4 étapes ───────────────────────────────────────────── */
  return (
    <div ref={topRef} className="scroll-mt-28 rounded-[28px] border border-sand-200 bg-white p-6 shadow-soft sm:p-10">
      <Stepper steps={STEPS} current={step} onStepClick={(i) => { setDir(-1); setStep(i); }} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: duration.fast, ease: ease.out }}
          className="mt-8"
        >
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom de l’établissement" htmlFor="etab-name" error={errors.name} className="sm:col-span-2">
                <Input
                  id="etab-name"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Clinique, pharmacie, laboratoire…"
                  aria-invalid={!!errors.name}
                  className="h-12 rounded-[10px]"
                />
              </Field>

              <Field label="Type d’établissement" htmlFor="etab-type" error={errors.type}>
                <Select
                  value={data.type || undefined}
                  onValueChange={(v) => update({ type: v })}
                >
                  <SelectTrigger
                    id="etab-type"
                    aria-invalid={!!errors.type}
                    className="h-12 w-full rounded-[10px]"
                  >
                    <SelectValue placeholder="Choisir un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_TYPE_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {providerTypes.find((t) => t.id === id)?.label ?? id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Commune" htmlFor="etab-commune" error={errors.commune}>
                <Select
                  value={data.commune || undefined}
                  onValueChange={(v) => update({ commune: v })}
                >
                  <SelectTrigger
                    id="etab-commune"
                    aria-invalid={!!errors.commune}
                    className="h-12 w-full rounded-[10px]"
                  >
                    <SelectValue placeholder="Choisir une commune" />
                  </SelectTrigger>
                  <SelectContent>
                    {communeList.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Quartier" htmlFor="etab-quartier" error={errors.quartier}>
                <Input
                  id="etab-quartier"
                  value={data.quartier}
                  onChange={(e) => update({ quartier: e.target.value })}
                  placeholder="Ex. Hamdallaye ACI 2000"
                  aria-invalid={!!errors.quartier}
                  className="h-12 rounded-[10px]"
                />
              </Field>

              <Field label="Téléphone de l’établissement" htmlFor="etab-phone" error={errors.phone}>
                <PhoneInput
                  id="etab-phone"
                  value={data.phone}
                  onChange={(raw) => update({ phone: raw })}
                  error={errors.phone}
                  aria-invalid={!!errors.phone}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom du responsable" htmlFor="resp-name" error={errors.contactName}>
                <Input
                  id="resp-name"
                  value={data.contactName}
                  onChange={(e) => update({ contactName: e.target.value })}
                  placeholder="Nom et prénom"
                  aria-invalid={!!errors.contactName}
                  className="h-12 rounded-[10px]"
                />
              </Field>

              <Field label="Fonction" htmlFor="resp-role" error={errors.contactRole}>
                <Input
                  id="resp-role"
                  value={data.contactRole}
                  onChange={(e) => update({ contactRole: e.target.value })}
                  placeholder="Directeur(trice), gérant(e)…"
                  aria-invalid={!!errors.contactRole}
                  className="h-12 rounded-[10px]"
                />
              </Field>

              <Field label="Adresse e-mail professionnelle" htmlFor="resp-email" error={errors.email}>
                <Input
                  id="resp-email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update({ email: e.target.value })}
                  placeholder="contact@etablissement.ml"
                  aria-invalid={!!errors.email}
                  className="h-12 rounded-[10px]"
                />
              </Field>

              <Field label="Téléphone du responsable" htmlFor="resp-phone" error={errors.contactPhone}>
                <PhoneInput
                  id="resp-phone"
                  value={data.contactPhone}
                  onChange={(raw) => update({ contactPhone: raw })}
                  error={errors.contactPhone}
                  aria-invalid={!!errors.contactPhone}
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Field label="Services proposés" error={errors.services} hint="Sélectionnez tout ce que votre établissement couvre.">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Services proposés">
                  {SERVICE_PILLS.map((s) => {
                    const active = data.services.includes(s.key);
                    return (
                      <button
                        key={s.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          update({
                            services: active
                              ? data.services.filter((k) => k !== s.key)
                              : [...data.services, s.key],
                          })
                        }
                        className={cn(
                          "min-h-11 rounded-full border px-4 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                          active
                            ? "border-teal-900 bg-teal-900 text-sand-50"
                            : "border-sand-300 bg-white text-ink hover:border-teal-500/60 hover:bg-teal-50"
                        )}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Grille tarifaire (optionnel)" error={errors.tarifFile}>
                <FileDropzone
                  label="Grille tarifaire"
                  hint="Photo ou capture de votre grille — compressée automatiquement"
                  value={data.tarifFile}
                  onChange={(v) => update({ tarifFile: v })}
                />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Field
                label="Agrément ou autorisation d’exercer"
                error={errors.agrementFile}
                hint="Document officiel délivré par les autorités sanitaires."
              >
                <FileDropzone
                  label="Agrément d’exercice"
                  value={data.agrementFile}
                  onChange={(v) => update({ agrementFile: v })}
                />
              </Field>

              <Field
                label="NINA du responsable"
                error={errors.ninaFile}
                hint="Numéro d’identification nationale — recto uniquement."
              >
                <FileDropzone
                  label="Pièce NINA"
                  value={data.ninaFile}
                  onChange={(v) => update({ ninaFile: v })}
                />
              </Field>
            </div>
          )}

          {errors.form && (
            <p className="mt-5 rounded-[12px] bg-destructive/10 px-4 py-3 text-[13.5px] font-medium text-destructive" role="alert">
              {errors.form}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={goBack} className="min-h-12">
                <ArrowLeft className="size-4" aria-hidden />
                Retour
              </Button>
            ) : (
              <span aria-hidden />
            )}

            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} className="min-h-12">
                Continuer
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={submitting} className="min-h-12">
                {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {submitting ? "Envoi…" : "Envoyer ma candidature"}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Champ étiqueté avec erreur ──────────────────────────────────────── */

function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-[13px] font-semibold text-foreground">
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-[12.5px] text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-[13px] font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
