import { useState } from 'react';
import { Map, Trophy, Package, Keyboard, User } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export function PremiumHUD() {
  const { gameState, getCurrentPhase, getICX } = useGame();
  const [showControls, setShowControls] = useState(false);

  const currentPhase = getCurrentPhase();
  const icx = getICX();

  const icons = [
    {
      Icon: Map,
      label: 'Fase',
      color: 'from-blue-500 to-cyan-600',
      value: `${currentPhase.id}/5`,
      tooltip: currentPhase.name
    },
    {
      Icon: Trophy,
      label: 'Reputação',
      color: 'from-purple-500 to-indigo-600',
      value: `${gameState.reputation}%`,
      tooltip: 'Reputação científica'
    },
    {
      Icon: Package,
      label: 'Equipamentos',
      color: 'from-gray-600 to-slate-700',
      value: gameState.inventory.length,
      tooltip: 'Equipamentos no inventário'
    },
    {
      Icon: Keyboard,
      label: 'Controles',
      color: 'from-slate-600 to-gray-700',
      value: '?',
      tooltip: 'Mostrar controles',
      onClick: () => setShowControls(!showControls)
    },
    {
      Icon: User,
      label: 'Perfil',
      color: 'from-blue-600 to-indigo-700',
      value: '👤',
      tooltip: 'Perfil do pesquisador'
    }
  ];

  return (
    <>
      {/* Top Icon Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="flex gap-3 bg-black/30 backdrop-blur-xl rounded-full p-3 border border-white/10">
          {icons.map((item, idx) => {
            const { Icon, color, value, tooltip, onClick } = item;
            return (
              <div
                key={idx}
                onClick={onClick}
                className={`group relative ${onClick ? 'cursor-pointer' : ''}`}
              >
                {/* Icon Circle */}
                <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${color} p-[2px] hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-slate-900/90 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Value Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-white text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-slate-900">
                    {value}
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {tooltip}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 pointer-events-auto" onClick={() => setShowControls(false)}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-2xl border-2 border-amber-500/50" onClick={e => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
              <Keyboard className="w-8 h-8" />
              Controles do Jogo
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Movement */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-3">🚶 Movimento</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Mover para frente</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">W</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Mover para trás</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Mover para esquerda</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Mover para direita</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">D</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Correr</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">Shift</kbd>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-3">⚡ Ações</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Interagir</span>
                    <kbd className="bg-amber-600 px-3 py-1 rounded">E</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipamentos</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Espantar urubus</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">Espaço</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Pausar</span>
                    <kbd className="bg-slate-700 px-3 py-1 rounded">ESC</kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-amber-200 text-sm">
                💡 <strong>Dica:</strong> Aproxime-se de ninhos e pressione <kbd className="bg-amber-600/50 px-2 py-0.5 rounded mx-1">E</kbd> para marcá-los com dados científicos!
              </p>
            </div>

            <button
              onClick={() => setShowControls(false)}
              className="mt-6 w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
