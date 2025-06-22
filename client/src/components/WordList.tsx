import React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Eye } from 'lucide-react';
import type { WordListItem } from '../lib/bollywoodWords';
import type { WordPlacement } from '../lib/wordSearchGame';

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
    <div className="px-4 py-3 max-h-40 overflow-y-auto">
      {/* Vertical word list using available space */}
      <div className="grid grid-cols-2 gap-2">
        {words.map((wordItem, index) => {
          const isFound = foundWordsSet.has(wordItem.word);
          
          return (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200',
                isFound 
                  ? 'bg-gray-200 text-gray-500 border-gray-300' 
                  : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              )}
            >
              <span
                className={cn(
                  'text-xs font-medium truncate',
                  isFound && 'line-through'
                )}
              >
                {wordItem.word}
              </span>
              <div className="flex items-center space-x-1 ml-2">
                {!isFound && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHighlightWord(wordItem.word)}
                    className="h-4 w-4 p-0 hover:bg-blue-100"
                  >
                    <Eye className="h-2 w-2 text-blue-600" />
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
    </div>
  );
}