"use client";

import { motion } from "framer-motion";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * Transition de page : rideau teal qui se retire vers le haut (0,6 s),
 * le contenu se révèle ensuite. Monté à chaque changement de route.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-teal-900"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: duration.base, ease: ease.inOut, delay: 0.05 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.out, delay: 0.18 }}
      >
        {children}
      </motion.div>
    </>
  );
}
