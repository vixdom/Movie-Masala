import { useState, useCallback, useEffect } from 'react';
import { WordSearchGame } from '../lib/wordSearchGame';
import { getGameWords } from '../lib/bollywoodWords';
import { getWordsByTheme, getAllThemes, getRandomTheme, Theme } from '../lib/themedWords';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { WordFoundAnimation } from './WordFoundAnimation';
import { MobileOptimizedWordSearch } from './MobileOptimizedWordSearch';
import { FoundWordsDisplay } from './FoundWordsDisplay';
import { ChevronLeft } from 'lucide-react';

interface GameScreenProps {
  onBackToHome: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export function GameScreen({ onBackToHome, isSoundMuted, onToggleSound }: GameScreenProps) {
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [currentWords, setCurrentWords] = useState<any[]>([]);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string>('');
  const [wordFoundAnimation, setWordFoundAnimation] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [hintedLetters, setHintedLetters] = useState<Set<string>>(new Set());
  const [hintedPositions, setHintedPositions] = useState<Set<string>>(new Set());
  const [currentTheme, setCurrentTheme] = useState<Theme>(getRandomTheme());
  const [availableThemes] = useState<Theme[]>(getAllThemes());

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
    // Select a random theme for each new game
    const randomTheme = getRandomTheme();
    setCurrentTheme(randomTheme);
    
    // Get 20 themed words from the randomly selected theme (more than needed for replacement options)
    const themedWords = getWordsByTheme(randomTheme.id, 20);
    const wordStrings = themedWords.map(w => w.word);
    
    // Generate grid and get back the actual successfully placed words
    const successfullyPlacedWords = game.generateGrid(wordStrings);
    
    // Create word objects only for successfully placed words
    const placedWordObjects = themedWords.filter(tw => successfullyPlacedWords.includes(tw.word))
      .map(tw => ({
        word: tw.word,
        category: tw.category as 'actor' | 'actress' | 'director' | 'song',
        hint: tw.hint
      }));
    
    console.log(`🎯 GAME SETUP COMPLETE:`);
    console.log(`📝 Words requested: 10`);
    console.log(`✅ Words successfully placed: ${successfullyPlacedWords.length}`);
    console.log(`📋 Final word list:`, successfullyPlacedWords);
    
    setCurrentWords(placedWordObjects);
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
      // Mark as already attempted to prevent multiple attempts
      setHintedLetters(prev => {
        const newSet = new Set(prev);
        newSet.add(wordPlacement.id);
        return newSet;
      });
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

    // Mark the specific position as hinted (only when successful)
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
    const newGameState = game.getGameState();
    setGameState(newGameState);
    const selection = game.getCurrentSelectionWord();
    console.log('Selection started:', selection, 'isSelecting:', newGameState.isSelecting);
    setCurrentSelection(selection);
  }, [game, playHit]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    console.log('handleCellMouseEnter called:', row, col, 'isSelecting:', gameState.isSelecting);
    if (gameState.isSelecting) {
      game.updateSelection(row, col);
      setGameState(game.getGameState());
      const selection = game.getCurrentSelectionWord();
      console.log('Selection updated:', selection);
      setCurrentSelection(selection);
    } else {
      console.log('Not selecting, ignoring mouse enter');
    }
  }, [game, gameState.isSelecting]);

  const handleCellMouseUp = useCallback(() => {
    const foundWord = game.endSelection();
    if (foundWord) {
      playSuccess();
      setWordFoundAnimation('Word Found!');
      setTimeout(() => setWordFoundAnimation(null), 2000);
    } else {
      // Brief flash for wrong selection, then clear
      setTimeout(() => {
        setGameState(game.getGameState());
        setCurrentSelection('');
      }, 200);
      return;
    }
    setGameState(game.getGameState());
    setCurrentSelection('');
  }, [game, playSuccess]);

  const handleCellTouchStart = useCallback((row: number, col: number) => {
    // Trigger glassy sweep animation for touch start
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
    if (cellElement && !cellElement.querySelector('.touch-glassy-sweep')) {
      const sweepElement = document.createElement('div');
      sweepElement.className = 'touch-glassy-sweep';
      sweepElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(212, 175, 55, 0.4) 0%, rgba(244, 225, 122, 0.6) 50%, rgba(212, 175, 55, 0.4) 100%);
        backdrop-filter: blur(2px);
        border-radius: inherit;
        pointer-events: none;
        animation: glassySweepPulse 0.8s ease-out forwards;
        z-index: 10;
      `;
      
      cellElement.appendChild(sweepElement);
      
      // Remove after animation
      setTimeout(() => {
        if (sweepElement.parentNode) {
          sweepElement.parentNode.removeChild(sweepElement);
        }
      }, 800);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    }
    
    handleCellMouseDown(row, col);
  }, [handleCellMouseDown]);

  const handleCellTouchMove = useCallback((event: React.TouchEvent) => {
    console.log('Touch move event, isSelecting:', gameState.isSelecting);
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element?.hasAttribute('data-row') && element?.hasAttribute('data-col')) {
      const row = parseInt(element.getAttribute('data-row') || '0', 10);
      const col = parseInt(element.getAttribute('data-col') || '0', 10);
      console.log('Touch move detected on cell:', row, col);
      
      // Apply glassy sweep effect to dragged cells
      const cellElement = element as HTMLElement;
      if (cellElement && !cellElement.classList.contains('touch-glassy-active')) {
        console.log('Adding glassy effect to cell:', row, col);
        cellElement.classList.add('touch-glassy-active');
        
        // Remove the effect after a short duration
        setTimeout(() => {
          cellElement.classList.remove('touch-glassy-active');
        }, 600);
        
        // Gentle haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
      
      // Only update selection if we're actually selecting
      if (gameState.isSelecting) {
        handleCellMouseEnter(row, col);
      }
    }
  }, [gameState.isSelecting, handleCellMouseEnter]);



  const handleCellTouchEnd = useCallback(() => {
    handleCellMouseUp();
  }, [handleCellMouseUp]);

  return (
    <div className="h-full text-white relative overflow-hidden">
      {/* Header - Premium Cinema Style */}
      <header className="app-header">
        {/* Gold Clapperboard Icon & New Game Button */}
        <button 
          onClick={startNewGame}
          className="flex items-center gap-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E17A] text-[#0B1F3A] rounded-lg px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg min-h-[44px] relative overflow-hidden"
          title="Start New Game"
          style={{
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        >
          <span className="text-lg">🎬</span>
          <span className="font-bold uppercase tracking-wide">New Game</span>
        </button>

        {/* Current Theme Display & Score */}
        <div className="flex items-center gap-3">
          {/* Theme Name */}
          <div 
            className="bg-gradient-to-r from-[#4A0E4E] to-[#6A1B9A] border border-[#D4AF37] rounded-lg px-4 py-2 text-xs font-medium min-h-[44px] flex items-center justify-center text-white"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
              backdropFilter: 'blur(8px)'
            }}
            title={currentTheme.description}
          >
            <span className="text-center leading-tight">{currentTheme.name}</span>
          </div>
          
          {/* Score Indicator */}
          <div 
            className="bg-gradient-to-r from-[#0B1F3A] to-[#1A2B4A] border-2 border-[#D4AF37] rounded-full px-6 py-3 text-sm font-bold min-h-[44px] flex items-center justify-center text-white"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
              backdropFilter: 'blur(8px)'
            }}
          >
            Score: {gameState.score}
          </div>
        </div>
      </header>

      {/* Hint Strip - Fixed size */}
      <div className="hint-strip hints">
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

      {/* Hint Display - long press result */}
      {showHint && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-30 bollywood-hint-bubble text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 max-w-xs text-center">
          <span className="text-sm font-medium">{showHint}</span>
        </div>
      )}

      {/* Grid Wrapper - Bottom half container with permanent reserved space */}
      <div className="grid-wrapper relative">
        {/* Selection Bubble - fixed at top of screen */}
        {gameState.isSelecting && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl transition-all duration-300 whitespace-nowrap max-w-[90vw] min-w-fit rounded-xl px-8 py-4 border-2 border-yellow-400" style={{ zIndex: 9999 }}>
            <span className="text-lg font-bold tracking-widest block">
              {currentSelection || 'SELECTING...'}
            </span>
          </div>
        )}
        
        <MobileOptimizedWordSearch
          grid={gameState.grid}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
          highlightedWord={highlightedWord}
          foundWords={game.getFoundWords()}
        />
      </div>

      {/* Word Found Animation */}
      <WordFoundAnimation word={wordFoundAnimation} />
    </div>
  );
}