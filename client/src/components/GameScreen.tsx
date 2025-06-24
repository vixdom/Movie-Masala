import { useState, useCallback, useEffect } from 'react';
import { WordSearchGame } from '../lib/wordSearchGame';
import { getGameWords } from '../lib/bollywoodWords';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { WordFoundAnimation } from './WordFoundAnimation';
import { MobileOptimizedWordSearch } from './MobileOptimizedWordSearch';
import { ChevronLeft } from 'lucide-react';

interface GameScreenProps {
  onBackToHome: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export function GameScreen({ onBackToHome, isSoundMuted, onToggleSound }: GameScreenProps) {
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [currentWords, setCurrentWords] = useState(getGameWords(10));
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string>('');
  const [wordFoundAnimation, setWordFoundAnimation] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [hintedLetters, setHintedLetters] = useState<Set<string>>(new Set());
  const [hintedPositions, setHintedPositions] = useState<Set<string>>(new Set());

  // Audio setup
  const playSuccess = useCallback(() => {
    if (isSoundMuted) return;
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
  }, [isSoundMuted]);

  const playHit = useCallback(() => {
    if (isSoundMuted) return;
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
  }, [isSoundMuted]);

  const startNewGame = useCallback(() => {
    const newWords = getGameWords(10);
    setCurrentWords(newWords);
    game.generateGrid(newWords.map(w => w.word));
    setGameState(game.getGameState());
    setHighlightedWord(null);
    setCurrentSelection('');
    setWordFoundAnimation(null);
    setShowHint(null);
    setHintedLetters(new Set());
    setHintedPositions(new Set());
  }, [game]);

  const revealHintLetter = useCallback((wordPlacement: any) => {
    console.log('revealHintLetter called with:', wordPlacement);
    if (!wordPlacement || hintedLetters.has(wordPlacement.id)) {
      console.log('Early return: no placement or already hinted');
      return;
    }

    // Check if user has enough points for hint
    const currentGameState = game.getGameState();
    const pointDeduction = 15;
    
    if (currentGameState.score < pointDeduction) {
      console.log('Insufficient points for hint. Need:', pointDeduction, 'Have:', currentGameState.score);
      setShowHint(`Not enough points! Need ${pointDeduction} points for a hint.`);
      setTimeout(() => setShowHint(null), 2000);
      return;
    }

    console.log('Processing hint for word:', wordPlacement.word);
    console.log('Word positions:', wordPlacement.positions);
    console.log('Point deduction calculated:', pointDeduction);
    
    // Update game state to deduct points
    const oldScore = currentGameState.score;
    currentGameState.score = currentGameState.score - pointDeduction;
    console.log('Score updated from', oldScore, 'to', currentGameState.score);
    setGameState({...currentGameState});

    // Select a random letter position from the word
    const randomIndex = Math.floor(Math.random() * wordPlacement.positions.length);
    const randomPosition = wordPlacement.positions[randomIndex];
    console.log('Selected random position:', randomPosition, 'letter:', wordPlacement.word[randomIndex]);
    
    // Mark the word as hinted
    setHintedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(wordPlacement.id);
      console.log('Added to hinted letters:', wordPlacement.id);
      return newSet;
    });

    // Mark the specific position as hinted
    const positionKey = `${randomPosition.row}-${randomPosition.col}`;
    setHintedPositions(prev => {
      const newSet = new Set(prev);
      newSet.add(positionKey);
      console.log('Added to hinted positions:', positionKey);
      return newSet;
    });
    
    // Show hint message
    const hintMessage = `Letter "${wordPlacement.word[randomIndex]}" revealed at row ${randomPosition.row + 1}, column ${randomPosition.col + 1}. Points deducted: ${pointDeduction}`;
    console.log('Setting hint message:', hintMessage);
    setShowHint(hintMessage);
    setTimeout(() => setShowHint(null), 3000);
  }, [game, hintedLetters]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    playHit();
    game.startSelection(row, col);
    setGameState(game.getGameState());
    setCurrentSelection(game.getCurrentSelectionWord());
  }, [game, playHit]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (gameState.isSelecting) {
      game.updateSelection(row, col);
      setGameState(game.getGameState());
      setCurrentSelection(game.getCurrentSelectionWord());
    }
  }, [game, gameState.isSelecting]);

  const handleCellMouseUp = useCallback(() => {
    const foundWord = game.endSelection();
    if (foundWord) {
      playSuccess();
      setWordFoundAnimation('Word Found!');
      setTimeout(() => setWordFoundAnimation(null), 2000);
    }
    setGameState(game.getGameState());
    setCurrentSelection('');
  }, [game, playSuccess]);

  const handleCellTouchStart = useCallback((row: number, col: number) => {
    handleCellMouseDown(row, col);
  }, [handleCellMouseDown]);

  const handleCellTouchMove = useCallback((event: React.TouchEvent) => {
    if (!gameState.isSelecting) return;
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element?.hasAttribute('data-row') && element?.hasAttribute('data-col')) {
      const row = parseInt(element.getAttribute('data-row') || '0', 10);
      const col = parseInt(element.getAttribute('data-col') || '0', 10);
      handleCellMouseEnter(row, col);
    }
  }, [gameState.isSelecting, handleCellMouseEnter]);

  const handleCellTouchEnd = useCallback(() => {
    handleCellMouseUp();
  }, [handleCellMouseUp]);

  return (
    <div className="h-full text-white relative overflow-hidden flex flex-col">
      {/* Enhanced film-strip background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Header - Fixed size */}
      <header className="app-header flex-none">
        {/* Back Button */}
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="flex items-center gap-2 hover:bg-yellow-400/20 text-yellow-200 hover:text-white transition-all duration-300 min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Home</span>
        </Button>
        
        {/* Center: New Game Button */}
        <button 
          onClick={startNewGame}
          className="flex items-center gap-3 bollywood-gold-accent rounded-lg px-5 py-3 hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl min-h-[44px]"
          title="Click to start new game"
        >
          <span className="text-xl">🎬</span>
          <span className="bollywood-title text-lg font-bold">New Game</span>
        </button>
        
        {/* Right: Score */}
        <div className="bollywood-gold-accent rounded-full px-5 py-3 text-sm font-bold shadow-xl min-h-[44px] flex items-center justify-center">
          Score: {gameState.score}
        </div>
      </header>

      {/* Hint Strip - Fixed size */}
      <div className="hint-strip flex-none">
        <div className="hint-pills-container">
          {currentWords.map((wordItem) => {
            const wordPlacement = gameState.words.find(wp => wp.word === wordItem.word);
            const isFound = wordPlacement && gameState.foundWords.has(wordPlacement.id);
            
            const handleMouseDown = () => {
              console.log('Word pill mousedown:', wordItem.word, 'isFound:', isFound, 'wordPlacement:', wordPlacement);
              if (wordPlacement && !isFound && wordPlacement.id && !hintedLetters.has(wordPlacement.id)) {
                console.log('Setting 3-second timer for hint on:', wordItem.word);
                const timer = setTimeout(() => {
                  console.log('Timer fired, revealing hint for:', wordItem.word);
                  revealHintLetter(wordPlacement);
                }, 3000);
                setLongPressTimer(timer);
              } else {
                console.log('Hint blocked:', {
                  hasWordPlacement: !!wordPlacement,
                  isFound,
                  alreadyHinted: wordPlacement ? hintedLetters.has(wordPlacement.id) : false
                });
              }
            };

            const handleMouseUp = () => {
              console.log('Word pill mouseup, clearing timer');
              if (longPressTimer) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
              }
            };

            const handleTouchStart = () => {
              console.log('Word pill touchstart:', wordItem.word);
              handleMouseDown();
            };

            const handleTouchEnd = () => {
              console.log('Word pill touchend:', wordItem.word);
              handleMouseUp();
            };

            const handleClick = () => {
              console.log('Word pill clicked:', wordItem.word);
              if (wordPlacement && !isFound) {
                setHighlightedWord(wordPlacement.word);
                setTimeout(() => setHighlightedWord(null), 2000);
              }
            };
            
            return (
              <button
                key={wordItem.word}
                className={cn(
                  "hint-pill bollywood-word-pill transition-all duration-300 cursor-pointer shadow-lg whitespace-nowrap uppercase tracking-wide border-2 border-yellow-400 hover:bg-yellow-400/30 active:bg-yellow-400/50",
                  isFound && "found"
                )}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ 
                  minHeight: '48px',
                  minWidth: '48px',
                  zIndex: 50,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                <span className="text-center leading-tight pointer-events-none">{wordItem.word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Bubble - word in progress */}
      {currentSelection && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bollywood-selection-bubble text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300">
          <span className="text-lg font-bold tracking-widest">
            {currentSelection.split('').join(' ')}
          </span>
        </div>
      )}

      {/* Hint Display - long press result */}
      {showHint && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-30 bollywood-hint-bubble text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 max-w-xs text-center">
          <span className="text-sm font-medium">{showHint}</span>
        </div>
      )}

      {/* Grid Wrapper - Flexible container */}
      <div className="flex-1 flex justify-center items-end overflow-hidden px-4 pb-4" style={{outline: '2px dashed cyan'}}>
        <MobileOptimizedWordSearch
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

      {/* Word Found Animation */}
      <WordFoundAnimation word={wordFoundAnimation} />
    </div>
  );
}