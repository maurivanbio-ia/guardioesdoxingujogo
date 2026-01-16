import { Howl } from 'howler';

export type SoundEffect = 
  | 'xp_gain'
  | 'achievement_unlock'
  | 'tool_collect'
  | 'nest_mark'
  | 'turtle_measure'
  | 'phase_complete'
  | 'dialogue_open'
  | 'dialogue_close'
  | 'button_click'
  | 'error'
  | 'success'
  | 'water_splash'
  | 'footsteps_sand'
  | 'ambient_birds'
  | 'ambient_rain'
  | 'ambient_river'
  | 'night_crickets'
  | 'thunder'
  | 'vulture_cry'
  | 'boat_engine';

class SoundLibraryManager {
  private sounds: Map<SoundEffect, Howl> = new Map();
  private ambientSounds: Map<string, Howl> = new Map();
  private masterVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private ambientVolume: number = 0.4;
  private musicVolume: number = 0.5;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    this.sounds.set('xp_gain', new Howl({
      src: [this.generateTone(800, 0.1)],
      volume: 0.3,
      html5: true
    }));

    this.sounds.set('achievement_unlock', new Howl({
      src: [this.generateCelebrationChord()],
      volume: 0.5,
      html5: true
    }));

    this.sounds.set('tool_collect', new Howl({
      src: [this.generateTone(600, 0.15)],
      volume: 0.4,
      html5: true
    }));

    this.sounds.set('nest_mark', new Howl({
      src: [this.generateSuccessSound()],
      volume: 0.4,
      html5: true
    }));

    this.sounds.set('turtle_measure', new Howl({
      src: [this.generateClickSound()],
      volume: 0.3,
      html5: true
    }));

    this.sounds.set('phase_complete', new Howl({
      src: [this.generateTriumphSound()],
      volume: 0.6,
      html5: true
    }));

    this.sounds.set('button_click', new Howl({
      src: [this.generateTone(400, 0.05)],
      volume: 0.2,
      html5: true
    }));

    this.sounds.set('success', new Howl({
      src: [this.generateSuccessSound()],
      volume: 0.4,
      html5: true
    }));

    this.sounds.set('error', new Howl({
      src: [this.generateErrorSound()],
      volume: 0.3,
      html5: true
    }));
  }

  private generateTone(frequency: number, duration: number): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 5);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    const wavData = this.bufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavData], { type: 'audio/wav' }));
  }

  private generateCelebrationChord(): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 0.5;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    const frequencies = [523.25, 659.25, 783.99];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3);
      let sample = 0;
      
      frequencies.forEach(freq => {
        sample += Math.sin(2 * Math.PI * freq * t) * envelope;
      });
      
      data[i] = sample * 0.2;
    }

    const wavData = this.bufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavData], { type: 'audio/wav' }));
  }

  private generateSuccessSound(): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 0.3;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 8);
      const freq = 800 + (t * 400);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }

    const wavData = this.bufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavData], { type: 'audio/wav' }));
  }

  private generateErrorSound(): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 0.2;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 10);
      const freq = 400 - (t * 200);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }

    const wavData = this.bufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavData], { type: 'audio/wav' }));
  }

  private generateClickSound(): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 0.05;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 50);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.2;
    }

    const wavData = this.bufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavData], { type: 'audio/wav' }));
  }

  private generateTriumphSound(): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 0.8;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    const melody = [523.25, 659.25, 783.99, 1046.50];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t * 5) % melody.length;
      const freq = melody[noteIndex];
      const envelope = Math.exp(-((t % 0.2) * 10));
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
    }

    const wavData = this.bufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavData], { type: 'audio/wav' }));
  }

  private bufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const data = buffer.getChannelData(0);
    const samples = new Int16Array(data.length);
    
    for (let i = 0; i < data.length; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    const dataLength = samples.length * bytesPerSample;
    const buffer_array = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer_array);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      view.setInt16(offset, samples[i], true);
      offset += 2;
    }

    return buffer_array;
  }

  play(effect: SoundEffect) {
    const sound = this.sounds.get(effect);
    if (sound) {
      sound.volume(this.sfxVolume * this.masterVolume);
      sound.play();
    }
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    this.ambientSounds.forEach(sound => {
      sound.volume(this.ambientVolume * this.masterVolume);
    });
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }
}

export const soundLibrary = new SoundLibraryManager();
