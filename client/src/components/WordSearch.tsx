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

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div
        ref={gridRef}
        className="grid gap-1 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-2xl select-none border border-white/40"
        style={{
          gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
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
                'w-full h-full flex items-center justify-center text-xl font-bold border cursor-pointer transition-all duration-200 select-none rounded-lg min-h-[3rem] touch-manipulation',
                'hover:bg-white/80 active:scale-95',
                {
                  'bg-green-400/90 text-green-900 border-green-500 shadow-lg': cell.isFound,
                  'bg-blue-400/90 text-blue-900 border-blue-500 shadow-md transform scale-105': cell.isSelected && !cell.isFound,
                  'bg-yellow-200/90 border-yellow-500 border-2 shadow-sm': highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-') && !cell.isFound,
                  'bg-white/60 hover:bg-white/80 border-gray-400/50 backdrop-blur-sm': !cell.isSelected && !cell.isFound && !(highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-')),
                }
              )}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '700',
                letterSpacing: '0.05em',
                aspectRatio: '1'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsMouseDown(true);
                onCellMouseDown(rowIndex, colIndex);
              }}
              onMouseEnter={() => {
                if (isMouseDown) {
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
