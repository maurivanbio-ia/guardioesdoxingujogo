import { useState } from 'react';
import { X, ThermometerSun } from 'lucide-react';
import { EDUCATIONAL_MESSAGES } from '@/lib/gameConstants';

interface TemperatureReaderProps {
  onClose: () => void;
  onReading: (temperature: number) => void;
}

export function TemperatureReader({ onClose, onReading }: TemperatureReaderProps) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);

  const takeReading = () => {
    setIsReading(true);
    
    // Simula leitura do termômetro (29-36°C)
    setTimeout(() => {
      const temp = 29 + Math.random() * 7; // 29-36°C
      const roundedTemp = Math.round(temp * 10) / 10;
      setTemperature(roundedTemp);
      setIsReading(false);
      onReading(roundedTemp);
    }, 1500);
  };

  const getTempStatus = (temp: number) => {
    if (temp < 30) return { label: 'Muito Baixa', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (temp < 31.5) return { label: 'Ideal', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (temp < 33) return { label: 'Normal', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (temp < 34.5) return { label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const status = temperature ? getTempStatus(temperature) : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-orange-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <ThermometerSun className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold text-white">Termômetro de Areia</h2>
              <p className="text-sm text-slate-400 mt-1">
                Medir temperatura da areia
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
            {temperature === null ? (
              <div className="space-y-2">
                <ThermometerSun className="w-16 h-16 text-slate-500 mx-auto" />
                <p className="text-slate-400">Aguardando medição...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl font-bold text-orange-400">
                  {temperature}°C
                </div>
                {status && (
                  <div className={`inline-block px-4 py-2 rounded-full ${status.bg}`}>
                    <span className={`text-sm font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Take Reading Button */}
          <button
            onClick={takeReading}
            disabled={isReading}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold transition-all
              ${
                isReading
                  ? 'bg-slate-700 text-slate-500 cursor-wait'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30'
              }
            `}
          >
            {isReading ? '🔍 Medindo...' : '🌡️ Fazer Leitura'}
          </button>

          {/* Educational Message */}
          {temperature && temperature > 33 && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xl">{EDUCATIONAL_MESSAGES.CLIMATE_CHANGE.icon}</span>
                <div>
                  <h4 className="font-semibold text-red-400">
                    {EDUCATIONAL_MESSAGES.SEX_DETERMINATION.theme}
                  </h4>
                  <p className="text-sm text-red-300 mt-1">
                    {EDUCATIONAL_MESSAGES.SEX_DETERMINATION.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {temperature && temperature < 33 && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">
                ✅ Temperatura ideal para uma proporção equilibrada de sexos nos filhotes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
