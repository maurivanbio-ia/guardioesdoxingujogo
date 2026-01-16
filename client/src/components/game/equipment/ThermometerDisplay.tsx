import { X, Thermometer } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ThermometerDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThermometerDisplay({ isOpen, onClose }: ThermometerDisplayProps) {
  const [temperature, setTemperature] = useState(32.4);
  const [reading, setReading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Simulate temperature reading
      setReading(true);
      const interval = setInterval(() => {
        setTemperature(30 + Math.random() * 5); // 30-35°C range
      }, 1500);
      
      setTimeout(() => setReading(false), 3000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Temperature color gradient
  const tempPercent = ((temperature - 25) / 15) * 100; // 25-40°C range
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-600 rounded-3xl p-6 w-[380px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-600">
          <div className="flex items-center gap-2">
            <Thermometer className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Termômetro Digital</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Digital Display */}
        <div className="bg-[#1a1a1a] border-4 border-gray-700 rounded-2xl p-6 mb-4">
          <div className="text-center">
            <div className="text-6xl font-bold font-mono text-red-400 tracking-wider mb-2">
              {temperature.toFixed(1)}
            </div>
            <div className="text-3xl font-bold text-red-400">°C</div>
            
            {reading && (
              <div className="mt-4 text-yellow-400 text-sm animate-pulse">
                Lendo temperatura...
              </div>
            )}
          </div>
          
          {/* Temperature Bar */}
          <div className="mt-6 bg-gray-800 rounded-full h-4 overflow-hidden border-2 border-gray-600">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, tempPercent))}%` }}
            />
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Profundidade</div>
            <div className="text-white font-bold">15 cm</div>
          </div>
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Status</div>
            <div className="text-green-400 font-bold">Ideal</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          Temperatura do substrato de nidificação
        </div>
      </div>
    </div>
  );
}
