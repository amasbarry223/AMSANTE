"use client";

import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Presentation,
} from "lucide-react";
import { requestDemo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* TODO: les tarifs et les créneaux proposés restent à confirmer par l'équipe commerciale. */
const portfolioOptions = [
  "Moins de 500 dossiers",
  "500 – 2 000 dossiers",
  "2 000 – 10 000 dossiers",
  "Plus de 10 000 dossiers",
] as const;

const slotOptions = [
  "Cette semaine · matin",
  "Cette semaine · après-midi",
  "Semaine prochaine · matin",
  "Semaine prochaine · après-midi",
] as const;

const step1Schema = z.object({
  name: z.string().trim().min(2, "Votre nom complet est requis."),
  email: z.email("Saisissez une adresse e-mail professionnelle valide."),
  company: z.string().trim().min(2, "Le nom de votre cabinet est requis."),
});

const step2Schema = z.object({
  portfolio: z.string().min(1, "Sélectionnez la taille de votre portefeuille."),
  slot: z.string().min(1, "Sélectionnez un créneau souhaité."),
});

type FieldErrors = Record<string, string>;

/**
 * Modale « Demander une démo » : Dialog shadcn en 2 étapes (identité, puis
 * portefeuille + créneau), validation zod minimale, appel mock `requestDemo`,
 * état succès avec confirmation. Réutilisable : le déclencheur est inclus
 * (label / variant / size configurables).
 */
export function DemoModal({
  label = "Demander une démo",
  variant = "default",
  size = "lg",
  className,
}: {
  label?: string;
  variant?: "default" | "on-dark" | "outline";
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [slot, setSlot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [slotResult, setSlotResult] = useState<string | null>(null);

  /** Réinitialisation à chaque ouverture (dans le handler, pas dans un effet). */
  function handleOpenChange(next: boolean) {
    if (next) {
      setStep(1);
      setName("");
      setEmail("");
      setCompany("");
      setPortfolio("");
      setSlot("");
      setErrors({});
      setStatus("idle");
      setSlotResult(null);
    }
    setOpen(next);
  }

  function collectErrors(error: z.ZodError): FieldErrors {
    const out: FieldErrors = {};
    for (const issue of error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!out[key]) out[key] = issue.message;
    }
    return out;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const parsed = step1Schema.safeParse({ name, email, company });
    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      return;
    }
    setErrors({});
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = step2Schema.safeParse({ portfolio, slot });
    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await requestDemo({ name: name.trim(), email: email.trim(), company: company.trim() });
      // TODO: transmettre portfolio + slot à l'API quand le backend sera prêt.
      setSlotResult(res.slot);
      setStatus("success");
    } catch {
      setErrors({
        form: "L'envoi a échoué. Vérifiez votre connexion et réessayez dans un instant.",
      });
      setStatus("idle");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={cn("min-h-11", className)}>
          <Presentation className="size-4" aria-hidden />
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-[28px] border-sand-200 p-6 sm:p-8">
        {status === "success" ? (
          <div className="py-4 text-center" aria-live="polite">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-teal-100 text-teal-900">
              <CheckCircle2 className="size-8" aria-hidden />
            </span>
            <DialogHeader className="mt-5">
              <DialogTitle className="font-display text-[22px] font-bold text-ink">
                Démo réservée&nbsp;!
              </DialogTitle>
              <DialogDescription className="mx-auto mt-2 max-w-xs text-[14.5px] leading-relaxed">
                Merci {name.split(" ")[0] || ""} ! Notre équipe vous contacte {slotResult ?? "sous 48 h"}{" "}
                pour convenir de la démo de la plateforme avec votre cabinet.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 justify-center">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="text-[12px] font-bold uppercase tracking-wide text-teal-700" aria-live="polite">
                Étape {step} sur 2
              </p>
              <DialogTitle className="font-display text-[22px] font-bold text-ink">
                {step === 1 ? "Demande de démo" : "Votre portefeuille"}
              </DialogTitle>
              <DialogDescription className="text-[14px] leading-relaxed">
                {step === 1
                  ? "30 minutes en visio, adaptées à votre cabinet : gestion des assurés, tiers payant, commissions et reporting."
                  : "Derniers détails pour préparer une démo qui parle de votre quotidien, pas d'un PowerPoint générique."}
              </DialogDescription>
              <div className="mt-2 flex gap-1.5" aria-hidden>
                {[1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i <= step ? "bg-teal-900" : "bg-sand-200"
                    )}
                  />
                ))}
              </div>
            </DialogHeader>

            {errors.form && (
              <p className="rounded-[10px] bg-danger/10 px-4 py-2.5 text-[13px] font-medium text-danger" role="alert">
                {errors.form}
              </p>
            )}

            {step === 1 ? (
              <form onSubmit={handleContinue} className="grid gap-4" noValidate>
                <div className="grid gap-1.5">
                  <Label htmlFor="demo-name">Nom complet</Label>
                  <Input
                    id="demo-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Aminata Traoré"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className="h-11 rounded-[10px]"
                  />
                  {errors.name && <p className="text-[13px] text-danger">{errors.name}</p>}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="demo-email">E-mail professionnel</Label>
                  <Input
                    id="demo-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aminata@cabinet.ml"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    className="h-11 rounded-[10px]"
                  />
                  {errors.email && <p className="text-[13px] text-danger">{errors.email}</p>}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="demo-company">Nom du cabinet</Label>
                  <Input
                    id="demo-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Clinique Niamakoro SARL"
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.company)}
                    className="h-11 rounded-[10px]"
                  />
                  {errors.company && <p className="text-[13px] text-danger">{errors.company}</p>}
                </div>
                <DialogFooter className="mt-1">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={status === "loading"}>
                    Continuer <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <div className="grid gap-1.5">
                  <Label htmlFor="demo-portfolio">Taille du portefeuille d&apos;assurés</Label>
                  <Select value={portfolio} onValueChange={(v) => setPortfolio(v)}>
                    <SelectTrigger
                      id="demo-portfolio"
                      aria-invalid={Boolean(errors.portfolio)}
                      className="h-11 w-full rounded-[10px]"
                    >
                      <SelectValue placeholder="Sélectionnez une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolioOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.portfolio && <p className="text-[13px] text-danger">{errors.portfolio}</p>}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="demo-slot">Créneau souhaité</Label>
                  <Select value={slot} onValueChange={(v) => setSlot(v)}>
                    <SelectTrigger
                      id="demo-slot"
                      aria-invalid={Boolean(errors.slot)}
                      className="h-11 w-full rounded-[10px]"
                    >
                      <SelectValue placeholder="Sélectionnez un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      {slotOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.slot && <p className="text-[13px] text-danger">{errors.slot}</p>}
                </div>
                <DialogFooter className="mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    disabled={status === "loading"}
                  >
                    <ArrowLeft className="size-4" aria-hidden /> Retour
                  </Button>
                  <Button type="submit" variant="default" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden /> Envoi…
                      </>
                    ) : (
                      "Envoyer"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
