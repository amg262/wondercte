"use server";

import { db, users, testAttempts } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { getNflComparison } from "./nfl-comparison";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  stats: {
    bestScore: number;
    avgScore: number;
    totalTests: number;
    globalRank: number;
  };
  recentTests: Array<{
    id: string;
    score: number;
    timeTakenSeconds: number;
    completedAt: Date;
    questionsAnswered: any;
  }>;
  nflComparison?: Awaited<ReturnType<typeof getNflComparison>>;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Get user basic info
    const [userInfo] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userInfo) {
      return null;
    }

    // Get test history
    const testHistory = await db
      .select()
      .from(testAttempts)
      .where(eq(testAttempts.userId, userId))
      .orderBy(desc(testAttempts.completedAt))
      .limit(20);

    // Calculate stats
    const bestScore = testHistory.length > 0 
      ? Math.max(...testHistory.map((t) => t.score)) 
      : 0;
    
    const avgScore = testHistory.length > 0
      ? Math.round(testHistory.reduce((sum, t) => sum + t.score, 0) / testHistory.length)
      : 0;

    // Get global rank
    let globalRank = 0;
    if (bestScore > 0) {
      const rankResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${testAttempts.userId})` })
        .from(testAttempts)
        .where(sql`${testAttempts.score} > ${bestScore}`)
        .limit(1);
      
      globalRank = (rankResult[0]?.count ?? 0) + 1;
    }

    // Get NFL comparison
    const nflComparison = bestScore > 0 ? await getNflComparison(bestScore) : undefined;

    return {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      avatarUrl: userInfo.avatarUrl,
      createdAt: userInfo.createdAt,
      stats: {
        bestScore,
        avgScore,
        totalTests: testHistory.length,
        globalRank,
      },
      recentTests: testHistory,
      nflComparison,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUserStats(userId: string) {
  try {
    const testHistory = await db
      .select()
      .from(testAttempts)
      .where(eq(testAttempts.userId, userId))
      .orderBy(desc(testAttempts.completedAt));

    if (testHistory.length === 0) {
      return null;
    }

    const scores = testHistory.map(t => t.score);
    const bestScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Calculate improvement (comparing first half vs second half of tests)
    const halfPoint = Math.floor(testHistory.length / 2);
    const recentAvg = testHistory.length > 4
      ? Math.round(testHistory.slice(0, halfPoint).reduce((sum, t) => sum + t.score, 0) / halfPoint)
      : avgScore;
    const olderAvg = testHistory.length > 4
      ? Math.round(testHistory.slice(halfPoint).reduce((sum, t) => sum + t.score, 0) / (testHistory.length - halfPoint))
      : avgScore;
    
    const improvement = recentAvg - olderAvg;

    return {
      bestScore,
      avgScore,
      totalTests: testHistory.length,
      recentAvg,
      improvement,
      scores,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
}
