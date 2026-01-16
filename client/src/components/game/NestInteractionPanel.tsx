import { useState } from 'react';
import { MapPin, Ruler, Thermometer, Camera, X } from 'lucide-react';

interface NestData {
  id: string;
  number: number;
  position: { x: number; y: number; z: number };
  species: 'expansa' | 'unifilis' | 'sextuberculata';
  marked: boolean;
  gpsCoordinates?: string;
  temperature?: number;
  depth?: number;
}

interface NestInteractionPanelProps {
  nest: NestData;
  onClose: () => void;
  onMark: (nestId: string, data: Partial<NestData>) => void;
}

export function NestInteractionPanel({ nest, onClose, onMark }: NestInteractionPanelProps) {
  const [gpsActive, setGpsActive] = useState(false);
  const [tempReading, setTempReading] = useState<number | null>(null);
  const [depth, setDepth] = useState<number | null>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const species = {
    expansa: { name: 'Podocnemis expansa', color: '#10B981', emoji: '🐢' },
    unifilis: { name: 'Podocnemis unifilis', color: '#F59E0B', emoji: '🐢' },
    sextuberculata: { name: 'Podocnemis sextuberculata', color: '#3B82F6', emoji: '🐢' }
  }[nest.species];

  const handleGPS = () => {
    setGpsActive(true);
    // Simula coordenadas GPS
    const lat = (-3.5 + Math.random() * 0.01).toFixed(6);
    const lon = (-52.0 + Math.random() * 0.01).toFixed(6);
    setTimeout(() => {
      onMark(nest.id, { gpsCoordinates: `${lat}, ${lon}` });
    }, 1500);
  };

  const handleTemperature = () => {
    // Simula leitura de temperatura
    const temp = 29 + Math.random() * 7; // 29-36°C
    setTempReading(temp);
    onMark(nest.id, { temperature: temp });
  };

  const handleDepth = () => {
    // Simula medição de profundidade
    const d = 30 + Math.random() * 20; // 30-50 cm
    setDepth(d);
    onMark(nest.id, { depth: d });
  };

  const handlePhoto = () => {
    setPhotoTaken(true);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
  };

  const handleFinishMarking = () => {
    if (gpsActive && tempReading && depth && photoTaken) {
      onMark(nest.id, { marked: true });
      onClose();
    }
  };

  const progress = [gpsActive, tempReading, depth, photoTaken].filter(Boolean).length;
  const isComplete = gpsActive && tempReading && depth && photoTaken;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-amber-500/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-b border-amber-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{species.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Ninho #{nest.number}
                  {nest.marked && <span className="text-green-400 text-sm">✓ Marcado</span>}
                </h2>
                <p className="text-amber-200/70 text-sm">{species.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Progresso da marcação</span>
              <span className="text-amber-400 font-bold text-sm">{progress}/4 concluído</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                style={{ width: `${(progress / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content - Actions Grid */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {/* GPS */}
            <button
              onClick={handleGPS}
              disabled={gpsActive}
              className={`p-6 rounded-xl border-2 transition-all ${
                gpsActive
                  ? 'bg-green-500/20 border-green-500 cursor-not-allowed'
                  : 'bg-slate-800/50 border-slate-700 hover:border-amber-500 hover:bg-slate-700/50'
              }`}
            >
              <MapPin className={`w-8 h-8 mb-3 ${gpsActive ? 'text-green-400' : 'text-amber-400'}`} />
              <h3 className="text-white font-bold mb-1">GPS</h3>
              <p className="text-white/60 text-sm">
                {gpsActive ? nest.gpsCoordinates : 'Marcar coordenadas'}
              </p>
            </button>

            {/* Temperature */}
            <button
              onClick={handleTemperature}
              disabled={!!tempReading}
              className={`p-6 rounded-xl border-2 transition-all ${
                tempReading
                  ? 'bg-green-500/20 border-green-500 cursor-not-allowed'
                  : 'bg-slate-800/50 border-slate-700 hover:border-orange-500 hover:bg-slate-700/50'
              }`}
            >
              <Thermometer className={`w-8 h-8 mb-3 ${tempReading ? 'text-green-400' : 'text-orange-400'}`} />
              <h3 className="text-white font-bold mb-1">Temperatura</h3>
              <p className="text-white/60 text-sm">
                {tempReading ? `${tempReading.toFixed(1)}°C` : 'Medir temperatura'}
              </p>
            </button>

            {/* Depth */}
            <button
              onClick={handleDepth}
              disabled={!!depth}
              className={`p-6 rounded-xl border-2 transition-all ${
                depth
                  ? 'bg-green-500/20 border-green-500 cursor-not-allowed'
                  : 'bg-slate-800/50 border-slate-700 hover:border-blue-500 hover:bg-slate-700/50'
              }`}
            >
              <Ruler className={`w-8 h-8 mb-3 ${depth ? 'text-green-400' : 'text-blue-400'}`} />
              <h3 className="text-white font-bold mb-1">Profundidade</h3>
              <p className="text-white/60 text-sm">
                {depth ? `${depth.toFixed(1)} cm` : 'Medir profundidade'}
              </p>
            </button>

            {/* Photo */}
            <button
              onClick={handlePhoto}
              disabled={photoTaken}
              className={`p-6 rounded-xl border-2 transition-all ${
                photoTaken
                  ? 'bg-green-500/20 border-green-500 cursor-not-allowed'
                  : 'bg-slate-800/50 border-slate-700 hover:border-purple-500 hover:bg-slate-700/50'
              }`}
            >
              <Camera className={`w-8 h-8 mb-3 ${photoTaken ? 'text-green-400' : 'text-purple-400'}`} />
              <h3 className="text-white font-bold mb-1">Fotografia</h3>
              <p className="text-white/60 text-sm">
                {photoTaken ? 'Foto registrada!' : 'Fotografar ninho'}
              </p>
            </button>
          </div>

          {/* Educational info */}
          {tempReading && tempReading > 33 && (
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌡️</span>
                <div>
                  <h4 className="text-orange-400 font-bold mb-1">Temperatura Elevada</h4>
                  <p className="text-white/70 text-sm">
                    Temperaturas acima de 33°C tendem a gerar mais fêmeas. A determinação do sexo em quelônios é dependente da temperatura de incubação.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 border-t border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              {isComplete ? '✓ Todos os dados coletados (4/4)' : '⚠️ Complete todas as 4 etapas para marcar o ninho'}
            </div>
            <button
              onClick={handleFinishMarking}
              disabled={!isComplete}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                isComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              ✓ Finalizar Marcação
            </button>
          </div>
        </div>
      </div>

      {/* Flash effect when taking photo */}
      {showFlash && (
        <div className="fixed inset-0 bg-white pointer-events-none z-[60] animate-in fade-out duration-300" />
      )}
    </div>
  );
}
