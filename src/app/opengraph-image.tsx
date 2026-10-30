import { ImageResponse } from "next/og";

/**
 * Image Open Graph globale AMSANTÉ (§10 du cahier des charges) :
 * fond ink, titre « Le soin, sans papier. » et la carte d'assuré
 * (fil rouge de la marque) dessinée en pur satori — aucune police
 * externe ni requête réseau, pour rester fiable en build.
 */

export const alt = "AMSANTÉ — carte d'assuré digitale : le soin, sans papier";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Pseudo-QR décoratif : grille flex (satori ne supporte pas display:grid). */
function QrBlock() {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const x = i % 7;
    const y = Math.floor(i / 7);
    const filled = (x * 3 + y * 5 + ((x * y) % 4)) % 3 !== 0;
    return { key: i, filled };
  });
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: 104,
        height: 104,
        borderRadius: 12,
        background: "rgba(247,244,238,.92)",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      {cells.map((c) => (
        <div
          key={c.key}
          style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: c.filled ? "#0B1F1E" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1F1E",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Halo teal */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 999,
            background: "rgba(23,163,152,.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "rgba(23,163,152,.10)",
          }}
        />

        {/* Barre supérieure : marque + promesse */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #17A398, #0F5B57)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F7F4EE",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              color: "#F7F4EE",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            AMSANTÉ
          </div>
        </div>

        {/* Corps : titre à gauche, carte à droite */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div
              style={{
                display: "flex",
                color: "#E3F4F1",
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Assurance santé · Mali
            </div>
            <div
              style={{
                display: "flex",
                color: "#F7F4EE",
                fontSize: 78,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Le soin, sans papier.
            </div>
            <div
              style={{
                display: "flex",
                color: "rgba(227,244,241,.75)",
                fontSize: 27,
                lineHeight: 1.4,
                marginTop: 22,
              }}
            >
              Souscription en 5 minutes, carte digitale immédiate,
              remboursements en Mobile Money.
            </div>
          </div>

          {/* La carte d'assuré (fil rouge de la marque) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 400,
              height: 248,
              borderRadius: 24,
              background: "linear-gradient(135deg, #0F5B57 0%, #17A398 100%)",
              border: "1px solid rgba(247,244,238,.25)",
              padding: 26,
              boxShadow: "0 24px 48px rgba(0,0,0,.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    color: "rgba(247,244,238,.85)",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  Carte d&apos;assuré
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#F7F4EE",
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    marginTop: 6,
                  }}
                >
                  AMSANTÉ
                </div>
              </div>
              {/* Puce dorée */}
              <div
                style={{
                  width: 46,
                  height: 34,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #E9C46A, #D9A21B)",
                  border: "1px solid rgba(255,255,255,.35)",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    color: "rgba(247,244,238,.7)",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Assuré
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#F7F4EE",
                    fontSize: 22,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  A. DEMBÉLÉ
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "rgba(247,244,238,.8)",
                    fontSize: 15,
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  AMS-2025-0042
                </div>
              </div>
              <QrBlock />
            </div>
          </div>
        </div>

        {/* Pied : domaine */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "rgba(247,244,238,.55)",
            fontSize: 20,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#17A398",
              display: "flex",
            }}
          />
          amsante.ml
        </div>
      </div>
    ),
    { ...size }
  );
}
