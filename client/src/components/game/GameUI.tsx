import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WelcomeModal } from './WelcomeModal';
import { InteractiveTutorial } from './InteractiveTutorial';
import { AchievementNotification } from './AchievementNotification';
import { AchievementsPanel } from './AchievementsPanel';
import { FullMap } from './FullMap';
import { PhaseProgressModal } from './PhaseProgressModal';
import { PhaseCompletionCelebration } from './PhaseCompletionCelebration';
import { PhaseIntroModal } from './PhaseIntroModal';
import { TopBar } from './TopBar';
import { EducationalCard, EducationalCardData } from './EducationalCard';
import { PhaseTransitionModal } from './PhaseTransitionModal';
import { VirtualJoystick } from './VirtualJoystick';
import { VirtualActionButtons } from './VirtualActionButtons';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCardSystem } from '@/lib/useCardSystem';
import { ContextualCardDisplay } from './ContextualCardDisplay';
import { GameCompletionFlow } from './GameCompletionFlow';

export function GameUI() {
  const { gameState, resumeGame, achievementManager, getCurrentPhase, advancePhase, addPhaseXP, getICX, isGameComplete, conservationManager } = useGame();
  const isMobile = useIsMobile();
  const { activeCard, showCard, hideCard } = useCardSystem();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });
  const [entities, setEntities] = useState<any[]>([]);
  const [recentAchievement, setRecentAchievement] = useState<any>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [showPhaseProgress, setShowPhaseProgress] = useState(false);
  const [showPhaseCelebration, setShowPhaseCelebration] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showPhaseIntro, setShowPhaseIntro] = useState(false);
  const [lastPhaseShown, setLastPhaseShown] = useState(0);
  const [educationalCard, setEducationalCard] = useState<EducationalCardData | null>(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [phaseTransitionData, setPhaseTransitionData] = useState<{ phase: number; title: string; description: string } | null>(null);
  const [showVirtualInteractButton, setShowVirtualInteractButton] = useState(false);

  // Show welcome modal immediately when game starts
  useEffect(() => {
    if (gameState.gameStarted && !tutorialComplete) {
      setShowWelcome(true);
    }
  }, [gameState.gameStarted, tutorialComplete]);

  // Listen for achievement unlocks (both direct listener and custom event)
  useEffect(() => {
    const handleAchievement = (achievement: any) => {
      setRecentAchievement(achievement);
    };

    // Listen via achievementManager
    const unsubscribe = achievementManager.addListener(handleAchievement);
    
    // Also listen for custom event
    const handleAchievementUnlocked = (e: any) => {
      setRecentAchievement(e.detail);
    };
    
    window.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    
    return () => {
      unsubscribe();
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
    };
  }, [achievementManager]);

  // Listen for custom events from GameScene
  useEffect(() => {
    const handlePlayerMove = (e: any) => {
      setPlayerPosition(e.detail);
    };

    const handleEntitiesUpdate = (e: any) => {
      setEntities(e.detail);
    };

    const handleXPGain = (e: any) => {
      const points = e.detail;
      setTotalXP(prev => prev + points);
      setShowXPAnimation(true);
      setTimeout(() => setShowXPAnimation(false), 500);
      
      // Update phase manager with new XP
      const phaseCompleted = addPhaseXP(points);
      if (phaseCompleted) {
        console.log('🎉 Fase completa por XP! Mostrando card de parabéns.');
        // Show celebration card immediately when phase is completed
        setShowPhaseCelebration(true);
      }
    };

    // const handleEducationalCard = (e: any) => {
    //   setEducationalCard(e.detail);
    // };

    const handleFlashlightToggle = (e: any) => {
      setIsFlashlightOn(e.detail.isOn);
    };

    const handlePhaseTransition = (e: any) => {
      setPhaseTransitionData(e.detail);
      setShowPhaseTransition(true);
    };

    const handleShowContextualCard = (e: any) => {
      const { eventKey } = e.detail;
      showCard(eventKey);
    };

    window.addEventListener('playerMoved', handlePlayerMove);
    window.addEventListener('entitiesUpdated', handleEntitiesUpdate);
    window.addEventListener('xpGained', handleXPGain);
    window.addEventListener('flashlightToggled', handleFlashlightToggle);
    window.addEventListener('showPhaseTransition', handlePhaseTransition);
    window.addEventListener('showContextualCard', handleShowContextualCard);

    return () => {
      window.removeEventListener('playerMoved', handlePlayerMove);
      window.removeEventListener('entitiesUpdated', handleEntitiesUpdate);
      window.removeEventListener('xpGained', handleXPGain);
      window.removeEventListener('flashlightToggled', handleFlashlightToggle);
      window.removeEventListener('showPhaseTransition', handlePhaseTransition);
      window.removeEventListener('showContextualCard', handleShowContextualCard);
    };
  }, [showCard]);

  // Listen for proximity events to show/hide virtual interact button
  useEffect(() => {
    const handleProximity = () => {
      setShowVirtualInteractButton(true);
    };

    const handleProximityExit = () => {
      setShowVirtualInteractButton(false);
    };

    window.addEventListener('nearInteractable', handleProximity);
    window.addEventListener('leftInteractable', handleProximityExit);

    return () => {
      window.removeEventListener('nearInteractable', handleProximity);
      window.removeEventListener('leftInteractable', handleProximityExit);
    };
  }, []);

  // NO MORE POLLING - Phase completion is now triggered directly by XP gain handler
  // This prevents the race condition where the celebration card would re-appear
  // after advancing to the next phase

  // Keyboard controls for map and day/night toggle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && !showPhaseProgress && !showPhaseCelebration) {
        setShowFullMap(prev => !prev);
      } else if (e.key.toLowerCase() === 'l') {
        // Toggle force day mode
        window.dispatchEvent(new Event('toggleDayMode'));
      } else if (e.key.toLowerCase() === 'n') {
        // Skip to night (20h)
        window.dispatchEvent(new Event('skipToNight'));
      } else if (e.key.toLowerCase() === 'b') {
        // Back to day (12h)
        window.dispatchEvent(new Event('skipToDay'));
      } else if (e.key === 'Escape') {
        // Close modals with ESC
        if (showFullMap) setShowFullMap(false);
        if (showPhaseProgress) setShowPhaseProgress(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showFullMap, showPhaseProgress, showPhaseCelebration]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    // Show interactive tutorial after welcome modal
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setTutorialComplete(true);
    // Trigger event for GameScene
    window.dispatchEvent(new CustomEvent('tutorialComplete'));
  };

  const handlePhaseContinue = () => {
    setShowPhaseCelebration(false);
    
    // Advance to next phase immediately
    const advanced = advancePhase();
    if (advanced) {
      console.log('🎉 Avançado para próxima fase!');
      const nextPhase = getCurrentPhase();
      setLastPhaseShown(nextPhase.id);
      // Show intro for new phase ONLY after successfully advancing
      setShowPhaseIntro(true);
    } else {
      console.log('🏆 Jogo completo!');
    }
  };

  const handleFlashlightClick = () => {
    // Toggle flashlight - dispatch event to GameScene
    window.dispatchEvent(new Event('toggleFlashlight'));
  };

  const handlePhaseTransitionContinue = () => {
    setShowPhaseTransition(false);
    setPhaseTransitionData(null);
  };

  if (!gameState.gameStarted) return null;

  const currentPhase = getCurrentPhase();
  const unlockedAchievements = achievementManager.getUnlockedAchievements().length;
  const currentICX = getICX();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Bar with Phase Progress */}
      {tutorialComplete && (
        <TopBar 
          xp={totalXP}
          icx={currentICX}
          unlockedAchievements={unlockedAchievements}
          onShowAchievements={() => setShowAchievements(true)}
          onShowPhaseProgress={() => setShowPhaseProgress(true)}
          phaseXP={currentPhase.currentXP}
          phaseRequiredXP={currentPhase.requiredXP}
          phaseName={currentPhase.name}
        />
      )}

      {/* Welcome Modal - Shows once at game start */}
      {showWelcome && (
        <div className="pointer-events-auto">
          <WelcomeModal onComplete={handleWelcomeComplete} />
        </div>
      )}

      {/* Interactive Tutorial - Shows after welcome modal */}
      {showTutorial && (
        <div className="pointer-events-auto">
          <InteractiveTutorial onComplete={handleTutorialComplete} />
        </div>
      )}

      {/* Minimapa removed - use FullMap with M key instead */}
      {/* Equipment Panel removed - replaced by modern draggable controls */}

      {/* Full Map */}
      {tutorialComplete && (
        <FullMap 
          isOpen={showFullMap}
          onClose={() => setShowFullMap(false)}
          playerPosition={playerPosition}
          entities={entities}
        />
      )}

      {/* Phase Progress Modal */}
      {tutorialComplete && (
        <PhaseProgressModal 
          isOpen={showPhaseProgress}
          onClose={() => setShowPhaseProgress(false)}
        />
      )}

      {/* Phase Completion Celebration */}
      {tutorialComplete && (
        <PhaseCompletionCelebration 
          isOpen={showPhaseCelebration}
          onContinue={handlePhaseContinue}
        />
      )}

      {/* Phase Introduction Modal */}
      {tutorialComplete && (
        <PhaseIntroModal 
          isOpen={showPhaseIntro}
          onClose={() => setShowPhaseIntro(false)}
          phaseName={currentPhase.name}
          phaseDescription={currentPhase.description}
          requiredXP={currentPhase.requiredXP}
          npcCharacter={currentPhase.npcDialogue.character}
          npcMessage={currentPhase.npcDialogue.message}
        />
      )}

      {/* Achievements Panel */}
      {showAchievements && (
        <AchievementsPanel 
          achievements={achievementManager.getAllAchievements()}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Achievement Notification */}
      {recentAchievement && (
        <AchievementNotification 
          achievement={recentAchievement} 
          onComplete={() => setRecentAchievement(null)}
          index={0}
        />
      )}

      {/* Educational Card - DESABILITADO */}
      {/* {tutorialComplete && educationalCard && (
        <div className="pointer-events-auto">
          <EducationalCard 
            card={educationalCard}
            onClose={() => setEducationalCard(null)}
          />
        </div>
      )} */}

      {/* Flashlight Button removed - use F key instead (shown in KeyboardShortcutsPanel) */}

      {/* Phase Transition Modal */}
      {tutorialComplete && showPhaseTransition && phaseTransitionData && (
        <div className="pointer-events-auto">
          <PhaseTransitionModal 
            phaseNumber={phaseTransitionData.phase}
            title={phaseTransitionData.title}
            description={phaseTransitionData.description}
            onContinue={handlePhaseTransitionContinue}
          />
        </div>
      )}

      {/* Virtual Controls - Mobile Only */}
      {isMobile && tutorialComplete && !gameState.isPaused && (
        <>
          <VirtualJoystick 
            onMove={(direction) => {
              // Handled by event system
            }}
          />
          <VirtualActionButtons 
            onInteract={() => {
              // Handled by event system
            }}
            onRun={(isRunning) => {
              // Handled by event system
            }}
            showInteractButton={showVirtualInteractButton}
            flashlightOn={isFlashlightOn}
            onFlashlightToggle={handleFlashlightClick}
          />
        </>
      )}

      {/* Pause Menu */}
      {gameState.isPaused && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-amber-600 p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold text-amber-400 mb-6 text-center">
              Jogo Pausado
            </h2>
            <div className="space-y-4">
              <Button
                onClick={resumeGame}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                Continuar
              </Button>
              <Button
                variant="outline"
                className="w-full border-amber-600 text-amber-400 hover:bg-amber-900/30"
                size="lg"
              >
                Configurações
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Sair para Menu
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Contextual Educational Cards */}
      {tutorialComplete && (
        <div className="pointer-events-auto">
          <ContextualCardDisplay activeCard={activeCard} onClose={hideCard} />
        </div>
      )}

      {/* Game Completion Flow - Certificado Final */}
      {tutorialComplete && (
        <GameCompletionFlow 
          isGameComplete={isGameComplete()}
          fieldReportData={{
            nestsObserved: 0, // TODO: Track this properly
            temperaturesRecorded: [],
            positiveActions: conservationManager.getStats().positiveActions,
            negativeActions: conservationManager.getStats().negativeActions,
            totalPoints: totalXP,
            actionsLog: []
          }}
          onRestart={() => window.location.reload()}
        />
      )}

    </div>
  );
}
