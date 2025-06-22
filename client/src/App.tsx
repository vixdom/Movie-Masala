import React, { useState, useEffect, useCallback } from 'react';
import { WordSearch } from './components/WordSearch';
import { WordList } from './components/WordList';
import { GameStats } from './components/GameStats';
import { FoundWordsDisplay } from './components/FoundWordsDisplay';
import { WordSearchGame } from './lib/wordSearchGame';
import { getGameWords, type WordListItem } from './lib/bollywoodWords';
import { useAudio } from './lib/stores/useAudio';
import { cn } from './lib/utils';
import '@fontsource/inter';

function App() {
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(() => game.getGameState());
  const [currentWords, setCurrentWords] = useState<WordListItem[]>([]);
  const { playHit, playSuccess, toggleMute, isMuted } = useAudio();

  // Initialize audio
  useEffect(() => {
    const hitAudio = new Audio('/sounds/hit.mp3');
    const successAudio = new Audio('/sounds/success.mp3');
    
    hitAudio.volume = 0.3;
    successAudio.volume = 0.5;
    
    // Set the audio in the store (if needed for other components)
    // This is optional since we're calling the functions directly
  }, []);

  // Start a new game
  const startNewGame = useCallback(() => {
    const words = getGameWords(8); // Get 8 random words for 9x9 grid
    const wordStrings = words.map(w => w.word);
    
    game.resetGame();
    game.generateGrid(wordStrings);
    setCurrentWords(words);
    setGameState(game.getGameState());
  }, [game]);

  // Initialize the first game
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle mouse/touch events
  const handleCellMouseDown = useCallback((row: number, col: number) => {
    game.startSelection(row, col);
    setGameState(game.getGameState());
  }, [game]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    game.updateSelection(row, col);
    setGameState(game.getGameState());
  }, [game]);

  const handleCellMouseUp = useCallback(() => {
    const wordFound = game.endSelection();
    const newGameState = game.getGameState();
    setGameState(newGameState);
    
    if (wordFound) {
      // Play success sound with slight delay for better feedback
      setTimeout(() => playSuccess(), 100);
      
      // Check if game is complete
      if (newGameState.isComplete) {
        setTimeout(() => {
          playSuccess();
        }, 800);
      }
    } else {
      // Play hit sound for failed selection
      setTimeout(() => playHit(), 50);
    }
  }, [game, playSuccess, playHit]);

  const handleCellTouchStart = useCallback((row: number, col: number) => {
    handleCellMouseDown(row, col);
  }, [handleCellMouseDown]);

  const handleCellTouchMove = useCallback((event: React.TouchEvent) => {
    // Touch move is handled in the WordSearch component
  }, []);

  const handleCellTouchEnd = useCallback(() => {
    handleCellMouseUp();
  }, [handleCellMouseUp]);

  const foundWords = game.getFoundWords();
  const remainingWords = game.getRemainingWords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎬 Bollywood Word Search
          </h1>
          <p className="text-gray-600">
            Find hidden words from the world of Indian cinema!
          </p>
        </div>

        {/* Found Words Display */}
        <FoundWordsDisplay 
          foundWords={foundWords}
          allWords={currentWords}
        />

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Word Search Grid */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <WordSearch
                grid={gameState.grid}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseEnter={handleCellMouseEnter}
                onCellMouseUp={handleCellMouseUp}
                onCellTouchStart={handleCellTouchStart}
                onCellTouchMove={handleCellTouchMove}
                onCellTouchEnd={handleCellTouchEnd}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <GameStats
              score={gameState.score}
              foundWordsCount={foundWords.length}
              totalWordsCount={currentWords.length}
              isComplete={gameState.isComplete}
              onNewGame={startNewGame}
              onToggleSound={toggleMute}
              isSoundMuted={isMuted}
            />

            {/* Word List */}
            <WordList
              words={currentWords}
              foundWords={foundWords}
              remainingWords={remainingWords}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Celebrating the magic of Indian cinema • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}

export default App;
