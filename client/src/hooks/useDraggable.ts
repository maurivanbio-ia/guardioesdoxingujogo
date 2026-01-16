import { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  defaultPosition?: Position;
  storageKey?: string;
  disabled?: boolean;
}

export function useDraggable({ 
  defaultPosition = { x: 0, y: 0 }, 
  storageKey,
  disabled = false
}: UseDraggableOptions = {}) {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const elementStartPos = useRef<Position>({ x: 0, y: 0 });

  // Load saved position from localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const savedPos = JSON.parse(saved);
          setPosition(savedPos);
        } catch (e) {
          console.error('Failed to load saved position:', e);
        }
      }
    }
  }, [storageKey]);

  // Save position to localStorage
  const savePosition = (pos: Position) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(pos));
    }
  };

  // Mouse down handler
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { ...position };
  };

  // Touch start handler
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    e.stopPropagation();
    
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    elementStartPos.current = { ...position };
  };

  // Mouse/Touch move handler
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const newPos = {
        x: elementStartPos.current.x + deltaX,
        y: elementStartPos.current.y + deltaY,
      };
      
      setPosition(newPos);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartPos.current.x;
      const deltaY = touch.clientY - dragStartPos.current.y;
      
      const newPos = {
        x: elementStartPos.current.x + deltaX,
        y: elementStartPos.current.y + deltaY,
      };
      
      setPosition(newPos);
    };

    const handleEnd = () => {
      setIsDragging(false);
      savePosition(position);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, position]);

  return {
    position,
    isDragging,
    dragRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  };
}
