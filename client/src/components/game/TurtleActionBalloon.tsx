import { useState } from 'react';
import { X, Ruler, Weight, Tag, ChevronRight } from 'lucide-react';

interface TurtleActionBalloonProps {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: (action: string) => void;
  turtleId: string;
}

const TURTLE_ACTIONS = [
  {
    id: 'measure',
    icon: Ruler,
    label: 'Medir',
    description: 'Medir comprimento e largura do casco',
    explanation: 'A biometria ajuda a monitorar o crescimento e saúde das tartarugas ao longo do tempo',
    xp: 10,
    color: 'cyan'
  },
  {
    id: 'weigh',
    icon: Weight,
    label: 'Pesar',
    description: 'Pesar a tartaruga',
    explanation: 'O peso é um indicador importante da saúde e condição nutricional do animal',
    xp: 10,
    color: 'purple'
  },
  {
    id: 'tag',
    icon: Tag,
    label: 'Marcar',
    description: 'Realizar marcação individual',
    explanation: 'A marcação permite identificar e acompanhar cada indivíduo ao longo dos anos, essencial para estudos populacionais',
    xp: 15,
    color: 'green'
  }
];

export function TurtleActionBalloon({ isOpen, onClose, onActionComplete, turtleId }: TurtleActionBalloonProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActionClick = (actionId: string) => {
    setSelectedAction(actionId);
  };

  const handleConfirm = () => {
    if (selectedAction) {
      onActionComplete(selectedAction);
      
      // Dispatch turtle measured event for 'measure' and 'weigh' actions
      if (selectedAction === 'measure' || selectedAction === 'weigh') {
        window.dispatchEvent(new Event('turtleMeasured'));
        
        // Show educational card about biometry importance
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'biometry-importance',
            title: '📏 Importância da Biometria',
            content: 'Medir comprimento, largura da carapaça e peso nos permite monitorar a saúde da população, identificar crescimento anual e detectar mudanças ambientais que afetam as tartarugas.',
            icon: '📐',
            autoCloseDelay: 10000,
          }
        }));
      }
      
      setSelectedAction(null);
      onClose();
    }
  };

  const getActionColor = (color: string) => {
    const colors = {
      cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-400/50', text: 'text-cyan-300', hover: 'hover:bg-cyan-500/30' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-400/50', text: 'text-purple-300', hover: 'hover:bg-purple-500/30' },
      green: { bg: 'bg-green-500/20', border: 'border-green-400/50', text: 'text-green-300', hover: 'hover:bg-green-500/30' }
    };
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border-2 border-blue-400/30 p-6 max-w-lg w-full mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-400/50">
              <span className="text-2xl">🐢</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Interação com Tartaruga</h3>
              <p className="text-blue-200/70 text-sm">Escolha uma ação científica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Actions Grid */}
        <div className="space-y-3 mb-6">
          {TURTLE_ACTIONS.map((action) => {
            const ActionIcon = action.icon;
            const colors = getActionColor(action.color);
            const isSelected = selectedAction === action.id;

            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${colors.bg} ${colors.border} ${colors.hover} ${
                  isSelected ? 'ring-2 ring-white/50 scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0`}>
                    <ActionIcon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold ${colors.text}`}>{action.label}</h4>
                      <span className="text-xs text-yellow-300 font-bold">+{action.xp} XP</span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{action.description}</p>
                    <p className="text-white/60 text-xs italic">
                      💡 {action.explanation}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedAction}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            selectedAction
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-500/50'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          Realizar Ação
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Info Footer */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <p className="text-blue-200 text-xs text-center">
            <span className="font-bold">Dica:</span> Todas as ações contribuem para a pesquisa científica e conservação das tartarugas
          </p>
        </div>
      </div>
    </div>
  );
}
