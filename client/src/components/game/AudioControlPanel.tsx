import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Music, Zap, Wind, Headphones } from 'lucide-react';
import { soundLibrary } from '@/lib/soundLibrary';

interface AudioControlPanelProps {
  onClose: () => void;
}

export function AudioControlPanel({ onClose }: AudioControlPanelProps) {
  const [masterVolume, setMasterVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [ambientVolume, setAmbientVolume] = useState(40);
  const [musicVolume, setMusicVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  // Load saved settings and apply to sound library
  useEffect(() => {
    const saved = localStorage.getItem('audioSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setMasterVolume(settings.master || 70);
      setSfxVolume(settings.sfx || 80);
      setAmbientVolume(settings.ambient || 40);
      setMusicVolume(settings.music || 50);
      setIsMuted(settings.muted || false);
      
      // Apply saved settings to sound library immediately
      if (settings.muted) {
        soundLibrary.setMasterVolume(0);
      } else {
        soundLibrary.setMasterVolume((settings.master || 70) / 100);
      }
      soundLibrary.setSFXVolume((settings.sfx || 80) / 100);
      soundLibrary.setAmbientVolume((settings.ambient || 40) / 100);
      soundLibrary.setMusicVolume((settings.music || 50) / 100);
    } else {
      // Apply default values if no saved settings
      soundLibrary.setMasterVolume(0.7);
      soundLibrary.setSFXVolume(0.8);
      soundLibrary.setAmbientVolume(0.4);
      soundLibrary.setMusicVolume(0.5);
    }
  }, []);

  // Save settings and apply to sound library
  const saveSettings = (settings: any) => {
    localStorage.setItem('audioSettings', JSON.stringify(settings));
    
    soundLibrary.setMasterVolume(settings.master / 100);
    soundLibrary.setSFXVolume(settings.sfx / 100);
    soundLibrary.setAmbientVolume(settings.ambient / 100);
    soundLibrary.setMusicVolume(settings.music / 100);
  };

  const handleMasterChange = (value: number) => {
    setMasterVolume(value);
    const settings = { master: value, sfx: sfxVolume, ambient: ambientVolume, music: musicVolume, muted: isMuted };
    saveSettings(settings);
  };

  const handleSfxChange = (value: number) => {
    setSfxVolume(value);
    const settings = { master: masterVolume, sfx: value, ambient: ambientVolume, music: musicVolume, muted: isMuted };
    saveSettings(settings);
  };

  const handleAmbientChange = (value: number) => {
    setAmbientVolume(value);
    const settings = { master: masterVolume, sfx: sfxVolume, ambient: value, music: musicVolume, muted: isMuted };
    saveSettings(settings);
  };

  const handleMusicChange = (value: number) => {
    setMusicVolume(value);
    const settings = { master: masterVolume, sfx: sfxVolume, ambient: ambientVolume, music: value, muted: isMuted };
    saveSettings(settings);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      soundLibrary.setMasterVolume(0);
    } else {
      soundLibrary.setMasterVolume(masterVolume / 100);
    }
    
    const settings = { master: masterVolume, sfx: sfxVolume, ambient: ambientVolume, music: musicVolume, muted: newMuted };
    localStorage.setItem('audioSettings', JSON.stringify(settings));
  };

  const testSound = () => {
    soundLibrary.play('xp_gain');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-blue-500/50 max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <Headphones className="w-10 h-10 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Controles de Áudio</h2>
              <p className="text-blue-100 text-sm">Ajuste os volumes conforme sua preferência</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold transition-all ${
              isMuted
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isMuted ? 'Áudio Desligado' : 'Áudio Ligado'}
          </button>

          {/* Master Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-slate-300" />
                <label className="text-white font-medium">Volume Geral</label>
              </div>
              <span className="text-blue-400 font-semibold">{masterVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => handleMasterChange(parseInt(e.target.value))}
              disabled={isMuted}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-blue"
            />
          </div>

          {/* SFX Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <label className="text-white font-medium">Efeitos Sonoros</label>
              </div>
              <span className="text-yellow-400 font-semibold">{sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => handleSfxChange(parseInt(e.target.value))}
              disabled={isMuted}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-yellow"
            />
          </div>

          {/* Ambient Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-emerald-400" />
                <label className="text-white font-medium">Sons Ambiente</label>
              </div>
              <span className="text-emerald-400 font-semibold">{ambientVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume}
              onChange={(e) => handleAmbientChange(parseInt(e.target.value))}
              disabled={isMuted}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-emerald"
            />
          </div>

          {/* Music Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                <label className="text-white font-medium">Música</label>
              </div>
              <span className="text-purple-400 font-semibold">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => handleMusicChange(parseInt(e.target.value))}
              disabled={isMuted}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
          </div>

          {/* Test Sound Button */}
          <button
            onClick={testSound}
            disabled={isMuted}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            🔊 Testar Som
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/50 rounded-b-2xl border-t border-slate-700">
          <p className="text-center text-slate-400 text-xs">
            💡 As configurações são salvas automaticamente
          </p>
        </div>
      </div>

      {/* Custom Styles for Sliders */}
      <style>{`
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
        
        .slider-yellow::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #facc15;
          cursor: pointer;
          border: 2px solid white;
        }
        
        .slider-emerald::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
        }
        
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid white;
        }
        
        input[type="range"]:disabled::-webkit-slider-thumb {
          background: #64748b;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
