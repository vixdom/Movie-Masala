import React, { useMemo } from 'react';

interface FilmReelOverlayProps {
  selectedCells: { row: number; col: number }[];
  gridRef: React.RefObject<HTMLDivElement>;
  isSelecting: boolean;
}

export const FilmReelOverlay: React.FC<FilmReelOverlayProps> = ({
  selectedCells,
  gridRef,
  isSelecting
}) => {
  // Calculate film reel segments
  const filmReelSegments = useMemo(() => {
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
        id: `segment-${i}`,
        x: centerStartX,
        y: centerStartY,
        width: distance,
        height: 6, // Film strip height
        angle,
        delay: i * 0.05 // Stagger animation
      });
    }
    
    return segments;
  }, [selectedCells, isSelecting]);

  if (!isSelecting || filmReelSegments.length === 0) {
    return null;
  }

  return (
    <div className="film-reel-overlay">
      {filmReelSegments.map((segment, index) => (
        <div
          key={segment.id}
          className={`film-strip extending ${index === filmReelSegments.length - 1 ? 'sparkle' : ''}`}
          style={{
            left: `${segment.x}%`,
            top: `${segment.y}%`,
            width: `${segment.width}%`,
            height: `${segment.height}px`,
            transform: `rotate(${segment.angle}deg)`,
            transformOrigin: '0 50%',
            animationDelay: `${segment.delay}s`,
            zIndex: 25
          }}
        />
      ))}
    </div>
  );
};