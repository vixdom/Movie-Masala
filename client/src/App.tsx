import React, { useState, useEffect, useCallback } from 'react';
import { WordSearch } from './components/WordSearch';
import { WordList } from './components/WordList';
import { WordFoundAnimation } from './components/WordFoundAnimation';
import { Button } from './components/ui/button';
import { WordSearchGame } from './lib/wordSearchGame';
import { getGameWords, type WordListItem } from './lib/bollywoodWords';
import { useAudio } from './lib/stores/useAudio';
import { cn } from './lib/utils';
import '@fontsource/inter';

function App() {
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(() => game.getGameState());
  const [currentWords, setCurrentWords] = useState<WordListItem[]>([]);
  const [wordFoundAnimation, setWordFoundAnimation] = useState<string | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
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
    setGameState({ ...game.getGameState() });
  }, [game]);

  const handleCellMouseUp = useCallback(() => {
    const wordFound = game.endSelection();
    const newGameState = game.getGameState();
    setGameState(newGameState);
    
    if (wordFound) {
      playSuccess();
      setWordFoundAnimation(game.getFoundWords().slice(-1)[0]?.word || null);
      setTimeout(() => setWordFoundAnimation(null), 2000);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex flex-col relative">
      {/* Floating MM Logo and Score */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-1">
          {/* Movie Reel M tiles */}
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 relative shadow-lg">
            <div className="text-white font-bold text-base">M</div>
            {/* Reel holes */}
            <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute bottom-1.5 left-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
          </div>
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 relative shadow-lg">
            <div className="text-white font-bold text-base">M</div>
            {/* Reel holes */}
            <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute bottom-1.5 left-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-orange-500 rounded-full"></div>
          </div>
        </div>
        
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
      <div className="flex-1 flex items-center justify-center p-4">
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

      {/* Word Found Animation */}
      <WordFoundAnimation word={wordFoundAnimation} />
    </div>
  );
}

export default App;