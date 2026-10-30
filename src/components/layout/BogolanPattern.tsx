import { cn } from "@/lib/utils";

/**
 * Motif graphique propriétaire inspiré du bogolan (lignes, points, chevrons),
 * dessiné en SVG fin 1 px, utilisé en texture de fond très discrète (4–6 %).
 */
export function bogolanDataUri(color: string, opacity = 0.05): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
  <g fill='none' stroke='${color}' stroke-width='1'>
    <path d='M0 8h96'/>
    <path d='M0 16l8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6'/>
    <circle cx='8' cy='40' r='1.4' fill='${color}' stroke='none'/>
    <circle cx='28' cy='40' r='1.4' fill='${color}' stroke='none'/>
    <circle cx='48' cy='40' r='1.4' fill='${color}' stroke='none'/>
    <circle cx='68' cy='40' r='1.4' fill='${color}' stroke='none'/>
    <circle cx='88' cy='40' r='1.4' fill='${color}' stroke='none'/>
    <path d='M0 64h96'/>
    <path d='M0 56l12 12M12 56l12 12M24 56l12 12M36 56l12 12M48 56l12 12M60 56l12 12M72 56l12 12M84 56l12 12'/>
    <path d='M8 80l8 8M24 80l8 8M40 80l8 8M56 80l8 8M72 80l8 8M88 80l8 8'/>
    <path d='M16 84l8-8M32 84l8-8M48 84l8-8M64 84l8-8M80 84l8-8'/>
  </g>
</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function BogolanTexture({
  color = "#0F5B57",
  opacity = 0.05,
  className,
}: {
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ backgroundImage: bogolanDataUri(color), opacity }}
    />
  );
}

/** Séparateur bogolan animé (tracé au scroll via DrawPath). */
export function BogolanDivider({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox="0 0 1200 24"
        fill="none"
        className="h-6 w-full text-teal-500/40"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path d="M0 12h520" stroke={color} strokeWidth="1" />
        <path d="M528 12l10-8 10 8 10-8 10 8 10-8 10 8" stroke={color} strokeWidth="1" />
        <circle cx="600" cy="12" r="2" fill={color} />
        <path d="M612 4l10 8 10-8 10 8 10-8 10 8 10-8" stroke={color} strokeWidth="1" />
        <path d="M680 12h520" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
}
