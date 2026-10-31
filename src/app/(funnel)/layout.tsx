import type { ReactNode } from "react";
import { FunnelHeader } from "@/components/funnel/FunnelHeader";

/**
 * Layout des tunnels (/souscrire) : chrome épuré, fond sand-50, scroll natif
 * (pas de Lenis, pas de Navbar/Footer/Dock). Le devis entreprise vit dans
 * (site) mais réutilise le même en-tête via <FunnelHeader>.
 */
export default function FunnelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sand-50">
      {/* Lien d'évitement clavier, cohérent avec les layouts (site) et (auth) */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-teal-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-sand-50"
      >
        Aller au contenu
      </a>
      <FunnelHeader exitHref="/" exitLabel="Sortie" />
      <main
        id="contenu"
        className="mx-auto w-full max-w-[1120px] flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-10"
      >
        {children}
      </main>
    </div>
  );
}
