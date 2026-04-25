import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CubeState, Color, COLOR_MAP, FaceName } from '../types';

interface CubieProps {
  position: [number, number, number];
  colors: {
    up?: Color;
    down?: Color;
    left?: Color;
    right?: Color;
    front?: Color;
    back?: Color;
  };
}

const Cubie: React.FC<CubieProps> = ({ position, colors }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Create materials for each face
  const materials = useMemo(() => {
    const defaultColor = '#111111';
    return [
      new THREE.MeshStandardMaterial({ color: colors.right ? COLOR_MAP[colors.right] : defaultColor }), // Right
      new THREE.MeshStandardMaterial({ color: colors.left ? COLOR_MAP[colors.left] : defaultColor }),  // Left
      new THREE.MeshStandardMaterial({ color: colors.up ? COLOR_MAP[colors.up] : defaultColor }),    // Up
      new THREE.MeshStandardMaterial({ color: colors.down ? COLOR_MAP[colors.down] : defaultColor }),  // Down
      new THREE.MeshStandardMaterial({ color: colors.front ? COLOR_MAP[colors.front] : defaultColor }), // Front
      new THREE.MeshStandardMaterial({ color: colors.back ? COLOR_MAP[colors.back] : defaultColor }),  // Back
    ];
  }, [colors]);

  return (
    <group position={position} ref={meshRef}>
      <mesh material={materials}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
      </mesh>
      {/* Black core to hide gaps */}
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

interface Cube3DProps {
  state: CubeState;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
}

export const Cube3D: React.FC<Cube3DProps> = ({ state }) => {
  // Map our CubeState to cubie colors
  // A cubie at (x, y, z) where x,y,z are in {-1, 0, 1}
  const cubies = useMemo(() => {
    const result = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // Skip the core

          const cubieColors: any = {};

          // Face mapping logic
          // y=1 is Up, y=-1 is Down
          // x=1 is Right, x=-1 is Left
          // z=1 is Front, z=-1 is Back

          // Indices in our state arrays (0-8)
          // For each face, the indices are:
          // 0 1 2
          // 3 4 5
          // 6 7 8

          if (y === 1) { // Up face
            // x: -1 -> 0, 0 -> 1, 1 -> 2
            // z: -1 -> 0, 0 -> 3, 1 -> 6
            const idx = (x + 1) + ((-z + 1) * 3);
            cubieColors.up = state.U[idx];
          }
          if (y === -1) { // Down face
            const idx = (x + 1) + ((z + 1) * 3);
            cubieColors.down = state.D[idx];
          }
          if (x === 1) { // Right face
            const idx = ((-z + 1)) + ((-y + 1) * 3);
            cubieColors.right = state.R[idx];
          }
          if (x === -1) { // Left face
            const idx = ((z + 1)) + ((-y + 1) * 3);
            cubieColors.left = state.L[idx];
          }
          if (z === 1) { // Front face
            const idx = (x + 1) + ((-y + 1) * 3);
            cubieColors.front = state.F[idx];
          }
          if (z === -1) { // Back face
            const idx = ((-x + 1)) + ((-y + 1) * 3);
            cubieColors.back = state.B[idx];
          }

          result.push({ position: [x, y, z] as [number, number, number], colors: cubieColors });
        }
      }
    }
    return result;
  }, [state]);

  return (
    <div className="w-full h-[400px] sm:h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minDistance={4} 
          maxDistance={10}
          makeDefault
        />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <group>
          {cubies.map((cubie, i) => (
            <Cubie key={i} position={cubie.position} colors={cubie.colors} />
          ))}
        </group>

        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
};
