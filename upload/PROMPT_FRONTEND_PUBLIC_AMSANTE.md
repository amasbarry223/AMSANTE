# PROMPT — Frontend public AMSANTÉ (Next.js · GSAP · Motion · Three.js)

> À coller tel quel dans Claude Code / Cursor / v0. Le prompt est autoportant.

---

## 0. RÔLE ET MÉTHODE DE TRAVAIL

Tu es **Lead Frontend Engineer & Creative Developer senior**, habitué des sites primés **Awwwards (Site of the Day / Developer Award)** et des portfolios Dribbble de haut niveau. Tu maîtrises Next.js App Router, TypeScript strict, GSAP + ScrollTrigger, Motion (ex-Framer Motion), Lenis, React Three Fiber, l'accessibilité et la performance web.

Ta mission : construire **la partie publique** (site + parcours publics) de **AMSANTÉ**, une plateforme d'assurance santé 100 % digitale au Mali. **Le back-office et les espaces connectés ne sont PAS dans le périmètre** : les boutons « Mon espace » renvoient vers `/connexion`, et la connexion se termine par une redirection simulée vers `APP_URL`.

**Méthode imposée :**
1. Commence par me présenter : l'arborescence, le design system (tokens), le système de motion, la liste des composants. **Attends ma validation.**
2. Puis développe **par phases** (voir §12). À la fin de chaque phase : `pnpm build` sans erreur, Lighthouse vérifié, courte liste de ce qui est fait / reste à faire.
3. Aucun texte « lorem ipsum » : rédige de vrais textes en français, clairs, chaleureux, sans jargon d'assureur.
4. Ne jamais inventer de témoignages, de chiffres clés ou de logos de partenaires présentés comme réels : utilise des **placeholders explicitement marqués** (`{/* TODO: remplacer par un vrai témoignage */}`) et des données mock dans `/data`.

---

## 1. LE PRODUIT EN BREF

AMSANTÉ dématérialise l'assurance santé gérée par un cabinet de courtage : souscription en ligne, **carte d'assuré digitale avec QR code**, prise en charge directe chez les prestataires de soins conventionnés (tiers payant), remboursements en **Mobile Money** (Orange Money, Moov Africa Money, Wave), suivi en temps réel.

**Publics du site public :**
| Public | Ce qu'il vient faire |
|---|---|
| Particulier / famille | Comprendre, simuler sa prime, souscrire en ligne, payer en Mobile Money |
| Entreprise (RH, DG) | Demander un devis groupe pour ses salariés |
| Prestataire de soins (clinique, pharmacie, labo) | Comprendre le tiers payant, devenir partenaire conventionné |
| Assuré existant | Se connecter, déclarer un sinistre, trouver un prestataire, vérifier une attestation |
| Cabinet de courtage | Découvrir l'offre SaaS AMSANTÉ et demander une démo |

**Formules (données mock) :** Essentiel · Confort · Premium. Garanties : consultation, pharmacie, hospitalisation, maternité, analyses, imagerie, dentaire, optique, évacuation. Chaque garantie a un taux de couverture (ex. 80 %) et un plafond annuel en FCFA.

---

## 2. DIRECTION ARTISTIQUE

### 2.1 Concept : « Le soin, sans papier »
Le récit visuel du site est **la transformation du papier en confiance digitale** : les dossiers, les feuilles de soins et les cartes cartonnées se dissolvent en particules qui se recomposent en une **carte d'assuré lumineuse**, l'objet signature de la marque. Cette carte revient comme fil rouge dans tout le site (hero, souscription, confirmation, vérification).

**Références de ton et de qualité** (s'inspirer du niveau, ne rien copier) : la clarté produit de Stripe et Linear, la chaleur et l'illustration des néo-assureurs santé type Alan ou Oscar, la narration au scroll des lauréats Awwwards en fintech/santé. **Résultat attendu** : premium, lumineux, rassurant, humain, jamais froid ni « clinique ».

### 2.2 Identité africaine contemporaine, sans cliché
- Motif graphique propriétaire inspiré du **bogolan** (lignes, points, chevrons) dessiné en **SVG fin (1 px)**, utilisé en texture de fond très discrète (opacité 4–6 %) et en séparateurs animés (tracé au scroll).
- Photographies : personnes maliennes réelles dans des situations de soin et de vie quotidienne, lumière naturelle chaude. En dev : placeholders `next/image` avec `blurDataURL`, dossier `/public/images/placeholders`.
- Pas de clipart médical (pas de croix rouges, pas de stéthoscopes génériques).

### 2.3 Design tokens (Tailwind v4 `@theme`, variables CSS)

**Couleurs**
| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0B1F1E` | Texte principal, sections sombres |
| `--teal-900` | `#0F5B57` | Couleur de marque, CTA principal |
| `--teal-500` | `#17A398` | Accents, liens, états actifs |
| `--teal-100` | `#E3F4F1` | Fonds de cartes, surbrillances |
| `--sand-50` | `#F7F4EE` | Fond général (crème chaud, pas de blanc pur) |
| `--sand-200` | `#EAE3D6` | Bordures, séparateurs |
| `--ochre-500` | `#E07A3F` | Accent chaud (badges « Nouveau », points d'attention, 1 usage par écran max.) |
| `--success` | `#1F9D55` · `--warning` `#D9A21B` · `--danger` `#D64545` | États |

Mode clair par défaut ; sections « immersives » (hero 3D, storytelling, footer) en `--ink`. **Pas de dark mode global** dans cette version.

**Typographie** (via `next/font/google`, `display: swap`, sous-ensemble latin)
- Titres : **Bricolage Grotesque** (600–800), titres XXL fluides `clamp(3rem, 8vw, 7.5rem)`, interlettrage −0,03em.
- Texte : **Geist** (400–600), 16–18 px, interligne 1,6.
- Chiffres (primes, plafonds, compteurs) : **Geist Mono** avec `font-variant-numeric: tabular-nums`.
- Échelle typographique fluide : 12 / 14 / 16 / 18 / 20 / 24 / 32 / 48 / 64 / 96 / 120.

**Formes et profondeur**
- Rayons : 10 px (inputs), 16 px (cartes), 28 px (grands panneaux), 999 px (pills, CTA).
- Ombres douces teintées teal : `0 1px 2px rgb(15 91 87 / .06), 0 12px 32px -12px rgb(15 91 87 / .18)`.
- Verre dépoli (`backdrop-blur-xl` + `bg-white/60` + bordure `white/40`) **uniquement** pour la navbar et les panneaux flottants.
- Grille : 12 colonnes, conteneur max 1320 px, gouttière 24 px, marges latérales `clamp(20px, 5vw, 64px)`.

**Formats**
- Montants : `Intl.NumberFormat('fr-FR')` + « FCFA », sans décimales : `12 500 FCFA`.
- Dates JJ/MM/AAAA. Téléphones : `+223 XX XX XX XX` avec masque de saisie.

---

## 3. SYSTÈME DE MOTION : LA RÈGLE DE COHÉRENCE

Le site doit sembler animé par **une seule main**. Toutes les animations passent par des tokens centralisés dans `lib/motion/tokens.ts`.

```ts
export const ease = {
  out: [0.16, 1, 0.3, 1],        // "expo.out" : entrées, révélations
  inOut: [0.65, 0, 0.35, 1],     // transitions de page, morphings
  spring: { type: "spring", stiffness: 260, damping: 26 }, // UI interactive
};
export const duration = { micro: 0.18, fast: 0.35, base: 0.6, slow: 1.0, story: 1.4 };
export const stagger = { tight: 0.04, base: 0.08, loose: 0.14 };
```
Les mêmes valeurs sont enregistrées dans GSAP via `CustomEase.create("amsOut", "0.16,1,0.3,1")`.

**Partage des responsabilités (règle absolue : jamais deux librairies sur le même élément)**
| Outil | Rôle |
|---|---|
| **GSAP + ScrollTrigger + SplitText** | Tout ce qui dépend du scroll : sections épinglées, scrub, révélations de titres, tracés SVG, parallaxe |
| **Motion (`motion/react`)** | États d'interface : hover, tap, layout animations, `AnimatePresence`, étapes du tunnel, modales, toasts, compteurs |
| **Lenis** | Défilement fluide global, synchronisé avec `ScrollTrigger.update` via `gsap.ticker` |
| **React Three Fiber + drei** | Une seule scène 3D signature (hero) + une scène légère réutilisée (carte en confirmation) |
| **View Transitions / `template.tsx`** | Transitions entre pages |

**Vocabulaire de mouvement (et rien d'autre)**
1. **Révélation de titre** : SplitText par lignes, chaque ligne monte depuis un masque (`yPercent: 110 → 0`), `duration.slow`, `stagger.base`, `amsOut`.
2. **Apparition de bloc** : `opacity 0 → 1`, `y 24 → 0`, `duration.base`, déclenché à 80 % du viewport, une seule fois.
3. **Hover carte** : élévation `y -4`, ombre renforcée, inclinaison 3D légère (≤ 6°) suivant la souris (desktop uniquement).
4. **Bouton magnétique** pour les CTA principaux : attraction ≤ 10 px, ressort `ease.spring`.
5. **Compteur** : montants interpolés avec un ressort Motion (`useSpring` + `useTransform`), jamais de saut brut.
6. **Tracé** : les motifs bogolan et les lignes de timeline se dessinent au scroll (`stroke-dashoffset`).
7. **Transition de page** : rideau teal qui monte puis se retire (0,6 s), le titre de la page suivante se révèle ensuite.

**Garde-fous**
- `prefers-reduced-motion: reduce` → Lenis désactivé, scrub remplacé par de simples fondus, 3D remplacée par une image fixe, durées ≤ 0,2 s.
- Curseur personnalisé (point + anneau qui grossit sur les éléments interactifs) **uniquement** sur pointeur fin (`(pointer: fine)`), jamais de masquage du curseur natif sur les champs de saisie.
- Aucune animation ne bloque une action : un CTA est cliquable dès son apparition.
- Nettoyage systématique : `useGSAP()` (`@gsap/react`) avec `scope`, `ScrollTrigger.refresh()` après chargement des polices et images.

---

## 4. STACK TECHNIQUE

- **Next.js 15 (App Router)**, React 19, **TypeScript strict**, pnpm.
- **Tailwind CSS v4** + `tailwind-merge` + `class-variance-authority`.
- **shadcn/ui** (Radix) comme base accessible, **entièrement re-stylé** aux tokens AMSANTÉ (aucun look shadcn par défaut visible).
- **gsap** (ScrollTrigger, SplitText, CustomEase, DrawSVG, Flip ; tous gratuits) + `@gsap/react`.
- **motion** (`motion/react`), **lenis** (`lenis/react`).
- **three**, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (bloom léger uniquement).
- Formulaires : **react-hook-form** + **zod** ; masque téléphone `+223`.
- État du tunnel : **zustand** avec `persist` (reprise de la souscription après fermeture).
- Carte des prestataires : **MapLibre GL** (`react-map-gl/maplibre`) avec un style de tuiles gratuit, chargée à la demande.
- Scan QR (page Vérifier) : `@zxing/browser` chargé à la demande.
- Icônes : **lucide-react** (trait 1,5). Illustrations : SVG maison.
- Qualité : ESLint, Prettier, Vitest + Testing Library (logique du simulateur et des schémas), Playwright (parcours critiques).

**Couche données mock (le backend sera branché plus tard)**
- `lib/api/*.ts` : fonctions typées (`getProducts`, `quote`, `createSubscription`, `requestOtp`, `verifyOtp`, `initMobileMoneyPayment`, `getPaymentStatus`, `searchProviders`, `verifyCertificate`, `submitB2BQuote`, `submitProviderApplication`, `requestDemo`).
- Implémentation mock avec latence simulée (400–1 200 ms) et cas d'erreur déclenchables (ex. numéro finissant par `0000` → paiement refusé ; code OTP `000000` → invalide).
- Un fichier `.env` `NEXT_PUBLIC_API_MODE=mock|live` permet de basculer plus tard sans toucher l'UI.

---

## 5. ARBORESCENCE DES PAGES

```
/                         Accueil (storytelling + simulateur express)
/assurance-sante          Formules et garanties (comparateur)
/simulateur               Simulateur complet (page dédiée, partageable)
/souscrire                Tunnel de souscription en 7 étapes
/souscrire/confirmation   Confirmation + carte digitale révélée
/entreprises              Offre groupe salariés
/entreprises/devis        Formulaire devis entreprise (multi-étapes)
/prestataires             Annuaire + carte des prestataires conventionnés
/prestataires/devenir-partenaire   Candidature prestataire
/comment-ca-marche        Parcours de soin, tiers payant, remboursement
/verifier                 Vérification d'une carte / attestation (QR ou code)
/cabinets                 Offre SaaS pour cabinets de courtage + tarifs + démo
/aide                     Centre d'aide, FAQ recherchable, contact WhatsApp
/connexion                Choix du profil + authentification
/connexion/otp            Saisie du code reçu
/legal/*                  Mentions légales, confidentialité, CGU
not-found / error         Pages 404 et 500 travaillées (dans le style du site)
```

---

## 6. COMPOSANTS GLOBAUX

- **Navbar** : transparente sur le hero, devient verre dépoli après 80 px de scroll ; se masque au scroll vers le bas, réapparaît au scroll vers le haut. Liens : Assurance santé · Entreprises · Prestataires · Comment ça marche · Cabinets. À droite : `Se connecter` (lien) + `Simuler ma prime` (CTA magnétique). Mega-menu animé (Motion `layoutId` pour l'indicateur de survol) pour « Assurance santé » et « Prestataires ».
- **Menu mobile/tablette** : panneau plein écran, liens révélés en stagger, mais le site est d'abord pensé **desktop web** (≥ 1280 px), puis rendu propre jusqu'à 768 px et utilisable jusqu'à 375 px.
- **Barre d'action flottante** (« Dock ») : apparaît après le hero, en bas au centre, pill en verre : `Simuler` · `Trouver un prestataire` · `WhatsApp`. Se cache au-dessus du footer.
- **Footer immersif** (`--ink`) : grand wordmark AMSANTÉ en Bricolage 20vw qui se révèle au scroll, motif bogolan tracé, colonnes de liens, numéros utiles, mention réglementaire (intermédiaire d'assurance agréé, n° d'agrément en placeholder).
- **Préchargeur** (1re visite uniquement, ≤ 1,2 s) : le logo se trace en SVG puis s'ouvre en rideau. Ignoré si `reduced-motion` ou visite répétée (sessionStorage).
- **Toasts**, **Modale**, **Drawer**, **Tooltip**, **Stepper**, **OTPInput** (6 cases, collage du code, autosubmit, renvoi après 60 s avec compte à rebours), **PhoneInput** (+223), **AmountDisplay** (compteur animé), **FileDropzone** (compression d'image côté client avant envoi), **InsuranceCard3D** et **InsuranceCard2D** (fallback).

---

## 7. PAGE D'ACCUEIL : SECTION PAR SECTION

1. **Hero 3D (100 vh, fond `--ink`)**
   - Scène R3F : la **carte d'assuré AMSANTÉ** (verre teal translucide, bords lumineux, QR code gravé, puce dorée) flotte au centre, entourée d'un nuage de ~3 000 particules qui évoquent des fragments de papier.
   - Souris : la carte s'incline (≤ 12°) et les particules réagissent légèrement (répulsion douce).
   - Scroll (scrub GSAP, section épinglée sur ~150 vh) : la carte pivote et montre son verso (QR), les particules se rassemblent en un halo protecteur, puis la caméra recule pour laisser place à la section suivante.
   - Texte à gauche : titre révélé ligne par ligne, par ex. « Votre santé, couverte. Sans papier, sans attente. », sous-titre d'une ligne, 2 CTA : `Simuler ma prime` (primaire) · `Je suis une entreprise` (secondaire), réassurance : « Remboursé en Mobile Money · Carte digitale immédiate · Réseau de soins à Bamako ».
   - Fallback (mobile, `saveData`, GPU faible détecté via `detect-gpu`, reduced-motion) : image AVIF statique de la carte + léger parallaxe CSS.

2. **Bandeau partenaires** : défilement infini de logos de compagnies d'assurance et de prestataires (placeholders gris marqués TODO), pause au survol.

3. **« Du papier au digital » (storytelling épinglé, 4 étapes)**
   Section épinglée, à gauche les étapes, à droite une maquette d'interface qui se transforme (GSAP Flip) :
   1. *Je simule et je souscris en 5 minutes* → mini simulateur.
   2. *Je reçois ma carte digitale* → la carte apparaît dans un téléphone.
   3. *Je me soigne sans avancer les frais* → le QR est scanné à l'accueil d'une clinique, réponse « Droits ouverts ✓ ».
   4. *Je suis remboursé en Mobile Money* → notification « 25 000 FCFA reçus ».
   Barre de progression verticale tracée en SVG.

4. **Simulateur express (intégré)** : 3 contrôles seulement (je m'assure seul·e / en couple / en famille ; nombre d'enfants avec avatars qu'on ajoute ou retire ; âge de l'adhérent via slider). Les 3 formules s'affichent en cartes avec la prime mensuelle qui s'anime en temps réel. CTA `Continuer avec Confort` pré-remplit `/souscrire`.

5. **Garanties interactives** : grille de 9 tuiles (consultation, pharmacie, hospitalisation…). Au survol / focus, la tuile s'étend (Motion layout) et affiche taux et plafond pour la formule sélectionnée via un segmented control en haut. Changement de formule → les chiffres s'animent.

6. **Pour qui ? (3 panneaux horizontaux)** : Particuliers · Entreprises · Prestataires. Scroll horizontal épinglé (GSAP) sur desktop ; chaque panneau a sa photo, 3 bénéfices et son CTA.

7. **Réseau de soins** : mini-carte de Bamako stylisée (SVG, pas encore MapLibre) avec points pulsants des prestataires, compteur « XX prestataires conventionnés » (placeholder), CTA `Trouver un prestataire`.

8. **Chiffres et confiance** : 4 compteurs animés (placeholders), badges sécurité (données chiffrées, conformité, paiement agréé) ; zone témoignages vide prête à recevoir de vrais avis (TODO visible en dev uniquement).

9. **FAQ** (6 questions clés, accordéon Motion) + lien vers `/aide`.

10. **CTA final** : grande carte teal plein écran, titre XXL, la carte 2D flotte, bouton magnétique `Simuler ma prime`.

---

## 8. WORKFLOWS : CHAQUE PARCOURS EN DÉTAIL

Principes communs à tous les tunnels :
- **Une décision par écran**, bouton principal toujours au même endroit, retour possible sans perte.
- Stepper en haut (Motion `layoutId` pour l'indicateur), progression en %.
- Transitions entre étapes : glissement horizontal de 40 px + fondu (`AnimatePresence mode="wait"`), direction inversée au retour.
- Récapitulatif vivant (colonne de droite sur desktop, sticky) qui se met à jour à chaque saisie avec la prime animée.
- Sauvegarde automatique (zustand persist) + bandeau « Reprendre ma souscription » si l'utilisateur revient.
- Validation zod en ligne, messages d'erreur humains (« Ce numéro doit contenir 8 chiffres après +223 »).
- États vides, chargement (skeletons au rythme du motion system) et erreurs conçus pour chaque écran.

### 8.1 Souscription particulier / famille : `/souscrire`
1. **Qui assurer ?** Seul·e / Couple / Famille → ajout des bénéficiaires sous forme de cartes-avatars (prénom, date de naissance, lien). Ajout/retrait animé (Motion layout).
2. **Formule** : 3 cartes comparatives, la recommandée mise en avant (badge ocre), bascule mensuel / trimestriel / annuel (remise affichée), tableau détaillé dépliable.
3. **Vos informations** : nom, téléphone (+223), e-mail facultatif, adresse (commune / quartier), pièce d'identité (NINA ou autre).
4. **Documents** : photo d'identité de chaque bénéficiaire et pièce d'identité (dropzone, aperçu, recadrage carré, compression automatique < 300 Ko).
5. **Récapitulatif et signature** : récap complet, cases de consentement (CGU, traitement des données), signature par **code OTP envoyé par SMS** (OTPInput).
6. **Paiement Mobile Money** : choix de l'opérateur (Orange Money, Moov Africa Money, Wave : grandes tuiles avec leurs couleurs), numéro payeur, bouton `Payer 12 500 FCFA`. Écran d'attente : « Validez le paiement sur votre téléphone », animation de téléphone qui vibre, compte à rebours de 2 min, sondage du statut (`getPaymentStatus`) toutes les 3 s. Gestion succès / refus / expiration avec option « Réessayer » ou « Changer de moyen de paiement ».
7. **Confirmation** (`/souscrire/confirmation`) : moment signature. Confettis sobres teal/ocre, puis la **carte d'assuré 3D se matérialise** (particules → carte), retournable au clic. Actions : `Télécharger ma carte (PDF)`, `Ajouter à l'écran d'accueil`, `Accéder à mon espace` → `/connexion`. Rappel des prochaines étapes (délai de carence, activation du compte).

### 8.2 Devis entreprise : `/entreprises/devis`
1. Entreprise (raison sociale, secteur, ville, RCCM facultatif).
2. Effectif : nombre de salariés et d'ayants droit (sliders + champs), ou **import de la liste Excel** (modèle téléchargeable, aperçu des 5 premières lignes, détection d'erreurs).
3. Besoins : formule souhaitée, garanties prioritaires, budget indicatif par salarié.
4. Contact (nom, fonction, téléphone, e-mail, créneau de rappel).
5. Confirmation : estimation indicative de la prime annuelle (fourchette animée) + « Un conseiller vous rappelle sous 24 h ouvrées ».

### 8.3 Trouver un prestataire : `/prestataires`
- Mise en page partagée : liste à gauche, carte MapLibre à droite (chargée en différé, squelette en attendant).
- Filtres en pills : type (clinique, hôpital, pharmacie, laboratoire, imagerie, dentaire, optique), commune, ouvert maintenant, garde 24 h/24.
- Recherche instantanée (debounce 250 ms), bouton « Autour de moi » (géolocalisation avec explication avant la demande d'autorisation).
- Survol d'une fiche = le point correspondant pulse sur la carte et inversement. Fiche détaillée en drawer : adresse, horaires, téléphone, services couverts, itinéraire (lien Google Maps).

### 8.4 Devenir prestataire partenaire : `/prestataires/devenir-partenaire`
Page argumentaire (avantages du tiers payant, paiement rapide, flux de patients) puis formulaire en 4 étapes : établissement · responsable · services et tarifs (upload de la grille) · documents d'agrément → confirmation avec numéro de dossier.

### 8.5 Vérifier une carte ou une attestation : `/verifier`
Deux onglets : **Scanner le QR** (caméra, cadre de visée animé, retour haptique visuel) ou **Saisir le code**. Résultat :
- ✓ Valide : carte verte avec nom masqué partiellement (« A. D***** »), formule, validité. Aucune donnée médicale.
- ✗ Invalide / expirée : carte rouge + conseil d'action.
Animation : le cadre de scan se referme sur la carte, puis le résultat se retourne (flip).

### 8.6 Connexion : `/connexion`
1. **Choisir son profil** : 4 grandes cartes (Assuré · Entreprise · Prestataire · Cabinet), icône + description courte.
2. **Assuré** : numéro de téléphone → OTP (6 chiffres) → code PIN (4 chiffres, pavé numérique visuel). Lien « Première connexion ? Activez votre compte ».
3. **Entreprise / Prestataire / Cabinet** : e-mail + mot de passe → OTP. Affichage/masquage du mot de passe, Caps Lock détecté.
4. Erreurs : tentative restante affichée, verrouillage temporaire avec compte à rebours, renvoi d'OTP limité.
5. Succès : animation de transition (le rideau teal) puis redirection simulée vers `APP_URL` avec un écran « Ouverture de votre espace… ».
Mise en page : écran scindé, formulaire à gauche, visuel animé à droite propre à chaque profil (la carte pour l'assuré, la carte réseau pour le prestataire, un dashboard flouté pour le cabinet).

### 8.7 Déclarer un sinistre (depuis le public)
CTA `Déclarer un remboursement` (accueil, aide, footer) → explication en 3 étapes illustrées (photo de la facture, envoi, remboursement Mobile Money) → `/connexion?redirect=/sinistres/nouveau`.

### 8.8 Cabinets de courtage : `/cabinets`
Page SaaS B2B dans le même langage visuel mais plus « produit » : hero avec capture d'interface animée du back-office (images floutées / maquettes, pas de vraies données), modules en bento grid animé (Clients · Contrats · Sinistres · Mobile Money · Commissions · Reporting), section sécurité (RBAC, double authentification, journal d'audit), **tarifs** en 3 plans (Essentiel 75 000 FCFA / Professionnel 200 000 FCFA / Entreprise sur devis, valeurs à confirmer) avec bascule mensuel/annuel animée, formulaire **« Demander une démo »** (modale en 2 étapes).

### 8.9 Centre d'aide : `/aide`
Recherche plein texte instantanée (Fuse.js) sur la FAQ, catégories en cartes, articles en accordéon, bouton WhatsApp flottant (lien `wa.me`) et numéro d'appel.

---

## 9. PERFORMANCE : CONTEXTE MALI / RÉSEAU MOBILE

Le site doit être spectaculaire sur une bonne connexion **et** rester rapide en 3G/4G à Bamako.
- Budgets : JS initial de l'accueil ≤ 180 Ko gzip (hors chunk 3D) ; LCP ≤ 2,5 s en 4G ; CLS ≤ 0,05 ; INP ≤ 200 ms. Lighthouse ≥ 90 sur les 4 catégories (mobile), ≥ 95 desktop.
- Three.js, MapLibre, ZXing, Fuse : **imports dynamiques** (`next/dynamic`, `ssr: false`), chargés après l'interaction ou à l'approche du viewport (`IntersectionObserver`).
- Chargement 3D conditionnel : seulement si `(pointer: fine)`, largeur ≥ 1024 px, pas de `navigator.connection.saveData`, `effectiveType` ≠ `2g/3g`, GPU tier ≥ 2. Sinon fallback image.
- Scène 3D : géométries simples, textures KTX2 / ≤ 512 px, `dpr={[1, 1.5]}`, `frameloop="demand"` quand la scène est hors écran, pause sur `visibilitychange`.
- Images : `next/image` AVIF/WebP, `sizes` correct, `priority` uniquement sur l'image LCP.
- Polices : 2 familles max + mono, `preload` uniquement du poids titre.
- Server Components par défaut ; `"use client"` uniquement pour les îlots interactifs.

---

## 10. ACCESSIBILITÉ ET QUALITÉ D'INTERFACE

- WCAG 2.2 AA : contrastes vérifiés (y compris texte sur verre dépoli), focus visible personnalisé (anneau teal 2 px + offset), navigation clavier complète des tunnels, `aria-live="polite"` sur la prime et les statuts de paiement.
- Les sections épinglées restent lisibles et navigables au clavier ; liens d'évitement « Aller au contenu ».
- Cibles tactiles ≥ 44 px, labels toujours visibles (pas de placeholder seul).
- SEO : metadata API par page, Open Graph générés (`opengraph-image.tsx` avec la carte), `sitemap.ts`, `robots.ts`, données structurées `InsuranceAgency` et `FAQPage`.
- `lang="fr"`, textes prêts pour i18n (dictionnaire centralisé `content/fr.ts`) : bambara prévu plus tard.

---

## 11. STRUCTURE DU CODE

```
app/
  (site)/layout.tsx           Navbar, Footer, Dock, Lenis, transitions
  (site)/page.tsx
  (site)/assurance-sante/ … (site)/cabinets/ … (site)/aide/
  (funnel)/layout.tsx         Layout épuré des tunnels (logo + stepper + sortie)
  (funnel)/souscrire/ … (funnel)/entreprises/devis/ …
  (auth)/connexion/ …
  template.tsx                Transition de page
components/
  ui/            Primitives re-stylées (Button, Input, OTPInput, PhoneInput, Card…)
  motion/        Reveal, SplitHeading, Magnetic, Counter, DrawPath, PinnedStory, HorizontalScroll
  three/         HeroScene, InsuranceCard3D, Particles, Fallbacks
  sections/      Sections de l'accueil et des pages
  funnel/        Stepper, StepShell, LiveSummary, MobileMoneyPay…
  layout/        Navbar, MegaMenu, Dock, Footer, Preloader, Cursor
lib/
  motion/        tokens.ts, gsap.ts (enregistrement plugins + CustomEase), lenis.tsx
  api/           Contrats typés + implémentation mock
  pricing/       Moteur de calcul de prime (pur, testé)
  utils/         format (FCFA, téléphone, dates), device (capacités 3D)
data/            products.ts, guarantees.ts, providers.ts, faq.ts
content/         fr.ts (tous les textes)
stores/          subscription.ts, b2bQuote.ts
```

---

## 12. PHASES DE LIVRAISON

| Phase | Contenu | Critère de validation |
|---|---|---|
| 1. Fondations | Setup, tokens, polices, primitives UI, motion system (Lenis + GSAP + Motion), layout, navbar, footer, transitions | Page « kitchen sink » `/dev/ui` montrant tous les composants et animations |
| 2. Accueil | Toutes les sections du §7, hero 3D + fallback | Lighthouse accueil ≥ 90 mobile, 60 fps desktop |
| 3. Simulateur et souscription | Moteur de prime testé, `/simulateur`, tunnel `/souscrire` complet avec Mobile Money mock et confirmation 3D | Parcours Playwright vert : simulation → paiement → carte |
| 4. Pages publics | Assurance santé, Entreprises + devis, Prestataires + carte, Devenir partenaire, Comment ça marche | Tous les formulaires validés zod, états vides/erreurs présents |
| 5. Auth et utilitaires | Connexion multi-profils + OTP + PIN, Vérifier (QR), Aide, Cabinets, 404/500, légal | Navigation clavier complète, axe-core sans erreur |
| 6. Polish | Micro-interactions, audit de cohérence motion, SEO, perf, tests reduced-motion et réseau lent | Checklist §13 entièrement cochée |

---

## 13. CHECKLIST FINALE DE COHÉRENCE

- [ ] Toutes les durées et courbes proviennent de `lib/motion/tokens.ts` (aucune valeur en dur).
- [ ] Une seule façon de révéler un titre, d'apparaître, de survoler, de changer d'étape.
- [ ] Aucun élément animé à la fois par GSAP et Motion.
- [ ] Le CTA primaire a la même forme, la même couleur et le même comportement magnétique partout.
- [ ] La carte d'assuré est identique (proportions, matières) dans le hero, le tunnel, la confirmation et `/verifier`.
- [ ] Tous les montants en FCFA formatés identiquement, en Geist Mono tabulaire.
- [ ] Chaque tunnel : stepper, récap vivant, sauvegarde, retour sans perte, états d'erreur.
- [ ] `prefers-reduced-motion` testé sur chaque page ; site entièrement utilisable sans 3D ni JavaScript lourd.
- [ ] Test en throttling « Fast 3G » : contenu lisible en moins de 4 s.
- [ ] Aucun faux témoignage, faux chiffre ou faux logo présenté comme réel en production.

**Commence maintenant par l'étape 1 de la méthode : présente l'arborescence, les tokens, le motion system et la liste des composants, puis attends ma validation.**
