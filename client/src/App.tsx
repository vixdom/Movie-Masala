import React, { useState, useEffect, useCallback } from 'react';
import { WordSearch } from './components/WordSearch';
import { WordList } from './components/WordList';
import { WordFoundAnimation } from './components/WordFoundAnimation';
import { Button } from './components/ui/button';
import { WordSearchGame } from './lib/wordSearchGame';
import { getGameWords, type WordListItem } from './lib/bollywoodWords';
import { useAudio } from './lib/stores/useAudio';
import { cn } from './lib/utils';

function App() {
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(() => game.getGameState());
  const [currentWords, setCurrentWords] = useState<WordListItem[]>([]);
  const [wordFoundAnimation, setWordFoundAnimation] = useState<string | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string>('');
  const { playHit, playSuccess, toggleMute, isMuted, initializeAudio } = useAudio();

  // Initialize audio
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Start a new game
  const startNewGame = useCallback(() => {
    const words = getGameWords(10); // Get all 10 selected actors for 12x12 grid
    const wordStrings = words.map(w => w.word);
    
    game.resetGame();
    game.generateGrid(wordStrings);
    const newGameState = game.getGameState();
    
    // Only show words that were actually placed in the grid
    const placedWords = newGameState.words.map(wp => wp.word);
    const filteredWords = words.filter(w => placedWords.includes(w.word));
    
    setCurrentWords(filteredWords);
    setGameState(newGameState);
  }, [game]);

  // Initialize the first game
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle mouse/touch events
  const handleCellMouseDown = useCallback((row: number, col: number) => {
    game.startSelection(row, col);
    setGameState({ ...game.getGameState() });
  }, [game]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    game.updateSelection(row, col);
    const newGameState = game.getGameState();
    setGameState(newGameState);
    setCurrentSelection(game.getCurrentSelectionWord());
  }, [game]);

  const handleCellMouseUp = useCallback(() => {
    const wordFound = game.endSelection();
    const newGameState = game.getGameState();
    setGameState(newGameState);
    setCurrentSelection('');
    
    if (wordFound) {
      playSuccess();
      // Gentle vibration for word found
      if (navigator.vibrate) {
        navigator.vibrate(50); // Short gentle vibration
      }
    } else {
      playHit();
    }
  }, [game, playSuccess, playHit]);

  // Touch events
  const handleCellTouchStart = useCallback((row: number, col: number) => {
    handleCellMouseDown(row, col);
  }, [handleCellMouseDown]);

  const handleCellTouchMove = useCallback((event: React.TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.hasAttribute('data-row') && element.hasAttribute('data-col')) {
        const row = parseInt(element.getAttribute('data-row') || '0');
        const col = parseInt(element.getAttribute('data-col') || '0');
        handleCellMouseEnter(row, col);
      }
    }
  }, [handleCellMouseEnter]);

  const handleCellTouchEnd = useCallback(() => {
    handleCellMouseUp();
  }, [handleCellMouseUp]);

  const handleHighlightWord = useCallback((wordPlacement: any) => {
    setHighlightedWord(wordPlacement.word);
    // Clear highlight after 1 second
    setTimeout(() => {
      setHighlightedWord(null);
    }, 1000);
  }, []);

  const foundWords = game.getFoundWords();
  const remainingWords = game.getRemainingWords();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Bollywood Movie Poster Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1200'%3E%3Cdefs%3E%3ClinearGradient id='bollywood' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b35;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23f7931e;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ffcd3c;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='1200' fill='url(%23bollywood)'/%3E%3Ctext x='400' y='300' text-anchor='middle' font-family='serif' font-size='120' font-weight='bold' fill='%23000' opacity='0.3'%3EMOVIE%3C/text%3E%3Ctext x='400' y='450' text-anchor='middle' font-family='serif' font-size='120' font-weight='bold' fill='%23000' opacity='0.3'%3EMASALA%3C/text%3E%3Ccircle cx='200' cy='800' r='150' fill='%23000' opacity='0.1'/%3E%3Ccircle cx='600' cy='900' r='120' fill='%23000' opacity='0.1'/%3E%3Cpolygon points='100,1000 200,950 150,850' fill='%23000' opacity='0.15'/%3E%3Cpolygon points='650,700 750,650 700,550' fill='%23000' opacity='0.15'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Overlay gradient - darker for better mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95">
        {/* Floating MM Logo and Score */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button 
            onClick={startNewGame}
            className="flex items-center space-x-1 hover:scale-105 transition-transform active:scale-95"
            title="Click to start new game"
          >
            {/* Square M tiles */}
            <div className="w-10 h-10 bg-orange-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-orange-400 shadow-lg">
              <div className="text-white font-black text-lg">M</div>
            </div>
            <div className="w-10 h-10 bg-orange-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-orange-400 shadow-lg">
              <div className="text-white font-black text-lg">M</div>
            </div>
          </button>
          
          {/* Score Pill */}
          <div className="bg-white text-orange-600 rounded-full px-4 py-2 text-sm font-bold shadow-lg">
            Score: {gameState.score}
          </div>
        </div>

        {/* Key Box - Actor Names */}
        <div className="mt-20">
        <WordList
          words={currentWords}
          foundWords={foundWords}
          remainingWords={remainingWords}
          allWordPlacements={gameState.words}
          onHighlightWord={handleHighlightWord}
        />
      </div>

      {/* Main Game Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Selection Bubble */}
        {currentSelection && (
          <div className="absolute top-4 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg z-20 transition-all duration-200">
            <span className="text-2xl font-bold tracking-widest">
              {currentSelection.split('').join(' ')}
            </span>
          </div>
        )}
        
        <WordSearch
          grid={gameState.grid}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
          onCellTouchStart={handleCellTouchStart}
          onCellTouchMove={handleCellTouchMove}
          onCellTouchEnd={handleCellTouchEnd}
          highlightedWord={highlightedWord}
        />
      </div>



      {/* Completion Message */}
      {gameState.isComplete && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm mx-4">
            <div className="text-2xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-600 mb-4">
              You found all the Bollywood actors!
            </p>
            <Button onClick={startNewGame} className="w-full">
              Play Again
            </Button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

export default App;