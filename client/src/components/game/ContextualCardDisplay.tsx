/**
 * ContextualCardDisplay - Exibição de cards contextuais integrados
 * Cards aparecem em resposta a ações do jogador com animações suaves
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextualCard } from '@/lib/useCardSystem';
import { X } from 'lucide-react';

interface ContextualCardDisplayProps {
  activeCard: ContextualCard | null;
  onClose?: () => void;
}

export function ContextualCardDisplay({ activeCard, onClose }: ContextualCardDisplayProps) {
  const handleClose = () => {
    onClose?.();
  };

  if (!activeCard) return null;

  const positionClasses = {
    bottom: 'bottom-10 left-1/2 -translate-x-1/2',
    top: 'top-10 left-1/2 -translate-x-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const position = activeCard.position || 'bottom';

  return (
    <AnimatePresence>
      <motion.div
        key={activeCard.id}
        initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: position === 'bottom' ? 20 : -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed ${positionClasses[position]} z-50 max-w-[500px] w-[90%] md:w-[500px]`}
      >
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
                        backdrop-blur-md border-2 border-emerald-500/30 rounded-2xl shadow-2xl
                        p-6 relative overflow-hidden">
          
          {/* Efeito de brilho no fundo */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          
          {/* Botão de fechar */}
          {onClose && (
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 
                         transition-colors text-slate-300 hover:text-white z-10"
              aria-label="Fechar card"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Conteúdo do card */}
          <div className="relative z-10">
            {/* Título com ícone */}
            <div className="flex items-center gap-3 mb-3">
              {activeCard.icon && (
                <span className="text-3xl" role="img" aria-label="ícone">
                  {activeCard.icon}
                </span>
              )}
              <h3 className="text-xl font-bold text-white">
                {activeCard.title}
              </h3>
            </div>

            {/* Texto do card */}
            <p className="text-slate-100 leading-relaxed text-base">
              {activeCard.text}
            </p>

            {/* Indicador de tecla */}
            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-center gap-2">
              <span className="text-sm text-slate-400">Pressione</span>
              <kbd className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg 
                             text-sm font-bold text-emerald-400 shadow-sm">
                ESPAÇO
              </kbd>
              <span className="text-sm text-slate-400">para fechar</span>
            </div>
          </div>

          {/* Barra de progresso de tempo */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: (activeCard.duration || 8000) / 1000, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
