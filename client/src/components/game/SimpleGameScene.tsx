import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

export function SimpleGameScene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Iluminação */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Céu */}
          <Sky
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0.6}
            azimuth={0.25}
          />

          {/* Ambiente */}
          <Environment preset="sunset" />

          {/* Rio - Água */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
              color="#4A7C8E"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Praia - Areia */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, -30]} receiveShadow>
            <planeGeometry args={[100, 40]} />
            <meshStandardMaterial
              color="#D4B896"
              roughness={0.9}
            />
          </mesh>

          {/* Personagem Biólogo */}
          <BiologistCharacter />

          {/* Tartaruga de exemplo */}
          <TurtleModel position={[3, 0, 2]} />
          <TurtleModel position={[-4, 0, 1]} />
          <TurtleModel position={[2, 0, -5]} />

          {/* Vegetação simples */}
          <Tree position={[-8, 0, -35]} />
          <Tree position={[-5, 0, -38]} />
          <Tree position={[6, 0, -36]} />
          <Tree position={[9, 0, -40]} />

          {/* Controles */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg">
        <h3 className="text-xl font-bold text-green-400 mb-2">🐢 Guardião do Xingu</h3>
        <p className="text-sm text-gray-300">Use o mouse para explorar</p>
        <p className="text-xs text-gray-400 mt-2">Arraste: Rotacionar | Scroll: Zoom</p>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/70 text-white p-4 rounded-lg">
        <p className="text-sm">🔬 <strong>Missão:</strong> Observar tartarugas</p>
        <p className="text-xs text-gray-400 mt-1">Pressione ESC para voltar ao menu</p>
      </div>
    </div>
  );
}

function BiologistCharacter() {
  return (
    <group position={[0, 0, 5]}>
      {/* Cabeça */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFD9B3" />
      </mesh>

      {/* Chapéu */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Torso - Camiseta VERDE ECOBRASIL */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color="#00A651" />
      </mesh>

      {/* Logo Ecobrasil nas costas */}
      <mesh position={[0, 1, -0.16]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Braços */}
      <mesh position={[-0.4, 0.9, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#00A651" />
      </mesh>
      <mesh position={[0.4, 0.9, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#00A651" />
      </mesh>

      {/* Calça bege */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.3]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>

      {/* Pernas */}
      <mesh position={[-0.15, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>
      <mesh position={[0.15, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>

      {/* Botas */}
      <mesh position={[-0.15, -0.7, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.25]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.15, -0.7, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.25]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Mochila */}
      <mesh position={[0, 0.9, -0.25]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#2F4F2F" />
      </mesh>
    </group>
  );
}

function TurtleModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Casco */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#4A5D3F" roughness={0.8} />
      </mesh>

      {/* Padrão do casco */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#5D7350" roughness={0.7} />
      </mesh>

      {/* Cabeça */}
      <mesh position={[0.35, 0.1, 0]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.15]} />
        <meshStandardMaterial color="#6B8E5D" />
      </mesh>

      {/* Patas (4) */}
      <mesh position={[0.2, 0, 0.25]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.1]} />
        <meshStandardMaterial color="#6B8E5D" />
      </mesh>
      <mesh position={[0.2, 0, -0.25]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.1]} />
        <meshStandardMaterial color="#6B8E5D" />
      </mesh>
      <mesh position={[-0.2, 0, 0.25]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.1]} />
        <meshStandardMaterial color="#6B8E5D" />
      </mesh>
      <mesh position={[-0.2, 0, -0.25]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.1]} />
        <meshStandardMaterial color="#6B8E5D" />
      </mesh>

      {/* Cauda */}
      <mesh position={[-0.35, 0.05, 0]} castShadow>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#6B8E5D" />
      </mesh>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tronco */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
        <meshStandardMaterial color="#5D4E37" roughness={0.9} />
      </mesh>

      {/* Copa */}
      <mesh position={[0, 5, 0]} castShadow>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial color="#2D5016" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#4A7C2C" roughness={0.8} />
      </mesh>
    </group>
  );
}

