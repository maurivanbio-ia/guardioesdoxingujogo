/**
 * usePhaseSystem - Sistema robusto de gerenciamento de fases
 * Previne transições prematuras e garante progressão controlada
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { GamePhase, GAME_PHASES, ActivityType, calculatePhaseProgress } from './phaseConfig';

interface PhaseProgress {
  currentPhase: number;
  phaseProgress: number; // Pontos atuais na fase
  phaseGoal: number; // Pontos necessários para completar
  percentage: number; // Percentual de conclusão
  completedActivities: Record<ActivityType, number>; // Contador de atividades
  phasesCompleted: number[];
  canProgressToNextPhase: boolean;
}

interface UsePhaseSystemReturn {
  currentPhaseData: GamePhase;
  progress: PhaseProgress;
  recordActivity: (activityId: ActivityType) => void;
  completePhase: () => void;
  resetPhases: () => void;
  isPhaseComplete: boolean;
  nextPhaseAvailable: boolean;
}

export function usePhaseSystem(initialPhase = 1): UsePhaseSystemReturn {
  const [currentPhase, setCurrentPhase] = useState(initialPhase);
  const [completedActivities, setCompletedActivities] = useState<Record<ActivityType, number>>({} as Record<ActivityType, number>);
  const [phasesCompleted, setPhasesCompleted] = useState<number[]>([]);
  const [phaseCompleteFlag, setPhaseCompleteFlag] = useState(false);

  const currentPhaseData = GAME_PHASES.find((p) => p.id === currentPhase) || GAME_PHASES[0];

  // Calcula progresso atual da fase
  const phaseProgressData = calculatePhaseProgress(currentPhase, completedActivities);

  // Verifica se pode progredir para próxima fase
  // Critérios: 1) Pontos suficientes, 2) Atividades mínimas completadas, 3) RequiredCount de cada atividade
  const canProgressToNextPhase = useMemo(() => {
    // Verifica pontos
    if (phaseProgressData.current < phaseProgressData.goal) {
      return false;
    }

    // Verifica se completou o mínimo de atividades diferentes
    const completedActivityTypes = Object.keys(completedActivities).filter(
      (key) => completedActivities[key as ActivityType] > 0
    );
    
    if (currentPhaseData.minActivitiesRequired && 
        completedActivityTypes.length < currentPhaseData.minActivitiesRequired) {
      return false;
    }

    // Verifica se cada atividade com requiredCount foi completada
    const allRequiredActivitiesMet = currentPhaseData.activities.every((activity) => {
      if (!activity.requiredCount) return true; // Atividade opcional
      const timesCompleted = completedActivities[activity.id] || 0;
      return timesCompleted >= activity.requiredCount;
    });

    return allRequiredActivitiesMet;
  }, [phaseProgressData, completedActivities, currentPhaseData]);

  // Verifica se há próxima fase disponível
  const nextPhaseAvailable = currentPhase < GAME_PHASES.length;

  // Registra atividade completada
  const recordActivity = useCallback((activityId: ActivityType) => {
    setCompletedActivities((prev) => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1,
    }));

    // Dispatch evento customizado
    window.dispatchEvent(new CustomEvent('activityCompleted', {
      detail: { activityId, phase: currentPhase }
    }));
  }, [currentPhase]);

  // Completa fase atual e avança para próxima
  const completePhase = useCallback(() => {
    if (!canProgressToNextPhase) {
      console.warn(`Fase ${currentPhase} ainda não pode ser completada. Progresso: ${phaseProgressData.current}/${phaseProgressData.goal}`);
      return;
    }

    if (!nextPhaseAvailable) {
      console.log('Todas as fases foram completadas!');
      setPhaseCompleteFlag(true);
      return;
    }

    // Marca fase como completada
    setPhasesCompleted((prev) => Array.from(new Set([...prev, currentPhase])));
    
    // Avança para próxima fase
    const nextPhase = currentPhase + 1;
    setCurrentPhase(nextPhase);
    
    // Reseta atividades da fase
    setCompletedActivities({} as Record<ActivityType, number>);
    setPhaseCompleteFlag(false);

    // Dispatch evento de conclusão de fase
    window.dispatchEvent(new CustomEvent('phaseCompleted', {
      detail: { completedPhase: currentPhase, nextPhase }
    }));

    console.log(`✅ Fase ${currentPhase} completada! Avançando para Fase ${nextPhase}`);
  }, [canProgressToNextPhase, currentPhase, nextPhaseAvailable, phaseProgressData]);

  // Reset completo do sistema de fases
  const resetPhases = useCallback(() => {
    setCurrentPhase(1);
    setCompletedActivities({} as Record<ActivityType, number>);
    setPhasesCompleted([]);
    setPhaseCompleteFlag(false);
  }, []);

  // Verifica automaticamente se a fase foi completada
  useEffect(() => {
    if (canProgressToNextPhase && !phaseCompleteFlag) {
      setPhaseCompleteFlag(true);
      
      // Dispatch evento de fase pronta para conclusão
      window.dispatchEvent(new CustomEvent('phaseReadyToComplete', {
        detail: { phase: currentPhase, progress: phaseProgressData }
      }));
    }
  }, [canProgressToNextPhase, phaseCompleteFlag, currentPhase, phaseProgressData]);

  const progress: PhaseProgress = {
    currentPhase,
    phaseProgress: phaseProgressData.current,
    phaseGoal: phaseProgressData.goal,
    percentage: phaseProgressData.percentage,
    completedActivities,
    phasesCompleted,
    canProgressToNextPhase,
  };

  return {
    currentPhaseData,
    progress,
    recordActivity,
    completePhase,
    resetPhases,
    isPhaseComplete: phaseCompleteFlag,
    nextPhaseAvailable,
  };
}
