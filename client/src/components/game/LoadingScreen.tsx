import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-teal-900 via-green-900 to-amber-900 flex items-center justify-center z-50">
      <div className="text-center max-w-md px-6">
        {/* Logo animado */}
        <div className="mb-8 animate-pulse">
          <div className="text-8xl mb-4">🐢</div>
          <h1 className="text-4xl font-bold text-amber-400 mb-2">
            Guardião do Xingu
          </h1>
          <p className="text-amber-200 text-lg italic">
            Carregando o rio...
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="w-full bg-gray-800/50 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 via-green-500 to-amber-500 h-4 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-gray-300 text-sm">
          {progress < 30 && 'Preparando as praias...'}
          {progress >= 30 && progress < 60 && 'Chamando as tartarugas...'}
          {progress >= 60 && progress < 90 && 'Montando o acampamento...'}
          {progress >= 90 && 'Quase pronto!'}
        </p>
      </div>
    </div>
  );
}

