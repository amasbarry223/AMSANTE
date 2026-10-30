"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BillingFrequency, CoverageType, FormulaId } from "@/data/types";

export interface Beneficiary {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  relation: "conjoint" | "enfant";
}

export interface SubscriptionState {
  step: number;
  coverage: CoverageType;
  formula: FormulaId;
  frequency: BillingFrequency;
  age: number;
  childrenCount: number;
  principal: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    commune: string;
    quartier: string;
    idNumber: string;
  };
  beneficiaries: Beneficiary[];
  documents: Record<string, string>;
  consents: { cgu: boolean; data: boolean };
  payment: { operator: string | null; phone: string; paymentId: string | null };
  completedAt: string | null;
  reference: string | null;

  setStep: (step: number) => void;
  setCoverage: (c: CoverageType) => void;
  setFormula: (f: FormulaId) => void;
  setFrequency: (f: BillingFrequency) => void;
  setAge: (a: number) => void;
  setChildrenCount: (n: number) => void;
  setPrincipal: (p: Partial<SubscriptionState["principal"]>) => void;
  addBeneficiary: (b: Beneficiary) => void;
  removeBeneficiary: (id: string) => void;
  updateBeneficiary: (id: string, patch: Partial<Beneficiary>) => void;
  setDocument: (key: string, dataUrl: string) => void;
  setConsents: (c: Partial<SubscriptionState["consents"]>) => void;
  setPayment: (p: Partial<SubscriptionState["payment"]>) => void;
  markCompleted: (reference: string) => void;
  reset: () => void;
}

const initial = {
  step: 0,
  coverage: "seul" as CoverageType,
  formula: "confort" as FormulaId,
  frequency: "mensuel" as BillingFrequency,
  age: 32,
  childrenCount: 2,
  principal: { firstName: "", lastName: "", phone: "", email: "", commune: "", quartier: "", idNumber: "" },
  beneficiaries: [] as Beneficiary[],
  documents: {} as Record<string, string>,
  consents: { cgu: false, data: false },
  payment: { operator: null, phone: "", paymentId: null },
  completedAt: null,
  reference: null,
};

export const useSubscription = create<SubscriptionState>()(
  persist(
    (set) => ({
      ...initial,
      setStep: (step) => set({ step }),
      setCoverage: (coverage) =>
        set((s) => {
          const kept = s.beneficiaries.filter((b) =>
            coverage === "seul" ? false : b.relation === "conjoint" || coverage === "famille"
          );
          // Purge des documents des bénéficiaires retirés (pas de pièce orpheline).
          const documents = { ...s.documents };
          s.beneficiaries
            .filter((b) => !kept.includes(b))
            .forEach((b) => delete documents[`doc-${b.id}`]);
          return { coverage, beneficiaries: kept, documents };
        }),
      setFormula: (formula) => set({ formula }),
      setFrequency: (frequency) => set({ frequency }),
      setAge: (age) => set({ age }),
      setChildrenCount: (childrenCount) => set({ childrenCount }),
      setPrincipal: (p) => set((s) => ({ principal: { ...s.principal, ...p } })),
      addBeneficiary: (b) => set((s) => ({ beneficiaries: [...s.beneficiaries, b] })),
      removeBeneficiary: (id) =>
        set((s) => {
          // Purge du document lié (pas de pièce orpheline persistée).
          const documents = { ...s.documents };
          delete documents[`doc-${id}`];
          return { beneficiaries: s.beneficiaries.filter((b) => b.id !== id), documents };
        }),
      updateBeneficiary: (id, patch) =>
        set((s) => ({
          beneficiaries: s.beneficiaries.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      setDocument: (key, dataUrl) => set((s) => ({ documents: { ...s.documents, [key]: dataUrl } })),
      setConsents: (c) => set((s) => ({ consents: { ...s.consents, ...c } })),
      setPayment: (p) => set((s) => ({ payment: { ...s.payment, ...p } })),
      markCompleted: (reference) =>
        set({ completedAt: new Date().toISOString(), reference }),
      reset: () => set({ ...initial }),
    }),
    { name: "amsante-subscription" }
  )
);

/** Reprise : souscription entamée mais non finalisée. */
export function hasDraft(s: SubscriptionState): boolean {
  if (s.completedAt) return false;
  return s.step > 0 || s.principal.firstName !== "" || s.beneficiaries.length > 0;
}
