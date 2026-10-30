import { cn } from "@/lib/utils";

/** Marque AMSANTÉ : carte abstraite + ligne de progression + points QR. */
export function LogoMark({ className, color = "#17A398" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("size-8", className)} aria-hidden>
      <rect x="3" y="7" width="34" height="26" rx="6" stroke={color} strokeWidth="2.4" />
      <path d="M9 24c2.5 0 2.5-6 5-6s2.5 8 5 8 2.5-10 5-10 2.5 6 5 6h2" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="13.5" r="1.4" fill={color} />
      <circle cx="16" cy="13.5" r="1.4" fill={color} />
      <circle cx="21" cy="13.5" r="1.4" fill={color} />
    </svg>
  );
}

export function Logo({
  className,
  variant = "dark",
  wordmark = true,
}: {
  className?: string;
  /** dark = pour fonds clairs ; light = pour fonds sombres (ink) */
  variant?: "dark" | "light";
  wordmark?: boolean;
}) {
  const color = variant === "dark" ? "#0F5B57" : "#7CCFC8";
  const textColor = variant === "dark" ? "text-ink" : "text-sand-50";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark color={color} className="size-8" />
      {wordmark && (
        <span className={cn("font-display text-[19px] font-bold tracking-tight leading-none", textColor)}>
          AMSANTÉ
          <span className="ml-1.5 align-super text-[9px] font-semibold uppercase tracking-[0.18em] opacity-60">
            Mali
          </span>
        </span>
      )}
    </span>
  );
}
