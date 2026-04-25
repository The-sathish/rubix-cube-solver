import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CubeState, Color, COLOR_MAP, INITIAL_CUBE_STATE } from '../types';
import { applyMove } from '../lib/cubeLogic';

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
  highlight?: boolean;
}

const Cubie: React.FC<CubieProps> = ({ position, colors, highlight }) => {
  const materials = useMemo(() => {
    const defaultColor = '#111111';
    return [
      new THREE.MeshStandardMaterial({ color: colors.right ? COLOR_MAP[colors.right] : defaultColor }),
      new THREE.MeshStandardMaterial({ color: colors.left ? COLOR_MAP[colors.left] : defaultColor }),
      new THREE.MeshStandardMaterial({ color: colors.up ? COLOR_MAP[colors.up] : defaultColor }),
      new THREE.MeshStandardMaterial({ color: colors.down ? COLOR_MAP[colors.down] : defaultColor }),
      new THREE.MeshStandardMaterial({ color: colors.front ? COLOR_MAP[colors.front] : defaultColor }),
      new THREE.MeshStandardMaterial({ color: colors.back ? COLOR_MAP[colors.back] : defaultColor }),
    ];
  }, [colors]);

  return (
    <group position={position}>
      <mesh material={materials}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
      </mesh>
      {highlight && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} wireframe />
        </mesh>
      )}
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

interface MoveCube3DProps {
  move: string;
  isPlaying: boolean;
  speed: number;
  onComplete?: () => void;
  highlightFace?: 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
}

export const MoveCube3D: React.FC<MoveCube3DProps> = ({ move, isPlaying, speed, onComplete, highlightFace }) => {
  const [cubeState, setCubeState] = useState<CubeState>(INITIAL_CUBE_STATE);
  const [isAnimating, setIsAnimating] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (isPlaying && !isAnimating) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setCubeState(prev => applyMove(prev, move));
        setIsAnimating(false);
        if (onComplete) onComplete();
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isAnimating, move, speed, onComplete]);

  // Reset cube if move changes
  useEffect(() => {
    setCubeState(INITIAL_CUBE_STATE);
    setIsAnimating(false);
  }, [move]);

  const cubies = useMemo(() => {
    const result = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;

          const cubieColors: any = {};
          let isHighlighted = false;

          if (y === 1) {
            const idx = (x + 1) + ((-z + 1) * 3);
            cubieColors.up = cubeState.U[idx];
            if (highlightFace === 'U') isHighlighted = true;
          }
          if (y === -1) {
            const idx = (x + 1) + ((z + 1) * 3);
            cubieColors.down = cubeState.D[idx];
            if (highlightFace === 'D') isHighlighted = true;
          }
          if (x === 1) {
            const idx = ((-z + 1)) + ((-y + 1) * 3);
            cubieColors.right = cubeState.R[idx];
            if (highlightFace === 'R') isHighlighted = true;
          }
          if (x === -1) {
            const idx = ((z + 1)) + ((-y + 1) * 3);
            cubieColors.left = cubeState.L[idx];
            if (highlightFace === 'L') isHighlighted = true;
          }
          if (z === 1) {
            const idx = (x + 1) + ((-y + 1) * 3);
            cubieColors.front = cubeState.F[idx];
            if (highlightFace === 'F') isHighlighted = true;
          }
          if (z === -1) {
            const idx = ((-x + 1)) + ((-y + 1) * 3);
            cubieColors.back = cubeState.B[idx];
            if (highlightFace === 'B') isHighlighted = true;
          }

          result.push({ position: [x, y, z] as [number, number, number], colors: cubieColors, highlight: isHighlighted });
        }
      }
    }
    return result;
  }, [cubeState, highlightFace]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[4, 4, 4]} fov={45} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} makeDefault />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <group ref={groupRef}>
          {cubies.map((cubie, i) => (
            <Cubie key={i} position={cubie.position} colors={cubie.colors} highlight={cubie.highlight} />
          ))}
        </group>
        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
};
