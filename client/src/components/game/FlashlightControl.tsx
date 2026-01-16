import { Flashlight, GripVertical } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';

interface FlashlightControlProps {
  isOn: boolean;
  onToggle: () => void;
}

export function FlashlightControl({ isOn, onToggle }: FlashlightControlProps) {
  const { position, isDragging, dragRef, handlers } = useDraggable({
    defaultPosition: { x: window.innerWidth - 100, y: 120 },
    storageKey: 'flashlightControlPosition',
  });

  return (
    <div
      ref={dragRef}
      className="fixed pointer-events-auto z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="relative group">
        {/* Drag handle */}
        <div 
          {...handlers}
          className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        >
          <GripVertical className={`w-4 h-4 ${isOn ? 'text-yellow-400' : 'text-gray-400'}`} />
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${
          isOn 
            ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30'
            : 'bg-gradient-to-br from-slate-500/20 to-gray-500/20'
        }`} />
        
        <button
          onClick={onToggle}
          className={`relative p-3.5 rounded-2xl shadow-2xl border transition-all hover:scale-110 ${
            isOn 
              ? 'bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400/20'
              : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600/20'
          }`}
          title={isOn ? 'Desligar lanterna (F)' : 'Ligar lanterna (F)'}
        >
          <Flashlight className={`w-6 h-6 transition-all ${
            isOn 
              ? 'text-white drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]'
              : 'text-slate-400'
          }`} />
          
          {isOn && (
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
