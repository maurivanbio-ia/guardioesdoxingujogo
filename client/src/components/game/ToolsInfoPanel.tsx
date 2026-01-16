import { useState } from 'react';
import { Wrench, X, GripVertical, Lock } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';

type ToolType = 'thermometer' | 'ruler' | 'scale' | 'notebook' | 'gps';

interface ToolInfo {
  type: ToolType;
  name: string;
  icon: string;
  description: string;
  usage: string;
  scientificImportance: string;
}

interface ToolsInfoPanelProps {
  collectedTools: ToolType[];
}

export function ToolsInfoPanel({ collectedTools }: ToolsInfoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const { position, isDragging, dragRef, handlers } = useDraggable({
    defaultPosition: { x: window.innerWidth - 100, y: 16 },
    storageKey: 'toolsInfoPanelPosition',
  });

  const allTools: ToolInfo[] = [
    {
      type: 'thermometer',
      name: 'Termômetro',
      icon: '🌡️',
      description: 'Instrumento de medição de temperatura usado para determinar a temperatura dos ninhos.',
      usage: 'Insira cuidadosamente no centro do ninho para obter leituras precisas. Mantenha por 30 segundos.',
      scientificImportance: 'A temperatura do ninho determina o sexo dos filhotes em tartarugas. Temperaturas mais altas (>32°C) geralmente produzem mais fêmeas, enquanto temperaturas mais baixas produzem mais machos.',
    },
    {
      type: 'ruler',
      name: 'Régua',
      icon: '📏',
      description: 'Ferramenta de medição linear usada para determinar o comprimento da carapaça das tartarugas.',
      usage: 'Meça do ponto mais anterior ao mais posterior da carapaça, mantendo a régua paralela ao eixo do corpo.',
      scientificImportance: 'O comprimento da carapaça indica a idade aproximada e maturidade sexual do animal, essencial para estudos populacionais.',
    },
    {
      type: 'scale',
      name: 'Balança',
      icon: '⚖️',
      description: 'Equipamento de pesagem para determinar a massa corporal das tartarugas.',
      usage: 'Coloque a tartaruga cuidadosamente no centro da plataforma. Aguarde a estabilização da leitura.',
      scientificImportance: 'O peso em relação ao tamanho indica saúde e condição corporal, importantes para avaliar o sucesso reprodutivo e estado nutricional.',
    },
    {
      type: 'notebook',
      name: 'Caderneta de Campo',
      icon: '📓',
      description: 'Registro sistemático de todas as observações e dados coletados durante o trabalho de campo.',
      usage: 'Anote data, hora, localização GPS, condições climáticas e todas as medidas obtidas de forma organizada.',
      scientificImportance: 'Dados bem documentados permitem análises científicas robustas e contribuem para o conhecimento de longo prazo sobre as populações de tartarugas.',
    },
    {
      type: 'gps',
      name: 'GPS',
      icon: '📍',
      description: 'Sistema de Posicionamento Global para registrar coordenadas exatas de ninhos e avistamentos.',
      usage: 'Aguarde o sinal estabilizar (>4 satélites) antes de registrar as coordenadas. Anote precisão do sinal.',
      scientificImportance: 'A localização precisa de ninhos permite monitoramento de longo prazo, estudos de fidelidade ao local de nidificação e mapeamento de áreas críticas para conservação.',
    },
  ];

  // Mostrar badge com número de ferramentas coletadas
  const collectedCount = collectedTools.length;
  const totalCount = allTools.length;

  return (
    <>
      {/* Floating button */}
      <div
        ref={dragRef}
        className="fixed pointer-events-auto z-30"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="relative group">
          {/* Drag handle */}
          <div 
            {...handlers}
            className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          >
            <GripVertical className="w-4 h-4 text-orange-400" />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-br from-orange-500 to-amber-600 p-3.5 rounded-2xl shadow-2xl border border-orange-400/20 hover:scale-110 transition-all group"
            title="Ferramentas Coletadas"
          >
            <Wrench className="w-6 h-6 text-white transition-transform group-hover:rotate-12" />
            
            {/* Badge com contador */}
            {collectedCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-slate-900">
                {collectedCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => {
            setIsOpen(false);
            setSelectedTool(null);
          }}
        >
          <div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-amber-500/30 max-w-5xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-black/40 backdrop-blur-sm px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="w-8 h-8 text-amber-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Ferramentas Coletadas</h2>
                  <p className="text-sm text-gray-400">{collectedCount}/{totalCount} ferramentas disponíveis</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedTool(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              {collectedCount === 0 ? (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhuma ferramenta coletada</h3>
                  <p className="text-gray-500">Explore o mapa para encontrar ferramentas científicas!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tool selection grid */}
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Selecione uma ferramenta</h3>
                    <div className="space-y-2">
                      {allTools.map((tool) => {
                        const isCollected = collectedTools.includes(tool.type);
                        const isSelected = selectedTool === tool.type;
                        
                        return (
                          <button
                            key={tool.type}
                            onClick={() => isCollected && setSelectedTool(tool.type)}
                            disabled={!isCollected}
                            className={`
                              w-full flex items-center gap-3 p-3 rounded-xl transition-all
                              ${isCollected
                                ? isSelected
                                  ? 'bg-gradient-to-r from-amber-500/40 to-orange-500/40 border-2 border-amber-400 shadow-lg'
                                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                : 'bg-gray-900/30 border border-gray-700/30 opacity-40 cursor-not-allowed'
                              }
                            `}
                          >
                            {isCollected ? (
                              <span className="text-3xl">{tool.icon}</span>
                            ) : (
                              <div className="w-8 h-8 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1 text-left">
                              <span className={`font-medium block ${isCollected ? 'text-white' : 'text-gray-600'}`}>
                                {tool.name}
                              </span>
                              {!isCollected && (
                                <span className="text-xs text-gray-600">Não coletada</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tool details */}
                  <div className="md:col-span-2">
                    {selectedTool ? (
                      (() => {
                        const tool = allTools.find(t => t.type === selectedTool)!;
                        return (
                          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
                            <div className="flex items-center gap-4 mb-6">
                              <span className="text-6xl">{tool.icon}</span>
                              <div>
                                <h3 className="text-3xl font-bold text-amber-300">{tool.name}</h3>
                                <p className="text-emerald-400 text-sm font-medium mt-1">✓ Coletada</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <span>📝</span> Descrição
                                </h4>
                                <p className="text-gray-400 leading-relaxed">{tool.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <span>🔬</span> Como Usar
                                </h4>
                                <p className="text-gray-400 leading-relaxed">{tool.usage}</p>
                              </div>
                              
                              <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4">
                                <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                                  <span>💡</span> Importância Científica
                                </h4>
                                <p className="text-emerald-100 leading-relaxed">{tool.scientificImportance}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex items-center justify-center h-full bg-black/20 rounded-xl border border-dashed border-gray-700">
                        <div className="text-center">
                          <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-500">Selecione uma ferramenta para ver os detalhes</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
