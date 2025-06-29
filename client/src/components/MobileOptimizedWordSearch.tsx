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

  // Unified handler for starting selection (mouse down or touch start)
  const handleSelectionStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Selection start:', rowIndex, colIndex, cell.letter);
    onSelectionStart(rowIndex, colIndex);
  }, [rowIndex, colIndex, cell.letter, onSelectionStart]);

  // Unified handler for continuing selection (mouse enter or touch move)
  const handleSelectionMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelecting) {
      console.log('Selection move:', rowIndex, colIndex);
      onSelectionMove(rowIndex, colIndex);
    }
  }, [rowIndex, colIndex, isSelecting, onSelectionMove]);

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
      onMouseDown={handleSelectionStart}
      onMouseEnter={handleSelectionMove}
      
      // Touch events
      onTouchStart={handleSelectionStart}
      onTouchMove={handleSelectionMove}
      
      style={{
        background: cell.isFound && cell.wordId ? `var(--word-found-bg)` : undefined,
        color: cell.isFound ? `var(--word-found-text)` : undefined,
        pointerEvents: 'auto',
        touchAction: 'none' // Prevent scrolling and other touch behaviors
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

  // Unified handlers for selection events
  const handleSelectionStart = useCallback((row: number, col: number) => {
    console.log('Selection started at:', row, col);
    setIsSelecting(true);
    onCellMouseDown(row, col);
  }, [onCellMouseDown]);

  const handleSelectionMove = useCallback((row: number, col: number) => {
    console.log('Selection moved to:', row, col);
    if (isSelecting) {
      onCellMouseEnter(row, col);
    }
  }, [isSelecting, onCellMouseEnter]);

  const handleSelectionEnd = useCallback(() => {
    console.log('Selection ended');
    setIsSelecting(false);
    onCellMouseUp();
  }, [onCellMouseUp]);

  // For touch move events that cross multiple cells
  const handleTouchMoveAcrossCells = useCallback((e: TouchEvent) => {
    if (!isSelecting) return;
    
    e.preventDefault(); // Prevent scrolling during selection
    
    const touch = e.touches[0];
    if (!touch) return;
    
    // Find cell at touch coordinates
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellElement = element?.closest('[data-row][data-col]') as HTMLElement;
    
    if (cellElement) {
      const row = parseInt(cellElement.dataset.row || '0');
      const col = parseInt(cellElement.dataset.col || '0');
      handleSelectionMove(row, col);
    }
  }, [isSelecting, handleSelectionMove]);

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

    gridElement.addEventListener('touchmove', handleTouchMoveAcrossCells, { passive: false });
    
    return () => {
      gridElement.removeEventListener('touchmove', handleTouchMoveAcrossCells);
    };
  }, [handleTouchMoveAcrossCells]);

  return (
    <div
      ref={gridRef}
      className="crossword-grid"
      style={{ 
        pointerEvents: 'auto',
        touchAction: 'none' // Prevent scrolling during selection
      }}
      // Unified selection end handlers for mouse and touch
      onMouseUp={handleSelectionEnd}
      onTouchEnd={handleSelectionEnd}
      onMouseLeave={handleSelectionEnd}
      onTouchCancel={handleSelectionEnd}
    >
      {gridCells}
    </div>
  );
});