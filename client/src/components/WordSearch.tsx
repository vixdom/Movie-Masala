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
}

export function WordSearch({
  grid,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd
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
    <div className="flex justify-center p-4">
      <div
        ref={gridRef}
        className="grid gap-1 bg-gray-100 p-2 rounded-lg shadow-lg select-none"
        style={{
          gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
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
                'aspect-square flex items-center justify-center text-lg font-bold border border-gray-300 cursor-pointer transition-all duration-150 select-none',
                'hover:bg-blue-100 active:scale-95',
                {
                  'bg-green-200 text-green-800': cell.isFound,
                  'bg-blue-200 text-blue-800': cell.isSelected && !cell.isFound,
                  'bg-white': !cell.isSelected && !cell.isFound,
                }
              )}
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
