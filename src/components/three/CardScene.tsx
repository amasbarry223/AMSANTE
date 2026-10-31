"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CardMesh } from "./CardMesh";
import { Particles } from "./Particles";

/**
 * Scène légère réutilisée (confirmation de souscription) :
 * la carte se matérialise depuis des particules, retournable au clic.
 */
export function CardScene({
  cardCode,
  holder,
  formula,
}: {
  cardCode?: string;
  holder?: string;
  formula?: string;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0 cursor-pointer"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} />
        <pointLight position={[-4, -1, 2]} intensity={10} color="#17A398" distance={12} />
        <pointLight position={[3, -2, -2]} intensity={6} color="#E07A3F" distance={10} />
        <CardMesh source="reveal" cardCode={cardCode} holder={holder} formula={formula} />
        <Particles spread={0.5} />
      </Suspense>
    </Canvas>
  );
}

export default CardScene;
