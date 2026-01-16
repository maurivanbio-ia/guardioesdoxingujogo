/**
 * ScoreFeedback - Feedback visual para mudanças de pontuação
 * Mostra animações quando pontos são ganhos ou perdidos
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreChange } from '@/lib/useScoreSystem';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface ScoreFeedbackProps {
  lastScoreChange: ScoreChange | null;
}

export function ScoreFeedback({ lastScoreChange }: ScoreFeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastScoreChange) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [lastScoreChange]);

  if (!lastScoreChange || !visible) return null;

  const isPositive = lastScoreChange.points > 0;
  const isRare = Math.abs(lastScoreChange.points) >= 200;

  return (
    <AnimatePresence>
      <motion.div
        key={lastScoreChange.timestamp}
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      >
        <div
          className={`
            px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border-2
            ${isPositive 
              ? 'bg-gradient-to-r from-emerald-600/90 to-green-600/90 border-emerald-400/50' 
              : 'bg-gradient-to-r from-red-600/90 to-orange-600/90 border-red-400/50'
            }
            ${isRare ? 'scale-110' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {/* Ícone */}
            {isRare && isPositive ? (
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            ) : isPositive ? (
              <TrendingUp className="w-6 h-6 text-white" />
            ) : (
              <TrendingDown className="w-6 h-6 text-white" />
            )}

            {/* Pontos */}
            <div className="text-2xl font-bold text-white">
              {isPositive ? '+' : ''}{lastScoreChange.points}
            </div>

            {/* Descrição */}
            <div className="text-sm text-white/90 max-w-[200px]">
              {lastScoreChange.description}
            </div>
          </div>

          {/* Partículas para descobertas raras */}
          {isRare && isPositive && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 60,
                    y: Math.sin((i / 8) * Math.PI * 2) * 60,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
