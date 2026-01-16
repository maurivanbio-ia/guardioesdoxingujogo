import { Trophy, Star, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhaseIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  phaseName: string;
  phaseDescription: string;
  requiredXP: number;
  npcCharacter: string;
  npcMessage: string;
}

export function PhaseIntroModal({
  isOpen,
  onClose,
  phaseName,
  phaseDescription,
  requiredXP,
  npcCharacter,
  npcMessage,
}: PhaseIntroModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 rounded-2xl shadow-2xl border-2 border-cyan-400/50 p-8 max-w-2xl w-full mx-4 relative">
        {/* Decorative stars */}
        <div className="absolute top-0 left-0 right-0 flex justify-center -mt-8">
          <div className="flex gap-2">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Trophy className="w-12 h-12 text-amber-400 fill-amber-400 animate-bounce" />
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <h2 className="text-4xl font-bold text-cyan-300 mb-2">
            🎯 {phaseName}
          </h2>
          <p className="text-cyan-100 text-lg">
            {phaseDescription}
          </p>
        </div>

        {/* XP Requirement - Big and clear */}
        <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border-2 border-purple-400/50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-purple-300 font-semibold uppercase tracking-wide mb-2">
              Meta da Fase
            </div>
            <div className="flex items-center justify-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div className="text-5xl font-bold text-purple-200">
                {requiredXP} XP
              </div>
            </div>
            <p className="text-purple-300 text-sm mt-3">
              Realize atividades de conservação para acumular experiência
            </p>
          </div>
        </div>

        {/* NPC Dialogue */}
        <div className="bg-slate-800/50 border border-cyan-400/30 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">👨‍🔬</div>
            <div className="flex-1">
              <div className="text-cyan-300 font-bold text-lg mb-2">
                {npcCharacter}
              </div>
              <p className="text-gray-200 leading-relaxed">
                {npcMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Quick XP Guide */}
        <div className="bg-black/30 rounded-xl p-4 mb-6">
          <h3 className="text-white font-bold text-sm mb-3 text-center">
            💰 Como Ganhar XP
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-2">
              <div className="text-xl font-bold text-green-400">+15 XP</div>
              <div className="text-xs text-green-200">Marcar Ninho</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-2">
              <div className="text-xl font-bold text-blue-400">+10 XP</div>
              <div className="text-xs text-blue-200">Medir Tartaruga</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-2">
              <div className="text-xl font-bold text-amber-400">+5 XP</div>
              <div className="text-xs text-amber-200">Espantar Urubu</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Começar Missão! 🚀
          </Button>
        </div>

        {/* Footer hint */}
        <div className="mt-4 text-center text-cyan-300/60 text-xs">
          Você pode ver seu progresso a qualquer momento clicando no botão "Meta da Fase"
        </div>
      </div>
    </div>
  );
}
