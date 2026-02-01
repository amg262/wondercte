"use server";

import { db, testQuestions, testAttempts, type NewTestAttempt } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRandomQuestions(count: number = 15) {
  try {
    const questions = await db
      .select()
      .from(testQuestions)
      .orderBy(sql`RANDOM()`)
      .limit(count);

    // Remove correct answer from returned data for security
    return questions.map(({ correctAnswer, ...question }) => question);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
}

export async function submitTestAttempt(data: {
  userId: string;
  answers: Record<string, string>;
  timeTakenSeconds: number;
}) {
  try {
    // Fetch all questions with correct answers
    const questionIds = Object.keys(data.answers);
    const questions = await db
      .select()
      .from(testQuestions)
      .where(
        sql`${testQuestions.id} = ANY(${questionIds}::uuid[])`
      );

    // Calculate score (Wonderlic scale: out of 50)
    let correctCount = 0;
    const questionsAnswered = questions.map((q) => {
      const userAnswer = data.answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    // Wonderlic scoring: typically 50 questions in 12 minutes
    // We're using 15 questions, so scale to 50-point system
    const score = Math.round((correctCount / questions.length) * 50);

    // Insert test attempt
    const [attempt] = await db
      .insert(testAttempts)
      .values({
        userId: data.userId,
        score,
        timeTakenSeconds: data.timeTakenSeconds,
        questionsAnswered,
      })
      .returning();

    // Revalidate leaderboard pages
    revalidatePath("/leaderboard");
    revalidatePath("/dashboard");

    return {
      success: true,
      attemptId: attempt.id,
      score,
      correctCount,
      totalQuestions: questions.length,
    };
  } catch (error) {
    console.error("Error submitting test attempt:", error);
    throw new Error("Failed to submit test attempt");
  }
}

export async function getUserTestHistory(userId: string) {
  try {
    const attempts = await db
      .select()
      .from(testAttempts)
      .where(eq(testAttempts.userId, userId))
      .orderBy(sql`${testAttempts.completedAt} DESC`)
      .limit(10);

    return attempts;
  } catch (error) {
    console.error("Error fetching test history:", error);
    throw new Error("Failed to fetch test history");
  }
}
