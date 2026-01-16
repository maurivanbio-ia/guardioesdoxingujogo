import { useEffect, useState } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

interface VultureScareInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VultureScareInfo({ isOpen, onClose }: VultureScareInfoProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(onClose, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 60); // 3 seconds total

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-br from-orange-900/95 to-red-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-orange-400/50 p-6 max-w-md">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-500/30 rounded-full flex items-center justify-center border-2 border-orange-400/50 animate-pulse">
            <AlertTriangle className="w-7 h-7 text-orange-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-200 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Urubus Espantados!
            </h3>
            <p className="text-orange-300/70 text-sm">Predadores naturais afastados</p>
          </div>
        </div>

        {/* Educational Content */}
        <div className="bg-black/30 rounded-xl p-4 border border-orange-400/20 mb-4">
          <p className="text-orange-100 text-sm leading-relaxed mb-3">
            <span className="font-bold text-orange-200">📚 Você sabia?</span>
          </p>
          <p className="text-orange-100/90 text-sm leading-relaxed">
            No tabuleiro do Embaubal, os <span className="font-bold text-orange-200">urubus são os maiores predadores de filhotes</span> de tartarugas. Eles atacam os ninhos e capturam os filhotes durante a eclosão, sendo responsáveis por grande parte da mortalidade natural.
          </p>
        </div>

        {/* Impact Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-sm font-bold">+5 ICX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-300 text-sm font-bold">+5 XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
