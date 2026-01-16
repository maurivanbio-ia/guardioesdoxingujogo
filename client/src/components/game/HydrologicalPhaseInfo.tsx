import { X, Sun, CloudRain, Droplets } from 'lucide-react';

type HydrologicalPhase = 'seca' | 'chuva';

interface HydrologicalPhaseInfoProps {
  phase: HydrologicalPhase;
  onClose: () => void;
}

export function HydrologicalPhaseInfo({ phase, onClose }: HydrologicalPhaseInfoProps) {
  const phaseData = {
    seca: {
      title: 'Época da Seca',
      icon: Sun,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-900/30 to-orange-900/30',
      borderColor: 'border-yellow-500/50',
      content: [
        {
          species: 'Podocnemis expansa (Tartaruga-da-Amazônia)',
          behavior: 'Fêmeas saem do rio para desovar nas praias de areia expostas. É a principal época de nidificação, com grande concentração de ninhos nas praias.',
        },
        {
          species: 'Podocnemis unifilis (Tracajá)',
          behavior: 'Também desova nas praias durante a seca, mas em menor escala que P. expansa. Preferem áreas com vegetação próxima às margens.',
        },
        {
          species: 'Podocnemis sextuberculata (Iaçá)',
          behavior: 'Aproveitam as praias expostas para desovar. São mais discretas e escolhem locais com maior cobertura vegetal.',
        },
      ],
      importance: 'A seca é o período crítico para reprodução das tartarugas. As praias expostas são essenciais para a desova, e a proteção destes locais é fundamental para a conservação das espécies.',
    },
    chuva: {
      title: 'Época das Chuvas',
      icon: CloudRain,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-900/30 to-blue-900/30',
      borderColor: 'border-cyan-500/50',
      content: [
        {
          species: 'Podocnemis expansa (Tartaruga-da-Amazônia)',
          behavior: 'Os filhotes eclodem e rapidamente se deslocam para a água. Permanecem em áreas de várzea inundada, alimentando-se de vegetação aquática abundante.',
        },
        {
          species: 'Podocnemis unifilis (Tracajá)',
          behavior: 'Utilizam as áreas alagadas para alimentação. Jovens e adultos dispersam-se pelos lagos e igarapés em busca de alimento e abrigo.',
        },
        {
          species: 'Podocnemis sextuberculata (Iaçá)',
          behavior: 'Exploram ativamente as várzeas inundadas. São excelentes nadadoras e aproveitam a abundância de recursos alimentares disponíveis.',
        },
      ],
      importance: 'Durante as chuvas, o nível do rio sobe drasticamente, inundando as florestas de várzea. Este período oferece abundância de alimento e novos habitats para as tartarugas crescerem.',
    },
  };

  const data = phaseData[phase];
  const Icon = data.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-gradient-to-b ${data.bgGradient} rounded-2xl shadow-2xl border-2 ${data.borderColor} max-w-3xl w-full max-h-[85vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-sm px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 ${data.color}`} />
            <h2 className="text-2xl font-bold text-white">{data.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Species Behaviors */}
          <div className="space-y-4 mb-6">
            {data.content.map((item, index) => (
              <div 
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <h3 className="text-lg font-bold text-emerald-300 mb-2 flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  {item.species}
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  {item.behavior}
                </p>
              </div>
            ))}
          </div>

          {/* Importance */}
          <div className="bg-amber-900/30 border-2 border-amber-500/50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-amber-300 mb-2">
              💡 Importância Ecológica
            </h3>
            <p className="text-amber-100 leading-relaxed">
              {data.importance}
            </p>
          </div>

          {/* Close button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
