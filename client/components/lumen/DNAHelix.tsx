import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface DNAHelixProps {
  radius?: number;
  height?: number;
  turns?: number;
  segments?: number;
  colorA?: string;
  colorB?: string;
  rungColor?: string;
}

export default function DNAHelix({
  radius = 0.6,
  height = 2.4,
  turns = 5,
  segments = 120,
  colorA = "#1d9bf0",
  colorB = "#14b8a6",
  rungColor = "#94a3b8",
}: DNAHelixProps) {
  const group = useRef<THREE.Group>(null!);

  const { strandA, strandB, rungs } = useMemo(() => {
    const ptsA: THREE.Vector3[] = [];
    const ptsB: THREE.Vector3[] = [];
    const rungPairs: [THREE.Vector3, THREE.Vector3][] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;
      const ax = Math.cos(angle) * radius;
      const az = Math.sin(angle) * radius;
      const bx = Math.cos(angle + Math.PI) * radius;
      const bz = Math.sin(angle + Math.PI) * radius;
      ptsA.push(new THREE.Vector3(ax, y, az));
      ptsB.push(new THREE.Vector3(bx, y, bz));
      // Add a rung every few segments for visual interest
      if (i % 6 === 0)
        rungPairs.push([ptsA[ptsA.length - 1], ptsB[ptsB.length - 1]]);
    }

    return { strandA: ptsA, strandB: ptsB, rungs: rungPairs };
  }, [radius, height, turns, segments]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.25;
    group.current.position.y = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group}>
      {/* Strands */}
      {strandA.map((p, i) => (
        <mesh key={`a-${i}`} position={p.toArray()}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color={colorA}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}
      {strandB.map((p, i) => (
        <mesh key={`b-${i}`} position={p.toArray()}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color={colorB}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Rungs */}
      {rungs.map(([a, b], i) => {
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        return (
          <mesh key={`r-${i}`} position={mid.toArray()} quaternion={quat}>
            <cylinderGeometry args={[0.02, 0.02, len, 8]} />
            <meshStandardMaterial
              color={rungColor}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Subtle glow */}
      <pointLight position={[0, 0.6, 1]} intensity={0.6} color={colorA} />
      <pointLight position={[0, -0.6, -1]} intensity={0.5} color={colorB} />
    </group>
  );
}
