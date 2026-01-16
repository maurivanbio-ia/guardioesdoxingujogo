import { useState, useEffect } from 'react';
import { ToolType } from '@/lib/collectibleTools';
import { X } from 'lucide-react';

interface NestToolSelectionMenuProps {
  collectedTools: ToolType[];
  onSelectTool: (tool: ToolType) => void;
  onClose: () => void;
  nestNumber: number;
}

export function NestToolSelectionMenu({ collectedTools, onSelectTool, onClose, nestNumber }: NestToolSelectionMenuProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  const toolData: Record<ToolType, { 
    name: string; 
    icon: string; 
    description: string;
    action: string;
  }> = {
    thermometer: { 
      name: 'Termômetro Digital', 
      icon: '🌡️', 
      description: 'Mede a temperatura do ninho',
      action: 'Medir temperatura'
    },
    ruler: { 
      name: 'Régua de Medição', 
      icon: '📏', 
      description: 'Mede o diâmetro do ninho',
      action: 'Medir diâmetro'
    },
    scale: { 
      name: 'Balança Portátil', 
      icon: '⚖️', 
      description: 'Pesa ovos e filhotes',
      action: 'Pesar ovos'
    },
    notebook: { 
      name: 'Caderneta de Campo', 
      icon: '📓', 
      description: 'Registra observações',
      action: 'Anotar observação'
    },
    gps: { 
      name: 'GPS de Mão', 
      icon: '📍', 
      description: 'Registra coordenadas do ninho',
      action: 'Marcar coordenadas'
    },
  };

  const handleToolSelection = (tool: ToolType) => {
    onSelectTool(tool);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-green-500/30 max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Escolher Ferramenta</h2>
            <p className="text-sm text-green-100">Ninho #{nestNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 text-sm mb-4">
            Selecione uma ferramenta para interagir com este ninho:
          </p>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 gap-3">
            {(Object.keys(toolData) as ToolType[]).map((tool) => {
              const isCollected = collectedTools.includes(tool);
              const data = toolData[tool];
              
              return (
                <button
                  key={tool}
                  onClick={() => handleToolSelection(tool)}
                  disabled={!isCollected}
                  className={`
                    group relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all
                    ${isCollected 
                      ? 'bg-gray-700/50 hover:bg-gray-600/60 border-green-500/30 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer'
                      : 'bg-gray-900/30 border-gray-700/30 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    text-4xl flex-shrink-0 transition-transform
                    ${isCollected ? 'group-hover:scale-110' : ''}
                  `}>
                    {data.icon}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold mb-1 ${
                      isCollected ? 'text-white' : 'text-gray-600'
                    }`}>
                      {data.name}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      isCollected ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {data.description}
                    </p>
                    <div className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                      ${isCollected 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gray-800/50 text-gray-700 border border-gray-800'
                      }
                    `}>
                      {isCollected ? data.action : 'Não coletado'}
                    </div>
                  </div>

                  {/* Arrow indicator for collected tools */}
                  {isCollected && (
                    <div className="flex-shrink-0 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Help text */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 Colete mais ferramentas espalhadas pela praia para desbloquear novas ações!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700/50">
          <p className="text-xs text-gray-400 text-center">
            Pressione ESC ou clique fora para fechar
          </p>
        </div>
      </div>
    </div>
  );
}
