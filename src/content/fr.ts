/** Dictionnaire centralisé des textes AMSANTÉ (fr) — prêt pour i18n (bambara plus tard). */
export const fr = {
  brand: {
    name: "AMSANTÉ",
    baseline: "Le soin, sans papier",
    legal:
      "AMSANTÉ est une plateforme opérée par un cabinet de courtage d'assurance agréé — {/* TODO: n° d'agrément à confirmer */} Agrément n° XXXX-XXXX. Les garanties sont souscrites auprès de compagnies partenaires.",
  },
  nav: {
    assurance: "Assurance santé",
    entreprises: "Entreprises",
    prestataires: "Prestataires",
    comment: "Comment ça marche",
    cabinets: "Cabinets",
    login: "Se connecter",
    cta: "Simuler ma prime",
  },
  hero: {
    titleLines: ["Votre santé, couverte.", "Sans papier,", "sans attente."],
    subtitle:
      "Souscrivez en 5 minutes, présentez votre carte digitale chez le médecin, soyez remboursé sur votre Mobile Money.",
    primaryCta: "Simuler ma prime",
    secondaryCta: "Je suis une entreprise",
    reinsurance: [
      "Remboursé en Mobile Money",
      "Carte digitale immédiate",
      "Réseau de soins à Bamako",
    ],
  },
  dock: {
    simuler: "Simuler",
    prestataire: "Trouver un prestataire",
    whatsapp: "WhatsApp",
  },
  footer: {
    tagline:
      "L'assurance santé 100 % digitale : souscription en ligne, tiers payant chez les prestataires conventionnés, remboursements Mobile Money.",
    columns: {
      produit: "Produit",
      parcours: "Parcours",
      entreprise: "Entreprise",
      aide: "Aide & contact",
    },
    useful: [
      { label: "Service client", value: "+223 80 00 11 22" },
      { label: "Urgences 24 h/24", value: "+223 80 00 33 44" },
      { label: "WhatsApp", value: "+223 76 00 55 66" },
    ],
  },
  connexion: {
    profiles: [
      { id: "assure", title: "Assuré", description: "Ma carte, mes remboursements, mes proches." },
      { id: "entreprise", title: "Entreprise", description: "Salariés, contrats et factures groupe." },
      { id: "prestataire", title: "Prestataire", description: "Tiers payant, patients et versements." },
      { id: "cabinet", title: "Cabinet", description: "Portefeuille, sinistres et commissions." },
    ],
  },
} as const;
