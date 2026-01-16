/**
 * useCardSystem - Sistema de cards contextuais integrados às atividades
 * Cards aparecem em resposta a ações específicas do jogador
 */
import { useState, useCallback, useEffect } from 'react';

export interface ContextualCard {
  id: string;
  eventKey: string;
  title: string;
  text: string;
  icon?: string;
  duration?: number; // em milissegundos
  position?: 'bottom' | 'top' | 'center';
  audioUrl?: string; // URL do arquivo de áudio (narração)
}

// Biblioteca de cards contextuais por atividade
// Cada atividade pode ter 2-3 variações para maior imersão
export const CONTEXTUAL_CARDS: Record<string, ContextualCard[]> = {
  measureTemp: [
    {
      id: 'card_temp_1',
      eventKey: 'measureTemp',
      title: '🌡️ Temperatura do Ninho',
      text: 'A temperatura influencia o sexo dos filhotes: acima de 32°C nascem mais fêmeas, abaixo de 28°C mais machos.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_temp_2',
      eventKey: 'measureTemp',
      title: '🌡️ Temperatura e Aquecimento Global',
      text: 'Temperaturas extremas podem inviabilizar ninhos inteiros. O aquecimento global afeta diretamente a reprodução.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_temp_3',
      eventKey: 'measureTemp',
      title: '🌡️ Determinação Sexual',
      text: 'Tartarugas não têm cromossomos sexuais — o sexo é determinado pela temperatura durante a incubação!',
      duration: 8000,
      position: 'bottom',
    },
  ],
  measureDepth: [
    {
      id: 'card_depth_1',
      eventKey: 'measureDepth',
      title: '📏 Profundidade Ideal',
      text: 'A profundidade protege os ovos de predadores e da insolação direta. Ninhos rasos têm maior risco de predação.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_depth_2',
      eventKey: 'measureDepth',
      title: '📏 Estratégia da Fêmea',
      text: 'Fêmeas cavam 40-60 cm de profundidade usando apenas as nadadeiras traseiras — um trabalho exaustivo!',
      duration: 8000,
      position: 'bottom',
    },
  ],
  measureWidth: [
    {
      id: 'card_width_1',
      eventKey: 'measureWidth',
      title: '📐 Largura do Ninho',
      text: 'A largura do ninho indica quantos ovos a fêmea depositou. Tartarugas maiores fazem ninhos mais largos.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_width_2',
      eventKey: 'measureWidth',
      title: '📐 Capacidade Reprodutiva',
      text: 'Uma fêmea adulta pode botar 60-150 ovos por ninhada, dependendo da espécie e idade!',
      duration: 8000,
      position: 'bottom',
    },
  ],
  markNest: [
    {
      id: 'card_mark_1',
      eventKey: 'markNest',
      title: '🏷️ Marcação de Ninho',
      text: 'Marcar ninhos permite o monitoramento contínuo e protege contra pisoteio acidental de pesquisadores.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_mark_2',
      eventKey: 'markNest',
      title: '🏷️ Registro Científico',
      text: 'Cada ninho marcado gera dados sobre sucesso reprodutivo, período de incubação e taxa de eclosão.',
      duration: 8000,
      position: 'bottom',
    },
  ],
  scareVulture: [
    {
      id: 'card_vulture_1',
      eventKey: 'scareVulture',
      title: '🦅 Urubus e Conservação',
      text: 'Os urubus são importantes decompositores, mas podem atacar ninhos desprotegidos. O manejo deve ser ético.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_vulture_2',
      eventKey: 'scareVulture',
      title: '🦅 Predação Natural',
      text: 'Urubus memorizam locais de ninhos e retornam. Por isso monitoramos diariamente as áreas de reprodução.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_vulture_3',
      eventKey: 'scareVulture',
      title: '🦅 Equilíbrio Ecológico',
      text: 'Espantar predadores é uma intervenção temporária — não podemos eliminar espécies nativas do ecossistema.',
      duration: 8000,
      position: 'bottom',
    },
  ],
  tagTurtle: [
    {
      id: 'card_tag_1',
      eventKey: 'tagTurtle',
      title: '🏷️ Identificação Individual',
      text: 'Cada tartaruga marcada nos ajuda a entender migração, crescimento e comportamento reprodutivo.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_tag_2',
      eventKey: 'tagTurtle',
      title: '🏷️ Marcação Permanente',
      text: 'Usamos microchips e anilhas metálicas que duram a vida toda — até 80 anos em algumas espécies!',
      duration: 8000,
      position: 'bottom',
    },
  ],
  measureTurtle: [
    {
      id: 'card_measure_1',
      eventKey: 'measureTurtle',
      title: '📊 Biometria Científica',
      text: 'Medir comprimento e largura da carapaça permite estimar idade, saúde e sucesso reprodutivo.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_measure_2',
      eventKey: 'measureTurtle',
      title: '📊 Protocolo de Medição',
      text: 'Medimos sempre no mesmo ponto da carapaça para garantir comparabilidade entre estudos diferentes.',
      duration: 8000,
      position: 'bottom',
    },
  ],
  releaseHatchling: [
    {
      id: 'card_release_1',
      eventKey: 'releaseHatchling',
      title: '🐢 Soltura de Filhotes',
      text: 'Apenas 2% dos filhotes chegam à vida adulta — cada um é vital para a espécie. A natureza é desafiadora.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_release_2',
      eventKey: 'releaseHatchling',
      title: '🐢 Imprinting Natural',
      text: 'Filhotes devem caminhar sozinhos até o rio para memorizar o local de nascimento e retornar no futuro.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_release_3',
      eventKey: 'releaseHatchling',
      title: '🐢 Timing Perfeito',
      text: 'A soltura deve ocorrer ao entardecer — assim filhotes evitam o calor extremo e a predação por aves.',
      duration: 8000,
      position: 'bottom',
    },
  ],
  findEgg: [
    {
      id: 'card_egg_1',
      eventKey: 'findEgg',
      title: '🥚 Ovos de Quelônio',
      text: 'Ovos de tartaruga têm casca flexível e precisam de umidade constante. Nunca virá-los durante o manejo!',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_egg_2',
      eventKey: 'findEgg',
      title: '🥚 Desenvolvimento Embrionário',
      text: 'O embrião se fixa na parte superior do ovo. Virar após 24h pode matá-lo. Sempre marque o topo ao coletar!',
      duration: 8000,
      position: 'bottom',
    },
  ],
  observeAdult: [
    {
      id: 'card_observe_1',
      eventKey: 'observeAdult',
      title: '👁️ Observação Silenciosa',
      text: 'Não perturbar os animais durante a reprodução é fundamental. Estresse pode causar abandono do ninho.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_observe_2',
      eventKey: 'observeAdult',
      title: '👁️ Ética na Pesquisa',
      text: 'Distância mínima de 5 metros, sem luz direta, sem tocar. O bem-estar animal vem antes dos dados.',
      duration: 8000,
      position: 'bottom',
    },
  ],
  collectData: [
    {
      id: 'card_data_1',
      eventKey: 'collectData',
      title: '📝 Coleta de Dados',
      text: 'Cada medida coletada contribui para a ciência conservacionista e políticas públicas de proteção.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_data_2',
      eventKey: 'collectData',
      title: '📝 Ciência Cidadã',
      text: 'Dados de campo alimentam modelos de conservação usados pelo ICMBio e universidades brasileiras.',
      duration: 8000,
      position: 'bottom',
    },
  ],
  nightPatrol: [
    {
      id: 'card_patrol_1',
      eventKey: 'nightPatrol',
      title: '🌙 Patrulha Noturna',
      text: 'Tartarugas sobem à praia principalmente à noite. O trabalho de campo exige dedicação em horários desafiadores.',
      duration: 8000,
      position: 'bottom',
    },
    {
      id: 'card_patrol_2',
      eventKey: 'nightPatrol',
      title: '🌙 Rotina do Pesquisador',
      text: 'Patrulhas noturnas acontecem de 4 em 4 horas, durante toda a temporada reprodutiva (setembro a novembro).',
      duration: 8000,
      position: 'bottom',
    },
  ],
};

interface UseCardSystemReturn {
  activeCard: ContextualCard | null;
  showCard: (eventKey: string) => void;
  hideCard: () => void;
  cardHistory: string[];
}

export function useCardSystem(): UseCardSystemReturn {
  const [activeCard, setActiveCard] = useState<ContextualCard | null>(null);
  const [cardHistory, setCardHistory] = useState<string[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const hideCard = useCallback(() => {
    // O áudio será parado pelo useEffect do ContextualCardDisplay
    setActiveCard(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showCard = useCallback((eventKey: string) => {
    const cardOptions = CONTEXTUAL_CARDS[eventKey];
    if (!cardOptions || cardOptions.length === 0) {
      console.warn(`Card não encontrado para eventKey: ${eventKey}`);
      return;
    }

    // Seleciona um card aleatório entre as opções disponíveis
    const randomIndex = Math.floor(Math.random() * cardOptions.length);
    const card = cardOptions[randomIndex];

    // Esconder card anterior
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Mostrar novo card
    setActiveCard(card);
    setCardHistory((prev) => [...prev, eventKey]);

    // Auto-esconder após duração
    const duration = card.duration || 8000;
    const timeout = setTimeout(() => {
      setActiveCard(null);
      setTimeoutId(null);
    }, duration);
    
    setTimeoutId(timeout);
  }, [timeoutId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Listener para tecla Espaço (fechar card manualmente)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeCard) {
        e.preventDefault();
        hideCard();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCard, hideCard]);

  return {
    activeCard,
    showCard,
    hideCard,
    cardHistory,
  };
}
