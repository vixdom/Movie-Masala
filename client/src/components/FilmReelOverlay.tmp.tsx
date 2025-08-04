import React, { useMemo, useEffect, useState } from 'react';
import { WordPlacement } from '../lib/wordSearchGame';
import { cn } from '../lib/utils';

interface FilmReelCell {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  isSelection: boolean;
  direction: string;
  colorIndex: number;
  isShimmering?: boolean;
}

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

  useEffect(() => {
    if (foundWords.length === 0) return;

    const shimmerInterval = setInterval(() => {
      const wordsToShimmer = foundWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);
      
      const newShimmeringWords = new Set(wordsToShimmer.map(w => w.id));
      setShimmeringWords(newShimmeringWords);
      
      setTimeout(() => {
        setShimmeringWords(new Set());
      }, 500);
    }, 6000 + Math.random() * 4000);

    return () => clearInterval(shimmerInterval);
  }, [foundWords]);

  const selectionFilmReelCells = useMemo(() => {
    if (selectedCells.length === 0 || !isSelecting) return [];

    return selectedCells.map((cell, index) => ({
      id: `selection-cell-${cell.row}-${cell.col}`,
      row: cell.row,
      col: cell.col,
      x: cell.col * (100 / 12),
      y: cell.row * (100 / 12),
      width: 100 / 12,
      height: 100 / 12,
      delay: index * 0.05,
      isSelection: true,
      direction: 'horizontal',
      colorIndex: Math.floor(selectedCells.length / 3) % 10 + 1
    }));
  }, [selectedCells, isSelecting]);

  const foundWordFilmReelCells = useMemo(() => {
    if (foundWords.length === 0) return [];

    const cells: FilmReelCell[] = [];
    
    foundWords.forEach(word => {
      const colorIndex = (parseInt(word.id, 36) % 10) + 1;
      
      word.positions.forEach((position) => {
        cells.push({
          id: `found-cell-${word.id}-${position.row}-${position.col}`,
          row: position.row,
          col: position.col,
          x: position.col * (100 / 12),
          y: position.row * (100 / 12),
          width: 100 / 12,
          height: 100 / 12,
          delay: 0,
          isSelection: false,
          direction: word.direction,
          colorIndex,
          isShimmering: shimmeringWords.has(word.id)
        });
      });
    });
    
    return cells;
  }, [foundWords, shimmeringWords]);

  return (
    <svg
      className="film-reel-overlay"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {[...foundWordFilmReelCells, ...selectionFilmReelCells].map((cell) => (
        <rect
          key={cell.id}
          className={cn(
            'film-reel-cell',
            {
              'selection': cell.isSelection,
              'shimmering': cell.isShimmering,
            }
          )}
          x={`${cell.x}%`}
          y={`${cell.y}%`}
          width={`${cell.width}%`}
          height={`${cell.height}%`}
          style={{
            animationDelay: `${cell.delay}s`,
            fill: `var(--word-color-${cell.colorIndex})`,
            opacity: cell.isShimmering ? '0.6' : '0.3',
            transform: cell.direction === 'vertical' ? 'rotate(90deg)' :
                      cell.direction === 'diagonal-down' ? 'rotate(45deg)' :
                      cell.direction === 'diagonal-up' ? 'rotate(-45deg)' : 'none',
            transformOrigin: 'center'
          }}
        />
      ))}
    </svg>
  );
};
