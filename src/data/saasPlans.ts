/**
 * Grille tarifaire SaaS AMSANTÉ (page /cabinets) — données mock.
 * TODO: grille à confirmer par l'équipe commerciale (valeurs de travail).
 * NB : les noms de plans SaaS sont volontairement distincts des formules
 * d'assurance (Essentiel/Confort/Premium) pour éviter toute confusion.
 */
export type SaasPlan = {
  id: "bureau" | "cabinet" | "reseau";
  name: string;
  /** Prime mensuelle en FCFA (null = sur devis). */
  monthly: number | null;
  description: string;
  features: string[];
  popular: boolean;
  onQuote: boolean;
};

export const saasPlans: SaasPlan[] = [
  {
    id: "bureau",
    name: "Bureau",
    monthly: 75000,
    description: "Pour digitaliser le quotidien : assurés, contrats et sinistres.",
    features: [
      "Gestion des assurés et ayants droit",
      "Suivi des sinistres en temps réel",
      "Scan des cartes digitales (QR)",
      "1 poste de travail inclus",
    ],
    popular: false,
    onQuote: false,
  },
  {
    id: "cabinet",
    name: "Cabinet",
    monthly: 200000,
    description: "Pour les cabinets qui encaissent et pilotent la croissance.",
    features: [
      "Tout Bureau, plus :",
      "Encaissement Mobile Money intégré",
      "Commissions automatiques (apporteurs)",
      "Reporting exportable (CSV, PDF)",
      "Postes illimités + support prioritaire",
    ],
    popular: true,
    onQuote: false,
  },
  {
    id: "reseau",
    name: "Réseau",
    monthly: null,
    description: "Pour les groupes multi-sites et les intégrations sur mesure.",
    features: [
      "Tout Cabinet, plus :",
      "Intégration à votre système existant (API)",
      "Multi-cabinets et rôles avancés",
      "Accompagnement dédié",
    ],
    popular: false,
    onQuote: true,
  },
];

/** Prix annuel = mensuel × 10 (2 mois offerts). */
export const SAAS_ANNUAL_FACTOR = 10;
