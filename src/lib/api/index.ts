/**
 * Couche API AMSANTÉ — mode mock (backend branché plus tard).
 * Bascule via NEXT_PUBLIC_API_MODE=mock|live. En mock : latence simulée
 * 400–1200 ms et cas d'erreur déclenchables :
 *   - paiement refusé si le numéro payeur finit par « 0000 »
 *   - OTP invalide si le code saisi est « 000000 »
 *   - attestation invalide si le code ne correspond pas au format attendu
 */
import type {
  BillingFrequency,
  CoverageType,
  FormulaId,
  MobileMoneyOperator,
  PaymentStatus,
  Provider,
  ProviderType,
} from "@/data/types";
import { providers as providerData } from "@/data/providers";
import { products } from "@/data/products";
import { quote, groupEstimate, type QuoteInput, type QuoteResult } from "@/lib/pricing";

export const API_MODE = (process.env.NEXT_PUBLIC_API_MODE as "mock" | "live") ?? "mock";

const wait = (ms?: number) =>
  new Promise<void>((r) => setTimeout(r, ms ?? 400 + Math.random() * 800));

// ──────────────────────────────────────────────────────────── Produits
export async function getProducts() {
  await wait();
  return products;
}

export async function quoteApi(input: QuoteInput): Promise<QuoteResult> {
  await wait(300);
  return quote(input);
}

// ──────────────────────────────────────────────────────── Souscription
export interface SubscriptionPayload {
  coverage: CoverageType;
  formula: FormulaId;
  frequency: BillingFrequency;
  children: number;
  age: number;
  principal: { firstName: string; lastName: string; phone: string; email?: string; commune: string; quartier?: string; idNumber: string };
  beneficiaries: { firstName: string; lastName: string; birthDate: string; relation: string }[];
  amount: number;
}

export interface SubscriptionResult {
  reference: string;
  contractNumber: string;
  cardCode: string;
  validUntil: string;
  holderName: string;
  formulaName: string;
}

export async function createSubscription(payload: SubscriptionPayload): Promise<SubscriptionResult> {
  await wait(900);
  const year = new Date().getFullYear();
  const rand = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return {
    reference: `AMS-${year}-${rand()}${rand()}`,
    contractNumber: `CT-${year}-${Math.floor(100000 + Math.random() * 900000)}`,
    cardCode: `AMSA-${Math.floor(1000 + Math.random() * 9000)}-${rand()}`,
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    holderName: `${payload.principal.firstName} ${payload.principal.lastName}`.trim() || "Assuré AMSANTÉ",
    formulaName: products.find((p) => p.id === payload.formula)?.name ?? "Confort",
  };
}

// ──────────────────────────────────────────────────────────────── OTP
export async function requestOtp(phone: string): Promise<{ sent: true; expiresIn: 60 }> {
  await wait(500);
  if (!/^\d{8}$/.test(phone)) throw new Error("Numéro invalide");
  // En mock, tout code à 6 chiffres est accepté sauf 000000.
  return { sent: true, expiresIn: 60 };
}

export async function verifyOtp(phone: string, code: string): Promise<{ ok: true }> {
  await wait(500);
  if (code === "000000") throw new Error("Code invalide ou expiré. Vérifiez le SMS ou demandez un nouveau code.");
  if (!/^\d{6}$/.test(code)) throw new Error("Le code doit contenir 6 chiffres.");
  return { ok: true };
}

// ─────────────────────────────────────────────────────── Mobile Money
export interface PaymentInit {
  operator: MobileMoneyOperator;
  phone: string;
  amount: number;
}

export interface PaymentSession {
  paymentId: string;
  status: PaymentStatus;
}

export async function initMobileMoneyPayment(init: PaymentInit): Promise<PaymentSession> {
  await wait(600);
  const willFail = init.phone.replace(/\D/g, "").endsWith("0000");
  const paymentId = `pay_${Date.now().toString(36)}${willFail ? "_f" : ""}`;
  return { paymentId, status: "en_attente" };
}

export async function getPaymentStatus(paymentId: string, startedAt?: number): Promise<PaymentStatus> {
  await wait(350);
  if (paymentId.includes("_f")) {
    // Échec après ~5 s de sondage
    const elapsed = Date.now() - (startedAt ?? Date.now());
    return elapsed > 5000 ? "echoue" : "en_attente";
  }
  const elapsed = Date.now() - (startedAt ?? Date.now());
  return elapsed > 6500 ? "succes" : "en_attente";
}

// ─────────────────────────────────────────────────────── Prestataires
export interface ProviderFilters {
  q?: string;
  type?: ProviderType | "tous";
  commune?: string;
  open24?: boolean;
}

export async function searchProviders(filters: ProviderFilters): Promise<Provider[]> {
  await wait(200);
  let list = [...providerData];
  if (filters.type && filters.type !== "tous") list = list.filter((p) => p.type === filters.type);
  if (filters.commune && filters.commune !== "toutes")
    list = list.filter((p) => p.commune === filters.commune);
  if (filters.open24) list = list.filter((p) => p.open24);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.quartier.toLowerCase().includes(q) ||
        p.commune.toLowerCase().includes(q)
    );
  }
  return list;
}

// ───────────────────────────────────────────────────── Vérification
export interface CertificateResult {
  status: "valide" | "invalide";
  maskedName?: string;
  formula?: string;
  validUntil?: string;
  reason?: string;
}

export async function verifyCertificate(code: string): Promise<CertificateResult> {
  await wait(800);
  const clean = code.trim().toUpperCase();
  if (!/^AMSA-\d{4}-[A-Z0-9]{4}$/.test(clean) && !/^\d{10}$/.test(clean)) {
    return { status: "invalide", reason: "Ce code n'existe pas dans nos registres. Vérifiez la saisie ou scannez le QR code de la carte." };
  }
  if (clean.startsWith("AMSA-0000")) {
    return { status: "invalide", reason: "Cette carte a expiré. Invite l'assuré à renouveler sa souscription." };
  }
  return {
    status: "valide",
    maskedName: "A. D********",
    formula: "Confort",
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 8)).toISOString(),
  };
}

// ───────────────────────────────────────── B2B / Partenaires / Démo
export interface B2BQuotePayload {
  company: string;
  sector: string;
  city: string;
  employees: number;
  dependents: number;
  formula: FormulaId;
  contactName: string;
  contactRole: string;
  phone: string;
  email: string;
}

export async function submitB2BQuote(payload: B2BQuotePayload) {
  await wait(1000);
  const est = groupEstimate(payload.employees, payload.dependents, payload.formula);
  return {
    reference: `DEV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    estimate: est,
  };
}

export async function submitProviderApplication(payload: Record<string, string>) {
  await wait(1000);
  return {
    dossierNumber: `DOS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    contactEmail: payload.email ?? "",
  };
}

export async function requestDemo(payload: { name: string; email: string; company: string }) {
  await wait(700);
  return { ok: true as const, slot: "sous 48 h" };
}
