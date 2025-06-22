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
    console.log('Available placements:', allWordPlacements.map(wp => wp.word));
    const placement = allWordPlacements.find(wp => wp.word === word);
    console.log('Found placement:', placement);
    if (placement) {
      onHighlightWord(placement);
    } else {
      console.log('No placement found for:', word);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg font-bold">Bollywood Actors</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-1 flex-1 overflow-y-auto pr-2">
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
