import { AlertTriangle } from 'lucide-react';

interface ThreatHUDProps {
  activeThreats: number;
}

export function ThreatHUD({ activeThreats }: ThreatHUDProps) {
  if (activeThreats === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-30 pointer-events-auto animate-in slide-in-from-right duration-300">
      <div className="bg-gradient-to-br from-red-900/95 to-orange-900/95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-red-500/50 p-3 min-w-[180px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-red-500/30 rounded-full flex items-center justify-center border border-red-400/50 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-200">AMEAÇAS</h3>
          </div>
        </div>

        {/* Threat Count */}
        <div className="bg-black/30 rounded-lg p-2 border border-red-400/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-300">Urubus ativos:</span>
            <span className="text-xl font-bold text-red-100">{activeThreats}</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-[10px] text-red-300/70 mt-2 text-center">
          Aproxime-se para espantar
        </p>
      </div>
    </div>
  );
}
