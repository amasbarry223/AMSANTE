"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChevronDown,
  FileCheck2,
  Handshake,
  Landmark,
  Menu,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Magnetic";
import { duration, ease, stagger } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

interface MegaLink {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const assuranceMega: MegaLink[] = [
  { href: "/assurance-sante", label: "Formules & garanties", description: "Comparer Essentiel, Confort et Premium.", icon: ShieldCheck },
  { href: "/simulateur", label: "Simulateur de prime", description: "Votre prime en 30 secondes, sans engagement.", icon: Calculator },
  { href: "/souscrire", label: "Souscrire en ligne", description: "5 minutes, paiement Mobile Money.", icon: BadgeCheck },
  { href: "/comment-ca-marche", label: "Comment ça marche", description: "Tiers payant, remboursements, carence.", icon: Sparkles },
  { href: "/verifier", label: "Vérifier une carte", description: "Scanner un QR ou saisir un code.", icon: QrCode },
];

const prestatairesMega: MegaLink[] = [
  { href: "/prestataires", label: "Annuaire des prestataires", description: "Cliniques, pharmacies, labos conventionnés.", icon: Stethoscope },
  { href: "/prestataires/devenir-partenaire", label: "Devenir partenaire", description: "Rejoignez le réseau tiers payant AMSANTÉ.", icon: Handshake },
  { href: "/verifier", label: "Vérifier une attestation", description: "Contrôle instantané des droits.", icon: FileCheck2 },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Pages dont le héros est sombre (bg-ink) : la navbar y démarre en variante claire. */
  const DARK_HERO_ROUTES = ["/", "/prestataires", "/verifier", "/aide", "/entreprises", "/simulateur"];
  const overHero = DARK_HERO_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const dark = overHero && !scrolled;

  /** Navbar toujours fixe : elle reste visible au scroll (demande client),
   *  et passe en pilule verre dépoli après 80 px. */
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 80);
  });

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMega = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 140);
  };

  const linkCls = (active: boolean) =>
    cn(
      "relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
      dark ? "text-sand-50/85 hover:text-sand-50" : "text-ink/75 hover:text-ink",
      active && (dark ? "text-sand-50" : "text-teal-900")
    );

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: duration.base, ease: ease.out }}
        className="fixed inset-x-0 top-0 z-50"
        onMouseLeave={scheduleClose}
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-[1320px] items-center justify-between px-[clamp(20px,5vw,64px)] transition-all duration-300 xl:h-[76px]",
            scrolled
              ? "mt-3 h-[64px] max-w-[min(1320px,calc(100%-32px))] rounded-full glass-panel shadow-soft xl:h-[68px]"
              : "bg-transparent"
          )}
        >
          <Link href="/" aria-label="AMSANTÉ — Accueil" className="shrink-0">
            <Logo variant={dark ? "light" : "dark"} />
          </Link>

          {/* ── Navigation desktop ── */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigation principale">
            {[
              { id: "assurance", label: "Assurance santé", href: "/assurance-sante", mega: assuranceMega },
              { id: "entreprises", label: "Entreprises", href: "/entreprises" },
              { id: "prestataires", label: "Prestataires", href: "/prestataires", mega: prestatairesMega },
              { id: "comment", label: "Comment ça marche", href: "/comment-ca-marche" },
              { id: "cabinets", label: "Cabinets", href: "/cabinets" },
            ].map((item) => {
              const active = mega === item.id;
              const isCurrent = pathname.startsWith(item.href);
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => (item.mega ? openMega(item.id) : scheduleClose())}
                  className="relative"
                >
                  <Link href={item.href} className={linkCls(!!isCurrent && !item.mega)} aria-expanded={item.mega ? active : undefined} aria-haspopup={item.mega ? "true" : undefined}>
                    {item.label}
                    {item.mega && (
                      <ChevronDown className={cn("size-3.5 transition-transform duration-200", active && "rotate-180")} aria-hidden />
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/15"
                        transition={{ duration: duration.fast, ease: ease.out }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/connexion"
              className={cn(
                "rounded-full whitespace-nowrap px-4 py-2 text-[14px] font-semibold transition-colors link-underline",
                dark ? "text-sand-50/90 hover:text-sand-50" : "text-ink/80 hover:text-ink"
              )}
            >
              Se connecter
            </Link>
            <Magnetic strength={8}>
              <Button asChild size="default" variant={dark ? "on-dark" : "default"} className="min-h-10">
                <Link href="/simulateur">Simuler ma prime</Link>
              </Button>
            </Magnetic>
          </div>

          {/* ── Burger mobile ── */}
          <button
            type="button"
            className={cn(
              "flex size-11 items-center justify-center rounded-full transition-colors lg:hidden",
              dark ? "text-sand-50 hover:bg-white/10" : "text-ink hover:bg-ink/5"
            )}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* ── Mega menu desktop ── */}
        <AnimatePresence>
          {mega && (
            <motion.div
              key={mega}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: duration.fast, ease: ease.out }}
              onMouseEnter={() => openMega(mega)}
              className="absolute left-1/2 top-[calc(100%+8px)] hidden w-[560px] -translate-x-1/2 lg:block"
            >
              <div className="glass-panel rounded-[24px] p-3 shadow-lift">
                <div className="grid gap-1">
                  {(mega === "assurance" ? assuranceMega : prestatairesMega).map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMega(null)}
                      className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-teal-100/80"
                    >
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-900 transition-colors group-hover:bg-teal-500 group-hover:text-white">
                        <l.icon className="size-[18px]" />
                      </span>
                      <span>
                        <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                          {l.label}
                          <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        <span className="mt-0.5 block text-[13px] text-muted-foreground">
                          {l.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Menu mobile plein écran ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-8 pt-24 text-sand-50 lg:hidden"
          >
            <motion.nav
              className="flex flex-col gap-1"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.tight + 0.03 } } }}
              aria-label="Navigation mobile"
            >
              {[
                { href: "/assurance-sante", label: "Assurance santé" },
                { href: "/simulateur", label: "Simuler ma prime" },
                { href: "/souscrire", label: "Souscrire en ligne" },
                { href: "/entreprises", label: "Entreprises" },
                { href: "/prestataires", label: "Prestataires" },
                { href: "/comment-ca-marche", label: "Comment ça marche" },
                { href: "/cabinets", label: "Cabinets" },
                { href: "/aide", label: "Aide" },
                { href: "/verifier", label: "Vérifier une carte" },
              ].map((l) => (
                <motion.div
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
                  }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-white/8 py-4 font-display text-[22px] font-semibold"
                  >
                    {l.label}
                    <ArrowRight className="size-5 opacity-40" />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button asChild size="lg" variant="on-dark" className="w-full">
                <Link href="/connexion">
                  <Users className="size-4" /> Se connecter
                </Link>
              </Button>
              <p className="text-center text-[13px] text-sand-50/50">
                {/* TODO: remplacer par le numéro réel */}
                Service client · <span className="tnum">+223 80 00 11 22</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
