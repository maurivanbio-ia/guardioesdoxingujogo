/**
 * Nest Action Balloon
 * Balão flutuante que aparece ao marcar um ninho com opções de medição
 */

import { useState } from 'react';
import { Thermometer, Ruler, MoveVertical, X } from 'lucide-react';

interface NestActionBalloonProps {
  onMeasureTemperature: () => void;
  onMeasureWidth: () => void;
  onMeasureDepth: () => void;
  onClose: () => void;
  nestNumber: number;
}

export function NestActionBalloon({
  onMeasureTemperature,
  onMeasureWidth,
  onMeasureDepth,
  onClose
}: NestActionBalloonProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleAction = (action: string, callback: () => void) => {
    setSelected(action);
    setTimeout(() => {
      callback();
      onClose();
      
      // Show educational card based on action
      if (action === 'temperature') {
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'temp-determination',
            title: '🌡️ Temperatura e Determinação Sexual',
            content: 'A temperatura do ninho determina o sexo dos filhotes em Podocnemis expansa! Temperaturas acima de ~32°C tendem a produzir fêmeas, enquanto abaixo de 28°C geram machos. Entre 28-32°C, há uma mistura de ambos.',
            icon: '🐢',
            autoCloseDelay: 8000,
          }
        }));
      } else if (action === 'depth') {
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'nest-depth',
            title: '📐 Profundidade do Ninho',
            content: 'A profundidade do ninho reduz a variação térmica e protege contra predadores como urubus, cães e lagartos. Ninhos mais profundos têm maior taxa de eclosão e melhor proteção dos embriões.',
            icon: '⬇️',
            autoCloseDelay: 8000,
          }
        }));
      } else if (action === 'width') {
        window.dispatchEvent(new CustomEvent('showEducationalCard', { 
          detail: {
            id: 'nest-width',
            title: '📏 Largura do Ninho',
            content: 'A largura do ninho reflete o porte da fêmea e se relaciona diretamente ao número de ovos depositados. Fêmeas maiores constroem ninhos mais largos para acomodar ninhadas de até 150 ovos!',
            icon: '↔️',
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
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 rounded-3xl blur-xl animate-pulse" />
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-amber-500/50 rounded-3xl shadow-2xl p-6 min-w-[380px]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block bg-amber-500/20 rounded-full p-3 mb-3">
              <span className="text-4xl">🥚</span>
            </div>
            <h3 className="text-2xl font-bold text-amber-400 mb-1">
              Ninho Marcado!
            </h3>
            <p className="text-gray-300 text-sm">
              O que você gostaria de medir?
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleAction('temperature', onMeasureTemperature)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selected === 'temperature'
                  ? 'bg-red-500/30 border-red-400 scale-95'
                  : 'bg-slate-800/50 border-slate-700 hover:border-red-400 hover:bg-red-500/10'
              }`}
            >
              <div className="bg-red-500/20 p-3 rounded-lg">
                <Thermometer className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Temperatura</p>
                <p className="text-sm text-gray-400">Medir temperatura da areia</p>
              </div>
            </button>

            <button
              onClick={() => handleAction('width', onMeasureWidth)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selected === 'width'
                  ? 'bg-blue-500/30 border-blue-400 scale-95'
                  : 'bg-slate-800/50 border-slate-700 hover:border-blue-400 hover:bg-blue-500/10'
              }`}
            >
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Ruler className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Largura</p>
                <p className="text-sm text-gray-400">Medir largura do ninho</p>
              </div>
            </button>

            <button
              onClick={() => handleAction('depth', onMeasureDepth)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selected === 'depth'
                  ? 'bg-purple-500/30 border-purple-400 scale-95'
                  : 'bg-slate-800/50 border-slate-700 hover:border-purple-400 hover:bg-purple-500/10'
              }`}
            >
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <MoveVertical className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">Profundidade</p>
                <p className="text-sm text-gray-400">Medir profundidade do ninho</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Escolha uma medição para continuar
            </p>
          </div>
        </div>

        {/* Pointer arrow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-900 border-r-4 border-b-4 border-amber-500/50 rotate-45" />
      </div>
    </div>
  );
}
