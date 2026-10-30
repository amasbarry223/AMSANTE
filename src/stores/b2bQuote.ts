"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormulaId } from "@/data/types";

export interface B2BQuoteState {
  step: number;
  company: string;
  sector: string;
  city: string;
  rccm: string;
  employees: number;
  dependents: number;
  formula: FormulaId;
  priorities: string[];
  budget: number;
  contactName: string;
  contactRole: string;
  phone: string;
  email: string;
  slot: string;
  setStep: (s: number) => void;
  patch: (p: Partial<Omit<B2BQuoteState, "setStep" | "patch" | "reset">>) => void;
  reset: () => void;
}

export const useB2BQuote = create<B2BQuoteState>()(
  persist(
    (set) => ({
      step: 0,
      company: "",
      sector: "",
      city: "Bamako",
      rccm: "",
      employees: 25,
      dependents: 15,
      formula: "confort",
      priorities: [],
      budget: 10000,
      contactName: "",
      contactRole: "",
      phone: "",
      email: "",
      slot: "",
      setStep: (step) => set({ step }),
      patch: (p) => set(p),
      reset: () =>
        set({
          step: 0,
          company: "",
          sector: "",
          city: "Bamako",
          rccm: "",
          employees: 25,
          dependents: 15,
          formula: "confort",
          priorities: [],
          budget: 10000,
          contactName: "",
          contactRole: "",
          phone: "",
          email: "",
          slot: "",
        }),
    }),
    { name: "amsante-b2b-quote" }
  )
);
