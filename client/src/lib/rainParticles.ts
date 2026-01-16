/**
 * Rain Particles System
 * Sistema de partículas de chuva para o estado "Chuva"
 */

import * as THREE from 'three';

export class RainParticlesManager {
  private scene: THREE.Scene;
  private particles: THREE.Points | null = null;
  private particleCount = 5000;
  private positions: Float32Array;
  private velocities: Float32Array;
  private isActive = false;
  private rainAudio: HTMLAudioElement | null = null;
  private audioInitialized = false;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount);
    
    this.createRainParticles();
    // NÃO inicializar áudio no constructor - apenas quando chuva for ativada
    console.log('🌧️ RainParticlesManager criado (áudio será inicializado apenas quando necessário)');
  }
  
  /**
   * Cria o sistema de partículas de chuva
   */
  private createRainParticles(): void {
    const geometry = new THREE.BufferGeometry();
    
    // Inicializar posições aleatórias
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      // Distribuir em uma área ampla sobre a praia
      this.positions[i3] = (Math.random() - 0.5) * 300; // X
      this.positions[i3 + 1] = Math.random() * 50 + 10; // Y (altura)
      this.positions[i3 + 2] = (Math.random() - 0.5) * 300; // Z
      
      // Velocidade variada para cada gota
      this.velocities[i] = Math.random() * 2 + 15;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    
    // Material das gotas de chuva
    const material = new THREE.PointsMaterial({
      color: 0x8BA8C8,
      size: 0.3,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.particles.name = 'rainParticles';
    this.particles.visible = false;
    this.scene.add(this.particles);
    
    console.log('🌧️ Sistema de partículas de chuva criado');
  }
  
  /**
   * Configura o áudio da chuva
   */
  private setupRainAudio(): void {
    // Criar elemento de áudio para chuva (loop contínuo)
    this.rainAudio = new Audio();
    this.rainAudio.loop = true;
    this.rainAudio.volume = 0.3;
    
    // Gerar som sintético de chuva usando Web Audio API
    // Criar um ruído branco filtrado que simula chuva
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = audioContext.sampleRate * 2; // 2 segundos de áudio
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      // Gerar ruído branco com filtro passa-baixa
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5; // Ruído branco atenuado
      }
      
      // Criar source e conectar
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      // Filtro passa-baixa para suavizar (simula chuva)
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000; // Frequência de corte
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Começar mudo
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Guardar referências para controle
      (this as any).audioContext = audioContext;
      (this as any).rainSource = source;
      (this as any).rainGain = gainNode;
      
      source.start();
      console.log('🎵 Sistema de áudio sintético de chuva preparado');
    } catch (error) {
      console.warn('⚠️ Web Audio API não disponível, áudio de chuva desativado');
    }
  }

  /**
   * Ativa ou desativa a chuva
   */
  async setActive(active: boolean): Promise<void> {
    this.isActive = active;
    if (this.particles) {
      this.particles.visible = active;
    }
    
    // Inicializar áudio na primeira vez que a chuva for ativada
    if (active && !this.audioInitialized) {
      this.setupRainAudio();
      this.audioInitialized = true;
    }
    
    // Controlar áudio sintético de chuva
    const audioContext = (this as any).audioContext;
    const rainGain = (this as any).rainGain;
    
    if (audioContext && rainGain) {
      try {
        // Resumir audio context se estiver suspenso (requerido por navegadores)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        // Fade in/out suave para evitar cliques
        const targetVolume = active ? 0.3 : 0;
        rainGain.gain.linearRampToValueAtTime(
          targetVolume, 
          audioContext.currentTime + 0.5
        );
      } catch (error) {
        console.warn('⚠️ Erro ao controlar áudio de chuva:', error);
      }
    }
    
    console.log(`🌧️ Chuva ${active ? 'ATIVADA' : 'DESATIVADA'}`);
  }
  
  /**
   * Verifica se a chuva está ativa
   */
  getIsActive(): boolean {
    return this.isActive;
  }
  
  /**
   * Muta ou desmuta o áudio da chuva
   */
  setMuted(muted: boolean): void {
    const rainGain = (this as any).rainGain;
    const audioContext = (this as any).audioContext;
    
    if (!rainGain || !audioContext) return;
    
    try {
      // Se está mutado, volume = 0, caso contrário usa o volume baseado no estado da chuva
      const targetVolume = muted ? 0 : (this.isActive ? 0.3 : 0);
      rainGain.gain.linearRampToValueAtTime(
        targetVolume, 
        audioContext.currentTime + 0.3
      );
      console.log(`🌧️ Áudio de chuva ${muted ? 'MUTADO' : 'DESMUTADO'}`);
    } catch (error) {
      console.warn('⚠️ Erro ao mutar áudio de chuva:', error);
    }
  }
  
  /**
   * Atualiza as partículas de chuva
   */
  update(delta: number): void {
    if (!this.isActive || !this.particles) return;
    
    const positionAttribute = this.particles.geometry.getAttribute('position') as THREE.BufferAttribute;
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Mover gota para baixo
      this.positions[i3 + 1] -= this.velocities[i] * delta;
      
      // Reiniciar gota quando chega ao chão
      if (this.positions[i3 + 1] < 0) {
        this.positions[i3 + 1] = Math.random() * 50 + 10;
        this.positions[i3] = (Math.random() - 0.5) * 300;
        this.positions[i3 + 2] = (Math.random() - 0.5) * 300;
      }
    }
    
    positionAttribute.needsUpdate = true;
  }
  
  /**
   * Limpa recursos
   */
  dispose(): void {
    if (this.particles) {
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
      this.scene.remove(this.particles);
    }
    
    // Limpar Web Audio API
    const rainSource = (this as any).rainSource;
    const audioContext = (this as any).audioContext;
    
    if (rainSource) {
      rainSource.stop();
      rainSource.disconnect();
    }
    
    if (audioContext) {
      audioContext.close();
    }
    
    if (this.rainAudio) {
      this.rainAudio.pause();
      this.rainAudio = null;
    }
  }
}
