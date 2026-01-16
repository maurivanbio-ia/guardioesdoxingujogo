import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Download, Award, X, FileText } from 'lucide-react';

interface FieldReportData {
  nestsObserved: number;
  temperaturesRecorded: number[];
  positiveActions: number;
  negativeActions: number;
  totalPoints: number;
  actionsLog: Array<{
    name: string;
    points: number;
    timestamp: Date;
  }>;
}

interface FieldReportModalProps {
  isOpen: boolean;
  data: FieldReportData;
  onClose: () => void;
  onGenerateCertificate: () => void;
}

export function FieldReportModal({
  isOpen,
  data,
  onClose,
  onGenerateCertificate,
}: FieldReportModalProps) {
  if (!isOpen) return null;

  const avgTemperature = data.temperaturesRecorded.length > 0
    ? data.temperaturesRecorded.reduce((a, b) => a + b, 0) / data.temperaturesRecorded.length
    : 0;

  const performancePercentage = Math.max(0, Math.min(100, (data.totalPoints / 100) * 100));

  const getPerformanceColor = () => {
    if (performancePercentage >= 80) return 'from-green-500 to-emerald-600';
    if (performancePercentage >= 50) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-orange-600';
  };

  const getPerformanceMessage = () => {
    if (performancePercentage >= 80) return 'Excelente desempenho ambiental!';
    if (performancePercentage >= 50) return 'Bom desempenho, continue melhorando!';
    return 'Reveja suas ações para melhorar!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/50 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-4 rounded-2xl">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">
                Relatório de Campo
              </h2>
              <p className="text-emerald-300 text-lg">
                Manejo de Quelônios - Rio Xingu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-2 border-blue-500/50 rounded-xl p-6">
              <h3 className="text-blue-300 font-bold text-sm mb-3">OBSERVAÇÕES CIENTÍFICAS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Ninhos Observados:</span>
                  <span className="text-2xl font-black text-blue-400">{data.nestsObserved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Temperaturas Medidas:</span>
                  <span className="text-2xl font-black text-blue-400">{data.temperaturesRecorded.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Temp. Média:</span>
                  <span className="text-2xl font-black text-blue-400">{avgTemperature.toFixed(1)}°C</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-2 border-emerald-500/50 rounded-xl p-6">
              <h3 className="text-emerald-300 font-bold text-sm mb-3">AÇÕES REALIZADAS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Ações Positivas:</span>
                  <span className="text-2xl font-black text-green-400">{data.positiveActions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Ações Negativas:</span>
                  <span className="text-2xl font-black text-red-400">{data.negativeActions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Pontuação Total:</span>
                  <span className="text-2xl font-black text-emerald-400">{data.totalPoints}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-2 border-purple-500/50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <LineChart className="w-6 h-6 text-purple-400" />
              <h3 className="text-purple-300 font-bold text-lg">DESEMPENHO AMBIENTAL</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm">{getPerformanceMessage()}</span>
                <span className="text-2xl font-black text-white">{performancePercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-white/10">
                <div
                  className={`h-full bg-gradient-to-r ${getPerformanceColor()} transition-all duration-1000 shadow-lg`}
                  style={{ width: `${performancePercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-green-400 text-2xl font-black">+{data.positiveActions * 10}</p>
                <p className="text-xs text-gray-400">Pontos Positivos</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-red-400 text-2xl font-black">{data.negativeActions * -5}</p>
                <p className="text-xs text-gray-400">Pontos Negativos</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-2 border-white/10 rounded-xl p-6 mb-8 max-h-60 overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-4">REGISTRO DE AÇÕES</h3>
            <div className="space-y-2">
              {data.actionsLog.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhuma ação registrada ainda</p>
              ) : (
                data.actionsLog.map((action, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      action.points > 0 ? 'bg-green-900/30' : 'bg-red-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{action.points > 0 ? '✅' : '⚠️'}</span>
                      <div>
                        <p className="text-white font-medium">{action.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(action.timestamp).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xl font-black ${
                      action.points > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {action.points > 0 ? '+' : ''}{action.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-emerald-400/50 text-white hover:bg-emerald-600/20"
            >
              Fechar
            </Button>
            <Button
              onClick={onGenerateCertificate}
              className="flex-1 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700 text-white font-bold"
            >
              <Award className="w-5 h-5 mr-2" />
              Gerar Certificado
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
