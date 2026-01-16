export class AudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private ambientVolume: number = 0.4;
  private sfxVolume: number = 0.6;
  private enabled: boolean = true;
  private xpGainSound: HTMLAudioElement | null = null;
  
  // REAL Amazonian bird sounds audio
  private birdAudio: HTMLAudioElement | null = null;
  private birdsActive: boolean = false;

  constructor() {
    this.loadAmbientSound();
    this.loadSoundEffects();
    this.loadBirdAudio();
  }

  private loadAmbientSound() {
    // Ambient sound DISABLED - Using only bird sounds and rain
    // No walking/footstep sounds needed
    console.log('🔇 Som ambiente genérico desativado (usando apenas pássaros e chuva)');
  }

  private loadSoundEffects() {
    // Load XP gain sound effect
    this.xpGainSound = new Audio('/xp-gain.wav');
    this.xpGainSound.preload = 'auto';
    this.xpGainSound.volume = this.sfxVolume;
  }

  private loadBirdAudio() {
    // Load REAL Amazonian bird sounds from WAV file
    this.birdAudio = new Audio('/audio/amazonian_birds.wav');
    this.birdAudio.preload = 'auto';
    this.birdAudio.volume = 0; // Start muted for fade-in
    this.birdAudio.loop = true;
    
    // Add event listeners for debugging
    this.birdAudio.addEventListener('loadeddata', () => {
      console.log('✅ Áudio de pássaros CARREGADO e PRONTO para tocar');
    });
    this.birdAudio.addEventListener('error', (e) => {
      console.error('❌ ERRO ao carregar áudio de pássaros:', e);
    });
    
    console.log('🐦 Áudio REAL de pássaros amazônicos inicializado (aguardando carregamento)');
  }

  startAmbientSounds() {
    // DISABLED: No generic ambient sound (only birds and rain)
    console.log('🔇 Áudio ambiente genérico não será tocado');
  }

  stopAll() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
    }
    this.stopBirds();
  }

  startBirds() {
    console.log('🐦 startBirds() CHAMADO - enabled:', this.enabled, 'birdAudio:', !!this.birdAudio, 'birdsActive:', this.birdsActive);
    
    if (!this.enabled) {
      console.warn('⚠️ AudioManager DESABILITADO - pássaros não serão ativados');
      return;
    }
    
    if (!this.birdAudio) {
      console.error('❌ birdAudio NÃO EXISTE - não foi carregado corretamente');
      return;
    }
    
    if (this.birdsActive) {
      console.log('ℹ️ Pássaros já estão ATIVOS - ignorando chamada duplicada');
      return; // Already playing
    }

    this.birdsActive = true;
    
    // Start from beginning
    this.birdAudio.currentTime = 0;
    this.birdAudio.volume = 0;
    
    console.log('▶️ Tentando TOCAR áudio de pássaros...');
    
    // Play the audio
    this.birdAudio.play()
      .then(() => {
        console.log('✅ Áudio de pássaros TOCANDO com sucesso!');
      })
      .catch(err => {
        console.warn('🐦 Áudio de pássaros BLOQUEADO (autoplay policy):', err);
        console.warn('💡 Clique na tela ou interaja com o jogo para desbloquear o áudio');
      });

    // Smooth fade in over 2 seconds
    let volume = 0;
    const targetVolume = this.ambientVolume * 0.7; // 70% of ambient volume
    console.log('🔊 Iniciando fade-in de volume até', targetVolume);
    
    const fadeInInterval = setInterval(() => {
      volume += 0.02;
      if (volume >= targetVolume) {
        volume = targetVolume;
        clearInterval(fadeInInterval);
        console.log('✅ Fade-in completo - volume:', volume);
      }
      if (this.birdAudio) {
        this.birdAudio.volume = volume;
      }
    }, 100);

    console.log('🐦 Áudio REAL de pássaros amazônicos ATIVADO (Estação Seca)');
  }

  stopBirds() {
    if (!this.birdAudio || !this.birdsActive) return;

    this.birdsActive = false;

    // Smooth fade out over 1.5 seconds
    let volume = this.birdAudio.volume;
    const fadeOutInterval = setInterval(() => {
      volume -= 0.02;
      if (volume <= 0) {
        volume = 0;
        clearInterval(fadeOutInterval);
        if (this.birdAudio) {
          this.birdAudio.pause();
          this.birdAudio.currentTime = 0;
        }
      }
      if (this.birdAudio) {
        this.birdAudio.volume = volume;
      }
    }, 75);

    console.log('🐦 Áudio de pássaros desativado');
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
    // Note: startAmbientSounds() removed - only birds and rain audio
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.ambientVolume;
    }
  }

  getAmbientVolume(): number {
    return this.ambientVolume;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  playXpGain() {
    if (!this.enabled || !this.xpGainSound) return;

    // Clone the audio to allow overlapping plays
    const sound = this.xpGainSound.cloneNode() as HTMLAudioElement;
    sound.volume = this.sfxVolume;
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('🔊 Som de XP bloqueado (autoplay policy). Interaja com a página primeiro.');
      });
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.xpGainSound) {
      this.xpGainSound.volume = this.sfxVolume;
    }
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }
}
