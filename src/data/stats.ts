/**
 * Chiffres clés AMSANTÉ — source unique partagée entre l'accueil (StatsTrust)
 * et la page entreprises. Valeurs mock cohérentes entre elles :
 * le total d'assurés inclut le portefeuille groupes.
 * TODO: remplacer par les chiffres réels du portefeuille.
 */
export const STATS = {
  /** Total d'assurés (B2C + B2B), familles incluses. */
  assureds: 12_700,
  /** Délai moyen de remboursement en heures. */
  reimbursementHours: 72,
  /** Part des soins réglés sans avance de frais (tiers payant), en %. */
  cashlessRate: 97,
  /** Entreprises accompagnées (portefeuille groupes). */
  companies: 120,
  /** Salariés et ayants droit couverts via les contrats groupes. */
  groupMembers: 8_500,
  /** Jours d'activation d'un dispositif groupe complet. */
  groupActivationDays: 5,
} as const;
