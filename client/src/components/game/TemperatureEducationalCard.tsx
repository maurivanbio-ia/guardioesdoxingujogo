import { useState, useEffect } from 'react';
import { X, Thermometer } from 'lucide-react';

interface TemperatureEducationalCardProps {
  temperature: number;
  species: 'expansa' | 'unifilis' | 'sextuberculata';
  onClose: () => void;
}

export function TemperatureEducationalCard({ temperature, species, onClose }: TemperatureEducationalCardProps) {
  const [autoCloseTimer, setAutoCloseTimer] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoCloseTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onClose]);

  const getSpeciesData = () => {
    switch (species) {
      case 'expansa':
        return {
          name: 'Podocnemis expansa',
          commonName: 'Tartaruga-da-Amazônia',
          optimalRange: '32.5 - 34°C',
          tendency: temperature > 32 
            ? 'predominância de fêmeas' 
            : temperature < 30 
              ? 'predominância de machos'
              : 'equilíbrio de sexos'
        };
      case 'unifilis':
        return {
          name: 'Podocnemis unifilis',
          commonName: 'Tracajá',
          optimalRange: '31.5 - 33°C',
          tendency: temperature > 32 
            ? 'predominância de fêmeas' 
            : temperature < 30 
              ? 'predominância de machos'
              : 'equilíbrio de sexos'
        };
      case 'sextuberculata':
        return {
          name: 'Podocnemis sextuberculata',
          commonName: 'Iaçá/Pitiu',
          optimalRange: '29.5 - 31°C',
          tendency: temperature > 31 
            ? 'predominância de fêmeas' 
            : temperature < 29 
              ? 'predominância de machos'
              : 'equilíbrio de sexos'
        };
    }
  };

  const speciesData = getSpeciesData();
  
  const getTemperatureColor = () => {
    if (temperature > 32) return 'text-red-400';
    if (temperature > 30) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getTemperatureStatus = () => {
    if (temperature > 32) return { label: 'ALTA', color: 'bg-red-500/20 border-red-500/50 text-red-300' };
    if (temperature > 30) return { label: 'IDEAL', color: 'bg-green-500/20 border-green-500/50 text-green-300' };
    return { label: 'BAIXA', color: 'bg-blue-500/20 border-blue-500/50 text-blue-300' };
  };

  const status = getTemperatureStatus();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-orange-500/30 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thermometer className="w-7 h-7 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Medição de Temperatura</h2>
              <p className="text-sm text-orange-100">{speciesData.commonName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Temperature Display */}
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600/30">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Temperatura do Ninho</p>
              <div className={`text-6xl font-bold ${getTemperatureColor()} mb-2`}>
                {temperature.toFixed(1)}°C
              </div>
              <div className={`inline-block px-4 py-1 rounded-full border ${status.color} text-sm font-semibold`}>
                {status.label}
              </div>
            </div>
          </div>

          {/* Species Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-300 mb-2">Espécie Identificada:</p>
            <p className="text-white font-semibold italic">{speciesData.name}</p>
            <p className="text-sm text-gray-400 mt-1">
              Faixa ideal: <span className="text-green-400 font-medium">{speciesData.optimalRange}</span>
            </p>
          </div>

          {/* Educational Content */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">
              🧬 Determinação Sexual por Temperatura
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              A temperatura da areia define o sexo dos filhotes. Temperaturas acima de 32°C tendem a gerar 
              <span className="text-pink-400 font-semibold"> fêmeas</span>, enquanto abaixo de 30°C favorecem 
              <span className="text-blue-400 font-semibold"> machos</span>. Este ninho apresenta 
              <span className="text-yellow-400 font-semibold"> {speciesData.tendency}</span>.
            </p>
          </div>

          {/* Climate Impact Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-300 mb-2">
              ⚠️ Impacto das Mudanças Climáticas
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              O aquecimento global está elevando as temperaturas das praias de desova, resultando em 
              um desequilíbrio na proporção de sexos, com excesso de fêmeas nascendo. Isso ameaça a 
              viabilidade populacional a longo prazo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700/50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Fechando automaticamente em {autoCloseTimer}s
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Fechar (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}
