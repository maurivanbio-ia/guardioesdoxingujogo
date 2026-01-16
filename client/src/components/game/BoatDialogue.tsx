import { useState, useEffect } from 'react';

interface BoatDialogueProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DialogueLine {
  speaker: 'Biólogo' | 'Coletor';
  text: string;
}

const dialogue: DialogueLine[] = [
  {
    speaker: 'Coletor',
    text: 'Doutor, minha família sempre coletou ovos aqui. Por que agora não pode mais?'
  },
  {
    speaker: 'Biólogo',
    text: 'A coleta intensiva está levando as espécies à extinção. Hoje é PROIBIDO por lei federal.'
  },
  {
    speaker: 'Coletor',
    text: 'Mas pegar só alguns ovos não faz diferença, né?'
  },
  {
    speaker: 'Biólogo',
    text: 'Faz sim! De cada 100 ovos, apenas 2 ou 3 filhotes chegam à vida adulta. Cada ovo conta.'
  },
  {
    speaker: 'Coletor',
    text: 'E as tartarugas adultas? Pode pegar poucas?'
  },
  {
    speaker: 'Biólogo',
    text: 'Também é PROIBIDO! Uma fêmea leva 8 anos para se reproduzir. Matar uma é perder décadas.'
  },
  {
    speaker: 'Coletor',
    text: 'Então como vou alimentar minha família?'
  },
  {
    speaker: 'Biólogo',
    text: 'Há alternativas! Ecoturismo e projetos que pagam para proteger ninhos. Ganhe ajudando, não destruindo.'
  },
  {
    speaker: 'Coletor',
    text: 'Como funciona se eu ajudar a proteger?'
  },
  {
    speaker: 'Biólogo',
    text: 'Seja um guardião! Monitore, avise sobre predadores, ajude na pesquisa. Sua família se beneficia E as tartarugas sobrevivem.'
  }
];

export function BoatDialogue({ isOpen, onClose }: BoatDialogueProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCurrentLine(0);
      setIsVisible(true);
      return;
    }

    // Mostrar balão
    setIsVisible(true);
    
    // Timer para esconder e avançar após 8 segundos
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);
    
    // Timer para avançar para próximo diálogo
    const nextTimer = setTimeout(() => {
      if (currentLine < dialogue.length - 1) {
        setCurrentLine(prev => prev + 1);
      } else {
        onClose();
      }
    }, 8500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [currentLine, isOpen, onClose]);

  // Handler para tecla espaço - avança diálogo
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsVisible(false);
        
        setTimeout(() => {
          if (currentLine < dialogue.length - 1) {
            setCurrentLine(prev => prev + 1);
          } else {
            onClose();
          }
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentLine, onClose]);

  if (!isOpen || currentLine >= dialogue.length) return null;

  const currentDialogue = dialogue[currentLine];
  const isBiologo = currentDialogue.speaker === 'Biólogo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
      {/* Balão de diálogo */}
      <div 
        className={`relative z-10 max-w-2xl w-full pointer-events-auto transition-all duration-500 ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-8 scale-95'
        }`}
      >
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-black p-6 rounded-2xl border-4 border-emerald-600/60 shadow-2xl">
          {/* Speaker info */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
              isBiologo 
                ? 'bg-gradient-to-br from-green-500 to-green-700 border-4 border-green-400' 
                : 'bg-gradient-to-br from-amber-600 to-orange-700 border-4 border-amber-500'
            }`}>
              <span className="text-4xl">{isBiologo ? '🧑‍🔬' : '👨‍🌾'}</span>
            </div>
            <div className="flex-1">
              <p className={`font-bold text-xl ${
                isBiologo ? 'text-green-300' : 'text-amber-300'
              }`}>
                {currentDialogue.speaker}
              </p>
              <p className="text-gray-400 text-sm">
                {isBiologo ? 'Biólogo de Conservação' : 'Morador Ribeirinho'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">
                {currentLine + 1} de {dialogue.length}
              </p>
            </div>
          </div>

          {/* Dialogue text */}
          <div className="bg-white/10 rounded-xl p-5 mb-4 border-2 border-white/20 backdrop-blur-sm">
            <p className="text-white leading-relaxed text-lg">
              "{currentDialogue.text}"
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mb-3">
            {dialogue.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentLine 
                    ? 'w-8 bg-emerald-400 shadow-lg shadow-emerald-500/50' 
                    : idx < currentLine 
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Indicador barra de espaço */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Pressione <span className="text-emerald-400 font-bold">ESPAÇO</span> para avançar
            </p>
          </div>
        </div>

        {/* Seta apontando para baixo */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-teal-900 border-b-4 border-r-4 border-emerald-600/60 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
