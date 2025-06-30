import React, { useMemo, useEffect, useState } from 'react';
import { WordPlacement } from '@/lib/wordSearchGame';

interface FilmReelOverlayProps {
  selectedCells: { row: number; col: number }[];
  gridRef: React.RefObject<HTMLDivElement>;
  isSelecting: boolean;
  foundWords?: WordPlacement[];
}

export const FilmReelOverlay: React.FC<FilmReelOverlayProps> = ({
  selectedCells,
  gridRef,
  isSelecting,
  foundWords = []
}) => {
  const [shimmeringWords, setShimmeringWords] = useState<Set<string>>(new Set());

  // Trigger random shimmer effects on found words
  useEffect(() => {
    if (foundWords.length === 0) return;

    const shimmerInterval = setInterval(() => {
      // Randomly select 1-2 found words to shimmer
      const wordsToShimmer = foundWords
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.random() > 0.5 ? 1 : 2);
      
      const newShimmeringWords = new Set(wordsToShimmer.map(w => w.id));
      setShimmeringWords(newShimmeringWords);
      
      // Clear shimmer after animation duration
      setTimeout(() => {
        setShimmeringWords(new Set());
      }, 2000);
    }, 5000 + Math.random() * 3000); // Random interval between 5-8 seconds

    return () => clearInterval(shimmerInterval);
  }, [foundWords]);

  // Create film reel cells for current selection (extending reel)
  const selectionFilmReelCells = useMemo(() => {
    if (selectedCells.length === 0 || !isSelecting) return [];

    return selectedCells.map((cell, index) => ({
      id: `selection-cell-${cell.row}-${cell.col}`,
      row: cell.row,
      col: cell.col,
      x: cell.col * (100 / 12), // 12 columns
      y: cell.row * (100 / 12), // 12 rows
      width: 100 / 12, // Full cell width
      height: 100 / 12, // Full cell height
      delay: index * 0.05, // Stagger animation for extending effect
      isSelection: true
    }));
  }, [selectedCells, isSelecting]);

  // Create film reel cells for found words (permanent golden cells)
  const foundWordFilmReelCells = useMemo(() => {
    if (foundWords.length === 0) return [];

    const cells = [];
    
    foundWords.forEach(word => {
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
          isShimmering: shimmeringWords.has(word.id)
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
              ? 'selection-reel extending sparkle' 
              : `found-reel ${cell.isShimmering ? 'shimmer' : ''}`
          }`}
          style={{
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            width: `${cell.width}%`,
            height: `${cell.height}%`,
            animationDelay: cell.isSelection ? `${cell.delay}s` : '0s',
            zIndex: cell.isSelection ? 25 : 18
          }}
        />
      ))}
    </div>
  );
};