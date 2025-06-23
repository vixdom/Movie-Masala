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
  const [showHint, setShowHint] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const { playHit, playSuccess, toggleMute, isMuted, initializeAudio } = useAudio();

  // Initialize audio
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Movie background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/api/placeholder/400/600)',
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Movie Masala Title with Clapboard */}
      <button 
        onClick={startNewGame}
        className="absolute top-4 left-4 z-30 bollywood-gold-accent rounded-lg px-4 py-2 hover:scale-105 transition-transform active:scale-95 shadow-lg"
        title="Click to start new game"
      >
        <span className="clapboard-icon bollywood-title text-lg">Movie Masala</span>
      </button>
      
      {/* Floating Score Pill - top right */}
      <div className="absolute top-4 right-4 z-30 bollywood-gold-accent rounded-full px-4 py-2 text-sm font-bold shadow-lg">
        Score: {gameState.score}
      </div>

      {/* Pinned Horizontal Actor List */}
      <div className="fixed top-16 left-0 right-0 z-20 bg-gradient-to-r from-red-900/95 via-red-800/95 to-red-900/95 backdrop-blur-sm border-b-2 border-yellow-400 safe-area-inset-top">
        <div className="overflow-x-auto py-3 px-4">
          <div className="flex gap-3 min-w-max">
            {currentWords.map((wordItem) => {
              const wordPlacement = gameState.words.find(wp => wp.word === wordItem.word);
              const isFound = wordPlacement && gameState.foundWords.has(wordPlacement.id);
              
              const handleMouseDown = () => {
                if (wordItem.hint && !isFound) {
                  const timer = setTimeout(() => {
                    setShowHint(wordItem.hint || null);
                    setTimeout(() => setShowHint(null), 2000);
                  }, 3000);
                  setLongPressTimer(timer);
                }
              };

              const handleMouseUp = () => {
                if (longPressTimer) {
                  clearTimeout(longPressTimer);
                  setLongPressTimer(null);
                }
              };

              const handleClick = () => {
                if (wordPlacement && !isFound) {
                  setHighlightedWord(wordPlacement.word);
                  setTimeout(() => setHighlightedWord(null), 2000);
                }
              };
              
              return (
                <div
                  key={wordItem.word}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer shadow-lg whitespace-nowrap min-h-[44px] min-w-[44px]",
                    isFound 
                      ? "bollywood-pill found line-through transform scale-95" 
                      : "bollywood-pill hover:scale-105 active:scale-95"
                  )}
                  onClick={handleClick}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                >
                  <span>{wordItem.word}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selection Bubble - word in progress */}
      {currentSelection && (
        <div className="fixed top-36 left-1/2 transform -translate-x-1/2 z-30 bollywood-selection-bubble text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300">
          <span className="text-lg font-bold tracking-widest">
            {currentSelection.split('').join(' ')}
          </span>
        </div>
      )}

      {/* Hint Display - long press result */}
      {showHint && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-30 bollywood-hint-bubble text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 max-w-xs text-center">
          <span className="text-sm font-medium">{showHint}</span>
        </div>
      )}

      {/* Main Content Area with Responsive Layout */}
      <div className="fixed inset-0 pt-28 pb-4 px-4 z-10 transition-all duration-500">
        {/* Mobile Portrait Layout */}
        <div className="h-full flex flex-col lg:hidden">
          {/* Spacer for actor list */}
          <div className="flex-shrink-0 h-4"></div>
          
          {/* Game Grid - Bottom Half for Thumb Access */}
          <div className="flex-1 flex items-end justify-center pb-4">
            <div className="w-full max-w-sm">
              <div className="bollywood-grid-container p-4 rounded-2xl">
                <div className="mobile-grid grid grid-cols-12 gap-2 aspect-square sm:gap-3 md:gap-4">
                  {gameState.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cn(
                          "aspect-square flex items-center justify-center font-bold rounded-lg cursor-pointer transition-all duration-200 touch-target",
                          "text-xs sm:text-sm md:text-base",
                          cell.isSelected 
                            ? "bg-orange-400 text-white shadow-lg scale-110 z-10" 
                            : cell.isFound 
                            ? "bg-green-500 text-white shadow-md" 
                            : "bg-yellow-100/90 text-red-900 hover:bg-yellow-200 active:scale-95 shadow-sm"
                        )}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                        onTouchStart={() => handleCellTouchStart(rowIndex, colIndex)}
                        onTouchMove={handleCellTouchMove}
                        onTouchEnd={handleCellTouchEnd}
                      >
                        {cell.letter}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet/Landscape Layout */}
        <div className="hidden lg:flex h-full gap-6">
          {/* Left Sidebar - Actor List */}
          <div className="w-80 flex-shrink-0">
            <div className="h-full bg-gradient-to-b from-red-900/95 to-red-800/95 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl p-6 overflow-y-auto">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Find These Actors</h2>
              <div className="space-y-3">
                {currentWords.map((wordItem) => {
                  const wordPlacement = gameState.words.find(wp => wp.word === wordItem.word);
                  const isFound = wordPlacement && gameState.foundWords.has(wordPlacement.id);
                  
                  return (
                    <div
                      key={wordItem.word}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 cursor-pointer shadow-lg min-h-[48px]",
                        isFound 
                          ? "bollywood-pill found line-through transform scale-95" 
                          : "bollywood-pill hover:scale-105 active:scale-95"
                      )}
                      onClick={() => {
                        if (wordPlacement && !isFound) {
                          setHighlightedWord(wordPlacement.word);
                          setTimeout(() => setHighlightedWord(null), 2000);
                        }
                      }}
                    >
                      <span>{wordItem.word}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Game Grid */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="bollywood-grid-container p-6 rounded-2xl">
                <div className="desktop-grid grid grid-cols-12 gap-4 aspect-square max-w-full">
                  {gameState.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cn(
                          "aspect-square flex items-center justify-center text-lg font-bold rounded-xl cursor-pointer transition-all duration-200 touch-target",
                          cell.isSelected 
                            ? "bg-orange-400 text-white shadow-xl scale-110 z-10" 
                            : cell.isFound 
                            ? "bg-green-500 text-white shadow-lg" 
                            : "bg-yellow-100/90 text-red-900 hover:bg-yellow-200 active:scale-95 shadow-md"
                        )}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                        onTouchStart={() => handleCellTouchStart(rowIndex, colIndex)}
                        onTouchMove={handleCellTouchMove}
                        onTouchEnd={handleCellTouchEnd}
                      >
                        {cell.letter}
                      </div>
                    ))
                  )}
                </div>
              </div>
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