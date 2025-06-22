import React, { useState, useEffect, useCallback } from 'react';
import { WordSearch } from './components/WordSearch';
import { WordFoundAnimation } from './components/WordFoundAnimation';
import { Button } from './components/ui/button';
import { WordSearchGame } from './lib/wordSearchGame';
import { getGameWords, type WordListItem } from './lib/bollywoodWords';
import { useAudio } from './lib/stores/useAudio';
import { cn } from './lib/utils';
import { Eye } from 'lucide-react';
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

  const handleHighlightWord = useCallback((word: string) => {
    const placement = gameState.words.find(wp => wp.word === word);
    if (placement) {
      setHighlightedWord(placement.word);
      // Clear highlight after 1 second
      setTimeout(() => {
        setHighlightedWord(null);
      }, 1000);
    }
  }, [gameState.words]);

  const foundWords = game.getFoundWords();
  const remainingWords = game.getRemainingWords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Top Bar with Stats */}
      <div className="flex justify-between items-center p-4 bg-card/90 backdrop-blur-sm border-b border-border/50">
        {/* Left: New Game Button */}
        <Button 
          onClick={startNewGame}
          variant={gameState.isComplete ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          {gameState.isComplete ? "🎉 Play Again" : "🔄 New Game"}
        </Button>
        
        {/* Center: Title */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          🎬 Movie Masala
        </h1>
        
        {/* Right: Stats */}
        <div className="flex items-center space-x-4">
          <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-bold text-primary">
            {foundWords.length}/{currentWords.length}
          </div>
          <div className="bg-accent/20 rounded-full px-3 py-1 text-sm font-bold text-accent">
            {gameState.score}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleMute();
              if (isMuted) {
                setTimeout(() => playHit(), 200);
              }
            }}
            className="h-8 w-8 p-0 rounded-full"
          >
            {isMuted ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Horizontal Word List */}
      <div className="bg-primary/10 p-3 border-b border-border/50">
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {currentWords.map((wordItem, index) => {
            const isFound = foundWords.some(fw => fw.word === wordItem.word);
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-full border whitespace-nowrap transition-all duration-300 min-w-fit',
                  isFound 
                    ? 'bg-accent/30 text-accent-foreground border-accent/50 line-through' 
                    : 'bg-card/80 hover:bg-card border-border/50 hover:border-primary/30'
                )}
              >
                <span className="text-sm">🎭</span>
                <span className="text-sm font-medium">{wordItem.word}</span>
                {!isFound && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHighlightWord(wordItem.word)}
                    className="h-5 w-5 p-0 hover:bg-primary/20"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                {isFound && (
                  <span className="text-accent text-sm">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Game Grid - Takes remaining space */}
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
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 rounded-lg p-4 m-4 text-center">
          <div className="text-accent-foreground font-bold text-lg mb-2">
            🎉 Congratulations!
          </div>
          <div className="text-muted-foreground text-sm">
            You found all the Bollywood actors!
          </div>
        </div>
      )}

      {/* Word Found Animation */}
      <WordFoundAnimation word={wordFoundAnimation} />
    </div>
  );
}

export default App;