import React, { useState } from 'react';
import { X, MapPin, Turtle, Home, Eye, Droplet, Leaf, AlertTriangle, Compass, ZoomIn, ZoomOut } from 'lucide-react';

interface MapMarker {
  id: string;
  type: 'nest' | 'turtle' | 'house' | 'impact' | 'tool' | 'player' | 'poi';
  position: { x: number; z: number };
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface EnhancedMapSystemProps {
  onClose: () => void;
  playerPosition: { x: number; z: number };
  markers: MapMarker[];
}

export function EnhancedMapSystem({ onClose, playerPosition, markers }: EnhancedMapSystemProps) {
  const [mapScale, setMapScale] = useState(1);
  const [showLayers, setShowLayers] = useState({
    nests: true,
    turtles: true,
    impacts: true,
    tools: true,
    poi: true
  });
  const [mapView, setMapView] = useState<'topographic' | 'satellite' | 'hybrid'>('topographic');
  
  const mapSize = 400; // Map display size in pixels
  const worldSize = 200; // World coordinates range (-100 to 100)
  
  const worldToMapCoords = (x: number, z: number) => {
    const normalizedX = (x + worldSize / 2) / worldSize;
    const normalizedZ = (z + worldSize / 2) / worldSize;
    
    return {
      x: normalizedX * mapSize * mapScale,
      y: (1 - normalizedZ) * mapSize * mapScale // Flip Z for top-down view
    };
  };
  
  const filteredMarkers = markers.filter(marker => {
    if (marker.type === 'nest' && !showLayers.nests) return false;
    if (marker.type === 'turtle' && !showLayers.turtles) return false;
    if (marker.type === 'impact' && !showLayers.impacts) return false;
    if (marker.type === 'tool' && !showLayers.tools) return false;
    if (marker.type === 'poi' && !showLayers.poi) return false;
    return true;
  });
  
  const playerMapPos = worldToMapCoords(playerPosition.x, playerPosition.z);
  
  const getMapBackground = () => {
    switch (mapView) {
      case 'topographic':
        return 'linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #87a96b 100%)';
      case 'satellite':
        return 'linear-gradient(135deg, #1a3a1a 0%, #2d5230 50%, #3d6b3d 100%)';
      case 'hybrid':
        return 'linear-gradient(135deg, #1f4620 0%, #3a6e3a 50%, #5a9b5a 100%)';
    }
  };
  
  const zoomIn = () => setMapScale(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setMapScale(prev => Math.max(prev - 0.2, 0.6));
  
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-emerald-500/50 max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <Compass className="w-12 h-12 text-yellow-300" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Mapa Tático do Xingu</h2>
              <p className="text-emerald-100">Sistema de navegação e rastreamento avançado</p>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setMapView('topographic')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mapView === 'topographic'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                🗺️ Topográfico
              </button>
              <button
                onClick={() => setMapView('satellite')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mapView === 'satellite'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                🛰️ Satélite
              </button>
              <button
                onClick={() => setMapView('hybrid')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mapView === 'hybrid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                🔀 Híbrido
              </button>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex gap-2">
              <button
                onClick={zoomOut}
                disabled={mapScale <= 0.6}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="bg-slate-700 px-3 py-2 rounded-lg text-white font-semibold">
                {Math.round(mapScale * 100)}%
              </div>
              <button
                onClick={zoomIn}
                disabled={mapScale >= 2}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Layer Toggles */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, nests: !prev.nests }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showLayers.nests
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Ninhos
            </button>
            
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, turtles: !prev.turtles }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showLayers.turtles
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              <Turtle className="w-4 h-4" />
              Tartarugas
            </button>
            
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, impacts: !prev.impacts }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showLayers.impacts
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Impactos
            </button>
            
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, tools: !prev.tools }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showLayers.tools
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              🧰 Ferramentas
            </button>
            
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, poi: !prev.poi }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showLayers.poi
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              <Eye className="w-4 h-4" />
              POIs
            </button>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="p-6 flex justify-center">
          <div
            className="relative rounded-xl shadow-2xl overflow-hidden border-4 border-slate-700"
            style={{
              width: mapSize,
              height: mapSize,
              background: getMapBackground()
            }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* River overlay (simulated) */}
            <div className="absolute inset-0 opacity-30">
              <svg width="100%" height="100%">
                <path
                  d={`M 0 ${mapSize * 0.3} Q ${mapSize * 0.25} ${mapSize * 0.4}, ${mapSize * 0.5} ${mapSize * 0.5} T ${mapSize} ${mapSize * 0.7}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                />
              </svg>
            </div>
            
            {/* Markers */}
            <div className="absolute inset-0">
              {filteredMarkers.map((marker) => {
                const pos = worldToMapCoords(marker.position.x, marker.position.z);
                
                return (
                  <div
                    key={marker.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white`}
                      style={{ backgroundColor: marker.color }}
                      title={marker.label}
                    >
                      {marker.icon}
                    </div>
                  </div>
                );
              })}
              
              {/* Player marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${playerMapPos.x}px`,
                  top: `${playerMapPos.y}px`
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-ping absolute"></div>
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10">
                    <Compass className="w-5 h-5 text-white animate-spin-slow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-6 bg-slate-800/50 rounded-b-2xl border-t border-slate-700">
          <h3 className="text-white font-bold mb-3">📍 Legenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300">Sua Posição</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300">Ninhos Marcados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300">Tartarugas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300">Impactos Ambientais</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300">Ferramentas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300">Pontos de Interesse</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
