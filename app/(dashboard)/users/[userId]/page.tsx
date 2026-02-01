import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/actions/user-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Target, Brain, Clock, TrendingUp, Calendar, User as UserIcon, Medal, Activity } from "lucide-react";
import Link from "next/link";
import { NflComparisonCard } from "@/components/nfl/nfl-comparison-card";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { userId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === userId;

  // Calculate percentile (simplified)
  const getPercentile = (rank: number) => {
    // Assuming there are ~100+ users, calculate rough percentile
    if (rank === 1) return "Top 1%";
    if (rank <= 3) return "Top 3%";
    if (rank <= 10) return "Top 10%";
    if (rank <= 25) return "Top 25%";
    return `Rank #${rank}`;
  };

  // Calculate score distribution
  const scoreCategories = {
    excellent: userProfile.recentTests.filter(t => t.score >= 40).length,
    good: userProfile.recentTests.filter(t => t.score >= 30 && t.score < 40).length,
    average: userProfile.recentTests.filter(t => t.score >= 20 && t.score < 30).length,
    below: userProfile.recentTests.filter(t => t.score < 20).length,
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <UserIcon className="h-12 w-12 text-primary" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Joined {new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  {userProfile.stats.globalRank > 0 && (
                    <div className="flex items-center gap-1">
                      <Medal className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {getPercentile(userProfile.stats.globalRank)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Link href="/dashboard">
                  <Button variant="outline">
                    <Activity className="mr-2 h-4 w-4" />
                    My Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
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
                <span className="text-3xl font-bold">{userProfile.stats.bestScore}</span>
                <span className="text-sm text-muted-foreground">/50</span>
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
                <span className="text-3xl font-bold">#{userProfile.stats.globalRank || "-"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{userProfile.stats.avgScore}</span>
                <span className="text-sm text-muted-foreground">/50</span>
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
                <span className="text-3xl font-bold">{userProfile.stats.totalTests}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NFL Comparison */}
        {userProfile.nflComparison && userProfile.stats.bestScore > 0 && (
          <NflComparisonCard 
            userScore={userProfile.stats.bestScore} 
            comparison={userProfile.nflComparison} 
          />
        )}

        {/* Performance Distribution */}
        {userProfile.stats.totalTests > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>
                Score breakdown across {userProfile.stats.totalTests} {userProfile.stats.totalTests === 1 ? 'test' : 'tests'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/20">
                  <div className="text-sm text-muted-foreground mb-1">Excellent (40-50)</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {scoreCategories.excellent}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20">
                  <div className="text-sm text-muted-foreground mb-1">Good (30-39)</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {scoreCategories.good}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-yellow-500/10 border-yellow-500/20">
                  <div className="text-sm text-muted-foreground mb-1">Average (20-29)</div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {scoreCategories.average}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-red-500/10 border-red-500/20">
                  <div className="text-sm text-muted-foreground mb-1">Below Avg (&lt;20)</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {scoreCategories.below}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test History */}
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription>
              {userProfile.recentTests.length > 0 
                ? `Showing ${Math.min(20, userProfile.recentTests.length)} most recent tests`
                : "No tests completed yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProfile.recentTests.length > 0 ? (
              <div className="space-y-3">
                {userProfile.recentTests.map((test, index) => {
                  const correctAnswers = Array.isArray(test.questionsAnswered)
                    ? test.questionsAnswered.filter((q: any) => q.isCorrect).length
                    : 0;
                  const totalQuestions = Array.isArray(test.questionsAnswered)
                    ? test.questionsAnswered.length
                    : 0;
                  
                  const scoreColor = 
                    test.score >= 40 ? "text-green-600 dark:text-green-400 bg-green-500/10" :
                    test.score >= 30 ? "text-blue-600 dark:text-blue-400 bg-blue-500/10" :
                    test.score >= 20 ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10" :
                    "text-red-600 dark:text-red-400 bg-red-500/10";

                  return (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${scoreColor}`}>
                          {test.score}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              Test #{userProfile.recentTests.length - index}
                            </p>
                            {test.score === userProfile.stats.bestScore && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                Personal Best
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>
                              {correctAnswers}/{totalQuestions} correct
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {Math.floor(test.timeTakenSeconds / 60)}:
                              {(test.timeTakenSeconds % 60).toString().padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(test.completedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(test.completedAt).toLocaleTimeString('en-US', { 
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{isOwnProfile ? "You haven't" : `${userProfile.name} hasn't`} taken any tests yet</p>
                {isOwnProfile && (
                  <Link href="/test" className="inline-block mt-4">
                    <Button>Take Your First Test</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {!isOwnProfile && (
          <div className="flex justify-center gap-4">
            <Link href="/leaderboard">
              <Button variant="outline" size="lg">
                <Trophy className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
            </Link>
            {session && (
              <Link href="/test">
                <Button size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Challenge {userProfile.name.split(' ')[0]}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
