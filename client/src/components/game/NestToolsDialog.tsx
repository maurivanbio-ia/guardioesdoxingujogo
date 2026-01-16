import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Ruler, BookOpen, X, Info } from 'lucide-react';
import { type ToolType } from '@/lib/collectibleTools';

interface NestToolsDialogProps {
  isOpen: boolean;
  nestId: string;
  species: 'expansa' | 'unifilis' | 'sextuberculata';
  collectedTools: ToolType[];
  onUseTool: (tool: 'thermometer' | 'ruler' | 'notebook', result: any) => void;
  onClose: () => void;
}

const SPECIES_TEMP_INFO = {
  expansa: {
    name: 'Podocnemis expansa',
    tempRange: { min: 31, max: 34 },
    info: 'Em temperaturas acima de 33°C, 100% dos filhotes são fêmeas. O equilíbrio da população depende da diversidade térmica dos ninhos.',
  },
  unifilis: {
    name: 'Podocnemis unifilis',
    tempRange: { min: 30, max: 33 },
    info: 'O equilíbrio térmico define a taxa de eclosão. Temperaturas entre 31-32°C resultam em proporção equilibrada de machos e fêmeas.',
  },
  sextuberculata: {
    name: 'Podocnemis sextuberculata',
    tempRange: { min: 30, max: 32 },
    info: 'Espécie vulnerável ao calor extremo. Temperaturas acima de 33°C aumentam mortalidade embrionária em até 60%.',
  },
};

export function NestToolsDialog({
  isOpen,
  nestId,
  species,
  collectedTools,
  onUseTool,
  onClose,
}: NestToolsDialogProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [measurementResult, setMeasurementResult] = useState<any>(null);

  if (!isOpen) return null;

  const speciesInfo = SPECIES_TEMP_INFO[species];
  
  const hasThermometer = collectedTools.includes('thermometer');
  const hasRuler = collectedTools.includes('ruler');
  const hasNotebook = collectedTools.includes('notebook');

  const handleToolSelect = (tool: 'thermometer' | 'ruler' | 'notebook') => {
    setSelectedTool(tool);

    if (tool === 'thermometer') {
      const temperature = Number(
        (speciesInfo.tempRange.min + Math.random() * (speciesInfo.tempRange.max - speciesInfo.tempRange.min)).toFixed(1)
      );
      const result = {
        temperature,
        species: speciesInfo.name,
        interpretation: speciesInfo.info,
      };
      setMeasurementResult(result);
      onUseTool(tool, result);
    } else if (tool === 'ruler') {
      const eggDiameter = Number((43 + Math.random() * 4).toFixed(1));
      const depth = Number((30 + Math.random() * 20).toFixed(1));
      const result = {
        eggDiameter,
        depth,
        species: speciesInfo.name,
        interpretation: `Diâmetro médio dos ovos: ${eggDiameter}mm. Profundidade do ninho: ${depth}cm. Valores dentro dos padrões para ${speciesInfo.name}.`,
      };
      setMeasurementResult(result);
      onUseTool(tool, result);
    } else if (tool === 'notebook') {
      const result = {
        nestId,
        species: speciesInfo.name,
        observations: [
          `Ninho identificado como ${speciesInfo.name}`,
          'Localização registrada com GPS',
          'Estimativa de eclosão: 45-60 dias',
          'Recomendação: monitorar temperatura regularmente',
        ],
      };
      setMeasurementResult(result);
      onUseTool(tool, result);
    }
  };

  const tools = [
    {
      id: 'thermometer',
      name: 'Termômetro',
      description: 'Medir temperatura do ninho',
      icon: Thermometer,
      color: 'from-red-600 to-orange-600',
      borderColor: 'border-red-500/50',
    },
    {
      id: 'ruler',
      name: 'Régua',
      description: 'Medir dimensões dos ovos',
      icon: Ruler,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/50',
    },
    {
      id: 'notebook',
      name: 'Caderneta de Campo',
      description: 'Registrar observações',
      icon: BookOpen,
      color: 'from-amber-600 to-yellow-600',
      borderColor: 'border-amber-500/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 border-2 border-emerald-500/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🥚</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Ferramentas de Campo
              </h2>
              <p className="text-emerald-300">
                {speciesInfo.name}
              </p>
            </div>
          </div>

          {!selectedTool ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-400 mb-4">
                O que você deseja fazer?
              </h3>

              <div className="space-y-3">
                <Button
                  onClick={() => handleToolSelect('thermometer')}
                  disabled={!hasThermometer}
                  className={`w-full h-auto py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 text-white border-2 border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-4 w-full">
                    <Thermometer className="w-8 h-8" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">Termômetro</p>
                      <p className="text-sm text-white/80">
                        {hasThermometer ? 'Medir temperatura do ninho (+10 XP)' : '🔒 Ferramenta não coletada'}
                      </p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleToolSelect('ruler')}
                  disabled={!hasRuler}
                  className={`w-full h-auto py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white border-2 border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-4 w-full">
                    <Ruler className="w-8 h-8" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">Régua</p>
                      <p className="text-sm text-white/80">
                        {hasRuler ? 'Medir dimensões dos ovos (+8 XP)' : '🔒 Ferramenta não coletada'}
                      </p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleToolSelect('notebook')}
                  disabled={!hasNotebook}
                  className={`w-full h-auto py-4 px-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:opacity-90 text-white border-2 border-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-4 w-full">
                    <BookOpen className="w-8 h-8" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">Caderneta de Campo</p>
                      <p className="text-sm text-white/80">
                        {hasNotebook ? 'Registrar observações (+12 XP)' : '🔒 Ferramenta não coletada'}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTool === 'thermometer' && measurementResult && (
                <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Thermometer className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold text-red-300 mb-2">
                        Temperatura Medida
                      </h4>
                      <p className="text-5xl font-black text-white mb-4">
                        {measurementResult.temperature}°C
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white leading-relaxed">
                        {measurementResult.interpretation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'ruler' && measurementResult && (
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Ruler className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-blue-300 mb-4">
                        Medidas Registradas
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <p className="text-sm text-blue-200 mb-1">Diâmetro do Ovo</p>
                          <p className="text-3xl font-black text-white">{measurementResult.eggDiameter}mm</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <p className="text-sm text-blue-200 mb-1">Profundidade</p>
                          <p className="text-3xl font-black text-white">{measurementResult.depth}cm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white leading-relaxed">
                        {measurementResult.interpretation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'notebook' && measurementResult && (
                <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-2 border-amber-500/50 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="w-8 h-8 text-amber-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-amber-300 mb-4">
                        Anotações de Campo
                      </h4>
                      <div className="space-y-2">
                        {measurementResult.observations.map((obs: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 bg-white/10 rounded-lg p-3">
                            <span className="text-amber-400 mt-0.5">📝</span>
                            <p className="text-white text-sm">{obs}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedTool(null);
                    setMeasurementResult(null);
                  }}
                  variant="outline"
                  className="flex-1 border-emerald-400/50 text-white hover:bg-emerald-600/20"
                >
                  Voltar
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
