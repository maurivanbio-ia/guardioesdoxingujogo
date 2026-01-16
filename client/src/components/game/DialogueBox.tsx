import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DialogueBoxProps {
  npcName: string;
  npcRole: string;
  dialogue: string;
  onClose: () => void;
  choices?: Array<{
    text: string;
    action: () => void;
  }>;
}

export function DialogueBox({ npcName, npcRole, dialogue, onClose, choices }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efeito de digitação (velocidade aumentada: 15ms por caractere)
  useEffect(() => {
    if (currentIndex < dialogue.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + dialogue[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Reduzido de 30ms para 15ms (2x mais rápido)
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, dialogue]);

  const skipTyping = () => {
    setDisplayedText(dialogue);
    setCurrentIndex(dialogue.length);
    setIsComplete(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center pb-8 pointer-events-auto z-50">
      <Card className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-amber-600/70 p-6 max-w-3xl w-full mx-4 shadow-2xl relative">
        {/* Cabeçalho do NPC */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-amber-600/30">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-3xl shadow-lg">
            👤
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-400">{npcName}</h3>
            <p className="text-sm text-gray-400">{npcRole}</p>
          </div>
        </div>

        {/* Texto do diálogo */}
        <div 
          className="text-gray-200 text-lg leading-relaxed mb-6 min-h-[100px]"
          onClick={!isComplete ? skipTyping : undefined}
        >
          {displayedText}
          {!isComplete && <span className="animate-pulse">▌</span>}
        </div>

        {/* Botões de ação */}
        {isComplete && (
          <div className="flex flex-col gap-2">
            {choices && choices.length > 0 ? (
              choices.map((choice, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    choice.action();
                    onClose();
                  }}
                  variant="outline"
                  className="w-full justify-start border-amber-600/50 text-amber-300 hover:bg-amber-900/30 text-left"
                >
                  → {choice.text}
                </Button>
              ))
            ) : (
              <Button
                onClick={onClose}
                className="bg-amber-600 hover:bg-amber-700 text-white ml-auto"
              >
                Continuar →
              </Button>
            )}
          </div>
        )}

        {/* Dica para pular */}
        {!isComplete && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Clique para pular a animação
          </p>
        )}
      </Card>
    </div>
  );
}

