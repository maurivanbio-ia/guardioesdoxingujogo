export type RandomEventType = 
  | 'turtle_nesting'
  | 'vulture_threat'
  | 'rain_storm'
  | 'fisherman_visit'
  | 'rare_species'
  | 'environmental_threat'
  | 'researcher_arrival';

export interface RandomEvent {
  id: string;
  type: RandomEventType;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  duration: number;
  probability: number;
  timeOfDay?: 'day' | 'night' | 'any';
  phase?: number;
}

export const randomEvents: RandomEvent[] = [
  {
    id: 'turtle_nesting_rush',
    type: 'turtle_nesting',
    title: 'Chegada de Tartarugas!',
    description: '🐢 Um grupo de tartarugas está chegando à praia para fazer seus ninhos! Este é um momento crucial para marcar e proteger os ninhos.',
    icon: '🐢',
    xpReward: 25,
    duration: 120,
    probability: 0.15,
    timeOfDay: 'night',
    phase: 2
  },
  {
    id: 'vulture_swarm',
    type: 'vulture_threat',
    title: 'Urubus na Praia!',
    description: '🦅 Um grupo de urubus está ameaçando os ninhos! Espante-os rapidamente para proteger os ovos.',
    icon: '🦅',
    xpReward: 20,
    duration: 90,
    probability: 0.12,
    timeOfDay: 'day'
  },
  {
    id: 'sudden_storm',
    type: 'rain_storm',
    title: 'Tempestade Repentina',
    description: '⛈️ Uma forte tempestade está chegando! As tartarugas podem acelerar a desova. Aproveite para registrar temperaturas dos ninhos.',
    icon: '⛈️',
    xpReward: 15,
    duration: 180,
    probability: 0.1,
    timeOfDay: 'any'
  },
  {
    id: 'fisherman_knowledge',
    type: 'fisherman_visit',
    title: 'Pescador Local',
    description: '🎣 Um pescador local está compartilhando conhecimento tradicional sobre as tartarugas. Converse com ele!',
    icon: '🎣',
    xpReward: 30,
    duration: 150,
    probability: 0.08,
    timeOfDay: 'day',
    phase: 3
  },
  {
    id: 'rare_expansa',
    type: 'rare_species',
    title: 'Tartaruga Gigante!',
    description: '⭐ Uma P. expansa excepcionalmente grande foi avistada! Esta é uma oportunidade rara de coletar dados importantes.',
    icon: '⭐',
    xpReward: 50,
    duration: 120,
    probability: 0.05,
    timeOfDay: 'any',
    phase: 4
  },
  {
    id: 'oil_spill_threat',
    type: 'environmental_threat',
    title: 'Derramamento de Óleo!',
    description: '⚠️ Há um pequeno derramamento de óleo próximo. Limpe rapidamente para proteger o ecossistema!',
    icon: '⚠️',
    xpReward: 40,
    duration: 180,
    probability: 0.07,
    timeOfDay: 'any'
  },
  {
    id: 'researcher_team',
    type: 'researcher_arrival',
    title: 'Equipe de Pesquisa',
    description: '👥 Uma equipe de biólogos visitantes está na área! Compartilhe seus dados e aprenda técnicas avançadas.',
    icon: '👥',
    xpReward: 35,
    duration: 200,
    probability: 0.06,
    timeOfDay: 'day',
    phase: 5
  }
];

class RandomEventsManager {
  private activeEvents: Set<string> = new Set();
  private eventHistory: Array<{ eventId: string; timestamp: number }> = [];
  private lastEventTime: number = 0;
  private minTimeBetweenEvents: number = 300000;

  checkForRandomEvent(
    currentPhase: number,
    timeOfDay: 'day' | 'night',
    gameTime: number
  ): RandomEvent | null {
    if (gameTime - this.lastEventTime < this.minTimeBetweenEvents) {
      return null;
    }

    const eligibleEvents = randomEvents.filter(event => {
      if (this.activeEvents.has(event.id)) return false;
      
      if (event.phase && currentPhase < event.phase) return false;
      
      if (event.timeOfDay && event.timeOfDay !== 'any' && event.timeOfDay !== timeOfDay) {
        return false;
      }

      return Math.random() < event.probability;
    });

    if (eligibleEvents.length === 0) return null;

    const selectedEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
    this.activateEvent(selectedEvent);
    
    return selectedEvent;
  }

  private activateEvent(event: RandomEvent) {
    this.activeEvents.add(event.id);
    this.lastEventTime = Date.now();
    this.eventHistory.push({ eventId: event.id, timestamp: Date.now() });

    setTimeout(() => {
      this.deactivateEvent(event.id);
    }, event.duration * 1000);
  }

  private deactivateEvent(eventId: string) {
    this.activeEvents.delete(eventId);
  }

  isEventActive(eventId: string): boolean {
    return this.activeEvents.has(eventId);
  }

  getEventHistory() {
    return this.eventHistory;
  }

  reset() {
    this.activeEvents.clear();
    this.eventHistory = [];
    this.lastEventTime = 0;
  }
}

export const randomEventsManager = new RandomEventsManager();
