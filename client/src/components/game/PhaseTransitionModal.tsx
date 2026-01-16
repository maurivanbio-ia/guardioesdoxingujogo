import { useState, useEffect } from 'react';
import { Moon, ArrowRight } from 'lucide-react';

interface PhaseTransitionModalProps {
  phaseNumber: number;
  title: string;
  description: string;
  onContinue: () => void;
}

export function PhaseTransitionModal({
  phaseNumber,
  title,
  description,
  onContinue,
}: PhaseTransitionModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);

    // Enable continue button after 5 seconds (cinematic duration)
    const continueTimer = setTimeout(() => {
      setCanContinue(true);
    }, 5000);

    return () => clearTimeout(continueTimer);
  }, []);

  const handleContinue = () => {
    if (!canContinue) return; // Prevent early skip
    setIsVisible(false);
    setTimeout(() => onContinue(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">

      <div
        className={`relative max-w-2xl mx-8 transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />

        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

          <div className="p-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 rounded-full blur-xl opacity-40 animate-pulse" />
                <div className="relative p-5 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full border-2 border-indigo-400/50">
                  <Moon className="w-12 h-12 text-indigo-200" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 mb-4 bg-indigo-500/20 border border-indigo-400/30 rounded-full">
                <p className="text-sm font-bold text-indigo-300">FASE {phaseNumber}</p>
              </div>

              <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {title}
              </h2>

              <p className="text-lg leading-relaxed text-slate-300 max-w-xl mx-auto">
                {description}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`group relative px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all flex items-center gap-3 ${
                  canContinue
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 text-white hover:shadow-purple-500/50 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 text-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{canContinue ? 'Continuar Monitoramento' : 'Aguarde...'}</span>
                <ArrowRight className={`w-6 h-6 transition-transform ${canContinue ? 'group-hover:translate-x-1' : ''}`} />
              </button>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
