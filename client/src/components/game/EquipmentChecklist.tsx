import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { EQUIPMENT } from '@/lib/gameConstants';

interface EquipmentChecklistProps {
  onClose: () => void;
  onComplete: () => void;
}

export function EquipmentChecklist({ onClose, onComplete }: EquipmentChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const equipmentList = Object.values(EQUIPMENT);
  const allChecked = checkedItems.size === equipmentList.length;

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handleComplete = () => {
    if (allChecked) {
      onComplete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-green-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧰</span>
            <div>
              <h2 className="text-2xl font-bold text-white">Checklist de Equipamentos</h2>
              <p className="text-sm text-slate-400 mt-1">
                Verifique todos os equipamentos antes de ir ao campo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Equipment List */}
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {equipmentList.map((equipment) => {
            const isChecked = checkedItems.has(equipment.id);
            return (
              <div
                key={equipment.id}
                onClick={() => toggleItem(equipment.id)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    isChecked
                      ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20'
                      : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div
                    className={`
                      w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                      ${
                        isChecked
                          ? 'bg-green-500 border-green-500'
                          : 'border-slate-500'
                      }
                    `}
                  >
                    {isChecked && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Icon */}
                  <span className="text-3xl">{equipment.icon}</span>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {equipment.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {equipment.description}
                    </p>
                  </div>

                  {/* Status */}
                  {isChecked && (
                    <div className="px-3 py-1 bg-green-500/20 rounded-full">
                      <span className="text-xs font-semibold text-green-400">
                        OK
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-400">
              Progresso: {checkedItems.size} / {equipmentList.length}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: equipmentList.length }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    h-2 w-8 rounded-full transition-all
                    ${i < checkedItems.size ? 'bg-green-500' : 'bg-slate-600'}
                  `}
                />
              ))}
            </div>
          </div>

          {!allChecked && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-400">
                ⚠️ Revise seus equipamentos. Um GPS desligado pode custar dados de toda a campanha.
              </p>
            </div>
          )}

          <button
            onClick={handleComplete}
            disabled={!allChecked}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold transition-all
              ${
                allChecked
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {allChecked ? '✅ Equipamentos Prontos!' : '📋 Verifique Todos os Itens'}
          </button>
        </div>
      </div>
    </div>
  );
}
