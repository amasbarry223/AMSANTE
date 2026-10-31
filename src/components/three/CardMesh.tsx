"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { createBackTexture, createFrontTexture } from "./cardFace";
import { heroState } from "./heroState";

/**
 * Carte d'assuré 3D — objet signature. Mêmes proportions (1.586) et matières
 * que la carte 2D. Source "hero" : chorégraphie pilotée par le scroll ;
 * source "reveal" : matérialisation à l'apparition + retournement au clic.
 */
export function CardMesh({
  source = "hero",
  cardCode = `AMSA-${new Date().getFullYear()}-8K4T`,
  holder = "Fatoumata Traoré",
  formula = "Confort",
  scale = 1,
}: {
  source?: "hero" | "reveal";
  cardCode?: string;
  holder?: string;
  formula?: string;
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const hoverRef = useRef(false);

  const [frontTex, backTex] = useMemo(
    () => [createFrontTexture(cardCode, holder, formula), createBackTexture(cardCode)],
    [cardCode, holder, formula]
  );

  const targetFlip = useRef(0);
  const revealT = useRef(source === "reveal" ? 0 : 1);

  useFrame((state, dt) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;
    const t = state.clock.elapsedTime;

    // ── matérialisation (source reveal) ──
    if (source === "reveal" && revealT.current < 1) {
      revealT.current = Math.min(1, revealT.current + dt * 0.7);
      const e = 1 - Math.pow(1 - revealT.current, 3);
      i.scale.setScalar(0.4 + 0.6 * e);
      i.rotation.y = (1 - e) * 2.4;
    }

    // ── retournement : hero → scroll ; reveal → clic ──
    let flipTarget: number;
    if (source === "hero") {
      const p = heroState.progress;
      // 0.42→0.62 : pivot de 180° (verso QR)
      flipTarget = THREE.MathUtils.clamp((p - 0.42) / 0.2, 0, 1);
    } else {
      flipTarget = targetFlip.current;
    }
    // lisser
    const cur = i.userData.flip ?? 0;
    const next = THREE.MathUtils.damp(cur, flipTarget, 6, dt);
    i.userData.flip = next;

    // tilt souris (≤ 12°)
    const mx = heroState.mouseX;
    const my = heroState.mouseY;
    const tiltX = my * 0.21 + Math.sin(t * 0.8) * 0.03;
    const tiltY = mx * 0.21 + Math.cos(t * 0.6) * 0.04;

    i.rotation.x = THREE.MathUtils.damp(i.rotation.x, tiltX, 4, dt);
    i.rotation.y = THREE.MathUtils.damp(
      i.rotation.y,
      next * Math.PI + tiltY + Math.sin(t * 0.5) * 0.05,
      6,
      dt
    );

    // flottement + hover léger
    const hoverLift = hoverRef.current ? 0.08 : 0;
    g.position.y = Math.sin(t * 0.9) * 0.07 + hoverLift;

    // recul caméra / échelle en fin de hero (progress 0.85→1)
    if (source === "hero") {
      const p = heroState.progress;
      const back = THREE.MathUtils.clamp((p - 0.85) / 0.15, 0, 1);
      g.scale.setScalar(scale * (1 - back * 0.18));
      g.position.z = back * -0.6;
    } else {
      g.scale.setScalar(scale);
    }
  });

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (source !== "hero") return;
    e.stopPropagation();
    hoverRef.current = true;
    document.body.style.cursor = "pointer";
  };
  const onPointerOut = () => {
    hoverRef.current = false;
    document.body.style.cursor = "";
  };

  return (
    <group ref={group}>
      <group
        ref={inner}
        onClick={() => {
          if (source === "reveal") targetFlip.current = targetFlip.current ? 0 : 1;
        }}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {/* corps */}
        <RoundedBox args={[3.4, 2.145, 0.09]} radius={0.12} smoothness={6}>
          <meshPhysicalMaterial
            color="#0D4743"
            roughness={0.28}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.25}
          />
        </RoundedBox>

        {/* tranche lumineuse */}
        <mesh position={[0, 0, -0.046]}>
          <planeGeometry args={[3.46, 2.2]} />
          <meshBasicMaterial color="#17A398" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>

        {/* recto */}
        <mesh position={[0, 0, 0.047]}>
          <planeGeometry args={[3.4, 2.145]} />
          <meshBasicMaterial map={frontTex} toneMapped={false} transparent />
        </mesh>
        {/* verso */}
        <mesh position={[0, 0, -0.047]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.4, 2.145]} />
          <meshBasicMaterial map={backTex} toneMapped={false} transparent />
        </mesh>
      </group>
    </group>
  );
}
