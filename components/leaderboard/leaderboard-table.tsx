import { Trophy, Medal, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { LeaderboardEntry } from "@/lib/actions/leaderboard";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-semibold">#{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                entry.userId === currentUserId
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>

                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {entry.avatarUrl ? (
                      <img
                        src={entry.avatarUrl}
                        alt={entry.userName}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{entry.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.totalAttempts} {entry.totalAttempts === 1 ? "test" : "tests"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Best</p>
                  <p className="text-2xl font-bold text-primary">{entry.bestScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Avg</p>
                  <p className="text-lg font-semibold">{entry.avgScore}</p>
                </div>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results yet. Be the first to take a test!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
