"use server";

import { db, testAttempts, users, groupMembers } from "@/lib/db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  bestScore: number;
  totalAttempts: number;
  avgScore: number;
  rank: number;
}

export async function getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const leaderboard = await db
      .select({
        userId: users.id,
        userName: users.name,
        avatarUrl: users.avatarUrl,
        bestScore: sql<number>`MAX(${testAttempts.score})`,
        totalAttempts: sql<number>`COUNT(${testAttempts.id})`,
        avgScore: sql<number>`ROUND(AVG(${testAttempts.score}))`,
      })
      .from(testAttempts)
      .innerJoin(users, eq(testAttempts.userId, users.id))
      .groupBy(users.id, users.name, users.avatarUrl)
      .orderBy(desc(sql`MAX(${testAttempts.score})`))
      .limit(limit);

    // Add ranks
    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  } catch (error) {
    console.error("Error fetching global leaderboard:", error);
    throw new Error("Failed to fetch leaderboard");
  }
}

export async function getGroupLeaderboard(groupId: string): Promise<LeaderboardEntry[]> {
  try {
    // Get members of the group
    const memberIds = await db
      .select({ userId: groupMembers.userId })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    if (memberIds.length === 0) {
      return [];
    }

    const userIds = memberIds.map((m) => m.userId);

    const leaderboard = await db
      .select({
        userId: users.id,
        userName: users.name,
        avatarUrl: users.avatarUrl,
        bestScore: sql<number>`MAX(${testAttempts.score})`,
        totalAttempts: sql<number>`COUNT(${testAttempts.id})`,
        avgScore: sql<number>`ROUND(AVG(${testAttempts.score}))`,
      })
      .from(testAttempts)
      .innerJoin(users, eq(testAttempts.userId, users.id))
      .where(sql`${testAttempts.userId} = ANY(${userIds}::uuid[])`)
      .groupBy(users.id, users.name, users.avatarUrl)
      .orderBy(desc(sql`MAX(${testAttempts.score})`));

    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  } catch (error) {
    console.error("Error fetching group leaderboard:", error);
    throw new Error("Failed to fetch group leaderboard");
  }
}

export async function getUserRank(userId: string): Promise<number> {
  try {
    const userBestScore = await db
      .select({ score: sql<number>`MAX(${testAttempts.score})` })
      .from(testAttempts)
      .where(eq(testAttempts.userId, userId))
      .limit(1);

    if (!userBestScore[0]?.score) {
      return 0;
    }

    const rank = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${testAttempts.userId})` })
      .from(testAttempts)
      .where(sql`${testAttempts.score} > ${userBestScore[0].score}`)
      .limit(1);

    return (rank[0]?.count ?? 0) + 1;
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return 0;
  }
}
