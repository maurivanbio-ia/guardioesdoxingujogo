import { useState } from 'react';
import { Zap, Hand, Flashlight } from 'lucide-react';

interface VirtualActionButtonsProps {
  onInteract: () => void;
  onRun: (isRunning: boolean) => void;
  showInteractButton: boolean;
  flashlightOn?: boolean;
  onFlashlightToggle?: () => void;
}

export function VirtualActionButtons({ onInteract, onRun, showInteractButton, flashlightOn = false, onFlashlightToggle }: VirtualActionButtonsProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunToggle = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    onRun(newState);
    
    // Dispatch event for GameScene
    window.dispatchEvent(new CustomEvent('virtualRun', {
      detail: { isRunning: newState }
    }));
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-auto md:hidden flex flex-col gap-3">
      {showInteractButton && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onInteract();
            window.dispatchEvent(new Event('virtualInteract'));
          }}
          className="w-16 h-16 rounded-full bg-blue-600 border-2 border-blue-400 shadow-lg shadow-blue-600/50 flex items-center justify-center text-white font-bold active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          <Hand className="w-8 h-8" />
        </button>
      )}
      
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          handleRunToggle();
        }}
        className={`w-16 h-16 rounded-full border-2 shadow-lg flex items-center justify-center font-bold active:scale-95 transition-all ${
          isRunning
            ? 'bg-yellow-500 border-yellow-300 shadow-yellow-500/50 text-slate-900'
            : 'bg-slate-700 border-slate-500 shadow-slate-700/50 text-white'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <Zap className={`w-8 h-8 ${isRunning ? 'animate-pulse' : ''}`} />
      </button>

      {/* Flashlight Button */}
      {onFlashlightToggle && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onFlashlightToggle();
          }}
          className={`w-16 h-16 rounded-full border-2 shadow-lg flex items-center justify-center font-bold active:scale-95 transition-all ${
            flashlightOn
              ? 'bg-yellow-400 border-yellow-200 shadow-yellow-400/50 text-slate-900'
              : 'bg-slate-700 border-slate-500 shadow-slate-700/50 text-white'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <Flashlight className={`w-8 h-8 ${flashlightOn ? 'animate-pulse' : ''}`} />
        </button>
      )}

      <div className="text-center text-xs text-slate-400 font-medium">
        Ações
      </div>
    </div>
  );
}
