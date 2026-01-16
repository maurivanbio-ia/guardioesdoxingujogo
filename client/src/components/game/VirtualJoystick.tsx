import { useEffect, useRef, useState } from 'react';

interface VirtualJoystickProps {
  onMove: (direction: { x: number; y: number }) => void;
}

export function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxDistance = 40;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      
      touchIdRef.current = touch.identifier;
      setIsActive(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
      if (!touch || !container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = touch.clientX - centerX;
      let deltaY = touch.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxDistance;
        deltaY = Math.sin(angle) * maxDistance;
      }

      setPosition({ x: deltaX, y: deltaY });
      
      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      onMove({ x: normalizedX, y: normalizedY });
      
      // Dispatch event for GameScene
      window.dispatchEvent(new CustomEvent('virtualJoystickMove', {
        detail: { x: normalizedX, y: normalizedY }
      }));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touches = Array.from(e.changedTouches);
      if (touches.some(t => t.identifier === touchIdRef.current)) {
        touchIdRef.current = null;
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
        
        // Dispatch event for GameScene
        window.dispatchEvent(new CustomEvent('virtualJoystickMove', {
          detail: { x: 0, y: 0 }
        }));
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onMove]);

  return (
    <div className="fixed bottom-8 left-8 z-50 pointer-events-auto md:hidden">
      <div
        ref={containerRef}
        className={`relative w-32 h-32 rounded-full transition-all ${
          isActive 
            ? 'bg-slate-800/80 border-2 border-green-500' 
            : 'bg-slate-800/60 border-2 border-slate-600'
        }`}
        style={{
          touchAction: 'none',
        }}
      >
        <div
          ref={stickRef}
          className={`absolute top-1/2 left-1/2 w-16 h-16 rounded-full transition-all ${
            isActive 
              ? 'bg-green-500 shadow-lg shadow-green-500/50' 
              : 'bg-slate-600'
          }`}
          style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            ↑
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-slate-500/30" />
        </div>
      </div>
      
      <div className="text-center mt-2 text-xs text-slate-400 font-medium">
        Movimento
      </div>
    </div>
  );
}
