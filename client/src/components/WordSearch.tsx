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
    <div className="flex justify-center w-full h-full">
      <div
        ref={gridRef}
        className="grid gap-1 bg-game-grid p-3 rounded-2xl shadow-2xl select-none border border-border/50 w-full h-full max-w-lg max-h-lg"
        style={{
          gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
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
                'w-full h-full flex items-center justify-center text-lg font-bold border-2 cursor-pointer transition-all duration-300 select-none rounded-lg backdrop-blur-sm',
                'hover:bg-game-hover hover:text-primary-foreground active:scale-95 hover:shadow-lg hover:border-primary/50',
                {
                  'bg-game-found text-accent-foreground border-accent shadow-xl scale-105': cell.isFound,
                  'bg-game-selected text-secondary-foreground border-secondary shadow-lg transform scale-105': cell.isSelected && !cell.isFound,
                  'bg-game-highlight border-game-highlight border-4 text-foreground shadow-md': highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-') && !cell.isFound,
                  'bg-game-cell/80 hover:bg-game-cell border-border text-foreground': !cell.isSelected && !cell.isFound && !(highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-')),
                }
              )}
              style={{ aspectRatio: '1' }}
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
