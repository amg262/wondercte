"use server";

import { db, nflPlayers, type NflPlayer } from "@/lib/db";
import { eq, gte, lte, sql, and, asc, desc } from "drizzle-orm";

export interface NflComparison {
  exactMatch?: NflPlayer;
  closestMatch?: NflPlayer;
  higherScore?: NflPlayer;
  lowerScore?: NflPlayer;
}

/**
 * Get NFL player comparisons for a given Wonderlic score
 * Returns exact match (if exists), closest match within ±2 points, next higher, and next lower scores
 */
export async function getNflComparison(userScore: number): Promise<NflComparison> {
  try {
    // Try to find exact match
    const exactMatch = await db
      .select()
      .from(nflPlayers)
      .where(eq(nflPlayers.wonderlicScore, userScore))
      .limit(1);

    // Find closest match within ±2 points if no exact match
    let closestMatch = null;
    if (exactMatch.length === 0) {
      const closeMatches = await db
        .select()
        .from(nflPlayers)
        .where(
          and(
            gte(nflPlayers.wonderlicScore, userScore - 2),
            lte(nflPlayers.wonderlicScore, userScore + 2)
          )
        )
        .orderBy(sql`ABS(${nflPlayers.wonderlicScore} - ${userScore})`)
        .limit(1);

      closestMatch = closeMatches[0];
    }

    // Find next higher score
    const higherScoreResults = await db
      .select()
      .from(nflPlayers)
      .where(gte(nflPlayers.wonderlicScore, userScore + 1))
      .orderBy(asc(nflPlayers.wonderlicScore))
      .limit(1);

    // Find next lower score
    const lowerScoreResults = await db
      .select()
      .from(nflPlayers)
      .where(lte(nflPlayers.wonderlicScore, userScore - 1))
      .orderBy(desc(nflPlayers.wonderlicScore))
      .limit(1);

    return {
      exactMatch: exactMatch[0],
      closestMatch: closestMatch || undefined,
      higherScore: higherScoreResults[0],
      lowerScore: lowerScoreResults[0],
    };
  } catch (error) {
    console.error("Error fetching NFL comparison:", error);
    throw new Error("Failed to fetch NFL comparison");
  }
}

/**
 * Get a simple NFL player match for displaying in leaderboard badges
 * Returns the exact match or closest match only
 */
export async function getNflPlayerMatch(score: number): Promise<NflPlayer | null> {
  try {
    // Try exact match first
    const exactMatch = await db
      .select()
      .from(nflPlayers)
      .where(eq(nflPlayers.wonderlicScore, score))
      .limit(1);

    if (exactMatch.length > 0 && exactMatch[0]) {
      return exactMatch[0];
    }

    // Find closest match within ±2 points
    const closeMatches = await db
      .select()
      .from(nflPlayers)
      .where(
        and(
          gte(nflPlayers.wonderlicScore, score - 2),
          lte(nflPlayers.wonderlicScore, score + 2)
        )
      )
      .orderBy(sql`ABS(${nflPlayers.wonderlicScore} - ${score})`)
      .limit(1);

    return closeMatches[0] || null;
  } catch (error) {
    console.error("Error fetching NFL player match:", error);
    return null;
  }
}
