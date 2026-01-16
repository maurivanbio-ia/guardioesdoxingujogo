import React, { useEffect, useState } from 'react';
import { X, Clock, Trophy } from 'lucide-react';
import type { RandomEvent } from '@/lib/randomEventsSystem';

interface RandomEventNotificationProps {
  event: RandomEvent;
  onClose: () => void;
  timeRemaining: number;
}

export function RandomEventNotification({ event, onClose, timeRemaining }: RandomEventNotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress((timeRemaining / event.duration) * 100);
  }, [timeRemaining, event.duration]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] max-w-lg w-full mx-4 animate-slide-down">
      <div className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-400/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">{event.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                  EVENTO ESPECIAL
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-white/90 text-sm mb-4">{event.description}</p>

          {/* Timer and Reward */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">+{event.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="font-mono">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
