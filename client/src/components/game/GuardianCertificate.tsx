import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Share2, Home, X, Award } from 'lucide-react';
import html2canvas from 'html2canvas';

interface GuardianCertificateProps {
  isOpen: boolean;
  totalPoints: number;
  onClose: () => void;
  onRestart: () => void;
}

export function GuardianCertificate({
  isOpen,
  totalPoints,
  onClose,
  onRestart,
}: GuardianCertificateProps) {
  const [playerName, setPlayerName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleGenerateCertificate = () => {
    if (playerName.trim()) {
      setShowCertificate(true);
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `certificado-guardiao-xingu-${playerName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
    }
  };

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      {!showCertificate ? (
        <Card className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900 border-2 border-emerald-500/50 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-br from-amber-600 to-yellow-700 p-4 rounded-2xl mb-4">
                <span className="text-6xl">🏆</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">
                Missão Completa!
              </h2>
              <p className="text-emerald-300 text-lg">
                Você conquistou {totalPoints} pontos ambientais
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 rounded-xl p-6 mb-6">
              <p className="text-white text-center leading-relaxed mb-4">
                Você completou todas as fases do projeto de conservação e será reconhecido oficialmente como
              </p>
              <p className="text-center">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400">
                  Guardião Ambiental do Xingu
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2 flex items-center gap-2">
                  <span className="text-amber-400">✍️</span>
                  Digite seu nome completo para emitir o certificado:
                </label>
                <Input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ex: Maria da Silva Santos"
                  className="bg-white/10 border-emerald-500/50 text-white placeholder:text-gray-400 text-lg"
                  maxLength={50}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2">
                  Este nome aparecerá no seu certificado oficial
                </p>
              </div>

              <Button
                onClick={handleGenerateCertificate}
                disabled={!playerName.trim()}
                className="w-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700 text-white font-bold text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Award className="w-6 h-6 mr-2" />
                Emitir Certificado Oficial
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 sm:p-12 rounded-3xl shadow-2xl border-4 sm:border-8 border-double border-amber-600"
            style={{
              backgroundImage: 'url(/xingu-river-drone.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
            }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-10 border-2 sm:border-4 border-amber-500">
              <div className="text-center space-y-6">
                <div className="flex justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
                  {/* EcoBrasil Logo */}
                  <img 
                    src="/ecobrasil-logo.png" 
                    alt="EcoBrasil - Conservação e Educação" 
                    className="h-12 sm:h-16 w-auto object-contain rounded-lg shadow-md"
                  />
                  
                </div>

                <div className="border-b-2 sm:border-b-4 border-emerald-600 pb-3 sm:pb-4 mb-4 sm:mb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-green-600 mb-2">
                    CERTIFICADO
                  </h1>
                  <p className="text-xl sm:text-2xl text-amber-700 font-bold">
                    Guardião Ambiental do Xingu
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4 text-gray-800">
                  <p className="text-base sm:text-xl leading-relaxed">
                    Certificamos que
                  </p>
                  <p className="text-2xl sm:text-4xl font-black text-emerald-700 border-b-2 border-emerald-400 pb-2">
                    {playerName}
                  </p>
                  <p className="text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
                    concluiu com excelência o programa educativo de conservação de quelônios
                    amazônicos, demonstrando compromisso com a preservação ambiental e
                    conhecimento científico sobre conservação de quelônios amazônicos no Rio Xingu.
                  </p>
                </div>

                <div className="flex justify-center items-center gap-8 my-8">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-amber-400">
                      <span className="text-6xl">🐢</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 font-bold">Espécies Protegidas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-emerald-100 border-4 border-emerald-600 rounded-xl p-4">
                      <p className="text-5xl font-black text-emerald-700">{totalPoints}</p>
                      <p className="text-sm text-gray-600 font-bold">Pontos Ambientais</p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2 border-t-2 border-gray-300 pt-6">
                  <p className="text-gray-600">
                    <span className="font-bold">Data de Emissão:</span> {currentDate}
                  </p>
                  <p className="text-gray-600 italic text-sm">
                    Projeto de Conservação de Quelônios - Rio Xingu, Brasil
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <p className="text-xs text-gray-500 italic">Podocnemis expansa</p>
                    <p className="text-xs text-gray-500">•</p>
                    <p className="text-xs text-gray-500 italic">Podocnemis unifilis</p>
                    <p className="text-xs text-gray-500">•</p>
                    <p className="text-xs text-gray-500 italic">Podocnemis sextuberculata</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg py-6 shadow-xl"
            >
              <Download className="w-6 h-6 mr-2" />
              Baixar Certificado (PNG)
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              className="flex-1 border-2 border-emerald-500/50 text-white hover:bg-emerald-600/20 font-bold text-lg py-6"
            >
              <Home className="w-6 h-6 mr-2" />
              Voltar ao Menu
            </Button>
          </div>
          
        </div>
      )}
    </div>
  );
}
