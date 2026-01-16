import { useState } from 'react';
import { X, Waves, AlertTriangle } from 'lucide-react';

interface WaterLevelMonitorProps {
  onClose: () => void;
  onReading: (level: number) => void;
}

export function WaterLevelMonitor({ onClose, onReading }: WaterLevelMonitorProps) {
  const [waterLevel, setWaterLevel] = useState<number | null>(null);
  const [previousLevel, setPreviousLevel] = useState<number>(150); // cm
  const [isReading, setIsReading] = useState(false);

  const takeReading = () => {
    setIsReading(true);
    
    // Simula leitura da régua limnimétrica (120-250 cm)
    setTimeout(() => {
      const level = 120 + Math.random() * 130; // 120-250 cm
      const roundedLevel = Math.round(level);
      setWaterLevel(roundedLevel);
      setIsReading(false);
      onReading(roundedLevel);
    }, 1000);
  };

  const getLevelStatus = (level: number) => {
    if (level < 140) return { label: 'Muito Baixo', color: 'text-red-400', bg: 'bg-red-500/20', alert: true };
    if (level < 170) return { label: 'Baixo', color: 'text-yellow-400', bg: 'bg-yellow-500/20', alert: false };
    if (level < 200) return { label: 'Normal', color: 'text-green-400', bg: 'bg-green-500/20', alert: false };
    if (level < 230) return { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-500/20', alert: true };
    return { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/20', alert: true };
  };

  const status = waterLevel ? getLevelStatus(waterLevel) : null;
  const change = waterLevel ? waterLevel - previousLevel : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-blue-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Waves className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-white">Régua Limnimétrica</h2>
              <p className="text-sm text-slate-400 mt-1">
                Monitorar nível da água
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Display */}
          <div className="bg-slate-800/50 rounded-lg p-8 text-center border-2 border-slate-700">
            {waterLevel === null ? (
              <div className="space-y-2">
                <Waves className="w-16 h-16 text-slate-500 mx-auto" />
                <p className="text-slate-400">Aguardando leitura...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl font-bold text-blue-400">
                  {waterLevel} cm
                </div>
                {status && (
                  <div className={`inline-block px-4 py-2 rounded-full ${status.bg}`}>
                    <span className={`text-sm font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                )}
                {change !== 0 && (
                  <div className="text-sm text-slate-400">
                    Variação: {change > 0 ? '+' : ''}{change} cm
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Visual Water Level Indicator */}
          {waterLevel !== null && (
            <div className="relative h-48 bg-slate-800/50 rounded-lg overflow-hidden border-2 border-slate-700">
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000"
                style={{ height: `${Math.min((waterLevel / 250) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-blue-300/20 animate-pulse" />
              </div>
              {/* Water level markers */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 px-2 pointer-events-none">
                {[250, 200, 150, 100, 50].map(mark => (
                  <div key={mark} className="flex items-center justify-between text-xs text-slate-400">
                    <span>{mark} cm</span>
                    <div className="flex-1 mx-2 border-t border-slate-600 border-dashed" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Take Reading Button */}
          <button
            onClick={takeReading}
            disabled={isReading}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold transition-all
              ${
                isReading
                  ? 'bg-slate-700 text-slate-500 cursor-wait'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30'
              }
            `}
          >
            {isReading ? '🔍 Lendo...' : '📊 Fazer Leitura'}
          </button>

          {/* Alert */}
          {status?.alert && waterLevel && waterLevel > 220 && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-400">
                    Alerta de Inundação
                  </h4>
                  <p className="text-sm text-red-300 mt-1">
                    O nível subiu muito! Precisamos remover ninhos próximos ao canal para evitar perdas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status && !status.alert && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">
                ✅ Nível da água dentro dos parâmetros normais.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
