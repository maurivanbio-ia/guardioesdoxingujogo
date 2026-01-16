import { Map, GripVertical } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';

interface MapControlProps {
  onOpenMap: () => void;
}

export function MapControl({ onOpenMap }: MapControlProps) {
  const { position, isDragging, dragRef, handlers } = useDraggable({
    defaultPosition: { x: window.innerWidth - 100, y: 200 },
    storageKey: 'mapControlPosition',
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
          <GripVertical className="w-4 h-4 text-emerald-400" />
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <button
          onClick={onOpenMap}
          className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-3.5 rounded-2xl shadow-2xl border border-emerald-400/20 hover:scale-110 transition-all"
          title="Abrir mapa completo (M)"
        >
          <Map className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
