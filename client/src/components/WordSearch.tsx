import React, { useRef, useCallback, useState, useMemo } from 'react';
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
    <div className="w-full max-w-3xl mx-auto px-3">
      <div
        ref={gridRef}
        className="grid gap-2 p-3 select-none"
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
                'flex items-center justify-center text-3xl md:text-2xl font-black cursor-pointer transition-all duration-200 select-none rounded-xl touch-manipulation shadow-lg',
                'hover:scale-105 active:scale-95',
                'bg-white/95 backdrop-blur-sm border border-gray-200/50',
                {
                  [getWordColor(cell.wordId)]: cell.isFound,
                  'bg-blue-500 text-white shadow-blue-300/50 transform scale-105': cell.isSelected && !cell.isFound,
                  'bg-yellow-400 text-black shadow-yellow-300/50': highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-') && !cell.isFound,
                  'text-gray-900': !cell.isSelected && !cell.isFound && !(highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-')),
                }
              )}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '900',
                letterSpacing: '0.02em',
                aspectRatio: '1',
                width: '100%',
                height: '100%',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
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
