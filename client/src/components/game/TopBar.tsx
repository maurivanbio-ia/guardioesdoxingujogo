import { useState, useEffect } from 'react';
import { 
  Leaf, 
  Target,
  Trophy,
  ListChecks,
  Volume2,
  VolumeX
} from 'lucide-react';
import { globalAudioState } from '@/lib/globalAudioState';

interface TopBarProps {
  xp?: number;
  icx?: number;
  unlockedAchievements?: number;
  onShowAchievements?: () => void;
  onShowPhaseProgress?: () => void;
  phaseXP?: number;
  phaseRequiredXP?: number;
  phaseName?: string;
}

export function TopBar({ 
  xp = 0, 
  icx = 75, 
  unlockedAchievements = 0, 
  onShowAchievements,
  onShowPhaseProgress,
  phaseXP = 0,
  phaseRequiredXP = 50,
  phaseName = "Fase 1"
}: TopBarProps) {
  const [nestsMarked, setNestsMarked] = useState(0);
  const [turtlesSaved, setTurtlesSaved] = useState(0);
  const [turtlesMeasured, setTurtlesMeasured] = useState(0);
  const [isGlobalAudioMuted, setIsGlobalAudioMuted] = useState(() => globalAudioState.isMuted());

  // Subscribe to global audio state changes
  useEffect(() => {
    const unsubscribe = globalAudioState.subscribe((muted) => {
      setIsGlobalAudioMuted(muted);
    });
    return unsubscribe;
  }, []);

  // Listen for nest marked events
  useEffect(() => {
    const handleNestMarked = () => {
      setNestsMarked(prev => prev + 1);
    };

    const handleTurtleSaved = () => {
      setTurtlesSaved(prev => prev + 1);
    };

    const handleTurtleMeasured = () => {
      setTurtlesMeasured(prev => prev + 1);
    };

    window.addEventListener('nestMarked', handleNestMarked);
    window.addEventListener('turtleSaved', handleTurtleSaved);
    window.addEventListener('turtleMeasured', handleTurtleMeasured);
    
    return () => {
      window.removeEventListener('nestMarked', handleNestMarked);
      window.removeEventListener('turtleSaved', handleTurtleSaved);
      window.removeEventListener('turtleMeasured', handleTurtleMeasured);
    };
  }, []);

  const getICXColor = () => {
    if (icx >= 80) return 'text-emerald-400';
    if (icx >= 50) return 'text-blue-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-2 md:py-4">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-3 pointer-events-auto">

            {/* ICX (Conservation Index) */}
            <div className="bg-slate-800/90 backdrop-blur-md px-2 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl border border-slate-600/50 hover:border-emerald-400/50 transition-all">
              <div className="flex items-center gap-1.5 md:gap-3">
                <Leaf className={`w-4 h-4 md:w-5 md:h-5 ${getICXColor()}`} />
                <div className={`font-bold text-sm md:text-lg ${getICXColor()}`}>
                  {icx}%
                </div>
              </div>
            </div>

            {/* Nests Marked */}
            <div className="bg-slate-800/90 backdrop-blur-md px-2 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl border border-slate-600/50 hover:border-amber-400/50 transition-all">
              <div className="flex items-center gap-1.5 md:gap-3">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                <div className="text-amber-300 font-bold text-sm md:text-lg">
                  {nestsMarked}<span className="hidden md:inline"> Ninhos</span>
                </div>
              </div>
            </div>

            {/* Turtles Saved */}
            <div className="bg-slate-800/90 backdrop-blur-md px-2 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl border border-slate-600/50 hover:border-green-400/50 transition-all">
              <div className="flex items-center gap-1.5 md:gap-3">
                <span className="text-lg md:text-2xl">🐢</span>
                <div className="text-green-300 font-bold text-sm md:text-lg">
                  {turtlesSaved}<span className="hidden md:inline"> Salvas</span>
                </div>
              </div>
            </div>

            {/* Turtles Measured */}
            <div className="bg-slate-800/90 backdrop-blur-md px-2 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl border border-slate-600/50 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-1.5 md:gap-3">
                <span className="text-lg md:text-2xl">📏</span>
                <div className="text-cyan-300 font-bold text-sm md:text-lg">
                  {turtlesMeasured}<span className="hidden md:inline"> Medidas</span>
                </div>
              </div>
            </div>

            {/* XP Display - Unified with Phase Progress */}
            <button
              onClick={onShowPhaseProgress}
              className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-cyan-900/90 hover:from-purple-800/90 hover:via-indigo-800/90 hover:to-cyan-800/90 backdrop-blur-md px-2 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl border-2 border-purple-400/50 hover:border-purple-300 transition-all hover:scale-105 active:scale-95 min-w-[48px] min-h-[48px] md:min-w-0 md:min-h-0"
            >
              <div className="flex items-center gap-1.5 md:gap-3">
                <div className="text-lg md:text-2xl">⭐</div>
                <div className="text-left">
                  <div className="text-xs text-purple-300 font-semibold uppercase tracking-wide hidden md:block">{phaseName}</div>
                  <div className="text-purple-100 font-bold text-sm md:text-xl">
                    {phaseXP}/{phaseRequiredXP} <span className="hidden md:inline">XP</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Achievements Button */}
            <button
              onClick={onShowAchievements}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 backdrop-blur-md px-2 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl border-2 border-amber-400/50 hover:border-amber-300 transition-all hover:scale-105 active:scale-95 min-w-[48px] min-h-[48px] md:min-w-0 md:min-h-0"
            >
              <div className="flex items-center gap-1.5 md:gap-3">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <div className="text-white font-bold text-sm md:text-lg">
                  {unlockedAchievements}/4
                </div>
              </div>
            </button>

            {/* Global Audio Toggle Button */}
            <button
              onClick={() => {
                globalAudioState.setMuted(!isGlobalAudioMuted);
              }}
              className={`backdrop-blur-md px-2 md:px-4 py-1.5 md:py-3 rounded-lg md:rounded-xl border-2 transition-all hover:scale-110 active:scale-95 min-w-[48px] min-h-[48px] md:min-w-0 md:min-h-0 ${
                isGlobalAudioMuted 
                  ? 'bg-red-900/90 border-red-400/50 hover:bg-red-800/90' 
                  : 'bg-emerald-900/90 border-emerald-400/50 hover:bg-emerald-800/90'
              }`}
              title={isGlobalAudioMuted ? "Ligar áudio global" : "Desligar áudio global"}
            >
              {isGlobalAudioMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-red-300" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-300 animate-pulse" />
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
