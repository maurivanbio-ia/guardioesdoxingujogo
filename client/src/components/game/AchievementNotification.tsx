import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Trophy, X } from 'lucide-react';
import { Achievement } from '@/lib/achievementManager';

// ✨ Componente de partículas com Framer Motion
const Sparkle = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0.8, 0], scale: [1, 2] }}
    transition={{ duration: 1.8, delay, repeat: Infinity }}
    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
    style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      filter: 'blur(1px)',
    }}
  />
);

interface AchievementNotificationProps {
  achievement: Achievement;
  onComplete: () => void;
  index: number;
}

export function AchievementNotification({ achievement, onComplete, index }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Controle de timers e som
  useEffect(() => {
    // 🔊 Criar e tocar som
    try {
      audioRef.current = new Audio('/xp-gain.wav');
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Som bloqueado:', err));
      }
      
      if (navigator.vibrate) navigator.vibrate([40, 20, 40]);
    } catch (error) {
      console.error('Erro ao tocar som:', error);
    }

    // Timer para parar o som após 1 segundo
    const soundTimer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
      }
    }, 1000);

    const entryTimer = setTimeout(() => setIsVisible(true), 100);
    const exitTimer = setTimeout(() => setIsLeaving(true), 4800);
    const completeTimer = setTimeout(() => onComplete(), 5400);

    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsLeaving(true);
    window.addEventListener('keydown', handleKey);

    return () => {
      // Cleanup: sempre parar e limpar o áudio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      }
      [soundTimer, entryTimer, exitTimer, completeTimer].forEach(clearTimeout);
      window.removeEventListener('keydown', handleKey);
    };
  }, [achievement, onComplete]);

  return (
    <AnimatePresence>
      {!isLeaving && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4 }}
          aria-live="assertive"
          role="status"
          className={clsx(
            'fixed right-4 z-[1000] transition-all duration-500 cursor-pointer select-none',
            `top-${24 + index * 120}px`
          )}
          onClick={() => setIsLeaving(true)}
        >
          <div
            className={clsx(
              'bg-gradient-to-br p-1 rounded-2xl shadow-2xl overflow-hidden relative',
              achievement.iconColor
            )}
          >
            <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-6 min-w-[320px] relative">
              {/* Botão X para fechar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLeaving(true);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
                aria-label="Fechar"
              >
                <X className="w-4 h-4 text-white/70 group-hover:text-white" />
              </button>
              
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse" />
                  <div className={`relative bg-gradient-to-br ${achievement.iconColor} rounded-full p-3`}>
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-yellow-300 font-bold text-sm uppercase tracking-wider">
                    Conquista Desbloqueada!
                  </h3>
                  <p className="text-white/70 text-xs font-mono">+{achievement.xp || 10} XP</p>
                </div>
              </div>

              {/* CONTEÚDO PRINCIPAL */}
              <div className="flex items-center gap-4">
                <div className="text-4xl animate-pulse">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-1">{achievement.title}</h4>
                  <p className="text-white/70 text-sm mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5 }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                      />
                    </div>
                    <span className="text-yellow-300 text-xs font-bold">100%</span>
                  </div>
                </div>
              </div>

              {/* EFEITO */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-emerald-300 text-xs flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  {achievement.effect}
                </p>
              </div>
            </div>

            {/* PARTÍCULAS */}
            <div className="absolute -inset-4 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <Sparkle key={i} delay={i * 0.2} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementQueueProps {
  achievements: Achievement[];
  onClear: () => void;
}

export function AchievementQueue({ achievements, onClear }: AchievementQueueProps) {
  const [queue, setQueue] = useState<Achievement[]>(achievements);

  useEffect(() => setQueue(achievements), [achievements]);

  const handleComplete = useCallback(() => {
    setQueue((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) onClear();
      return next;
    });
  }, [onClear]);

  if (queue.length === 0) return null;

  return (
    <>
      {queue.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id || index}
          achievement={achievement}
          onComplete={handleComplete}
          index={index}
        />
      ))}
    </>
  );
}
