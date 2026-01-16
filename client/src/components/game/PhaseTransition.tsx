import { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Star, ArrowRight } from 'lucide-react';

interface PhaseTransitionProps {
  onContinue: () => void;
  onClose?: () => void;
}

export function PhaseTransition({ onContinue, onClose }: PhaseTransitionProps) {
  const { getCurrentPhase, getNextPhase, canAdvancePhase, isGameComplete } = useGame();
  const phase = getCurrentPhase();
  const [show, setShow] = useState(false);
  
  // Get next phase info
  const nextPhase = getNextPhase();

  useEffect(() => {
    if (phase.completed) {
      setShow(true);
    }
  }, [phase.completed]);

  if (!show || !phase.completed) return null;

  const isComplete = isGameComplete();

  const handleContinue = () => {
    if (isComplete) {
      // Game is complete, close the overlay
      if (onClose) {
        onClose();
      } else {
        setShow(false);
      }
    } else if (canAdvancePhase()) {
      // Advance to next phase
      onContinue();
      setShow(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center pointer-events-auto">
      <div className="max-w-2xl w-full mx-4">
        {/* Victory/Phase Complete Card */}
        <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl p-8 border-4 border-purple-500/50 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 blur-3xl animate-pulse" />
              <Trophy className="w-24 h-24 text-amber-400 relative animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black text-center text-white mb-4">
            {isComplete ? '🎉 Parabéns!' : '✨ Fase Completa!'}
          </h1>

          {/* Phase Name */}
          <h2 className="text-3xl font-bold text-center text-purple-200 mb-6">
            {phase.name}
          </h2>

          {/* XP Progress Stats */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-black/40 rounded-lg p-6 border border-green-500/30 text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {phase.currentXP} / {phase.requiredXP} XP
              </div>
              <div className="text-sm text-gray-300">
                Experiência Acumulada
              </div>
            </div>
          </div>

          {/* Congratulations Message */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Star className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div>
                {isComplete ? (
                  <>
                    <p className="text-white text-lg font-bold mb-2">
                      Você Completou o Jogo!
                    </p>
                    <p className="text-green-200">
                      Você demonstrou habilidades excepcionais na conservação de tartarugas amazônicas! 
                      Graças ao seu trabalho, muitas tartarugas foram protegidas e dados científicos valiosos foram coletados.
                    </p>
                  </>
                ) : canAdvancePhase() ? (
                  <>
                    <p className="text-white text-lg font-bold mb-2">
                      🎉 Parabéns! Você Passou para a Próxima Fase!
                    </p>
                    <p className="text-green-200">
                      Você completou todos os objetivos desta fase com sucesso! 
                      Está pronto para enfrentar os próximos desafios!
                    </p>
                  </>
                ) : (
                  <p className="text-green-200">
                    Continue progredindo para desbloquear a próxima fase!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Next Phase Preview */}
          {!isComplete && canAdvancePhase() && nextPhase && (
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 rounded-xl p-6 mb-8">
              <h3 className="text-white text-xl font-bold mb-3">
                📋 Próxima Fase: {nextPhase.name}
              </h3>
              <p className="text-purple-200 mb-4">
                {nextPhase.description}
              </p>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-white font-semibold text-sm mb-2">Meta de XP:</p>
                <div className="text-2xl font-bold text-amber-400">
                  {nextPhase.requiredXP} XP
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-xl py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl hover:scale-105"
          >
            {isComplete ? (
              <>
                <Trophy className="w-6 h-6" />
                Concluir
              </>
            ) : (
              <>
                Próxima Fase
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Hint */}
          <p className="text-center text-purple-300 text-sm mt-4">
            Pressione ENTER ou clique no botão acima
          </p>
        </div>
      </div>
    </div>
  );
}
