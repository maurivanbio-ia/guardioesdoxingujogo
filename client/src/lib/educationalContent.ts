import { EducationalCardData } from '@/components/game/EducationalCard';

export type ActionType = 
  | 'MEASURE_TEMPERATURE'
  | 'MEASURE_DEPTH'
  | 'MEASURE_WIDTH'
  | 'MARK_NEST'
  | 'MEASURE_TURTLE'
  | 'SCARE_VULTURE'
  | 'OBSERVE_VULTURE'
  | 'NIGHT_MONITORING'
  | 'COLLECT_BIOMETRY';

export const EDUCATIONAL_CONTENT: Record<ActionType, EducationalCardData> = {
  MEASURE_TEMPERATURE: {
    id: 'temp-determination',
    title: '🌡️ Temperatura e Determinação Sexual',
    content: 'A temperatura do ninho determina o sexo dos filhotes em Podocnemis expansa! Temperaturas acima de ~32°C tendem a produzir fêmeas, enquanto abaixo de 28°C geram machos. Entre 28-32°C, há uma mistura de ambos.',
    icon: '🐢',
    autoCloseDelay: 8000,
  },
  MEASURE_DEPTH: {
    id: 'nest-depth',
    title: '📐 Profundidade do Ninho',
    content: 'A profundidade do ninho reduz a variação térmica e protege contra predadores como urubus, cães e lagartos. Ninhos mais profundos têm maior taxa de eclosão e melhor proteção dos embriões.',
    icon: '⬇️',
    autoCloseDelay: 8000,
  },
  MEASURE_WIDTH: {
    id: 'nest-width',
    title: '📏 Largura do Ninho',
    content: 'A largura do ninho reflete o porte da fêmea e se relaciona diretamente ao número de ovos depositados. Fêmeas maiores constroem ninhos mais largos para acomodar ninhadas de até 150 ovos!',
    icon: '↔️',
    autoCloseDelay: 8000,
  },
  MARK_NEST: {
    id: 'beach-selection',
    title: '🏖️ Escolha de Praias Arenosas',
    content: 'As fêmeas escolhem praias arenosas porque a areia permite a escavação profunda e mantém umidade adequada. A textura da areia facilita a eclosão dos filhotes e sua jornada até o rio.',
    icon: '🏝️',
    autoCloseDelay: 8000,
  },
  MEASURE_TURTLE: {
    id: 'biometry-importance',
    title: '📏 Importância da Biometria',
    content: 'Medir comprimento, largura da carapaça e peso nos permite monitorar a saúde da população, identificar crescimento anual e detectar mudanças ambientais que afetam as tartarugas.',
    icon: '📐',
    autoCloseDelay: 8000,
  },
  SCARE_VULTURE: {
    id: 'predation-management',
    content: 'Urubus (Coragyps atratus) são necrófagos oportunistas que destroem ninhos recém-expostos. Espantá-los durante o manejo aumenta a taxa de eclosão de 30% para mais de 80%!',
    title: '🦅 Redução da Predação',
    icon: '🛡️',
    autoCloseDelay: 8000,
  },
  OBSERVE_VULTURE: {
    id: 'vulture-behavior',
    title: '🦅 Comportamento do Urubu',
    content: 'Urubus-de-cabeça-preta (Coragyps atratus) localizam ninhos pelo olfato e visão. Eles preferem atacar ninhos recém-cavados e trabalham em grupos de 2 a 5 indivíduos para maximizar o sucesso.',
    icon: '👁️',
    autoCloseDelay: 8000,
  },
  NIGHT_MONITORING: {
    id: 'nocturnal-behavior',
    title: '🌙 Comportamento Noturno',
    content: 'Filhotes de tartaruga emergem principalmente à noite para evitar predadores e o calor intenso do dia. O monitoramento noturno é essencial para protegê-los durante sua primeira jornada até a água.',
    icon: '🌃',
    autoCloseDelay: 8000,
  },
  COLLECT_BIOMETRY: {
    id: 'humidity-role',
    title: '💧 Papel da Umidade na Incubação',
    content: 'A umidade do ninho deve estar entre 70-90% para garantir o desenvolvimento adequado dos embriões. Umidade insuficiente impede a eclosão, enquanto excesso pode causar proliferação de fungos.',
    icon: '💦',
    autoCloseDelay: 8000,
  },
};

export function getEducationalCard(action: ActionType): EducationalCardData {
  return EDUCATIONAL_CONTENT[action];
}
