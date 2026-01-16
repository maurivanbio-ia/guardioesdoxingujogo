/**
 * TurtleFallback Ultra Realista
 * - Geometria orgânica procedural baseada em proporções anatômicas reais de Podocnemis spp.
 * - Movimento naturalista (respiração, nado e escavação)
 * - Materiais PBR com variação cromática e textura de escudos simulada por ruído
 */

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export type Species = 'expansa' | 'unifilis' | 'sextuberculata';

export interface TurtleFallbackProps {
  species: Species;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  individualId?: string | number;
  variant?: 'adult' | 'hatchling';
  isNesting?: boolean;
  isSwimming?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

const CONFIG = {
  expansa: { shell: 0x2b1a0f, plastron: 0xe3c691, skin: 0x3a2f20, size: 1.0 },
  unifilis: { shell: 0x5c4634, plastron: 0xbca066, skin: 0x4c4a38, faceMark: 0xffe24a, size: 0.85 },
  sextuberculata: { shell: 0x6b5440, plastron: 0xd1b493, skin: 0x5b5146, size: 0.65 },
};

function noiseColor(base: THREE.Color, intensity = 0.08, seed = 1): THREE.Color {
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const rand = (Math.sin(seed * 9999.3) * 0.5 + 0.5) * intensity;
  return new THREE.Color().setHSL(hsl.h + rand * 0.2, hsl.s * (1 + rand), hsl.l * (1 + rand * 0.3));
}

export function TurtleFallback({
  species,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  individualId = 1,
  variant = 'adult',
  isNesting = false,
  isSwimming = true,
  castShadow = true,
  receiveShadow = true,
}: TurtleFallbackProps) {
  const group = useRef<THREE.Group>(null);
  const flippers = useRef<THREE.Mesh[]>([]);
  const headRef = useRef<THREE.Group>(null);
  const cfg = CONFIG[species];

  const seed = typeof individualId === 'number' ? individualId : individualId.toString().charCodeAt(0);
  const baseShell = noiseColor(new THREE.Color(cfg.shell), 0.1, seed);
  const finalScale = cfg.size * scale * (variant === 'hatchling' ? 0.12 : 1);

  const materials = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: baseShell,
        roughness: 0.5,
        metalness: 0.1,
        clearcoat: 0.3,
        sheen: 0.25,
        reflectivity: 0.4,
      }),
      plastron: new THREE.MeshStandardMaterial({
        color: cfg.plastron,
        roughness: 0.7,
        metalness: 0.0,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: cfg.skin,
        roughness: 0.9,
        metalness: 0.0,
      }),
      mark: cfg.faceMark
        ? new THREE.MeshStandardMaterial({
            color: cfg.faceMark,
            emissive: cfg.faceMark,
            emissiveIntensity: 0.2,
          })
        : null,
    }),
    [cfg, baseShell]
  );

  // 🌊 Movimento natural: respiração + nado + escavação
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;

    const breathe = 1 + Math.sin(t * 1.6) * 0.012;
    group.current.scale.setScalar(finalScale * breathe);

    if (isSwimming) group.current.position.y = Math.sin(t * 0.9) * 0.05;
    if (isNesting) group.current.position.y = Math.sin(t * 5) * 0.02;

    // Cabeça e pescoço
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.12;
      headRef.current.position.x = 0.95 + Math.sin(t * 0.5) * 0.03;
    }

    // Nadadeiras com defasagem
    flippers.current.forEach((f, i) => {
      const phase = (i % 2 === 0 ? 0 : Math.PI) + i * 0.3;
      const amp = isSwimming ? 0.4 : 0.15;
      const spd = isSwimming ? 3.5 : isNesting ? 4.2 : 1.6;
      f.rotation.z = Math.sin(t * spd + phase) * amp * (i < 2 ? 1 : -1);
    });
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* 🐢 Carapaça convexa com pontes laterais */}
      <mesh castShadow={castShadow} receiveShadow={receiveShadow}>
        <latheGeometry
          args={[
            Array.from({ length: 24 }, (_, i) => {
              const a = i / 24;
              const r = Math.sin(a * Math.PI) * 1.2;
              const y = Math.cos(a * Math.PI) * 0.7;
              return new THREE.Vector2(r, y);
            }),
            36,
          ]}
        />
        <primitive object={materials.shell} attach="material" />
      </mesh>

      {/* 🧱 Plastron plano (casco inferior) */}
      <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]} receiveShadow>
        <latheGeometry
          args={[
            Array.from({ length: 18 }, (_, i) => {
              const a = i / 18;
              const r = Math.sin(a * Math.PI) * 1.0;
              const y = Math.cos(a * Math.PI) * 0.25;
              return new THREE.Vector2(r, y);
            }),
            36,
          ]}
        />
        <primitive object={materials.plastron} attach="material" />
      </mesh>

      {/* 🧠 Cabeça alongada com focinho */}
      <group ref={headRef} position={[1.0, -0.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.25, 20, 20]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <coneGeometry args={[0.09, 0.3, 16]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        {/* Olhos laterais */}
        <mesh position={[0.22, 0.08, 0.15]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshPhysicalMaterial color="#111" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0.22, 0.08, -0.15]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshPhysicalMaterial color="#111" roughness={0.4} metalness={0.8} />
        </mesh>
        {cfg.faceMark && (
          <>
            <mesh position={[0.18, 0.02, 0.12]}>
              <circleGeometry args={[0.06, 16]} />
              <primitive object={materials.mark!} attach="material" />
            </mesh>
            <mesh position={[0.18, 0.02, -0.12]}>
              <circleGeometry args={[0.06, 16]} />
              <primitive object={materials.mark!} attach="material" />
            </mesh>
          </>
        )}
      </group>

      {/* 🦾 Nadadeiras arredondadas e largas */}
      {[
        [0.45, -0.25, 0.8], // frente esquerda
        [0.45, -0.25, -0.8], // frente direita
        [-0.55, -0.25, 0.7], // traseira esquerda
        [-0.55, -0.25, -0.7], // traseira direita
      ].map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => el && (flippers.current[i] = el)}
          position={pos as any}
          rotation={[0, 0, i < 2 ? -0.3 : 0.3]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.18, 0.45, 20]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
      ))}

      {/* 🌀 Cauda afinada */}
      <mesh position={[-0.9, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.25, 16]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>
    </group>
  );
}
