/**
 * useScoreSystem - Sistema de pontuação balanceado
 * Diferentes tipos de ações recebem pontuações específicas
 */
import { useState, useCallback } from 'react';

export type ScoreAction = 
  // Atividades científicas precisas (+100)
  | 'measureTemp'
  | 'measureDepth'
  | 'measureWidth'
  | 'measureTurtle'
  | 'collectData'
  | 'tagTurtle'
  
  // Ações corretas comportamentais (+50)
  | 'markNest'
  | 'scareVulture'
  | 'observeAdult'
  | 'nightPatrol'
  | 'releaseHatchling'
  
  // Descobertas raras (+200)
  | 'findRareSpecies'
  | 'documentBehavior'
  | 'saveNestFromPredator'
  | 'achievementUnlock'
  
  // Ações incorretas (-50)
  | 'disturbAnimal'
  | 'skipProtocol'
  | 'wrongMeasurement';

export interface ScoreChange {
  action: ScoreAction;
  points: number;
  timestamp: number;
  description: string;
}

// Configuração de pontos por ação
const SCORE_VALUES: Record<ScoreAction, { points: number; description: string }> = {
  // Atividades científicas (+100)
  measureTemp: { points: 100, description: 'Temperatura medida com precisão' },
  measureDepth: { points: 100, description: 'Profundidade registrada' },
  measureWidth: { points: 100, description: 'Largura do ninho documentada' },
  measureTurtle: { points: 100, description: 'Biometria completa realizada' },
  collectData: { points: 100, description: 'Dados científicos coletados' },
  tagTurtle: { points: 100, description: 'Tartaruga identificada' },
  
  // Ações corretas (+50)
  markNest: { points: 50, description: 'Ninho marcado e protegido' },
  scareVulture: { points: 50, description: 'Predador afastado eticamente' },
  observeAdult: { points: 50, description: 'Observação silenciosa realizada' },
  nightPatrol: { points: 50, description: 'Patrulha noturna completada' },
  releaseHatchling: { points: 50, description: 'Filhote liberado com segurança' },
  
  // Descobertas raras (+200)
  findRareSpecies: { points: 200, description: 'Espécie rara documentada!' },
  documentBehavior: { points: 200, description: 'Comportamento único registrado!' },
  saveNestFromPredator: { points: 200, description: 'Ninho salvo no momento crítico!' },
  achievementUnlock: { points: 200, description: 'Conquista desbloqueada!' },
  
  // Ações incorretas (-50)
  disturbAnimal: { points: -50, description: 'Animal perturbado desnecessariamente' },
  skipProtocol: { points: -50, description: 'Protocolo científico ignorado' },
  wrongMeasurement: { points: -50, description: 'Medição incorreta' },
};

interface UseScoreSystemReturn {
  score: number;
  scoreHistory: ScoreChange[];
  lastScoreChange: ScoreChange | null;
  addScore: (action: ScoreAction) => number;
  resetScore: () => void;
  getActionPoints: (action: ScoreAction) => number;
}

export function useScoreSystem(initialScore = 0): UseScoreSystemReturn {
  const [score, setScore] = useState(initialScore);
  const [scoreHistory, setScoreHistory] = useState<ScoreChange[]>([]);
  const [lastScoreChange, setLastScoreChange] = useState<ScoreChange | null>(null);

  const addScore = useCallback((action: ScoreAction): number => {
    const config = SCORE_VALUES[action];
    if (!config) {
      console.warn(`Ação de score não reconhecida: ${action}`);
      return score;
    }

    const change: ScoreChange = {
      action,
      points: config.points,
      timestamp: Date.now(),
      description: config.description,
    };

    // Captura o novo score usando o updater funcional
    let newScore = 0;
    setScore((prev) => {
      newScore = prev + config.points;
      return newScore;
    });
    
    setScoreHistory((prev) => [...prev, change]);
    setLastScoreChange(change);

    // Dispatch evento customizado com o score correto
    window.dispatchEvent(new CustomEvent('scoreChange', { 
      detail: { action, points: config.points, newScore } 
    }));

    return newScore;
  }, [score]);

  const resetScore = useCallback(() => {
    setScore(0);
    setScoreHistory([]);
    setLastScoreChange(null);
  }, []);

  const getActionPoints = useCallback((action: ScoreAction): number => {
    return SCORE_VALUES[action]?.points || 0;
  }, []);

  return {
    score,
    scoreHistory,
    lastScoreChange,
    addScore,
    resetScore,
    getActionPoints,
  };
}
