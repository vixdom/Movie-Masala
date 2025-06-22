import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WordListItem } from '@/lib/bollywoodWords';
import { WordPlacement } from '@/lib/wordSearchGame';
import { cn } from '@/lib/utils';

interface FoundWordsDisplayProps {
  foundWords: WordPlacement[];
  allWords: WordListItem[];
}

export function FoundWordsDisplay({ foundWords, allWords }: FoundWordsDisplayProps) {
  const foundWordStrings = new Set(foundWords.map(w => w.word));
  
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

  if (foundWords.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Found Words</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {foundWords.length} found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {allWords
            .filter(wordItem => foundWordStrings.has(wordItem.word))
            .map((wordItem, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
            >
              <span className="text-sm">{getCategoryIcon(wordItem.category)}</span>
              <span className="font-medium text-green-800 line-through decoration-2">
                {wordItem.word}
              </span>
              <Badge 
                variant="outline" 
                className={cn('text-xs', getCategoryColor(wordItem.category))}
              >
                {wordItem.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}