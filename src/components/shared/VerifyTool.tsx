"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  QrCode,
  ScanLine,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { verifyCertificate, type CertificateResult } from "@/lib/api";
import { duration, ease } from "@/lib/motion/tokens";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type Phase = "idle" | "verifying" | "result";

/**
 * Outil de vérification d’une carte d’assuré — QR (simulé) ou saisie du code.
 * Séquence : cadre de visée → spinner → le cadre se referme → le résultat se retourne.
 */
export function VerifyTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const runVerify = async (raw: string) => {
    if (phase === "verifying") return;
    setCodeError(null);
    setPhase("verifying");
    try {
      const res = await verifyCertificate(raw);
      setResult(res);
    } catch {
      setResult({
        status: "invalide",
        reason: "Impossible de vérifier pour le moment. Réessayez dans un instant.",
      });
    } finally {
      setPhase("result");
    }
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim();
    if (!clean) {
      setCodeError("Saisissez le code imprimé sur la carte.");
      return;
    }
    void runVerify(clean);
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setCode("");
    setCodeError(null);
  };

  const conseil =
    result?.status === "invalide" && result.reason?.toLowerCase().includes("expir")
      ? "Proposez à l’assuré de renouveler sa couverture sur amsante.ml avant de poursuivre."
      : "Vérifiez la saisie ou demandez à l’assuré de présenter à nouveau le QR code de sa carte.";

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-sand-200 bg-white p-5 shadow-soft sm:p-8">
      <Tabs defaultValue="scan">
        <TabsList className="mx-auto flex w-full max-w-sm rounded-full p-1">
          <TabsTrigger value="scan" className="rounded-full text-[13.5px]">
            <ScanLine className="size-4" aria-hidden />
            Scanner le QR
          </TabsTrigger>
          <TabsTrigger value="code" className="rounded-full text-[13.5px]">
            Saisir le code
          </TabsTrigger>
        </TabsList>

        {/* ── Onglet scan ─────────────────────────────────────────── */}
        <TabsContent value="scan" className="mt-6">
          <div className="mx-auto max-w-sm">
            <Viewfinder phase={phase} reduced={!!reduced} />
            <p className="mt-4 text-center text-[13.5px] leading-relaxed text-muted-foreground">
              Approchez le QR code de la carte du cadre, la vérification démarre
              automatiquement.
            </p>
            <div className="mt-5 flex flex-col items-center gap-2.5">
              <Button
                type="button"
                size="lg"
                className="min-h-12"
                disabled={phase === "verifying"}
                onClick={() => void runVerify("AMSA-2025-8K4T")}
              >
                <QrCode className="size-4" aria-hidden />
                Simuler un scan
              </Button>
              <p className="text-[12px] text-muted-foreground/80">
                Démo sans caméra — la caméra s’activera sur votre mobile.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* ── Onglet saisie ───────────────────────────────────────── */}
        <TabsContent value="code" className="mt-6">
          <form onSubmit={submitCode} className="mx-auto max-w-sm space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="verify-code">Code de la carte</Label>
              <Input
                id="verify-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setCodeError(null);
                }}
                placeholder="AMSA-XXXX-XXXX"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                aria-invalid={!!codeError}
                className="tnum h-12 rounded-[10px] uppercase tracking-[0.08em]"
              />
              {codeError ? (
                <p className="text-[13px] font-medium text-destructive" role="alert">
                  {codeError}
                </p>
              ) : (
                <p className="text-[12.5px] text-muted-foreground">
                  Format <span className="tnum">AMSA-XXXX-XXXX</span> ou 10 chiffres, imprimé
                  au dos de la carte.
                </p>
              )}
            </div>
            <Button type="submit" className="min-h-12 w-full" disabled={phase === "verifying"}>
              {phase === "verifying" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <ShieldCheck className="size-4" aria-hidden />
              )}
              Vérifier
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {/* ── Résultat : le cadre se referme puis le résultat se retourne ── */}
      <div role="status" aria-live="polite" className="mt-6 [perspective:1000px]">
        <AnimatePresence mode="wait" initial={false}>
          {phase !== "result" ? (
            <motion.div
              key="frame"
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: duration.fast, ease: ease.inOut }}
            >
              {phase === "verifying" && (
                <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-[16px] bg-teal-50 px-4 py-5 text-teal-900">
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  <p className="text-sm font-semibold">Vérification des droits…</p>
                </div>
              )}
            </motion.div>
          ) : (
            result && (
              <motion.div
                key="result"
                initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: 90 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.base, ease: ease.out }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {result.status === "valide" ? (
                  <div className="rounded-[16px] border-2 border-success bg-success/10 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success text-white">
                          <CheckCircle2 className="size-6" aria-hidden />
                        </span>
                        <p className="font-display text-lg font-bold text-success">
                          Carte valide
                        </p>
                      </div>
                      <Badge className="rounded-full bg-success text-[11px] font-bold text-white">
                        Droits ouverts
                      </Badge>
                    </div>
                    <dl className="mt-5 grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-3">
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Assuré
                        </dt>
                        <dd className="mt-0.5 font-display text-[15.5px] font-bold text-ink">
                          {result.maskedName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Formule
                        </dt>
                        <dd className="mt-0.5 font-semibold text-ink">{result.formula}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Valide jusqu’au
                        </dt>
                        <dd className="tnum mt-0.5 font-semibold text-ink">
                          {formatDate(result.validUntil ?? "")}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 border-t border-success/20 pt-3 text-[12.5px] text-muted-foreground">
                      Vérification anonyme : aucune donnée médicale n’est accessible.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[16px] border-2 border-destructive bg-destructive/10 p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
                        <XCircle className="size-6" aria-hidden />
                      </span>
                      <p className="font-display text-lg font-bold text-destructive">
                        Carte non valide
                      </p>
                    </div>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-ink">
                      {result.reason}
                    </p>
                    <p className="mt-3 rounded-[10px] bg-white/70 p-3 text-[13px] leading-relaxed text-muted-foreground">
                      <strong className="font-semibold text-foreground">Conseil :</strong>{" "}
                      {conseil}
                    </p>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <Button type="button" variant="ghost" onClick={reset}>
                    Vérifier une autre carte
                  </Button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Cadre de visée avec ligne qui balaie ──────────────────────────────── */

function Viewfinder({ phase, reduced }: { phase: Phase; reduced: boolean }) {
  const corner = "absolute size-9 border-teal-700";
  return (
    <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-sand-200 bg-[linear-gradient(160deg,#F0FAF8,#F7F4EE)]">
      {/* coins de visée */}
      <span className={cn(corner, "left-3 top-3 rounded-tl-xl border-l-2 border-t-2")} aria-hidden />
      <span className={cn(corner, "right-3 top-3 rounded-tr-xl border-r-2 border-t-2")} aria-hidden />
      <span className={cn(corner, "bottom-3 left-3 rounded-bl-xl border-b-2 border-l-2")} aria-hidden />
      <span className={cn(corner, "bottom-3 right-3 rounded-br-xl border-b-2 border-r-2")} aria-hidden />

      {/* QR fantôme */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <QrCode className="size-20 text-teal-900/15" />
      </div>

      {/* ligne de balayage */}
      {phase === "idle" && !reduced && (
        <motion.span
          aria-hidden
          className="absolute inset-x-8 h-0.5 rounded-full bg-teal-500 shadow-[0_0_14px_rgba(23,163,152,0.55)]"
          initial={{ top: "12%" }}
          animate={{ top: ["12%", "84%", "12%"] }}
          transition={{ duration: duration.story, repeat: Infinity, ease: ease.inOut }}
        />
      )}

      {/* état de vérification */}
      {phase === "verifying" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/55 backdrop-blur-[2px]">
          <Loader2 className="size-8 animate-spin text-teal-700" aria-hidden />
          <span className="sr-only">Vérification en cours…</span>
        </div>
      )}
    </div>
  );
}
