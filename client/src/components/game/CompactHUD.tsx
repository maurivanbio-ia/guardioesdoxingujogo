import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { User, Map, Trophy, Package, Keyboard, Clock, Thermometer, Droplets, Clipboard, Leaf } from 'lucide-react';
import { EquipmentChecklist } from './EquipmentChecklist';
import { TemperatureReader } from './TemperatureReader';
import { WaterLevelMonitor } from './WaterLevelMonitor';
import { ConservationIndexDisplay } from './ConservationIndexDisplay';
import { ResearcherDialogue } from './ResearcherDialogue';

export function CompactHUD() {
  const { getCurrentPhase, updatePhaseObjective, gameState, getICX } = useGame();
  const phase = getCurrentPhase();
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  
  // Modals state
  const [showEquipmentChecklist, setShowEquipmentChecklist] = useState(false);
  const [showTemperature, setShowTemperature] = useState(false);
  const [showWaterLevel, setShowWaterLevel] = useState(false);
  const [showConservationIndex, setShowConservationIndex] = useState(false);
  const [showResearcherDialogue, setShowResearcherDialogue] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<'LUCAS' | 'ALINE'>('LUCAS');
  
  // Get ICX from GameContext
  const conservationIndex = Math.round(getICX());

  const handleEquipmentComplete = () => {
    updatePhaseObjective('check_equipment', 1);
  };

  const handleTemperatureReading = (temp: number) => {
    updatePhaseObjective('temperature_readings', 1);
    console.log(`Temperatura registrada: ${temp}°C`);
  };

  const handleWaterLevelReading = (level: number) => {
    updatePhaseObjective('water_level_check', 1);
    console.log(`Nível da água registrado: ${level} cm`);
  };

  const openResearcherDialogue = (researcher: 'LUCAS' | 'ALINE') => {
    setSelectedResearcher(researcher);
    setShowResearcherDialogue(true);
  };

  const togglePanel = (panelId: string) => {
    setExpandedPanel(expandedPanel === panelId ? null : panelId);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab - Abrir menu de equipamentos
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowEquipmentChecklist(prev => !prev);
      }
      
      // Espaço - Espantar urubus (será implementado no GameScene)
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        // Dispara evento customizado para o GameScene escutar
        window.dispatchEvent(new CustomEvent('scareVultures'));
        console.log('🦅 Espantando urubus!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Barra de ícones compacta - Topo */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {/* Relógio */}
        <button className="bg-gradient-to-br from-orange-500/90 to-amber-600/90 backdrop-blur-md rounded-full p-3 border-2 border-orange-400/50 shadow-xl hover:scale-110 transition-transform">
          <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* Objetivos */}
        <button 
          onClick={() => togglePanel('objectives')}
          className="bg-gradient-to-br from-amber-500/90 to-orange-600/90 backdrop-blur-md rounded-full p-3 border-2 border-amber-400/50 shadow-xl hover:scale-110 transition-transform"
        >
          <Map className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* Métricas */}
        <button 
          onClick={() => togglePanel('metrics')}
          className="bg-gradient-to-br from-purple-500/90 to-indigo-600/90 backdrop-blur-md rounded-full p-3 border-2 border-purple-400/50 shadow-xl hover:scale-110 transition-transform"
        >
          <Trophy className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* Equipamentos */}
        <button 
          onClick={() => togglePanel('equipment')}
          className="bg-gradient-to-br from-gray-700/90 to-gray-800/90 backdrop-blur-md rounded-full p-3 border-2 border-amber-400/50 shadow-xl hover:scale-110 transition-transform"
        >
          <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* Controles */}
        <button 
          onClick={() => togglePanel('controls')}
          className="bg-gradient-to-br from-gray-700/90 to-gray-900/90 backdrop-blur-md rounded-full p-3 border-2 border-white/30 shadow-xl hover:scale-110 transition-transform"
        >
          <Keyboard className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* NPC/Diálogo */}
        <button 
          onClick={() => togglePanel('dialogue')}
          className="bg-gradient-to-br from-blue-500/90 to-cyan-600/90 backdrop-blur-md rounded-full p-3 border-2 border-blue-400/50 shadow-xl hover:scale-110 transition-transform"
        >
          <User className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Painel Expandido: Objetivos */}
      {expandedPanel === 'objectives' && (
        <div className="absolute top-20 left-4 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-md rounded-2xl p-6 border-2 border-amber-500/50 shadow-2xl max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-amber-400">O Chamado do Rio</h2>
            <button onClick={() => setExpandedPanel(null)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <p className="text-white/80 text-sm mb-4">{phase.description}</p>
          
          <div className="space-y-2">
            {phase.objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                  obj.current >= obj.target ? 'bg-green-500 border-green-400' : 'border-white/50'
                }`}>
                  {obj.current >= obj.target && <div className="text-white text-xs flex items-center justify-center h-full">✓</div>}
                </div>
                <span className={`text-sm ${obj.current >= obj.target ? 'text-green-300' : 'text-white/70'}`}>
                  {obj.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Painel Expandido: Métricas */}
      {expandedPanel === 'metrics' && (
        <div className="absolute top-20 right-4 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-2xl p-6 border-2 border-purple-500/50 shadow-2xl min-w-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span className="text-white font-bold">Fase {phase.id} de 5</span>
            </div>
            <button onClick={() => setExpandedPanel(null)} className="text-white/50 hover:text-white">✕</button>
          </div>

          <h3 className="text-purple-200 font-bold text-lg mb-3">{phase.name}</h3>

          <div className="space-y-3 mb-4">
            {/* Ética Científica - Verde */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/90 text-sm">Ética Científica</span>
                <span className="text-green-400 font-bold text-sm">{Math.round(gameState.ethicalScore)}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500" 
                  style={{ width: `${gameState.ethicalScore}%` }} 
                />
              </div>
            </div>

            {/* Reputação - Amarela */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/90 text-sm">Reputação</span>
                <span className="text-yellow-400 font-bold text-sm">{Math.round(gameState.reputation)}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500" 
                  style={{ width: `${gameState.reputation}%` }} 
                />
              </div>
            </div>

            {/* Índice de Conservação (ICX) - Azul */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/90 text-sm">ICX</span>
                <span className="text-blue-400 font-bold text-sm">{conservationIndex}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" 
                  style={{ width: `${conservationIndex}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="border-t border-purple-500/30 pt-4">
            <h4 className="text-white font-bold mb-3 text-sm">OBJETIVOS:</h4>
            <div className="space-y-2">
              {phase.objectives.map((obj) => (
                <div key={obj.id} className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{obj.description}</span>
                  <span className="text-purple-300 font-bold text-sm">{obj.current}/{obj.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Painel Expandido: Equipamentos */}
      {expandedPanel === 'equipment' && (
        <div className="absolute bottom-20 left-4 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-md rounded-2xl p-5 border-2 border-amber-500/50 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-400 font-bold">Equipamentos</h3>
            <button onClick={() => setExpandedPanel(null)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <div className="flex gap-2">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-amber-500/70 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="text-2xl">📍</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-gray-600/50 flex items-center justify-center opacity-60">
              <span className="text-2xl">📏</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-gray-600/50 flex items-center justify-center opacity-60">
              <span className="text-2xl">⚖️</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-gray-600/50 flex items-center justify-center opacity-60">
              <span className="text-2xl">📐</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-gray-600/50 flex items-center justify-center opacity-60">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border-2 border-amber-500/70 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
      )}

      {/* Painel Expandido: Controles */}
      {expandedPanel === 'controls' && (
        <div className="absolute bottom-20 right-4 bg-black/90 backdrop-blur-sm rounded-xl px-5 py-4 border-2 border-white/30 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Controles</h3>
            <button onClick={() => setExpandedPanel(null)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <div><span className="font-bold text-white">WASD</span> Mover</div>
            <div><span className="font-bold text-white">Shift</span> Correr</div>
            <div><span className="font-bold text-white">E</span> Interagir</div>
            <div><span className="font-bold text-white">ESC</span> Pausar</div>
          </div>
        </div>
      )}

      {/* Painel Expandido: Diálogo */}
      {expandedPanel === 'dialogue' && (
        <div className="absolute bottom-20 right-4 bg-gradient-to-br from-orange-800/95 to-amber-900/95 backdrop-blur-md rounded-2xl p-5 border-2 border-amber-600/50 shadow-2xl max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Dra. Adriana Malvasio</h3>
            <button onClick={() => setExpandedPanel(null)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              "Bem-vindo ao projeto! Vou te ensinar como identificar e proteger as tartarugas. 
              Primeiro, conheça a equipe e marque algumas tartarugas."
            </p>
          </div>
        </div>
      )}

      {/* Barra Lateral Direita - Missões Científicas */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        {/* Equipamentos Checklist */}
        <button
          onClick={() => setShowEquipmentChecklist(true)}
          className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-md rounded-full p-3 border-2 border-amber-400/50 shadow-xl hover:scale-110 transition-transform group relative"
          title="Checklist de Equipamentos"
        >
          <Clipboard className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Equipamentos
          </span>
        </button>

        {/* Termômetro */}
        <button
          onClick={() => setShowTemperature(true)}
          className="bg-gradient-to-br from-orange-500/90 to-red-600/90 backdrop-blur-md rounded-full p-3 border-2 border-orange-400/50 shadow-xl hover:scale-110 transition-transform group relative"
          title="Medir Temperatura"
        >
          <Thermometer className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Temperatura
          </span>
        </button>

        {/* Nível da Água */}
        <button
          onClick={() => setShowWaterLevel(true)}
          className="bg-gradient-to-br from-blue-500/90 to-cyan-600/90 backdrop-blur-md rounded-full p-3 border-2 border-blue-400/50 shadow-xl hover:scale-110 transition-transform group relative"
          title="Monitorar Água"
        >
          <Droplets className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Nível da Água
          </span>
        </button>

        {/* Índice de Conservação */}
        <button
          onClick={() => setShowConservationIndex(!showConservationIndex)}
          className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-md rounded-full p-3 border-2 border-green-400/50 shadow-xl hover:scale-110 transition-transform group relative"
          title="Índice de Conservação"
        >
          <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            IC
          </span>
        </button>
      </div>

      {/* Conservation Index Display */}
      {showConservationIndex && (
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 animate-in fade-in slide-in-from-right-2 duration-200">
          <ConservationIndexDisplay value={conservationIndex} />
        </div>
      )}

      {/* Modals */}
      {showEquipmentChecklist && (
        <EquipmentChecklist
          onClose={() => setShowEquipmentChecklist(false)}
          onComplete={handleEquipmentComplete}
        />
      )}

      {showTemperature && (
        <TemperatureReader
          onClose={() => setShowTemperature(false)}
          onReading={handleTemperatureReading}
        />
      )}

      {showWaterLevel && (
        <WaterLevelMonitor
          onClose={() => setShowWaterLevel(false)}
          onReading={handleWaterLevelReading}
        />
      )}

      {showResearcherDialogue && (
        <ResearcherDialogue
          researcher={selectedResearcher}
          onClose={() => setShowResearcherDialogue(false)}
        />
      )}
    </>
  );
}
