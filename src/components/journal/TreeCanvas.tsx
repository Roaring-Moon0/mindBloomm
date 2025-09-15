"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Stars } from "@react-three/drei";

// Simple 3D Tree component
function Tree3D({ health }: { health: string }) {
  const trunkHeight = 1.2;
  const trunkRadius = 0.1;
  const foliageColor = health === "healthy" ? "#4ade80" : health === "weak" ? "#facc15" : "#a3a3a3";

  return (
    <mesh position={[0, trunkHeight / 2 - 0.6, 0]}>
      <cylinderGeometry args={[trunkRadius, trunkRadius, trunkHeight, 16]} />
      <meshStandardMaterial color="#8b5a2b" />
      <mesh position={[0, trunkHeight / 2 + 0.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={foliageColor} metalness={0.2} roughness={0.7}/>
      </mesh>
    </mesh>
  );
}

function ParticleBackground() {
  return <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />;
}


export default function TreeCanvas({ health }: { health: string }) {
  return (
    <div className="w-full h-96 rounded-xl shadow-lg bg-white/50 backdrop-blur-sm">
      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Tree3D health={health} />
          <ParticleBackground />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5}/>
      </Canvas>
    </div>
  );
}
