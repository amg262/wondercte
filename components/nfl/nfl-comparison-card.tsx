"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import type { NflComparison } from "@/lib/actions/nfl-comparison";

interface NflComparisonCardProps {
  userScore: number;
  comparison: NflComparison;
}

export function NflComparisonCard({ userScore, comparison }: NflComparisonCardProps) {
  const primaryPlayer = comparison.exactMatch || comparison.closestMatch;

  if (!primaryPlayer) {
    return null;
  }

  const isExactMatch = !!comparison.exactMatch;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          NFL Player Comparison
        </CardTitle>
        <CardDescription>
          See how your score compares to NFL players
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Match */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{primaryPlayer.name}</p>
              <p className="text-sm text-muted-foreground">
                {primaryPlayer.position} • {primaryPlayer.team}
                {primaryPlayer.draftYear && ` • ${primaryPlayer.draftYear}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{primaryPlayer.wonderlicScore}</p>
              <p className="text-xs text-muted-foreground">Wonderlic Score</p>
            </div>
          </div>
          <p className="mt-2 text-sm">
            {isExactMatch
              ? "You scored exactly like this NFL player!"
              : `Your score (${userScore}) is similar to this player's score.`}
          </p>
        </div>

        {/* Higher/Lower Context */}
        {(comparison.higherScore || comparison.lowerScore) && (
          <div className="grid grid-cols-2 gap-3">
            {comparison.higherScore && (
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  Next Goal
                </div>
                <p className="font-medium">{comparison.higherScore.name}</p>
                <p className="text-xs text-muted-foreground">{comparison.higherScore.position}</p>
                <p className="text-lg font-bold">{comparison.higherScore.wonderlicScore}</p>
              </div>
            )}

            {comparison.lowerScore && (
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingDown className="h-4 w-4" />
                  You Beat
                </div>
                <p className="font-medium">{comparison.lowerScore.name}</p>
                <p className="text-xs text-muted-foreground">{comparison.lowerScore.position}</p>
                <p className="text-lg font-bold">{comparison.lowerScore.wonderlicScore}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
