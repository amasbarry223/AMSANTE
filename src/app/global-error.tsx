"use client";

/**
 * Filet de sécurité ultime (erreurs du layout racine) :
 * autonome — il rend ses propres <html>/<body> — avec styles inline
 * car le CSS global n'est pas garanti dans cet état.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1F1E",
          color: "#F7F4EE",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div role="alert" style={{ maxWidth: 560 }}>
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(255,255,255,.15)",
              background: "rgba(255,255,255,.08)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#E3F4F1",
            }}
          >
            Erreur 500
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, margin: "24px 0 12px" }}>
            Un grain de sable dans la machine.
          </h1>
          <p style={{ color: "rgba(247,244,238,.7)", lineHeight: 1.6, fontSize: 16.5, margin: 0 }}>
            Une erreur inattendue est survenue. Vos données sont en sécurité.
            {error?.digest ? (
              <span style={{ display: "block", marginTop: 12, fontSize: 12, letterSpacing: "0.12em", color: "rgba(247,244,238,.4)" }}>
                RÉFÉRENCE : {error.digest}
              </span>
            ) : null}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 32,
              minHeight: 44,
              padding: "12px 28px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: "#17A398",
              color: "#0B1F1E",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
