import { useEffect, useRef } from 'react';

interface MinimapEntity {
  id: string;
  type: 'player' | 'nest' | 'npc' | 'vulture' | 'boat';
  position: { x: number; z: number };
  color: string;
  label?: string;
}

interface MinimapaProps {
  playerPosition: { x: number; z: number };
  entities: MinimapEntity[];
  radius?: number; // Raio do minimapa em unidades do jogo
}

export function Minimapa({ playerPosition, entities, radius = 50 }: MinimapaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 180; // Tamanho do minimapa em pixels
  const scale = size / (radius * 2); // Escala de pixels por unidade

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa o canvas
    ctx.clearRect(0, 0, size, size);

    // Fundo com borda
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, size, size);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);

    // Grid de referência
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let i = gridSize; i < size; i += gridSize) {
      // Linhas verticais
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      
      // Linhas horizontais
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // Centro do minimapa
    const centerX = size / 2;
    const centerY = size / 2;

    // Desenha entidades
    entities.forEach(entity => {
      // Calcula posição relativa ao jogador
      const relX = entity.position.x - playerPosition.x;
      const relZ = entity.position.z - playerPosition.z;

      // Converte para coordenadas do minimapa
      const mapX = centerX + relX * scale;
      const mapY = centerY + relZ * scale;

      // Verifica se está dentro do raio visível
      const distance = Math.sqrt(relX * relX + relZ * relZ);
      if (distance > radius) return;

      // Desenha baseado no tipo
      ctx.fillStyle = entity.color;
      
      switch (entity.type) {
        case 'nest':
          // Ninho - Círculo com borda
          ctx.beginPath();
          ctx.arc(mapX, mapY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
          break;
          
        case 'npc':
          // NPC - Triângulo
          ctx.beginPath();
          ctx.moveTo(mapX, mapY - 5);
          ctx.lineTo(mapX - 4, mapY + 3);
          ctx.lineTo(mapX + 4, mapY + 3);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'vulture':
          // Urubu - X vermelho
          ctx.strokeStyle = entity.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(mapX - 3, mapY - 3);
          ctx.lineTo(mapX + 3, mapY + 3);
          ctx.moveTo(mapX + 3, mapY - 3);
          ctx.lineTo(mapX - 3, mapY + 3);
          ctx.stroke();
          break;
          
        case 'boat':
          // Barco - Retângulo
          ctx.fillRect(mapX - 4, mapY - 3, 8, 6);
          break;
          
        default:
          ctx.beginPath();
          ctx.arc(mapX, mapY, 3, 0, Math.PI * 2);
          ctx.fill();
      }

      // Label opcional
      if (entity.label && distance < radius / 2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(entity.label, mapX, mapY - 8);
      }
    });

    // Desenha o jogador por último (sempre no centro)
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Borda branca no jogador
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direção do jogador (seta)
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 8);
    ctx.lineTo(centerX - 3, centerY - 3);
    ctx.lineTo(centerX + 3, centerY - 3);
    ctx.closePath();
    ctx.fill();

  }, [playerPosition, entities, radius, scale, size]);

  return (
    <div className="absolute top-4 left-4 z-40">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-xl border-2 border-white/30 shadow-2xl backdrop-blur-sm"
      />
      
      {/* Legenda */}
      <div className="mt-2 bg-black/80 backdrop-blur-md rounded-lg p-2 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white/50" />
            <span className="text-white/90">Você</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white/50" />
            <span className="text-white/90">Ninhos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full border border-white/50" />
            <span className="text-white/90">NPCs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <span className="text-white/90">Urubus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
