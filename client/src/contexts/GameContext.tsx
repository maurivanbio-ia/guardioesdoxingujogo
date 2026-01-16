import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { MISSIONS } from '@/lib/gameConstants';
import { PhaseManager, Phase } from '@/lib/phaseManager';
import { ConservationManager, ICX_ACTIONS } from '@/lib/conservationManager';
import { AchievementManager } from '@/lib/achievementManager';

interface GameState {
  currentChapter: string;
  completedObjectives: string[];
  scientificData: ScientificRecord[];
  ethicalScore: number;
  reputation: number;
  inventory: string[];
  timeOfDay: number; // 0-1, onde 0 é meia-noite e 0.5 é meio-dia
  gameStarted: boolean;
  isPaused: boolean;
  awareness: number; // Conscientização ambiental (0-100)
  curiositiesRead: number; // Número de curiosidades científicas lidas
}

interface ScientificRecord {
  id: string;
  type: 'nest' | 'female' | 'hatchling';
  timestamp: Date;
  coordinates: { x: number; z: number };
  measurements?: {
    weight?: number;
    carapaceLength?: number;
    carapaceWidth?: number;
  };
  species?: string;
  notes?: string;
}

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  completeObjective: (objectiveId: string) => void;
  addScientificRecord: (record: Omit<ScientificRecord, 'id' | 'timestamp'>) => void;
  updateEthicalScore: (delta: number) => void;
  updateReputation: (delta: number) => void;
  addToInventory: (itemId: string) => void;
  advanceChapter: () => void;
  updateTimeOfDay: (time: number) => void;
  updatePlayerPosition: (position: { x: number; y: number; z: number }) => void;
  getCurrentMission: () => typeof MISSIONS[keyof typeof MISSIONS] | null;
  // Phase management
  getCurrentPhase: () => Phase;
  getNextPhase: () => Phase | null;
  updatePhaseObjective: (objectiveId: string, increment?: number) => boolean;
  addPhaseXP: (xp: number) => boolean;
  canAdvancePhase: () => boolean;
  advancePhase: () => boolean;
  isGameComplete: () => boolean;
  getPhaseProgress: () => number;
  // Conservation & Achievements
  conservationManager: ConservationManager;
  achievementManager: AchievementManager;
  getICX: () => number;
  updateICX: (actionKey: keyof typeof ICX_ACTIONS) => void;
  // Awareness (Conscientização)
  incrementCuriositiesRead: () => void;
  getAwareness: () => number;
  checkAndUpdateAchievements: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const phaseManagerRef = useRef(new PhaseManager());
  const conservationManagerRef = useRef(new ConservationManager(75));
  const achievementManagerRef = useRef(new AchievementManager());
  const [, forceUpdate] = useState({});
  
  const [gameState, setGameState] = useState<GameState>({
    currentChapter: 'chapter_1',
    completedObjectives: [],
    scientificData: [],
    ethicalScore: 100,
    reputation: 50,
    inventory: [],
    timeOfDay: 0.25, // Começa ao amanhecer
    gameStarted: false,
    isPaused: false,
    awareness: 0, // Começa em 0%, aumenta com curiosidades científicas
    curiositiesRead: 0,
  });

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true, isPaused: false }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  };

  const completeObjective = (objectiveId: string) => {
    setGameState(prev => ({
      ...prev,
      completedObjectives: [...prev.completedObjectives, objectiveId]
    }));
  };

  const addScientificRecord = (record: Omit<ScientificRecord, 'id' | 'timestamp'>) => {
    const newRecord: ScientificRecord = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setGameState(prev => ({
      ...prev,
      scientificData: [...prev.scientificData, newRecord]
    }));
  };

  const updateEthicalScore = (delta: number) => {
    setGameState(prev => ({
      ...prev,
      ethicalScore: Math.max(0, Math.min(100, prev.ethicalScore + delta))
    }));
    // Check achievements after ethical score changes
    setTimeout(() => checkAndUpdateAchievements(), 100);
  };

  const updateReputation = (delta: number) => {
    setGameState(prev => ({
      ...prev,
      reputation: Math.max(0, Math.min(100, prev.reputation + delta))
    }));
  };

  const addToInventory = (itemId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, itemId]
    }));
  };

  const advanceChapter = () => {
    const chapters = Object.keys(MISSIONS);
    const currentIndex = chapters.findIndex(ch => MISSIONS[ch as keyof typeof MISSIONS].id === gameState.currentChapter);
    
    if (currentIndex < chapters.length - 1) {
      const nextChapter = MISSIONS[chapters[currentIndex + 1] as keyof typeof MISSIONS].id;
      setGameState(prev => ({
        ...prev,
        currentChapter: nextChapter
      }));
    }
  };

  const updateTimeOfDay = (time: number) => {
    setGameState(prev => ({
      ...prev,
      timeOfDay: time % 1 // Mantém entre 0 e 1
    }));
  };

  const updatePlayerPosition = (position: { x: number; y: number; z: number }) => {
    // Atualiza posição do jogador (pode ser usado para triggers, etc)
    // Por enquanto apenas armazena, mas pode ser expandido
  };

  const getCurrentMission = () => {
    const mission = Object.values(MISSIONS).find(m => m.id === gameState.currentChapter);
    return mission || null;
  };

  // Phase management methods
  const getCurrentPhase = () => {
    return phaseManagerRef.current.getCurrentPhase();
  };

  const getNextPhase = () => {
    return phaseManagerRef.current.getNextPhase();
  };

  const updatePhaseObjective = (objectiveId: string, increment: number = 1): boolean => {
    const phaseCompleted = phaseManagerRef.current.updateObjective(objectiveId, increment);
    forceUpdate({}); // Force re-render
    return phaseCompleted;
  };

  const canAdvancePhase = (): boolean => {
    return phaseManagerRef.current.canAdvancePhase();
  };

  const advancePhase = (): boolean => {
    const success = phaseManagerRef.current.advancePhase();
    if (success) {
      // Check for game completion achievements
      checkAndUpdateAchievements();
      forceUpdate({}); // Force re-render
    }
    return success;
  };

  const isGameComplete = (): boolean => {
    return phaseManagerRef.current.isGameComplete();
  };

  const getPhaseProgress = (): number => {
    return phaseManagerRef.current.getProgressPercentage();
  };

  const addPhaseXP = (xp: number): boolean => {
    const phaseCompleted = phaseManagerRef.current.addXP(xp);
    // Check achievements when phase completes
    if (phaseCompleted) {
      setTimeout(() => checkAndUpdateAchievements(), 100);
    }
    forceUpdate({}); // Force re-render
    return phaseCompleted;
  };

  // Conservation and Achievement functions
  const getICX = () => conservationManagerRef.current.getICX();
  
  const updateICX = (actionKey: keyof typeof ICX_ACTIONS) => {
    conservationManagerRef.current.recordAction(actionKey);
    checkAndUpdateAchievements();
    forceUpdate({});
  };

  // Increment curiosities read and update awareness
  const incrementCuriositiesRead = () => {
    setGameState(prev => {
      const newCuriosities = prev.curiositiesRead + 1;
      // Awareness increases by 10% for each curiosity read (max 100%)
      const newAwareness = Math.min(100, newCuriosities * 10);
      return {
        ...prev,
        curiositiesRead: newCuriosities,
        awareness: newAwareness
      };
    });
    // Check achievements after state update
    setTimeout(() => checkAndUpdateAchievements(), 100);
  };

  const getAwareness = () => gameState.awareness;

  // Central function to check all achievements
  const checkAndUpdateAchievements = () => {
    const newlyUnlocked = achievementManagerRef.current.checkAchievements({
      ethics: gameState.ethicalScore,
      awareness: gameState.awareness,
      icx: conservationManagerRef.current.getICX(),
      allPhasesComplete: isGameComplete()
    });
    
    // Dispatch event for newly unlocked achievements
    newlyUnlocked.forEach(achievement => {
      window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
        detail: achievement 
      }));
    });
    
    forceUpdate({});
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        completeObjective,
        addScientificRecord,
        updateEthicalScore,
        updateReputation,
        addToInventory,
        updatePlayerPosition,
        advanceChapter,
        updateTimeOfDay,
        getCurrentMission,
        getCurrentPhase,
        getNextPhase,
        updatePhaseObjective,
        addPhaseXP,
        canAdvancePhase,
        advancePhase,
        isGameComplete,
        getPhaseProgress,
        conservationManager: conservationManagerRef.current,
        achievementManager: achievementManagerRef.current,
        getICX,
        updateICX,
        incrementCuriositiesRead,
        getAwareness,
        checkAndUpdateAchievements
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

