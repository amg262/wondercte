"use client";

import * as React from "react";
import { useSSE, createSSEUrl } from "@/lib/sse/client";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import type { LeaderboardEntry } from "@/lib/actions/leaderboard";

interface LiveLeaderboardProps {
  initialData: LeaderboardEntry[];
  currentUserId?: string;
  groupId?: string;
}

export function LiveLeaderboard({ initialData, currentUserId, groupId }: LiveLeaderboardProps) {
  const url = createSSEUrl(
    "/api/sse/leaderboard",
    groupId ? { groupId } : undefined
  );

  const { data } = useSSE<LeaderboardEntry[]>(url);

  return (
    <LeaderboardTable
      entries={data || initialData}
      currentUserId={currentUserId}
    />
  );
}
