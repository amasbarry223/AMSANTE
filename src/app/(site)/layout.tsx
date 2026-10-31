import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Dock } from "@/components/layout/Dock";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/lib/motion/lenis";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col">
        <Preloader />
        <Cursor />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-teal-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-sand-50"
        >
          Aller au contenu
        </a>
        <Navbar />
        {/* pb-24 : espace pour le Dock flottant (mobile) — il est masqué près du footer et inutile en lg */}
        <main id="contenu" className="flex-1 pb-24 lg:pb-0">
          {children}
        </main>
        <Dock />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
