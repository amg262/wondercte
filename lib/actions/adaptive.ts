"use server";

import { db, testQuestions, testAttempts } from "@/lib/db";
import { eq, and, inArray, notInArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  ACE_START_DIFFICULTY,
  ACE_MIN_QUESTIONS,
  ACE_MAX_QUESTIONS,
  ACE_MAX_DIFFICULTY,
  ACE_MIN_DIFFICULTY,
  calculateQuestionScore,
  getNextDifficulty,
  calculateEliteQuotient,
  clampDifficulty,
  type PublicAdaptiveQuestion,
  type AdaptiveAnswerResult,
} from "./ace";

type QuestionRow = typeof testQuestions.$inferSelect;

function toPublicQuestion(q: QuestionRow): PublicAdaptiveQuestion {
  return {
    id: q.id,
    questionText: q.questionText,
    questionType: q.questionType,
    difficulty: q.difficulty,
    options: q.options as string[],
  };
}

// Search outward from the target difficulty so a played-out pool at one
// level doesn't dead-end the test; e.g. center=3 tries [3,4,2,5,1].
function difficultySearchOrder(center: number): number[] {
  const start = clampDifficulty(center);
  const order = [start];
  for (let offset = 1; offset <= ACE_MAX_DIFFICULTY; offset++) {
    const up = start + offset;
    const down = start - offset;
    if (up <= ACE_MAX_DIFFICULTY && !order.includes(up)) order.push(up);
    if (down >= ACE_MIN_DIFFICULTY && !order.includes(down)) order.push(down);
  }
  return order;
}

async function pickQuestionAtDifficulty(
  difficulty: number,
  excludeIds: string[]
): Promise<QuestionRow | null> {
  for (const d of difficultySearchOrder(difficulty)) {
    const conditions = [eq(testQuestions.difficulty, d)];
    if (excludeIds.length > 0) {
      conditions.push(notInArray(testQuestions.id, excludeIds));
    }

    const rows = await db
      .select()
      .from(testQuestions)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (rows[0]) return rows[0];
  }
  return null;
}

export async function startAdaptiveTest(): Promise<{
  question: PublicAdaptiveQuestion;
  difficulty: number;
} | null> {
  const question = await pickQuestionAtDifficulty(ACE_START_DIFFICULTY, []);
  if (!question) return null;
  return { question: toPublicQuestion(question), difficulty: ACE_START_DIFFICULTY };
}

/**
 * Validates and scores one adaptive question server-side, then serves the
 * next question at the newly-computed difficulty. Correctness and T_target
 * never reach the client — only the resulting points and next question do.
 */
export async function submitAdaptiveAnswer(input: {
  questionId: string;
  selectedAnswer: string | null; // null = skipped
  actualTimeMs: number;
  changeCount: number;
  currentDifficulty: number;
  seenQuestionIds: string[];
  questionsAnswered: number;
  consecutiveAtCeiling: number;
  consecutiveAtFloor: number;
}): Promise<AdaptiveAnswerResult> {
  const [question] = await db
    .select()
    .from(testQuestions)
    .where(eq(testQuestions.id, input.questionId))
    .limit(1);

  if (!question) {
    throw new Error("Question not found");
  }

  const wasSkipped = input.selectedAnswer === null;
  const isCorrect = !wasSkipped && input.selectedAnswer === question.correctAnswer;

  const pointsEarned = calculateQuestionScore({
    isCorrect,
    difficulty: question.difficulty,
    actualTimeMs: input.actualTimeMs,
    targetTimeMs: question.targetTimeMs,
    changeCount: input.changeCount,
  });

  const { nextDifficulty } = getNextDifficulty({
    wasSkipped,
    isCorrect,
    actualTimeMs: input.actualTimeMs,
    targetTimeMs: question.targetTimeMs,
    currentDifficulty: input.currentDifficulty,
  });

  const questionsAnswered = input.questionsAnswered + 1;

  let consecutiveAtCeiling = 0;
  let consecutiveAtFloor = 0;
  if (!wasSkipped) {
    if (isCorrect && input.currentDifficulty === ACE_MAX_DIFFICULTY) {
      consecutiveAtCeiling = input.consecutiveAtCeiling + 1;
    } else if (!isCorrect && input.currentDifficulty === ACE_MIN_DIFFICULTY) {
      consecutiveAtFloor = input.consecutiveAtFloor + 1;
    }
  }

  const pastMinimum = questionsAnswered >= ACE_MIN_QUESTIONS;
  const hitHardCap = questionsAnswered >= ACE_MAX_QUESTIONS;
  const reachedMastery = pastMinimum && consecutiveAtCeiling >= 3;
  const bottomedOut = pastMinimum && consecutiveAtFloor >= 3;
  let isComplete = hitHardCap || reachedMastery || bottomedOut;

  let nextQuestion: PublicAdaptiveQuestion | null = null;
  if (!isComplete) {
    const seen = [...input.seenQuestionIds, input.questionId];
    const picked = await pickQuestionAtDifficulty(nextDifficulty, seen);
    if (picked) {
      nextQuestion = toPublicQuestion(picked);
    } else {
      isComplete = true; // question bank exhausted
    }
  }

  return {
    isCorrect,
    pointsEarned,
    nextDifficulty,
    nextQuestion,
    isComplete,
    questionsAnswered,
    consecutiveAtCeiling,
    consecutiveAtFloor,
  };
}

/**
 * Final, authoritative scoring pass. Re-validates every response from
 * scratch server-side (never trusts a client-accumulated running score) and
 * persists the attempt.
 */
export async function submitAdaptiveAttempt(data: {
  userId: string;
  responses: Array<{
    questionId: string;
    selectedAnswer: string | null;
    actualTimeMs: number;
    changeCount: number;
  }>;
  totalTimeSeconds: number;
}) {
  try {
    const questionIds = data.responses.map((r) => r.questionId);
    const questions = await db
      .select()
      .from(testQuestions)
      .where(inArray(testQuestions.id, questionIds));
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let maxDifficultyReached = 0;
    const scores: number[] = [];
    const breakdown = data.responses.map((r) => {
      const question = questionMap.get(r.questionId);
      if (!question) {
        throw new Error(`Question ${r.questionId} not found`);
      }

      const wasSkipped = r.selectedAnswer === null;
      const isCorrect = !wasSkipped && r.selectedAnswer === question.correctAnswer;
      const pointsEarned = calculateQuestionScore({
        isCorrect,
        difficulty: question.difficulty,
        actualTimeMs: r.actualTimeMs,
        targetTimeMs: question.targetTimeMs,
        changeCount: r.changeCount,
      });

      maxDifficultyReached = Math.max(maxDifficultyReached, question.difficulty);
      scores.push(pointsEarned);

      return {
        questionId: r.questionId,
        questionText: question.questionText,
        selectedAnswer: r.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        skipped: wasSkipped,
        difficulty: question.difficulty,
        actualTimeMs: r.actualTimeMs,
        changeCount: r.changeCount,
        pointsEarned,
      };
    });

    const eliteQuotient = calculateEliteQuotient(scores, maxDifficultyReached);
    const score = Math.max(0, Math.min(50, Math.round(eliteQuotient)));

    const [attempt] = await db
      .insert(testAttempts)
      .values({
        userId: data.userId,
        score,
        timeTakenSeconds: data.totalTimeSeconds,
        questionsAnswered: breakdown,
        mode: "adaptive",
        eliteQuotient,
        maxDifficultyReached,
      })
      .returning();

    if (!attempt) {
      throw new Error("Failed to insert adaptive attempt");
    }

    revalidatePath("/leaderboard");
    revalidatePath("/dashboard");

    return {
      success: true as const,
      attemptId: attempt.id,
      score,
      eliteQuotient,
      maxDifficultyReached,
      questionsAnswered: breakdown.length,
    };
  } catch (error) {
    console.error("Error submitting adaptive attempt:", error);
    throw new Error("Failed to submit adaptive attempt");
  }
}
