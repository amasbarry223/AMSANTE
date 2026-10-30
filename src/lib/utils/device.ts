/**
 * Détection des capacités de l'appareil pour décider du rendu 3D.
 * Renvoie true seulement si l'environnement est suffisamment puissant.
 */
export function canRender3D(): boolean {
  if (typeof window === "undefined") return false;

  // Motion réduite → jamais de 3D
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  // Pointeur fin + écran large uniquement
  if (!window.matchMedia("(pointer: fine)").matches) return false;
  if (window.innerWidth < 1024) return false;

  // Économie de données / connexion lente → fallback
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  const conn = nav.connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /2g|3g/.test(conn.effectiveType)) return false;

  // GPU minimum : pas de critère fiable standard → on essaie WebGL + heuristic
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)).toLowerCase();
      if (/swiftshader|llvmpipe|software/.test(renderer)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
