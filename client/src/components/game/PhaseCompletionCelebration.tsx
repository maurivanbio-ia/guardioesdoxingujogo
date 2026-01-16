import { useEffect, useState } from 'react';
import { Trophy, Star, ChevronRight, Sparkles, Award, Target } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

interface PhaseCompletionCelebrationProps {
  isOpen: boolean;
  onContinue: () => void;
}

export function PhaseCompletionCelebration({ isOpen, onContinue }: PhaseCompletionCelebrationProps) {
  const { getCurrentPhase, isGameComplete } = useGame();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPhase = getCurrentPhase();
  const gameComplete = isGameComplete();
  
  // Phase titles based on phase ID
  const phaseTitles: { [key: number]: string } = {
    1: 'Pesquisador Ético',
    2: 'Guardião da Praia',
    3: 'Protetor Noturno',
    4: 'Cientista de Campo',
    5: 'Conservacionista Experiente'
  };
  
  const phaseTitle = phaseTitles[currentPhase.id] || 'Pesquisador';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" />
      
      {/* Confetti Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Celebration Card */}
      <div 
        className={`relative bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-pink-500/20 
          rounded-3xl border-4 border-yellow-400/50 p-8 max-w-2xl w-full mx-4 
          shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all duration-500 ${
          showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        {/* Golden Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-pink-400/10 rounded-3xl animate-pulse" />

        {/* Sparkle Effects */}
        <div className="absolute -top-6 -right-6 text-yellow-400 animate-spin-slow">
          <Sparkles className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-6 -left-6 text-pink-400 animate-bounce">
          <Star className="w-12 h-12 fill-current" />
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          {/* Trophy Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-full 
                shadow-2xl border-4 border-yellow-300/50 animate-bounce-slow">
                <Trophy className="w-20 h-20 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h2 className="text-5xl font-black text-transparent bg-clip-text 
              bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-400 
              drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-pulse-slow">
              PARABÉNS! 🎉
            </h2>
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              Você passou na Fase {currentPhase.id}!
            </p>
            <p className="text-2xl font-bold text-gradient bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
              Agora você é um {phaseTitle}
            </p>
            <p className="text-lg text-yellow-200/70">
              {currentPhase.name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border-2 border-green-400/50 
              hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Target className="w-8 h-8 text-green-400" />
                <div className="text-3xl font-bold text-green-300">
                  {currentPhase.currentXP}
                </div>
                <div className="text-xs text-white/70">XP Ganhos</div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-400/50 
              hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Award className="w-8 h-8 text-yellow-400" />
                <div className="text-3xl font-bold text-yellow-300">
                  100%
                </div>
                <div className="text-xs text-white/70">Conclusão</div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-400/50 
              hover:scale-105 transition-transform">
              <div className="flex flex-col items-center gap-2">
                <Star className="w-8 h-8 text-purple-400 fill-current" />
                <div className="text-3xl font-bold text-purple-300">
                  A+
                </div>
                <div className="text-xs text-white/70">Avaliação</div>
              </div>
            </div>
          </div>

          {/* Phase Description */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border-2 border-white/20">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Conquista Desbloqueada
            </h3>
            <div className="text-white/80 text-center py-4">
              <p className="text-lg">Você completou a fase <span className="font-bold text-green-400">{currentPhase.name}</span>!</p>
              <p className="text-sm mt-2">Continue sua jornada como {phaseTitle} protegendo as tartarugas do Xingu.</p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 
              hover:to-emerald-700 text-white font-black text-xl py-5 rounded-xl 
              shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)]
              transition-all duration-300 hover:scale-105 group border-2 border-green-400/50"
          >
            <span className="flex items-center justify-center gap-3">
              {gameComplete ? 'Ver Resultados Finais' : 'Avançar para Próxima Fase'}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>

          {/* Motivational Message */}
          <div className="text-center">
            <p className="text-yellow-200/80 text-sm italic">
              "Cada ação de conservação conta para proteger as tartarugas do Xingu!"
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
