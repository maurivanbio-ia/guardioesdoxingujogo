import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlowIndicator {
  id: string;
  label: string;
  type: 'nest' | 'turtle' | 'tool' | 'impact' | 'vulture' | 'npc';
}

export function InteractionGlow() {
  const [nearbyObject, setNearbyObject] = useState<GlowIndicator | null>(null);

  useEffect(() => {
    const handleNearInteractable = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, label, id } = customEvent.detail;

      setNearbyObject({ id, label, type });
    };

    const handleFarFromInteractable = () => {
      setNearbyObject(null);
    };

    window.addEventListener('nearInteractable', handleNearInteractable);
    window.addEventListener('farFromInteractable', handleFarFromInteractable);

    return () => {
      window.removeEventListener('nearInteractable', handleNearInteractable);
      window.removeEventListener('farFromInteractable', handleFarFromInteractable);
    };
  }, []);

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'nest':
        return { icon: '🥚', color: 'from-amber-400 to-orange-500', ring: 'ring-amber-400' };
      case 'turtle':
        return { icon: '🐢', color: 'from-green-400 to-emerald-500', ring: 'ring-green-400' };
      case 'tool':
        return { icon: '🔧', color: 'from-blue-400 to-cyan-500', ring: 'ring-blue-400' };
      case 'impact':
        return { icon: '🌍', color: 'from-red-400 to-pink-500', ring: 'ring-red-400' };
      case 'vulture':
        return { icon: '🦅', color: 'from-purple-400 to-violet-500', ring: 'ring-purple-400' };
      case 'npc':
        return { icon: '👤', color: 'from-yellow-400 to-amber-500', ring: 'ring-yellow-400' };
      default:
        return { icon: '✨', color: 'from-gray-400 to-slate-500', ring: 'ring-gray-400' };
    }
  };

  if (!nearbyObject) return null;

  const { icon, color, ring } = getIconAndColor(nearbyObject.type);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
      >
        <div className={`relative bg-gradient-to-r ${color} p-[2px] rounded-2xl shadow-2xl`}>
          <div className="bg-slate-900/95 backdrop-blur-sm px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-3xl"
              >
                {icon}
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">
                  {nearbyObject.label}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white">
                    E
                  </kbd>
                  <span className="text-xs text-gray-300">para interagir</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated ring */}
          <motion.div
            className={`absolute inset-0 rounded-2xl ring-2 ${ring}`}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
