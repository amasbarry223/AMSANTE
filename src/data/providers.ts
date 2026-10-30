import type { Provider, ProviderType } from "./types";

/**
 * Annuaire des prestataires conventionnés — données mock.
 * TODO: remplacer par l'annuaire réel (API) — les coordonnées x/y sont
 * exprimées en pourcentage sur la carte SVG stylisée de Bamako.
 */
export const providers: Provider[] = [
  { id: "p01", name: "Clinique Pasteur du Fleuve", type: "clinique", commune: "Commune IV", quartier: "Hamdallaye", address: "Rue 224, Hamdallaye ACI 2000", phone: "+223 20 29 10 10", hours: "Lun–Sam · 07h30–20h00", open24: false, x: 22, y: 46, services: ["consultation", "hospitalisation", "analyses", "imagerie"] },
  { id: "p02", name: "Polyclinique Alpha 2000", type: "clinique", commune: "Commune IV", quartier: "Lafiabougou", address: "Route de Ségou, Lafiabougou", phone: "+223 20 22 44 88", hours: "24 h/24 · 7 j/7", open24: true, x: 14, y: 38, services: ["consultation", "hospitalisation", "maternite", "analyses", "imagerie"] },
  { id: "p03", name: "Hôpital Gabriel Touré", type: "hopital", commune: "Commune II", quartier: "Centre commercial", address: "Avenue de la Liberté", phone: "+223 20 22 27 12", hours: "24 h/24 · 7 j/7", open24: true, x: 38, y: 30, services: ["consultation", "hospitalisation", "maternite", "analyses", "imagerie"] },
  { id: "p04", name: "CHU Point G", type: "hopital", commune: "Commune II", quartier: "Point G", address: "Colline du Point G", phone: "+223 20 22 50 02", hours: "24 h/24 · 7 j/7", open24: true, x: 33, y: 18, services: ["consultation", "hospitalisation", "analyses", "imagerie", "dentaire"] },
  { id: "p05", name: "Clinique Bagadadji", type: "clinique", commune: "Commune III", quartier: "Bagadadji", address: "Rue 118, Bagadadji", phone: "+223 20 23 51 77", hours: "Lun–Dim · 08h00–21h00", open24: false, x: 36, y: 40, services: ["consultation", "maternite", "pharmacie"] },
  { id: "p06", name: "Pharmacie du Fleuve", type: "pharmacie", commune: "Commune IV", quartier: "Korofina Nord", address: "Av. de l'OUA, Korofina", phone: "+223 20 28 33 21", hours: "Lun–Sam · 08h00–22h00", open24: false, x: 30, y: 24, services: ["pharmacie"] },
  { id: "p07", name: "Pharmacie Kalaban Coura", type: "pharmacie", commune: "Commune V", quartier: "Kalaban Coura", address: "Rue 380, Kalaban Coura", phone: "+223 20 27 09 44", hours: "24 h/24 · 7 j/7", open24: true, x: 47, y: 62, services: ["pharmacie"] },
  { id: "p08", name: "Laboratoire BIO 24", type: "laboratoire", commune: "Commune V", quartier: "Badalabougou", address: "Quartier Badalabougou, r. 1", phone: "+223 44 90 12 34", hours: "Lun–Sam · 07h00–19h00", open24: false, x: 45, y: 52, services: ["analyses"] },
  { id: "p09", name: "Centre d'imagerie Niamakoro", type: "imagerie", commune: "Commune VI", quartier: "Niamakoro", address: "Carrefour Niamakoro", phone: "+223 66 77 21 09", hours: "Lun–Sam · 08h00–18h00", open24: false, x: 62, y: 66, services: ["imagerie"] },
  { id: "p10", name: "Clinique Kabala", type: "clinique", commune: "Commune VI", quartier: "Kabala", address: "Route de Sébénikoro, Kabala", phone: "+223 20 71 40 40", hours: "24 h/24 · 7 j/7", open24: true, x: 26, y: 72, services: ["consultation", "hospitalisation", "maternite", "analyses", "optique"] },
  { id: "p11", name: "Cabinet dentaire Sourire+", type: "dentaire", commune: "Commune II", quartier: "Quinzambougou", address: "Rue 390, Quinzambougou", phone: "+223 76 20 33 20", hours: "Lun–Ven · 08h30–17h30", open24: false, x: 42, y: 34, services: ["dentaire"] },
  { id: "p12", name: "Optique Vision Bamako", type: "optique", commune: "Commune III", quartier: "Hamdallaye", address: "ACI 2000, rue 380", phone: "+223 20 29 82 11", hours: "Lun–Sam · 09h00–19h00", open24: false, x: 20, y: 50, services: ["optique"] },
  { id: "p13", name: "Clinique Sotuba Anw", type: "clinique", commune: "Commune V", quartier: "Sotuba", address: "Rive droite, Sotuba AC", phone: "+223 20 60 55 66", hours: "Lun–Sam · 08h00–20h00", open24: false, x: 58, y: 44, services: ["consultation", "hospitalisation", "analyses"] },
  { id: "p14", name: "Hôpital de Kati", type: "hopital", commune: "Kati", quartier: "Centre-ville", address: "Avenue de l'UMOA, Kati", phone: "+223 20 43 01 25", hours: "24 h/24 · 7 j/7", open24: true, x: 10, y: 12, services: ["consultation", "hospitalisation", "maternite", "analyses", "imagerie"] },
  { id: "p15", name: "Pharmacie Magnambougou", type: "pharmacie", commune: "Commune VI", quartier: "Magnambougou", address: "Rue 760, Magnambougou", phone: "+223 20 90 45 67", hours: "Lun–Dim · 08h00–23h00", open24: false, x: 68, y: 58, services: ["pharmacie"] },
  { id: "p16", name: "Laboratoire Lafiabougou Plus", type: "laboratoire", commune: "Commune IV", quartier: "Lafiabougou", address: "Rue 8, Lafiabougou", phone: "+223 20 22 60 41", hours: "Lun–Sam · 07h30–18h30", open24: false, x: 16, y: 42, services: ["analyses", "imagerie"] },
  { id: "p17", name: "Centre Médical Yirimadio", type: "clinique", commune: "Commune VI", quartier: "Yirimadio", address: "Route de l'aéroport, Yirimadio", phone: "+223 20 84 11 90", hours: "Lun–Dim · 07h00–22h00", open24: false, x: 78, y: 70, services: ["consultation", "maternite", "pharmacie", "analyses"] },
  { id: "p18", name: "Optique Djélibougou", type: "optique", commune: "Commune II", quartier: "Djélibougou", address: "Rue 24, Djélibougou", phone: "+223 65 31 08 47", hours: "Lun–Sam · 08h30–18h30", open24: false, x: 36, y: 22, services: ["optique"] },
];

export const providerTypes: { id: ProviderType | "tous"; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "clinique", label: "Cliniques" },
  { id: "hopital", label: "Hôpitaux" },
  { id: "pharmacie", label: "Pharmacies" },
  { id: "laboratoire", label: "Laboratoires" },
  { id: "imagerie", label: "Imagerie" },
  { id: "dentaire", label: "Dentaire" },
  { id: "optique", label: "Optique" },
];

/** TODO: données réelles de conventionnement. */
