import { useRef, useEffect, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '@/contexts/GameContext';
import { GAME_CONFIG, COLORS } from '@/lib/gameConstants';

// Preload biologist model
useGLTF.preload('/models/personagem-biologo.glb');

export function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const { gameState, updatePlayerPosition } = useGame();
  const velocity = useRef(new THREE.Vector3());
  const keysPressed = useRef<Set<string>>(new Set());
  const isJumping = useRef(false);
  const verticalVelocity = useRef(0);
  const groundY = 3.0; // Altura do chão

  // 🎮 Captura de teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 🔁 Loop principal
  useFrame((_, delta) => {
    if (!playerRef.current || gameState.isPaused || !gameState.gameStarted) return;

    const forward = keysPressed.current.has('w') || keysPressed.current.has('arrowup');
    const backward = keysPressed.current.has('s') || keysPressed.current.has('arrowdown');
    const left = keysPressed.current.has('a') || keysPressed.current.has('arrowleft');
    const right = keysPressed.current.has('d') || keysPressed.current.has('arrowright');
    const shift = keysPressed.current.has('shift');
    const space = keysPressed.current.has(' ');

    // 🦘 Sistema de pulo
    const onGround = playerRef.current.position.y <= groundY;

    if (space && onGround && !isJumping.current) {
      verticalVelocity.current = GAME_CONFIG.PLAYER_JUMP_FORCE;
      isJumping.current = true;
    }

    // Aplicar gravidade
    if (!onGround || verticalVelocity.current > 0) {
      verticalVelocity.current -= GAME_CONFIG.PLAYER_GRAVITY * delta;
      playerRef.current.position.y += verticalVelocity.current * delta;
    }

    // Manter no chão
    if (playerRef.current.position.y < groundY) {
      playerRef.current.position.y = groundY;
      verticalVelocity.current = 0;
      isJumping.current = false;
    }

    // Movimento horizontal
    const speed = shift ? GAME_CONFIG.PLAYER_RUN_SPEED : GAME_CONFIG.PLAYER_SPEED;
    const dir = new THREE.Vector3();

    if (forward) dir.z -= 1;
    if (backward) dir.z += 1;
    if (left) dir.x -= 1;
    if (right) dir.x += 1;

    if (dir.length() > 0) {
      dir.normalize();
      velocity.current.x = dir.x * speed;
      velocity.current.z = dir.z * speed;
    } else {
      velocity.current.multiplyScalar(0.8);
    }

    playerRef.current.position.addScaledVector(velocity.current, delta);

    if (velocity.current.length() > 0.05) {
      playerRef.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);
    }

    updatePlayerPosition({
      x: playerRef.current.position.x,
      y: playerRef.current.position.y,
      z: playerRef.current.position.z,
    });
  });

  return (
    <group ref={playerRef} position={[0, 3.0, 0]}>
      <Suspense fallback={<BiologistBodyFallback groupRef={useRef<THREE.Group>(null)} />}>
        <BiologistBody />
      </Suspense>
    </group>
  );
}

// 👨‍🔬 Corpo do biólogo (GLB model)
function BiologistBody() {
  const groupRef = useRef<THREE.Group>(null);
  const [useProceduralFallback, setUseProceduralFallback] = useState(false);

  // Try loading GLB model
  let gltf;
  try {
    gltf = useGLTF('/models/personagem-biologo.glb');
  } catch (error) {
    console.warn('Modelo do biólogo não encontrado, usando fallback procedural');
  }

  // 🫁 Animações leves (respiração)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = 0.05 * Math.sin(t * 1.5);
    }
  });

  // Use GLB model if available
  if (gltf?.scene && !useProceduralFallback) {
    return (
      <group ref={groupRef}>
        <primitive 
          object={gltf.scene.clone()} 
          scale={[0.6, 0.6, 0.6]}
          position={[0, 0, 0]}
        />
      </group>
    );
  }

  // Fallback to procedural geometry
  return <BiologistBodyFallback groupRef={groupRef} />;
}

// 🌿 Torso com logo EcoBrasil destacada e brilho pulsante
function TorsoWithLogo() {
  const logoTexture = useTexture('http://ecobrasil.bio.br/wp-content/uploads/2017/02/Logo-Retina-a.png');
  const glowRef = useRef<THREE.Mesh>(null);
  const logoRef = useRef<THREE.Mesh>(null);

  // ✨ Efeito de brilho pulsante (simula reflexo solar no tecido)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.2 + Math.sin(t * 1.5) * 0.15;
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.25 + pulse * 0.5;
    }
    if (logoRef.current) {
      logoRef.current.material.emissiveIntensity = 0.25 + pulse * 0.3;
    }
  });

  return (
    <group>
      {/* Corpo da camiseta */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color="#005c2b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Contorno branco translúcido para destacar a logo */}
      <mesh position={[0, 1.05, 0.154]} ref={glowRef}>
        <planeGeometry args={[0.38, 0.17]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Logo EcoBrasil com leve emissividade */}
      <mesh position={[0, 1.05, 0.155]} ref={logoRef}>
        <planeGeometry args={[0.35, 0.14]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

// 👨‍🔬 Fallback procedural body
function BiologistBodyFallback({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // 🫁 Animações de braços
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 3) * 0.15;
      rightArmRef.current.rotation.z = -Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cabeça */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFD9B3" roughness={0.8} />
      </mesh>

      {/* Chapéu */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Torso com logo EcoBrasil */}
      <TorsoWithLogo />

      {/* Braços */}
      <mesh ref={leftArmRef} position={[-0.4, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#005c2b" />
      </mesh>
      <mesh ref={rightArmRef} position={[0.4, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#005c2b" />
      </mesh>

      {/* Mãos */}
      <mesh position={[-0.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFD9B3" />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFD9B3" />
      </mesh>

      {/* Calça e pernas */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.3]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>
      <mesh position={[-0.15, 0.0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>
      <mesh position={[0.15, 0.0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#C4A574" />
      </mesh>

      {/* Botas */}
      <mesh position={[-0.15, -0.3, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.25]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.15, -0.3, 0.05]} castShadow>
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
