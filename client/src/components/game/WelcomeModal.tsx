import { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  onComplete: () => void;
}

const DR_ADRIANA_MESSAGES = [
  'Bem-vindo ao Guardião do Xingu! Você está prestes a mergulhar na experiência de um biólogo de campo, protegendo tartarugas amazônicas durante a temporada reprodutiva no Rio Xingu, Brasil.',
  'Este jogo educativo apresenta o trabalho de conservação de quelônios amazônicos, que protege espécies ameaçadas de extinção através de metodologia científica rigorosa.',
  'Você aprenderá protocolos científicos reais, tomará decisões éticas, e descobrirá como cada pequena ação contribui para a conservação da biodiversidade amazônica. Prepare-se para esta jornada emocionante!'
];

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const progressPercent = ((currentMessage + 1) / DR_ADRIANA_MESSAGES.length) * 100;
  const isLastMessage = currentMessage === DR_ADRIANA_MESSAGES.length - 1;

  const handleNext = () => {
    if (currentMessage < DR_ADRIANA_MESSAGES.length - 1) {
      setCurrentMessage((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pointer-events-auto overflow-y-auto p-2 md:p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${['#fbbf24', '#22c55e', '#3b82f6'][i % 3]}, transparent)`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-5xl mx-2 md:mx-8 animate-in fade-in zoom-in duration-700">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 rounded-3xl blur-3xl opacity-40 animate-pulse" />
        <div className="relative rounded-2xl md:rounded-3xl shadow-2xl border-2 border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/xingu-river-drone.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm" />

          <div className="relative">
            <div className="relative bg-gradient-to-r from-amber-900/20 via-emerald-900/20 to-blue-900/20 border-b-2 border-white/10 p-4 md:p-10">
              <div className="flex flex-col items-center gap-3 md:gap-6">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-br from-amber-400 via-emerald-400 to-blue-400 rounded-xl md:rounded-2xl blur-xl md:blur-2xl opacity-40 animate-pulse" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-white/20 shadow-2xl">
                    <img src="/ecobrasil-logo.png" alt="EcoBrasil" className="h-12 md:h-24 w-auto drop-shadow-xl" />
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2 md:mb-3 drop-shadow-lg">
                    Bem-vindo ao Projeto
                  </h1>
                  <p className="text-white/80 text-sm md:text-2xl flex items-center justify-center gap-1 md:gap-2">
                    <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-emerald-400" />
                    <span className="hidden md:inline">Conservação de Quelônios do Xingu</span>
                    <span className="md:hidden">Quelônios do Xingu</span>
                  </p>
                </div>
              </div>

            </div>

            <div className="px-4 md:px-12 py-6 md:py-16">
              <div className="min-h-[120px] md:min-h-[180px] flex flex-col items-center justify-center gap-4 md:gap-6">
                <p className="text-white text-base md:text-3xl leading-relaxed text-center max-w-3xl font-light animate-in fade-in slide-in-from-bottom duration-500">
                  {DR_ADRIANA_MESSAGES[currentMessage]}
                </p>
              </div>

              <div className="mt-6 md:mt-12 flex justify-center gap-2 md:gap-3">
                {DR_ADRIANA_MESSAGES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
                      idx === currentMessage
                        ? 'w-12 md:w-16 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 shadow-lg'
                        : idx < currentMessage
                        ? 'w-2 md:w-3 bg-emerald-500/80'
                        : 'w-2 md:w-3 bg-slate-700/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-950/60 border-t-2 border-white/10 px-4 md:px-10 py-4 md:py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                  <div className="flex-1 md:w-48 h-2 md:h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 transition-all duration-500 shadow-lg"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm md:text-lg font-semibold whitespace-nowrap">
                    {currentMessage + 1} / {DR_ADRIANA_MESSAGES.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="group relative bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 hover:from-amber-600 hover:via-emerald-600 hover:to-blue-600 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center min-h-[48px]"
                >
                  <span>{isLastMessage ? 'Iniciar Jornada' : 'Continuar'}</span>
                  {isLastMessage ? (
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                  ) : (
                    <ChevronRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/30 via-blue-900/10 to-transparent pointer-events-none" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
      `}</style>
    </div>
  );
}
