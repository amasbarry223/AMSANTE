"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * Dropzone : photo d'identité / documents. Aperçu, recadrage carré visuel,
 * compression automatique côté client (< 300 Ko) avant « envoi ».
 */
async function compressImage(file: File, maxSize = 1200, quality = 0.72): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  let out = canvas.toDataURL("image/jpeg", quality);
  // Recompression si > 300 Ko
  let q = quality;
  while (out.length > 300 * 1024 * 1.37 && q > 0.35) {
    q -= 0.1;
    out = canvas.toDataURL("image/jpeg", q);
  }
  return out;
}

export function FileDropzone({
  label,
  hint = "JPG ou PNG · la photo est compressée automatiquement",
  value,
  onChange,
  className,
}: {
  label: string;
  hint?: string;
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Format non pris en charge. Utilisez une image JPG ou PNG.");
        return;
      }
      setError(null);
      setBusy(true);
      try {
        const dataUrl = await compressImage(file);
        onChange(dataUrl);
      } catch {
        setError("Impossible de lire cette image. Réessayez.");
      } finally {
        setBusy(false);
      }
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[13px] font-semibold text-foreground">{label}</p>
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative flex min-h-32 cursor-pointer items-center gap-4 rounded-[16px] border-2 border-dashed bg-white/60 p-4 transition-colors",
          dragging ? "border-teal-500 bg-teal-100/60" : "border-sand-300 hover:border-teal-500/60",
          error && "border-destructive/60"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {busy ? (
            <motion.div
              key="busy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center justify-center gap-3 text-sm text-muted-foreground"
            >
              <span className="size-5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
              Compression de l&apos;image…
            </motion.div>
          ) : value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast, ease: ease.out }}
              className="flex w-full items-center gap-4"
            >
              {/* Aperçu carré */}
              <div className="size-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-sand-200">
                <img src={value} alt="" className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
                  <CheckCircle2 className="size-4" /> Document ajouté
                </p>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{hint}</p>
              </div>
              <button
                type="button"
                aria-label="Supprimer le document"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center gap-4"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                <UploadCloud className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Prendre une photo ou déposer le fichier
                </p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-[13px] font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
