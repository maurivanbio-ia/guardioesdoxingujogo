import { Leaf, TrendingUp, TrendingDown } from 'lucide-react';
import { CONSERVATION_INDEX } from '@/lib/gameConstants';

interface ConservationIndexDisplayProps {
  value: number;
  compact?: boolean;
}

export function ConservationIndexDisplay({ value, compact = false }: ConservationIndexDisplayProps) {
  const getLevel = (val: number) => {
    const levels = CONSERVATION_INDEX.LEVELS;
    if (val <= levels.CRITICAL.max) return levels.CRITICAL;
    if (val <= levels.LOW.max) return levels.LOW;
    if (val <= levels.MODERATE.max) return levels.MODERATE;
    if (val <= levels.GOOD.max) return levels.GOOD;
    return levels.EXCELLENT;
  };

  const level = getLevel(value);
  const trend = value >= 60 ? 'up' : value >= 40 ? 'stable' : 'down';

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
        <Leaf className="w-4 h-4" style={{ color: level.color }} />
        <span className="text-sm font-semibold text-white">{value}%</span>
        <span className="text-xs text-slate-400">{level.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800" style={{ borderColor: level.color, borderWidth: 2 }}>
            <Leaf className="w-6 h-6" style={{ color: level.color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Índice de Conservação</h3>
            <p className="text-xs text-slate-400">Status da praia e fauna</p>
          </div>
        </div>
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-400" />}
        {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-400" />}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-white">{value}%</span>
          <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{
            backgroundColor: `${level.color}20`,
            color: level.color
          }}>
            {level.label}
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 rounded-full"
            style={{
              width: `${value}%`,
              backgroundColor: level.color
            }}
          >
            <div className="h-full bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Level Indicators */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {Object.values(CONSERVATION_INDEX.LEVELS).map((lvl) => {
          const isActive = value >= lvl.min && value <= lvl.max;
          return (
            <div
              key={lvl.label}
              className={`h-2 rounded-full transition-all ${
                isActive ? 'scale-110' : 'opacity-50'
              }`}
              style={{ backgroundColor: lvl.color }}
            />
          );
        })}
      </div>

      {/* Effects Description */}
      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
        <p className="text-xs text-slate-400">
          {value >= 61 
            ? CONSERVATION_INDEX.EFFECTS.HIGH.description
            : CONSERVATION_INDEX.EFFECTS.LOW.description
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Taxa de Sucesso</div>
          <div className="text-lg font-bold text-white">
            {Math.round((value >= 61 ? CONSERVATION_INDEX.EFFECTS.HIGH.nestSuccess : CONSERVATION_INDEX.EFFECTS.LOW.nestSuccess) * 100)}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Presença de Fauna</div>
          <div className="text-lg font-bold text-white">
            {Math.round((value >= 61 ? CONSERVATION_INDEX.EFFECTS.HIGH.wildlifePresence : CONSERVATION_INDEX.EFFECTS.LOW.wildlifePresence) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
