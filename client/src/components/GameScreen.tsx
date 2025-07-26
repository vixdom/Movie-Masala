import { useState, useCallback, useEffect } from 'react';
import { WordSearchGame } from '../lib/wordSearchGame';
import { getGameWords } from '../lib/bollywoodWords';
import { getWordsByTheme, getAllThemes, getRandomTheme, Theme } from '../lib/themedWords';
import { useAudio } from '../lib/stores/useAudio';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

import { MobileOptimizedWordSearch } from './MobileOptimizedWordSearch';
import { FoundWordsDisplay } from './FoundWordsDisplay';
import { ResponsiveGameLayout } from './ResponsiveGameLayout';
import { ChevronLeft } from 'lucide-react';

interface GameScreenProps {
  onBackToHome: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export function GameScreen({ onBackToHome, isSoundMuted, onToggleSound }: GameScreenProps) {
  // Audio store
  const { playHit, playSuccess, playHintReveal, isMuted } = useAudio();
  
  const [game] = useState(() => new WordSearchGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [currentWords, setCurrentWords] = useState<any[]>([]);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string>('');

  const [showHint, setShowHint] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [hintedLetters, setHintedLetters] = useState<Set<string>>(new Set());
  const [hintedPositions, setHintedPositions] = useState<Set<string>>(new Set());
  const [currentTheme, setCurrentTheme] = useState<Theme>(getRandomTheme());
  const [availableThemes] = useState<Theme[]>(getAllThemes());

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
    
    // Play hint reveal sound
    playHintReveal();
    
    // Show hint message
    const hintMessage = `Letter "${wordPlacement.word[randomIndex]}" revealed at row ${randomPosition.row + 1}, column ${randomPosition.col + 1}. Points deducted: ${pointDeduction}`;
    console.log('Setting hint message:', hintMessage);
    setShowHint(hintMessage);
    setTimeout(() => setShowHint(null), 3000);
  }, [game, hintedLetters, playHintReveal]);

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

  return (
    <ResponsiveGameLayout className="h-full relative overflow-hidden">

      
      {/* Responsive Header */}
      <header className="app-header flex items-center justify-between gap-2 py-2 px-2">
        {/* Back Button (left) */}
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="flex items-center gap-2 transition-all duration-300 min-h-[var(--touch-target-min)] min-w-[var(--touch-target-min)]"
          style={{ color: 'var(--color-primary)' }}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {/* Theme Name (center) */}
        <div className="flex-1 flex justify-center">
          <div
            className="text-lg font-bold"
            style={{ color: 'var(--color-header-text)' }}
            title={currentTheme.description}
          >
            <span className="text-center leading-tight">{currentTheme.name}</span>
          </div>
        </div>

        {/* Score (right) */}
        <div
          className="rounded-full px-6 py-3 text-sm font-bold min-h-[var(--touch-target-min)] flex items-center justify-center"
          style={{
            backgroundColor: 'var(--color-button-bg)',
            color: 'var(--color-button-text)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)'
          }}
        >
          Score: {gameState.score}
        </div>
      </header>

      {/* Responsive Hint Strip */}
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
                  "hint-pill transition-all duration-300 cursor-pointer whitespace-nowrap uppercase tracking-wide rounded-md shadow-inner",
                  isFound && "found opacity-50 line-through"
                )}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                style={{ 
                  minHeight: 'var(--touch-target-min)',
                  minWidth: 'var(--touch-target-min)',
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

      {/* Hint Display */}
      {showHint && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-30 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 max-w-xs text-center"
          style={{ backgroundColor: 'var(--color-highlight)', color: 'var(--color-text)' }}>
          <span className="text-sm font-medium">{showHint}</span>
        </div>
      )}

      {/* Responsive Grid Wrapper */}
      <div className="grid-wrapper relative">
        {/* Selection Bubble */}
        {gameState.isSelecting && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 shadow-2xl transition-all duration-300 whitespace-nowrap max-w-[90vw] min-w-fit rounded-xl px-8 py-4 border-2" style={{ zIndex: 9999, backgroundColor: 'var(--color-highlight)', color: 'var(--color-text)', borderColor: 'var(--color-primary)' }}>
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


    </ResponsiveGameLayout>
  );
}