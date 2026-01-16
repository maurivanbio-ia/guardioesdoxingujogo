/**
 * Dados de Transição de Fases
 */

export interface PhaseTransitionData {
  phase: number;
  title: string;
  description: string;
}

export const PHASE_TRANSITIONS: PhaseTransitionData[] = [
  {
    phase: 1,
    title: 'Chegada ao Campo',
    description:
      'Bem-vindo à estação de pesquisa no Rio Xingu. Doutora Adriana te espera para apresentar a equipe e os procedimentos. Explore a área, conheça seus colegas e prepare-se para o monitoramento.',
  },
  {
    phase: 2,
    title: 'Monitoramento Noturno',
    description:
      'A noite chegou, e com ela a hora crítica do monitoramento. Vista seu colete, pegue sua lanterna e saia para patrulhar as praias. As tartarugas estão saindo para desovar.',
  },
  {
    phase: 3,
    title: 'Eclosão dos Filhotes',
    description:
      'É manhã e os ninhos começam a eclodir! Os filhotes precisam chegar ao rio com segurança. Proteja-os de predadores e registre dados importantes para a ciência.',
  },
  {
    phase: 4,
    title: 'Coleta de Dados Biométricos',
    description:
      'Hora de medir, pesar e marcar as tartarugas. Use os equipamentos científicos com precisão e registre cada medida. Seus dados contribuirão para pesquisas futuras.',
  },
  {
    phase: 5,
    title: 'Análise e Conservação',
    description:
      'É hora de analisar os resultados e entender o impacto do seu trabalho. O Índice de Conservação do Xingu reflete cada decisão que você tomou. Parabéns por completar esta jornada!',
  },
];

/**
 * Obtém os dados de transição para uma fase específica
 */
export function getPhaseTransitionData(phaseNumber: number): PhaseTransitionData | null {
  return PHASE_TRANSITIONS.find((pt) => pt.phase === phaseNumber) || null;
}
