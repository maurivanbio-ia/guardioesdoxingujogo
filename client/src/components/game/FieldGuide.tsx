import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { X, Book, Lock, CheckCircle, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FieldGuideProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedSpecies: ('expansa' | 'unifilis' | 'sextuberculata')[];
}

interface SpeciesData {
  id: 'expansa' | 'unifilis' | 'sextuberculata';
  scientificName: string;
  commonName: string;
  icon: string;
  weight: string;
  length: string;
  habitat: string;
  diet: string;
  reproduction: string;
  threats: string[];
  conservation: string;
  funFacts: string[];
  population: string;
  lifespan: string;
}

const SPECIES_DATABASE: SpeciesData[] = [
  {
    id: 'expansa',
    scientificName: 'Podocnemis expansa',
    commonName: 'Tartaruga-da-Amazônia',
    icon: '🐢',
    weight: '15-50 kg (fêmeas podem ultrapassar 90 kg)',
    length: '60-100 cm de carapaça',
    habitat: 'Rios e lagos da bacia amazônica, preferindo águas calmas e praias arenosas para desova',
    diet: 'Herbívora: algas, plantas aquáticas, frutas caídas na água',
    reproduction: 'Fêmeas desovam 60-150 ovos em ninhos profundos (40-60 cm). Incubação: 45-60 dias',
    threats: [
      'Caça ilegal de adultos e coleta de ovos',
      'Perda de habitat por desmatamento',
      'Poluição de rios e mercúrio',
      'Mudanças climáticas afetando temperatura dos ninhos'
    ],
    conservation: 'Vulnerável (IUCN). Projetos de proteção aumentaram população em 300% em algumas áreas.',
    funFacts: [
      'É a maior tartaruga de água doce da América do Sul',
      'Pode viver mais de 100 anos',
      'Migra centenas de quilômetros para desovar nas mesmas praias',
      'Temperatura do ninho define sexo: >33°C = fêmeas'
    ],
    population: '~50.000 fêmeas reprodutoras no Rio Xingu',
    lifespan: '80-100 anos'
  },
  {
    id: 'unifilis',
    scientificName: 'Podocnemis unifilis',
    commonName: 'Tracajá',
    icon: '🐢',
    weight: '3-12 kg',
    length: '30-50 cm de carapaça',
    habitat: 'Tributários menores, lagos e florestas alagadas da Amazônia e Orinoco',
    diet: 'Onívora: plantas aquáticas, frutas, pequenos invertebrados e peixes',
    reproduction: 'Desova 2x/ano: 4-35 ovos por ninho. Incubação: 55-159 dias conforme região',
    threats: [
      'Consumo humano intensivo de carne e ovos',
      'Perda de habitat ripário',
      'Captura acidental em redes de pesca',
      'Poluição e tráfego de barcos'
    ],
    conservation: 'Vulnerável (IUCN). Criação em cativeiro reduz pressão sobre populações selvagens.',
    funFacts: [
      'Possui manchas amarelas características na cabeça',
      'Fêmeas são 2x maiores que machos',
      'Importante dispersora de sementes',
      'Pode ficar submersa por horas'
    ],
    population: '~120.000 indivíduos na bacia amazônica',
    lifespan: '50-70 anos'
  },
  {
    id: 'sextuberculata',
    scientificName: 'Podocnemis sextuberculata',
    commonName: 'Iaçá',
    icon: '🐢',
    weight: '1-4 kg',
    length: '20-34 cm de carapaça',
    habitat: 'Pequenos igarapés, lagos e áreas alagadas da floresta amazônica',
    diet: 'Onívora: folhas, frutas, insetos aquáticos e pequenos crustáceos',
    reproduction: 'Desova: 8-24 ovos. Incubação: 48-64 dias. Eclode antes da estação chuvosa',
    threats: [
      'Coleta intensiva de fêmeas e ovos para consumo',
      'Destruição de habitat por mineração',
      'Vulnerável a predadores (alta mortalidade)',
      'Mudanças no regime hídrico'
    ],
    conservation: 'Vulnerável (IUCN). Menor espécie do gênero, mais suscetível a extinção local.',
    funFacts: [
      'Nome vem dos 6 tubérculos no plastrão juvenil',
      'Menor tartaruga do gênero Podocnemis',
      'Espécie indicadora de saúde do ecossistema',
      'Tamanho da fêmea correlaciona com número de ovos'
    ],
    population: '~30.000 indivíduos (estimativa, dados limitados)',
    lifespan: '30-50 anos'
  }
];

export function FieldGuide({ isOpen, onClose, unlockedSpecies }: FieldGuideProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesData | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <Card className="bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 border-2 border-emerald-500/50 shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4">
              <Book className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Guia de Campo - Quelônios do Xingu
                </h1>
                <p className="text-emerald-100 mt-1">
                  Enciclopédia de Conservação Científica
                </p>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(90vh-140px)]">
            {/* Species List */}
            <div className="w-80 bg-slate-800/50 p-4 overflow-y-auto border-r border-emerald-500/30">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">
                Espécies Documentadas
              </h3>
              
              <div className="space-y-3">
                {SPECIES_DATABASE.map((species) => {
                  const isUnlocked = unlockedSpecies.includes(species.id);
                  
                  return (
                    <motion.button
                      key={species.id}
                      onClick={() => isUnlocked && setSelectedSpecies(species)}
                      disabled={!isUnlocked}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-emerald-500/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20'
                          : 'bg-slate-800/30 border-gray-700 cursor-not-allowed opacity-50'
                      } ${selectedSpecies?.id === species.id ? 'ring-2 ring-emerald-400' : ''}`}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={isUnlocked ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">
                          {isUnlocked ? species.icon : '🔒'}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white">
                            {isUnlocked ? species.commonName : '???'}
                          </div>
                          <div className="text-xs text-gray-400 italic">
                            {isUnlocked ? species.scientificName : 'Bloqueado'}
                          </div>
                        </div>
                        {isUnlocked ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/30">
                <Info className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-xs text-gray-300">
                  Desbloqueie espécies interagindo com ninhos e tartarugas no campo!
                </p>
              </div>
            </div>

            {/* Species Details */}
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedSpecies ? (
                <motion.div
                  key={selectedSpecies.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Title */}
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selectedSpecies.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {selectedSpecies.commonName}
                      </h2>
                      <p className="text-xl text-emerald-400 italic">
                        {selectedSpecies.scientificName}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
                      <div className="text-xs text-gray-400 uppercase mb-1">Peso</div>
                      <div className="text-white font-semibold">{selectedSpecies.weight}</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
                      <div className="text-xs text-gray-400 uppercase mb-1">Comprimento</div>
                      <div className="text-white font-semibold">{selectedSpecies.length}</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
                      <div className="text-xs text-gray-400 uppercase mb-1">Longevidade</div>
                      <div className="text-white font-semibold">{selectedSpecies.lifespan}</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
                      <div className="text-xs text-gray-400 uppercase mb-1">População</div>
                      <div className="text-white font-semibold">{selectedSpecies.population}</div>
                    </div>
                  </div>

                  {/* Habitat */}
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                      🌊 Habitat
                    </h3>
                    <p className="text-gray-300">{selectedSpecies.habitat}</p>
                  </div>

                  {/* Diet */}
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                      🍃 Alimentação
                    </h3>
                    <p className="text-gray-300">{selectedSpecies.diet}</p>
                  </div>

                  {/* Reproduction */}
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                      🥚 Reprodução
                    </h3>
                    <p className="text-gray-300">{selectedSpecies.reproduction}</p>
                  </div>

                  {/* Threats */}
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Ameaças
                    </h3>
                    <ul className="space-y-2">
                      {selectedSpecies.threats.map((threat, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conservation */}
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Conservação
                    </h3>
                    <p className="text-gray-300">{selectedSpecies.conservation}</p>
                  </div>

                  {/* Fun Facts */}
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
                      ✨ Curiosidades Científicas
                    </h3>
                    <div className="space-y-2">
                      {selectedSpecies.funFacts.map((fact, i) => (
                        <div key={i} className="flex items-start gap-2 bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/30">
                          <span className="text-yellow-400">💡</span>
                          <span className="text-gray-300">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma espécie para ver detalhes científicos</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
