import { useState, useEffect } from 'react';
import { DialogueBox } from './DialogueBox';
import { useGame } from '@/contexts/GameContext';
import { NPCS } from '@/lib/gameConstants';

export function InteractionSystem() {
  const { gameState, completeObjective, updateEthicalScore, updateReputation } = useGame();
  const [currentDialogue, setCurrentDialogue] = useState<{
    npcName: string;
    npcRole: string;
    dialogue: string;
    choices?: Array<{ text: string; action: () => void }>;
  } | null>(null);

  // Sistema de interação com tecla E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && !currentDialogue && gameState.gameStarted && !gameState.isPaused) {
        triggerInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDialogue, gameState]);

  const triggerInteraction = () => {
    // Lógica de interação baseada no capítulo
    switch (gameState.currentChapter) {
      case 'chapter_1':
        showAdrianaIntro();
        break;
      case 'chapter_2':
        showAlineChapter2();
        break;
      case 'chapter_3':
        showAdrianaChapter3();
        break;
      case 'chapter_4':
        showZeRaimundo();
        break;
      default:
        break;
    }
  };

  const showAdrianaIntro = () => {
    setCurrentDialogue({
      npcName: NPCS.ADRIANA.name,
      npcRole: NPCS.ADRIANA.role,
      dialogue: NPCS.ADRIANA.dialogues.intro,
      choices: [
        {
          text: 'Estou pronto para aprender',
          action: () => {
            completeObjective('chapter_1_obj_1');
            updateReputation(5);
            window.dispatchEvent(new CustomEvent('activityCompleted', { detail: { activityId: 'talkNPC', phase: 1 } }));
          }
        },
        {
          text: 'Tenho algumas dúvidas sobre o projeto',
          action: () => {
            completeObjective('chapter_1_obj_1');
            updateReputation(3);
            window.dispatchEvent(new CustomEvent('activityCompleted', { detail: { activityId: 'talkNPC', phase: 1 } }));
          }
        }
      ]
    });
  };

  const showAlineChapter2 = () => {
    setCurrentDialogue({
      npcName: NPCS.ALINE.name,
      npcRole: NPCS.ALINE.role,
      dialogue: NPCS.ALINE.dialogues.chapter2,
      choices: [
        {
          text: 'Vamos medir com cuidado para não estressá-la',
          action: () => {
            updateEthicalScore(10);
            updateReputation(5);
            completeObjective('chapter_2_obj_2');
            window.dispatchEvent(new CustomEvent('activityCompleted', { detail: { activityId: 'talkNPC', phase: 2 } }));
          }
        },
        {
          text: 'Precisamos ser rápidos, o tempo é curto',
          action: () => {
            updateEthicalScore(-5);
            updateReputation(2);
            completeObjective('chapter_2_obj_2');
            window.dispatchEvent(new CustomEvent('activityCompleted', { detail: { activityId: 'talkNPC', phase: 2 } }));
          }
        }
      ]
    });
  };

  const showAdrianaChapter3 = () => {
    setCurrentDialogue({
      npcName: NPCS.ADRIANA.name,
      npcRole: NPCS.ADRIANA.role,
      dialogue: NPCS.ADRIANA.dialogues.chapter3,
    });
  };

  const showZeRaimundo = () => {
    setCurrentDialogue({
      npcName: NPCS.ZE_RAIMUNDO.name,
      npcRole: NPCS.ZE_RAIMUNDO.role,
      dialogue: NPCS.ZE_RAIMUNDO.dialogues.chapter4,
      choices: [
        {
          text: 'Talvez o que precisamos salvar não sejam só as tartarugas, mas o que elas representam',
          action: () => {
            updateReputation(10);
            updateEthicalScore(5);
            completeObjective('chapter_4_obj_2');
            window.dispatchEvent(new CustomEvent('activityCompleted', { detail: { activityId: 'talkNPC', phase: 2 } }));
          }
        },
        {
          text: 'Vamos trabalhar juntos para proteger o rio',
          action: () => {
            updateReputation(8);
            completeObjective('chapter_4_obj_2');
            window.dispatchEvent(new CustomEvent('activityCompleted', { detail: { activityId: 'talkNPC', phase: 2 } }));
          }
        }
      ]
    });
  };

  if (!currentDialogue) return null;

  return (
    <DialogueBox
      npcName={currentDialogue.npcName}
      npcRole={currentDialogue.npcRole}
      dialogue={currentDialogue.dialogue}
      choices={currentDialogue.choices}
      onClose={() => setCurrentDialogue(null)}
    />
  );
}

