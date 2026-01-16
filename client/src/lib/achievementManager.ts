/**
 * Achievement System
 * Sistema de conquistas do jogo
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  condition: {
    type: 'ETHICS' | 'AWARENESS' | 'ICX' | 'COMPLETE_ALL' | 'PHASE_MASTERY' | 'ACTIONS_COMPLETE';
    threshold?: number;
    phase?: number;
    requiredActions?: string[];  // Ações específicas requeridas
    minActions?: number;  // Número mínimo de ações diferentes
  };
  unlocked: boolean;
  unlockedAt?: Date;
  effect: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ethical_researcher',
    title: 'Pesquisador Ético',
    description: 'Manter Ética Científica ≥ 90% durante todo o projeto',
    icon: '⚖️',
    iconColor: 'from-amber-400 to-yellow-500',
    condition: {
      type: 'ETHICS',
      threshold: 90
    },
    unlocked: false,
    effect: 'Ícone de balança brilhante'
  },
  {
    id: 'environmental_educator',
    title: 'Educador Ambiental',
    description: 'Conscientização ≥ 70% (ler 7+ curiosidades científicas)',
    icon: '🍃',
    iconColor: 'from-green-400 to-emerald-500',
    condition: {
      type: 'AWARENESS',
      threshold: 70
    },
    unlocked: false,
    effect: 'Folha dourada animada'
  },
  {
    id: 'river_guardian',
    title: 'Guardião do Rio',
    description: 'Alcançar ICX ≥ 85 (salvar muitas tartarugas e proteger ninhos)',
    icon: '🐢',
    iconColor: 'from-blue-400 to-cyan-500',
    condition: {
      type: 'ICX',
      threshold: 85
    },
    unlocked: false,
    effect: 'Tartaruga translúcida azul'
  },
  {
    id: 'nest_specialist',
    title: 'Especialista em Ninhos',
    description: 'Realizar todas as 5 ações de monitoramento de ninhos',
    icon: '🥚',
    iconColor: 'from-orange-400 to-red-500',
    condition: {
      type: 'ACTIONS_COMPLETE',
      minActions: 1,  // Cada ação precisa ser feita pelo menos 1x
      requiredActions: ['markNest', 'measureTemp', 'measureDepth', 'measureWidth', 'collectBiometry']
    },
    unlocked: false,
    effect: 'Ovo dourado brilhante'
  },
  {
    id: 'wildlife_protector',
    title: 'Protetor da Fauna',
    description: 'Espantar 10+ urubus e medir 5+ tartarugas',
    icon: '🦅',
    iconColor: 'from-teal-400 to-cyan-500',
    condition: {
      type: 'ACTIONS_COMPLETE',
      minActions: 1,  // Placeholder - lógica especial abaixo
      requiredActions: ['scareVulture:10', 'measureTurtle:5']  // formato action:minCount
    },
    unlocked: false,
    effect: 'Escudo protetor animado'
  },
  {
    id: 'environmental_guardian',
    title: 'Guardião Ambiental',
    description: 'Resolver todos os 6 impactos ambientais com ações positivas',
    icon: '🌍',
    iconColor: 'from-green-400 via-emerald-500 to-teal-500',
    condition: {
      type: 'ACTIONS_COMPLETE',
      minActions: 1,
      requiredActions: ['resolveImpact:6']  // Resolver 6 impactos
    },
    unlocked: false,
    effect: 'Globo terrestre brilhante'
  },
  {
    id: 'xingu_hero',
    title: 'Herói do Xingu',
    description: 'Completar todas as 5 fases com ICX ≥ 90% e Ética ≥ 85%',
    icon: '⭐',
    iconColor: 'from-yellow-300 via-amber-400 to-orange-500',
    condition: {
      type: 'COMPLETE_ALL',
      threshold: 90
    },
    unlocked: false,
    effect: 'Estrela cintilante com feixe de luz'
  }
];

export class AchievementManager {
  private achievements: Map<string, Achievement>;
  private listeners: Array<(achievement: Achievement) => void>;

  constructor() {
    this.achievements = new Map();
    this.listeners = [];
    
    // Inicializa com as conquistas padrão
    ACHIEVEMENTS.forEach(achievement => {
      this.achievements.set(achievement.id, { ...achievement });
    });
  }

  /**
   * Verifica e desbloqueia conquistas baseado em métricas
   */
  checkAchievements(metrics: {
    ethics: number;
    awareness: number;
    icx: number;
    allPhasesComplete: boolean;
    completedActions?: Map<string, number>;  // Mapa de ações completadas com contagens
  }): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.achievements.forEach((achievement) => {
      // Já desbloqueada, ignora
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      switch (achievement.condition.type) {
        case 'ETHICS':
          shouldUnlock = metrics.ethics >= (achievement.condition.threshold || 0);
          break;
        case 'AWARENESS':
          shouldUnlock = metrics.awareness >= (achievement.condition.threshold || 0);
          break;
        case 'ICX':
          shouldUnlock = metrics.icx >= (achievement.condition.threshold || 0);
          break;
        case 'COMPLETE_ALL':
          shouldUnlock = metrics.allPhasesComplete && 
                        metrics.icx >= (achievement.condition.threshold || 0) &&
                        metrics.ethics >= 85;
          break;
        case 'ACTIONS_COMPLETE':
          if (metrics.completedActions && achievement.condition.requiredActions) {
            // Check if each action meets its minimum requirement
            shouldUnlock = achievement.condition.requiredActions.every(actionSpec => {
              // Format: "action" or "action:minCount"
              const [action, minCountStr] = actionSpec.split(':');
              const minCount = minCountStr ? parseInt(minCountStr, 10) : (achievement.condition.minActions || 1);
              const actualCount = metrics.completedActions?.get(action) || 0;
              return actualCount >= minCount;
            });
          }
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
        
        // Notifica listeners
        this.notifyListeners(achievement);
        
        console.log(`🏆 Conquista desbloqueada: ${achievement.title}`);
      }
    });

    return newlyUnlocked;
  }

  /**
   * Obtém todas as conquistas
   */
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Obtém conquistas desbloqueadas
   */
  getUnlockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => a.unlocked);
  }

  /**
   * Obtém conquistas bloqueadas
   */
  getLockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => !a.unlocked);
  }

  /**
   * Obtém uma conquista específica
   */
  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }

  /**
   * Verifica se uma conquista está desbloqueada
   */
  isUnlocked(id: string): boolean {
    return this.achievements.get(id)?.unlocked || false;
  }

  /**
   * Adiciona um listener para conquistas desbloqueadas
   */
  addListener(callback: (achievement: Achievement) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifica listeners
   */
  private notifyListeners(achievement: Achievement): void {
    this.listeners.forEach(listener => listener(achievement));
  }

  /**
   * Obtém progresso geral das conquistas
   */
  getProgress(): {
    total: number;
    unlocked: number;
    percentage: number;
  } {
    const total = this.achievements.size;
    const unlocked = this.getUnlockedAchievements().length;
    return {
      total,
      unlocked,
      percentage: total > 0 ? (unlocked / total) * 100 : 0
    };
  }

  /**
   * Reseta todas as conquistas
   */
  reset(): void {
    this.achievements.forEach(achievement => {
      achievement.unlocked = false;
      delete achievement.unlockedAt;
    });
  }
}

// Instância global
export const achievementManager = new AchievementManager();
