export interface Phase {
  id: number;
  name: string;
  description: string;
  requiredXP: number;
  currentXP: number;
  npcDialogue: {
    character: string;
    message: string;
    
  };
  completed: boolean;
}

export class PhaseManager {
  private currentPhase: number = 1;
  private phases: Phase[] = [];

  constructor() {
    this.initializePhases();
  }

  private initializePhases() {
    this.phases = [
      {
        id: 1,
        name: "Fase 1 - Chegada ao Campo",
        description: "Colete as 5 ferramentas científicas essenciais para o trabalho de campo",
        requiredXP: 50,
        currentXP: 0,
        npcDialogue: {
          character: "Equipe EcoBrasil",
          message: "Bem-vindo ao Projeto Quelônios do Xingu! Antes de começar as atividades, você precisa coletar suas ferramentas científicas. Explore a praia e encontre: termômetro, régua, balança, caderneta de campo e GPS. São essenciais para o trabalho!"
        },
        completed: false,
      },
      {
        id: 2,
        name: "Fase 2 - Integração com a Equipe",
        description: "Converse com os 5 pesquisadores/ribeirinhos e aprenda sobre o Projeto Tartarugas do Xingu",
        requiredXP: 100,
        currentXP: 0,
        npcDialogue: {
          character: "Dra. Adriana",
          message: "Bem-vindo à equipe! Antes de iniciar os protocolos científicos, é fundamental conhecer a equipe e entender o Projeto Tartarugas do Xingu. Visite a casa de pesquisa e converse com os 5 membros da equipe: Dra. Adriana (coordenadora), Dr. Lucas (reprodução), Zé Raimundo (ribeirinho), Aline (bióloga de campo) e Tainá (estudante indígena). Cada conversa vale +0.5 XP e trará conhecimentos valiosos sobre as espécies, o Tabuleiro do Embaubal e nosso trabalho de conservação!",
        },
        completed: false,
      },
      {
        id: 3,
        name: "Fase 3 - Protocolos Científicos",
        description: "Aprenda os protocolos básicos: marque ninhos e colete primeiros dados",
        requiredXP: 100,
        currentXP: 0,
        npcDialogue: {
          character: "Dra. Aline",
          message: "Agora que você conhece a equipe e entende o projeto, vamos aos protocolos científicos! Marque pelo menos 3 ninhos e use suas ferramentas (termômetro, régua, caderneta) para coletar dados. Cada medição é crucial para a pesquisa!",
        },
        completed: false,
      },
      {
        id: 4,
        name: "Fase 4 - Ações de Conservação",
        description: "Proteja o ecossistema resolvendo impactos ambientais",
        requiredXP: 140,
        currentXP: 0,
        npcDialogue: {
          character: "Zé Raimundo",
          message: "A conservação vai além da pesquisa! Há 6 impactos ambientais na praia: lixo plástico, fogueira abandonada, derramamento de óleo, rede de pesca ilegal, área desmatada e tráfego de barcos. Resolva todos eles de forma positiva!",
        },
        completed: false,
      },
      {
        id: 5,
        name: "Fase 5 - Pesquisa Biométrica",
        description: "Estude tartarugas adultas e complete dados de ninhos",
        requiredXP: 160,
        currentXP: 0,
        npcDialogue: {
          character: "Dr. Lucas",
          message: "Hora da pesquisa avançada! Use a balança e a régua para medir as tartarugas adultas. Complete também a documentação dos ninhos restantes. Dados biométricos são essenciais para entender a saúde populacional!",
        },
        completed: false,
      },
      {
        id: 6,
        name: "Fase 6 - Guardião do Xingu",
        description: "Complete o monitoramento final e receba seu certificado de Guardião",
        requiredXP: 100,
        currentXP: 0,
        npcDialogue: {
          character: "Equipe EcoBrasil",
          message: "Você alcançou a fase final! Complete o estudo de todos os ninhos e tartarugas restantes. Espante urubus quando necessário para proteger os ninhos. Ao finalizar, você receberá o título de Guardião do Xingu e poderá baixar seu certificado oficial mostrando todo o impacto positivo do seu trabalho!",
        },
        completed: false,
      },
    ];
  }

  getCurrentPhase(): Phase {
    return this.phases[this.currentPhase - 1];
  }

  getPhaseNumber(): number {
    return this.currentPhase;
  }

  getTotalPhases(): number {
    return this.phases.length;
  }

  addXP(xp: number): boolean {
    const phase = this.getCurrentPhase();
    
    // Add XP to current phase
    phase.currentXP += xp;
    
    // Check if phase is completed
    if (phase.currentXP >= phase.requiredXP && !phase.completed) {
      phase.completed = true;
      console.log(`🎉 Fase ${phase.id} completa! ${phase.currentXP}/${phase.requiredXP} XP`);
      return true; // Phase completed!
    }

    return false;
  }

  updateObjective(objectiveId: string, increment: number = 1): boolean {
    // Keep for compatibility but does nothing now
    return false;
  }

  checkObjectiveFailed(objectiveId: string): boolean {
    // Keep for compatibility but does nothing now
    return false;
  }

  getPhaseProgress(): { current: number; required: number; percentage: number } {
    const phase = this.getCurrentPhase();
    return {
      current: phase.currentXP,
      required: phase.requiredXP,
      percentage: Math.min(100, (phase.currentXP / phase.requiredXP) * 100)
    };
  }

  canAdvancePhase(): boolean {
    const phase = this.getCurrentPhase();
    return phase.completed && this.currentPhase < this.phases.length;
  }

  advancePhase(): boolean {
    if (!this.canAdvancePhase()) return false;
    
    this.currentPhase++;
    
    // CRITICAL FIX: Reset currentXP of new phase to 0
    const newPhase = this.getCurrentPhase();
    newPhase.currentXP = 0;
    newPhase.completed = false;
    
    console.log(`🚀 Avançado para ${newPhase.name} - XP resetado para 0/${newPhase.requiredXP}`);
    return true;
  }

  isGameComplete(): boolean {
    return this.currentPhase === this.phases.length && this.getCurrentPhase().completed;
  }

  getProgressPercentage(): number {
    const phase = this.getCurrentPhase();
    return Math.round((phase.currentXP / phase.requiredXP) * 100);
  }

  getNextPhase(): Phase | null {
    if (this.currentPhase >= this.phases.length) {
      return null; // No next phase (game complete)
    }
    return this.phases[this.currentPhase]; // Returns next phase (currentPhase is 1-indexed, array is 0-indexed)
  }

  reset() {
    this.currentPhase = 1;
    this.initializePhases();
  }
}
