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
  highlightedWord,
  setIsMouseDown,
  setIsTouching,
  selectionAnimation
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
  setIsMouseDown: (value: boolean) => void;
  setIsTouching: (value: boolean) => void;
  selectionAnimation: {[key: string]: boolean};
}) => {
  const cellKey = `${rowIndex}-${colIndex}`;
  const hasGlassySweep = selectionAnimation[cellKey];
  return (
    <div
      className={cn(
        'crossword-cell',
        {
          'selected': cell.isSelected && !cell.isFound,
          'found': cell.isFound,
          'highlighted': highlightedWord && cell.wordId && cell.wordId.startsWith(highlightedWord + '-') && !cell.isFound,
          'glassy-sweep': hasGlassySweep && cell.isSelected,
        }
      )}
      data-row={rowIndex}
      data-col={colIndex}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Cell clicked:', rowIndex, colIndex, cell.letter);
        setIsMouseDown(true);
        onMouseDown(rowIndex, colIndex);
      }}
      onMouseEnter={() => {
        console.log('Cell mouseEnter:', rowIndex, colIndex, 'isMouseDown:', isMouseDown);
        if (isMouseDown) {
          // Gentle haptic feedback for each letter with golden effect
          if (navigator.vibrate) {
            navigator.vibrate(15);
          }
          onMouseEnter(rowIndex, colIndex);
        }
      }}
      onPointerEnter={() => {
        if (isMouseDown || isTouching) {
          console.log('Pointer enter on mobile cell:', rowIndex, colIndex);
          onPointerEnter(rowIndex, colIndex);
        }
      }}
      onTouchStart={(e) => {
        setIsMouseDown(true);
        setIsTouching(true);
        
        // Apply glassy sweep effect
        const element = e.currentTarget as HTMLElement;
        element.classList.add('touch-glassy-active');
        console.log('Touch start on cell:', rowIndex, colIndex);
        
        onTouchStart(rowIndex, colIndex);
      }}
      onTouchMove={(e) => {
        if (isTouching) {
          console.log('Touch move on cell:', rowIndex, colIndex);
          // Apply glassy effect immediately when touching this cell
          const element = e.currentTarget as HTMLElement;
          if (!element.classList.contains('touch-glassy-active')) {
            element.classList.add('touch-glassy-active');
            console.log('Applied glassy effect to cell:', rowIndex, colIndex);
            
            // Remove after animation
            setTimeout(() => {
              element.classList.remove('touch-glassy-active');
            }, 600);
            
            // Haptic feedback
            if (navigator.vibrate) {
              navigator.vibrate(10);
            }
          }
          onTouchMove(e);
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Cell onClick triggered:', rowIndex, colIndex, cell.letter);
      }}
    >
      <span className="cell-letter">{cell.letter}</span>
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
  const [selectionAnimation, setSelectionAnimation] = useState<{[key: string]: boolean}>({});
  
  // Function to trigger animation for any cell - now with direct DOM manipulation for mobile
  const triggerCellAnimation = useCallback((row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    
    // Set React state for animation
    setSelectionAnimation(prev => ({
      ...prev,
      [cellKey]: true
    }));
    
    // Also trigger CSS class directly for mobile reliability
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
    if (cellElement) {
      cellElement.classList.add('glassy-sweep-active');
      console.log('Added glassy-sweep-active class to cell:', row, col);
      
      setTimeout(() => {
        cellElement.classList.remove('glassy-sweep-active');
      }, 800);
    }
    
    // Clear React state animation after it completes
    setTimeout(() => {
      setSelectionAnimation(prev => {
        const newState = { ...prev };
        delete newState[cellKey];
        return newState;
      });
    }, 800);
  }, []);

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

  // Handle pointer events for drag selection with glassy sweep animation
  const handlePointerEnter = useCallback((row: number, col: number) => {
    if (isMouseDown || isTouching) {
      // Trigger glassy sweep animation for this cell
      const cellKey = `${row}-${col}`;
      console.log('Triggering glassy sweep for:', cellKey, 'touch:', isTouching, 'mouse:', isMouseDown);
      
      // Update React state
      setSelectionAnimation(prev => ({
        ...prev,
        [cellKey]: true
      }));
      
      // Also add CSS class directly for mobile reliability
      const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
      if (cellElement) {
        cellElement.classList.add('glassy-sweep-active');
        console.log('Added glassy-sweep-active class to cell:', row, col);
      }
      
      // Clear animation after it completes
      setTimeout(() => {
        setSelectionAnimation(prev => {
          const newState = { ...prev };
          delete newState[cellKey];
          return newState;
        });
        
        if (cellElement) {
          cellElement.classList.remove('glassy-sweep-active');
        }
      }, 800);
      
      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
      
      onCellMouseEnter(row, col);
    }
  }, [isMouseDown, isTouching, onCellMouseEnter]);

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
          setIsMouseDown={setIsMouseDown}
          setIsTouching={setIsTouching}
          selectionAnimation={selectionAnimation}
        />
      ))
    );
  }, [grid, isMouseDown, isTouching, onCellMouseDown, onCellMouseEnter, handlePointerEnter, onCellTouchStart, getWordColor, highlightedWord, selectionAnimation]);

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
      onMouseLeave={() => {
        console.log('Grid mouseLeave');
        setIsMouseDown(false);
        onCellMouseUp();
      }}
      onTouchMove={onCellTouchMove}
      onTouchEnd={() => {
        console.log('Grid touchEnd');
        setIsTouching(false);
        setIsMouseDown(false);
        onCellTouchEnd();
      }}
    >
      {renderedGrid}
    </div>
  );
});