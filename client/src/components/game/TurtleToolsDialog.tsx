import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Ruler, BookOpen, Scale, X, Info } from 'lucide-react';
import { type ToolType } from '@/lib/collectibleTools';

interface TurtleToolsDialogProps {
  isOpen: boolean;
  turtleId: string;
  species: 'expansa' | 'unifilis' | 'sextuberculata';
  collectedTools: ToolType[];
  onUseTool: (tool: 'scale' | 'ruler' | 'notebook', result: any) => void;
  onClose: () => void;
}

const SPECIES_INFO = {
  expansa: {
    name: 'Podocnemis expansa',
    commonName: 'Tartaruga-da-Amazônia',
    weightRange: { min: 15, max: 50 },
    lengthRange: { min: 60, max: 100 },
    info: 'A maior tartaruga de água doce da América do Sul. Fêmeas adultas podem ultrapassar 90 kg e 1 metro de comprimento. Fundamental para a manutenção do ecossistema aquático.',
  },
  unifilis: {
    name: 'Podocnemis unifilis',
    commonName: 'Tracajá',
    weightRange: { min: 3, max: 12 },
    lengthRange: { min: 30, max: 50 },
    info: 'Espécie de médio porte. Fêmeas adultas podem atingir até 12 kg e 50 cm de carapaça. Muito importante para a dispersão de sementes e manutenção da vegetação ripária.',
  },
  sextuberculata: {
    name: 'Podocnemis sextuberculata',
    commonName: 'Iaçá',
    weightRange: { min: 1, max: 4 },
    lengthRange: { min: 20, max: 34 },
    info: 'Menor espécie do gênero, com adultos atingindo até 4 kg e 34 cm de carapaça. Vulnerável a predação e mudanças ambientais. Espécie indicadora de saúde do ecossistema.',
  },
};

export function TurtleToolsDialog({
  isOpen,
  turtleId,
  species,
  collectedTools,
  onUseTool,
  onClose,
}: TurtleToolsDialogProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [measurementResult, setMeasurementResult] = useState<any>(null);

  if (!isOpen) return null;

  const speciesInfo = SPECIES_INFO[species];

  const handleToolSelect = (tool: 'scale' | 'ruler' | 'notebook') => {
    setSelectedTool(tool);

    if (tool === 'scale') {
      const weight = Number(
        (speciesInfo.weightRange.min + Math.random() * (speciesInfo.weightRange.max - speciesInfo.weightRange.min)).toFixed(2)
      );
      const result = {
        tool: 'scale',
        weight,
        unit: 'kg',
        message: `Peso registrado: ${weight} kg`,
        scientificNote: `${speciesInfo.name}: Peso dentro da faixa esperada para adultos da espécie (${speciesInfo.weightRange.min}-${speciesInfo.weightRange.max} kg).`,
      };
      setMeasurementResult(result);
      onUseTool(tool, result);
    } else if (tool === 'ruler') {
      const length = Number(
        (speciesInfo.lengthRange.min + Math.random() * (speciesInfo.lengthRange.max - speciesInfo.lengthRange.min)).toFixed(1)
      );
      const result = {
        tool: 'ruler',
        length,
        unit: 'cm',
        message: `Comprimento da carapaça: ${length} cm`,
        scientificNote: `Medida de carapaça indica indivíduo adulto saudável. Dados biométricos essenciais para estudos populacionais.`,
      };
      setMeasurementResult(result);
      onUseTool(tool, result);
    } else if (tool === 'notebook') {
      const result = {
        tool: 'notebook',
        message: 'Observações registradas com sucesso',
        observations: [
          `Espécie: ${speciesInfo.name} (${speciesInfo.commonName})`,
          `Condição: Saudável, sem sinais de ferimentos`,
          `Comportamento: Calma durante manuseio, indicando baixo estresse`,
          `Local: Praia de desova do Rio Xingu`,
          `Contexto: ${speciesInfo.info}`,
        ],
      };
      setMeasurementResult(result);
      onUseTool(tool, result);
    }
  };

  const hasScale = collectedTools.includes('scale');
  const hasRuler = collectedTools.includes('ruler');
  const hasNotebook = collectedTools.includes('notebook');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">🐢</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Interação com Tartaruga
              </h2>
              <p className="text-emerald-300 font-semibold">
                {speciesInfo.commonName} ({speciesInfo.name})
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ID: {turtleId}
              </p>
            </div>
          </div>

          {!measurementResult ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">
                O que você deseja fazer?
              </h3>

              <div className="space-y-3">
                <Button
                  onClick={() => handleToolSelect('scale')}
                  disabled={!hasScale}
                  className="w-full h-auto py-4 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-2 border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Scale className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">Balança Portátil</p>
                      <p className="text-sm text-purple-100">
                        {hasScale ? 'Pesar a tartaruga (+10 XP)' : '🔒 Ferramenta não coletada'}
                      </p>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleToolSelect('ruler')}
                  disabled={!hasRuler}
                  className="w-full h-auto py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-2 border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Ruler className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">Régua de Medição</p>
                      <p className="text-sm text-blue-100">
                        {hasRuler ? 'Medir comprimento da carapaça (+8 XP)' : '🔒 Ferramenta não coletada'}
                      </p>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleToolSelect('notebook')}
                  disabled={!hasNotebook}
                  className="w-full h-auto py-4 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-2 border-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3 w-full">
                    <BookOpen className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">Caderneta de Campo</p>
                      <p className="text-sm text-amber-100">
                        {hasNotebook ? 'Registrar observações científicas (+12 XP)' : '🔒 Ferramenta não coletada'}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="mt-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-2 border-emerald-500/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 mb-1">
                      Informação Científica
                    </h4>
                    <p className="text-xs text-white leading-relaxed">
                      {speciesInfo.info}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-2 border-emerald-500/50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-emerald-300 mb-2">
                      Resultado da Medição
                    </h4>
                    <p className="text-white font-semibold mb-3">
                      {measurementResult.message}
                    </p>
                    {measurementResult.scientificNote && (
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {measurementResult.scientificNote}
                      </p>
                    )}
                    {measurementResult.observations && (
                      <ul className="mt-3 space-y-1">
                        {measurementResult.observations.map((obs: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-300">
                            • {obs}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Continuar Pesquisa
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
