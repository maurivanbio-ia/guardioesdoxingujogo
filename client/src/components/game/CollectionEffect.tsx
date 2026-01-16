import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollectionEvent {
  id: string;
  type: 'tool' | 'achievement' | 'phase' | 'impact';
  name: string;
  icon: string;
  timestamp: number;
}

export function CollectionEffect() {
  const [events, setEvents] = useState<CollectionEvent[]>([]);

  useEffect(() => {
    const handleToolCollected = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { toolName, icon } = customEvent.detail;

      const event: CollectionEvent = {
        id: `tool_${Date.now()}`,
        type: 'tool',
        name: toolName,
        icon: icon || '🔧',
        timestamp: Date.now(),
      };

      setEvents((prev) => [...prev, event]);
      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      }, 3000);
    };

    const handleAchievementUnlocked = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { name, icon } = customEvent.detail;

      const event: CollectionEvent = {
        id: `achievement_${Date.now()}`,
        type: 'achievement',
        name,
        icon: icon || '🏆',
        timestamp: Date.now(),
      };

      setEvents((prev) => [...prev, event]);
      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      }, 4000);
    };

    const handlePhaseCompleted = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { phaseName } = customEvent.detail;

      const event: CollectionEvent = {
        id: `phase_${Date.now()}`,
        type: 'phase',
        name: phaseName,
        icon: '⭐',
        timestamp: Date.now(),
      };

      setEvents((prev) => [...prev, event]);
      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      }, 5000);
    };

    window.addEventListener('toolCollected', handleToolCollected);
    window.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    window.addEventListener('phaseCompleted', handlePhaseCompleted);

    return () => {
      window.removeEventListener('toolCollected', handleToolCollected);
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
      window.removeEventListener('phaseCompleted', handlePhaseCompleted);
    };
  }, []);

  return (
    <div className="fixed top-24 right-4 z-50 pointer-events-none space-y-3">
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ x: 400, opacity: 0, scale: 0.5 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 blur-xl opacity-50 rounded-2xl" />
              
              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 1 }}
                    className="text-4xl"
                  >
                    {event.icon}
                  </motion.div>
                  
                  <div>
                    <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">
                      {event.type === 'tool' && 'Ferramenta Coletada'}
                      {event.type === 'achievement' && 'Conquista Desbloqueada'}
                      {event.type === 'phase' && 'Fase Completada'}
                      {event.type === 'impact' && 'Impacto Resolvido'}
                    </div>
                    <div className="text-white font-bold text-lg">
                      {event.name}
                    </div>
                  </div>
                </div>
                
                {/* Particle effects */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    initial={{ 
                      x: 20, 
                      y: 20, 
                      opacity: 1 
                    }}
                    animate={{ 
                      x: 20 + Math.cos(i * 60 * Math.PI / 180) * 80,
                      y: 20 + Math.sin(i * 60 * Math.PI / 180) * 80,
                      opacity: 0 
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
