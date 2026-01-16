import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { EnvironmentalImpact } from '@/lib/educationalPointsSystem';

interface ImpactActionDialogProps {
  impact: EnvironmentalImpact;
  onAction: (actionType: 'positive' | 'negative' | 'info') => void;
  onClose: () => void;
}

export function ImpactActionDialog({ impact, onAction, onClose }: ImpactActionDialogProps) {
  const [showEducationalInfo, setShowEducationalInfo] = useState(false);

  const handlePositiveAction = () => {
    setShowEducationalInfo(true);
    setTimeout(() => {
      onAction('positive');
    }, 2000);
  };

  const handleNegativeAction = () => {
    setShowEducationalInfo(true);
    setTimeout(() => {
      onAction('negative');
    }, 2000);
  };

  const handleInfoAction = () => {
    setShowEducationalInfo(true);
  };

  const getIcon = () => {
    switch (impact.type) {
      case 'lixo':
        return '🗑️';
      case 'fogueira':
        return '🔥';
      case 'oleo':
        return '🛢️';
      case 'pesca_ilegal':
        return '🎣';
      case 'vegetacao':
        return '🌳';
      case 'embarcacao':
        return '🚤';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/50 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{getIcon()}</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {impact.name}
              </h2>
              <p className="text-gray-300">
                {impact.description}
              </p>
            </div>
          </div>

          {!showEducationalInfo ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-400 mb-4">
                O que você deseja fazer?
              </h3>

              <div className="space-y-3">
                {impact.actions.positive && (
                  <Button
                    onClick={handlePositiveAction}
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-2 border-green-400/50"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <CheckCircle className="w-6 h-6" />
                      <div className="text-left flex-1">
                        <p className="font-bold text-lg">{impact.actions.positive.label}</p>
                        <p className="text-sm text-green-100">+{impact.actions.positive.points} pontos</p>
                      </div>
                    </div>
                  </Button>
                )}

                {impact.actions.negative && (
                  <Button
                    onClick={handleNegativeAction}
                    variant="outline"
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-red-900/40 to-orange-900/40 hover:from-red-900/60 hover:to-orange-900/60 text-white border-2 border-red-500/50"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <AlertCircle className="w-6 h-6" />
                      <div className="text-left flex-1">
                        <p className="font-bold text-lg">{impact.actions.negative.label}</p>
                        <p className="text-sm text-red-200">{impact.actions.negative.points} pontos</p>
                      </div>
                    </div>
                  </Button>
                )}

                <Button
                  onClick={handleInfoAction}
                  variant="outline"
                  className="w-full h-auto py-4 px-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 hover:from-blue-900/60 hover:to-cyan-900/60 text-white border-2 border-blue-500/50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Info className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">
                        {impact.type === 'embarcacao' ? 'Ver Impacto' : 'Analisar Impacto'}
                      </p>
                      <p className="text-sm text-blue-200">Informação educativa</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-cyan-500/50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-cyan-300 mb-2">
                      Informação Ecológica
                    </h4>
                    <p className="text-white leading-relaxed">
                      {impact.actions.educationalInfo}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Continuar
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
