/** Formatage FCFA : `12 500 FCFA` (fr-FR, sans décimales). */
export function formatFcfa(amount: number, options?: { suffix?: boolean }): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return options?.suffix === false ? formatted : `${formatted} FCFA`;
}

/** Téléphone : `+223 XX XX XX XX`. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^223/, "").slice(0, 8);
  const groups = digits.match(/.{1,2}/g) ?? [];
  return `+223 ${groups.join(" ")}`.trim();
}

/** Retire le formatage : renvoie les 8 chiffres locaux. */
export function parsePhone(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^223/, "").slice(0, 8);
}

/** Validation numéro malien : 8 chiffres, commence par 5-9, 4, 6 ou 7. */
export function isValidMalianPhone(raw: string): boolean {
  const digits = parsePhone(raw);
  return /^[5-9467]\d{7}$/.test(digits);
}

/** Dates JJ/MM/AAAA. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Masque un nom : « A. D***** » */
export function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? "";
  const first = parts[0];
  const rest = parts.slice(1).map((p) => `${p[0] ?? ""}${"*".repeat(Math.max(p.length - 1, 3))}`);
  return [`${first[0]}.`, ...rest].join(" ");
}

/** Renvoie un id lisible type dossier : AMS-2025-XXXXXX */
export function dossierId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AMS-${new Date().getFullYear()}-${rand}`;
}
