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
      
      {/* Floating MM Logo - top left */}
      <button 
        onClick={startNewGame}
        className="absolute top-4 left-4 z-30 flex items-center space-x-1 hover:scale-105 transition-transform active:scale-95"
        title="Click to start new game"
      >
        <div className="w-10 h-10 bg-orange-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-orange-400 shadow-lg">
          <div className="text-white font-black text-lg">M</div>
        </div>
        <div className="w-10 h-10 bg-orange-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-orange-400 shadow-lg">
          <div className="text-white font-black text-lg">M</div>
        </div>
      </button>
      
      {/* Floating Score Pill - top right */}
      <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full px-4 py-2 text-sm font-bold shadow-lg">
        Score: {gameState.score}
      </div>

      {/* Floating Word Pills - compact layout */}
      <div className="absolute top-20 left-4 right-4 z-20 flex flex-wrap gap-2 justify-center max-h-24">
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
                "flex items-center px-1.5 py-0.5 rounded-full text-xs transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-lg mb-1",
                isFound 
                  ? "bg-green-500/90 text-white line-through" 
                  : "bg-white/90 text-gray-800 hover:bg-white active:bg-gray-100"
              )}
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              <span className="font-medium">{wordItem.word}</span>
            </div>
          );
        })}
      </div>

      {/* Selection Bubble - word in progress */}
      {currentSelection && (
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 z-30 bg-orange-500/95 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200">
          <span className="text-lg font-bold tracking-widest">
            {currentSelection.split('').join(' ')}
          </span>
        </div>
      )}

      {/* Hint Display - long press result */}
      {showHint && (
        <div className="absolute top-52 left-1/2 transform -translate-x-1/2 z-30 bg-blue-600/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 max-w-xs text-center">
          <span className="text-sm font-medium">{showHint}</span>
        </div>
      )}

      {/* Game Grid - positioned low for thumb accessibility */}
      <div className="absolute bottom-4 left-2 right-2 top-56 z-10">
        <div className="w-full h-full flex items-end justify-center">
          <div className="w-full max-w-md">
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