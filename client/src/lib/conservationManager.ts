/**
 * Conservation Index Manager
 * Gerencia o Índice de Conservação (ICX) do jogo
 * Atualiza automaticamente baseado nas ações do jogador
 */

export interface ConservationAction {
  type: 'POSITIVE' | 'NEGATIVE';
  value: number;
  reason: string;
}

export interface ConservationLevel {
  min: number;
  max: number;
  name: string;
  color: string;
  lightColor: string;
  environmentEffect: string;
}

export const CONSERVATION_LEVELS: ConservationLevel[] = [
  {
    min: 0,
    max: 20,
    name: 'Crítico',
    color: '#DC2626',
    lightColor: '#7F1D1D',
    environmentEffect: 'Céu acinzentado, lixo visível, erosão'
  },
  {
    min: 21,
    max: 49,
    name: 'Insuficiente',
    color: '#F59E0B',
    lightColor: '#92400E',
    environmentEffect: 'Céu acinzentado, alguns detritos'
  },
  {
    min: 50,
    max: 79,
    name: 'Regular',
    color: '#FBBF24',
    lightColor: '#FFFFFF',
    environmentEffect: 'Luz neutra, ambiente estável'
  },
  {
    min: 80,
    max: 89,
    name: 'Bom',
    color: '#10B981',
    lightColor: '#FFD700',
    environmentEffect: 'Luz dourada, natureza viva'
  },
  {
    min: 90,
    max: 100,
    name: 'Excelente',
    color: '#059669',
    lightColor: '#FFD700',
    environmentEffect: 'Luz dourada intensa, fauna abundante'
  }
];

// Ações que afetam o ICX
export const ICX_ACTIONS = {
  // Ações positivas
  NEST_MARKED: { type: 'POSITIVE' as const, value: 2, reason: 'Ninho marcado corretamente' },
  TEMPERATURE_MEASURED: { type: 'POSITIVE' as const, value: 1, reason: 'Temperatura registrada' },
  WATER_MONITORED: { type: 'POSITIVE' as const, value: 1, reason: 'Nível da água monitorado' },
  VULTURE_SCARED: { type: 'POSITIVE' as const, value: 3, reason: 'Urubu espantado' },
  FEMALE_OBSERVED: { type: 'POSITIVE' as const, value: 2, reason: 'Fêmea observada' },
  EQUIPMENT_ORGANIZED: { type: 'POSITIVE' as const, value: 5, reason: 'Equipamentos organizados' },
  DIALOGUE_COMPLETED: { type: 'POSITIVE' as const, value: 1, reason: 'Diálogo educativo concluído' },
  NEST_RELOCATED: { type: 'POSITIVE' as const, value: 5, reason: 'Ninho realocado com segurança' },
  COMMUNITY_INFORMED: { type: 'POSITIVE' as const, value: 4, reason: 'Comunidade informada' },
  TOOL_COLLECTED: { type: 'POSITIVE' as const, value: 3, reason: 'Ferramenta científica coletada' },
  
  // Ações negativas
  NEST_DAMAGED: { type: 'NEGATIVE' as const, value: -10, reason: 'Ninho danificado' },
  VULTURE_ATTACK_SUCCESS: { type: 'NEGATIVE' as const, value: -5, reason: 'Urubu conseguiu atacar' },
  ETHICS_VIOLATION: { type: 'NEGATIVE' as const, value: -15, reason: 'Violação de ética científica' },
  EQUIPMENT_MISUSE: { type: 'NEGATIVE' as const, value: -3, reason: 'Equipamento usado incorretamente' },
  WATER_FLOOD_IGNORED: { type: 'NEGATIVE' as const, value: -8, reason: 'Inundação ignorada' },
  TEMPERATURE_CRITICAL_IGNORED: { type: 'NEGATIVE' as const, value: -5, reason: 'Temperatura crítica ignorada' }
};

export class ConservationManager {
  private icx: number;
  private history: Array<{ action: ConservationAction; timestamp: number }>;
  private listeners: Array<(icx: number) => void>;

  constructor(initialICX: number = 75) {
    this.icx = Math.max(0, Math.min(100, initialICX));
    this.history = [];
    this.listeners = [];
  }

  /**
   * Obtém o ICX atual
   */
  getICX(): number {
    return this.icx;
  }

  /**
   * Obtém o nível de conservação atual
   */
  getCurrentLevel(): ConservationLevel {
    return CONSERVATION_LEVELS.find(
      level => this.icx >= level.min && this.icx <= level.max
    ) || CONSERVATION_LEVELS[0];
  }

  /**
   * Atualiza o ICX baseado em uma ação
   */
  updateICX(action: ConservationAction): void {
    const oldICX = this.icx;
    this.icx = Math.max(0, Math.min(100, this.icx + action.value));
    
    // Adiciona ao histórico
    this.history.push({
      action,
      timestamp: Date.now()
    });

    // Limita o histórico a 100 ações
    if (this.history.length > 100) {
      this.history.shift();
    }

    // Notifica listeners se houve mudança
    if (oldICX !== this.icx) {
      this.notifyListeners();
    }

    console.log(`[ICX] ${action.reason}: ${action.value > 0 ? '+' : ''}${action.value} → ${this.icx.toFixed(1)}`);
  }

  /**
   * Registra uma ação predefinida
   */
  recordAction(actionKey: keyof typeof ICX_ACTIONS): void {
    const action = ICX_ACTIONS[actionKey];
    this.updateICX(action);
  }

  /**
   * Adiciona um listener para mudanças no ICX
   */
  addListener(callback: (icx: number) => void): () => void {
    this.listeners.push(callback);
    // Retorna função para remover o listener
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifica todos os listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.icx));
  }

  /**
   * Obtém o histórico de ações
   */
  getHistory(): Array<{ action: ConservationAction; timestamp: number }> {
    return [...this.history];
  }

  /**
   * Obtém estatísticas do ICX
   */
  getStats() {
    const positiveActions = this.history.filter(h => h.action.type === 'POSITIVE').length;
    const negativeActions = this.history.filter(h => h.action.type === 'NEGATIVE').length;
    const totalActions = this.history.length;
    
    return {
      icx: this.icx,
      level: this.getCurrentLevel(),
      positiveActions,
      negativeActions,
      totalActions,
      positiveRate: totalActions > 0 ? (positiveActions / totalActions) * 100 : 0
    };
  }

  /**
   * Reseta o ICX
   */
  reset(newICX: number = 75): void {
    this.icx = Math.max(0, Math.min(100, newICX));
    this.history = [];
    this.notifyListeners();
  }

  /**
   * Obtém a cor da luz do ambiente baseada no ICX
   */
  getEnvironmentLightColor(): string {
    return this.getCurrentLevel().lightColor;
  }

  /**
   * Verifica se o lixo deve aparecer
   */
  shouldSpawnTrash(): boolean {
    return this.icx < 50;
  }

  /**
   * Calcula a taxa de sucesso dos ninhos baseada no ICX
   */
  getNestSuccessRate(): number {
    const level = this.getCurrentLevel();
    if (level.min >= 90) return 0.95;
    if (level.min >= 80) return 0.85;
    if (level.min >= 50) return 0.70;
    if (level.min >= 21) return 0.50;
    return 0.30;
  }
}

// Instância global (será integrada ao GameContext)
export const conservationManager = new ConservationManager(75);
