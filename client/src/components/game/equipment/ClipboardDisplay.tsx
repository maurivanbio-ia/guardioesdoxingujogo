import { X, ClipboardList, Check } from 'lucide-react';
import { useState } from 'react';

interface ClipboardDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClipboardDisplay({ isOpen, onClose }: ClipboardDisplayProps) {
  const [notes, setNotes] = useState('');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-gradient-to-br from-amber-100 to-amber-50 border-8 border-amber-900 rounded-lg p-6 w-[500px] shadow-2xl relative">
        {/* Metal Clip at Top */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t-2xl border-2 border-slate-700 shadow-lg" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-amber-900">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-900" />
            <h2 className="text-xl font-bold text-amber-900">Prancheta de Campo</h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <div className="space-y-4">
          {/* Pre-filled Data */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="font-bold text-amber-900">Data:</label>
              <div className="bg-white/50 border border-amber-700 rounded px-2 py-1 mt-1">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
            <div>
              <label className="font-bold text-amber-900">Hora:</label>
              <div className="bg-white/50 border border-amber-700 rounded px-2 py-1 mt-1">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          <div>
            <label className="font-bold text-amber-900">Local:</label>
            <div className="bg-white/50 border border-amber-700 rounded px-2 py-1 mt-1">
              Praia do Rio Xingu, Altamira - PA
            </div>
          </div>
          
          {/* Checklist */}
          <div className="bg-white/70 border-2 border-amber-700 rounded-lg p-3">
            <div className="font-bold text-amber-900 mb-2">Lista de Verificação:</div>
            <div className="space-y-2 text-sm">
              {[
                'Monitoramento de desovas',
                'Marcação de ninhos',
                'Biometria de fêmeas',
                'Registro fotográfico',
                'Medição de temperatura',
                'Observação de predadores'
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-amber-100/50 p-1 rounded">
                  <div className="w-5 h-5 border-2 border-amber-800 rounded bg-white flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-amber-900">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Notes Area */}
          <div>
            <label className="font-bold text-amber-900">Observações de Campo:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-white/70 border-2 border-amber-700 rounded-lg p-3 mt-1 text-amber-900 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Digite suas observações aqui..."
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #d97706 31px, #d97706 32px)' }}
            />
          </div>
          
          <div className="text-xs text-amber-700 text-center">
            Projeto de Conservação - Guardião do Xingu
          </div>
        </div>
      </div>
    </div>
  );
}
