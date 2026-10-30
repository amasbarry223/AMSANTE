import { z } from "zod";
import { isValidMalianPhone } from "@/lib/utils/format";
import { isValidBirthDate } from "@/components/funnel/shared";
import type { FormulaId } from "@/data/types";
import { products } from "@/data/products";

/** Schémas zod par étape — messages humains, sans jargon d'assureur. */

const emailRe = /^[\w.+-]+@[\w-]+\.[\w.-]{2,}$/;
const emailCheck = (v: string) => v === "" || emailRe.test(v);
const emailMsg = "Cette adresse e-mail semble incomplète.";

export const FORMULA_IDS = products.map((p) => p.id) as FormulaId[];

/* ── Tunnel de souscription ─────────────────────────────────────────── */

export const beneficiarySchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom est requis (2 caractères au moins)."),
  birthDate: z
    .string()
    .refine(isValidBirthDate, "Cette date semble incorrecte — utilisez le format JJ/MM/AAAA."),
});

export const whoSchema = z.object({
  beneficiaries: z.array(beneficiarySchema),
  age: z
    .number()
    .min(18, "L'âge de l'adhérent doit être compris entre 18 et 70 ans.")
    .max(70, "L'âge de l'adhérent doit être compris entre 18 et 70 ans."),
});

export const infosSchema = z.object({
  firstName: z.string().trim().min(2, "Votre prénom est requis."),
  lastName: z.string().trim().min(2, "Votre nom est requis."),
  phone: z
    .string()
    .refine(isValidMalianPhone, "Ce numéro doit contenir 8 chiffres après +223."),
  email: z.string().trim().refine(emailCheck, emailMsg),
  commune: z.string().min(1, "Choisissez votre commune."),
  quartier: z.string().trim().min(2, "Indiquez votre quartier."),
  idNumber: z.string().trim().min(4, "Le numéro de votre pièce d'identité (NINA ou autre) est requis."),
});

/** Pièce du principal + photo d'identité de chaque bénéficiaire. */
export function docsOk(documents: Record<string, string>, beneficiaryIds: string[]): boolean {
  return Boolean(documents["doc-principal"]) && beneficiaryIds.every((id) => Boolean(documents[`doc-${id}`]));
}

export const summarySchema = z.object({
  cgu: z.boolean().refine((v) => v, "Vous devez accepter les conditions générales pour signer."),
  data: z
    .boolean()
    .refine((v) => v, "Vous devez autoriser le traitement de vos données pour signer."),
});

/* ── Devis entreprise ───────────────────────────────────────────────── */

export const B2B_SECTORS = [
  "Services",
  "BTP",
  "Commerce",
  "ONG/Association",
  "Administration",
  "Autre",
] as const;

export const B2B_SLOTS = [
  { id: "matin", label: "Le matin (8 h – 12 h)" },
  { id: "apres-midi", label: "L'après-midi (14 h – 18 h)" },
  { id: "nimporte", label: "N'importe quand" },
] as const;

export const companySchema = z.object({
  company: z.string().trim().min(2, "Le nom de l'entreprise est requis."),
  sector: z
    .string()
    .refine((v) => (B2B_SECTORS as readonly string[]).includes(v), "Choisissez un secteur d'activité."),
  city: z.string().trim().min(2, "Indiquez la ville du siège."),
  rccm: z.string(),
});

export const workforceSchema = z.object({
  employees: z
    .number()
    .min(5, "Le dispositif groupe démarre à 5 salariés.")
    .max(500, "Au-delà de 500 salariés, un conseiller construit l'offre avec vous."),
  dependents: z
    .number()
    .min(0, "Le nombre d'ayants droit ne peut pas être négatif.")
    .max(300, "Au-delà de 300 ayants droit, un conseiller construit l'offre avec vous."),
});

export const needsSchema = z.object({
  formula: z
    .string()
    .refine((v) => FORMULA_IDS.includes(v as FormulaId), "Choisissez une formule souhaitée."),
  priorities: z.array(z.string()).max(4, "4 garanties prioritaires maximum."),
  budget: z
    .number()
    .min(5000, "Le budget indicatif démarre à 5 000 FCFA par salarié.")
    .max(30000, "30 000 FCFA maximum par salarié."),
});

export const contactSchema = z.object({
  contactName: z.string().trim().min(2, "Votre nom est requis."),
  contactRole: z.string().trim().min(2, "Votre fonction est requise."),
  phone: z
    .string()
    .refine(isValidMalianPhone, "Ce numéro doit contenir 8 chiffres après +223."),
  email: z.string().trim().refine(emailRe.test.bind(emailRe), emailMsg),
  slot: z
    .string()
    .refine((v) => B2B_SLOTS.some((s) => s.id === v), "Choisissez un créneau de rappel."),
});

/* ── Helpers d'erreurs (typage structurel, tolérant zod 3 & 4) ──────── */

type IssueLike = { path: PropertyKey[]; message: string };

/** Erreurs indexées par chemin de champ : `beneficiaries.0.firstName`. */
export function fieldErrors(err: { issues: readonly IssueLike[] }): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.map(String).join(".");
    if (key && !(key in out)) out[key] = issue.message;
  }
  return out;
}
