"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  Hospital,
  Loader2,
  LockKeyhole,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { InsuranceCard2D } from "@/components/cards/InsuranceCard2D";
import { BogolanTexture } from "@/components/layout/BogolanPattern";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { fr } from "@/content/fr";
import { requestOtp } from "@/lib/api";
import { duration, ease } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { isValidMalianPhone } from "@/lib/utils/format";

/* Clés partagées avec /connexion/otp — le téléphone (ou l’e-mail pro) transite via sessionStorage. */
const OTP_IDENTITY_KEY = "amsante-otp-phone";
const OTP_PROFILE_KEY = "amsante-otp-profile";

type ProfileId = (typeof fr.connexion.profiles)[number]["id"];
type View = "profiles" | "assure" | "pro";

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;

const profileIcons: Record<ProfileId, LucideIcon> = {
  assure: UserRound,
  entreprise: Building2,
  prestataire: Hospital,
  cabinet: Briefcase,
};

const profileCaptions: Record<ProfileId, string> = {
  assure: "Votre carte, vos remboursements et vos proches — dans votre poche.",
  entreprise: "Salariés, contrats groupe et factures, gérés au même endroit.",
  prestataire: "Tiers payant, patients conventionnés et versements en un coup d’œil.",
  cabinet: "Portefeuille, sinistres et commissions, mis à jour en temps réel.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginFlow() {
  const router = useRouter();
  const [view, setView] = useState<View>("profiles");
  const [selected, setSelected] = useState<ProfileId>("assure");

  // Assuré
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Profils pro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const [sending, setSending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Compte à rebours du verrouillage temporaire (30 s après 3 échecs).
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const t = setInterval(() => setLockSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [lockSeconds]);

  const registerFailure = (message: string) => {
    const next = attempts + 1;
    setFeedback(null);
    if (next >= MAX_ATTEMPTS) {
      // Mock : au 3e échec, on verrouille 30 s puis on remet le compteur à zéro.
      setAttempts(0);
      setLockSeconds(LOCK_SECONDS);
      toast.warning("Trop de tentatives — réessayez dans 30 secondes.");
      return;
    }
    setAttempts(next);
    const remaining = MAX_ATTEMPTS - next;
    setFeedback(
      `${message} ${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`
    );
  };

  const persistAndGo = (identifier: string, profile: ProfileId) => {
    sessionStorage.setItem(OTP_IDENTITY_KEY, identifier);
    sessionStorage.setItem(OTP_PROFILE_KEY, profile);
    router.push("/connexion/otp");
  };

  const submitAssure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockSeconds > 0 || sending) return;
    if (!isValidMalianPhone(phone)) {
      setPhoneError("Numéro malien invalide (8 chiffres, ex. 70 00 00 00).");
      return;
    }
    setPhoneError(null);
    setSending(true);
    try {
      await requestOtp(phone);
      persistAndGo(phone, "assure");
    } catch (err) {
      registerFailure(err instanceof Error ? err.message : "Envoi du code impossible.");
      toast.error("Envoi du code impossible. Vérifiez votre numéro.");
    } finally {
      setSending(false);
    }
  };

  const submitPro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockSeconds > 0 || sending) return;
    if (!EMAIL_RE.test(email.trim())) {
      registerFailure("Adresse e-mail invalide.");
      return;
    }
    if (password.length < 4) {
      registerFailure("Mot de passe trop court.");
      return;
    }
    // Mock de démo : la 3e tentative d’envoi échoue systématiquement
    // pour démontrer le verrouillage temporaire de 30 secondes.
    if (attempts + 1 >= MAX_ATTEMPTS) {
      registerFailure("Connexion refusée par le serveur.");
      return;
    }
    setSending(true);
    try {
      // Simulation `requestOtp` sur l’e-mail (le mock OTP officiel attend un téléphone).
      await new Promise((r) => setTimeout(r, 700));
      persistAndGo(email.trim(), selected);
    } finally {
      setSending(false);
    }
  };

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  const locked = lockSeconds > 0;

  return (
    <div className="flex-1 lg:grid lg:grid-cols-2">
      {/* ── Panneau formulaire ──────────────────────────────────────── */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" initial={false}>
            {view === "profiles" && (
              <motion.div
                key="profiles"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: duration.fast, ease: ease.out }}
              >
                <SplitHeading
                  as="h1"
                  trigger={false}
                  className="font-display text-[clamp(1.8rem,3.4vw,2.4rem)] font-bold text-ink"
                >
                  Connexion à votre espace
                </SplitHeading>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Choisissez votre profil pour continuer — chaque espace a ses outils,
                  la connexion reste la même simplicité.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {fr.connexion.profiles.map((p) => {
                    const Icon = profileIcons[p.id];
                    const active = selected === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelected(p.id);
                          setView(p.id === "assure" ? "assure" : "pro");
                        }}
                        aria-pressed={active}
                        className={cn(
                          "flex min-h-28 flex-col items-start gap-1.5 rounded-[16px] border-2 bg-white p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                          active
                            ? "border-teal-600"
                            : "border-sand-200 hover:border-teal-500/50"
                        )}
                      >
                        <span className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <span className="mt-1 font-display text-[15px] font-bold text-ink">
                          {p.title}
                        </span>
                        <span className="text-[12.5px] leading-snug text-muted-foreground">
                          {p.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-7 text-center text-[13.5px] text-muted-foreground">
                  Première connexion ?{" "}
                  {/* TODO: page d'aide /activation à créer */}
                  <Link
                    href="/aide"
                    title="Page d’aide — bientôt disponible"
                    className="link-underline font-semibold text-teal-700"
                  >
                    Activez votre compte
                  </Link>
                </p>
              </motion.div>
            )}

            {view === "assure" && (
              <motion.div
                key="assure"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: duration.fast, ease: ease.out }}
              >
                <button
                  type="button"
                  onClick={() => setView("profiles")}
                  className="inline-flex min-h-11 items-center gap-2 text-[13.5px] font-semibold text-muted-foreground transition-colors hover:text-teal-700"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Changer de profil
                </button>
                <h1 className="mt-3 font-display text-2xl font-bold text-ink">
                  Espace assuré
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  Saisissez votre numéro de téléphone : nous vous envoyons un code à 6
                  chiffres par SMS.
                </p>

                <form onSubmit={submitAssure} className="mt-7 space-y-5" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-phone">Numéro de téléphone</Label>
                    <PhoneInput
                      value={phone}
                      onChange={(raw) => {
                        setPhone(raw);
                        setPhoneError(null);
                      }}
                      error={phoneError ?? undefined}
                      aria-invalid={!!phoneError}
                    />
                  </div>

                  {feedback && (
                    <p className="rounded-[12px] bg-destructive/10 px-4 py-3 text-[13.5px] font-medium text-destructive" role="alert">
                      {feedback}
                    </p>
                  )}

                  {locked && <LockNotice seconds={lockSeconds} />}

                  <Button type="submit" size="lg" className="min-h-12 w-full" disabled={locked || sending}>
                    {sending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                    {sending ? "Envoi du code…" : "Recevoir mon code"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-[13.5px] text-muted-foreground">
                  Première connexion ?{" "}
                  {/* TODO: page d'aide /activation à créer */}
                  <Link
                    href="/aide"
                    title="Page d’aide — bientôt disponible"
                    className="link-underline font-semibold text-teal-700"
                  >
                    Activez votre compte
                  </Link>
                </p>
              </motion.div>
            )}

            {view === "pro" && (
              <motion.div
                key="pro"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: duration.fast, ease: ease.out }}
              >
                <button
                  type="button"
                  onClick={() => setView("profiles")}
                  className="inline-flex min-h-11 items-center gap-2 text-[13.5px] font-semibold text-muted-foreground transition-colors hover:text-teal-700"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Changer de profil
                </button>
                <h1 className="mt-3 font-display text-2xl font-bold text-ink">
                  Espace{" "}
                  {fr.connexion.profiles.find((p) => p.id === selected)?.title.toLowerCase()}
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  Connectez-vous avec vos identifiants professionnels : un code de
                  confirmation vous est ensuite envoyé par e-mail.
                </p>

                <form onSubmit={submitPro} className="mt-7 space-y-5" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">Adresse e-mail professionnelle</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@structure.ml"
                      autoComplete="username"
                      className="h-12 rounded-[10px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={checkCapsLock}
                        onKeyUp={checkCapsLock}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-12 rounded-[10px] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        aria-pressed={showPassword}
                        className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-teal-100/70 hover:text-teal-900"
                      >
                        {showPassword ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
                      </button>
                    </div>
                    {capsLock && (
                      <p className="flex items-center gap-1.5 text-[13px] font-medium text-warning" role="status" aria-live="polite">
                        <TriangleAlert className="size-3.5" aria-hidden />
                        Verrouillage majuscules activé — vérifiez votre saisie.
                      </p>
                    )}
                  </div>

                  {feedback && (
                    <p className="rounded-[12px] bg-destructive/10 px-4 py-3 text-[13.5px] font-medium text-destructive" role="alert">
                      {feedback}
                    </p>
                  )}

                  {locked && <LockNotice seconds={lockSeconds} />}

                  <Button type="submit" size="lg" className="min-h-12 w-full" disabled={locked || sending}>
                    {sending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                    {sending ? "Vérification…" : "Continuer"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-[13.5px] text-muted-foreground">
                  Première connexion ?{" "}
                  {/* TODO: page d'aide /activation à créer */}
                  <Link
                    href="/aide"
                    title="Page d’aide — bientôt disponible"
                    className="link-underline font-semibold text-teal-700"
                  >
                    Activez votre compte
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Panneau visuel (desktop) ────────────────────────────────── */}
      <aside
        aria-label="Illustration de votre espace"
        className="relative hidden overflow-hidden bg-ink lg:block"
      >
        <BogolanTexture color="#E3F4F1" opacity={0.06} />
        <div className="relative flex h-full flex-col items-center justify-center gap-10 p-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="flex w-full flex-col items-center"
            >
              {selected === "assure" && (
                <InsuranceCard2D size="md" flipOnClick tilt />
              )}
              {selected === "prestataire" && <PointsVisual />}
              {(selected === "entreprise" || selected === "cabinet") && <DashboardVisual />}
            </motion.div>
          </AnimatePresence>
          <p className="max-w-sm text-center text-sm leading-relaxed text-sand-50/60">
            {profileCaptions[selected]}
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ── Avis de verrouillage 30 s ───────────────────────────────────────── */

function LockNotice({ seconds }: { seconds: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-[16px] border border-warning/40 bg-warning/10 px-4 py-3.5"
    >
      <LockKeyhole className="size-5 shrink-0 text-warning" aria-hidden />
      <p className="text-[13.5px] leading-snug text-ink">
        Trop de tentatives. Nouvelle tentative possible dans{" "}
        <span className="tnum font-bold">{seconds}s</span>.
      </p>
    </div>
  );
}

/* ── Visuel prestataire : réseau de points ───────────────────────────── */

function PointsVisual() {
  const points: { x: number; y: number; d: number }[] = [
    { x: 40, y: 34, d: 0 },
    { x: 110, y: 22, d: 0.5 },
    { x: 168, y: 46, d: 1 },
    { x: 74, y: 82, d: 0.8 },
    { x: 140, y: 96, d: 0.3 },
    { x: 30, y: 110, d: 1.1 },
    { x: 184, y: 112, d: 0.6 },
  ];
  return (
    <svg
      viewBox="0 0 220 140"
      className="w-80 max-w-full"
      role="img"
      aria-label="Réseau de prestataires connectés au tiers payant AMSANTÉ"
    >
      <g stroke="#17A398" strokeWidth="0.8" opacity="0.5">
        <path d="M40 34 L110 22 L168 46 L140 96 L74 82 Z" fill="none" />
        <path d="M40 34 L74 82 L30 110 M74 82 L140 96 L184 112" fill="none" />
      </g>
      {points.map((p) => (
        <g key={`${p.x}-${p.y}`} transform={`translate(${p.x} ${p.y})`}>
          <circle r="5" fill="#17A398" opacity="0.3">
            <animate
              attributeName="r"
              values="4;10;4"
              dur={`${duration.story * 1.7}s`}
              begin={`${p.d}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur={`${duration.story * 1.7}s`}
              begin={`${p.d}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle r="3" fill="#7CCFC8" stroke="#0B1F1E" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

/* ── Visuel entreprise/cabinet : dashboard flouté ────────────────────── */

function DashboardVisual() {
  return (
    <div className="glass-dark w-[340px] max-w-full rounded-[24px] p-6 shadow-card" aria-hidden>
      <div className="flex items-center justify-between">
        <span className="block h-3 w-24 rounded-full bg-sand-50/40 blur-[2px]" />
        <span className="block size-8 rounded-full bg-teal-500/60 blur-[2px]" />
      </div>
      <div className="mt-6 space-y-3 blur-[3px]">
        <span className="block h-14 rounded-[14px] bg-teal-500/40" />
        <span className="block h-3 w-4/5 rounded-full bg-sand-50/35" />
        <span className="block h-3 w-3/5 rounded-full bg-sand-50/30" />
        <span className="block h-3 w-2/3 rounded-full bg-sand-50/25" />
        <div className="flex h-20 items-end gap-2 pt-3">
          <span className="h-1/2 flex-1 rounded-t-lg bg-teal-500/40" />
          <span className="h-3/4 flex-1 rounded-t-lg bg-teal-500/45" />
          <span className="h-2/5 flex-1 rounded-t-lg bg-teal-500/35" />
          <span className="h-full flex-1 rounded-t-lg bg-teal-500/50" />
          <span className="h-3/5 flex-1 rounded-t-lg bg-teal-500/40" />
        </div>
      </div>
    </div>
  );
}
