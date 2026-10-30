import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

/**
 * Layout épuré des parcours d’authentification : pas de Navbar/Footer/Dock,
 * juste un en-tête discret (logo + retour au site) sur fond sand-50.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sand-50">
      <a
        href="#contenu-auth"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-teal-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-sand-50"
      >
        Aller au contenu
      </a>
      <header className="border-b border-sand-200/80">
        <div className="container-ams grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          <span aria-hidden />
          <Link href="/" aria-label="AMSANTÉ — retour à l’accueil" className="justify-self-center">
            <Logo />
          </Link>
          <Link
            href="/"
            className="link-underline justify-self-end inline-flex items-center gap-2 text-sm font-semibold text-teal-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Retour au site</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>
      </header>
      <main id="contenu-auth" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
