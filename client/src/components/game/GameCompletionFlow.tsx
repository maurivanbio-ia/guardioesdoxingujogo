import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldReportModal } from './FieldReportModal';
import { GuardianCertificate } from './GuardianCertificate';

interface GameCompletionFlowProps {
  isGameComplete: boolean;
  fieldReportData: {
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
  };
  onRestart: () => void;
}

type CompletionStep = 'congratulations' | 'report' | 'certificate' | null;

export function GameCompletionFlow({
  isGameComplete,
  fieldReportData,
  onRestart,
}: GameCompletionFlowProps) {
  const [currentStep, setCurrentStep] = useState<CompletionStep>(null);

  useEffect(() => {
    if (isGameComplete && !currentStep) {
      setCurrentStep('congratulations');
    }
  }, [isGameComplete, currentStep]);

  if (!isGameComplete || !currentStep) return null;

  if (currentStep === 'congratulations') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 p-4">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: '100vh', opacity: [0, 1, 0] }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
              }}
            >
              {['🐢', '🌿', '🏆', '⭐', '💚'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl w-full bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-3xl border-2 border-emerald-400/50 shadow-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-pulse" />
              <Trophy className="relative w-32 h-32 text-yellow-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-black text-white mb-4"
          >
            PARABÉNS!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl text-emerald-300 font-bold mb-6"
          >
            Você completou todas as missões!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20"
          >
            <p className="text-white text-xl leading-relaxed">
              Durante esta jornada, você protegeu as tartarugas do Xingu, coletou dados científicos
              e demonstrou verdadeiro compromisso com a conservação ambiental.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/30">
              <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 text-sm font-bold">Ninhos Observados</p>
              <p className="text-3xl font-black text-white">{fieldReportData.nestsObserved}</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/30">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 text-sm font-bold">Ações Positivas</p>
              <p className="text-3xl font-black text-white">{fieldReportData.positiveActions}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 rounded-xl p-4 border border-amber-500/30">
              <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-amber-300 text-sm font-bold">Pontos Totais</p>
              <p className="text-3xl font-black text-white">{fieldReportData.totalPoints}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={() => setCurrentStep('report')}
              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold text-2xl py-8 rounded-2xl shadow-2xl"
            >
              <FileText className="w-8 h-8 mr-3" />
              Ver Relatório de Campo Completo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (currentStep === 'report') {
    return (
      <FieldReportModal
        isOpen={true}
        data={fieldReportData}
        onClose={() => {}}
        onGenerateCertificate={() => setCurrentStep('certificate')}
      />
    );
  }

  if (currentStep === 'certificate') {
    return (
      <GuardianCertificate
        isOpen={true}
        totalPoints={fieldReportData.totalPoints}
        onClose={() => {}}
        onRestart={onRestart}
      />
    );
  }

  return null;
}
