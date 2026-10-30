import * as THREE from "three";

/**
 * Textures de la carte d'assuré dessinées sur canvas (recto/verso).
 * Permet un contrôle graphique total sans assets externes.
 */

const W = 1024;
const H = 646;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function roundedPath(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(W - r, 0);
  ctx.quadraticCurveTo(W, 0, W, r);
  ctx.lineTo(W, H - r);
  ctx.quadraticCurveTo(W, H, W - r, H);
  ctx.lineTo(r, H);
  ctx.quadraticCurveTo(0, H, 0, H - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
}

function drawBogolan(ctx: CanvasRenderingContext2D, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#E3F4F1";
  ctx.fillStyle = "#E3F4F1";
  ctx.lineWidth = 1.5;
  // lignes horizontales + chevrons
  for (let y = 60; y < H; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    for (let x = 8; x < W; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, y + 14);
      ctx.lineTo(x + 14, y + 26);
      ctx.lineTo(x + 28, y + 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 40, y + 20, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawQr(ctx: CanvasRenderingContext2D, code: string, x: number, y: number, size: number) {
  const r = rng(hash(code));
  const modules = 21;
  const cell = size / modules;
  const quiet = 1;
  const drawModule = (mx: number, my: number) => {
    ctx.fillRect(x + mx * cell, y + my * cell, cell + 0.5, cell + 0.5);
  };
  // fond
  ctx.fillStyle = "#F7F4EE";
  ctx.beginPath();
  ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 14);
  ctx.fill();
  ctx.fillStyle = "#0B1F1E";
  const drawFinder = (fx: number, fy: number) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const edge = i === 0 || i === 6 || j === 0 || j === 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (edge || core)
          drawModule(fx + i, fy + j);
      }
  };
  drawFinder(quiet, quiet);
  drawFinder(modules - 7 - quiet, quiet);
  drawFinder(quiet, modules - 7 - quiet);
  for (let i = 0; i < modules; i++)
    for (let j = 0; j < modules; j++) {
      const inFinder =
        (i < 8 && j < 8) || (i > modules - 9 && j < 8) || (i < 8 && j > modules - 9);
      if (!inFinder && r() > 0.52) drawModule(i, j);
    }
}

function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const grad = ctx.createLinearGradient(x, y, x + 96, y + 68);
  grad.addColorStop(0, "#E9C46A");
  grad.addColorStop(0.6, "#B98A2F");
  grad.addColorStop(1, "#E9C46A");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, 96, 68, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(90, 66, 20, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 14, y + 12, 26, 44);
  ctx.strokeRect(x + 54, y + 12, 28, 20);
  ctx.strokeRect(x + 54, y + 38, 28, 18);
}

export function createFrontTexture(cardCode: string, holder: string, formula: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // fond dégradé
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#12766F");
  g.addColorStop(0.42, "#0F5B57");
  g.addColorStop(1, "#0B1F1E");
  ctx.fillStyle = g;
  roundedPath(ctx, 0);
  ctx.fill();

  drawBogolan(ctx, 0.07);

  // reflet diagonal
  ctx.save();
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = "#FFFFFF";
  ctx.translate(W * 0.1, -120);
  ctx.rotate(0.42);
  ctx.fillRect(0, 0, 190, H * 2);
  ctx.restore();

  // halo teal
  const halo = ctx.createRadialGradient(W * 0.82, H * 0.12, 10, W * 0.82, H * 0.12, 320);
  halo.addColorStop(0, "rgba(23,163,152,0.5)");
  halo.addColorStop(1, "rgba(23,163,152,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // logo
  ctx.strokeStyle = "#7CCFC8";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(56, 52, 62, 46, 10);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(68, 84);
  ctx.bezierCurveTo(74, 84, 74, 68, 80, 68);
  ctx.bezierCurveTo(86, 68, 86, 92, 92, 92);
  ctx.bezierCurveTo(98, 92, 98, 62, 104, 62);
  ctx.stroke();
  ctx.fillStyle = "#F7F4EE";
  ctx.font = "800 52px 'Bricolage Grotesque', sans-serif";
  ctx.fillText("AMSANTÉ", 140, 92);
  ctx.fillStyle = "rgba(227,244,241,0.65)";
  ctx.font = "500 17px 'Geist', sans-serif";
  ctx.fillText("ASSURANCE SANTÉ · MALI", 142, 120);

  drawChip(ctx, W - 190, 60);

  // code carte
  ctx.fillStyle = "rgba(227,244,241,0.9)";
  ctx.font = "500 34px 'Geist Mono', monospace";
  ctx.fillText(cardCode.split("").join(" "), 56, H - 190);

  // titulaire
  ctx.fillStyle = "#F7F4EE";
  ctx.font = "700 44px 'Bricolage Grotesque', sans-serif";
  ctx.fillText(holder.toUpperCase(), 56, H - 128);

  // formule + validité
  ctx.fillStyle = "rgba(23,163,152,0.32)";
  ctx.beginPath();
  ctx.roundRect(56, H - 96, 190, 46, 23);
  ctx.fill();
  ctx.fillStyle = "#E3F4F1";
  ctx.font = "700 20px 'Geist', sans-serif";
  ctx.fillText(formula.toUpperCase(), 82, H - 66);
  ctx.fillStyle = "rgba(247,244,238,0.55)";
  ctx.font = "400 18px 'Geist Mono', monospace";
  ctx.fillText("VALIDE 12 MOIS", 268, H - 66);

  drawQr(ctx, cardCode, W - 226, H - 238, 164);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createBackTexture(cardCode: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#0B1F1E");
  g.addColorStop(1, "#0F5B57");
  ctx.fillStyle = g;
  roundedPath(ctx, 0);
  ctx.fill();
  drawBogolan(ctx, 0.05);

  // bande magnétique
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 64, W, 92);

  ctx.fillStyle = "#E3F4F1";
  ctx.font = "700 30px 'Bricolage Grotesque', sans-serif";
  ctx.fillText("CARTE D'ASSURÉ AMSANTÉ", 64, 240);
  ctx.fillStyle = "rgba(247,244,238,0.8)";
  ctx.font = "400 22px 'Geist', sans-serif";
  ctx.fillText(
    "Présentez le QR code à l'accueil du prestataire :",
    64,
    292
  );
  ctx.fillText("vos droits s'ouvrent instantanément, sans avance de frais.", 64, 324);

  ctx.fillStyle = "rgba(247,244,238,0.6)";
  ctx.font = "400 20px 'Geist Mono', monospace";
  ctx.fillText("Service client · +223 80 00 11 22", 64, 420);
  ctx.fillText("Urgences 24h/24 · +223 80 00 33 44", 64, 452);
  ctx.fillText(cardCode, 64, 560);

  // bande bogolan
  ctx.fillStyle = "#17A398";
  ctx.fillRect(0, H - 40, W, 8);
  ctx.fillStyle = "rgba(23,163,152,0.45)";
  for (let x = 0; x < W; x += 28) ctx.fillRect(x, H - 26, 14, 8);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
