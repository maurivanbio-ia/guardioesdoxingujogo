import { X, Ruler } from 'lucide-react';
import { useState } from 'react';

interface RulerDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulerDisplay({ isOpen, onClose }: RulerDisplayProps) {
  const [measurement, setMeasurement] = useState(0);
  const [measuring, setMeasuring] = useState(false);
  
  const startMeasurement = () => {
    setMeasuring(true);
    let value = 0;
    const interval = setInterval(() => {
      value += 0.5;
      setMeasurement(value);
      if (value >= 45) {
        clearInterval(interval);
        setMeasuring(false);
      }
    }, 50);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-4 border-yellow-800 rounded-lg p-6 w-[500px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-yellow-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-6 h-6 text-yellow-900" />
            <h2 className="text-xl font-bold text-yellow-900">Régua de Medição</h2>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-700 hover:text-yellow-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Ruler Visual */}
        <div className="bg-yellow-200 border-4 border-yellow-800 rounded-lg p-4 mb-4">
          <div className="relative h-32 bg-white rounded border-2 border-yellow-900">
            {/* Ruler markings */}
            <div className="absolute bottom-0 left-0 right-0 h-full flex">
              {Array.from({ length: 51 }).map((_, i) => (
                <div key={i} className="flex-1 border-l border-yellow-800 relative">
                  {i % 10 === 0 && (
                    <>
                      <div className="absolute top-0 w-full h-12 bg-yellow-900" />
                      <div className="absolute top-14 left-0 text-xs font-bold text-yellow-900 -translate-x-1/2">
                        {i}
                      </div>
                    </>
                  )}
                  {i % 5 === 0 && i % 10 !== 0 && (
                    <div className="absolute top-0 w-full h-8 bg-yellow-800" />
                  )}
                  {i % 5 !== 0 && (
                    <div className="absolute top-0 w-full h-4 bg-yellow-700" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Measurement indicator */}
            {measurement > 0 && (
              <div
                className="absolute top-0 bottom-0 left-0 bg-green-400/30 border-r-4 border-green-600 transition-all duration-100"
                style={{ width: `${(measurement / 50) * 100}%` }}
              >
                <div className="absolute -top-8 right-0 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {measurement.toFixed(1)} cm
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-2 text-center text-sm text-yellow-900 font-bold">
            0 ────────────────── 50 cm
          </div>
        </div>
        
        {/* Digital Display */}
        <div className="bg-gray-900 border-2 border-yellow-800 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold font-mono text-green-400">
              {measurement.toFixed(1)} cm
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startMeasurement}
            disabled={measuring}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {measuring ? 'Medindo...' : 'Iniciar Medição'}
          </button>
          <button
            onClick={() => setMeasurement(0)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Resetar
          </button>
        </div>
        
        <div className="mt-3 text-center text-xs text-yellow-700">
          Use para medir carapaça de tartarugas
        </div>
      </div>
    </div>
  );
}
