"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Baby,
  BedDouble,
  Clock3,
  FlaskConical,
  Glasses,
  LocateFixed,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Pill,
  Plane,
  Scan,
  Search,
  SearchX,
  Smile,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { communeList, guarantees } from "@/data/guarantees";
import { providerTypes, providers } from "@/data/providers";
import type { GuaranteeKey, Provider, ProviderType } from "@/data/types";
import { searchProviders, type ProviderFilters } from "@/lib/api";
import { duration } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

/* ── Métadonnées d'affichage ─────────────────────────────────────────── */

const typeColors: Record<ProviderType, string> = {
  clinique: "#17A398",
  hopital: "#0F5B57",
  pharmacie: "#E07A3F",
  laboratoire: "#D9A21B",
  imagerie: "#7CCFC8",
  dentaire: "#1F9D55",
  optique: "#B98A2F",
};

const typeLabels = Object.fromEntries(providerTypes.map((t) => [t.id, t.label]));

const serviceIcons: Record<GuaranteeKey, LucideIcon> = {
  consultation: Stethoscope,
  pharmacie: Pill,
  hospitalisation: BedDouble,
  maternite: Baby,
  analyses: FlaskConical,
  imagerie: Scan,
  dentaire: Smile,
  optique: Glasses,
  evacuation: Plane,
};

const serviceLabels = Object.fromEntries(
  guarantees.map((g) => [g.key, g.label])
) as Record<GuaranteeKey, string>;

const pillBase =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500";
const pillIdle =
  "border-sand-300 bg-white text-ink hover:border-teal-500/60 hover:bg-teal-50";
const pillActive = "border-teal-900 bg-teal-900 text-sand-50";

const clamp01 = (v: number) => Math.min(100, Math.max(0, v));

/* ── Composant principal ─────────────────────────────────────────────── */

export function ProviderDirectory() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<NonNullable<ProviderFilters["type"]>>("tous");
  const [commune, setCommune] = useState("toutes");
  const [open24, setOpen24] = useState(false);

  const [results, setResults] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detail, setDetail] = useState<Provider | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [userPos, setUserPos] = useState<{ x: number; y: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoOpen, setGeoOpen] = useState(false);

  const cardRefs = useRef(new Map<string, HTMLLIElement | null>());

  // Appel mock `searchProviders` — la recherche texte est débouncée de 250 ms
  // via un timer avec cleanup (les autres filtres s'appliquent immédiatement).
  useEffect(() => {
    let active = true;
    const timer = setTimeout(
      () => {
        searchProviders({ q: q.trim(), type, commune, open24 }).then((list) => {
          if (!active) return;
          setResults(list);
          setLoading(false);
        });
      },
      q.trim() ? 250 : 0
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q, type, commune, open24]);

  // Tri simulé « Autour de moi » : distance euclidienne sur le repère x/y de la carte.
  const sorted = useMemo(() => {
    if (!userPos) return results;
    return [...results].sort(
      (a, b) =>
        Math.hypot(a.x - userPos.x, a.y - userPos.y) -
        Math.hypot(b.x - userPos.x, b.y - userPos.y)
    );
  }, [results, userPos]);

  const focusCard = (id: string) => {
    setSelectedId(id);
    cardRefs.current.get(id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const openDetail = (p: Provider) => {
    setDetail(p);
    setDrawerOpen(true);
  };

  const activateGeo = () => {
    setGeoOpen(false);
    if (!("geolocation" in navigator)) {
      toast.warning("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Projection simulée Bamako/Kati → repère 0–100 de la carte SVG.
        const x = clamp01(((pos.coords.longitude + 8.1) / 0.22) * 100);
        const y = clamp01(((12.82 - pos.coords.latitude) / 0.24) * 100);
        setUserPos({ x, y });
        setLocating(false);
        toast.success("Position activée — prestataires triés par distance.");
      },
      () => {
        setLocating(false);
        toast.warning("Position refusée — l’annuaire reste trié par défaut.");
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  const resetFilters = () => {
    setQ("");
    setType("tous");
    setCommune("toutes");
    setOpen24(false);
    setUserPos(null);
    setSelectedId(null);
    setHoveredId(null);
    setLoading(true);
  };

  return (
    <section aria-label="Annuaire des prestataires conventionnés" className="py-14 sm:py-20">
      <div className="container-ams">
        {/* ── Filtres ─────────────────────────────────────────────── */}
        <div className="rounded-[24px] border border-sand-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="recherche-prestataire">Rechercher un établissement</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="recherche-prestataire"
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setLoading(true);
                  }}
                  placeholder="Nom, quartier, commune…"
                  className="h-12 rounded-[10px] pl-10"
                />
              </div>
            </div>

            <Popover open={geoOpen} onOpenChange={setGeoOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 min-h-12" disabled={locating}>
                  {locating ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <LocateFixed className="size-4" aria-hidden />
                  )}
                  {locating ? "Localisation…" : "Autour de moi"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 rounded-2xl">
                <p className="text-sm font-semibold text-foreground">Trier par distance</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Nous utilisons votre position uniquement pour trier les prestataires par
                  distance. Elle n’est jamais enregistrée ni partagée.
                </p>
                <Button className="mt-3 w-full" onClick={activateGeo}>
                  Activer
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrer par type d’établissement">
            {providerTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={type === t.id}
                onClick={() => {
                  setType(t.id);
                  setLoading(true);
                }}
                className={cn(pillBase, type === t.id ? pillActive : pillIdle)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Filtrer par commune">
            {["toutes", ...communeList].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={commune === c}
                onClick={() => {
                  setCommune(c);
                  setLoading(true);
                }}
                className={cn(pillBase, commune === c ? pillActive : pillIdle)}
              >
                {c === "toutes" ? "Toutes les communes" : c}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={open24}
              onClick={() => {
                setOpen24((v) => !v);
                setLoading(true);
              }}
              className={cn(pillBase, open24 ? pillActive : pillIdle)}
            >
              <Clock3 className="size-3.5" aria-hidden />
              Ouvert 24 h/24
            </button>
          </div>
        </div>

        {/* ── Liste + carte ───────────────────────────────────────── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-display text-xl font-bold text-ink">
                {loading
                  ? "Recherche…"
                  : `${sorted.length} prestataire${sorted.length > 1 ? "s" : ""}`}
              </h2>
              <p className="text-[13px] text-muted-foreground" aria-live="polite">
                {userPos ? "Triés par distance estimée" : `sur ${providers.length} conventionnés`}
              </p>
            </div>

            {loading ? (
              <ul className="mt-4 space-y-3" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <li key={i} className="rounded-[16px] border border-sand-200 bg-white p-5 shadow-soft">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="mt-3 h-4 w-1/2" />
                    <Skeleton className="mt-2 h-4 w-1/3" />
                  </li>
                ))}
              </ul>
            ) : sorted.length === 0 ? (
              <div className="mt-4 rounded-[20px] border border-dashed border-sand-300 bg-white/60 p-8 text-center">
                <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden />
                <p className="mt-3 font-display text-lg font-bold text-ink">
                  Aucun prestataire trouvé
                </p>
                <p className="mt-1 text-[13.5px] text-muted-foreground">
                  Essayez un autre nom, élargissez la zone ou retirez le filtre 24 h/24.
                </p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {sorted.map((p) => (
                  <li
                    key={p.id}
                    ref={(el) => {
                      cardRefs.current.set(p.id, el);
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId((cur) => (cur === p.id ? null : cur))}
                      onFocus={() => setHoveredId(p.id)}
                      onBlur={() => setHoveredId((cur) => (cur === p.id ? null : cur))}
                      onClick={() => openDetail(p)}
                      className={cn(
                        "w-full rounded-[16px] border bg-white p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:p-5",
                        selectedId === p.id
                          ? "border-teal-500 ring-2 ring-teal-500/30"
                          : "border-sand-200"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-display text-[15.5px] font-bold text-ink">
                            {p.name}
                          </p>
                          <p className="mt-0.5 text-[13px] text-muted-foreground">
                            {typeLabels[p.type]} · {p.quartier}, {p.commune}
                          </p>
                        </div>
                        <span
                          className="mt-1 size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: typeColors[p.type] }}
                          aria-hidden
                        />
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-3.5" aria-hidden />
                          {p.hours}
                        </span>
                        {p.open24 && (
                          <Badge className="rounded-full bg-teal-100 text-[10.5px] font-bold text-teal-900">
                            24 h/24
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700">
                        Voir la fiche
                        <ArrowRight className="size-3.5" aria-hidden />
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Carte SVG stylisée ────────────────────────────────── */}
          <div className="order-1 self-start lg:order-2 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[28px] border border-sand-200 bg-[linear-gradient(160deg,#F0FAF8,#F7F4EE)] p-4 shadow-soft">
              <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-xs backdrop-blur">
                <Navigation className="size-3 text-teal-600" aria-hidden />
                Bamako · Kati
              </div>
              {userPos && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-semibold text-sand-50 backdrop-blur">
                  Tri par distance activé
                </div>
              )}

              <svg
                viewBox="0 0 100 100"
                className={cn(
                  "aspect-[4/3] w-full transition-opacity sm:aspect-square",
                  loading && "opacity-50"
                )}
                role="img"
                aria-label="Carte stylisée de Bamako — chaque point est un prestataire conventionné du résultat"
              >
                {/* fleuve Niger + axes + zones (motif repris de CareNetwork) */}
                <g aria-hidden>
                  <path
                    d="M-2 34 C 15 30, 28 42, 42 38 S 66 26, 82 30 S 96 40, 104 38"
                    fill="none"
                    stroke="#7CCFC8"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  <path
                    d="M-2 37 C 15 33, 28 45, 42 41 S 66 29, 82 33 S 96 43, 104 41"
                    fill="none"
                    stroke="#17A398"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    opacity="0.5"
                  />
                  <g stroke="#EAE3D6" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M14 8 L 20 78 L 30 96" fill="none" />
                    <path d="M8 60 L 48 52 L 88 62" fill="none" />
                    <path d="M34 6 L 40 44 L 58 84" fill="none" />
                    <path d="M62 10 L 60 40 L 70 90" fill="none" />
                    <path d="M20 20 L 60 14 L 92 20" fill="none" />
                  </g>
                  <g fill="#0F5B57" opacity="0.05">
                    <circle cx="20" cy="44" r="13" />
                    <circle cx="38" cy="32" r="11" />
                    <circle cx="55" cy="58" r="15" />
                    <circle cx="70" cy="64" r="11" />
                    <circle cx="12" cy="14" r="8" />
                  </g>
                </g>

                {/* position utilisateur (géolocalisation simulée) */}
                {userPos && (
                  <g transform={`translate(${userPos.x} ${userPos.y})`}>
                    <circle r="3.5" fill="none" stroke="#0B1F1E" strokeWidth="0.7">
                      <animate
                        attributeName="r"
                        values="3;8;3"
                        dur={`${duration.story}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.1;0.8"
                        dur={`${duration.story}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2.2" fill="#0B1F1E" stroke="#F7F4EE" strokeWidth="0.7" />
                  </g>
                )}

                {/* points prestataires synchronisés avec la liste */}
                {sorted.map((p) => {
                  const emphasized = hoveredId === p.id || selectedId === p.id;
                  return (
                    <g
                      key={p.id}
                      transform={`translate(${p.x} ${p.y})`}
                      className="cursor-pointer focus:outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${p.name}, ${p.commune} — afficher la fiche dans la liste`}
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId((cur) => (cur === p.id ? null : cur))}
                      onFocus={() => setHoveredId(p.id)}
                      onBlur={() => setHoveredId((cur) => (cur === p.id ? null : cur))}
                      onClick={() => focusCard(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          focusCard(p.id);
                        }
                      }}
                    >
                      {emphasized && (
                        <circle
                          r="4"
                          fill="none"
                          stroke={typeColors[p.type] ?? "#17A398"}
                          strokeWidth="0.9"
                        >
                          <animate
                            attributeName="r"
                            values="3;9.5;3"
                            dur={`${duration.story}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.95;0.15;0.95"
                            dur={`${duration.story}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <circle
                        r="3.2"
                        fill={typeColors[p.type] ?? "#17A398"}
                        opacity={emphasized ? 0.45 : 0.25}
                      >
                        <animate
                          attributeName="r"
                          values="3.2;6.5;3.2"
                          dur={`${duration.base}s`}
                          begin={`${(p.x % 1).toFixed(2)}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.35;0;0.35"
                          dur={`${duration.base}s`}
                          begin={`${(p.x % 1).toFixed(2)}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        r={emphasized ? 2.6 : 2.1}
                        fill={typeColors[p.type] ?? "#17A398"}
                        stroke="#fff"
                        strokeWidth="0.7"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* légende */}
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 px-1 pb-1 pt-3" aria-label="Légende des types">
                {providerTypes.slice(1).map((t) => (
                  <li key={t.id} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: typeColors[t.id as ProviderType] }}
                      aria-hidden
                    />
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-center text-[12.5px] text-muted-foreground">
              Survolez une fiche pour localiser le point · cliquez un point pour retrouver la
              fiche dans la liste
            </p>
          </div>
        </div>
      </div>

      {/* ── Drawer fiche détaillée ──────────────────────────────────── */}
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="sm:max-w-md">
          {detail && (
            <>
              <DrawerHeader className="text-left">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: typeColors[detail.type] }}
                    aria-hidden
                  />
                  <DrawerDescription>
                    {typeLabels[detail.type]} · {detail.commune}
                  </DrawerDescription>
                </div>
                <DrawerTitle className="font-display text-xl font-bold text-ink">
                  {detail.name}
                </DrawerTitle>
              </DrawerHeader>

              <div className="space-y-5 overflow-y-auto px-4 pb-6">
                <dl className="space-y-3 text-[14px]">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden />
                    <div>
                      <dt className="sr-only">Adresse</dt>
                      <dd className="text-foreground">
                        {detail.address}
                        <span className="block text-[13px] text-muted-foreground">
                          {detail.quartier}, {detail.commune}
                        </span>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden />
                    <div>
                      <dt className="sr-only">Horaires</dt>
                      <dd className="text-foreground">
                        {detail.hours}
                        {detail.open24 && (
                          <Badge className="ml-2 rounded-full bg-teal-100 text-[10.5px] font-bold text-teal-900">
                            24 h/24
                          </Badge>
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden />
                    <div>
                      <dt className="sr-only">Téléphone</dt>
                      <dd>
                        <a
                          href={`tel:${detail.phone.replace(/\s/g, "")}`}
                          className="link-underline tnum font-semibold text-teal-700"
                        >
                          {detail.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                </dl>

                <div>
                  <p className="text-[13px] font-semibold text-foreground">Services couverts</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {detail.services.map((s) => {
                      const Icon = serviceIcons[s];
                      if (!Icon) return null; // service inconnu (données de démo)
                      return (
                        <li
                          key={s}
                          className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[12.5px] font-medium text-teal-900"
                        >
                          <Icon className="size-3.5" aria-hidden />
                          {serviceLabels[s] ?? s}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <p className="rounded-[16px] bg-teal-50 p-3.5 text-[13px] leading-relaxed text-teal-900">
                  <strong className="font-semibold">Tiers payant :</strong> présentez la carte
                  digitale de l’assuré — aucune avance de frais pour les actes couverts.
                </p>

                <Button asChild className="w-full">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${detail.name} ${detail.quartier} Bamako`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="size-4" aria-hidden />
                    Itinéraire — Google Maps
                  </a>
                </Button>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
}
