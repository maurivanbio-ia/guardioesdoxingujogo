import React, { useState, useEffect } from 'react';
import { X, Trophy, Timer, CheckCircle2, XCircle, Star } from 'lucide-react';

type MiniGame = 'nest_temperature' | 'species_identification' | 'turtle_anatomy';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageHint?: string;
}

const miniGamesData: Record<MiniGame, {
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  xpReward: number;
}> = {
  nest_temperature: {
    title: 'Mestre da Temperatura',
    description: 'Aprenda sobre determinação sexual por temperatura!',
    icon: '🌡️',
    xpReward: 30,
    questions: [
      {
        question: 'Em tartarugas amazônicas, qual temperatura produz mais fêmeas?',
        options: ['28-30°C', '31-33°C', '34-35°C', '27°C ou menos'],
        correctIndex: 1,
        explanation: 'Temperaturas entre 31-33°C tendem a produzir mais fêmeas, enquanto temperaturas mais baixas (28-30°C) produzem mais machos!'
      },
      {
        question: 'Por que a temperatura do ninho é importante?',
        options: [
          'Acelera a incubação',
          'Define o sexo dos filhotes',
          'Melhora a casca do ovo',
          'Aumenta o tamanho dos filhotes'
        ],
        correctIndex: 1,
        explanation: 'A temperatura durante a incubação determina o sexo dos filhotes! Este fenômeno é chamado de Determinação Sexual por Temperatura (TSD).'
      },
      {
        question: 'Qual é a faixa crítica de temperatura para TSD?',
        options: ['20-25°C', '26-32°C', '28-35°C', '33-38°C'],
        correctIndex: 2,
        explanation: 'A faixa de 28-35°C é crítica! Pequenas variações nesta faixa podem mudar drasticamente a proporção de machos e fêmeas.'
      }
    ]
  },
  species_identification: {
    title: 'Especialista em Espécies',
    description: 'Identifique as 3 espécies de tartarugas do Xingu!',
    icon: '🐢',
    xpReward: 25,
    questions: [
      {
        question: 'Qual é a maior tartaruga de água doce da América do Sul?',
        options: ['P. unifilis', 'P. expansa', 'P. sextuberculata', 'Todas iguais'],
        correctIndex: 1,
        explanation: 'P. expansa (Tartaruga-da-Amazônia) é a maior, podendo atingir 90 kg e 1 metro de comprimento!'
      },
      {
        question: 'Quantos tubérculos a P. sextuberculata possui no pescoço?',
        options: ['2 tubérculos', '4 tubérculos', '6 tubérculos', '8 tubérculos'],
        correctIndex: 2,
        explanation: 'P. sextuberculata significa "seis tubérculos" - ela possui 6 protuberâncias características no pescoço!'
      },
      {
        question: 'Qual espécie é conhecida como "Tracajá"?',
        options: ['P. expansa', 'P. unifilis', 'P. sextuberculata', 'Nenhuma'],
        correctIndex: 1,
        explanation: 'P. unifilis é popularmente conhecida como Tracajá! É uma espécie de tamanho médio, muito comum no Xingu.'
      }
    ]
  },
  turtle_anatomy: {
    title: 'Anatomia das Tartarugas',
    description: 'Conheça as estruturas anatômicas das tartarugas!',
    icon: '🔬',
    xpReward: 20,
    questions: [
      {
        question: 'Como se chama a parte superior da carapaça?',
        options: ['Plastrão', 'Escudos', 'Carapaça dorsal', 'Casca'],
        correctIndex: 2,
        explanation: 'A parte superior é chamada de Carapaça Dorsal, composta por placas ósseas cobertas por escudos!'
      },
      {
        question: 'Qual é a função principal da carapaça?',
        options: [
          'Armazenar água',
          'Proteção contra predadores',
          'Regular temperatura',
          'Ajudar na natação'
        ],
        correctIndex: 1,
        explanation: 'A carapaça é uma estrutura protetora que evoluiu para defender as tartarugas de predadores!'
      },
      {
        question: 'Como as tartarugas respiram?',
        options: [
          'Brânquias',
          'Pulmões',
          'Pele',
          'Plastrão'
        ],
        correctIndex: 1,
        explanation: 'Tartarugas possuem pulmões e precisam subir à superfície para respirar, mesmo sendo aquáticas!'
      }
    ]
  }
};

interface EducationalMiniGamesProps {
  gameType: MiniGame;
  onComplete: (xpEarned: number) => void;
  onClose: () => void;
}

export function EducationalMiniGames({ gameType, onComplete, onClose }: EducationalMiniGamesProps) {
  const gameData = miniGamesData[gameType];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    if (!showExplanation && !gameComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showExplanation, gameComplete, timeLeft]);

  const handleTimeout = () => {
    setShowExplanation(true);
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    
    const isCorrect = index === gameData.questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < gameData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      const xpEarned = Math.round((score / gameData.questions.length) * gameData.xpReward);
      setGameComplete(true);
      onComplete(xpEarned);
    }
  };

  const question = gameData.questions[currentQuestion];
  const isCorrect = selectedOption === question.correctIndex;

  if (gameComplete) {
    const percentage = Math.round((score / gameData.questions.length) * 100);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-500 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Mini-Game Completo!</h2>
            <p className="text-emerald-400 text-xl mb-6">
              {score} de {gameData.questions.length} corretas ({percentage}%)
            </p>
            
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-white/80 text-sm mb-2">XP Ganho:</p>
              <p className="text-yellow-400 text-4xl font-bold">
                +{Math.round((score / gameData.questions.length) * gameData.xpReward)} XP
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Continuar Jornada
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-emerald-500/50 max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{gameData.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{gameData.title}</h2>
                <p className="text-emerald-100 text-sm">{gameData.description}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 flex items-center justify-between text-white text-sm">
            <span>Questão {currentQuestion + 1} de {gameData.questions.length}</span>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className={timeLeft <= 10 ? 'text-red-300 font-bold' : ''}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = index === question.correctIndex;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium ${
                    showResult && isCorrectOption
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : showResult && isSelected && !isCorrectOption
                      ? 'bg-red-500/20 border-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-500/20 border-blue-500 text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-emerald-500/10 border-2 border-emerald-500/50' : 'bg-orange-500/10 border-2 border-orange-500/50'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <Star className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                ) : (
                  <span className="text-2xl flex-shrink-0">💡</span>
                )}
                <div>
                  <p className="text-white font-semibold mb-1">
                    {isCorrect ? 'Correto!' : 'Resposta Incorreta'}
                  </p>
                  <p className="text-white/80 text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {currentQuestion < gameData.questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
