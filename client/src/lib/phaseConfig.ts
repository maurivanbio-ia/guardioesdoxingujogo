/**
 * phaseConfig - Estrutura modular de fases configuráveis
 * Baseado no documento pedagógico "Guardião do Xingu"
 * 5 Fases educativas progressivas
 */

export type ActivityType = 
  | 'collectTool'
  | 'talkNPC'
  | 'measureTemp'
  | 'measureDepth'
  | 'measureWidth'
  | 'markNest'
  | 'tagTurtle'
  | 'measureTurtle'
  | 'recordPosition'
  | 'scareVulture'
  | 'protectNest'
  | 'releaseHatchling'
  | 'monitorPath'
  | 'resolveImpact'
  | 'openMap'
  | 'useFlashlight';

export interface PhaseActivity {
  id: ActivityType;
  name: string;
  description: string;
  requiredCount?: number;
  points: number;
}

export interface GamePhase {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  goal: number;
  activities: PhaseActivity[];
  minActivitiesRequired?: number;
  unlockMessage: string;
  completionMessage: string;
  educationalFocus: string;
  narrativeContext?: string;
}

export const GAME_PHASES: GamePhase[] = [
  {
    id: 1,
    title: 'Chegada ao Campo',
    subtitle: 'Ambientação e coleta de equipamentos',
    theme: 'Introdução ao Trabalho de Campo',
    goal: 50,
    minActivitiesRequired: 2,
    activities: [
      {
        id: 'collectTool',
        name: 'Coletar Ferramenta',
        description: 'Encontre e colete os equipamentos científicos espalhados pela base',
        requiredCount: 5,
        points: 10,
      },
      {
        id: 'talkNPC',
        name: 'Conhecer a Equipe',
        description: 'Converse com os pesquisadores para receber orientações',
        requiredCount: 1,
        points: 5,
      },
    ],
    unlockMessage: 'Fase 1: Bem-vindo ao Projeto! Colete seus equipamentos e conheça a equipe.',
    completionMessage: 'Excelente! Você está equipado e pronto para iniciar o trabalho de campo.',
    educationalFocus: 'Introdução aos conceitos básicos de conservação de quelônios e familiarização com o ambiente de pesquisa.',
    narrativeContext: 'Você chega à base do projeto nas margens do rio Xingu no começo da estação seca. Um pesquisador sênior o recebe e orienta sobre os equipamentos necessários.',
  },
  {
    id: 2,
    title: 'Integração com a Equipe',
    subtitle: 'Diálogos e troca de conhecimentos',
    theme: 'Socialização e Aprendizado Colaborativo',
    goal: 100,
    minActivitiesRequired: 1,
    activities: [
      {
        id: 'talkNPC',
        name: 'Conversar com Pesquisadores',
        description: 'Interaja com os membros da equipe e moradores ribeirinhos',
        requiredCount: 5,
        points: 20,
      },
    ],
    unlockMessage: 'Fase 2: Conheça a equipe e aprenda com suas experiências!',
    completionMessage: 'Parabéns! Você compreendeu que a conservação é um esforço coletivo.',
    educationalFocus: 'A conservação é interdisciplinar e participativa. O trabalho envolve cientistas, conhecimentos tradicionais dos ribeirinhos e educadores.',
    narrativeContext: 'Inserido no contexto do projeto, você precisa interagir com os demais membros da equipe e moradores ribeirinhos para aprender com suas experiências.',
  },
  {
    id: 3,
    title: 'Monitoramento de Ninhos',
    subtitle: 'Protocolos científicos de campo',
    theme: 'Pesquisa e Coleta de Dados',
    goal: 100,
    minActivitiesRequired: 3,
    activities: [
      {
        id: 'markNest',
        name: 'Marcar Ninhos',
        description: 'Identifique e marque ninhos com estacas numeradas',
        requiredCount: 3,
        points: 15,
      },
      {
        id: 'measureTemp',
        name: 'Medir Temperatura',
        description: 'Use o termômetro para registrar a temperatura do ninho',
        requiredCount: 3,
        points: 15,
      },
      {
        id: 'measureDepth',
        name: 'Medir Profundidade',
        description: 'Registre a profundidade do ninho com a régua',
        requiredCount: 2,
        points: 10,
      },
    ],
    unlockMessage: 'Fase 3: Hora de praticar os protocolos científicos de campo!',
    completionMessage: 'Ótimo trabalho! Você dominou as técnicas de monitoramento de ninhos.',
    educationalFocus: 'A temperatura do ninho determina o sexo dos filhotes (acima de 32°C nascem mais fêmeas). Documentação precisa é fundamental para a pesquisa.',
    narrativeContext: 'A temporada de desova está em pleno curso. Você é encarregado de monitorar uma área da praia, identificando ninhos e coletando dados ambientais.',
  },
  {
    id: 4,
    title: 'Ações de Conservação',
    subtitle: 'Proteção ativa e resolução de impactos',
    theme: 'Manejo e Proteção Ambiental',
    goal: 140,
    minActivitiesRequired: 2,
    activities: [
      {
        id: 'resolveImpact',
        name: 'Resolver Impacto Ambiental',
        description: 'Identifique e resolva problemas ambientais na área',
        requiredCount: 6,
        points: 15,
      },
      {
        id: 'scareVulture',
        name: 'Afastar Predadores',
        description: 'Proteja ninhos afastando urubus e outros predadores',
        requiredCount: 3,
        points: 10,
      },
      {
        id: 'protectNest',
        name: 'Proteger Ninhos',
        description: 'Instale proteções físicas nos ninhos vulneráveis',
        requiredCount: 2,
        points: 15,
      },
    ],
    unlockMessage: 'Fase 4: Proteja os ninhos de ameaças ambientais e predadores!',
    completionMessage: 'Fantástico! Você demonstrou habilidade em proteção e manejo ativo.',
    educationalFocus: 'Resposta a emergências ambientais e intervenção ética para garantir a sobrevivência dos ovos e filhotes.',
    narrativeContext: 'Eventos críticos exigem tomada de decisão rápida. Inundações, predadores e impactos humanos ameaçam os ninhos.',
  },
  {
    id: 5,
    title: 'Pesquisa Biométrica',
    subtitle: 'Medição e documentação de tartarugas',
    theme: 'Biometria e Identificação Individual',
    goal: 160,
    minActivitiesRequired: 2,
    activities: [
      {
        id: 'measureTurtle',
        name: 'Medir Tartaruga',
        description: 'Realize biometria completa (comprimento, largura, peso)',
        requiredCount: 5,
        points: 20,
      },
      {
        id: 'tagTurtle',
        name: 'Identificar Tartaruga',
        description: 'Documente características individuais da tartaruga',
        requiredCount: 3,
        points: 15,
      },
      {
        id: 'recordPosition',
        name: 'Registrar Posição GPS',
        description: 'Documente a localização da tartaruga',
        requiredCount: 2,
        points: 10,
      },
    ],
    unlockMessage: 'Fase 5: Colete dados biométricos das tartarugas adultas!',
    completionMessage: 'Incrível! Você coletou dados valiosos para a pesquisa científica.',
    educationalFocus: 'Cada tartaruga é única. Dados biométricos ajudam a monitorar populações e entender padrões de migração e reprodução.',
    narrativeContext: 'Durante o monitoramento noturno, você pode medir tartarugas adultas que sobem à praia para desovar.',
  },
  {
    id: 6,
    title: 'Guardião do Xingu',
    subtitle: 'Conclusão da jornada',
    theme: 'Reflexão e Ciência Cidadã',
    goal: 100,
    minActivitiesRequired: 2,
    activities: [
      {
        id: 'releaseHatchling',
        name: 'Soltar Filhotes',
        description: 'Participe da soltura de filhotes no rio',
        requiredCount: 5,
        points: 15,
      },
      {
        id: 'monitorPath',
        name: 'Acompanhar Filhotes',
        description: 'Observe os filhotes chegando à água',
        requiredCount: 3,
        points: 10,
      },
    ],
    unlockMessage: 'Fase Final: Celebre as conquistas e receba seu certificado!',
    completionMessage: 'Parabéns, Guardião do Xingu! Você completou sua jornada de conservação.',
    educationalFocus: 'Reflexão sobre o aprendizado e inspiração para ação continuada. A conservação depende de cada um de nós.',
    narrativeContext: 'A temporada chega ao fim. Os filhotes estão prontos para serem devolvidos à natureza em um evento de soltura com a comunidade.',
  },
];

export function getPhaseConfig(phaseId: number): GamePhase | undefined {
  return GAME_PHASES.find((phase) => phase.id === phaseId);
}

export function calculatePhaseProgress(
  phaseId: number,
  completedActivities: Record<ActivityType, number>
): { current: number; goal: number; percentage: number } {
  const phase = getPhaseConfig(phaseId);
  if (!phase) return { current: 0, goal: 0, percentage: 0 };

  let totalPoints = 0;
  phase.activities.forEach((activity) => {
    const timesCompleted = completedActivities[activity.id] || 0;
    const pointsEarned = Math.min(
      timesCompleted * activity.points,
      (activity.requiredCount || Infinity) * activity.points
    );
    totalPoints += pointsEarned;
  });

  const percentage = Math.min((totalPoints / phase.goal) * 100, 100);

  return {
    current: totalPoints,
    goal: phase.goal,
    percentage: Math.round(percentage),
  };
}
