import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPParticle {
  id: string;
  amount: number;
  x: number;
  y: number;
}

export function XPParticles() {
  const [particles, setParticles] = useState<XPParticle[]>([]);

  useEffect(() => {
    const handleXPGained = (e: Event) => {
      const customEvent = e as CustomEvent;
      const amount = customEvent.detail;

      // Get random position near center of screen
      const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      const y = window.innerHeight / 2 + (Math.random() - 0.5) * 100;

      const particle: XPParticle = {
        id: `xp_${Date.now()}_${Math.random()}`,
        amount,
        x,
        y,
      };

      setParticles((prev) => [...prev, particle]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      }, 2000);
    };

    window.addEventListener('xpGained', handleXPGained);
    return () => window.removeEventListener('xpGained', handleXPGained);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: 0, 
              scale: 0.5 
            }}
            animate={{ 
              x: particle.x + (Math.random() - 0.5) * 50,
              y: particle.y - 150, 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1.2, 1, 0.8] 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute text-2xl font-bold"
            style={{
              textShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.5)',
            }}
          >
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
              +{particle.amount} XP
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
