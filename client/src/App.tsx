import { useState, useCallback, useEffect } from 'react';
import { WordSearchGame } from './lib/wordSearchGame';
import { getGameWords } from './lib/bollywoodWords';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { WordFoundAnimation } from './components/WordFoundAnimation';

function App() {
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [currentWords, setCurrentWords] = useState(getGameWords(10));
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string>('');
  const [wordFoundAnimation, setWordFoundAnimation] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Audio setup
  const playSuccess = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available');
    }
  }, []);

  const playHit = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not available');
    }
  }, []);

  const startNewGame = useCallback(() => {
    const newWords = getGameWords(10);
    setCurrentWords(newWords);
    game.generateGrid(newWords.map(w => w.word));
    setGameState(game.getGameState());
    setHighlightedWord(null);
    setCurrentSelection('');
    setWordFoundAnimation(null);
    setShowHint(null);
  }, [game]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const selection = game.getCurrentSelectionWord();
    setCurrentSelection(selection);
  }, [game, gameState.selectedCells]);

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    game.startSelection(row, col);
    setGameState(game.getGameState());
    playHit();
  }, [game, playHit]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (gameState.isSelecting) {
      game.updateSelection(row, col);
      setGameState(game.getGameState());
    }
  }, [game, gameState.isSelecting]);

  const handleCellMouseUp = useCallback(() => {
    const wordFound = game.endSelection();
    setGameState(game.getGameState());
    
    if (wordFound) {
      setWordFoundAnimation(game.getCurrentSelectionWord());
      setTimeout(() => setWordFoundAnimation(null), 1500);
      playSuccess();
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
      }
    } else {
      playHit();
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [game, playSuccess, playHit]);

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

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Enhanced film-strip background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Header Bar - 10% viewport height */}
      <div className="fixed top-0 left-0 right-0 h-[10vh] bg-gradient-to-r from-red-900/95 to-red-800/95 z-30 flex items-center justify-between px-4 py-2 border-b-2 border-yellow-400/50 backdrop-blur-sm">
        {/* Left: Clapboard + Title */}
        <button 
          onClick={startNewGame}
          className="flex items-center gap-3 bollywood-gold-accent rounded-lg px-5 py-3 hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl"
          title="Click to start new game"
        >
          <span className="text-xl">🎬</span>
          <span className="bollywood-title text-lg font-bold">Movie Masala</span>
        </button>
        
        {/* Right: Score */}
        <div className="bollywood-gold-accent rounded-full px-5 py-2 text-sm font-bold shadow-xl">
          Score: {gameState.score}
        </div>
      </div>

      {/* Actor Strip - 44px tall, solid background */}
      <div className="fixed top-[10vh] left-0 right-0 h-[44px] bg-gradient-to-r from-red-900/90 to-red-800/90 z-20 border-b-2 border-yellow-400/40 backdrop-blur-sm">
        <div className="h-full overflow-x-auto scrollbar-hide px-2">
          <div className="flex items-center gap-3 h-full min-w-max px-2">
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
                    "bollywood-word-pill flex items-center px-3 py-1 rounded-[20px] text-xs font-semibold transition-all duration-300 cursor-pointer shadow-lg whitespace-nowrap uppercase tracking-wide",
                    isFound && "found"
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
        
        {/* Gold scroll indicator */}
        <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent rounded-full"></div>
      </div>

      {/* Selection Bubble - word in progress */}
      {currentSelection && (
        <div className="fixed top-[calc(10vh+50px)] left-1/2 transform -translate-x-1/2 z-30 bollywood-selection-bubble text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300">
          <span className="text-lg font-bold tracking-widest">
            {currentSelection.split('').join(' ')}
          </span>
        </div>
      )}

      {/* Hint Display - long press result */}
      {showHint && (
        <div className="fixed top-[calc(10vh+20px)] left-1/2 transform -translate-x-1/2 z-30 bollywood-hint-bubble text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 max-w-xs text-center">
          <span className="text-sm font-medium">{showHint}</span>
        </div>
      )}

      {/* Grid Container - 55% of viewport height */}
      <div className="fixed top-[calc(10vh+44px+8px)] left-0 right-0 h-[55vh] z-10 p-2">
        <div className="h-full flex items-center justify-center">
          <div className="relative">
            {/* Bollywood-themed grid container */}
            <div className="bollywood-grid-container p-4">
              <div className="grid grid-cols-12 gap-[6px] w-fit">
                {gameState.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center font-bold rounded-lg cursor-pointer transition-all duration-200 touch-target text-sm",
                        cell.isSelected 
                          ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-xl scale-110 z-10 border-2 border-yellow-300" 
                          : cell.isFound 
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border border-green-400" 
                          : "bg-gradient-to-br from-yellow-50 to-yellow-100 text-red-900 hover:from-yellow-100 hover:to-yellow-200 active:scale-95 shadow-md border border-yellow-300"
                      )}
                      style={{ 
                        fontFamily: "'Cinzel', serif",
                        textShadow: cell.isSelected || cell.isFound ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.2)'
                      }}
                      data-row={rowIndex}
                      data-col={colIndex}
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

      {/* Completion Message */}
      {gameState.isComplete && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-900 to-red-800 border-4 border-yellow-400 rounded-xl p-8 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-4xl mb-4">🎬✨</div>
            <h2 className="bollywood-title text-2xl font-bold mb-3">
              Blockbuster!
            </h2>
            <p className="text-yellow-100 mb-6 font-medium">
              You found all the Bollywood stars! The show must go on...
            </p>
            <Button 
              onClick={startNewGame} 
              className="bollywood-button w-full py-3 text-lg font-bold"
            >
              New Show
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