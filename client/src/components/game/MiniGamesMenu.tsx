import React from 'react';
import { X, Trophy, Brain, Microscope } from 'lucide-react';

interface MiniGamesMenuProps {
  onSelectGame: (game: 'nest_temperature' | 'species_identification' | 'turtle_anatomy') => void;
  onClose: () => void;
}

export function MiniGamesMenu({ onSelectGame, onClose }: MiniGamesMenuProps) {
  const games = [
    {
      id: 'nest_temperature' as const,
      title: '🌡️ Mestre da Temperatura',
      description: 'Aprenda sobre determinação sexual por temperatura (TSD)',
      difficulty: 'Médio',
      xp: 30,
      icon: '🌡️',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'species_identification' as const,
      title: '🐢 Especialista em Espécies',
      description: 'Identifique as 3 espécies de tartarugas do Xingu',
      difficulty: 'Fácil',
      xp: 25,
      icon: '🐢',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'turtle_anatomy' as const,
      title: '🔬 Anatomia das Tartarugas',
      description: 'Conheça as estruturas anatômicas dos quelônios',
      difficulty: 'Fácil',
      xp: 20,
      icon: '🔬',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-purple-500/50 max-w-3xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <Brain className="w-12 h-12 text-yellow-300" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Mini-Games Educacionais</h2>
              <p className="text-purple-100">Teste seus conhecimentos e ganhe XP!</p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="p-6 space-y-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`w-full bg-gradient-to-r ${game.color} hover:scale-[1.02] transition-transform rounded-xl p-6 border-2 border-white/20 shadow-lg group`}
            >
              <div className="flex items-start gap-4">
                <span className="text-6xl group-hover:animate-bounce">{game.icon}</span>
                
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-white/90 text-sm mb-3">{game.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                      <Trophy className="w-4 h-4 text-yellow-300" />
                      <span className="text-white font-semibold">+{game.xp} XP</span>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">{game.difficulty}</span>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-white text-sm">3 questões</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/50 rounded-b-2xl border-t border-slate-700">
          <p className="text-center text-slate-300 text-sm">
            💡 Dica: Complete os mini-games para aprofundar seu conhecimento científico e ganhar XP bônus!
          </p>
        </div>
      </div>
    </div>
  );
}
