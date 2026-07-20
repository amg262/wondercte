import { notFound } from "next/navigation";
import Link from "next/link";
import { getTestAttempt } from "@/lib/actions/test";
import { getNflComparison } from "@/lib/actions/nfl-comparison";
import { getUserRank } from "@/lib/actions/leaderboard";
import { NflComparisonCard } from "@/components/nfl/nfl-comparison-card";
import { ShareButtons } from "@/components/social/share-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Brain, Clock } from "lucide-react";

function verdictFor(score: number): string {
  if (score >= 40) return "Exceptional. Suspiciously exceptional.";
  if (score >= 30) return "Above average. Your friends should be worried.";
  if (score >= 20) return "Solidly average. The Wonderlic median lives here.";
  return "Below average. Someone's gotta hold up the leaderboard.";
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const attempt = await getTestAttempt(attemptId);

  if (!attempt) {
    notFound();
  }

  const [comparison, rank] = await Promise.all([
    getNflComparison(attempt.score),
    getUserRank(attempt.userId),
  ]);

  const verdict = verdictFor(attempt.score);

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">{attempt.userName}&apos;s Results</CardTitle>
            <CardDescription>{verdict}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">
              {attempt.score}
              <span className="text-2xl text-muted-foreground">/50</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Rank #{rank || "-"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.floor(attempt.timeTakenSeconds / 60)}:
                {(attempt.timeTakenSeconds % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </CardContent>
        </Card>

        <ShareButtons
          title="I just took the WonderCTE cognitive test"
          text={`I scored ${attempt.score}/50 on WonderCTE. Think you can beat me? Someone's gotta be at the bottom...`}
        />

        <NflComparisonCard userScore={attempt.score} comparison={comparison} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/test" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              <Brain className="mr-2 h-5 w-5" />
              Take Again
            </Button>
          </Link>
          <Link href="/leaderboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
