
import React, { useRef, useCallback, useState, useMemo, memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GridCell as GridCellType } from '@/lib/wordSearchGame';

interface WordSearchProps {
  grid: GridCellType[][];
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  highlightedWord?: string | null;
}

// Crossword-style cell component for sleek grid layout
const CrosswordGridCell = memo(({ 
  cell, 
  rowIndex, 
  colIndex, 
  isSelecting,
  onSelectionStart,
  onSelectionMove,
  getWordColor,
  highlightedWord
}: {
  cell: GridCellType;
  rowIndex: number;
  colIndex: number;
  isSelecting: boolean;
  onSelectionStart: (row: number, col: number) => void;
  onSelectionMove: (row: number, col: number) => void;
  getWordColor: (wordId: string | undefined) => string;
  highlightedWord?: string | null;
}) => {

  // Mouse down handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Mouse down:', rowIndex, colIndex, cell.letter);
    onSelectionStart(rowIndex, colIndex);
  }, [rowIndex, colIndex, cell.letter, onSelectionStart]);

  // Mouse enter handler
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (isSelecting) {
      console.log('Mouse enter during selection:', rowIndex, colIndex);
      onSelectionMove(rowIndex, colIndex);
    }
  }, [rowIndex, colIndex, isSelecting, onSelectionMove]);

  // Touch start handler
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    console.log('Touch start:', rowIndex, colIndex, cell.letter);
    onSelectionStart(rowIndex, colIndex);
  }, [rowIndex, colIndex, cell.letter, onSelectionStart]);

  return (
    <div
      className={cn(
        'crossword-cell',
        {
          'selected': cell.isSelected && !cell.isFound,
          'found': cell.isFound,
          'highlighted': highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-') && !cell.isFound,
        }
      )}
      data-row={rowIndex}
      data-col={colIndex}
      
      // Mouse events
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      
      // Touch events
      onTouchStart={handleTouchStart}
      
      style={{
        background: cell.isFound && cell.wordId ? `var(--word-found-bg)` : undefined,
        color: cell.isFound ? `var(--word-found-text)` : undefined,
        pointerEvents: 'auto',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {cell.letter}
    </div>
  );
});

export const MobileOptimizedWordSearch = memo(function WordSearch({
  grid,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  highlightedWord
}: WordSearchProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const touchMoveThrottleRef = useRef<NodeJS.Timeout>();

  // Unified handlers for selection events
  const handleSelectionStart = useCallback((row: number, col: number) => {
    console.log('Selection started at:', row, col);
    setIsSelecting(true);
    onCellMouseDown(row, col);
  }, [onCellMouseDown]);

  const handleSelectionMove = useCallback((row: number, col: number) => {
    if (isSelecting) {
      console.log('Selection moved to:', row, col);
      onCellMouseEnter(row, col);
    }
  }, [isSelecting, onCellMouseEnter]);

  const handleSelectionEnd = useCallback(() => {
    console.log('Selection ended');
    setIsSelecting(false);
    onCellMouseUp();
  }, [onCellMouseUp]);

  // Improved touch move handler with throttling
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSelecting) return;
    
    e.preventDefault(); // Prevent scrolling during selection
    
    // Throttle touch move events for better performance
    if (touchMoveThrottleRef.current) {
      clearTimeout(touchMoveThrottleRef.current);
    }
    
    touchMoveThrottleRef.current = setTimeout(() => {
      const touch = e.touches[0];
      if (!touch) return;
      
      // Find cell at touch coordinates
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const cellElement = element?.closest('[data-row][data-col]') as HTMLElement;
      
      if (cellElement) {
        const row = parseInt(cellElement.dataset.row || '0', 10);
        const col = parseInt(cellElement.dataset.col || '0', 10);
        
        // Validate coordinates are within grid bounds
        if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
          console.log('Touch move to valid cell:', row, col);
          handleSelectionMove(row, col);
        }
      }
    }, 16); // ~60fps throttling
  }, [isSelecting, handleSelectionMove, grid.length]);

  // Memoized color function for performance
  const getWordColor = useCallback((wordId: string | undefined): string => {
    if (!wordId) return '';
    const wordColors = [
      'bg-emerald-500/90 text-emerald-900',
      'bg-purple-500/90 text-purple-900', 
      'bg-pink-500/90 text-pink-900',
      'bg-indigo-500/90 text-indigo-900',
      'bg-orange-500/90 text-orange-900',
      'bg-teal-500/90 text-teal-900',
      'bg-red-500/90 text-red-900',
      'bg-cyan-500/90 text-cyan-900',
      'bg-amber-500/90 text-amber-900',
      'bg-lime-500/90 text-lime-900'
    ];
    
    const wordName = wordId.split('-')[0];
    const hash = wordName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return wordColors[hash % wordColors.length];
  }, []);

  // Memoized grid cells for optimal performance
  const gridCells = useMemo(() => {
    return grid.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <CrosswordGridCell
          key={`${rowIndex}-${colIndex}`}
          cell={cell}
          rowIndex={rowIndex}
          colIndex={colIndex}
          isSelecting={isSelecting}
          onSelectionStart={handleSelectionStart}
          onSelectionMove={handleSelectionMove}
          getWordColor={getWordColor}
          highlightedWord={highlightedWord}
        />
      ))
    );
  }, [grid, isSelecting, handleSelectionStart, handleSelectionMove, getWordColor, highlightedWord]);

  // Add touch event listeners for cross-cell movement
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    // Add touch move listener with passive: false to allow preventDefault
    gridElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      gridElement.removeEventListener('touchmove', handleTouchMove);
      if (touchMoveThrottleRef.current) {
        clearTimeout(touchMoveThrottleRef.current);
      }
    };
  }, [handleTouchMove]);

  // Global touch end listener to ensure selection ends even if touch leaves grid
  useEffect(() => {
    if (!isSelecting) return;

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      console.log('Global touch end detected');
      handleSelectionEnd();
    };

    const handleGlobalTouchCancel = (e: TouchEvent) => {
      console.log('Global touch cancel detected');
      handleSelectionEnd();
    };

    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleGlobalTouchCancel, { passive: true });
    
    return () => {
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchCancel);
    };
  }, [isSelecting, handleSelectionEnd]);

  return (
    <div
      ref={gridRef}
      className="crossword-grid"
      style={{ 
        pointerEvents: 'auto',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
      // Mouse selection end handlers
      onMouseUp={handleSelectionEnd}
      onMouseLeave={handleSelectionEnd}
    >
      {gridCells}
    </div>
  );
});
