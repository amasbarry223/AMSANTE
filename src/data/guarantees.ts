import type { Guarantee } from "./types";

/** Garanties AMSANTÉ — taux et plafonds par formule (mock). */
export const guarantees: Guarantee[] = [
  {
    key: "consultation",
    label: "Consultation",
    icon: "Stethoscope",
    description: "Médecin généraliste et spécialistes chez les prestataires conventionnés.",
    coverage: {
      essentiel: { taux: 80, plafond: 300000 },
      confort: { taux: 90, plafond: 600000 },
      premium: { taux: 100, plafond: 1200000 },
    },
  },
  {
    key: "pharmacie",
    label: "Pharmacie",
    icon: "Pill",
    description: "Médicaments prescrits, délivrés en pharmacie conventionnée, sans avance.",
    coverage: {
      essentiel: { taux: 70, plafond: 400000 },
      confort: { taux: 80, plafond: 900000 },
      premium: { taux: 90, plafond: 2000000 },
    },
  },
  {
    key: "hospitalisation",
    label: "Hospitalisation",
    icon: "BedDouble",
    description: "Frais de séjour, actes chirurgicaux et soins liés à l'hospitalisation.",
    coverage: {
      essentiel: { taux: 80, plafond: 3000000 },
      confort: { taux: 90, plafond: 8000000 },
      premium: { taux: 100, plafond: 15000000 },
    },
  },
  {
    key: "maternite",
    label: "Maternité",
    icon: "Baby",
    description: "Suivi de grossesse, accouchement et soins du nouveau-né.",
    coverage: {
      essentiel: { taux: 0, plafond: 0 },
      confort: { taux: 90, plafond: 1500000 },
      premium: { taux: 100, plafond: 3500000 },
    },
  },
  {
    key: "analyses",
    label: "Analyses",
    icon: "FlaskConical",
    description: "Laboratoires d'analyses médicales conventionnés, résultats en ligne.",
    coverage: {
      essentiel: { taux: 80, plafond: 300000 },
      confort: { taux: 90, plafond: 700000 },
      premium: { taux: 100, plafond: 1500000 },
    },
  },
  {
    key: "imagerie",
    label: "Imagerie",
    icon: "Scan",
    description: "Radiographie, échographie, scanner et IRM sur prescription.",
    coverage: {
      essentiel: { taux: 70, plafond: 400000 },
      confort: { taux: 85, plafond: 1000000 },
      premium: { taux: 100, plafond: 2500000 },
    },
  },
  {
    key: "dentaire",
    label: "Dentaire",
    icon: "Smile",
    description: "Soins dentaires, détartrage, prothèses chez les dentistes partenaires.",
    coverage: {
      essentiel: { taux: 0, plafond: 0 },
      confort: { taux: 70, plafond: 400000 },
      premium: { taux: 90, plafond: 900000 },
    },
  },
  {
    key: "optique",
    label: "Optique",
    icon: "Glasses",
    description: "Lunettes et lentilles chez les opticiens conventionnés.",
    coverage: {
      essentiel: { taux: 0, plafond: 0 },
      confort: { taux: 70, plafond: 250000 },
      premium: { taux: 90, plafond: 500000 },
    },
  },
  {
    key: "evacuation",
    label: "Évacuation sanitaire",
    icon: "Plane",
    description: "Organisation et prise en charge d'une évacuation vers une structure régionale.",
    coverage: {
      essentiel: { taux: 0, plafond: 0 },
      confort: { taux: 0, plafond: 0 },
      premium: { taux: 100, plafond: 10000000 },
    },
  },
];

export const communeList = [
  "Commune I",
  "Commune II",
  "Commune III",
  "Commune IV",
  "Commune V",
  "Commune VI",
  "Kati",
] as const;
