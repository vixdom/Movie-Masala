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

  // Calculate film reel segments for selection
  const selectionFilmReelSegments = useMemo(() => {
    if (selectedCells.length < 2 || !isSelecting) return [];

    const segments = [];
    
    for (let i = 0; i < selectedCells.length - 1; i++) {
      const start = selectedCells[i];
      const end = selectedCells[i + 1];
      
      // Calculate position and dimensions for the film strip segment
      const startX = start.col * (100 / 12); // 12 columns
      const startY = start.row * (100 / 12); // 12 rows
      const endX = end.col * (100 / 12);
      const endY = end.row * (100 / 12);
      
      // Calculate center points
      const centerStartX = startX + (100 / 12) / 2;
      const centerStartY = startY + (100 / 12) / 2;
      const centerEndX = endX + (100 / 12) / 2;
      const centerEndY = endY + (100 / 12) / 2;
      
      // Calculate angle and distance
      const deltaX = centerEndX - centerStartX;
      const deltaY = centerEndY - centerStartY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      segments.push({
        id: `selection-segment-${i}`,
        x: centerStartX,
        y: centerStartY,
        width: distance,
        height: 8, // Slightly thicker for selection
        angle,
        delay: i * 0.05, // Stagger animation
        isSelection: true
      });
    }
    
    return segments;
  }, [selectedCells, isSelecting]);

  // Calculate film reel outlines for found words
  const foundWordFilmReelSegments = useMemo(() => {
    if (foundWords.length === 0) return [];

    const segments = [];
    
    foundWords.forEach(word => {
      const positions = word.positions;
      
      for (let i = 0; i < positions.length - 1; i++) {
        const start = positions[i];
        const end = positions[i + 1];
        
        // Calculate position and dimensions for the film strip segment
        const startX = start.col * (100 / 12); // 12 columns
        const startY = start.row * (100 / 12); // 12 rows
        const endX = end.col * (100 / 12);
        const endY = end.row * (100 / 12);
        
        // Calculate center points
        const centerStartX = startX + (100 / 12) / 2;
        const centerStartY = startY + (100 / 12) / 2;
        const centerEndX = endX + (100 / 12) / 2;
        const centerEndY = endY + (100 / 12) / 2;
        
        // Calculate angle and distance
        const deltaX = centerEndX - centerStartX;
        const deltaY = centerEndY - centerStartY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        segments.push({
          id: `found-segment-${word.id}-${i}`,
          x: centerStartX,
          y: centerStartY,
          width: distance,
          height: 6, // Slightly thinner for found words
          angle,
          delay: 0,
          isSelection: false,
          wordId: word.id,
          isShimmering: shimmeringWords.has(word.id)
        });
      }
    });
    
    return segments;
  }, [foundWords, shimmeringWords]);

  // Combine all segments
  const allSegments = [...foundWordFilmReelSegments, ...selectionFilmReelSegments];

  if (allSegments.length === 0) {
    return null;
  }

  return (
    <div className="film-reel-overlay">
      {allSegments.map((segment) => (
        <div
          key={segment.id}
          className={`${
            segment.isSelection 
              ? `film-strip extending ${selectionFilmReelSegments.indexOf(segment) === selectionFilmReelSegments.length - 1 ? 'sparkle' : ''}` 
              : `film-strip-found ${segment.isShimmering ? 'shimmer' : ''}`
          }`}
          style={{
            left: `${segment.x}%`,
            top: `${segment.y}%`,
            width: `${segment.width}%`,
            height: `${segment.height}px`,
            transform: `rotate(${segment.angle}deg)`,
            transformOrigin: '0 50%',
            animationDelay: segment.isSelection ? `${segment.delay}s` : '0s',
            zIndex: segment.isSelection ? 25 : 18
          }}
        />
      ))}
    </div>
  );
};