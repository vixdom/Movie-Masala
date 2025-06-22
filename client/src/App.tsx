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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header - mobile optimized */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
        <div className="flex gap-2">
          <button
            onClick={startNewGame}
            className="bg-orange-600 hover:bg-orange-700 text-white border-none font-bold px-4 py-3 rounded-lg text-xl"
          >
            M
          </button>
          <button
            onClick={startNewGame}
            className="bg-orange-600 hover:bg-orange-700 text-white border-none font-bold px-4 py-3 rounded-lg text-xl"
          >
            M
          </button>
        </div>
        
        <div className="text-white font-bold text-lg bg-white/20 rounded-full px-4 py-2">
          Score: {gameState.score}
        </div>
      </div>

      {/* Movie background with stronger overlay */}
      <div 
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/api/placeholder/400/600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/85"></div>
        
        {/* Mobile portrait content layout */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Word list - ultra-compact mobile layout */}
          <div className="bg-white/95 backdrop-blur-sm rounded-b-xl p-2 shadow-lg">
            <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto text-xs">
              {currentWords.map((wordItem) => {
                const wordPlacement = gameState.words.find(wp => wp.word === wordItem.word);
                const isFound = wordPlacement && gameState.foundWords.has(wordPlacement.id);
                
                return (
                  <div
                    key={wordItem.word}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 cursor-pointer",
                      isFound 
                        ? "bg-green-100 text-green-700 line-through" 
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300"
                    )}
                    onClick={() => {
                      if (wordPlacement && !isFound) {
                        setHighlightedWord(wordPlacement.word);
                        setTimeout(() => setHighlightedWord(null), 2000);
                      }
                    }}
                  >
                    <span className="font-medium truncate text-xs">{wordItem.word}</span>
                    {wordItem.hint && (
                      <button
                        className="text-blue-600 hover:text-blue-800 text-xs flex-shrink-0"
                        title={wordItem.hint}
                      >
                        👁️
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game grid - optimized for mobile portrait */}
          <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
            {/* Selection Bubble - word in progress */}
            {currentSelection && (
              <div className="absolute top-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg z-20 transition-all duration-200">
                <span className="text-lg font-bold tracking-widest">
                  {currentSelection.split('').join(' ')}
                </span>
              </div>
            )}
            
            <div className="w-full max-w-sm">
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
          </div>
        </div>
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

      {/* Word found animation */}
      {wordFoundAnimation && (
        <WordFoundAnimation word={wordFoundAnimation} />
      )}
    </div>
  );
}

export default App;