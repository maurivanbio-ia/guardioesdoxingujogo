export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'collection' | 'scientific' | 'conservation' | 'exploration' | 'mastery';
  requirement: number;
  progress: number;
  unlocked: boolean;
  reward: {
    xp: number;
    badge: string;
  };
}

export const ACHIEVEMENT_DATABASE: Achievement[] = [
  {
    id: 'complete_toolset',
    name: 'Colecionador Completo',
    description: 'Colete todas as 5 ferramentas científicas',
    icon: '🔧',
    category: 'collection',
    requirement: 5,
    progress: 0,
    unlocked: false,
    reward: { xp: 50, badge: '🏅' }
  },
  {
    id: 'first_measurement',
    name: 'Primeiro Registro',
    description: 'Realize sua primeira medição científica',
    icon: '📊',
    category: 'scientific',
    requirement: 1,
    progress: 0,
    unlocked: false,
    reward: { xp: 20, badge: '🔬' }
  },
  {
    id: 'all_impacts_resolved',
    name: 'Guardião Ambiental',
    description: 'Resolva todos os 6 impactos ambientais',
    icon: '🌍',
    category: 'conservation',
    requirement: 6,
    progress: 0,
    unlocked: false,
    reward: { xp: 100, badge: '🛡️' }
  },
  {
    id: 'species_expert_expansa',
    name: 'Especialista em P. expansa',
    description: 'Meça 3 tartarugas da espécie Podocnemis expansa',
    icon: '🐢',
    category: 'scientific',
    requirement: 3,
    progress: 0,
    unlocked: false,
    reward: { xp: 75, badge: '🎓' }
  },
  {
    id: 'species_expert_unifilis',
    name: 'Especialista em P. unifilis',
    description: 'Meça 3 tartarugas da espécie Podocnemis unifilis',
    icon: '🐢',
    category: 'scientific',
    requirement: 3,
    progress: 0,
    unlocked: false,
    reward: { xp: 75, badge: '🎓' }
  },
  {
    id: 'species_expert_sextuberculata',
    name: 'Especialista em P. sextuberculata',
    description: 'Meça 3 tartarugas da espécie Podocnemis sextuberculata',
    icon: '🐢',
    category: 'scientific',
    requirement: 3,
    progress: 0,
    unlocked: false,
    reward: { xp: 75, badge: '🎓' }
  },
  {
    id: 'nest_protector',
    name: 'Protetor de Ninhos',
    description: 'Marque 10 ninhos com estacas de identificação',
    icon: '🥚',
    category: 'conservation',
    requirement: 10,
    progress: 0,
    unlocked: false,
    reward: { xp: 80, badge: '🏆' }
  },
  {
    id: 'night_researcher',
    name: 'Pesquisador Noturno',
    description: 'Realize 10 ações durante a noite',
    icon: '🌙',
    category: 'exploration',
    requirement: 10,
    progress: 0,
    unlocked: false,
    reward: { xp: 60, badge: '⭐' }
  },
  {
    id: 'marathon_scientist',
    name: 'Maratonista Científico',
    description: 'Execute 50 ações em uma única sessão',
    icon: '🏃',
    category: 'mastery',
    requirement: 50,
    progress: 0,
    unlocked: false,
    reward: { xp: 150, badge: '💪' }
  },
  {
    id: 'perfect_environmentalist',
    name: 'Ambientalista Perfeito',
    description: 'Resolva todos os impactos com ações positivas (0 ações negativas)',
    icon: '✨',
    category: 'conservation',
    requirement: 6,
    progress: 0,
    unlocked: false,
    reward: { xp: 120, badge: '🌟' }
  },
  {
    id: 'gentle_researcher',
    name: 'Pesquisador Gentil',
    description: 'Complete uma sessão sem assustar nenhuma tartaruga',
    icon: '🤝',
    category: 'mastery',
    requirement: 1,
    progress: 0,
    unlocked: false,
    reward: { xp: 90, badge: '💚' }
  },
  {
    id: 'temperature_master',
    name: 'Mestre da Temperatura',
    description: 'Meça a temperatura de 10 ninhos diferentes',
    icon: '🌡️',
    category: 'scientific',
    requirement: 10,
    progress: 0,
    unlocked: false,
    reward: { xp: 70, badge: '🔥' }
  },
  {
    id: 'vulture_defender',
    name: 'Defensor Anti-Predação',
    description: 'Espante 15 urubus para proteger ninhos',
    icon: '🦅',
    category: 'conservation',
    requirement: 15,
    progress: 0,
    unlocked: false,
    reward: { xp: 85, badge: '🛡️' }
  },
  {
    id: 'data_collector',
    name: 'Coletor de Dados',
    description: 'Use a caderneta de campo 20 vezes',
    icon: '📓',
    category: 'scientific',
    requirement: 20,
    progress: 0,
    unlocked: false,
    reward: { xp: 65, badge: '📚' }
  },
  {
    id: 'xingu_guardian',
    name: 'Guardião do Xingu',
    description: 'Complete todas as 6 fases do projeto',
    icon: '👑',
    category: 'mastery',
    requirement: 6,
    progress: 0,
    unlocked: false,
    reward: { xp: 200, badge: '👑' }
  }
];

export class AchievementsManager {
  private achievements: Map<string, Achievement>;
  
  constructor() {
    this.achievements = new Map();
    ACHIEVEMENT_DATABASE.forEach(achievement => {
      this.achievements.set(achievement.id, { ...achievement });
    });
  }

  updateProgress(achievementId: string, increment: number = 1): Achievement | null {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return null;

    achievement.progress += increment;
    
    if (achievement.progress >= achievement.requirement && !achievement.unlocked) {
      achievement.unlocked = true;
      return achievement; // Return unlocked achievement
    }

    return null;
  }

  unlockAchievement(achievementId: string): Achievement | null {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return null;

    achievement.unlocked = true;
    achievement.progress = achievement.requirement;
    return achievement;
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => a.unlocked);
  }

  getProgressPercentage(): number {
    const total = this.achievements.size;
    const unlocked = this.getUnlockedAchievements().length;
    return Math.round((unlocked / total) * 100);
  }

  reset() {
    ACHIEVEMENT_DATABASE.forEach(achievement => {
      this.achievements.set(achievement.id, { ...achievement, progress: 0, unlocked: false });
    });
  }
}
