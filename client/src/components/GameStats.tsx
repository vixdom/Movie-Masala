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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>Stats</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSound}
            className="h-7 w-7 p-0"
          >
            {isSoundMuted ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Score & Progress */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="flex-1 ml-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{foundWordsCount}/{totalWordsCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game Status */}
        {isComplete && (
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="text-green-800 font-bold text-sm mb-1">
              Congratulations!
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs">
              Complete
            </Badge>
          </div>
        )}

        {/* New Game Button */}
        <Button 
          onClick={onNewGame}
          className="w-full h-8"
          variant={isComplete ? "default" : "outline"}
          size="sm"
        >
          {isComplete ? (
            <>
              <Play className="mr-1 h-3 w-3" />
              Play Again
            </>
          ) : (
            <>
              <RotateCcw className="mr-1 h-3 w-3" />
              New Game
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
