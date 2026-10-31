"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/layout/Logo";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * Préchargeur : 1re visite uniquement (sessionStorage), ≤ 1,2 s.
 * Le logo se trace en SVG puis s'ouvre en rideau. Ignoré si reduced-motion.
 */
export function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("amsante-preloaded");
    if (reduced || seen) return;
    sessionStorage.setItem("amsante-preloaded", "1");
    const raf = requestAnimationFrame(() => setShow(true));
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
    }, 1250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: duration.base, ease: ease.inOut }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            className="flex flex-col items-center gap-4"
          >
            {/* logo tracé — durées et courbe issues des tokens motion */}
            <svg viewBox="0 0 40 40" className="size-16" fill="none">
              <rect x="3" y="7" width="34" height="26" rx="6" stroke="#17A398" strokeWidth="2.4"
                strokeDasharray="140" strokeDashoffset="140"
                style={{ animation: `ams-draw ${duration.slow}s var(--ease-ams-out) forwards` }} />
              <path d="M9 24c2.5 0 2.5-6 5-6s2.5 8 5 8 2.5-10 5-10 2.5 6 5 6h2" stroke="#E3F4F1" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="60" strokeDashoffset="60"
                style={{ animation: `ams-draw ${duration.base}s var(--ease-ams-out) ${duration.fast}s forwards` }} />
            </svg>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: duration.fast }}
              className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-sand-50/80"
            >
              AMSANTÉ
            </motion.p>
          </motion.div>
          <style>{`@keyframes ams-draw { to { stroke-dashoffset: 0; } }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
