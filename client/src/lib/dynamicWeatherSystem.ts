import * as THREE from 'three';

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm';

export interface WeatherState {
  type: WeatherType;
  intensity: number; // 0-1
  duration: number; // in seconds
  windSpeed: number; // 0-1
  visibility: number; // 0-1 (fog intensity)
}

export class DynamicWeatherSystem {
  private currentWeather: WeatherState;
  private targetWeather: WeatherState;
  private transitionProgress: number = 0;
  private transitionDuration: number = 30; // 30 seconds for smooth transitions
  private nextWeatherChangeTime: number = 0;
  
  // Conecta ao ciclo hidrológico: chuva só durante fase "chuva"
  private currentHydrologicalPhase: 'seca' | 'chuva' = 'seca';
  
  // Particle systems
  private rainParticles: THREE.Points | null = null;
  private scene: THREE.Scene | null = null;
  private rainGeometry: THREE.BufferGeometry | null = null;
  private rainVelocities: Float32Array | null = null;
  
  constructor() {
    this.currentWeather = this.createWeatherState('clear');
    this.targetWeather = this.createWeatherState('clear');
  }
  
  initialize(scene: THREE.Scene) {
    this.scene = scene;
    this.createRainParticles();
    
    // Agenda primeira mudança de clima
    this.nextWeatherChangeTime = Date.now() + this.getRandomDuration();
  }
  
  /**
   * Define a fase hidrológica atual (seca ou chuva)
   * Durante SECA: apenas clima ensolarado
   * Durante CHUVA: permite todos os tipos de clima
   */
  setHydrologicalPhase(phase: 'seca' | 'chuva') {
    this.currentHydrologicalPhase = phase;
    
    // Se mudou para SECA, força clima limpo imediatamente
    if (phase === 'seca') {
      this.currentWeather = this.createWeatherState('clear');
      this.targetWeather = this.createWeatherState('clear');
      console.log('☀️ Fase SECA - clima sempre ensolarado');
    } else {
      console.log('🌧️ Fase CHUVA - clima variável permitido');
    }
  }
  
  private createWeatherState(type: WeatherType): WeatherState {
    const states: Record<WeatherType, WeatherState> = {
      clear: { type: 'clear', intensity: 0, duration: 600, windSpeed: 0.1, visibility: 1 },
      cloudy: { type: 'cloudy', intensity: 0.3, duration: 300, windSpeed: 0.2, visibility: 0.9 },
      rain: { type: 'rain', intensity: 0.5, duration: 180, windSpeed: 0.4, visibility: 0.7 },
      heavy_rain: { type: 'heavy_rain', intensity: 0.8, duration: 120, windSpeed: 0.6, visibility: 0.5 },
      storm: { type: 'storm', intensity: 1.0, duration: 90, windSpeed: 0.8, visibility: 0.4 }
    };
    
    return { ...states[type] };
  }
  
  private createRainParticles() {
    if (!this.scene) return;
    
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    
    // Initialize rain particles in a large area
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200; // x
      positions[i * 3 + 1] = Math.random() * 100 + 20; // y (start high)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z
      
      velocities[i] = Math.random() * 0.5 + 0.5; // fall speed variation
    }
    
    this.rainGeometry = new THREE.BufferGeometry();
    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainVelocities = velocities;
    
    const rainMaterial = new THREE.PointsMaterial({
      color: 0x87CEEB,
      size: 0.3,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    
    this.rainParticles = new THREE.Points(this.rainGeometry, rainMaterial);
    this.scene.add(this.rainParticles);
  }
  
  private getRandomDuration(): number {
    // Weather changes every 2-5 minutes in game time
    return (Math.random() * 180 + 120) * 1000; // 2-5 minutes in ms
  }
  
  private selectRandomWeather(): WeatherType {
    // Durante SECA: apenas ensolarado
    if (this.currentHydrologicalPhase === 'seca') {
      return 'clear';
    }
    
    // Durante CHUVA: clima variável
    const weights = {
      clear: 0.3,
      cloudy: 0.25,
      rain: 0.25,
      heavy_rain: 0.15,
      storm: 0.05
    };
    
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [weather, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        return weather as WeatherType;
      }
    }
    
    return 'clear';
  }
  
  update(deltaTime: number) {
    const now = Date.now();
    
    // Durante SECA: força clima limpo
    if (this.currentHydrologicalPhase === 'seca') {
      if (this.currentWeather.type !== 'clear') {
        this.currentWeather = this.createWeatherState('clear');
        this.targetWeather = this.createWeatherState('clear');
      }
      // Mantém partículas de chuva invisíveis durante SECA
      if (this.rainParticles) {
        const material = this.rainParticles.material as THREE.PointsMaterial;
        material.opacity = 0;
      }
      return; // Não processa mudanças de clima durante SECA
    }
    
    // Durante CHUVA: permite mudanças de clima
    if (now >= this.nextWeatherChangeTime) {
      this.triggerWeatherChange(this.selectRandomWeather());
      this.nextWeatherChangeTime = now + this.getRandomDuration();
    }
    
    // Update transition
    if (this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + deltaTime / this.transitionDuration);
      this.interpolateWeather();
    }
    
    // Update rain particles
    this.updateRainParticles(deltaTime);
  }
  
  private interpolateWeather() {
    const t = this.transitionProgress;
    
    this.currentWeather.intensity = THREE.MathUtils.lerp(
      this.currentWeather.intensity,
      this.targetWeather.intensity,
      t
    );
    
    this.currentWeather.windSpeed = THREE.MathUtils.lerp(
      this.currentWeather.windSpeed,
      this.targetWeather.windSpeed,
      t
    );
    
    this.currentWeather.visibility = THREE.MathUtils.lerp(
      this.currentWeather.visibility,
      this.targetWeather.visibility,
      t
    );
  }
  
  private updateRainParticles(deltaTime: number) {
    if (!this.rainGeometry || !this.rainVelocities || !this.rainParticles) return;
    
    const positions = this.rainGeometry.attributes.position.array as Float32Array;
    const intensity = this.currentWeather.intensity;
    
    // Update rain particle opacity based on weather intensity
    const material = this.rainParticles.material as THREE.PointsMaterial;
    material.opacity = intensity * 0.6;
    
    // Move particles down
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] -= this.rainVelocities[i] * deltaTime * 80 * (1 + intensity);
      
      // Add horizontal wind drift
      positions[i * 3] += this.currentWeather.windSpeed * deltaTime * 5;
      
      // Reset particles that fall too low
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = Math.random() * 100 + 20;
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      }
    }
    
    this.rainGeometry.attributes.position.needsUpdate = true;
  }
  
  triggerWeatherChange(newWeather: WeatherType) {
    // Durante SECA: bloqueia mudanças de clima (exceto para 'clear')
    if (this.currentHydrologicalPhase === 'seca' && newWeather !== 'clear') {
      console.log('☀️ Fase SECA - mudança de clima bloqueada');
      return;
    }
    
    console.log(`🌦️ Mudança climática: ${this.currentWeather.type} → ${newWeather}`);
    
    this.targetWeather = this.createWeatherState(newWeather);
    this.transitionProgress = 0;
    
    // Dispatch event for UI notification
    window.dispatchEvent(new CustomEvent('weatherChange', {
      detail: {
        from: this.currentWeather.type,
        to: newWeather,
        intensity: this.targetWeather.intensity
      }
    }));
  }
  
  getCurrentWeather(): WeatherState {
    return { ...this.currentWeather };
  }
  
  getFogDensity(): number {
    return (1 - this.currentWeather.visibility) * 0.015;
  }
  
  getRainIntensity(): number {
    return this.currentWeather.intensity;
  }
  
  dispose() {
    if (this.rainParticles && this.scene) {
      this.scene.remove(this.rainParticles);
      this.rainGeometry?.dispose();
      (this.rainParticles.material as THREE.Material).dispose();
    }
  }
}

export const weatherSystem = new DynamicWeatherSystem();
