import React, { useRef, useCallback, useState, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { GridCell as GridCellType } from '@/lib/wordSearchGame';

interface WordSearchProps {
  grid: GridCellType[][];
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  onCellTouchStart: (row: number, col: number) => void;
  onCellTouchMove: (event: React.TouchEvent) => void;
  onCellTouchEnd: () => void;
  highlightedWord?: string | null;
}

// Crossword-style cell component for sleek grid layout
const CrosswordGridCell = memo(({ 
  cell, 
  rowIndex, 
  colIndex, 
  isMouseDown,
  isTouching,
  onMouseDown,
  onMouseEnter,
  onPointerEnter,
  onTouchStart,
  getWordColor,
  highlightedWord 
}: {
  cell: GridCellType;
  rowIndex: number;
  colIndex: number;
  isMouseDown: boolean;
  isTouching: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onPointerEnter: (row: number, col: number) => void;
  onTouchStart: (row: number, col: number) => void;
  getWordColor: (wordId: string | undefined) => string;
  highlightedWord?: string | null;
}) => {
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
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(rowIndex, colIndex);
      }}
      onMouseEnter={() => {
        if (isMouseDown) {
          // Gentle haptic feedback for each letter
          if (navigator.vibrate) {
            navigator.vibrate(10);
          }
          onMouseEnter(rowIndex, colIndex);
        }
      }}
      onPointerEnter={() => {
        if (isMouseDown) {
          onPointerEnter(rowIndex, colIndex);
        }
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        onTouchStart(rowIndex, colIndex);
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
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd,
  highlightedWord,
}: WordSearchProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

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

  // Handle pointer events for drag selection
  const handlePointerEnter = useCallback((row: number, col: number) => {
    if (isMouseDown) {
      onCellMouseEnter(row, col);
    }
  }, [isMouseDown, onCellMouseEnter]);

  // Optimized grid rendering with memoization
  const renderedGrid = useMemo(() => {
    return grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <CrosswordGridCell
          key={`${rowIndex}-${colIndex}`}
          cell={cell}
          rowIndex={rowIndex}
          colIndex={colIndex}
          isMouseDown={isMouseDown}
          isTouching={isTouching}
          onMouseDown={onCellMouseDown}
          onMouseEnter={onCellMouseEnter}
          onPointerEnter={handlePointerEnter}
          onTouchStart={onCellTouchStart}
          getWordColor={getWordColor}
          highlightedWord={highlightedWord}
        />
      ))
    );
  }, [grid, isMouseDown, isTouching, onCellMouseDown, onCellMouseEnter, handlePointerEnter, onCellTouchStart, getWordColor, highlightedWord]);

  return (
    <div
      ref={gridRef}
      className="crossword-grid"
      onMouseUp={() => {
        setIsMouseDown(false);
        onCellMouseUp();
      }}
      onMouseDown={() => {
        setIsMouseDown(true);
      }}
      onMouseLeave={() => {
        setIsMouseDown(false);
        onCellMouseUp();
      }}
      onTouchMove={onCellTouchMove}
      onTouchEnd={() => {
        setIsTouching(false);
        onCellTouchEnd();
      }}
    >
      {renderedGrid}
    </div>
  );
});