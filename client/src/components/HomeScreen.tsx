import { Button } from './ui/button';

interface HomeScreenProps {
  onNavigateToGame: () => void;
  onNavigateToOptions: () => void;
}

export function HomeScreen({ onNavigateToGame, onNavigateToOptions }: HomeScreenProps) {
  return (
    <div className="h-screen text-white relative overflow-hidden">
      {/* Enhanced film-strip background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Header - Exactly 10% viewport height */}
      <header className="app-header justify-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎬</span>
          <span className="bollywood-title text-2xl font-bold">Movie Masala</span>
        </div>
      </header>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center h-[90vh] px-4">
        <div className="text-center mb-12">
          {/* Subtitle/Tagline */}
          <p className="text-lg font-medium text-yellow-200 mb-8 max-w-md mx-auto leading-relaxed" 
             style={{ fontFamily: "'Playfair Display', serif" }}>
            Find your favorite stars, one name at a time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Button
            onClick={onNavigateToGame}
            className="w-full h-16 text-xl font-bold bollywood-gold-accent hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl min-h-[44px]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Play Now
          </Button>
          
          <Button
            onClick={onNavigateToOptions}
            variant="outline"
            className="w-full h-16 text-xl font-bold bg-transparent border-2 border-yellow-400/60 text-yellow-200 hover:bg-yellow-400/20 hover:border-yellow-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl min-h-[44px]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Options
          </Button>
        </div>
      </div>
    </div>
  );
}