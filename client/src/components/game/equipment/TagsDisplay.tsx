import { X, Tag, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface TagsDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkNest?: (stakeColor: string) => void;
}

export function TagsDisplay({ isOpen, onClose, onMarkNest }: TagsDisplayProps) {
  const [selectedStake, setSelectedStake] = useState<string | null>(null);
  const [marked, setMarked] = useState(false);
  
  const stakes = [
    { id: 'red', name: 'Vermelha', color: '#EF4444', hex: 'FF0000' },
    { id: 'blue', name: 'Azul', color: '#3B82F6', hex: '0000FF' },
    { id: 'yellow', name: 'Amarela', color: '#EAB308', hex: 'FFFF00' },
    { id: 'green', name: 'Verde', color: '#22C55E', hex: '00FF00' },
    { id: 'orange', name: 'Laranja', color: '#F97316', hex: 'FF6600' },
    { id: 'purple', name: 'Roxa', color: '#A855F7', hex: '9900FF' },
  ];
  
  const handleMarkNest = () => {
    if (selectedStake) {
      setMarked(true);
      onMarkNest?.(selectedStake);
      setTimeout(() => {
        setMarked(false);
        onClose();
      }, 1500);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-800 rounded-2xl p-6 w-[520px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-amber-800">
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-900" />
            <h2 className="text-xl font-bold text-amber-900">Kit de Marcação</h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {!marked ? (
          <>
            {/* Instructions */}
            <div className="bg-amber-100 border-2 border-amber-700 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-amber-900 mb-2">📋 Instruções:</h3>
              <ol className="text-sm text-amber-900 space-y-1 list-decimal list-inside">
                <li>Selecione uma cor de estaca para marcar o ninho</li>
                <li>Cada cor representa um tipo de desova ou período</li>
                <li>Clique em "Marcar Ninho" para inserir a estaca</li>
              </ol>
            </div>
            
            {/* Stake Selection */}
            <div className="mb-4">
              <h3 className="font-bold text-amber-900 mb-3">Selecione a Estaca:</h3>
              <div className="grid grid-cols-3 gap-3">
                {stakes.map((stake) => (
                  <button
                    key={stake.id}
                    onClick={() => setSelectedStake(stake.id)}
                    className={`relative bg-white border-4 rounded-xl p-4 transition-all ${
                      selectedStake === stake.id
                        ? 'border-amber-600 shadow-lg scale-105'
                        : 'border-amber-300 hover:border-amber-500'
                    }`}
                  >
                    {/* Stake visual */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <div
                          className="w-12 h-32 rounded-full shadow-lg"
                          style={{ background: `linear-gradient(to bottom, ${stake.color}, ${stake.color}dd)` }}
                        />
                        {/* Ribbon */}
                        <div
                          className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-16 opacity-80 shadow-md"
                          style={{ backgroundColor: stake.color }}
                        />
                      </div>
                      <span className="text-xs font-bold text-amber-900">{stake.name}</span>
                      <span className="text-xs text-amber-700">#{stake.hex}</span>
                    </div>
                    
                    {selectedStake === stake.id && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleMarkNest}
                disabled={!selectedStake}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Tag className="w-5 h-5" />
                Marcar Ninho
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Ninho Marcado!</h3>
            <p className="text-amber-900">
              Estaca {stakes.find(s => s.id === selectedStake)?.name.toLowerCase()} inserida com sucesso
            </p>
          </div>
        )}
        
        <div className="mt-4 text-center text-xs text-amber-700">
          Sistema de marcação para monitoramento de ninhos
        </div>
      </div>
    </div>
  );
}
