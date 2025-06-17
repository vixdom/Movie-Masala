import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Play, Volume2, VolumeX } from 'lucide-react';

interface GameStatsProps {
  score: number;
  foundWordsCount: number;
  totalWordsCount: number;
  isComplete: boolean;
  onNewGame: () => void;
  onToggleSound: () => void;
  isSoundMuted: boolean;
}

export function GameStats({
  score,
  foundWordsCount,
  totalWordsCount,
  isComplete,
  onNewGame,
  onToggleSound,
  isSoundMuted
}: GameStatsProps) {
  const progress = totalWordsCount > 0 ? (foundWordsCount / totalWordsCount) * 100 : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Game Stats</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSound}
            className="h-8 w-8 p-0"
          >
            {isSoundMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{score}</div>
          <div className="text-sm text-muted-foreground">Score</div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{foundWordsCount}/{totalWordsCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {progress.toFixed(0)}% Complete
          </div>
        </div>

        {/* Game Status */}
        {isComplete && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-green-800 font-bold text-lg mb-2">
              🎉 Congratulations!
            </div>
            <div className="text-green-700 text-sm">
              You found all the Bollywood words!
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              Game Complete
            </Badge>
          </div>
        )}

        {/* New Game Button */}
        <Button 
          onClick={onNewGame}
          className="w-full"
          variant={isComplete ? "default" : "outline"}
        >
          {isComplete ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              Play Again
            </>
          ) : (
            <>
              <RotateCcw className="mr-2 h-4 w-4" />
              New Game
            </>
          )}
        </Button>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>How to play:</strong></p>
          <p>• Click and drag to select words</p>
          <p>• Words can be horizontal, vertical, or diagonal</p>
          <p>• Find all Bollywood-themed words to win!</p>
        </div>
      </CardContent>
    </Card>
  );
}
