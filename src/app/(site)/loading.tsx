/**
 * État de chargement global du site (route groups (site)) :
 * squelette sobre aux couleurs AMSANTÉ, en attendant le rendu
 * du segment — cohérent avec le rythme du motion system (pas de
 * spinner criard, juste une respiration douce).
 */
export default function SiteLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sand-50 px-6"
      role="status"
      aria-label="Chargement de la page"
    >
      <span className="relative flex size-12 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-teal-500/20 motion-reduce:animate-none" />
        <span className="relative flex size-10 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-900 font-display text-lg font-extrabold text-sand-50 motion-reduce:animate-none">
          A
        </span>
      </span>
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        Chargement…
      </p>
    </div>
  );
}
