import { X, Scale } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScaleDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScaleDisplay({ isOpen, onClose }: ScaleDisplayProps) {
  const [weight, setWeight] = useState(0);
  const [measuring, setMeasuring] = useState(false);
  
  const startWeighing = () => {
    setMeasuring(true);
    let currentWeight = 0;
    const targetWeight = 15 + Math.random() * 25; // 15-40 kg
    
    const interval = setInterval(() => {
      currentWeight += 0.5;
      setWeight(currentWeight);
      
      if (currentWeight >= targetWeight) {
        setWeight(targetWeight);
        clearInterval(interval);
        setMeasuring(false);
      }
    }, 50);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-slate-600 rounded-2xl p-6 w-[420px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-600">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Pesola (Balança)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scale Body */}
        <div className="relative">
          {/* Hook */}
          <div className="flex justify-center mb-2">
            <div className="w-3 h-12 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full" />
          </div>
          
          {/* Main Display Unit */}
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 border-4 border-slate-500 rounded-2xl p-6 shadow-inner">
            {/* Digital Screen */}
            <div className="bg-[#2d5016] border-4 border-slate-800 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-6xl font-bold font-mono text-[#7fff00] tracking-wider">
                  {weight.toFixed(2)}
                </div>
                <div className="text-2xl font-bold text-[#7fff00] mt-1">kg</div>
              </div>
            </div>
            
            {/* Status Lights */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${measuring ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`} />
                <span className="text-xs text-white">Medindo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${!measuring && weight > 0 ? 'bg-green-400' : 'bg-gray-600'}`} />
                <span className="text-xs text-white">Estável</span>
              </div>
            </div>
            
            {/* Scale info */}
            <div className="text-center text-xs text-slate-300 mb-3 border-t border-slate-600 pt-3">
              <div>Capacidade: 0 - 50 kg</div>
              <div>Precisão: ±0.05 kg</div>
            </div>
          </div>
          
          {/* Strap at bottom */}
          <div className="flex justify-center mt-2">
            <div className="w-16 h-8 bg-slate-600 border-2 border-slate-500 rounded" />
          </div>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={startWeighing}
            disabled={measuring}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {measuring ? 'Pesando...' : 'Pesar'}
          </button>
          <button
            onClick={() => setWeight(0)}
            className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Tarar
          </button>
        </div>
        
        <div className="mt-3 text-center text-xs text-slate-400">
          Use para pesar tartarugas adultas
        </div>
      </div>
    </div>
  );
}
