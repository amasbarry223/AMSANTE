import type { BillingFrequency, CoverageType, FormulaId } from "@/data/types";
import { frequencyDiscount, frequencyMultiplier, getFormula } from "@/data/products";

export interface QuoteInput {
  coverage: CoverageType;
  children: number;
  /** Âge de l'adhérent principal. */
  age: number;
  formula: FormulaId;
  frequency: BillingFrequency;
}

export interface QuoteResult {
  /** Prime mensuelle de référence (avant remise de fréquence). */
  monthly: number;
  /** Prime de la période choisie (mois / trimestre / année), remise incluse. */
  period: number;
  /** Remise appliquée (0 – 0.05). */
  discount: number;
  /** Prime mensuelle équivalente, remise incluse. */
  monthlyEquivalent: number;
  breakdown: {
    adults: number;
    children: number;
    adultLine: number;
    childLine: number;
    ageFactor: number;
  };
}

/** Facteur d'âge de l'adhérent principal (mock, pur). */
export function ageFactor(age: number): number {
  if (age < 30) return 1.0;
  if (age < 45) return 1.08;
  if (age < 60) return 1.22;
  return 1.45;
}

/** Nombre d'adultes couverts selon le type. */
export function adultCount(coverage: CoverageType): number {
  return coverage === "seul" ? 1 : 2;
}

/** Arrondi à la centaine supérieure. */
function round100(n: number): number {
  return Math.ceil(n / 100) * 100;
}

/**
 * Moteur de calcul de prime — fonction pure, sans effet de bord.
 * Formule mock :
 *   prime = (adultes × base × facteur Âge + enfants × tarifEnfant) × (1 − remise)
 * Le 2e adulte est décompté à 85 % de la base.
 */
export function quote(input: QuoteInput): QuoteResult {
  const { coverage, children, age, formula, frequency } = input;
  const f = getFormula(formula);
  const adults = adultCount(coverage);
  const factor = ageFactor(age);

  const secondAdultFactor = coverage === "couple" || coverage === "famille" ? 0.85 : 0;
  const adultLine = round100(
    adults === 1 ? f.adultMonthly * factor : f.adultMonthly * factor + f.adultMonthly * 0.85
  );
  const childLine = round100(children * f.childMonthly);
  const raw = adultLine + childLine;
  const discount = frequencyDiscount[frequency] ?? 0;
  // Remise appliquée puis arrondi UNE seule fois à la centaine supérieure ;
  // la période = mensuel × nombre de mois (aucun re-arrondi asymétrique).
  const monthly = round100(raw * (1 - discount));
  const period = monthly * (frequencyMultiplier[frequency] ?? 1);

  return {
    monthly,
    period,
    discount,
    monthlyEquivalent: monthly,
    breakdown: { adults, children, adultLine, childLine, ageFactor: factor },
  };
}

/**
 * Prime annuelle indicative pour un groupe (devis entreprise, fourchette mock) :
 * borne basse ≈ base annuelle avec 1 mois offert (×11), borne haute intégrant
 * la dégressivité groupe et les ayants droit (×13,5). Estimation indicative
 * uniquement — la prime ferme est établie par le conseiller.
 */
export function groupEstimate(employeeCount: number, dependents: number, formula: FormulaId) {
  const f = getFormula(formula);
  const total = employeeCount + dependents;
  const low = round100(total * f.adultMonthly * 11); // ≈ 1 mois offert sur l'année
  const high = round100(total * f.adultMonthly * 13.5);
  return { low, high, total };
}
