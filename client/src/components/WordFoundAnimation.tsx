import React from 'react';
import { cn } from '@/lib/utils';

interface WordFoundAnimationProps {
  word: string | null;
}

export function WordFoundAnimation({ word }: WordFoundAnimationProps) {
  if (!word) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className={cn(
        "bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl",
        "animate-bounce text-2xl font-bold",
        "border-4 border-green-300"
      )}>
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🎉</span>
          <span>Found {word}!</span>
          <span className="text-3xl">🎉</span>
        </div>
      </div>
    </div>
  );
}