import React, { useEffect, useState } from 'react';
import { CloudRain, Cloud, CloudDrizzle, CloudLightning, Sun } from 'lucide-react';

interface WeatherChangeEvent {
  from: string;
  to: string;
  intensity: number;
}

export function WeatherNotification() {
  const [weatherEvent, setWeatherEvent] = useState<WeatherChangeEvent | null>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleWeatherChange = (e: Event) => {
      const customEvent = e as CustomEvent<WeatherChangeEvent>;
      setWeatherEvent(customEvent.detail);
      setVisible(true);
      
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };
    
    window.addEventListener('weatherChange', handleWeatherChange);
    return () => window.removeEventListener('weatherChange', handleWeatherChange);
  }, []);
  
  if (!visible || !weatherEvent) return null;
  
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'rain':
        return <CloudDrizzle className="w-8 h-8 text-blue-400" />;
      case 'heavy_rain':
        return <CloudRain className="w-8 h-8 text-blue-600" />;
      case 'storm':
        return <CloudLightning className="w-8 h-8 text-purple-600" />;
      default:
        return <Cloud className="w-8 h-8 text-slate-400" />;
    }
  };
  
  const getWeatherName = (weather: string) => {
    const names: Record<string, string> = {
      clear: 'Céu Limpo',
      cloudy: 'Nublado',
      rain: 'Chuva Leve',
      heavy_rain: 'Chuva Forte',
      storm: 'Tempestade'
    };
    return names[weather] || weather;
  };
  
  const getWeatherDescription = (weather: string) => {
    const descriptions: Record<string, string> = {
      clear: 'O tempo está favorável para observações',
      cloudy: 'Nuvens começam a cobrir o céu',
      rain: 'Chuva leve na região do Xingu',
      heavy_rain: 'Chuva intensa! Proteja seus equipamentos',
      storm: 'Tempestade severa! Procure abrigo seguro'
    };
    return descriptions[weather] || 'Mudança climática detectada';
  };
  
  return (
    <div
      className={`fixed top-24 right-6 z-50 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-xl border-2 border-blue-400/50 shadow-2xl p-4 max-w-sm transform transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 animate-bounce">
          {getWeatherIcon(weatherEvent.to)}
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">
            🌦️ Mudança Climática
          </h3>
          <p className="text-blue-200 text-sm mb-2">
            {getWeatherName(weatherEvent.to)}
          </p>
          <p className="text-slate-300 text-xs">
            {getWeatherDescription(weatherEvent.to)}
          </p>
          
          {weatherEvent.intensity > 0.7 && (
            <div className="mt-2 bg-red-600/20 border border-red-500/50 rounded-lg px-2 py-1">
              <p className="text-red-200 text-xs font-semibold">
                ⚠️ Condições adversas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
