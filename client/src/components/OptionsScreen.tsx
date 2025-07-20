import { Button } from './ui/button';
import { ResponsiveGameLayout } from './ResponsiveGameLayout';
import { ChevronLeft } from 'lucide-react';

interface OptionsScreenProps {
  onBackToHome: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export function OptionsScreen({ onBackToHome, isSoundMuted, onToggleSound }: OptionsScreenProps) {
  return (
    <ResponsiveGameLayout className="h-screen text-white relative overflow-hidden">
      {/* Enhanced film-strip background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Responsive Header */}
      <header className="app-header">
        {/* Back Button */}
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="flex items-center gap-2 hover:bg-yellow-400/20 text-yellow-200 hover:text-white transition-all duration-300 min-h-[var(--touch-target-min)] min-w-[var(--touch-target-min)]"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <span className="bollywood-title text-xl font-bold">Options</span>
        </div>
        
        {/* Spacer */}
        <div className="w-16"></div>
      </header>

      {/* Main Content - Responsive */}
      <div className="flex flex-col items-center justify-start flex-1 px-4 pt-12">
        <div className="w-full max-w-md space-y-8">
          {/* Sound Settings */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
            <h3 className="text-lg font-bold mb-4 text-yellow-200" style={{ fontFamily: "'Cinzel', serif" }}>
              Sound Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Game Sounds</span>
              <Button
                onClick={onToggleSound}
                variant={isSoundMuted ? "outline" : "default"}
                className={`min-h-[var(--touch-target-min)] transition-all duration-300 ${
                  isSoundMuted 
                    ? "bg-transparent border-red-400/60 text-red-300 hover:bg-red-400/20" 
                    : "bollywood-gold-accent hover:scale-105"
                }`}
              >
                {isSoundMuted ? "🔇 Off" : "🔊 On"}
              </Button>
            </div>
          </div>

          {/* Game Settings */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
            <h3 className="text-lg font-bold mb-4 text-yellow-200" style={{ fontFamily: "'Cinzel', serif" }}>
              Game Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Difficulty</span>
                <select className="bg-black/50 border border-yellow-400/40 rounded px-3 py-2 text-white min-h-[var(--touch-target-min)]">
                  <option value="easy">Easy</option>
                  <option value="medium" selected>Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Show Hints</span>
                <Button
                  variant="default"
                  className="bollywood-gold-accent min-h-[var(--touch-target-min)]"
                >
                  ✓ Enabled
                </Button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
            <h3 className="text-lg font-bold mb-4 text-yellow-200" style={{ fontFamily: "'Cinzel', serif" }}>
              About
            </h3>
            
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Bolly Word</strong> v1.0</p>
              <p>A Bollywood word search puzzle game featuring actors, actresses, directors and more.</p>
              <p className="text-yellow-200">Find hidden names in the grid and test your Bollywood knowledge!</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveGameLayout>
  );
}