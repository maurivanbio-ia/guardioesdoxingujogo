/**
 * ToolInventory - Visual inventory display for collected scientific tools
 * Displays collected tools and allows selection with number keys 1-5
 */

import { type ToolType } from '@/lib/collectibleTools';

interface ToolInventoryProps {
  collectedTools: ToolType[];
  selectedTool: ToolType | null;
  onSelectTool: (tool: ToolType | null) => void;
}

export function ToolInventory({ collectedTools, selectedTool, onSelectTool }: ToolInventoryProps) {
  const toolData: Record<ToolType, { name: string; icon: string; shortcut: string }> = {
    thermometer: { name: 'Termômetro', icon: '🌡️', shortcut: '1' },
    ruler: { name: 'Régua', icon: '📏', shortcut: '2' },
    scale: { name: 'Balança', icon: '⚖️', shortcut: '3' },
    notebook: { name: 'Caderneta', icon: '📓', shortcut: '4' },
    gps: { name: 'GPS', icon: '📍', shortcut: '5' },
  };

  const allTools: ToolType[] = ['thermometer', 'ruler', 'scale', 'notebook', 'gps'];

  const handleToolClick = (tool: ToolType) => {
    if (collectedTools.includes(tool)) {
      onSelectTool(selectedTool === tool ? null : tool);
    }
  };

  if (collectedTools.length === 0) {
    return null; // Don't show inventory if no tools collected yet
  }

  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-2 pointer-events-auto">
      <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-green-500/30">
        <div className="text-white text-xs font-semibold mb-2 flex items-center gap-2">
          <span className="text-green-400">🧰</span>
          <span>FERRAMENTAS ({collectedTools.length}/5)</span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          {allTools.map((tool) => {
            const isCollected = collectedTools.includes(tool);
            const isSelected = selectedTool === tool;
            const data = toolData[tool];
            
            return (
              <button
                key={tool}
                onClick={() => handleToolClick(tool)}
                disabled={!isCollected}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                  ${isCollected 
                    ? isSelected
                      ? 'bg-green-500/40 border-2 border-green-400 shadow-lg shadow-green-500/30'
                      : 'bg-gray-700/50 hover:bg-gray-600/60 border border-gray-500/30'
                    : 'bg-gray-900/30 border border-gray-700/30 opacity-40 cursor-not-allowed'
                  }
                `}
              >
                {/* Icon */}
                <span className="text-2xl">{data.icon}</span>
                
                {/* Name */}
                <span className={`text-sm font-medium flex-1 text-left ${
                  isCollected ? 'text-white' : 'text-gray-600'
                }`}>
                  {data.name}
                </span>
                
                {/* Shortcut key */}
                <span className={`
                  text-xs px-1.5 py-0.5 rounded border font-mono
                  ${isCollected 
                    ? 'bg-gray-800/80 border-gray-600 text-gray-300'
                    : 'bg-gray-900/50 border-gray-800 text-gray-700'
                  }
                `}>
                  {data.shortcut}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Instructions */}
        {selectedTool && (
          <div className="mt-2 pt-2 border-t border-gray-700/50">
            <p className="text-xs text-green-400 text-center">
              Ferramenta equipada! Use próximo a tartarugas ou ninhos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
