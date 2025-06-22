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

// Memoized cell component for better performance
const OptimizedGridCell = memo(({ 
  cell, 
  rowIndex, 
  colIndex, 
  isMouseDown,
  isTouching,
  onMouseDown,
  onMouseEnter,
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
  onTouchStart: (row: number, col: number) => void;
  getWordColor: (wordId: string | undefined) => string;
  highlightedWord?: string | null;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center text-3xl md:text-2xl font-black cursor-pointer transition-transform duration-100 select-none rounded-xl touch-manipulation shadow-lg',
        'active:scale-95',
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
        touchAction: 'manipulation',
      }}
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

  // Optimized grid rendering with memoization
  const renderedGrid = useMemo(() => {
    return grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          cell={cell}
          rowIndex={rowIndex}
          colIndex={colIndex}
          isMouseDown={isMouseDown}
          isTouching={isTouching}
          onMouseDown={onCellMouseDown}
          onMouseEnter={onCellMouseEnter}
          onTouchStart={onCellTouchStart}
          getWordColor={getWordColor}
          highlightedWord={highlightedWord}
        />
      ))
    );
  }, [grid, isMouseDown, isTouching, onCellMouseDown, onCellMouseEnter, onCellTouchStart, getWordColor, highlightedWord]);

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
        onMouseUp={() => {
          setIsMouseDown(false);
          onCellMouseUp();
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
    </div>
  );
});