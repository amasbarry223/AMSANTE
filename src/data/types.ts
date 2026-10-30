/** Types partagés de la couche données AMSANTÉ (backend branché plus tard). */

export type FormulaId = "essentiel" | "confort" | "premium";
export type BillingFrequency = "mensuel" | "trimestriel" | "annuel";
export type CoverageType = "seul" | "couple" | "famille";

export type GuaranteeKey =
  | "consultation"
  | "pharmacie"
  | "hospitalisation"
  | "maternite"
  | "analyses"
  | "imagerie"
  | "dentaire"
  | "optique"
  | "evacuation";

export interface Formula {
  id: FormulaId;
  name: string;
  tagline: string;
  description: string;
  /** Prime de base mensuelle pour l'adhérent principal (mock). */
  adultMonthly: number;
  /** Prime mensuelle par enfant (mock). */
  childMonthly: number;
  highlights: string[];
  popular?: boolean;
}

export interface Guarantee {
  key: GuaranteeKey;
  label: string;
  icon: string;
  description: string;
  /** Taux de couverture et plafond annuel par formule (mock). */
  coverage: Record<FormulaId, { taux: number; plafond: number }>;
}

export type ProviderType =
  | "clinique"
  | "hopital"
  | "pharmacie"
  | "laboratoire"
  | "imagerie"
  | "dentaire"
  | "optique";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  commune: string;
  quartier: string;
  address: string;
  phone: string;
  hours: string;
  open24: boolean;
  /** Position sur la carte SVG stylisée de Bamako (0–100). */
  x: number;
  y: number;
  services: GuaranteeKey[];
  /** TODO: remplacer par de vraies données de conventionnement. */
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export type MobileMoneyOperator = "orange_money" | "moov_money" | "wave";

export type PaymentStatus = "en_attente" | "succes" | "echoue" | "expire";
