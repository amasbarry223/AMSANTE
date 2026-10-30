"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import {
  Building2,
  ClipboardList,
  CreditCard,
  MessageCircle,
  Search,
  Smartphone,
  Stethoscope,
  Wallet,
  X,
} from "lucide-react";
import { faq, faqCategories } from "@/data/faq";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* TODO: le numéro WhatsApp est un numéro de travail — à confirmer par le service client. */
const WHATSAPP_URL = "https://wa.me/22376005566";

const categoryIcons: Record<string, React.ElementType> = {
  Souscription: ClipboardList,
  "Carte & compte": CreditCard,
  "Soins & tiers payant": Stethoscope,
  Remboursements: Wallet,
  Paiement: Smartphone,
  Entreprises: Building2,
};

/**
 * Îlot interactif du centre d'aide : barre de recherche (Fuse.js, résultats
 * instantanés), cartes catégories cliquables (filtre) et articles en
 * accordéon groupés par catégorie. En recherche, les résultats remplacent
 * catégories + articles ; état vide avec relance WhatsApp.
 */
export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(faq, {
        keys: ["question", "answer"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    []
  );

  const trimmed = query.trim();
  const searching = trimmed.length > 0;
  const results = useMemo(
    () => (searching ? fuse.search(trimmed).map((r) => r.item) : []),
    [fuse, trimmed, searching]
  );

  const visibleCategories = useMemo(
    () => faqCategories.filter((c) => !activeCategory || c === activeCategory),
    [activeCategory]
  );

  const countFor = (cat: string) => faq.filter((f) => f.category === cat).length;

  return (
    <div>
      {/* ── Barre de recherche (suite du hero sombre) ── */}
      <section className="bg-ink pb-20 sm:pb-24" aria-label="Recherche dans le centre d'aide">
        <div className="container-ams">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="relative mx-auto max-w-2xl"
          >
            <label htmlFor="help-search" className="sr-only">
              Rechercher une question dans le centre d&apos;aide
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="help-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex. « délai de carence », « carte perdue », « Wave »…"
              autoComplete="off"
              aria-describedby="help-search-status"
              className="h-14 w-full rounded-full border border-white/10 bg-white pr-14 pl-13 text-[15px] text-ink shadow-card outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-teal-500/50 [&::-webkit-search-cancel-button]:hidden"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sand-100 hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </form>

          {/* Résultats de recherche instantanés */}
          {searching && (
            <div
              id="help-search-status"
              aria-live="polite"
              className="mx-auto mt-6 max-w-2xl"
            >
              <p className="text-center text-[13.5px] font-semibold text-teal-100">
                {results.length > 0
                  ? `${results.length} réponse${results.length > 1 ? "s" : ""} pour « ${trimmed} »`
                  : undefined}
              </p>

              {results.length > 0 ? (
                <div className="mt-4 rounded-[24px] border border-sand-200 bg-white px-6 shadow-card">
                  <Accordion type="single" collapsible>
                    {results.map((f) => (
                      <AccordionItem key={f.id} value={f.id} className="border-sand-200 last:border-0">
                        <AccordionTrigger className="py-4.5 text-left font-display text-[15.5px] font-semibold hover:no-underline hover:text-teal-900">
                          {f.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 text-[14px] leading-relaxed text-muted-foreground">
                          <span className="mb-2 inline-block rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-900">
                            {f.category}
                          </span>
                          <span className="block">{f.answer}</span>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="mt-4 rounded-[24px] border border-sand-200 bg-white p-8 text-center shadow-card">
                  <p className="font-display text-[17px] font-bold text-ink">
                    Aucun résultat — essayez un autre mot.
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                    Pas de jargon promis : reformulez comme vous parlez (« bébé », « pharmacie »,
                    « paiement refusé »…) ou écrivez-nous directement.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-success px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Poser ma question sur WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Catégories + articles (masqués pendant une recherche) ── */}
      {!searching && (
        <>
          <section className="bg-sand-50 py-20 sm:py-24" aria-label="Catégories d'aide">
            <div className="container-ams">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-xl">
                  <Reveal>
                    <Eyebrow>Parcourir</Eyebrow>
                  </Reveal>
                  <SplitHeading className="mt-5 font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold">
                    Ou cherchez par thème.
                  </SplitHeading>
                </div>
                {activeCategory && (
                  <Reveal>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(null)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sand-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-teal-500/60 hover:bg-teal-100/60"
                      aria-label="Retirer le filtre et voir toutes les catégories"
                    >
                      <X className="size-4" aria-hidden />
                      Retirer le filtre : {activeCategory}
                    </button>
                  </Reveal>
                )}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {faqCategories.map((cat, i) => {
                  const Icon = categoryIcons[cat] ?? ClipboardList;
                  const selected = activeCategory === cat;
                  return (
                    <Reveal key={cat} delay={i * 0.04}>
                      <motion.button
                        type="button"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: duration.fast, ease: ease.out }}
                        onClick={() => setActiveCategory(selected ? null : cat)}
                        aria-pressed={selected}
                        className={cn(
                          "flex h-full w-full flex-col items-start rounded-[16px] border bg-white p-5 text-left shadow-soft transition-colors",
                          selected
                            ? "border-teal-700/50 ring-1 ring-teal-700/40"
                            : "border-sand-200 hover:border-teal-500/40"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-10 items-center justify-center rounded-xl transition-colors",
                            selected ? "bg-teal-900 text-sand-50" : "bg-teal-100 text-teal-900"
                          )}
                        >
                          <Icon className="size-[18px]" aria-hidden />
                        </span>
                        <span className="mt-3 font-display text-[15px] font-bold text-ink">{cat}</span>
                        <span className="tnum mt-0.5 text-[12.5px] text-muted-foreground">
                          {countFor(cat)} question{countFor(cat) > 1 ? "s" : ""}
                        </span>
                      </motion.button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-sand-50 pb-24 sm:pb-32" aria-label="Toutes les questions">
            <div className="container-ams space-y-10">
              {visibleCategories.map((cat) => {
                const items = faq.filter((f) => f.category === cat);
                return (
                  <div key={cat}>
                    <Reveal>
                      <h3 className="flex items-center gap-3 font-display text-[20px] font-bold text-ink">
                        <span className="h-5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                        {cat}
                      </h3>
                    </Reveal>
                    <Reveal delay={0.08} className="mt-4">
                      <Accordion
                        type="single"
                        collapsible
                        className="rounded-[24px] border border-sand-200 bg-white px-6 shadow-soft"
                      >
                        {items.map((f) => (
                          <AccordionItem
                            key={f.id}
                            value={f.id}
                            className="border-sand-200 last:border-0"
                          >
                            <AccordionTrigger className="py-5 text-left font-display text-[15.5px] font-semibold hover:no-underline hover:text-teal-900">
                              {f.question}
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 text-[14.5px] leading-relaxed text-muted-foreground">
                              {f.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
