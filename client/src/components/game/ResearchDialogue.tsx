import { useState, useEffect } from 'react';

interface ResearchDialogueProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DialogueLine {
  speaker: 'Lucas' | 'Adriana';
  text: string;
}

const dialogue: DialogueLine[] = [
  {
    speaker: 'Lucas',
    text: 'Incrível, não é? Essas fêmeas de Podocnemis expansa voltam exatamente à mesma praia onde nasceram… às vezes, depois de mais de 20 anos!'
  },
  {
    speaker: 'Adriana',
    text: 'Sim, chamamos isso de fidelidade ao sítio de desova. Elas têm uma memória espacial impressionante — provavelmente orientadas por campos magnéticos e correntes do rio.'
  },
  {
    speaker: 'Lucas',
    text: 'E pensar que cada uma pode botar mais de cem ovos num único ninho… É muita energia investida.'
  },
  {
    speaker: 'Adriana',
    text: 'É verdade. Mas só uma pequena fração dos filhotes chega à fase adulta — urubus, peixes e jacarés fazem a seleção natural logo nas primeiras horas.'
  },
  {
    speaker: 'Lucas',
    text: 'Falando em urubus, você sabia que aqui no Tabuleiro do Embaubal eles são os principais predadores de filhotes?'
  },
  {
    speaker: 'Adriana',
    text: 'Sabia, sim. E por isso as ações de manejo, como espantá-los no momento da eclosão, fazem toda a diferença. Cada filhote salvo ajuda a manter o equilíbrio dessa população.'
  },
  {
    speaker: 'Lucas',
    text: 'É fascinante… quanto mais estudamos, mais percebemos que cada detalhe — da temperatura da areia ao comportamento dos predadores — influencia o futuro da espécie.'
  },
  {
    speaker: 'Adriana',
    text: 'Exatamente. Proteger as tartarugas é proteger todo o ecossistema que depende delas.'
  }
];

export function ResearchDialogue({ isOpen, onClose }: ResearchDialogueProps) {
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
    
    // Timer para esconder e avançar após 5 segundos
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    // Timer para avançar para próximo diálogo
    const nextTimer = setTimeout(() => {
      if (currentLine < dialogue.length - 1) {
        setCurrentLine(prev => prev + 1);
      } else {
        onClose();
      }
    }, 5500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [currentLine, isOpen, onClose]);

  // Handler para tecla espaço
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
  const isLucas = currentDialogue.speaker === 'Lucas';

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
        <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-black p-6 rounded-2xl border-4 border-amber-600/60 shadow-2xl">
          {/* Speaker info */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
              isLucas 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-blue-400' 
                : 'bg-gradient-to-br from-purple-500 to-purple-700 border-4 border-purple-400'
            }`}>
              <span className="text-4xl">{isLucas ? '👨‍🔬' : '👩‍🔬'}</span>
            </div>
            <div className="flex-1">
              <p className={`font-bold text-xl ${
                isLucas ? 'text-blue-300' : 'text-purple-300'
              }`}>
                {isLucas ? 'Dr. Lucas' : 'Dra. Adriana Malvasio'}
              </p>
              <p className="text-gray-400 text-sm">
                {isLucas ? 'Pesquisador de Campo' : 'Coordenadora de Pesquisa'}
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
                    ? 'w-8 bg-amber-400 shadow-lg shadow-amber-500/50' 
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
              Pressione <span className="text-amber-400 font-bold">ESPAÇO</span> para avançar
            </p>
          </div>
        </div>

        {/* Seta apontando para baixo */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-stone-900 border-b-4 border-r-4 border-amber-600/60 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
