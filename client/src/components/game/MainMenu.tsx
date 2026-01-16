import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';

export function MainMenu() {
  const { startGame } = useGame();
  const [showModal, setShowModal] = useState<'howto' | 'about' | 'settings' | null>(null);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-900 via-green-800 to-teal-900 flex items-center justify-center relative overflow-hidden">
      {/* Logo Ecobrasil no canto superior */}
      <div className="absolute top-6 left-6 z-10">
        <img 
          src="/ecobrasil-logo.png" 
          alt="Ecobrasil" 
          className="h-16 opacity-90"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="text-center max-w-5xl px-6 z-10">
        {/* Título */}
        <div className="mb-8">
          <div className="text-7xl mb-4">🐢</div>
          <h1 className="text-6xl font-bold text-green-400 mb-3 drop-shadow-lg">
            Guardião do Xingu
          </h1>
          <p className="text-3xl text-yellow-400 italic font-light drop-shadow-md">
            A Jornada do Biólogo de Campo
          </p>
        </div>

        {/* Descrição */}
        <Card className="bg-gray-900/80 border-green-600/50 backdrop-blur-sm p-8 mb-8">
          <p className="text-gray-200 text-lg leading-relaxed">
            Mergulhe nas praias douradas do rio Xingu e viva a experiência de um biólogo conservacionista 
            durante a temporada de reprodução das tartarugas amazônicas. Realize atividades científicas 
            de monitoramento, marcação e manejo de ninhos, enquanto aprende sobre a importância da 
            conservação dos quelônios amazônicos.
          </p>
        </Card>

        {/* Cards de features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-amber-900/70 to-amber-800/50 border-amber-600/50 backdrop-blur-sm p-6 hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">🔬</div>
            <h3 className="text-xl font-bold text-amber-400 mb-2">Conservação Real</h3>
            <p className="text-gray-300 text-sm">
              Baseado em protocolos científicos autênticos
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-teal-900/70 to-teal-800/50 border-teal-600/50 backdrop-blur-sm p-6 hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">🌅</div>
            <h3 className="text-xl font-bold text-teal-400 mb-2">Ambiente Imersivo</h3>
            <p className="text-gray-300 text-sm">
              Ciclo dia/noite e clima dinâmico
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/70 to-blue-800/50 border-blue-600/50 backdrop-blur-sm p-6 hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Dados Científicos</h3>
            <p className="text-gray-300 text-sm">
              Registre e analise medições biométricas
            </p>
          </Card>
        </div>

        {/* Botões principais */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 text-2xl rounded-xl shadow-2xl transform hover:scale-105 transition-all"
          >
            🎮 Iniciar Jornada
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowModal('howto')}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-900/50"
            >
              📖 Como Jogar
            </Button>
            <Button
              onClick={() => setShowModal('about')}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/50"
            >
              🔬 Sobre o Projeto
            </Button>
            <Button
              onClick={() => setShowModal('settings')}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-900/50"
            >
              ⚙️ Configurações
            </Button>
          </div>
        </div>

        {/* Créditos */}
        <p className="text-gray-400 text-sm mt-8">
          Inspirado no trabalho real de conservação de quelônios amazônicos no rio Xingu
          <br />
          <span className="italic text-yellow-500">Podocnemis expansa</span> • <span className="italic text-yellow-500">Podocnemis unifilis</span>
        </p>

        {/* Parceria Ecobrasil */}
        <p className="text-green-400 text-xs mt-4 font-semibold">
          Em parceria com Ecobrasil Consultoria Ambiental
        </p>
      </div>

      {/* Modais */}
      {showModal === 'howto' && (
        <Modal onClose={() => setShowModal(null)} title="Como Jogar">
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-bold text-green-400 mb-2">🎮 Controles</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li><strong>WASD / Setas:</strong> Movimentação</li>
                <li><strong>Shift:</strong> Correr</li>
                <li><strong>E:</strong> Interagir (NPCs, tartarugas, ninhos)</li>
                <li><strong>ESC:</strong> Pausar/Menu</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-400 mb-2">🎯 Objetivos</h4>
              <p className="text-gray-300 text-sm">
                Complete missões científicas, colete dados biométricos, proteja ninhos e aprenda 
                sobre conservação de tartarugas amazônicas através de 6 capítulos narrativos.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-green-400 mb-2">⚖️ Ética e Reputação</h4>
              <p className="text-gray-300 text-sm">
                Suas decisões afetam sua Ética Científica e Reputação na comunidade. 
                Trate os animais com respeito e siga os protocolos adequados.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {showModal === 'about' && (
        <Modal onClose={() => setShowModal(null)} title="Sobre o Projeto">
          <div className="space-y-4 text-left text-gray-300 text-sm">
            <p>
              <strong className="text-green-400">Guardião do Xingu</strong> é um jogo educativo 
              desenvolvido para conscientizar sobre a importância da conservação de quelônios 
              amazônicos, especialmente as espécies <em className="text-yellow-400">Podocnemis expansa</em> (Tartaruga-da-Amazônia) 
              e <em className="text-yellow-400">P. unifilis</em> (Tracajá).
            </p>
            <p>
              O jogo simula o trabalho real de biólogos de campo no rio Xingu, onde programas 
              de monitoramento e conservação são essenciais para a sobrevivência dessas espécies ameaçadas.
            </p>
            <p className="text-green-400 font-semibold">
              Desenvolvido em parceria com Ecobrasil Consultoria Ambiental
            </p>
            <p className="text-xs text-gray-500">
              Tecnologias: React + Three.js + TypeScript
            </p>
          </div>
        </Modal>
      )}

      {showModal === 'settings' && (
        <Modal onClose={() => setShowModal(null)} title="Configurações">
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-bold text-green-400 mb-2">🔊 Áudio</h4>
              <p className="text-gray-400 text-sm">Em desenvolvimento</p>
            </div>
            <div>
              <h4 className="font-bold text-green-400 mb-2">🎨 Gráficos</h4>
              <p className="text-gray-400 text-sm">Qualidade: Alta (padrão)</p>
            </div>
            <div>
              <h4 className="font-bold text-green-400 mb-2">🌐 Idioma</h4>
              <p className="text-gray-400 text-sm">Português (Brasil)</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 pointer-events-auto">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-600 p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-400">{title}</h2>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            ✕
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
