import React, { useRef, useCallback, useState, useMemo, memo, useEffect } from 'react';
import { cn } from '../lib/utils';
import { GridCell as GridCellType, WordPlacement } from '../lib/wordSearchGame';
import { FilmReelOverlay } from './FilmReelOverlay';

interface WordSearchProps {
  grid: GridCellType[][];
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  highlightedWord?: string | null;
  foundWords?: WordPlacement[];
  wordColors?: Map<string, number>;
}

// Crossword-style cell component for sleek grid layout
const CrosswordGridCell = memo(({ 
  cell, 
  rowIndex, 
  colIndex, 
  isSelecting,
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  getWordColor,
  highlightedWord,
  selectedCells
}: {
  cell: GridCellType;
  rowIndex: number;
  colIndex: number;
  isSelecting: boolean;
  onSelectionStart: (row: number, col: number) => void;
  onSelectionMove: (row: number, col: number) => void;
  onSelectionEnd: () => void;
  getWordColor: (wordId: string | undefined) => string;
  highlightedWord?: string | null;
  selectedCells: { row: number; col: number }[];
}) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const lastHapticTime = useRef<number>(0);

  // Check if this cell is currently selected and get its color
  const isCurrentlySelected = selectedCells.some(
    selectedCell => selectedCell.row === rowIndex && selectedCell.col === colIndex
  );
  
  const getSelectedColor = useCallback(() => {
    if (cell.wordId) {
      const colorIndex = (parseInt(cell.wordId, 36) % 10) + 1;
      return `var(--word-color-${colorIndex})`;
    }
    return 'var(--word-color-1)';
  }, [cell.wordId]);

  const cellStyle = useMemo(() => ({
    '--word-color-current': isCurrentlySelected ? getSelectedColor() : 'transparent'
  } as React.CSSProperties), [isCurrentlySelected, getSelectedColor]);

  // Haptic feedback function with throttling
  const triggerHaptic = useCallback((intensity: number = 20) => {
    const now = Date.now();
    // Throttle haptic feedback to prevent overwhelming sensations
    if (now - lastHapticTime.current > 50) { // 50ms minimum between haptics
      if ('vibrate' in navigator) {
        navigator.vibrate(intensity);
      }
      lastHapticTime.current = now;
    }
  }, []);

  // Mouse down handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Mouse down:', rowIndex, colIndex, cell.letter);
    triggerHaptic(25); // Slightly stronger for selection start
    onSelectionStart(rowIndex, colIndex);
  }, [rowIndex, colIndex, cell.letter, onSelectionStart, triggerHaptic]);

  // Mouse enter handler
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (isSelecting && !isCurrentlySelected) {
      console.log('Mouse enter during selection:', rowIndex, colIndex);
      triggerHaptic(15); // Gentle haptic for each new letter
      onSelectionMove(rowIndex, colIndex);
    }
  }, [rowIndex, colIndex, isSelecting, onSelectionMove, triggerHaptic, isCurrentlySelected]);

  // Native touch event handlers for non-passive events
  const handleNativeTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Touch start:', rowIndex, colIndex, cell.letter);
    
    // Add visual feedback for touch
    const target = e.currentTarget as HTMLElement;
    target.classList.add('touch-glassy-active');
    
    // Strong haptic for touch start
    triggerHaptic(25);
    
    onSelectionStart(rowIndex, colIndex);
  }, [rowIndex, colIndex, cell.letter, onSelectionStart, triggerHaptic]);

  const handleNativeTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelecting && e.touches.length > 0) {
      const touch = e.touches[0];
      
      // Get element under the touch point
      const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
      const cellElement = elementUnderTouch?.closest('[data-row][data-col]') as HTMLElement;
      
      if (cellElement) {
        const row = parseInt(cellElement.dataset.row || '0', 10);
        const col = parseInt(cellElement.dataset.col || '0', 10);
        
        // Only trigger haptic and move if this is a new cell
        const isNewCell = !selectedCells.some(selected => selected.row === row && selected.col === col);
        
        if (isNewCell) {
          console.log('Touch move to NEW cell:', row, col);
          
          // Add visual feedback to dragged cells
          if (!cellElement.classList.contains('touch-glassy-active')) {
            cellElement.classList.add('touch-glassy-active');
            
            // Remove the effect after a short duration
            setTimeout(() => {
              cellElement.classList.remove('touch-glassy-active');
            }, 600);
          }
          
          // Gentle haptic feedback for each new letter crossed
          triggerHaptic(12);
          
          onSelectionMove(row, col);
        }
      }
    }
  }, [isSelecting, onSelectionMove, triggerHaptic, selectedCells]);

  const handleNativeTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Touch end:', rowIndex, colIndex);
    
    // Remove visual feedback
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('touch-glassy-active');
    
    // Final haptic for selection end
    triggerHaptic(30);
    
    onSelectionEnd();
  }, [rowIndex, colIndex, onSelectionEnd, triggerHaptic]);

  // Attach native event listeners with passive: false
  useEffect(() => {
    const cellElement = cellRef.current;
    if (!cellElement) return;

    // Add touch event listeners with passive: false to allow preventDefault
    cellElement.addEventListener('touchstart', handleNativeTouchStart, { passive: false });
    cellElement.addEventListener('touchmove', handleNativeTouchMove, { passive: false });
    cellElement.addEventListener('touchend', handleNativeTouchEnd, { passive: false });

    return () => {
      // Cleanup event listeners
      cellElement.removeEventListener('touchstart', handleNativeTouchStart);
      cellElement.removeEventListener('touchmove', handleNativeTouchMove);
      cellElement.removeEventListener('touchend', handleNativeTouchEnd);
    };
  }, [handleNativeTouchStart, handleNativeTouchMove, handleNativeTouchEnd]);

  return (
    <div
      ref={cellRef}
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
      data-found={cell.isFound}
      
      // Mouse events only (touch events handled by native listeners)
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      
      style={{
        ...cellStyle,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 1
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
  highlightedWord,
  foundWords = []
}: WordSearchProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);

  // Unified handlers for selection events
  const handleSelectionStart = useCallback((row: number, col: number) => {
    console.log('Selection started at:', row, col);
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
    onCellMouseDown(row, col);
  }, [onCellMouseDown]);

  const handleSelectionMove = useCallback((row: number, col: number) => {
    if (isSelecting) {
      console.log('Selection moved to:', row, col);
      
      // Update selected cells for film reel effect
      setSelectedCells(prevCells => {
        // Check if this cell is already selected to avoid duplicates
        const alreadySelected = prevCells.some(cell => cell.row === row && cell.col === col);
        if (alreadySelected) {
          return prevCells;
        }
        
        // Add the new cell to the path
        const newCells = [...prevCells, { row, col }];
        return newCells;
      });
      
      onCellMouseEnter(row, col);
    }
  }, [isSelecting, onCellMouseEnter]);

  const handleSelectionEnd = useCallback(() => {
    console.log('Selection ended');
    setIsSelecting(false);
    setSelectedCells([]);
    onCellMouseUp();
  }, [onCellMouseUp]);

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
          onSelectionEnd={handleSelectionEnd}
          getWordColor={getWordColor}
          highlightedWord={highlightedWord}
          selectedCells={selectedCells}
        />
      ))
    );
  }, [grid, isSelecting, handleSelectionStart, handleSelectionMove, handleSelectionEnd, getWordColor, highlightedWord, selectedCells]);

  // Handle mouse events for non-touch devices
  const handleMouseUp = useCallback(() => {
    console.log('Mouse up detected');
    handleSelectionEnd();
  }, [handleSelectionEnd]);

  const handleMouseLeave = useCallback(() => {
    console.log('Mouse leave detected');
    if (isSelecting) {
      handleSelectionEnd();
    }
  }, [isSelecting, handleSelectionEnd]);

  // Add global touch event listeners to handle touch moves outside the grid
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isSelecting) {
        e.preventDefault();
        
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const element = document.elementFromPoint(touch.clientX, touch.clientY);
          const cellElement = element?.closest('[data-row][data-col]') as HTMLElement;
          
          if (cellElement) {
            const row = parseInt(cellElement.dataset.row || '0', 10);
            const col = parseInt(cellElement.dataset.col || '0', 10);
            
            // Only move selection if this is a new cell
            const isNewCell = !selectedCells.some(selected => selected.row === row && selected.col === col);
            if (isNewCell) {
              handleSelectionMove(row, col);
            }
          }
        }
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isSelecting) {
        handleSelectionEnd();
      }
    };

    // Add global listeners with passive: false to allow preventDefault
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isSelecting, handleSelectionMove, handleSelectionEnd, selectedCells]);

  return (
    <div
      ref={gridRef}
      className="crossword-grid"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 5
      }}
      // Mouse selection end handlers
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {gridCells}
      
      {/* Golden Film Reel Overlay - Enhanced with Found Words */}
      <FilmReelOverlay 
        selectedCells={selectedCells}
        gridRef={gridRef}
        isSelecting={isSelecting}
        foundWords={foundWords}
      />
    </div>
  );
});