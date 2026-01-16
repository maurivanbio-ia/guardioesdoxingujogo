import { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';

export interface EducationalCardData {
  id: string;
  title: string;
  content: string;
  icon?: string;
  autoCloseDelay?: number;
}

interface EducationalCardProps {
  card: EducationalCardData;
  onClose: () => void;
}

// Global cooldown to prevent card overlap (8 seconds minimum between cards)
let lastCardTimestamp = 0;
const CARD_COOLDOWN = 1000; // 1 second cooldown between cards

export function EducationalCard({ card, onClose }: EducationalCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let visibilityTimer: ReturnType<typeof setTimeout> | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;
    
    // Check global cooldown
    const now = Date.now();
    const timeSinceLastCard = now - lastCardTimestamp;
    
    if (timeSinceLastCard < CARD_COOLDOWN) {
      // Card is in cooldown, delay showing
      const delay = CARD_COOLDOWN - timeSinceLastCard;
      visibilityTimer = setTimeout(() => {
        setIsVisible(true);
        lastCardTimestamp = Date.now();
        
        // Schedule auto-close after card becomes visible
        if (card.autoCloseDelay && card.autoCloseDelay > 0) {
          closeTimer = setTimeout(() => {
            handleClose();
          }, card.autoCloseDelay);
        }
      }, delay);
    } else {
      // Show immediately
      visibilityTimer = setTimeout(() => setIsVisible(true), 100);
      lastCardTimestamp = now;
      
      // Schedule auto-close
      if (card.autoCloseDelay && card.autoCloseDelay > 0) {
        closeTimer = setTimeout(() => {
          handleClose();
        }, card.autoCloseDelay);
      }
    }

    return () => {
      if (visibilityTimer) clearTimeout(visibilityTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [card.autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      className={`fixed top-24 right-8 z-50 max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="relative bg-gradient-to-br from-emerald-900/95 via-teal-900/95 to-cyan-900/95 backdrop-blur-lg border-2 border-emerald-400/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                <Lightbulb className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-white/70 hover:text-white" />
            </button>
          </div>

          <div className="text-emerald-50/90 text-base leading-relaxed">
            {card.content}
          </div>

          {card.icon && (
            <div className="mt-4 text-4xl text-center">
              {card.icon}
            </div>
          )}
        </div>

        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
      </div>
    </div>
  );
}
