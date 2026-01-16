/**
 * Day/Night Cycle Manager
 * Gerencia o ciclo de dia e noite baseado no horário de Altamira-PA (UTC-3)
 */

import * as THREE from 'three';

export interface TimeConfig {
  sunriseHour: number;   // 6h
  sunsetHour: number;    // 18h
  nightStartHour: number; // 19h
}

export class DayNightCycleManager {
  private scene: THREE.Scene;
  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemisphere: THREE.HemisphereLight;
  private config: TimeConfig;
  private forceDayMode: boolean = false; // Forçar modo dia claro
  
  // Sistema de tempo acelerado do jogo
  private gameTimeHour: number = 8; // Começa às 8h da manhã
  private gameTimeMinute: number = 0;
  private timeSpeed: number = 60; // 1 minuto real = 60 minutos de jogo (1h real = 1 dia completo)
  private lastUpdateTime: number = Date.now();
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.config = {
      sunriseHour: 6,
      sunsetHour: 18,
      nightStartHour: 19
    };
    
    // Encontrar luzes na cena
    this.sunLight = this.scene.getObjectByName('sunLight') as THREE.DirectionalLight;
    this.ambientLight = this.scene.getObjectByName('ambientLight') as THREE.AmbientLight;
    this.hemisphere = this.scene.getObjectByName('hemisphereLight') as THREE.HemisphereLight;
    
    console.log('⏰ Tempo de jogo iniciado às', this.getFormattedTime());
  }
  
  /**
   * Toggle forçar modo dia claro (ignora horário real)
   */
  toggleForceDayMode(): boolean {
    this.forceDayMode = !this.forceDayMode;
    return this.forceDayMode;
  }
  
  /**
   * Verifica se está no modo dia forçado
   */
  isForceDayMode(): boolean {
    return this.forceDayMode;
  }
  
  /**
   * Pula para um horário específico (para testes)
   */
  setTime(hour: number, minute: number = 0): void {
    this.gameTimeHour = hour;
    this.gameTimeMinute = minute;
    console.log(`⏰ Horário alterado para ${this.getFormattedTime()}`);
  }
  
  /**
   * Acelera o tempo para noite (útil para testes)
   */
  skipToNight(): void {
    this.setTime(20, 0); // 20h - meio da noite
    console.log('🌙 Pulando para noite (20h)');
  }
  
  /**
   * Acelera o tempo para dia
   */
  skipToDay(): void {
    this.setTime(12, 0); // 12h - meio-dia
    console.log('☀️ Pulando para dia (12h)');
  }
  
  /**
   * Obtém o horário acelerado do jogo
   */
  getCurrentAltamiraTime(): { hour: number; minute: number } {
    return {
      hour: Math.floor(this.gameTimeHour) % 24,
      minute: Math.floor(this.gameTimeMinute) % 60
    };
  }
  
  /**
   * Avança o tempo do jogo baseado no tempo real decorrido
   */
  private advanceGameTime(): void {
    const now = Date.now();
    const deltaSeconds = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;
    
    // Avançar minutos do jogo baseado na velocidade
    const gameMinutesElapsed = deltaSeconds * (this.timeSpeed / 60);
    this.gameTimeMinute += gameMinutesElapsed;
    
    // Converter minutos excedentes em horas
    while (this.gameTimeMinute >= 60) {
      this.gameTimeMinute -= 60;
      this.gameTimeHour += 1;
      
      // Log a cada hora que passa
      const hour = Math.floor(this.gameTimeHour) % 24;
      if (hour === 18) {
        console.log('🌅 Crepúsculo - O sol está se pondo...');
      } else if (hour === 19) {
        console.log('🌙 Noite - Escureceu! Use a lanterna (F)');
      } else if (hour === 6) {
        console.log('☀️ Amanhecer - Um novo dia começou!');
      }
    }
    
    // Manter hora no intervalo 0-24
    if (this.gameTimeHour >= 24) {
      this.gameTimeHour = this.gameTimeHour % 24;
    }
  }
  
  /**
   * Atualiza a iluminação baseado no horário
   */
  update(): { isNight: boolean; needsFlashlight: boolean; timeOfDay: string } {
    // Avançar o tempo do jogo
    this.advanceGameTime();
    
    // Se modo dia forçado, sempre retornar dia claro
    if (this.forceDayMode) {
      this.applyDayLighting();
      return { isNight: false, needsFlashlight: false, timeOfDay: 'day' };
    }
    
    const time = this.getCurrentAltamiraTime();
    const hourDecimal = time.hour + time.minute / 60;
    
    let isNight = false;
    let needsFlashlight = false;
    let timeOfDay = 'day';
    
    if (hourDecimal >= this.config.sunsetHour && hourDecimal < this.config.nightStartHour) {
      // Crepúsculo (18h - 19h)
      this.applyTwilightLighting(hourDecimal);
      timeOfDay = 'twilight';
      isNight = true;
    } else if (hourDecimal >= this.config.nightStartHour || hourDecimal < this.config.sunriseHour) {
      // Noite (19h - 6h)
      this.applyNightLighting();
      timeOfDay = 'night';
      isNight = true;
      needsFlashlight = true;
    } else {
      // Dia (6h - 18h)
      this.applyDayLighting();
      timeOfDay = 'day';
    }
    
    return { isNight, needsFlashlight, timeOfDay };
  }
  
  /**
   * Iluminação diurna
   */
  private applyDayLighting(): void {
    if (!this.sunLight || !this.ambientLight || !this.hemisphere) return;
    
    this.sunLight.color.setHex(0xFFE8B3); // Dourado quente
    this.sunLight.intensity = 2.8;
    
    this.ambientLight.color.setHex(0xFFF4E0);
    this.ambientLight.intensity = 0.7;
    
    this.hemisphere.color.setHex(0xB8D8E8); // Céu azul
    this.hemisphere.groundColor.setHex(0xE8C89C);
    this.hemisphere.intensity = 0.9;
    
    this.scene.background = new THREE.Color(0x87CEEB); // Céu azul
    this.scene.fog = new THREE.Fog(0xA3C5D9, 100, 300);
  }
  
  /**
   * Iluminação crepuscular (18h - 19h)
   */
  private applyTwilightLighting(hourDecimal: number): void {
    if (!this.sunLight || !this.ambientLight || !this.hemisphere) return;
    
    // Interpolação entre dia e noite
    const twilightProgress = (hourDecimal - this.config.sunsetHour) / 
                            (this.config.nightStartHour - this.config.sunsetHour);
    
    // Cores do pôr do sol
    this.sunLight.color.setHex(0xFF6B35); // Laranja avermelhado
    this.sunLight.intensity = 1.5 - (twilightProgress * 1.2);
    
    this.ambientLight.color.setHex(0xFF8C69); // Rosa alaranjado
    this.ambientLight.intensity = 0.5 - (twilightProgress * 0.3);
    
    this.hemisphere.color.setHex(0xFF6B6B); // Céu avermelhado
    this.hemisphere.groundColor.setHex(0x4A4A4A);
    this.hemisphere.intensity = 0.6 - (twilightProgress * 0.4);
    
    this.scene.background = new THREE.Color(0x4A5460); // Céu escurecendo
    this.scene.fog = new THREE.Fog(0x2A3A45, 80, 250);
  }
  
  /**
   * Iluminação noturna (19h - 6h) - MUITO MAIS ESCURA para destacar lanterna
   */
  private applyNightLighting(): void {
    if (!this.sunLight || !this.ambientLight || !this.hemisphere) return;
    
    this.sunLight.color.setHex(0x050510); // Quase preto
    this.sunLight.intensity = 0.02; // Quase sem luz solar
    
    this.ambientLight.color.setHex(0x03030A); // Praticamente preto
    this.ambientLight.intensity = 0.04; // Muito baixa
    
    this.hemisphere.color.setHex(0x020208); // Céu noturno muito escuro
    this.hemisphere.groundColor.setHex(0x0A0A0A);
    this.hemisphere.intensity = 0.05; // Muito baixa
    
    this.scene.background = new THREE.Color(0x000005); // Céu quase preto
    this.scene.fog = new THREE.Fog(0x000000, 20, 100); // Neblina muito escura e próxima
  }
  
  /**
   * Obtém informação formatada do horário
   */
  getFormattedTime(): string {
    const time = this.getCurrentAltamiraTime();
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
  }
  
  /**
   * Limpa recursos (método vazio, não há recursos a limpar)
   */
  dispose(): void {
    // Não há recursos para limpar - as luzes são gerenciadas pela cena
  }
}
