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
  isMouseDown,
  isTouching,
  onMouseDown,
  onMouseEnter,
  onPointerEnter,
  getWordColor,
  highlightedWord,
  setIsMouseDown,
  setIsTouching
}: {
  cell: GridCellType;
  rowIndex: number;
  colIndex: number;
  isMouseDown: boolean;
  isTouching: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onPointerEnter: (row: number, col: number) => void;
  getWordColor: (wordId: string | undefined) => string;
  highlightedWord?: string | null;
  setIsMouseDown: (value: boolean) => void;
  setIsTouching: (value: boolean) => void;
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
      data-row={rowIndex}
      data-col={colIndex}

      onMouseDown={(e) => {
        e.stopPropagation();
        console.log('Cell clicked:', rowIndex, colIndex, cell.letter);
        setIsMouseDown(true);
        onMouseDown(rowIndex, colIndex);
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        if (isMouseDown) {
          onMouseEnter(rowIndex, colIndex);
        }
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        console.log('Cell pointer down:', rowIndex, colIndex, cell.letter, 'PointerType:', e.pointerType);
        
        if (e.pointerType === 'touch') {
          setIsTouching(true);
        } else {
          setIsMouseDown(true);
        }
        onMouseDown(rowIndex, colIndex);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        if (isTouching || isMouseDown) {
          console.log('Pointer enter during drag:', rowIndex, colIndex, 'PointerType:', e.pointerType);
          onPointerEnter(rowIndex, colIndex);
        }
      }}
      style={{
        background: cell.isFound && cell.wordId ? `var(--word-found-bg)` : undefined,
        color: cell.isFound ? `var(--word-found-text)` : undefined,
        pointerEvents: 'auto'
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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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
    if (isMouseDown || isTouching) {
      console.log('Pointer enter during selection:', row, col);
      onCellMouseEnter(row, col);
    }
  }, [isMouseDown, isTouching, onCellMouseEnter]);

  // Get cell at touch coordinates
  const getCellAtPosition = useCallback((x: number, y: number) => {
    if (!gridRef.current) return null;
    
    const element = document.elementFromPoint(x, y);
    if (!element) return null;
    
    const cellElement = element.closest('[data-row][data-col]') as HTMLElement;
    if (!cellElement) return null;
    
    const row = parseInt(cellElement.dataset.row || '0');
    const col = parseInt(cellElement.dataset.col || '0');
    
    return { row, col };
  }, []);

  // Handle touch move for better mobile selection
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isTouching) return;
    
    e.preventDefault(); // Prevent scrolling during selection
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const cell = getCellAtPosition(touch.clientX, touch.clientY);
    if (cell) {
      console.log('Touch move to cell:', cell.row, cell.col);
      onCellMouseEnter(cell.row, cell.col);
    }
  }, [isTouching, getCellAtPosition, onCellMouseEnter]);

  // Memoized grid cells for optimal performance
  const gridCells = useMemo(() => {
    return grid.flatMap((row, rowIndex) =>
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
          getWordColor={getWordColor}
          highlightedWord={highlightedWord}
          setIsMouseDown={setIsMouseDown}
          setIsTouching={setIsTouching}
        />
      ))
    );
  }, [grid, isMouseDown, isTouching, onCellMouseDown, onCellMouseEnter, handlePointerEnter, getWordColor, highlightedWord]);

  // Add touch event listeners for better mobile support
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    gridElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      gridElement.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchMove]);

  return (
    <div
      ref={gridRef}
      className="crossword-grid"
      style={{ pointerEvents: 'auto' }}
      onMouseUp={() => {
        console.log('Grid mouseUp');
        setIsMouseDown(false);
        onCellMouseUp();
      }}
      onPointerUp={(e) => {
        console.log('Grid pointer up, type:', e.pointerType);
        if (e.pointerType === 'touch') {
          setIsTouching(false);
        } else {
          setIsMouseDown(false);
        }
        onCellMouseUp();
      }}
      onMouseLeave={() => {
        console.log('Mouse left grid');
        setIsMouseDown(false);
        onCellMouseUp();
      }}
      onPointerLeave={(e) => {
        console.log('Pointer left grid, type:', e.pointerType);
        if (e.pointerType === 'touch') {
          setIsTouching(false);
        } else {
          setIsMouseDown(false);
        }
        onCellMouseUp();
      }}
    >
      {gridCells}
    </div>
  );
});