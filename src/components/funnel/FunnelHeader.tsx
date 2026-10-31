import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

/**
 * En-tête minimal des tunnels : logo vers l'accueil, bouton « Sortie » à droite.
 * Utilisé par (funnel)/layout.tsx et par le takeover du devis entreprise.
 */
export function FunnelHeader({ exitHref = "/", exitLabel = "Sortie" }: { exitHref?: string; exitLabel?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="AMSANTÉ — retour à l'accueil"
          className="rounded-full focus-visible:outline-2 focus-visible:outline-teal-500"
        >
          <Logo />
        </Link>
        <Link
          href={exitHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-teal-100/70 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-teal-500"
        >
          <X className="size-4" aria-hidden />
          {exitLabel}
        </Link>
      </div>
    </header>
  );
}
