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
