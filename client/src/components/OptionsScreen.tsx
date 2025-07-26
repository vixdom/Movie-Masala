import { Button } from './ui/button';
import { ResponsiveGameLayout } from './ResponsiveGameLayout';
import { ChevronLeft } from 'lucide-react';
import { useTheme, Theme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

interface OptionsScreenProps {
  onBackToHome: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export function OptionsScreen({ onBackToHome, isSoundMuted, onToggleSound }: OptionsScreenProps) {
  const { setTheme } = useTheme();
  return (
    <ResponsiveGameLayout className="h-screen text-white relative overflow-hidden">

      
      {/* Responsive Header */}
      <header className="app-header" style={{ backgroundColor: 'transparent', borderBottom: '2px solid var(--color-primary)' }}>
        {/* Back Button */}
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="flex items-center gap-2 transition-all duration-300 min-h-[var(--touch-target-min)] min-w-[var(--touch-target-min)]"
          style={{ color: 'var(--color-primary)' }}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Options</span>
        </div>
        
        {/* Spacer */}
        <div className="w-16"></div>
      </header>

      {/* Main Content - Responsive */}
      <div className="flex flex-col items-center justify-start flex-1 px-4 pt-12">
        <div className="w-full max-w-md space-y-8">
          {/* Theme Settings */}
          <div style={{ backgroundColor: 'var(--color-grid-bg)', border: '1px solid var(--color-border)' }} className="backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)', fontFamily: "'Cinzel', serif" }}>
              Theme Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ThemePreview
                theme="anurag-kashyap"
                name="Anurag Kashyap"
                colors={['#141414', '#1E1E1E', '#FFD700', '#FF4444']}
                onClick={() => setTheme('anurag-kashyap')}
              />
              <ThemePreview
                theme="raju-hirani"
                name="Raju Hirani"
                colors={['#F4F0E6', '#FFFFFF', '#1976D2', '#53B759']}
                onClick={() => setTheme('raju-hirani')}
              />
            </div>
          </div>
          {/* Sound Settings */}
          <div style={{ backgroundColor: 'var(--color-grid-bg)', border: '1px solid var(--color-border)' }} className="backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)', fontFamily: "'Cinzel', serif" }}>
              Sound Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--color-text)' }} className="font-medium">Game Sounds</span>
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
          <div style={{ backgroundColor: 'var(--color-grid-bg)', border: '1px solid var(--color-border)' }} className="backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)', fontFamily: "'Cinzel', serif" }}>
              Game Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text)' }} className="font-medium">Difficulty</span>
                <select style={{ backgroundColor: 'var(--color-button-bg)', color: 'var(--color-button-text)', border: '1px solid var(--color-primary)' }} className="rounded px-3 py-2 min-h-[var(--touch-target-min)]">
                  <option value="easy">Easy</option>
                  <option value="medium" selected>Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text)' }} className="font-medium">Show Hints</span>
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
          <div style={{ backgroundColor: 'var(--color-grid-bg)', border: '1px solid var(--color-border)' }} className="backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)', fontFamily: "'Cinzel', serif" }}>
              About
            </h3>
            
            <div className="text-sm space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
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

interface ThemePreviewProps {
  theme: Theme;
  name: string;
  colors: string[];
  onClick: () => void;
}

function ThemePreview({ theme, name, colors, onClick }: ThemePreviewProps) {
  const { theme: currentTheme } = useTheme();
  const isSelected = theme === currentTheme;

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg p-4 border-2 transition-all',
        isSelected ? 'border-[var(--color-highlight)]' : 'border-[var(--color-border)]'
      )}
      style={{ backgroundColor: 'var(--color-grid-bg)' }}
    >
      <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>{name}</h4>
      <div className="flex space-x-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full shadow-inner"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
}