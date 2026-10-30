"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow, Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ArrowRight } from "lucide-react";
import { faq, homeFaqIds } from "@/data/faq";

/** FAQ d'accueil : 6 questions clés en accordéon Motion. */
export function HomeFaq() {
  const items = homeFaqIds.map((id) => faq.find((f) => f.id === id)!).filter(Boolean);

  return (
    <section className="py-24 sm:py-32" aria-label="Questions fréquentes">
      <div className="container-ams grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Reveal><Eyebrow>Questions fréquentes</Eyebrow></Reveal>
          <SplitHeading className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold">
            Tout ce qu&apos;on nous demande souvent.
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-sm text-[16px] text-muted-foreground">
              Une autre question ? Le centre d&apos;aide détaille chaque parcours, et notre équipe
              répond sur WhatsApp en quelques minutes.
            </p>
            <Link
              href="/aide"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-100 px-5 py-2.5 text-[14px] font-semibold text-teal-900 transition-colors hover:bg-teal-500/25"
            >
              Voir le centre d&apos;aide <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="rounded-[24px] border border-sand-200 bg-white px-6 shadow-soft">
            {items.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-sand-200 last:border-0">
                <AccordionTrigger className="py-5 text-left font-display text-[16px] font-semibold hover:no-underline hover:text-teal-900">
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
    </section>
  );
}
