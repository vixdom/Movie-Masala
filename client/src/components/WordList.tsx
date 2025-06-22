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
    <div className="mx-4 my-3">
      {/* Translucent Key Box */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30">
        {/* Grid layout with 3 columns for compact display */}
        <div className="grid grid-cols-3 gap-2">
          {words.map((wordItem, index) => {
            const isFound = foundWordsSet.has(wordItem.word);
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 rounded-md transition-all duration-200 text-center',
                  isFound 
                    ? 'bg-green-100/80 text-green-700' 
                    : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100/80'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium flex-1',
                    isFound && 'line-through'
                  )}
                  style={{ fontSize: '10px' }}
                >
                  {wordItem.word}
                </span>
                <div className="flex items-center ml-1">
                  {!isFound && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHighlightWord(wordItem.word)}
                      className="h-3 w-3 p-0 hover:bg-blue-200/80"
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
    </div>
  );
}