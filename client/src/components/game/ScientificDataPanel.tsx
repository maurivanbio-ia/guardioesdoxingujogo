import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { TURTLE_SPECIES } from '@/lib/gameConstants';

export function ScientificDataPanel() {
  const { gameState, pauseGame } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'species' | 'stats'>('records');

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          pauseGame();
        }}
        className="fixed top-20 right-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto z-40 flex items-center gap-2"
      >
        📊 Dados Científicos
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50 p-4">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-teal-600 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-teal-600/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-teal-400">
              📊 Banco de Dados Científicos
            </h2>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              ✕ Fechar
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('records')}
              variant={activeTab === 'records' ? 'default' : 'outline'}
              className={activeTab === 'records' ? 'bg-teal-600' : 'border-gray-600'}
            >
              Registros de Campo
            </Button>
            <Button
              onClick={() => setActiveTab('species')}
              variant={activeTab === 'species' ? 'default' : 'outline'}
              className={activeTab === 'species' ? 'bg-teal-600' : 'border-gray-600'}
            >
              Espécies
            </Button>
            <Button
              onClick={() => setActiveTab('stats')}
              variant={activeTab === 'stats' ? 'default' : 'outline'}
              className={activeTab === 'stats' ? 'bg-teal-600' : 'border-gray-600'}
            >
              Estatísticas
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'records' && <RecordsTab />}
          {activeTab === 'species' && <SpeciesTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </Card>
    </div>
  );
}

function RecordsTab() {
  const { gameState } = useGame();

  if (gameState.scientificData.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-lg">Nenhum registro coletado ainda</p>
        <p className="text-sm mt-2">Interaja com tartarugas e ninhos para coletar dados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {gameState.scientificData.map((record) => (
        <Card key={record.id} className="bg-gray-800/50 border-teal-600/30 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-teal-400 font-bold">
                {record.type === 'nest' ? '🥚 Ninho' : record.type === 'female' ? '🐢 Fêmea' : '🐣 Filhote'}
              </span>
              <span className="text-gray-400 text-sm ml-3">
                {new Date(record.timestamp).toLocaleString('pt-BR')}
              </span>
            </div>
            <span className="text-xs text-gray-500">ID: {record.id.slice(-8)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Coordenadas:</span>
              <span className="text-gray-200 ml-2">
                X: {record.coordinates.x.toFixed(2)}, Z: {record.coordinates.z.toFixed(2)}
              </span>
            </div>
            {record.species && (
              <div>
                <span className="text-gray-400">Espécie:</span>
                <span className="text-gray-200 ml-2 italic">{record.species}</span>
              </div>
            )}
            {record.measurements?.weight && (
              <div>
                <span className="text-gray-400">Peso:</span>
                <span className="text-gray-200 ml-2">{record.measurements.weight} kg</span>
              </div>
            )}
            {record.measurements?.carapaceLength && (
              <div>
                <span className="text-gray-400">CCL:</span>
                <span className="text-gray-200 ml-2">{record.measurements.carapaceLength} cm</span>
              </div>
            )}
            {record.measurements?.carapaceWidth && (
              <div>
                <span className="text-gray-400">CCW:</span>
                <span className="text-gray-200 ml-2">{record.measurements.carapaceWidth} cm</span>
              </div>
            )}
          </div>

          {record.notes && (
            <p className="text-gray-300 text-sm mt-2 italic">"{record.notes}"</p>
          )}
        </Card>
      ))}
    </div>
  );
}

function SpeciesTab() {
  return (
    <div className="space-y-6">
      {Object.values(TURTLE_SPECIES).map((species) => (
        <Card key={species.scientificName} className="bg-gray-800/50 border-teal-600/30 p-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">🐢</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-teal-400 mb-1 italic">
                {species.scientificName}
              </h3>
              <p className="text-lg text-gray-300 mb-4">{species.commonName}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Peso médio:</span>
                  <span className="text-gray-200 ml-2 font-bold">{species.avgWeight} kg</span>
                </div>
                <div>
                  <span className="text-gray-400">CCL médio:</span>
                  <span className="text-gray-200 ml-2 font-bold">{species.avgCarapaceLength} cm</span>
                </div>
                <div>
                  <span className="text-gray-400">CCW médio:</span>
                  <span className="text-gray-200 ml-2 font-bold">{species.avgCarapaceWidth} cm</span>
                </div>
                <div>
                  <span className="text-gray-400">Período de nidificação:</span>
                  <span className="text-gray-200 ml-2">{species.nestingPeriod}</span>
                </div>
                <div>
                  <span className="text-gray-400">Ovos por ninho:</span>
                  <span className="text-gray-200 ml-2 font-bold">{species.eggsPerNest}</span>
                </div>
                <div>
                  <span className="text-gray-400">Incubação:</span>
                  <span className="text-gray-200 ml-2">{species.incubationDays} dias</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function StatsTab() {
  const { gameState } = useGame();

  const stats = {
    totalRecords: gameState.scientificData.length,
    nests: gameState.scientificData.filter(r => r.type === 'nest').length,
    females: gameState.scientificData.filter(r => r.type === 'female').length,
    hatchlings: gameState.scientificData.filter(r => r.type === 'hatchling').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-teal-900/50 to-teal-800/30 border-teal-600/50 p-6 text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-3xl font-bold text-teal-400">{stats.totalRecords}</div>
          <div className="text-sm text-gray-400">Registros Totais</div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 border-amber-600/50 p-6 text-center">
          <div className="text-4xl mb-2">🥚</div>
          <div className="text-3xl font-bold text-amber-400">{stats.nests}</div>
          <div className="text-sm text-gray-400">Ninhos Marcados</div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-600/50 p-6 text-center">
          <div className="text-4xl mb-2">🐢</div>
          <div className="text-3xl font-bold text-green-400">{stats.females}</div>
          <div className="text-sm text-gray-400">Fêmeas Medidas</div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-600/50 p-6 text-center">
          <div className="text-4xl mb-2">🐣</div>
          <div className="text-3xl font-bold text-blue-400">{stats.hatchlings}</div>
          <div className="text-sm text-gray-400">Filhotes Soltos</div>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-teal-600/30 p-6">
        <h3 className="text-xl font-bold text-teal-400 mb-4">Desempenho do Pesquisador</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Ética Científica</span>
              <span className="text-amber-400 font-bold">{gameState.ethicalScore}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-3 rounded-full transition-all"
                style={{ width: `${gameState.ethicalScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Reputação Comunitária</span>
              <span className="text-green-400 font-bold">{gameState.reputation}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full transition-all"
                style={{ width: `${gameState.reputation}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

