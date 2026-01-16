import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Entity {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
  name?: string;
}

interface FullMapProps {
  isOpen: boolean;
  onClose: () => void;
  playerPosition: { x: number; y: number; z: number };
  entities: Entity[];
}

export function FullMap({ isOpen, onClose, playerPosition, entities }: FullMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Map settings (smaller size for corner display with more zoom)
    const mapSize = 280; // canvas size
    const worldSize = 80; // reduced from 200 for more zoom (world units visible)
    const scale = mapSize / worldSize;
    const centerX = mapSize / 2;
    const centerY = mapSize / 2;

    // Draw background with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, mapSize / 2);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, mapSize, mapSize);

    // Draw grid (subtle)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const pos = (i * mapSize) / 10;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, mapSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(mapSize, pos);
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, mapSize, mapSize);

    // Helper function to convert world coords to canvas coords
    const worldToCanvas = (x: number, z: number) => {
      return {
        x: centerX + x * scale,
        y: centerY + z * scale
      };
    };

    // Draw entities
    entities.forEach(entity => {
      if (entity.type === 'research_house') {
        const pos = worldToCanvas(entity.position.x, entity.position.z);
        
        // Draw research house icon
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(pos.x - 8, pos.y - 8, 16, 16);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x - 8, pos.y - 8, 16, 16);
        
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏠', pos.x, pos.y + 3);
      } else if (entity.type === 'npc') {
        const pos = worldToCanvas(entity.position.x, entity.position.z);
        
        // Draw NPC marker (researcher)
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label with name
        if (entity.name) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(entity.name, pos.x, pos.y - 10);
        }
      } else if (entity.type === 'community_member') {
        const pos = worldToCanvas(entity.position.x, entity.position.z);
        
        // Draw community member marker
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label with name
        if (entity.name) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(entity.name, pos.x, pos.y - 10);
        }
      } else if (entity.type === 'boat') {
        const pos = worldToCanvas(entity.position.x, entity.position.z);
        
        // Draw boat marker (canoe shape)
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#a0522d';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Boat label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⛵', pos.x, pos.y + 3);
      } else if (entity.type === 'nest') {
        const pos = worldToCanvas(entity.position.x, entity.position.z);
        
        // Draw nest marker (small dot)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw player (last, so it's on top)
    const playerPos = worldToCanvas(playerPosition.x, playerPosition.z);
    
    // Player outer glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Player marker
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Player label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Você', playerPos.x, playerPos.y - 12);

  }, [isOpen, playerPosition, entities]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-white/10 px-4 py-2 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            🗺️ Mapa do Campo
          </h3>
          <button
            onClick={onClose}
            className="bg-red-500/20 hover:bg-red-500/40 p-1 rounded-lg transition-all"
            title="Fechar (ESC)"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Map Canvas */}
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="block"
        />

        {/* Quick Legend */}
        <div className="bg-slate-950/60 border-t border-white/10 px-4 py-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-white/80">Você</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-sm" />
              <span className="text-white/80">🏠 Casa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-white/80">👥 Pesq.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-white/80">🎣 Ribei.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-700" />
              <span className="text-white/80">⛵ Canoa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-white/80">🥚 Ninhos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
