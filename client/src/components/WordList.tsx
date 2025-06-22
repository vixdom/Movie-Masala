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
    console.log('Eye clicked for word:', word);
    const placement = allWordPlacements.find(wp => wp.word === word);
    console.log('Found placement:', placement);
    if (placement) {
      onHighlightWord(placement);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Bollywood Actors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {words.map((wordItem, index) => {
            const isFound = foundWordsSet.has(wordItem.word);
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-2 rounded transition-all',
                  isFound 
                    ? 'bg-green-50 text-green-800' 
                    : 'hover:bg-gray-50'
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
