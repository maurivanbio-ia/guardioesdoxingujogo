import { Achievement } from '@/lib/achievementManager';
import { Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
}

export function AchievementsPanel({ achievements, onClose }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-amber-400">Conquistas</h2>
              <p className="text-gray-400 text-sm">
                {unlockedCount} de {totalCount} desbloqueadas ({Math.round(progress)}%)
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="h-2 bg-slate-700 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative rounded-xl border-2 p-5 transition-all ${
                achievement.unlocked
                  ? `bg-gradient-to-r ${achievement.iconColor} border-transparent`
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-xl" />
              )}
              
              <div className="relative flex items-start gap-4">
                <div
                  className={`text-5xl flex-shrink-0 ${
                    achievement.unlocked ? 'animate-bounce' : 'opacity-30 grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className={`text-xl font-bold ${
                        achievement.unlocked ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <div className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                        DESBLOQUEADA
                      </div>
                    )}
                  </div>
                  
                  <p
                    className={`text-sm mb-2 ${
                      achievement.unlocked ? 'text-white/90' : 'text-gray-600'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  
                  <p
                    className={`text-xs italic ${
                      achievement.unlocked ? 'text-white/70' : 'text-gray-700'
                    }`}
                  >
                    {achievement.effect}
                  </p>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-white/50 mt-2">
                      Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold px-8 py-3"
          >
            Continuar Jornada
          </Button>
        </div>
      </div>
    </div>
  );
}
