/**
 * Sistema de Pontuação Educativa - Guardiões do Xingu
 * Gerencia pontos de ações positivas e negativas com feedback educativo
 */

export interface EducationalAction {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'positive' | 'negative';
  timestamp: Date;
}

export interface EnvironmentalImpact {
  id: string;
  type: 'lixo' | 'fogueira' | 'oleo' | 'pesca_ilegal' | 'vegetacao' | 'embarcacao';
  name: string;
  description: string;
  position: { x: number; z: number };
  interacted: boolean;
  actions: {
    positive?: {
      label: string;
      description: string;
      points: number;
    };
    negative?: {
      label: string;
      description: string;
      points: number;
    };
    educationalInfo: string;
  };
}

export class EducationalPointsSystem {
  private points: number = 0;
  private actions: EducationalAction[] = [];
  private listeners: ((points: number, action: EducationalAction) => void)[] = [];

  constructor() {
    console.log('📊 Sistema de Pontuação Educativa iniciado');
  }

  getPoints(): number {
    return this.points;
  }

  getActions(): EducationalAction[] {
    return [...this.actions];
  }

  addPoints(actionId: string, name: string, description: string, points: number) {
    const action: EducationalAction = {
      id: actionId,
      name,
      description,
      points,
      category: points > 0 ? 'positive' : 'negative',
      timestamp: new Date(),
    };

    this.points += points;
    this.actions.push(action);

    console.log(`${points > 0 ? '✅' : '❌'} ${name}: ${points > 0 ? '+' : ''}${points} pontos (Total: ${this.points})`);

    this.listeners.forEach(listener => listener(this.points, action));

    return action;
  }

  onPointsChange(callback: (points: number, action: EducationalAction) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (points: number, action: EducationalAction) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  getSummary(): {
    totalPoints: number;
    positiveActions: number;
    negativeActions: number;
    actionsLog: EducationalAction[];
  } {
    return {
      totalPoints: this.points,
      positiveActions: this.actions.filter(a => a.category === 'positive').length,
      negativeActions: this.actions.filter(a => a.category === 'negative').length,
      actionsLog: [...this.actions],
    };
  }

  getPerformanceMessage(): string {
    if (this.points >= 100) {
      return 'Excelente! Você é um verdadeiro Guardião Ambiental do Xingu!';
    } else if (this.points >= 50) {
      return 'Bom trabalho! Continue ajudando a conservar as tartarugas!';
    } else if (this.points >= 0) {
      return 'Você está aprendendo. Preste mais atenção às ações ambientais!';
    } else {
      return 'Cuidado! Suas ações estão prejudicando o ambiente. Reveja suas escolhas.';
    }
  }

  reset() {
    this.points = 0;
    this.actions = [];
    console.log('🔄 Sistema de pontuação resetado');
  }
}

export const ENVIRONMENTAL_IMPACTS: EnvironmentalImpact[] = [
  {
    id: 'lixo_praia',
    type: 'lixo',
    name: 'Lixo Plástico na Praia',
    description: 'Resíduos plásticos abandonados na margem do rio',
    position: { x: -35, z: 30 }, // Norte da praia, lado esquerdo
    interacted: false,
    actions: {
      positive: {
        label: 'Recolher lixo',
        description: 'Você recolheu o lixo corretamente!',
        points: 10,
      },
      negative: {
        label: 'Ignorar',
        description: 'Resíduos acumulados contaminam o ambiente e afetam ninhos.',
        points: -5,
      },
      educationalInfo: 'O lixo plástico ameaça tartarugas e aves aquáticas. Microplásticos podem ser ingeridos pelos filhotes, causando morte por inanição.',
    },
  },
  {
    id: 'fogueira_abandonada',
    type: 'fogueira',
    name: 'Fogueira Abandonada',
    description: 'Restos de fogueira próxima aos ninhos',
    position: { x: 20, z: -10 }, // Centro-sul, lado direito
    interacted: false,
    actions: {
      positive: {
        label: 'Apagar fogo',
        description: 'Você apagou o fogo e protegeu os ninhos!',
        points: 10,
      },
      educationalInfo: 'O calor residual pode alterar a temperatura de incubação dos ninhos. Em Podocnemis expansa, temperaturas acima de 33°C resultam em 100% de fêmeas, comprometendo o equilíbrio da população.',
    },
  },
  {
    id: 'oleo_derramado',
    type: 'oleo',
    name: 'Vazamento de Óleo',
    description: 'Mancha de óleo de embarcação',
    position: { x: 38, z: -42 }, // Sul extremo, lado direito
    interacted: false,
    actions: {
      positive: {
        label: 'Verificar vazamento',
        description: 'Você identificou a fonte do vazamento!',
        points: 10,
      },
      educationalInfo: 'O óleo reduz oxigênio na água e intoxica a fauna aquática. Tartarugas que ingerem óleo sofrem lesões no sistema digestivo e respiratório.',
    },
  },
  {
    id: 'rede_ilegal',
    type: 'pesca_ilegal',
    name: 'Rede de Pesca Ilegal',
    description: 'Rede instalada próxima aos ninhos',
    position: { x: -42, z: -25 }, // Centro-sul, lado esquerdo
    interacted: false,
    actions: {
      positive: {
        label: 'Remover rede',
        description: 'Você removeu a rede ilegal!',
        points: 10,
      },
      negative: {
        label: 'Ignorar',
        description: 'Redes capturam tartarugas acidentalmente, causando afogamento.',
        points: -5,
      },
      educationalInfo: 'A pesca deve respeitar o período de defeso (reprodução) para garantir a recuperação das espécies. Captura acidental de tartarugas em redes é uma das principais causas de mortalidade.',
    },
  },
  {
    id: 'area_desmatada',
    type: 'vegetacao',
    name: 'Área Desmatada',
    description: 'Corte de vegetação ciliar',
    position: { x: 10, z: 45 }, // Norte extremo, centro
    interacted: false,
    actions: {
      positive: {
        label: 'Plantar muda',
        description: 'Você plantou uma muda nativa!',
        points: 10,
      },
      negative: {
        label: 'Ignorar',
        description: 'A remoção da mata ciliar acelera erosão e destrói habitats.',
        points: -5,
      },
      educationalInfo: 'A mata ciliar protege as margens da erosão, regula a temperatura da água e fornece sombra para os ninhos, reduzindo mortalidade embrionária.',
    },
  },
  {
    id: 'embarcacao_barulhenta',
    type: 'embarcacao',
    name: 'Tráfego de Embarcações',
    description: 'Movimento intenso de barcos',
    position: { x: 32, z: 18 }, // Norte, lado direito
    interacted: false,
    actions: {
      educationalInfo: 'O barulho das embarcações espanta as tartarugas das praias de desova. Ondas causadas por barcos em alta velocidade destroem ninhos nas margens.',
    },
  },
];
