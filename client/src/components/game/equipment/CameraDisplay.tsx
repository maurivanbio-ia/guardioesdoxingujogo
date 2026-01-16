import { X, Camera, Focus, Zap, ZapOff } from 'lucide-react';
import { useState } from 'react';

interface CameraDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraDisplay({ isOpen, onClose }: CameraDisplayProps) {
  const [flash, setFlash] = useState(true);
  const [photoTaken, setPhotoTaken] = useState(false);
  
  const takePhoto = () => {
    setPhotoTaken(true);
    setTimeout(() => setPhotoTaken(false), 1000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-900 to-black border-4 border-slate-700 rounded-2xl p-6 w-[480px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-700">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Câmera Canon EOS</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Viewfinder */}
        <div className="relative bg-black border-4 border-slate-700 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
          {/* Flash effect */}
          {photoTaken && (
            <div className="absolute inset-0 bg-white animate-pulse z-50" />
          )}
          
          {/* Camera grid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
          
          {/* Focus points */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse">
              <Focus className="w-6 h-6 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          {/* Camera info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-sm font-mono">
            <div className="flex justify-between">
              <span>ISO 400</span>
              <span>1/250s</span>
              <span>f/5.6</span>
            </div>
          </div>
          
          {/* Top info */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 text-white text-sm font-mono flex justify-between">
            <span>AUTO</span>
            <span>🔋 85%</span>
          </div>
        </div>
        
        {/* Camera Controls */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => setFlash(!flash)}
            className={`${flash ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            {flash ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
            Flash
          </button>
          <button
            onClick={takePhoto}
            className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Fotografar
          </button>
        </div>
        
        {/* Photo Counter */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
          <div className="text-slate-400 text-sm">Fotos restantes</div>
          <div className="text-white text-2xl font-bold">247 / 500</div>
        </div>
        
        <div className="mt-3 text-center text-xs text-slate-400">
          Registro fotográfico de campo
        </div>
      </div>
    </div>
  );
}
