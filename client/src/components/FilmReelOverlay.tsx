import React from 'react';

interface FilmReelOverlayProps {
  isActive: boolean;
  children?: React.ReactNode;
}

const FilmReelOverlay: React.FC<FilmReelOverlayProps> = ({ isActive, children }) => {
  return (
    <div
      className={`film-reel-overlay ${isActive ? 'active' : ''}`}
      style={{
        pointerEvents: 'none',
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export { FilmReelOverlay };
export default FilmReelOverlay;