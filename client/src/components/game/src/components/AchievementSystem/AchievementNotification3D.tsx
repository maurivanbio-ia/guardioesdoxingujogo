/**
 * AchievementNotification3D.tsx
 * Versão cinematográfica com partículas 3D e som espacial
 */

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Trophy } from 'lucide-react';
import { Achievement } from '@/lib/achievementManager';

// 🎧 Sons 3D (com paneamento leve)
const playSpatialSound = (file: string, pan = 0) => {
  const sound = new Howl({
    src: [file],
    volume: 0.7,
    stereo: pan,
  });
  sound.play();
};

// ✨ Partícula 3D simples
function Particle({ color }: { color: string }) {
  const mesh = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      if (!mesh.current) return;
      mesh.current.position.y += 0.02;
      mesh.current.rotation.y += 0.02;
      if (mesh.current.position.y > 3) mesh.current.position.y = 0;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <mesh ref={mesh} position={[Math.random() * 2 - 1, Math.random(), Math.random() * 2 - 1]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  );
}

// 💫 Cena de partículas
function ParticleField({ color }: { color: string }) {
  return (
    <>
      {[...Array(40)].map((_, i) => (
        <Particle key={i} color={color} />
      ))}
      <pointLight position={[2, 3, 2]} intensity={1.5} color={color} />
      <ambientLight intensity={0.4} />
    </>
  );
}

export function AchievementNotification3D({
  achievement,
  onComplete,
  index,
}: {
  achievement: Achievement;
  onComplete: () => void;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const getColor = () =>
    achievement.rarity === 'legendary'
      ? '#ffd700'
      : achievement.rarity === 'rare'
      ? '#7df9ff'
      : '#a3e635';

  const soundFile =
    achievement.rarity === 'legendary'
      ? '/sounds/legendary.mp3'
      : achievement.rarity === 'rare'
      ? '/sounds/rare.mp3'
      : '/sounds/achievement.mp3';

  useEffect(() => {
    playSpatialSound(soundFile, Math.random() * 0.6 - 0.3);
    const enter = setTimeout(() => setVisible(true), 200);
    const exit = setTimeout(() => setLeaving(true), 5500);
    const end = setTimeout(onComplete, 6200);
    return () => [enter, exit, end].forEach(clearTimeout);
  }, [soundFile, onComplete]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          initial={{ opacity: 0, x: 120 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 120 }}
          transition={{ duration: 0.6 }}
          className="fixed right-4 top-24 z-[1000] w-[380px] cursor-pointer"
          onClick={() => setLeaving(true)}
        >
          <div className="relative rounded-2xl overflow-hidden bg-slate-900/80 border border-yellow-400/30 shadow-[0_0_30px_rgba(255,255,200,0.2)] backdrop-blur-md">
            <div className="absolute inset-0">
              <Canvas camera={{ position: [0, 1.5, 2] }}>
                <Suspense fallback={null}>
                  <ParticleField color={getColor()} />
                </Suspense>
              </Canvas>
            </div>

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative bg-gradient-to-br from-yellow-500 to-amber-700 rounded-full p-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-yellow-300 font-bold text-sm uppercase tracking-wider">
                    Conquista Desbloqueada!
                  </h3>
                  <p className="text-white/70 text-xs">+{achievement.xp || 10} XP</p>
                </div>
              </div>

              <h4 className="text-white font-bold text-lg mb-1">{achievement.title}</h4>
              <p className="text-white/80 text-sm mb-2">{achievement.description}</p>

              <div className="flex items-center gap-2 mt-3">
                <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5.5 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </div>
                <span className="text-yellow-300 text-xs font-bold">100%</span>
              </div>

              <p className="mt-3 text-emerald-300 text-xs flex items-center gap-2">
                <span className="text-lg">✨</span>
                {achievement.effect}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
