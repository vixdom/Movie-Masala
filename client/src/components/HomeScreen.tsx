import { Button } from './ui/button';
import { ResponsiveGameLayout } from './ResponsiveGameLayout';

interface HomeScreenProps {
  onNavigateToGame: () => void;
  onNavigateToOptions: () => void;
}

export function HomeScreen({ onNavigateToGame, onNavigateToOptions }: HomeScreenProps) {
  const handleGameClick = () => {
    console.log('Play Now button clicked');
    onNavigateToGame();
  };

  const handleOptionsClick = () => {
    console.log('Options button clicked');
    onNavigateToOptions();
  };

  return (
    <ResponsiveGameLayout className="h-screen text-white relative overflow-hidden">
      {/* Enhanced film-strip background overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      {/* Responsive Header */}
      <header className="app-header justify-center">
        {/* Empty spacers for consistent layout */}
        <div></div>
        <div></div>
      </header>
      
      {/* Main Content - Responsive Centered Layout */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        {/* Large Title Section - Responsive */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="text-6xl md:text-7xl">🎬</span>
            <h1 className="bollywood-title text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-300 drop-shadow-2xl" 
                style={{ fontFamily: "'Cinzel', serif" }}>
              Bolly Word
            </h1>
          </div>
          
          {/* Subtitle/Tagline - Responsive */}
          <p className="text-xl md:text-2xl font-medium text-yellow-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg" 
             style={{ fontFamily: "'Playfair Display', serif" }}>
            Find hidden Bollywood names in this word search puzzle.
          </p>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col gap-8 w-full max-w-lg relative z-20">
          <button
            onClick={handleGameClick}
            className="w-full h-20 text-2xl font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl min-h-[var(--touch-target-min)] rounded-lg cursor-pointer relative z-30 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-[#0B1F3A] border-4 border-yellow-300 hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Cinzel', serif" }}
            type="button"
            onMouseDown={(e) => console.log('Play Now mousedown', e)}
            onMouseUp={(e) => console.log('Play Now mouseup', e)}
          >
            <span className="drop-shadow-md">Play Now</span>
          </button>
          
          <button
            onClick={handleOptionsClick}
            className="w-full h-20 text-2xl font-bold bg-transparent border-2 border-yellow-400/60 text-yellow-200 hover:bg-yellow-400/20 hover:border-yellow-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl min-h-[var(--touch-target-min)] rounded-lg cursor-pointer relative z-30"
            style={{ fontFamily: "'Cinzel', serif" }}
            type="button"
          >
            Options
          </button>
        </div>
      </div>
    </ResponsiveGameLayout>
  );
}