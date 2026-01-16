import { useEffect, useState, useCallback } from 'react';
import { Droplets, CloudRain, Sun, GripVertical, Volume2, Info } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';
import { HydrologicalPhaseInfo } from './HydrologicalPhaseInfo';

// Tipo das fases hidrológicas
type HydrologicalPhase = 'seca' | 'chuva';

interface HydrologicalCycleControlProps {
  currentPhase: HydrologicalPhase;
  onPhaseChange: (phase: HydrologicalPhase) => void;
}

// Função utilitária para tocar sons diferentes por estação
function playSound(file: string, volume = 0.3) {
  const audio = new Audio(file);
  audio.volume = volume;
  audio.play().catch(() => {});
}

// Componente principal
export function HydrologicalCycleControl({
  currentPhase,
  onPhaseChange,
}: HydrologicalCycleControlProps) {
  const { position, isDragging, dragRef, handlers } = useDraggable({
    defaultPosition: { x: 16, y: 96 },
    storageKey: 'hydrologicalCyclePosition',
  });

  const [showInfo, setShowInfo] = useState(false);
  const [selectedPhaseInfo, setSelectedPhaseInfo] =
    useState<HydrologicalPhase | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Lista de fases com ícones e descrições ecológicas aprimoradas
  const phases = [
    {
      id: 'seca',
      name: 'Seca',
      icon: Sun,
      color: 'text-yellow-400',
      gradient:
        'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 hover:bg-yellow-500/30',
      sound: '/sounds/birds.mp3',
      description:
        'Durante a seca, as praias emergem e as tartarugas iniciam a nidificação. O risco de predação aumenta e a conectividade hídrica diminui.',
    },
    {
      id: 'chuva',
      name: 'Chuva',
      icon: CloudRain,
      color: 'text-cyan-400',
      gradient:
        'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:bg-cyan-500/30',
      sound: '/sounds/rain.mp3',
      description:
        'Na cheia, os rios se expandem e as várzeas se inundam. Os ninhos podem ser perdidos, e os filhotes recém-eclodidos enfrentam correntezas fortes.',
    },
  ] as const;

  // Alternância manual entre as fases (abre modal ao clicar no ícone)
  const handlePhaseClick = useCallback(
    (phase: HydrologicalPhase) => {
      setSelectedPhaseInfo(phase);
      setShowInfo(true);
      onPhaseChange(phase);

      // Toca som correspondente, se não estiver mudo
      if (!isMuted) {
        const sound = phases.find((p) => p.id === phase)?.sound;
        if (sound) playSound(sound);
      }

      // Salva a fase atual no localStorage
      localStorage.setItem('currentPhase', phase);
    },
    [onPhaseChange, isMuted]
  );

  // Função separada para abrir modal de informação (via botão ℹ️)
  const handleInfoClick = useCallback((phase: HydrologicalPhase) => {
    setSelectedPhaseInfo(phase);
    setShowInfo(true);
  }, []);

  // Atalho de teclado: tecla C alterna entre seca e chuva
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        const nextPhase: HydrologicalPhase =
          currentPhase === 'seca' ? 'chuva' : 'seca';
        handlePhaseClick(nextPhase);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhase, handlePhaseClick]);

  // Carregar fase salva no localStorage ao iniciar
  useEffect(() => {
    const savedPhase = localStorage.getItem('currentPhase') as
      | HydrologicalPhase
      | null;
    if (savedPhase && savedPhase !== currentPhase) {
      onPhaseChange(savedPhase);
    }
  }, [onPhaseChange]);

  return (
    <div
      ref={dragRef}
      className="fixed pointer-events-auto z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
    >
      {/* Painel principal */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-2 shadow-2xl border border-white/10 backdrop-blur-xl group">
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />

        <div className="relative bg-slate-900/70 rounded-xl p-3">
          {/* Barra de título e arraste */}
          <div
            {...handlers}
            className="flex items-center gap-2 mb-3 cursor-grab active:cursor-grabbing select-none"
            aria-label="Painel do ciclo hidrológico"
          >
            <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Droplets className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              CICLO HIDROLÓGICO
            </span>
            <GripVertical className="w-3 h-3 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Botões de Fases */}
          <div className="flex gap-2">
            {phases.map((phase) => {
              const Icon = phase.icon;
              const isActive = currentPhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => handlePhaseClick(phase.id)}
                  aria-label={`Selecionar fase ${phase.name}`}
                  className={`
                    relative flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all
                    ${isActive
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 scale-105'
                      : phase.gradient
                    }
                  `}
                  title={phase.description}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-white' : phase.color} transition-transform group-hover:scale-110`}
                  />
                  <span
                    className={`text-[10px] font-bold tracking-wider ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {phase.name.toUpperCase()}
                  </span>
                  {isActive && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Rodapé e atalhos */}
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded text-cyan-400 font-mono">
                C
              </kbd>
              <span>para alternar</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Botão de Informação */}
              <button
                onClick={() => handleInfoClick(currentPhase)}
                title="Ver informações educacionais"
                aria-label="Ver informações sobre a fase atual"
                className="p-1 hover:bg-cyan-500/20 rounded transition-colors text-cyan-400"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {/* Botão de Mute */}
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                title={isMuted ? 'Som desativado' : 'Som ativado'}
                aria-label="Ativar ou desativar som"
                className={`p-1 hover:bg-cyan-500/20 rounded transition-colors ${
                  isMuted ? 'text-gray-600' : 'text-cyan-400'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Informações */}
      {showInfo && selectedPhaseInfo && (
        <HydrologicalPhaseInfo
          phase={selectedPhaseInfo}
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  );
}
