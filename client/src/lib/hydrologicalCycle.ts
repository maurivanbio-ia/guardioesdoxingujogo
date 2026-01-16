/**
 * Hydrological Cycle Manager
 * Gerencia o ciclo hidrológico (Cheia e Seca) do rio Xingu
 */

import * as THREE from 'three';

export type HydrologicalPhase = 'seca' | 'chuva';

export interface HydrologicalConfig {
  secaWaterLevel: number;    // -0.2 (água baixa - praias expostas)
  chuvaWaterLevel: number;   // 0.8 (água alta - várzeas inundadas)
  transitionDuration: number; // Duração da transição em segundos
}

export class HydrologicalCycleManager {
  private scene: THREE.Scene;
  private config: HydrologicalConfig;
  private currentPhase: HydrologicalPhase = 'seca';
  private waterPlane: THREE.Mesh | null = null;
  private targetWaterLevel: number;
  private currentWaterLevel: number;
  private transitionProgress: number = 1; // 1 = completo, 0 = início
  private isTransitioning: boolean = false;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.config = {
      secaWaterLevel: -0.2,
      chuvaWaterLevel: 0.8,
      transitionDuration: 3.0
    };
    
    this.currentWaterLevel = this.config.secaWaterLevel;
    this.targetWaterLevel = this.config.secaWaterLevel;
    
    // Encontrar o plano de água na cena
    this.scene.traverse((obj) => {
      if (obj.name === 'water') {
        this.waterPlane = obj as THREE.Mesh;
      }
    });
    
    console.log('💧 Sistema de ciclo hidrológico inicializado - Fase:', this.currentPhase);
  }
  
  /**
   * Alterna entre Seca e Chuva
   */
  toggle(): HydrologicalPhase {
    if (this.isTransitioning) {
      console.log('⚠️ Transição já em andamento');
      return this.currentPhase;
    }
    
    // Ciclo: Seca ↔ Chuva
    if (this.currentPhase === 'seca') {
      this.currentPhase = 'chuva';
      this.targetWaterLevel = this.config.chuvaWaterLevel;
    } else {
      this.currentPhase = 'seca';
      this.targetWaterLevel = this.config.secaWaterLevel;
    }
    
    this.isTransitioning = true;
    this.transitionProgress = 0;
    
    console.log(`💧 Alternando para ${this.currentPhase.toUpperCase()}`);
    return this.currentPhase;
  }
  
  /**
   * Define manualmente a fase
   */
  setPhase(phase: HydrologicalPhase): void {
    if (phase === this.currentPhase) return;
    
    this.currentPhase = phase;
    if (phase === 'chuva') {
      this.targetWaterLevel = this.config.chuvaWaterLevel;
    } else {
      this.targetWaterLevel = this.config.secaWaterLevel;
    }
    
    this.isTransitioning = true;
    this.transitionProgress = 0;
  }
  
  /**
   * Retorna a fase atual
   */
  getCurrentPhase(): HydrologicalPhase {
    return this.currentPhase;
  }
  
  /**
   * Retorna o nível atual da água
   */
  getCurrentWaterLevel(): number {
    return this.currentWaterLevel;
  }
  
  /**
   * Verifica se está em transição
   */
  isInTransition(): boolean {
    return this.isTransitioning;
  }
  
  /**
   * Atualiza o ciclo hidrológico
   */
  update(delta: number): { 
    phase: HydrologicalPhase; 
    waterLevel: number; 
    isTransitioning: boolean 
  } {
    // Se está em transição, animar o nível da água
    if (this.isTransitioning) {
      this.transitionProgress += delta / this.config.transitionDuration;
      
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
        this.currentWaterLevel = this.targetWaterLevel;
        console.log(`✅ Transição completa - ${this.currentPhase.toUpperCase()}`);
      } else {
        // Interpolação suave (ease-in-out)
        const t = this.transitionProgress;
        const eased = t < 0.5 
          ? 2 * t * t 
          : 1 - Math.pow(-2 * t + 2, 2) / 2;
        
        // Calcular nível inicial baseado na fase anterior
        const startLevel = this.currentPhase === 'chuva' 
          ? this.config.secaWaterLevel 
          : this.config.chuvaWaterLevel;
        
        this.currentWaterLevel = startLevel + (this.targetWaterLevel - startLevel) * eased;
      }
      
      // Atualizar posição do plano de água
      if (this.waterPlane) {
        this.waterPlane.position.y = this.currentWaterLevel;
      }
    }
    
    // Atualizar iluminação baseado na fase
    this.updateLighting();
    
    return {
      phase: this.currentPhase,
      waterLevel: this.currentWaterLevel,
      isTransitioning: this.isTransitioning
    };
  }
  
  /**
   * Atualiza a iluminação baseado na fase hidrológica
   */
  private updateLighting(): void {
    const sunLight = this.scene.getObjectByName('sunLight') as THREE.DirectionalLight;
    const ambientLight = this.scene.getObjectByName('ambientLight') as THREE.AmbientLight;
    const hemisphere = this.scene.getObjectByName('hemisphereLight') as THREE.HemisphereLight;
    
    if (!sunLight || !ambientLight || !hemisphere) return;
    
    if (this.currentPhase === 'chuva') {
      // Chuva: escuro, nublado, névoa, água alta (várzeas inundadas)
      sunLight.intensity = 1.5;
      ambientLight.intensity = 0.4;
      hemisphere.intensity = 0.6;
      this.scene.background = new THREE.Color(0x5A6B7A); // Céu cinza escuro
      this.scene.fog = new THREE.Fog(0x7A8B9A, 40, 180); // Névoa mais próxima
    } else {
      // Seca: mais claro e seco, água baixa (praias expostas)
      sunLight.intensity = 2.8;
      ambientLight.intensity = 0.7;
      hemisphere.intensity = 0.9;
      this.scene.background = new THREE.Color(0x87CEEB); // Céu azul
      this.scene.fog = new THREE.Fog(0xA3C5D9, 100, 300);
    }
  }
  
  /**
   * Limpa recursos
   */
  dispose(): void {
    // Não há recursos para limpar - as luzes são gerenciadas pela cena
  }
}
