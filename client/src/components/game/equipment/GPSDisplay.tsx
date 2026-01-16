import { X, Satellite, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GPSDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  playerPosition: { x: number; y: number; z: number };
}

export function GPSDisplay({ isOpen, onClose, playerPosition }: GPSDisplayProps) {
  const [satellites, setSatellites] = useState(8);
  
  // Convert game coordinates to fake GPS coordinates (Altamira region)
  const baseLat = -3.2;
  const baseLon = -52.2;
  const lat = baseLat + (playerPosition.z / 1000);
  const lon = baseLon + (playerPosition.x / 1000);
  
  // Simulate satellite signal quality
  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites(Math.floor(Math.random() * 3) + 7); // 7-9 satellites
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-600 rounded-3xl p-6 w-[420px] shadow-2xl">
        {/* GPS Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-600">
          <div className="flex items-center gap-2">
            <Navigation className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">GPS Garmin eTrex</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors bg-slate-700 hover:bg-slate-600 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* LCD Screen */}
        <div className="bg-[#9EBC9E] border-4 border-slate-700 rounded-xl p-4 font-mono">
          {/* Satellite Signal */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-slate-800" />
              <span className="text-sm text-slate-800 font-bold">SAT: {satellites}/12</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 ${i < Math.floor(satellites / 2) ? 'bg-slate-800' : 'bg-slate-400'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Coordinates */}
          <div className="space-y-2 mb-3">
            <div>
              <div className="text-xs text-slate-700 font-bold">LATITUDE</div>
              <div className="text-xl font-bold text-slate-900">{lat.toFixed(6)}°S</div>
            </div>
            <div>
              <div className="text-xs text-slate-700 font-bold">LONGITUDE</div>
              <div className="text-xl font-bold text-slate-900">{lon.toFixed(6)}°W</div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-700 pt-2">
            <div>
              <div className="text-slate-700 font-bold">ALTITUDE</div>
              <div className="text-slate-900 font-bold">{Math.abs(playerPosition.y * 10).toFixed(1)}m</div>
            </div>
            <div>
              <div className="text-slate-700 font-bold">PRECISÃO</div>
              <div className="text-slate-900 font-bold">±{Math.max(2, 10 - satellites).toFixed(1)}m</div>
            </div>
          </div>
        </div>
        
        {/* Info Footer */}
        <div className="mt-4 text-center text-xs text-slate-400">
          Rio Xingu, Altamira - PA
        </div>
      </div>
    </div>
  );
}
