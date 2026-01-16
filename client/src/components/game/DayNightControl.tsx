import { Sun, Moon, GripVertical } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';

interface DayNightControlProps {
  isNight: boolean;
  currentHour: number;
  onToggle: () => void;
}

export function DayNightControl({ isNight, currentHour, onToggle }: DayNightControlProps) {
  const { position, isDragging, dragRef, handlers } = useDraggable({
    defaultPosition: { x: 16, y: 16 },
    storageKey: 'dayNightControlPosition',
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
          <GripVertical className={`w-4 h-4 ${isNight ? 'text-indigo-400' : 'text-yellow-400'}`} />
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${
          isNight
            ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30'
            : 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30'
        }`} />
        
        <button
          onClick={onToggle}
          className={`relative p-3.5 rounded-2xl shadow-2xl border transition-all hover:scale-110 ${
            isNight
              ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-400/20'
              : 'bg-gradient-to-br from-yellow-500 to-orange-600 border-yellow-400/20'
          }`}
          title={isNight ? 'Alternar para Dia (T)' : 'Alternar para Noite (T)'}
        >
          {isNight ? (
            <Moon className="w-6 h-6 text-white" />
          ) : (
            <Sun className="w-6 h-6 text-white" />
          )}
          
          {/* Time indicator */}
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-white/20 rounded-full px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-white">{currentHour}h</span>
          </div>
        </button>
      </div>
    </div>
  );
}
