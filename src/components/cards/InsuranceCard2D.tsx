"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format";
import { bogolanDataUri } from "@/components/layout/BogolanPattern";
import { LogoMark } from "@/components/layout/Logo";

/**
 * Carte d'assuré AMSANTÉ — objet signature de la marque.
 * Identique (proportions, matières) dans le hero, le tunnel, la confirmation
 * et /verifier. Retournable au clic (verso : consignes + contacts).
 */
export function InsuranceCard2D({
  holderName = "Fatoumata Traoré",
  formula = "Confort",
  cardCode = "AMSA-2025-8K4T",
  validUntil,
  flipOnClick = true,
  tilt = true,
  className,
  size = "md",
}: {
  holderName?: string;
  formula?: string;
  cardCode?: string;
  validUntil?: string;
  flipOnClick?: boolean;
  tilt?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 22 });
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 22 });

  const sizes = {
    sm: { root: "max-w-[300px]", face: "p-4 rounded-[16px]" },
    md: { root: "max-w-[420px]", face: "p-6 rounded-[22px]" },
    lg: { root: "max-w-[520px]", face: "p-7 rounded-[26px]" },
  };

  const handleMouse = (e: React.MouseEvent) => {
    if (!tilt || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto w-full select-none [perspective:1200px]", sizes[size].root, className)}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      role={flipOnClick ? "button" : undefined}
      tabIndex={flipOnClick ? 0 : undefined}
      aria-label="Carte d'assuré AMSANTÉ — cliquer pour retourner"
      onKeyDown={(e) => {
        if (flipOnClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      onClick={() => flipOnClick && setFlipped((f) => !f)}
    >
      <motion.div
        className="relative aspect-[1.586/1] w-full [transform-style:preserve-3d]"
        style={{ rotateX: rX, rotateY: tilt ? rY : 0 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* ── Recto ─────────────────────────────────────────── */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-between overflow-hidden text-sand-50 shadow-card [backface-visibility:hidden]",
            "bg-[linear-gradient(128deg,#12766F_0%,#0F5B57_38%,#0B1F1E_100%)] ring-1 ring-white/20",
            sizes[size].face
          )}
        >
          {/* texture bogolan + reflets */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: bogolanDataUri("#E3F4F1"), opacity: 0.07 }}
          />
          <div aria-hidden className="absolute -left-1/4 -top-1/2 h-[200%] w-1/2 rotate-[24deg] bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
          <div aria-hidden className="absolute -right-16 -top-24 size-64 rounded-full bg-teal-500/25 blur-3xl" />

          {/* en-tête */}
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <LogoMark color="#7CCFC8" className="size-9" />
              <div>
                <p className="font-display text-lg font-bold leading-none tracking-tight">AMSANTÉ</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-teal-100/70">
                  Assurance santé · Mali
                </p>
              </div>
            </div>
            {/* puce dorée */}
            <div className="mt-1 h-8 w-11 rounded-[6px] bg-[linear-gradient(135deg,#E9C46A,#B98A2F_60%,#E9C46A)] p-[3px] shadow-inner">
              <div className="grid h-full grid-cols-3 grid-rows-2 gap-[2px] opacity-70">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="rounded-[1px] border border-[#8a6a20]/60" />
                ))}
              </div>
            </div>
          </div>

          {/* corps */}
          <div className="relative flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="tnum text-[clamp(13px,3.4vw,17px)] tracking-[0.14em] text-teal-100/90">
                {cardCode}
              </p>
              <p className="mt-2 truncate font-display text-[clamp(15px,3.8vw,20px)] font-semibold uppercase tracking-wide">
                {holderName}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full bg-teal-500/25 px-2.5 py-1 font-semibold uppercase tracking-wider text-teal-100">
                  {formula}
                </span>
                {validUntil && (
                  <span className="text-sand-50/60">
                    Valide jusqu&apos;au <span className="tnum">{formatDate(validUntil)}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 rounded-lg bg-sand-50 p-1.5 shadow-sm">
              <QRCode value={cardCode} size={size === "sm" ? 44 : 60} bgColor="#F7F4EE" fgColor="#0B1F1E" />
            </div>
          </div>
        </div>

        {/* ── Verso ─────────────────────────────────────────── */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col overflow-hidden text-sand-50 shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)]",
            "bg-[linear-gradient(128deg,#0B1F1E_0%,#0F5B57_120%)] ring-1 ring-white/20",
            sizes[size].face
          )}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: bogolanDataUri("#E3F4F1"), opacity: 0.06 }}
          />
          <div className="relative -mx-6 -mt-6 h-10 bg-black/55 md:-mx-7 md:-mt-7" />
          <div className="relative mt-5 space-y-2 text-[11px] leading-relaxed text-sand-50/85">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-teal-100">
              Carte d&apos;assuré AMSANTÉ
            </p>
            <p>Présentez le QR code à l&apos;accueil du prestataire conventionné : vos droits s&apos;ouvrent instantanément, sans avance de frais.</p>
          </div>
          <div className="relative mt-auto flex items-end justify-between text-[10px] text-sand-50/60">
            <div className="space-y-0.5">
              {/* TODO: remplacer par les vrais numéros */}
              <p className="tnum">Service client · +223 80 00 11 22</p>
              <p className="tnum">Urgences 24 h/24 · +223 80 00 33 44</p>
            </div>
            <span className="tnum">{cardCode}</span>
          </div>
          <div aria-hidden className="relative -mx-6 -mb-6 mt-3 h-4 bg-[repeating-linear-gradient(90deg,#17A398_0_14px,#0B1F1E_14px_28px)] opacity-70 md:-mx-7 md:-mb-7" />
        </div>
      </motion.div>
    </div>
  );
}
