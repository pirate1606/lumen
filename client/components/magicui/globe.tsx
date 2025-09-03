import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type DottedSphereProps = {
  radius?: number;
  color?: string;
  dotSize?: number;
  latStep?: number;
  lonStep?: number;
};

function DottedSphere({ radius = 1.2, color = "#6B7280", dotSize = 0.02, latStep = 4, lonStep = 4 }: DottedSphereProps) {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let lat = -80; lat <= 80; lat += latStep) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const r = Math.sin(phi) * radius;
      const y = Math.cos(phi) * radius;
      for (let lon = 0; lon < 360; lon += lonStep) {
        const theta = THREE.MathUtils.degToRad(lon);
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        positions.push(x, y, z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [radius, latStep, lonStep]);

  useFrame((_s, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={color} size={dotSize} sizeAttenuation />
    </points>
  );
}

export type GlobeProps = {
  className?: string;
  style?: React.CSSProperties;
  dotColor?: string;
};

export function Globe({ className, style, dotColor = "#6B7280" }: GlobeProps) {
  return (
    <div className={cn("pointer-events-none absolute left-1/2 -translate-x-1/2 w-[560px] h-[560px]", className)} style={style}>
      <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 3.4], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight intensity={0.6} position={[2, 2, 2]} />
        <group rotation={[0, 0, 0.2]}>
          <DottedSphere radius={1.5} color={dotColor} dotSize={0.02} latStep={3.5} lonStep={3.5} />
        </group>
      </Canvas>
    </div>
  );
}
