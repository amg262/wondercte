import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserTestHistory } from "@/lib/actions/test";
import { getUserRank } from "@/lib/actions/leaderboard";
import { getNflComparison } from "@/lib/actions/nfl-comparison";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, TrendingUp, Clock, Brain } from "lucide-react";
import Link from "next/link";
import { NflComparisonCard } from "@/components/nfl/nfl-comparison-card";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const testHistory = await getUserTestHistory(session.user.id);
  const bestScore = testHistory.length > 0 ? Math.max(...testHistory.map((t) => t.score)) : 0;

  const [userRank, nflComparison] = await Promise.all([
    getUserRank(session.user.id),
    bestScore > 0 ? getNflComparison(bestScore) : null,
  ]);

  const avgScore =
    testHistory.length > 0
      ? Math.round(testHistory.reduce((sum, t) => sum + t.score, 0) / testHistory.length)
      : 0;
  const totalTests = testHistory.length;

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
          <p className="text-muted-foreground">Track your progress and challenge yourself</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Best Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{bestScore}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Global Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">#{userRank || "-"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{avgScore}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{totalTests}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Take a New Test</CardTitle>
              <CardDescription>Challenge yourself with a new cognitive test</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test">
                <Button size="lg" className="w-full">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Test
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Leaderboards</CardTitle>
              <CardDescription>See how you rank against others</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/leaderboard">
                <Button size="lg" variant="outline" className="w-full">
                  <Trophy className="mr-2 h-5 w-5" />
                  Leaderboards
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* NFL Player Comparison */}
        {nflComparison && (
          <NflComparisonCard userScore={bestScore} comparison={nflComparison} />
        )}

        {/* Recent Tests */}
        {testHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
              <CardDescription>Your last {Math.min(5, testHistory.length)} attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testHistory.slice(0, 5).map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{test.score}</span>
                      </div>
                  <div>
                    <p className="font-medium">Score: {test.score}/50</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {Math.floor(test.timeTakenSeconds / 60)}:
                      {(test.timeTakenSeconds % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {testHistory.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No tests yet</h3>
              <p className="text-muted-foreground mb-4">
                Take your first test to start tracking your progress!
              </p>
              <Link href="/test">
                <Button>Take First Test</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
