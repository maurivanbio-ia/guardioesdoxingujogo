import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, GAME_CONFIG } from '@/lib/gameConstants';
import { useGame } from '@/contexts/GameContext';

export function XinguEnvironment() {
  const { gameState } = useGame();
  // Removido carregamento de textura externa para evitar erros 404
  const waterRef = useRef<any>(null);

  // Atualizar água (animação simples)
  useFrame((state, delta) => {
    if (waterRef.current) {
      // Animação de ondulação suave
      waterRef.current.position.y = GAME_CONFIG.WATER_LEVEL + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Calcular cor do céu baseado no horário
  const getSkyColor = () => {
    const time = gameState.timeOfDay;
    
    if (time < 0.25 || time > 0.75) {
      // Noite
      return new THREE.Color(COLORS.skyNight);
    } else if (time < 0.35 || time > 0.65) {
      // Amanhecer/Entardecer
      return new THREE.Color('#FF6B35');
    } else {
      // Dia
      return new THREE.Color(COLORS.sky);
    }
  };

  // Calcular intensidade da luz
  const getLightIntensity = () => {
    const time = gameState.timeOfDay;
    if (time < 0.25 || time > 0.75) return 0.3; // Noite
    if (time < 0.35 || time > 0.65) return 0.7; // Crepúsculo
    return 1.5; // Dia
  };

  // Calcular posição do sol
  const getSunPosition = (): [number, number, number] => {
    const time = gameState.timeOfDay;
    const angle = time * Math.PI * 2;
    return [
      Math.cos(angle) * 100,
      Math.sin(angle) * 100,
      0
    ];
  };

  return (
    <>
      {/* Iluminação */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={getSunPosition()}
        intensity={getLightIntensity()}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight
        color={getSkyColor()}
        groundColor={new THREE.Color(COLORS.sandDark)}
        intensity={0.5}
      />

      {/* Céu */}
      <Sky
        distance={450000}
        sunPosition={getSunPosition()}
        inclination={0.6}
        azimuth={0.25}
      />

      {/* Névoa atmosférica */}
      <fog attach="fog" args={[getSkyColor().getHex(), 50, 200]} />

      {/* Praia (areia) */}
      <Beach />

      {/* Rio */}
      <mesh
        ref={waterRef}
        position={[0, GAME_CONFIG.WATER_LEVEL, -GAME_CONFIG.BEACH_WIDTH / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200, 64, 64]} />
        <meshStandardMaterial
          color={COLORS.water}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Floresta de galeria */}
      <Forest />

      {/* Vegetação da praia */}
      <BeachVegetation />

      {/* Ambiente de reflexão */}
      <Environment preset="sunset" />
    </>
  );
}

function Beach() {
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[GAME_CONFIG.BEACH_LENGTH, GAME_CONFIG.BEACH_WIDTH]} />
      <meshStandardMaterial
        color={COLORS.sand}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

function Forest() {
  const trees: React.ReactElement[] = [];
  const treeCount = 50;

  for (let i = 0; i < treeCount; i++) {
    const x = (Math.random() - 0.5) * GAME_CONFIG.BEACH_LENGTH;
    const z = GAME_CONFIG.BEACH_WIDTH / 2 + Math.random() * 20;
    const height = 8 + Math.random() * 6;
    const radius = 2 + Math.random() * 2;

    trees.push(
      <group key={`tree-${i}`} position={[x, 0, z]}>
        {/* Tronco */}
        <mesh castShadow position={[0, height / 2, 0]}>
          <cylinderGeometry args={[0.3, 0.4, height, 8]} />
          <meshStandardMaterial color="#4A3728" roughness={0.9} />
        </mesh>
        {/* Copa */}
        <mesh castShadow position={[0, height + radius / 2, 0]}>
          <sphereGeometry args={[radius, 8, 8]} />
          <meshStandardMaterial color={COLORS.forest} roughness={0.8} />
        </mesh>
      </group>
    );
  }

  return <>{trees}</>;
}

function BeachVegetation() {
  const plants: React.ReactElement[] = [];
  const plantCount = 30;

  for (let i = 0; i < plantCount; i++) {
    const x = (Math.random() - 0.5) * GAME_CONFIG.BEACH_LENGTH * 0.8;
    const z = (Math.random() - 0.5) * GAME_CONFIG.BEACH_WIDTH * 0.8;
    const scale = 0.3 + Math.random() * 0.5;

    plants.push(
      <mesh
        key={`plant-${i}`}
        position={[x, 0, z]}
        scale={[scale, scale, scale]}
        castShadow
      >
        <coneGeometry args={[0.2, 1, 6]} />
        <meshStandardMaterial color={COLORS.foliage} roughness={0.8} />
      </mesh>
    );
  }

  return <>{plants}</>;
}

