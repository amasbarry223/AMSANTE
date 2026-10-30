"use client";

import { useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CardMesh } from "./CardMesh";
import { Particles } from "./Particles";
import { heroState } from "./heroState";

/** Recul de caméra en fin de chorégraphie + réponse souris globale. */
function CameraRig() {
  useFrame((state) => {
    const p = heroState.progress;
    const back = THREE.MathUtils.clamp((p - 0.82) / 0.18, 0, 1);
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      4.7 + back * 1.1,
      4,
      state.clock.getDelta() * 0.016 + 0.016
    );
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, heroState.mouseX * 0.25, 4, 0.016);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, heroState.mouseY * 0.18, 4, 0.016);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Souris → heroState (fenêtre entière, la scène réagit même hors canvas). */
function PointerTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

/**
 * Scène hero : carte d'assuré + fragments de papier.
 * Montée uniquement si l'appareil est capable (voir canRender3D()).
 */
export function HeroScene({ cardCode, holder, formula }: { cardCode?: string; holder?: string; formula?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.7], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#FFFFFF" />
        <pointLight position={[-4, -1.5, 2.5]} intensity={12} color="#17A398" distance={12} />
        <pointLight position={[3.5, -2, -2]} intensity={7} color="#E07A3F" distance={10} />
        <spotLight position={[0, 5, -4]} intensity={10} angle={0.8} penumbra={1} color="#7CCFC8" />
        <group position={[1.15, 0.05, 0]}>
          <CardMesh source="hero" cardCode={cardCode} holder={holder} formula={formula} />
          <Particles />
        </group>
        <CameraRig />
        <PointerTracker />
      </Suspense>
    </Canvas>
  );
}
