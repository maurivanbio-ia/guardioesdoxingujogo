import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, TrendingUp, TrendingDown } from 'lucide-react';

interface PointsFeedbackProps {
  points: number;
  recentAction?: {
    name: string;
    points: number;
  } | null;
}

export function PointsFeedback({ points, recentAction }: PointsFeedbackProps) {
  const [showRecentAction, setShowRecentAction] = useState(false);

  useEffect(() => {
    if (recentAction) {
      setShowRecentAction(true);
      const timer = setTimeout(() => {
        setShowRecentAction(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentAction]);

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-3">
      <div className="bg-gradient-to-br from-emerald-900/90 to-green-900/90 backdrop-blur-md border-2 border-emerald-500/60 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3">
        <Leaf className="w-8 h-8 text-emerald-400" />
        <div>
          <p className="text-xs text-emerald-200 font-medium">Pontos Ambientais</p>
          <p className="text-3xl font-black text-white">{points}</p>
        </div>
      </div>

      <AnimatePresence>
        {showRecentAction && recentAction && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              recentAction.points > 0
                ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                : 'bg-gradient-to-br from-red-600 to-orange-600'
            } backdrop-blur-md border-2 ${
              recentAction.points > 0
                ? 'border-green-400/60'
                : 'border-red-400/60'
            } rounded-xl px-5 py-3 shadow-xl`}
          >
            <div className="flex items-center gap-3">
              {recentAction.points > 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
              <div>
                <p className="text-sm text-white font-medium">{recentAction.name}</p>
                <p className="text-xl font-black text-white">
                  {recentAction.points > 0 ? '+' : ''}{recentAction.points}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
