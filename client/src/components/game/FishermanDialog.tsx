import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Eye, X } from 'lucide-react';

interface FishermanDialogProps {
  isOpen: boolean;
  season: 'seca' | 'cheia';
  playerHasCollectedTrash: boolean;
  playerHasIgnoredImpact: boolean;
  playerHasMeasuredNests: boolean;
  onClose: () => void;
}

interface DialogueOption {
  id: string;
  label: string;
  icon: typeof MessageCircle;
}

interface FishermanPhrase {
  context: string;
  text: string;
}

const FISHERMAN_GREETINGS = [
  'Bom dia!',
  'Tudo tranquilo por aqui?',
  'E aí, doutor!',
  'Olá, meu amigo!',
];

const SEASONAL_DIALOGUES: Record<'seca' | 'cheia', string> = {
  seca: 'É tempo de desova. Precisamos cuidar dos ninhos.',
  cheia: 'O rio está forte, é quando os peixes se espalham.',
};

const CONTEXTUAL_RESPONSES: FishermanPhrase[] = [
  {
    context: 'collected_trash',
    text: 'Boa! O rio agradece. Cada pedaço de lixo que tiramos daqui salva a vida de muitos bichos.',
  },
  {
    context: 'ignored_impact',
    text: 'Cuidado, deixar lixo aqui é perigoso para os filhotes. Eles podem confundir plástico com comida.',
  },
  {
    context: 'measured_nests',
    text: 'Você entende mesmo disso, parabéns! Esse trabalho de vocês é muito importante pra gente.',
  },
];

const FISHING_DIALOGUES = [
  'A pesca tem que ser feita com consciência. A gente tira só o que precisa e respeita o defeso.',
  'Meu pai me ensinou a pescar respeitando o rio. Sem o Xingu, a gente não é nada.',
  'Já vi muita tartaruga presa em rede. Por isso agora uso malha maior e respeito as áreas de desova.',
];

const NET_OBSERVATIONS = [
  'Essa rede aqui é seletiva. Deixa os peixinhos pequenos passarem.',
  'Vê como a malha é grande? Assim não machuca os quelônios que passam por aqui.',
  'Aprendi que rede muito fina pega tudo, até o que não deve. Mudei meu jeito de pescar.',
];

export function FishermanDialog({
  isOpen,
  season,
  playerHasCollectedTrash,
  playerHasIgnoredImpact,
  playerHasMeasuredNests,
  onClose,
}: FishermanDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [currentDialogue, setCurrentDialogue] = useState('');

  useEffect(() => {
    if (isOpen) {
      const randomGreeting = FISHERMAN_GREETINGS[Math.floor(Math.random() * FISHERMAN_GREETINGS.length)];
      setCurrentGreeting(randomGreeting);
      setSelectedOption(null);
    }
  }, [isOpen]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);

    if (optionId === 'talk') {
      let dialogue = SEASONAL_DIALOGUES[season];
      
      if (playerHasCollectedTrash) {
        dialogue = CONTEXTUAL_RESPONSES.find(r => r.context === 'collected_trash')!.text;
      } else if (playerHasIgnoredImpact) {
        dialogue = CONTEXTUAL_RESPONSES.find(r => r.context === 'ignored_impact')!.text;
      } else if (playerHasMeasuredNests) {
        dialogue = CONTEXTUAL_RESPONSES.find(r => r.context === 'measured_nests')!.text;
      } else {
        const randomFishing = FISHING_DIALOGUES[Math.floor(Math.random() * FISHING_DIALOGUES.length)];
        dialogue = randomFishing;
      }
      
      setCurrentDialogue(dialogue);
    } else if (optionId === 'observe') {
      const randomNet = NET_OBSERVATIONS[Math.floor(Math.random() * NET_OBSERVATIONS.length)];
      setCurrentDialogue(randomNet);
    }
  };

  if (!isOpen) return null;

  const options: DialogueOption[] = [
    { id: 'talk', label: 'Conversar com pescador', icon: MessageCircle },
    { id: 'observe', label: 'Observar rede', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-2xl bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 border-2 border-cyan-500/50 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 border-4 border-amber-500 flex items-center justify-center text-5xl shadow-lg">
              👨‍🌾
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Zé Raimundo
              </h2>
              <p className="text-cyan-200">
                Pescador Ribeirinho
              </p>
            </div>
          </div>

          {!selectedOption ? (
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
                <p className="text-white text-lg italic">
                  "{currentGreeting}"
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-cyan-200 font-medium">O que você deseja fazer?</p>
                {options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className="w-full h-auto py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-2 border-cyan-400/50"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="w-6 h-6" />
                        <p className="font-bold text-lg">{option.label}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border-2 border-white/20">
                <p className="text-white text-lg leading-relaxed">
                  "{currentDialogue}"
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedOption(null)}
                  variant="outline"
                  className="flex-1 border-cyan-400/50 text-white hover:bg-cyan-600/20"
                >
                  Voltar
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Encerrar Conversa
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
