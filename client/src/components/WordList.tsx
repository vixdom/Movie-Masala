import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WordListItem } from '@/lib/bollywoodWords';
import { WordPlacement } from '@/lib/wordSearchGame';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface WordListProps {
  words: WordListItem[];
  foundWords: WordPlacement[];
  remainingWords: WordPlacement[];
  allWordPlacements: WordPlacement[];
}

export function WordList({ words, foundWords, remainingWords, allWordPlacements }: WordListProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  
  const getCategoryColor = (category: WordListItem['category']) => {
    switch (category) {
      case 'movie': return 'bg-purple-100 text-purple-800';
      case 'actor': return 'bg-blue-100 text-blue-800';
      case 'actress': return 'bg-pink-100 text-pink-800';
      case 'director': return 'bg-green-100 text-green-800';
      case 'song': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: WordListItem['category']) => {
    switch (category) {
      case 'movie': return '🎬';
      case 'actor': return '🎭';
      case 'actress': return '👩‍🎭';
      case 'director': return '🎪';
      case 'song': return '🎵';
      default: return '📝';
    }
  };

  const foundWordsSet = new Set(foundWords.map(w => w.word));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="text-center flex-1">
            Bollywood Words
            <div className="text-sm font-normal text-muted-foreground mt-1">
              {foundWords.length} of {words.length} found
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
            className="h-8 w-8 p-0"
          >
            {showAnswers ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {words.map((wordItem, index) => {
            const isFound = foundWordsSet.has(wordItem.word);
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-2 rounded-lg border transition-all',
                  isFound 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(wordItem.category)}</span>
                  <div>
                    <div className={cn(
                      'font-medium',
                      isFound && 'line-through'
                    )}>
                      {wordItem.word}
                    </div>
                    {wordItem.hint && (
                      <div className="text-xs text-gray-500">
                        {wordItem.hint}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', getCategoryColor(wordItem.category))}
                  >
                    {wordItem.category}
                  </Badge>
                  {isFound && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Found
                    </span>
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
