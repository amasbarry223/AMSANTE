"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration, ease } from "@/lib/motion/tokens";
import { quote } from "@/lib/pricing";
import type { Beneficiary } from "@/stores/subscription";
import { useSubscription } from "@/stores/subscription";
import type { SubscriptionPayload } from "@/lib/api";
import type { CoverageType, MobileMoneyOperator } from "@/data/types";

/* ── Utilitaires ────────────────────────────────────────────────────── */

/** Identifiant stable pour les cartes bénéficiaires. */
export function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Masque de saisie JJ/MM/AAAA à partir de chiffres bruts. */
export function formatBirthDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join("/");
}

/** Date réelle, passée, cohérente. */
export function isValidBirthDate(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [d, m, y] = value.split("/").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return false;
  const date = new Date(y, m - 1, d);
  if (date.getDate() !== d || date.getMonth() !== m - 1) return false;
  return date.getTime() <= Date.now();
}

export function newBeneficiary(relation: Beneficiary["relation"]): Beneficiary {
  return { id: uid(), firstName: "", lastName: "", birthDate: "", relation };
}

export const relationLabel: Record<Beneficiary["relation"], string> = {
  conjoint: "Conjoint·e",
  enfant: "Enfant",
};

export const coverageLabel: Record<CoverageType, string> = {
  seul: "Seul·e",
  couple: "Couple",
  famille: "Famille",
};

/** ×1,08 — format français du facteur d'âge. */
export function ageFactorLabel(f: number): string {
  return `×${f.toFixed(2).replace(".", ",")}`;
}

/** Compte à rebours mm:ss. */
export function mmss(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ── Clés de session ────────────────────────────────────────────────── */

/** Résultat createSubscription transmis à la page de confirmation. */
export const CONFIRM_SESSION_KEY = "amsante-confirmation";

/** Construit le payload de souscription depuis le store (montant recalculé). */
export function buildSubscriptionPayload(): SubscriptionPayload {
  const s = useSubscription.getState();
  const q = quote({
    coverage: s.coverage,
    children: s.coverage === "famille" ? s.childrenCount : 0,
    age: s.age,
    formula: s.formula,
    frequency: s.frequency,
  });
  return {
    coverage: s.coverage,
    formula: s.formula,
    frequency: s.frequency,
    children: s.coverage === "famille" ? s.childrenCount : 0,
    age: s.age,
    principal: {
      firstName: s.principal.firstName,
      lastName: s.principal.lastName,
      phone: s.principal.phone,
      email: s.principal.email.trim() === "" ? undefined : s.principal.email,
      commune: s.principal.commune,
      quartier: s.principal.quartier.trim() === "" ? undefined : s.principal.quartier,
      idNumber: s.principal.idNumber,
    },
    beneficiaries: s.beneficiaries.map((b) => ({
      firstName: b.firstName,
      lastName: b.lastName || s.principal.lastName,
      birthDate: b.birthDate,
      relation: b.relation,
    })),
    amount: q.period,
  };
}

/* ── Opérateurs Mobile Money ────────────────────────────────────────── */

export const MOBILE_MONEY_OPERATORS: {
  id: MobileMoneyOperator;
  name: string;
  hint: string;
  tileClass: string;
}[] = [
  { id: "orange_money", name: "Orange Money", hint: " USSD · #144#", tileClass: "bg-ochre-500 text-ink" },
  { id: "moov_money", name: "Moov Africa Money", hint: "USSD · #155#", tileClass: "bg-teal-700 text-white" },
  { id: "wave", name: "Wave", hint: "Application Wave", tileClass: "bg-sand-300 text-ink" },
];

/* ── Briques UI partagées des tunnels ───────────────────────────────── */

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-destructive">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}

export function StepTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-[22px] font-bold tracking-tight sm:text-[26px]">{title}</h2>
      {hint ? <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Carte blanche qui contient une étape de tunnel. */
export function StepCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[28px] border border-sand-200 bg-white p-5 shadow-soft sm:p-8", className)}>
      {children}
    </div>
  );
}

/** Contrôle segmenté à pilule glissante (couverture, fréquence…). */
export function Segmented<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
  className,
}: {
  name: string;
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex rounded-full bg-sand-100 p-1", className)}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className="relative min-h-11 flex-1 rounded-full px-2 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-500"
          >
            {active && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-full bg-teal-900"
                transition={{ duration: duration.fast, ease: ease.out }}
              />
            )}
            <span className={cn("relative", active ? "text-sand-50" : "text-muted-foreground")}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
