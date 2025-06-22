import React, { useState, useEffect, useCallback } from 'react';
import { WordSearch } from './components/WordSearch';
import { WordList } from './components/WordList';
import { GameStats } from './components/GameStats';
import { FoundWordsDisplay } from './components/FoundWordsDisplay';
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
    const words = getGameWords(8); // Get 8 words for 10x10 grid
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
      // Get the found word from the game state
      const foundWords = game.getFoundWords();
      const lastFoundWord = foundWords[foundWords.length - 1];
      
      if (lastFoundWord) {
        // Show animation for found word
        setWordFoundAnimation(lastFoundWord.word);
        setTimeout(() => setWordFoundAnimation(null), 2000);
      }
      
      // Play success sound
      playSuccess();
      
      // Check if game is complete
      if (newGameState.isComplete) {
        setTimeout(() => {
          playSuccess();
        }, 800);
      }
    } else {
      // Play hit sound for failed selection
      playHit();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-7xl relative">
        {/* Top Right Progress Panel */}
        <div className="fixed top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 border">
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{gameState.score}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{foundWords.length}/{currentWords.length}</div>
              <div className="text-xs text-muted-foreground">Found</div>
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
              className="h-7 w-7 p-0"
            >
              {isMuted ? (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎬 Movie Masala
          </h1>
          <p className="text-gray-600">
            Find hidden words from the world of Indian cinema!
          </p>
        </div>

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
                highlightedWord={highlightedWord}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Word List */}
            <WordList
              words={currentWords}
              foundWords={foundWords}
              remainingWords={remainingWords}
              allWordPlacements={gameState.words}
              onHighlightWord={handleHighlightWord}
            />

            {/* New Game Button */}
            <div className="flex justify-center">
              <Button 
                onClick={startNewGame}
                className="w-full max-w-md"
                variant={gameState.isComplete ? "default" : "outline"}
                size="lg"
              >
                {gameState.isComplete ? (
                  <>
                    🎉 Play Again
                  </>
                ) : (
                  <>
                    🔄 New Game
                  </>
                )}
              </Button>
            </div>

            {gameState.isComplete && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 max-w-md mx-auto">
                <div className="text-green-800 font-bold text-lg mb-2">
                  🎉 Congratulations!
                </div>
                <div className="text-green-700 text-sm">
                  You found all the Bollywood actors!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Found Words Display */}
        <FoundWordsDisplay 
          foundWords={foundWords}
          allWords={currentWords}
        />

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Celebrating the magic of Indian cinema • Made with love</p>
        </div>
      </div>

      {/* Word Found Animation */}
      <WordFoundAnimation word={wordFoundAnimation} />
    </div>
  );
}

export default App;
