/**
 * Vulture Action Balloon
 * Balão flutuante que aparece ao interagir com urubus
 */

import { useState } from 'react';
import { Eye, Zap, X } from 'lucide-react';

interface VultureActionBalloonProps {
  onObserve: () => void;
  onScare: () => void;
  onClose: () => void;
}

export function VultureActionBalloon({
  onObserve,
  onScare,
  onClose
}: VultureActionBalloonProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleAction = (action: string, callback: () => void) => {
    setSelected(action);
    setTimeout(() => {
      callback();
      onClose();
      
      // Show educational card based on action
      if (action === 'observe') {
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'vulture-behavior',
            title: '🦅 Comportamento do Urubu',
            content: 'Urubus-de-cabeça-preta (Coragyps atratus) localizam ninhos pelo olfato e visão. Eles preferem atacar ninhos recém-cavados e trabalham em grupos de 2 a 5 indivíduos para maximizar o sucesso.',
            icon: '👁️',
            autoCloseDelay: 8000,
          }
        }));
      } else if (action === 'scare') {
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'predation-management',
            content: 'Urubus (Coragyps atratus) são necrófagos oportunistas que destroem ninhos recém-expostos. Espantá-los durante o manejo aumenta a taxa de eclosão de 30% para mais de 80%!',
            title: '🦅 Redução da Predação',
            icon: '🛡️',
            autoCloseDelay: 8000,
          }
        }));
      }
    }, 300);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto animate-in zoom-in-95 duration-300">
      {/* Floating Balloon */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-3xl blur-xl animate-pulse" />
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-red-500/50 rounded-3xl shadow-2xl p-6 min-w-[380px]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block bg-red-500/20 rounded-full p-3 mb-3">
              <span className="text-4xl">🦅</span>
            </div>
            <h3 className="text-2xl font-bold text-red-400 mb-1">
              Urubu Detectado!
            </h3>
            <p className="text-gray-300 text-sm">
              Como você deseja interagir?
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleAction('observe', onObserve)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selected === 'observe'
                  ? 'bg-blue-500/30 border-blue-400 scale-95'
                  : 'bg-slate-800/50 border-slate-700 hover:border-blue-400 hover:bg-blue-500/10'
              }`}
            >
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Observar</p>
                <p className="text-sm text-gray-400">Estudar comportamento sem espantar</p>
              </div>
            </button>

            <button
              onClick={() => handleAction('scare', onScare)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selected === 'scare'
                  ? 'bg-red-500/30 border-red-400 scale-95'
                  : 'bg-slate-800/50 border-slate-700 hover:border-red-400 hover:bg-red-500/10'
              }`}
            >
              <div className="bg-red-500/20 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Espantar</p>
                <p className="text-sm text-gray-400">Afastar para proteger ninhos (+5 XP)</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Escolha uma ação para continuar
            </p>
          </div>
        </div>

        {/* Pointer arrow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-900 border-r-4 border-b-4 border-red-500/50 rotate-45" />
      </div>
    </div>
  );
}
