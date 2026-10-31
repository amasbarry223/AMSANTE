import type { FaqItem } from "./types";
import { frequencyDiscount } from "./products";

/** Remises dérivées de la source unique (products.ts) — jamais codées en dur. */
const REMISE_TRIM = Math.round(frequencyDiscount.trimestriel * 100);
const REMISE_ANNUEL = Math.round(frequencyDiscount.annuel * 100);

/** FAQ AMSANTÉ — données mock rédigées (aucun lorem ipsum). */
export const faq: FaqItem[] = [
  {
    id: "f1",
    category: "Souscription",
    question: "Combien de temps prend la souscription ?",
    answer:
      "Moins de 5 minutes si vous avez vos informations sous la main. Vous choisissez votre formule, vous ajoutez les personnes à assurer, vous payez en Mobile Money — et votre carte d'assuré digitale est disponible immédiatement.",
  },
  {
    id: "f2",
    category: "Souscription",
    question: "Quels documents dois-je fournir ?",
    answer:
      "Une photo d'identité (type passeport) de chaque bénéficiaire et une pièce d'identité (NINA ou équivalent). Tout se fait depuis votre téléphone : vous photographiez, on compresse et on chiffre.",
  },
  {
    id: "f3",
    category: "Souscription",
    question: "Puis-je assurer ma famille entière ?",
    answer:
      "Oui. Vous pouvez assurer votre conjoint·e et jusqu'à 6 enfants sur un même contrat. Chaque membre reçoit sa propre carte d'assuré digitale avec QR code.",
  },
  {
    id: "f4",
    category: "Carte & compte",
    question: "Comment fonctionne la carte d'assuré digitale ?",
    answer:
      "Votre carte vit dans votre espace AMSANTÉ et fonctionne avec un QR code unique. À l'accueil du prestataire, on le scanne : vos droits s'affichent instantanément, sans papier et sans appel téléphonique.",
  },
  {
    id: "f5",
    category: "Carte & compte",
    question: "Que se passe-t-il si je perds mon téléphone ?",
    answer:
      "Aucun souci : votre carte est liée à votre compte, pas à votre téléphone. Connectez-vous depuis n'importe quel appareil, ou présentez votre code d'assuré en pharmacie partenaire.",
  },
  {
    id: "f6",
    category: "Soins & tiers payant",
    question: "Qu'est-ce que le tiers payant ?",
    answer:
      "C'est le fait de ne rien avancer aux caisses. Chez les prestataires conventionnés AMSANTÉ, la part couverte par votre formule est réglée directement entre AMSANTÉ et l'établissement. Vous ne payez que le reste à charge, s'il y en a un.",
  },
  {
    id: "f7",
    category: "Soins & tiers payant",
    question: "Comment trouver un prestataire conventionné ?",
    answer:
      "La page « Prestataires » liste toutes les structures conventionnées à Bamako et à Kati, avec filtres par type, commune et disponibilité. Chaque fiche indique les services couverts et l'itinéraire.",
  },
  {
    id: "f8",
    category: "Soins & tiers payant",
    question: "Y a-t-il un délai de carence ?",
    answer:
      "Oui : 10 jours entre la date de souscription et le premier soin remboursé (30 jours pour la maternité). En cas d'urgence vitale, la prise en charge est immédiate.",
  },
  {
    id: "f9",
    category: "Remboursements",
    question: "Comment sont versés les remboursements ?",
    answer:
      "Directement sur votre Mobile Money : Orange Money, Moov Africa Money ou Wave. Vous recevez une notification dès le versement, en général sous 72 heures après validation du dossier.",
  },
  {
    id: "f10",
    category: "Remboursements",
    question: "Comment déclarer un soin non couvert par le tiers payant ?",
    answer:
      "Depuis votre espace, prenez la facture en photo et soumettez votre demande de remboursement. Le suivi se fait en temps réel : reçu, en analyse, validé, payé.",
  },
  {
    id: "f11",
    category: "Paiement",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Orange Money, Moov Africa Money et Wave. Le paiement est sécurisé et vous recevez un reçu digital immédiatement. Aucun frais caché : la prime affichée est la prime payée.",
  },
  {
    id: "f12",
    category: "Paiement",
    question: "Puis-je payer annuellement avec une remise ?",
    answer:
      `Oui : −${REMISE_TRIM} % en paiement trimestriel et −${REMISE_ANNUEL} % en paiement annuel, appliqués automatiquement dans le simulateur et le tunnel de souscription.`,
  },
  {
    id: "f13",
    category: "Entreprises",
    question: "Comment assurer les salariés de mon entreprise ?",
    answer:
      "Remplissez la demande de devis groupe (2 minutes) : un conseiller vous rappelle sous 24 h ouvrées avec une estimation sur mesure selon votre effectif et vos besoins.",
  },
  {
    id: "f14",
    category: "Entreprises",
    question: "Les ayants droit des salariés sont-ils couverts ?",
    answer:
      "Oui, chaque salarié peut déclarer ses ayants droit (conjoint·e et enfants). La gestion des entrées et sorties se fait depuis l'espace entreprise, en quelques clics.",
  },
];

export const faqCategories = [
  "Souscription",
  "Carte & compte",
  "Soins & tiers payant",
  "Remboursements",
  "Paiement",
  "Entreprises",
] as const;

export const homeFaqIds = ["f1", "f6", "f9", "f11", "f4", "f8"];
