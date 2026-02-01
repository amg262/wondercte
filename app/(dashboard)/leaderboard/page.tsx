import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getGlobalLeaderboard } from "@/lib/actions/leaderboard";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

export default async function LeaderboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const leaderboard = await getGlobalLeaderboard(100);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Global Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank against other players worldwide
          </p>
        </div>

        <LeaderboardTable
          entries={leaderboard}
          currentUserId={session?.user?.id}
        />
      </div>
    </div>
  );
}
