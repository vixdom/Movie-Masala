import React, { useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { GridCell } from '@/lib/wordSearchGame';

interface WordSearchProps {
  grid: GridCell[][];
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  onCellTouchStart: (row: number, col: number) => void;
  onCellTouchMove: (event: React.TouchEvent) => void;
  onCellTouchEnd: () => void;
  highlightedWord?: string | null;
}

export function WordSearch({
  grid,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd,
  highlightedWord
}: WordSearchProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const getCellFromTouch = useCallback((touch: React.Touch) => {
    if (!gridRef.current) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const cellSize = rect.width / grid.length;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      return { row, col };
    }
    
    return null;
  }, [grid.length]);

  const getCellFromMouse = useCallback((event: MouseEvent | React.MouseEvent) => {
    if (!gridRef.current) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const cellSize = rect.width / grid.length;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      return { row, col };
    }
    
    return null;
  }, [grid.length]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    if (!isTouching) return;
    
    const touch = event.touches[0];
    const cell = getCellFromTouch(touch);
    
    if (cell) {
      onCellMouseEnter(cell.row, cell.col);
    }
    
    onCellTouchMove(event);
  }, [getCellFromTouch, onCellMouseEnter, onCellTouchMove, isTouching]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isMouseDown) return;
    
    const cell = getCellFromMouse(event);
    if (cell) {
      onCellMouseEnter(cell.row, cell.col);
    }
  }, [getCellFromMouse, onCellMouseEnter, isMouseDown]);

  // Add event listeners for mouse events
  React.useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      handleMouseMove(event);
    };

    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        onCellMouseUp();
      }
    };

    if (isMouseDown) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDown, handleMouseMove, onCellMouseUp]);

  // Define unique colors for each word
  const wordColors = [
    'bg-red-400/90 text-red-900 shadow-red-300/50',
    'bg-blue-400/90 text-blue-900 shadow-blue-300/50', 
    'bg-green-400/90 text-green-900 shadow-green-300/50',
    'bg-purple-400/90 text-purple-900 shadow-purple-300/50',
    'bg-pink-400/90 text-pink-900 shadow-pink-300/50',
    'bg-indigo-400/90 text-indigo-900 shadow-indigo-300/50',
    'bg-teal-400/90 text-teal-900 shadow-teal-300/50',
    'bg-orange-400/90 text-orange-900 shadow-orange-300/50',
    'bg-cyan-400/90 text-cyan-900 shadow-cyan-300/50',
    'bg-emerald-400/90 text-emerald-900 shadow-emerald-300/50'
  ];

  // Get color for a specific word
  const getWordColor = (wordId: string | undefined) => {
    if (!wordId) return '';
    const wordName = wordId.split('-')[0];
    const hash = wordName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return wordColors[hash % wordColors.length];
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div
        ref={gridRef}
        className="grid gap-1 p-2 select-none"
        style={{
          gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          width: '100%',
          aspectRatio: '1 / 1',
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          setIsTouching(false);
          onCellTouchEnd();
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 select-none rounded-2xl touch-manipulation shadow-xl',
                'hover:scale-110 active:scale-95 hover:rotate-3 hover:shadow-2xl',
                'bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border border-white/20',
                'animate-pulse-subtle hover:animate-bounce-gentle',
                {
                  [getWordColor(cell.wordId)]: cell.isFound,
                  'bg-gradient-to-br from-blue-400/90 to-blue-500/90 text-blue-900 shadow-blue-300/50 transform scale-110 rotate-2': cell.isSelected && !cell.isFound,
                  'bg-gradient-to-br from-yellow-300/90 to-yellow-400/90 text-yellow-900 shadow-yellow-300/50 animate-pulse': highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-') && !cell.isFound,
                }
              )}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '900',
                letterSpacing: '0.05em',
                aspectRatio: '1',
                width: '100%',
                height: '100%',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsMouseDown(true);
                onCellMouseDown(rowIndex, colIndex);
              }}
              onMouseEnter={() => {
                if (isMouseDown) {
                  // Gentle haptic feedback for each letter
                  if (navigator.vibrate) {
                    navigator.vibrate(10); // Very short, gentle vibration
                  }
                  onCellMouseEnter(rowIndex, colIndex);
                }
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                setIsTouching(true);
                onCellTouchStart(rowIndex, colIndex);
              }}
            >
              {cell.letter}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
