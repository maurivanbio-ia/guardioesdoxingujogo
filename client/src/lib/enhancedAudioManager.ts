/**
 * Enhanced Audio Manager - Guardiões do Xingu
 * Gerencia sons ambientais por estação, efeitos sonoros e música de encerramento
 */

export type SeasonType = 'seca' | 'cheia';

export class EnhancedAudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private ambientVolume: number = 0.4;
  private sfxVolume: number = 0.6;
  private enabled: boolean = true;
  private xpGainSound: HTMLAudioElement | null = null;
  
  private currentSeason: SeasonType = 'seca';
  
  private audioContext: AudioContext | null = null;
  private seasonSoundNodes: Map<string, AudioNode> = new Map();
  
  private finalMusicAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initAudioContext();
    this.loadSoundEffects();
    console.log('🎵 Enhanced Audio Manager iniciado');
  }

  private initAudioContext() {
    try {
      this.audioContext = new AudioContext();
      console.log('🎧 AudioContext criado');
    } catch (err) {
      console.warn('⚠️ AudioContext não suportado:', err);
    }
  }

  private loadSoundEffects() {
    this.xpGainSound = new Audio('/xp-gain.wav');
    this.xpGainSound.preload = 'auto';
    this.xpGainSound.volume = this.sfxVolume;
  }

  setSeasonalSounds(season: SeasonType) {
    if (this.currentSeason === season) return;
    
    console.log(`🌿 Mudando sons ambientais para: ${season.toUpperCase()}`);
    this.currentSeason = season;
    
    this.stopSeasonalSounds();
    
    if (season === 'seca') {
      this.startDrySeasonSounds();
    } else {
      this.startWetSeasonSounds();
    }
  }

  private startDrySeasonSounds() {
    if (!this.enabled) return;

    console.log('🌞 Iniciando sons da Estação Seca (pássaros amazônicos)');

    // Usar arquivo de áudio real de pássaros amazônicos
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
    }

    this.ambientAudio = new Audio('/audio/amazonian_birds.wav');
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 0;

    this.ambientAudio.play().catch(err => {
      console.warn('⚠️ Áudio de pássaros bloqueado:', err);
    });

    // Fade in gradual
    let volume = 0;
    const fadeInInterval = setInterval(() => {
      volume += 0.02;
      if (volume >= this.ambientVolume) {
        volume = this.ambientVolume;
        clearInterval(fadeInInterval);
      }
      if (this.ambientAudio) {
        this.ambientAudio.volume = volume;
      }
    }, 100);
    
    this.seasonSoundNodes.set('dry_birds', this.ambientAudio as any);
  }

  private startWetSeasonSounds() {
    if (!this.audioContext || !this.enabled) return;

    console.log('🌧️ Iniciando sons da Estação Cheia (chuva, correnteza, rãs)');

    const oscillators: OscillatorNode[] = [];
    
    const createRainSound = () => {
      if (this.currentSeason !== 'cheia' || !this.audioContext) return;

      const bufferSize = this.audioContext.sampleRate * 0.1;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.15;

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      noise.start();
      oscillators.push(noise as any);
    };

    const createFrogCroak = () => {
      if (this.currentSeason !== 'cheia' || !this.audioContext) return;

      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      const baseFreq = 200 + Math.random() * 300;
      osc.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

      osc.type = 'sawtooth';
      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.3);

      oscillators.push(osc);
    };

    createRainSound();

    const scheduleFrogs = () => {
      if (this.currentSeason !== 'cheia') return;

      const frogCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < frogCount; i++) {
        setTimeout(() => createFrogCroak(), i * (200 + Math.random() * 300));
      }

      setTimeout(scheduleFrogs, 2000 + Math.random() * 5000);
    };

    scheduleFrogs();
    
    this.seasonSoundNodes.set('wet_rain', null as any);
  }

  private stopSeasonalSounds() {
    // Parar áudio ambiente com fade out
    if (this.ambientAudio) {
      let volume = this.ambientAudio.volume;
      const fadeOutInterval = setInterval(() => {
        volume -= 0.05;
        if (volume <= 0) {
          volume = 0;
          clearInterval(fadeOutInterval);
          if (this.ambientAudio) {
            this.ambientAudio.pause();
            this.ambientAudio.currentTime = 0;
            this.ambientAudio = null;
          }
        } else if (this.ambientAudio) {
          this.ambientAudio.volume = volume;
        }
      }, 100);
    }
    
    this.seasonSoundNodes.clear();
  }

  playXpGain() {
    if (!this.enabled || !this.xpGainSound) return;

    const sound = this.xpGainSound.cloneNode() as HTMLAudioElement;
    sound.volume = this.sfxVolume;
    sound.play().catch(err => {
      console.warn('🔊 Som de XP bloqueado');
    });
  }

  // Música final removida conforme solicitação do usuário

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopSeasonalSounds();
    }
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
  }

  getAmbientVolume(): number {
    return this.ambientVolume;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
