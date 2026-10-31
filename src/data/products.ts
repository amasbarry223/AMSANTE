import type { BillingFrequency, Formula, FormulaId } from "./types";

/**
 * Formules AMSANTÉ — données mock.
 * TODO: brancher sur l'API produits quand le backend sera prêt.
 */
export const products: Formula[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    tagline: "Le nécessaire, bien couvert",
    description:
      "Les soins du quotidien : consultations, médicaments, analyses et hospitalisations. L'entrée dans la protection AMSANTÉ, sans superflu.",
    adultMonthly: 7500,
    childMonthly: 3200,
    highlights: [
      "Consultations CFH et cliniques partenaires",
      "Pharmacie remboursée à 70 %",
      "Hospitalisation jusqu'à 3 000 000 FCFA/an",
    ],
  },
  {
    id: "confort",
    name: "Confort",
    tagline: "Le meilleur équilibre",
    description:
      "Toutes les garanties Essentiel, plus la maternité, le dentaire et l'optique. La formule choisie par 7 familles sur 10.",
    adultMonthly: 11500,
    childMonthly: 4800,
    highlights: [
      "Maternité suivie de A à Z",
      "Dentaire et optique inclus",
      "Plafonds au moins doublés vs Essentiel",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Sérénité maximale",
    description:
      "Couverture étendue, plafonds élevés et évacuation sanitaire incluse. Pour ceux qui veulent la tranquillité absolue.",
    adultMonthly: 18500,
    childMonthly: 7900,
    highlights: [
      "Évacuation sanitaire régionale",
      "Chambre individuelle en clinique",
      "Plafonds jusqu'à 15 000 000 FCFA/an",
    ],
  },
];

export function getFormula(id: FormulaId): Formula {
  const f = products.find((p) => p.id === id);
  if (!f) throw new Error(`Formule inconnue : ${id}`);
  return f;
}

export const frequencyDiscount: Record<BillingFrequency, number> = {
  mensuel: 0,
  trimestriel: 0.02,
  annuel: 0.05,
};

export const frequencyLabel: Record<BillingFrequency, string> = {
  mensuel: "par mois",
  trimestriel: "par trimestre",
  annuel: "par an",
};

/** Multiplicateur de fréquence (prime de la période). */
export const frequencyMultiplier: Record<BillingFrequency, number> = {
  mensuel: 1,
  trimestriel: 3,
  annuel: 12,
};
