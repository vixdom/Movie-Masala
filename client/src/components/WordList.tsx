import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WordListItem } from '@/lib/bollywoodWords';
import { WordPlacement } from '@/lib/wordSearchGame';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface WordListProps {
  words: WordListItem[];
  foundWords: WordPlacement[];
  remainingWords: WordPlacement[];
  allWordPlacements: WordPlacement[];
  onHighlightWord: (wordPlacement: WordPlacement) => void;
}

export function WordList({ words, foundWords, remainingWords, allWordPlacements, onHighlightWord }: WordListProps) {
  
  const foundWordsSet = new Set(foundWords.map(w => w.word));
  
  const handleHighlightWord = (word: string) => {
    const placement = allWordPlacements.find(wp => wp.word === word);
    if (placement) {
      onHighlightWord(placement);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
      <CardHeader className="pb-3 flex-shrink-0 bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          🎭 Bollywood Actors
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-1 flex-1 overflow-y-auto pr-2">
          {words.map((wordItem, index) => {
            const isFound = foundWordsSet.has(wordItem.word);
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-2 rounded-lg transition-all duration-300',
                  isFound 
                    ? 'bg-accent/20 text-accent-foreground border border-accent/30 shadow-md' 
                    : 'hover:bg-primary/10 hover:border-primary/20 border border-transparent'
                )}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-sm">🎭</span>
                  <div className={cn(
                    'text-sm font-medium truncate',
                    isFound && 'line-through'
                  )}>
                    {wordItem.word}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {!isFound && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHighlightWord(wordItem.word)}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                  {isFound && (
                    <span className="text-xs text-green-600">✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
