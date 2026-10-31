"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, initGsap } from "@/lib/motion/gsap";
import { LogoMark } from "@/components/layout/Logo";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { fr } from "@/content/fr";

const columns = [
  {
    title: fr.footer.columns.produit,
    links: [
      { href: "/assurance-sante", label: "Formules & garanties" },
      { href: "/simulateur", label: "Simulateur de prime" },
      { href: "/souscrire", label: "Souscrire en ligne" },
      { href: "/comment-ca-marche", label: "Comment ça marche" },
    ],
  },
  {
    title: fr.footer.columns.parcours,
    links: [
      { href: "/prestataires", label: "Trouver un prestataire" },
      { href: "/verifier", label: "Vérifier une carte" },
      { href: "/connexion?redirect=/sinistres/nouveau", label: "Déclarer un remboursement" },
      { href: "/aide", label: "Centre d'aide" },
    ],
  },
  {
    title: fr.footer.columns.entreprise,
    links: [
      { href: "/entreprises", label: "Offre groupe salariés" },
      { href: "/entreprises/devis", label: "Demander un devis" },
      { href: "/prestataires/devenir-partenaire", label: "Devenir partenaire" },
      { href: "/cabinets", label: "Cabinets de courtage" },
    ],
  },
];

export function Footer() {
  const wordRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      initGsap();
      const el = wordRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el,
        { yPercent: 55, opacity: 0.25 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom 92%",
            scrub: 1,
          },
        }
      );
    },
    { scope: wordRef }
  );

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-sand-50 grain">
      <BogolanTexture color="#E3F4F1" opacity={0.045} />
      <div className="container-ams relative pt-20">
        {/* haut : baseline + colonnes */}
        <div className="grid gap-12 pb-14 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark color="#7CCFC8" className="size-10" />
              <p className="font-display text-xl font-bold">AMSANTÉ</p>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-sand-50/65">
              {fr.footer.tagline}
            </p>
            <ul className="mt-6 space-y-2 text-[14px]">
              {fr.footer.useful.map((u) => (
                <li key={u.label} className="flex items-center gap-3 text-sand-50/75">
                  <span className="inline-block size-1.5 rounded-full bg-teal-500" aria-hidden />
                  {u.label} : <span className="tnum font-semibold text-sand-50">{u.value}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/22376005566"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[14px] font-semibold transition-colors hover:bg-white/12"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.2 1.3-2 1.4-.5.1-1.2.2-3.5-.7-3-1.2-4.9-4.2-5-4.4-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.4 1.9Z" />
              </svg>
              Écrire sur WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-teal-300/80">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[14px] text-sand-50/70 transition-colors hover:text-sand-50 link-underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* mention réglementaire */}
        <div className="border-t border-white/10 py-6 text-[12px] leading-relaxed text-sand-50/65">
          <p>
            AMSANTÉ est une plateforme opérée par un cabinet de courtage d&apos;assurance agréé au
            Mali — {/* TODO: remplacer par le vrai n° d'agrément */} Agrément n° XXXX-XXXX (à
            confirmer). Les garanties sont souscrites auprès de compagnies partenaires. Document
            sans valeur contractuelle.
          </p>
          <nav className="mt-2 flex flex-wrap gap-x-5 gap-y-1" aria-label="Liens légaux">
            <Link href="/legal/mentions-legales" className="hover:text-sand-50/80">Mentions légales</Link>
            <Link href="/legal/confidentialite" className="hover:text-sand-50/80">Confidentialité</Link>
            <Link href="/legal/cgu" className="hover:text-sand-50/80">CGU</Link>
          </nav>
        </div>
      </div>

      {/* wordmark géant révélation au scroll */}
      <div ref={wordRef} className="relative select-none px-[clamp(20px,5vw,64px)]" aria-hidden>
        <p className="translate-y-[8%] whitespace-nowrap font-display font-extrabold leading-[0.82] tracking-[-0.04em] text-sand-50/[0.07]"
          style={{ fontSize: "clamp(72px, 17.5vw, 300px)" }}
        >
          AMSANTÉ
        </p>
      </div>
    </footer>
  );
}
