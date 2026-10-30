"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, MapPin, MessageCircle } from "lucide-react";
import { duration, ease } from "@/lib/motion/tokens";
import { Magnetic } from "@/components/motion/Magnetic";
import { fr } from "@/content/fr";

/**
 * Barre d'action flottante (« Dock ») : pill en verre, en bas au centre,
 * après le hero. Se cache près du footer.
 */
export function Dock() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const nearFooter = window.scrollY + window.innerHeight > doc.scrollHeight - 260;
      // Sur l'accueil, le hero est épinglé sur ~280 vh : le dock n'apparaît
      // qu'APRÈS le hero (sinon il recouvre l'indicateur « Faites défiler »).
      const threshold = pathname === "/" ? window.innerHeight * 2.4 : 480;
      setVisible(window.scrollY > threshold && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Le tunnel de souscription a déjà son CTA permanent : pas de dock.
  if (pathname.startsWith("/souscrire")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: duration.base, ease: ease.out }}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
          aria-label="Actions rapides"
        >
          <div className="flex items-center gap-1 rounded-full glass-panel p-1.5 shadow-lift">
            <Magnetic strength={6}>
              <Link
                href="/simulateur"
                className="flex min-h-11 items-center gap-2 rounded-full bg-teal-900 px-4 text-[13px] font-semibold text-sand-50 transition-colors hover:bg-teal-700"
              >
                <Calculator className="size-4" /> {fr.dock.simuler}
              </Link>
            </Magnetic>
            <Link
              href="/prestataires"
              className="flex min-h-11 items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-teal-100"
            >
              <MapPin className="size-4" /> <span className="hidden sm:inline">{fr.dock.prestataire}</span>
              <span className="sm:hidden">Prestataires</span>
            </Link>
            <a
              href="https://wa.me/22376005566"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-teal-100"
              aria-label="Contacter AMSANTÉ sur WhatsApp"
            >
              <MessageCircle className="size-4" /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
