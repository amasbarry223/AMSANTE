# CONTRAT DE DÉVELOPPEMENT — Frontend public AMSANTÉ

Document de référence pour toute page du site public AMSANTÉ. Lis-le EN ENTIER avant de coder.

## 1. Stack & règles non négociables
- Next.js 16 App Router, React 19, TypeScript strict. **Ne jamais modifier** : `src/lib/**`, `src/data/**`, `src/stores/**`, `src/components/ui/**` (sauf usage), `src/app/layout.tsx`, `src/app/globals.css`, les composants de `src/components/layout`, `motion`, `three`, `cards`, `home`.
- Aucun lorem ipsum : textes français réels, chaleureux, sans jargon d'assureur. Aucun faux témoignage / faux chiffre présenté comme réel : utiliser des placeholders marqués `{/* TODO: ... */}`.
- Pas de backend : utiliser les fonctions mock de `@/lib/api` (déjà écrites) — jamais de fetch réseau.
- Montants : toujours `formatFcfa()` / `<AmountDisplay>` / `<Counter format="fcfa">` (Geist Mono tabulaire). Téléphones : `PhoneInput` (masque +223).
- Aucune durée/courbe d'animation en dur : importer depuis `@/lib/motion/tokens` (`duration`, `ease`, `stagger`). GSAP via `initGsap()` + `useGSAP` (scope) depuis `@/lib/motion/gsap`. Jamais GSAP ET Motion sur le même élément.
- `"use client"` uniquement pour les îlots interactifs ; les pages et sections statiques restent en Server Components.
- Accessibilité : navigation clavier, `aria-*`, focus visible, cibles ≥ 44px, labels visibles, `aria-live` sur les valeurs qui changent (primes, statuts).
- Responsive : desktop d'abord (≥1280), propre à 768, utilisable à 375.

## 2. Design system (déjà branché dans globals.css)
- Couleurs Tailwind : `ink` `ink-soft` `teal-900` `teal-700` `teal-500` `teal-300` `teal-100` `teal-50` `sand-50` `sand-100` `sand-200` `sand-300` `ochre-500` `ochre-100` `success` `warning` `danger`.
- Sémantiques shadcn déjà mappées : `bg-background` (sand-50), `text-foreground` (ink), `bg-primary` (teal-900), `text-primary-foreground` (sand-50), `bg-secondary` (teal-100), `border-border` (sand-200), `bg-muted`, `text-muted-foreground`, `bg-accent`…
- Sections sombres/immersives : `bg-ink text-sand-50` (+ `grain` et `<BogolanTexture>` opacité ≤ 0.06).
- Polices : titres `font-display` (Bricolage, 600–800, tracking serré), texte `font-sans` (Geist), montants `tnum`.
- Ombres : `shadow-soft` (cartes), `shadow-lift` (survol), `shadow-card` (panneaux sombres).
- Utilitaires : `container-ams` (largeur max + marges), `glass-panel` (navbar/panneaux flottants uniquement), `text-gradient-teal`, `link-underline`, `line-mask`.
- Rayons : inputs 10px (`rounded-[10px]`), cartes 16px, grands panneaux 28px, pills 999px (`rounded-full`).
- L'ocre (`ochre-500`) : max 1 usage par écran (badge « Recommandée », point d'attention).

## 3. Composants disponibles (API exacte)

### Layout (déjà montés dans `(site)/layout.tsx` — ne pas re-monter)
`Navbar`, `Footer`, `Dock`, `Cursor`, `Preloader`, `SmoothScroll` (Lenis), lien d'évitement.

### Motion (`src/components/motion/`)
- `<Reveal delay={0} as="div">…</Reveal>` — apparition bloc (opacity+y24) au scroll, une fois.
- `<StaggerContainer gap={0.08}>` + `<StaggerItem>` — listes.
- `<SplitHeading as="h2" trigger>Titre</SplitHeading>` — révélation de titre par lignes. `trigger={false}` = révèle immédiatement (au-dessus de la ligne de flottaison).
- `<Magnetic strength={10}>` — enveloppe magnétique (CTA principaux).
- `<Counter value={n} format="number|fcfa">` — compteur animé au scroll.
- `<DrawPath scrub?>` — tracé SVG au scroll (enfant : `<svg>` avec paths).
- `<Eyebrow tone="teal|ochre|light">` — pilule de sur-titre de section.
- `<Marquee duration reverse>` — défilement infini (pause au survol).

### Carte d'assuré
- `<InsuranceCard2D holderName formula cardCode validUntil size="sm|md|lg" tilt flipOnClick />` — objet signature, retournable au clic.

### UI restylée (shadcn dans `src/components/ui/`)
`Button` (variants: `default` `outline` `secondary` `ghost` `on-dark` `outline-light` `link`; sizes: `default sm lg xl icon`), `Input`, `Label`, `Select`, `Checkbox`, `Switch`, `Slider`, `Tabs`, `Accordion`, `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `Badge`, `Skeleton`, `Progress`, `Separator`, `Textarea`, `RadioGroup`, `ScrollArea`, `Avatar`.
⚠️ `Toaster` est déjà monté (sonner) : pour les toasts utiliser `import { toast } from "sonner"`.

### Primitives maison (`src/components/shared/`)
- `<PrimaryCta href="/simulateur" size="lg" variant="default|on-dark">Simuler ma prime</PrimaryCta>` — LE CTA primaire magnétique (même partout).
- `<PhoneInput value onChange error />` — masque `+223 XX XX XX XX`, retourne 8 chiffres bruts.
- `<OtpInput onComplete={(code)=>…} onResend error />` — 6 cases, autosubmit, renvoi 60 s.
- `<AmountDisplay value suffix />` — montant FCFA animé, `aria-live`.
- `<FileDropzone label hint value onChange />` — upload + compression < 300 Ko (dataURL).

### Funnel (`src/components/funnel/`)
- `<Stepper steps={[...]} current={i} onStepClick={(i)=>…} />` — indicateur layoutId + % progression.

### Three (`src/components/three/`)
- `<CardScene cardCode holder formula />` — scène légère (confirmation) : carte se matérialise, clic = flip. Import dynamique : `const CardScene = dynamic(() => import("@/components/three/CardScene"), { ssr: false })` dans un composant client, conditionné par `canRender3D()` (`@/lib/utils/device`) ; sinon fallback `<InsuranceCard2D>`.

### Motif bogolan
- `<BogolanTexture color="#E3F4F1" opacity={0.05} />` — texture de fond discrète (absolute inset-0).
- `<BogolanDivider />` — séparateur.

## 4. Données & API mock (`@/data`, `@/lib/api`, `@/lib/pricing`)
- `products` (3 formules: essentiel/confort/premium), `getFormula(id)`, `frequencyDiscount`, `frequencyLabel`, `frequencyMultiplier`.
- `guarantees` (9 garanties avec `coverage[formulaId] = {taux, plafond}`), `communeList`.
- `providers` (18 prestataires Bamako/Kati avec `x,y` pour carte SVG en % 0–100), `providerTypes`.
- `faq`, `faqCategories`, `homeFaqIds`.
- API mock (latence 400–1200 ms) : `getProducts`, `quoteApi`, `createSubscription`, `requestOtp(phone)`, `verifyOtp(phone, code)` (code `000000` → erreur), `initMobileMoneyPayment({operator, phone, amount})` (numéro finissant `0000` → échec), `getPaymentStatus(paymentId, startedAt)`, `searchProviders({q, type, commune, open24})`, `verifyCertificate(code)`, `submitB2BQuote`, `submitProviderApplication`, `requestDemo`.
- Pricing pur : `quote({coverage, children, age, formula, frequency}) → {monthly, period, discount, monthlyEquivalent, breakdown}` ; `groupEstimate(employees, dependents, formula) → {low, high, total}`.
- Stores zustand persist : `useSubscription` (tunnel souscription, `setStep/setCoverage/setFormula/setFrequency/setAge/setChildrenCount/setPrincipal/addBeneficiary/…/markCompleted/reset`, helper `hasDraft`), `useB2BQuote` (devis entreprise: `setStep/patch/reset`).
- Formats : `formatFcfa, formatPhone, parsePhone, isValidMalianPhone, formatDate, maskName, dossierId`.

## 5. Vocabulaire de mouvement (rien d'autre)
1. Titres → `SplitHeading`. 2. Blocs → `Reveal`/`StaggerContainer`. 3. Hover carte → `-translate-y-1 hover:shadow-lift` ou `whileHover={{ y: -4 }}`. 4. CTA → `PrimaryCta`/`Magnetic`. 5. Montants → `AmountDisplay`/`Counter`. 6. Tracés → `DrawPath`. 7. Transitions d'étapes de tunnel → `AnimatePresence mode="wait"` + glissement x ±40px + fondu (`duration.fast`, `ease.out`), direction selon retour.
- `prefers-reduced-motion` : framer-motion `useReducedMotion()` ; GSAP : `matchMedia` puis return early (patterns existants dans les composants).

## 6. Page type (structure)
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "…", description: "…" };

export default function Page() {
  return (
    <>
      {/* Hero de page : section bg-ink ou bg-sand-50, padding-top généreux (pt-36) */}
      {/* Sections en <section aria-label="…"> avec container-ams */}
      {/* CTA final */}
    </>
  );
}
```
- Padding haut des pages internes : `pt-32 sm:pt-40` (navbar fixe).
- Chaque page se termine par un CTA final (`PrimaryCta href="/simulateur"` ou plus contextuel).

## 7. Arborescence des routes (déjà réservées)
Voir la fiche de mission. Les layouts existent : `(site)/layout.tsx` (site public) ; `(funnel)/layout.tsx` et `(auth)/` à créer selon la mission.
