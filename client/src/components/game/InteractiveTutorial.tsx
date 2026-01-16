import { useState, useEffect } from 'react';
import { Keyboard, MousePointer, Move, Map, Sun, Flashlight, Package, Zap } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  keys: string[];
  icon: React.ReactNode;
  position: 'top' | 'center' | 'bottom';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'movement',
    title: 'Movimento',
    description: 'Use as teclas W A S D para se mover pelo acampamento',
    keys: ['w', 'a', 's', 'd'],
    icon: <Move className="w-12 h-12" />,
    position: 'center'
  },
  {
    id: 'run',
    title: 'Correr',
    description: 'Segure SHIFT enquanto se move para correr mais rápido',
    keys: ['shift'],
    icon: <Keyboard className="w-12 h-12" />,
    position: 'center'
  },
  {
    id: 'interact',
    title: 'Interagir',
    description: 'Pressione E próximo a ninhos, tartarugas, urubus e pesquisadores para interagir',
    keys: ['e'],
    icon: <MousePointer className="w-12 h-12" />,
    position: 'center'
  },
  {
    id: 'equipment',
    title: 'Painel de Equipamentos',
    description: 'Pressione Tab para ver o painel de equipamentos científicos',
    keys: ['tab'],
    icon: <Package className="w-12 h-12" />,
    position: 'center'
  },
  {
    id: 'map',
    title: 'Mapa',
    description: 'Pressione M para abrir o mapa completo do campo',
    keys: ['m'],
    icon: <Map className="w-12 h-12" />,
    position: 'center'
  }
];

interface InteractiveTutorialProps {
  onComplete: () => void;
}

export function InteractiveTutorial({ onComplete }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  // Auto-complete tutorial immediately - skip all steps
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const currentTutorialStep = TUTORIAL_STEPS[currentStep];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.add(key);
        return newSet;
      });

      // Verifica se alguma tecla do passo atual foi pressionada
      if (currentTutorialStep.keys.includes(key)) {
        setTimeout(() => {
          if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            setProgress(((currentStep + 1) / TUTORIAL_STEPS.length) * 100);
          } else {
            setProgress(100);
            setTimeout(onComplete, 1000);
          }
        }, 500);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentStep, currentTutorialStep, onComplete]);

  const positionClasses = {
    top: 'top-24',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-24'
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-none">
      {/* Tutorial Card */}
      <div className={`absolute left-1/2 -translate-x-1/2 ${positionClasses[currentTutorialStep.position]} pointer-events-auto`}>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-amber-500/50 shadow-2xl min-w-[400px]">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full p-4 text-white">
              {currentTutorialStep.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-amber-400">
                {currentTutorialStep.title}
              </h3>
              <p className="text-white/70 text-sm">
                Passo {currentStep + 1} de {TUTORIAL_STEPS.length}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white text-lg mb-6">
            {currentTutorialStep.description}
          </p>

          {/* Key Display */}
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            {currentTutorialStep.keys.map((key) => {
              const isPressed = keysPressed.has(key);
              const displayKey = key === ' ' ? 'ESPAÇO' : key.toUpperCase();
              return (
                <div key={key} className={`text-4xl font-bold px-6 py-3 rounded-xl border-4 transition-all ${
                  isPressed
                    ? 'bg-green-500 border-green-300 text-white scale-110'
                    : 'bg-slate-700 border-slate-600 text-slate-300'
                }`}>
                  {displayKey}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/70">
              <span>Progresso do Tutorial</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Hint */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-amber-200 text-sm flex items-center gap-2">
              <span className="text-lg">💡</span>
              Pressione a tecla destacada para continuar
            </p>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-all pointer-events-auto"
      >
        Pular Tutorial
      </button>
    </div>
  );
}
