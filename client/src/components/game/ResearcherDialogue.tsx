import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface ResearcherDialogueProps {
  researcher: 'LUCAS' | 'ALINE';
  onClose: () => void;
}

const researcherDialogues = {
  LUCAS: [
    {
      speaker: 'player',
      avatar: '🧑‍🔬',
      name: 'Biólogo',
      message: 'Dr. Lucas, pode me explicar sobre a temperatura e os filhotes?',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      speaker: 'lucas',
      avatar: '👨‍🔬',
      name: 'Dr. Lucas',
      message: 'Claro! Você sabia que a temperatura da areia determina o sexo dos filhotes?',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      speaker: 'player',
      avatar: '🧑‍🔬',
      name: 'Biólogo',
      message: 'Sim, temperaturas mais altas geram mais fêmeas, correto?',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      speaker: 'lucas',
      avatar: '👨‍🔬',
      name: 'Dr. Lucas',
      message: 'Exatamente! As mudanças climáticas estão desequilibrando essa proporção. Temperaturas acima de 33°C geram principalmente fêmeas.',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      speaker: 'lucas',
      avatar: '👨‍🔬',
      name: 'Dr. Lucas',
      message: 'Por isso monitoramos a temperatura com sensores. Precisamos entender como o clima está afetando as populações.',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      speaker: 'player',
      avatar: '🧑‍🔬',
      name: 'Biólogo',
      message: 'Fascinante! Isso significa que cada medição de temperatura é crucial para a conservação.',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      speaker: 'lucas',
      avatar: '👨‍🔬',
      name: 'Dr. Lucas',
      message: 'Sim! E não é só sobre os filhotes de hoje. Estamos documentando mudanças que podem afetar gerações futuras.',
      color: 'from-blue-600 to-indigo-700'
    }
  ],
  ALINE: [
    {
      speaker: 'player',
      avatar: '🧑‍🔬',
      name: 'Biólogo',
      message: 'Aline, como lidamos com os urubus?',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      speaker: 'aline',
      avatar: '👩‍🔬',
      name: 'Aline',
      message: 'Os urubus são oportunistas. Se não estivermos atentos, metade dos ninhos pode ser perdida.',
      color: 'from-red-600 to-pink-700'
    },
    {
      speaker: 'player',
      avatar: '🧑‍🔬',
      name: 'Biólogo',
      message: 'Então precisamos patrulhar constantemente?',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      speaker: 'aline',
      avatar: '👩‍🔬',
      name: 'Aline',
      message: 'Sim! Eles costumam aparecer em ondas de 2 a 5 aves. Fique atento aos sinais e espante-os rapidamente.',
      color: 'from-red-600 to-pink-700'
    }
  ]
};

export function ResearcherDialogue({ researcher, onClose }: ResearcherDialogueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dialogues = researcherDialogues[researcher] || [];
  const currentDialogue = dialogues[currentIndex];
  const isLastDialogue = currentIndex === dialogues.length - 1;

  const handleNext = () => {
    if (isLastDialogue) {
      onClose();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentDialogue) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-slate-700 overflow-hidden">
        {/* Progress Dots */}
        <div className="flex gap-2 justify-center p-4 bg-slate-900/50 border-b border-slate-700">
          {dialogues.map((_: unknown, index: number) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-emerald-500'
                  : index < currentIndex
                  ? 'w-2 bg-emerald-700'
                  : 'w-2 bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={`flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br ${currentDialogue.color}`}>
            {/* Avatar */}
            <div className="text-5xl">{currentDialogue.avatar}</div>

            {/* Message */}
            <div className="flex-1">
              <div className="font-bold text-white text-lg mb-2">
                {currentDialogue.name}
              </div>
              <p className="text-white/90 text-base leading-relaxed">
                {currentDialogue.message}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              {currentIndex + 1} / {dialogues.length}
            </div>
            
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
            >
              {isLastDialogue ? 'Concluir' : 'Próximo'}
              {!isLastDialogue && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
