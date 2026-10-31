"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { heroState } from "./heroState";

/**
 * Nuage de ~700 fragments de papier autour de la carte.
 * Au scroll (0.5→0.85) les fragments convergent en un halo protecteur,
 * puis se dispersent au recul de la caméra. Répulsion douce sous la souris.
 */
const COUNT = 700;

export function Particles({ spread = 1 }: { spread?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummyRef = useRef<THREE.Object3D | null>(null);
  const tmpRef = useRef<THREE.Vector3 | null>(null);
  const haloRef = useRef<THREE.Vector3 | null>(null);
  const dummy = () => {
    dummyRef.current ??= new THREE.Object3D();
    return dummyRef.current;
  };
  const tmp = () => {
    tmpRef.current ??= new THREE.Vector3();
    return tmpRef.current;
  };
  const halo = () => {
    haloRef.current ??= new THREE.Vector3();
    return haloRef.current;
  };

  const seeds = useMemo(() => {
    const arr = new Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // dispersion sphérique aplatie autour de la carte
      const r = 1.6 + Math.pow(Math.random(), 0.7) * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;
      arr[i] = {
        base: new THREE.Vector3(
          Math.cos(theta) * Math.cos(phi) * r,
          Math.sin(phi) * r * 0.72,
          Math.sin(theta) * Math.cos(phi) * r * 0.6
        ),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: 0.03 + Math.random() * 0.055,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      };
    }
    return arr;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const p = heroState.progress;
    const v = tmp();
    const haloPos = halo();
    const d = dummy();
    // convergence 0.5→0.85 puis dispersion 0.85→1
    const conv = THREE.MathUtils.clamp((p - 0.5) / 0.35, 0, 1);
    const disp = THREE.MathUtils.clamp((p - 0.85) / 0.15, 0, 1);

    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      v.copy(s.base);

      // dérive organique
      v.x += Math.sin(t * s.speed + s.phase) * 0.16;
      v.y += Math.cos(t * s.speed * 0.8 + s.phase * 1.3) * 0.12;
      v.z += Math.sin(t * s.speed * 0.5 + s.phase * 0.7) * 0.1;

      // répulsion souris (faible)
      const dx = v.x - heroState.mouseX * 2.4;
      const dy = v.y - (-heroState.mouseY * 1.6);
      const d2 = dx * dx + dy * dy;
      if (d2 < 2.4) {
        const f = (2.4 - d2) * 0.22;
        v.x += dx * f;
        v.y += dy * f;
      }

      // halo protecteur : cercle autour de la carte
      if (conv > 0) {
        const a = (i / COUNT) * Math.PI * 2 + t * 0.12;
        haloPos.set(Math.cos(a) * 2.15, Math.sin(a) * 1.5 * 0.6, Math.sin(a) * 0.55);
        v.lerp(haloPos, conv * (0.75 + 0.25 * Math.sin(s.phase)));
      }

      // dispersion finale
      if (disp > 0) v.multiplyScalar(1 + disp * 0.9);

      v.multiplyScalar(spread);
      d.position.copy(v);
      d.rotation.set(
        s.rot.x + t * 0.1 * s.speed,
        s.rot.y + t * 0.08 * s.speed,
        s.rot.z
      );
      const sc = s.scale * (1 + conv * 0.4);
      d.scale.setScalar(sc);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1.4]} />
      <meshBasicMaterial
        color="#E3F4F1"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
