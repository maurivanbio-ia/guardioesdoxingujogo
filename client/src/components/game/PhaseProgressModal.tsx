import { X, Trophy, Target, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

interface PhaseProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PhaseProgressModal({ isOpen, onClose }: PhaseProgressModalProps) {
  const { getCurrentPhase, getPhaseProgress, isGameComplete } = useGame();
  
  if (!isOpen) return null;

  const currentPhase = getCurrentPhase();
  const phaseProgress = getPhaseProgress();
  const gameComplete = isGameComplete();
  
  // Map phase numbers to display names
  const phaseNames: { [key: number]: string } = {
    1: 'Chegada ao Acampamento',
    2: 'Patrulha da Praia',
    3: 'Eclosão Noturna',
    4: 'Coleta de Dados',
    5: 'Fim da Temporada'
  };
  
  const allPhases = [
    { id: 1, name: phaseNames[1] || 'Fase 1', phase: currentPhase.id === 1 },
    { id: 2, name: phaseNames[2] || 'Fase 2', phase: currentPhase.id === 2 },
    { id: 3, name: phaseNames[3] || 'Fase 3', phase: currentPhase.id === 3 },
    { id: 4, name: phaseNames[4] || 'Fase 4', phase: currentPhase.id === 4 },
    { id: 5, name: phaseNames[5] || 'Fase 5', phase: currentPhase.id === 5 }
  ];
  
  const currentPhaseIndex = currentPhase.id - 1; // Convert to 0-based index
  const completedPhases = currentPhaseIndex >= 0 ? currentPhaseIndex : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border-2 border-white/20 p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Progresso da Missão</h2>
              <p className="text-white/60 text-sm">Acompanhe suas conquistas e objetivos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Current Phase Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">{currentPhase.name}</h3>
              </div>
              <p className="text-purple-200 text-sm">{currentPhase.description}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-300">
                {currentPhase.currentXP}/{currentPhase.requiredXP}
              </div>
              <p className="text-white/60 text-xs">XP</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-black/30 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${phaseProgress}%` }}
            >
              <span className="text-xs text-white font-bold">{Math.round(phaseProgress)}%</span>
            </div>
          </div>
          
          {/* XP Breakdown */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-lg font-bold text-green-400">+15 XP</div>
              <div className="text-xs text-white/60">Marcar Ninho</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-400">+10 XP</div>
              <div className="text-xs text-white/60">Medir Tartaruga</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-lg font-bold text-amber-400">+5 XP</div>
              <div className="text-xs text-white/60">Espantar Urubu</div>
            </div>
          </div>
        </div>

        {/* All Phases Overview */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Todas as Fases
          </h4>
          
          <div className="grid grid-cols-5 gap-3">
            {allPhases.map((phase, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;
              const isLocked = index > currentPhaseIndex;
              
              return (
                <div
                  key={phase.id}
                  className={`text-center p-3 rounded-lg border transition-all ${
                    isCompleted
                      ? 'bg-green-500/20 border-green-400/50'
                      : isCurrent
                      ? 'bg-blue-500/20 border-blue-400/50 ring-2 ring-blue-400/30'
                      : 'bg-black/20 border-white/10 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {isCompleted ? '✓' : isCurrent ? '⚡' : '🔒'}
                  </div>
                  <div className={`text-xs font-bold ${
                    isCompleted
                      ? 'text-green-300'
                      : isCurrent
                      ? 'text-blue-300'
                      : 'text-white/40'
                  }`}>
                    Fase {phase.id}
                  </div>
                  <div className={`text-[10px] mt-1 ${
                    isLocked ? 'text-white/30' : 'text-white/60'
                  }`}>
                    {phase.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t border-white/10 pt-4 mt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{completedPhases}</div>
              <div className="text-xs text-white/60">Fases Completas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(phaseProgress)}%
              </div>
              <div className="text-xs text-white/60">Progresso Atual</div>
            </div>
          </div>
        </div>

        {/* Close hint */}
        <div className="mt-4 text-center text-white/40 text-xs">
          Pressione <kbd className="bg-white/10 px-2 py-1 rounded">ESC</kbd> para fechar
        </div>
      </div>
    </div>
  );
}
