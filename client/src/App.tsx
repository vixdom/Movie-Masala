import { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { OptionsScreen } from './components/OptionsScreen';

type Screen = 'home' | 'game' | 'options';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  const navigateToGame = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const navigateToOptions = useCallback(() => {
    setCurrentScreen('options');
  }, []);

  const navigateToHome = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundMuted(prev => !prev);
  }, []);

  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen 
          onNavigateToGame={navigateToGame}
          onNavigateToOptions={navigateToOptions}
        />
      );
    
    case 'game':
      return (
        <GameScreen
          onBackToHome={navigateToHome}
          isSoundMuted={isSoundMuted}
          onToggleSound={toggleSound}
        />
      );
    
    case 'options':
      return (
        <OptionsScreen
          onBackToHome={navigateToHome}
          isSoundMuted={isSoundMuted}
          onToggleSound={toggleSound}
        />
      );
    
    default:
      return (
        <HomeScreen 
          onNavigateToGame={navigateToGame}
          onNavigateToOptions={navigateToOptions}
        />
      );
  }
}

export default App;