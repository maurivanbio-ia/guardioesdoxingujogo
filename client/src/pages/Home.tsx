import { useState, lazy, Suspense } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Gamepad2, ArrowRight, Loader2 } from 'lucide-react';

const GameScene = lazy(() => import('@/components/game/GameScene').then(m => ({ default: m.GameScene })));
const GameUI = lazy(() => import('@/components/game/GameUI').then(m => ({ default: m.GameUI })));

function ModernLoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: 'url(/xingu-river-drone.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="text-center max-w-lg px-8 relative z-10">
        <h1 className="text-5xl font-black text-white mb-3 drop-shadow-2xl">
          Guardião do <span className="text-amber-400">Xingu</span>
        </h1>
        <p className="text-amber-200 text-xl italic mb-8 font-light">Preparando o rio...</p>
        <div className="relative w-full h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-green-500/30">
          <div
            className="absolute inset-0 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 animate-pulse"
            style={{ width: '100%', animation: 'shimmer 2s ease-in-out infinite' }}
          />
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-green-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Carregando ambiente 3D...</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { gameState, startGame } = useGame();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      startGame();
    }, 2500);
  };

  if (isLoading) return <ModernLoadingScreen />;

  if (gameState.gameStarted) {
    return (
      <Suspense fallback={<ModernLoadingScreen />}>
        <div className="w-full h-screen relative">
          <GameScene />
          <GameUI />
        </div>
      </Suspense>
    );
  }

  return (
    <div
      className="w-full min-h-screen relative overflow-y-auto flex items-center justify-center"
      style={{
        backgroundImage: 'url(/xingu-river-drone.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />


      <div className="relative z-10 text-center max-w-6xl px-8 py-12 pb-48">
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
            Guardião do <span className="text-amber-400">Xingu</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <p className="text-2xl md:text-3xl text-amber-300 italic font-light drop-shadow-lg">
              A Jornada do Biólogo de Campo
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
        </div>

        <div className="mb-10 max-w-3xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border-2 border-white/30 rounded-2xl p-8 shadow-2xl">
            <p className="text-white text-xl md:text-2xl leading-relaxed font-medium">
              Mergulhe nas praias do <span className="text-amber-300 font-bold">rio Xingu</span> e viva a experiência
              de um biólogo conservacionista durante a temporada de reprodução das{' '}
              <span className="text-green-300 font-bold">tartarugas amazônicas</span>.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="group relative z-40 px-12 md:px-16 py-5 md:py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-black text-2xl md:text-3xl rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-green-500/50 border-4 border-white/50 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3 md:gap-4">
            <Gamepad2 className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
            INICIAR JORNADA
            <ArrowRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
          </span>
        </button>

        <div className="mt-10 text-white/80 text-base max-w-2xl mx-auto">
          <p className="italic text-amber-300 font-medium">
            <span className="font-bold">Podocnemis expansa</span> • <span className="font-bold">Podocnemis unifilis</span> •{' '}
            <span className="font-bold">Podocnemis sextuberculata</span>
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent py-6 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 backdrop-blur-md bg-emerald-900/40 px-6 py-3 rounded-xl border-2 border-green-400/70 shadow-2xl">
              <img src="/ecobrasil-logo.png" alt="EcoBrasil" className="h-11 md:h-12 drop-shadow-2xl" />
              <div className="h-10 w-px bg-green-300/60" />
              <div className="text-left">
                <p className="text-green-200 text-xs md:text-sm font-semibold">Desenvolvido por</p>
                <p className="text-white text-sm md:text-base font-bold">Maurivan Vaz Ribeiro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
