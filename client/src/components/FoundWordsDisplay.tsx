import React from 'react';
import { WordListItem } from '@/lib/bollywoodWords';
import { WordPlacement } from '@/lib/wordSearchGame';

interface FoundWordsDisplayProps {
  foundWords: WordPlacement[];
  allWords: WordListItem[];
}

export function FoundWordsDisplay({ foundWords, allWords }: FoundWordsDisplayProps) {
  const foundWordStrings = new Set(foundWords.map(w => w.word));
  
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
    <div className="w-full mb-4">
      {/* Movie Reel Header */}
      <div className="flex items-center justify-center mb-3">
        <div className="movie-reel-header">
          <span className="text-lg font-bold text-yellow-400">🎞️ DISCOVERED NAMES 🎞️</span>
          <div className="ml-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
            {foundWords.length} FOUND
          </div>
        </div>
      </div>

      {/* Film Strip Container */}
      <div className="film-strip-container">
        <div className="film-strip">
          {/* Left perforations */}
          <div className="film-perforations left">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="perforation"></div>
            ))}
          </div>

          {/* Film content area */}
          <div className="film-content">
            <div className="film-frames">
              {allWords
                .filter(wordItem => foundWordStrings.has(wordItem.word))
                .map((wordItem, index) => (
                <div key={index} className="film-frame">
                  <div className="frame-content">
                    <span className="category-icon">{getCategoryIcon(wordItem.category)}</span>
                    <span className="word-text">{wordItem.word}</span>
                    <span className="category-label">{wordItem.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right perforations */}
          <div className="film-perforations right">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="perforation"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}