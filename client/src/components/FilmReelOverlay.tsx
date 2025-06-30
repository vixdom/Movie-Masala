import React, { useMemo, useEffect, useState } from 'react';
import { WordPlacement } from '@/lib/wordSearchGame';

interface FilmReelOverlayProps {
  selectedCells: { row: number; col: number }[];
  gridRef: React.RefObject<HTMLDivElement>;
  isSelecting: boolean;
  foundWords?: WordPlacement[];
}

// Helper function to determine word direction based on positions
const getWordDirection = (positions: { row: number; col: number }[]): string => {
  if (positions.length < 2) return 'horizontal';
  
  const first = positions[0];
  const second = positions[1];
  const deltaRow = second.row - first.row;
  const deltaCol = second.col - first.col;
  
  // Determine direction based on position deltas
  if (deltaRow === 0 && deltaCol > 0) return 'horizontal'; // left to right
  if (deltaRow === 0 && deltaCol < 0) return 'horizontal-reverse'; // right to left
  if (deltaRow > 0 && deltaCol === 0) return 'vertical'; // top to bottom
  if (deltaRow < 0 && deltaCol === 0) return 'vertical-reverse'; // bottom to top
  if (deltaRow > 0 && deltaCol > 0) return 'diagonal-down'; // diagonal down-right
  if (deltaRow < 0 && deltaCol > 0) return 'diagonal-up'; // diagonal up-right
  if (deltaRow > 0 && deltaCol < 0) return 'diagonal-down-left'; // diagonal down-left
  if (deltaRow < 0 && deltaCol < 0) return 'diagonal-up-left'; // diagonal up-left
  
  return 'horizontal'; // default
};

// Helper function to get CSS class for direction
const getDirectionClass = (direction: string): string => {
  switch (direction) {
    case 'vertical':
    case 'vertical-reverse':
      return 'vertical';
    case 'diagonal-down':
      return 'diagonal-down';
    case 'diagonal-up':
      return 'diagonal-up';
    case 'diagonal-down-left':
      return 'diagonal-down-left';
    case 'diagonal-up-left':
      return 'diagonal-up-left';
    default:
      return ''; // horizontal - no rotation needed
  }
};

export const FilmReelOverlay: React.FC<FilmReelOverlayProps> = ({
  selectedCells,
  gridRef,
  isSelecting,
  foundWords = []
}) => {
  const [shimmeringWords, setShimmeringWords] = useState<Set<string>>(new Set());

  // Trigger random shimmer effects on found words (reduced frequency)
  useEffect(() => {
    if (foundWords.length === 0) return;

    const shimmerInterval = setInterval(() => {
      // Randomly select 1 found word to shimmer (reduced from 1-2)
      const wordsToShimmer = foundWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);
      
      const newShimmeringWords = new Set(wordsToShimmer.map(w => w.id));
      setShimmeringWords(newShimmeringWords);
      
      // Clear shimmer after reduced animation duration (0.5s)
      setTimeout(() => {
        setShimmeringWords(new Set());
      }, 500);
    }, 6000 + Math.random() * 4000); // Slightly longer interval between 6-10 seconds

    return () => clearInterval(shimmerInterval);
  }, [foundWords]);

  // Create film reel cells for current selection (extending reel)
  const selectionFilmReelCells = useMemo(() => {
    if (selectedCells.length === 0 || !isSelecting) return [];

    // Determine direction of selection
    const selectionDirection = getWordDirection(selectedCells);
    const directionClass = getDirectionClass(selectionDirection);

    return selectedCells.map((cell, index) => ({
      id: `selection-cell-${cell.row}-${cell.col}`,
      row: cell.row,
      col: cell.col,
      x: cell.col * (100 / 12), // 12 columns
      y: cell.row * (100 / 12), // 12 rows
      width: 100 / 12, // Full cell width
      height: 100 / 12, // Full cell height
      delay: index * 0.05, // Stagger animation for extending effect
      isSelection: true,
      direction: selectionDirection,
      directionClass
    }));
  }, [selectedCells, isSelecting]);

  // Create film reel cells for found words (permanent golden cells)
  const foundWordFilmReelCells = useMemo(() => {
    if (foundWords.length === 0) return [];

    const cells = [];
    
    foundWords.forEach(word => {
      // Determine direction for this word
      const wordDirection = getWordDirection(word.positions);
      const directionClass = getDirectionClass(wordDirection);
      
      word.positions.forEach((position, index) => {
        cells.push({
          id: `found-cell-${word.id}-${position.row}-${position.col}`,
          row: position.row,
          col: position.col,
          x: position.col * (100 / 12), // 12 columns
          y: position.row * (100 / 12), // 12 rows
          width: 100 / 12, // Full cell width
          height: 100 / 12, // Full cell height
          delay: 0,
          isSelection: false,
          wordId: word.id,
          isShimmering: shimmeringWords.has(word.id),
          direction: wordDirection,
          directionClass
        });
      });
    });
    
    return cells;
  }, [foundWords, shimmeringWords]);

  // Combine all film reel cells
  const allFilmReelCells = [...foundWordFilmReelCells, ...selectionFilmReelCells];

  if (allFilmReelCells.length === 0) {
    return null;
  }

  return (
    <div className="film-reel-overlay">
      {allFilmReelCells.map((cell) => (
        <div
          key={cell.id}
          className={`film-reel-cell ${
            cell.isSelection 
              ? `selection-reel extending sparkle ${cell.directionClass}`
              : `found-reel ${cell.isShimmering ? 'shimmer' : ''} ${cell.directionClass}`
          }`}
          style={{
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            width: `${cell.width}%`,
            height: `${cell.height}%`,
            animationDelay: cell.isSelection ? `${cell.delay}s` : '0s',
            zIndex: cell.isSelection ? 25 : 18
          }}
          data-direction={cell.direction}
        />
      ))}
    </div>
  );
};