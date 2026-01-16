import { useState, useEffect } from 'react';
import { Keyboard, X, GripVertical } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';

export function KeyboardShortcutsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { position, isDragging, dragRef, handlers } = useDraggable({
    defaultPosition: { x: window.innerWidth - 160, y: window.innerHeight - 80 },
    storageKey: 'keyboardShortcutsPanelPosition',
  });
  
  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const shortcuts = [
    {
      category: 'Movimento',
      keys: [
        { key: 'W', description: 'Andar para frente' },
        { key: 'S', description: 'Andar para trás' },
        { key: 'A', description: 'Girar para esquerda' },
        { key: 'D', description: 'Girar para direita' },
        { key: 'Shift', description: 'Correr' },
        { key: 'Espaço', description: 'Pular' },
      ]
    },
    {
      category: 'Interações',
      keys: [
        { key: 'E', description: 'Interagir com objetos' },
        { key: '1-5', description: 'Selecionar ferramentas' },
      ]
    },
    {
      category: 'Ambiente',
      keys: [
        { key: 'C', description: 'Alternar ciclo hidrológico (Seca/Chuva)' },
        { key: 'T', description: 'Alternar dia/noite' },
        { key: 'F', description: 'Ligar/desligar lanterna' },
      ]
    },
    {
      category: 'Interface',
      keys: [
        { key: 'M', description: 'Abrir mapa completo' },
        { key: 'ESC', description: 'Fechar diálogos/menus' },
      ]
    }
  ];

  return (
    <>
      {/* Floating button to open shortcuts - draggable */}
      <div
        ref={dragRef}
        className="fixed pointer-events-auto z-30"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="relative group">
          {/* Drag handle */}
          <div 
            {...handlers}
            className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          >
            <GripVertical className="w-4 h-4 text-purple-400" />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3.5 rounded-2xl shadow-2xl border border-purple-400/20 hover:scale-110 transition-all"
            title="Atalhos de teclado"
          >
            <Keyboard className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Shortcuts Panel Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-purple-500/30 max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Keyboard className="w-7 h-7 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Atalhos de Teclado</h2>
                  <p className="text-sm text-purple-100">Comandos disponíveis no jogo</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shortcuts.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.keys.map((shortcut) => (
                        <div 
                          key={shortcut.key}
                          className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-600/40 transition-colors"
                        >
                          <span className="text-sm text-gray-300">
                            {shortcut.description}
                          </span>
                          <kbd className="px-3 py-1.5 bg-gray-800/80 rounded-md border-2 border-gray-600 text-sm font-mono font-semibold text-white shadow-md min-w-[60px] text-center">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300 text-center">
                  💡 Dica: Você também pode usar os controles visuais da interface para facilitar!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700/50">
              <p className="text-xs text-gray-400 text-center">
                Pressione ESC ou clique fora para fechar
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
