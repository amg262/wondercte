// ACE-v1 (Adaptive Cognitive Efficiency) scoring engine.
// Implements the formula and adaptive logic published on /algorithm exactly —
// see ctealgo.md for the original spec this was built from.

export const ACE_LAMBDA = 0.7; // decay factor
export const ACE_ALPHA = 0.05; // uncertainty penalty per answer toggle
export const ACE_MIN_DIFFICULTY = 1;
export const ACE_MAX_DIFFICULTY = 5;
export const ACE_START_DIFFICULTY = 3;
export const ACE_MIN_QUESTIONS = 10;
export const ACE_MAX_QUESTIONS = 20;

export interface PublicAdaptiveQuestion {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: number;
  options: string[];
}

export interface AdaptiveAnswerResult {
  isCorrect: boolean;
  pointsEarned: number;
  nextDifficulty: number;
  nextQuestion: PublicAdaptiveQuestion | null;
  isComplete: boolean;
  questionsAnswered: number;
  consecutiveAtCeiling: number;
  consecutiveAtFloor: number;
}

export function clampDifficulty(difficulty: number): number {
  return Math.min(ACE_MAX_DIFFICULTY, Math.max(ACE_MIN_DIFFICULTY, difficulty));
}

/**
 * S_i = A_i * D_i^1.5 * e^(-λ(T_i - T_target)/T_target) * max(0.5, 1 - α*C_i)
 * A skipped or incorrect answer scores 0 — accuracy is a gate, not the score.
 */
export function calculateQuestionScore(input: {
  isCorrect: boolean;
  difficulty: number;
  actualTimeMs: number;
  targetTimeMs: number;
  changeCount: number;
}): number {
  if (!input.isCorrect) return 0;

  const difficultyScaler = Math.pow(input.difficulty, 1.5);
  const timeDecay = Math.exp(
    (-ACE_LAMBDA * (input.actualTimeMs - input.targetTimeMs)) / input.targetTimeMs
  );
  const stabilityPenalty = Math.max(0.5, 1 - ACE_ALPHA * input.changeCount);

  return difficultyScaler * timeDecay * stabilityPenalty;
}

export type AdaptiveDirective = "incorrect" | "super_speed" | "in_flow" | "struggling" | "skipped";

/**
 * Determines the next question's difficulty from the Performance Ratio
 * P = T_i / T_target, not from the score itself.
 */
export function getNextDifficulty(input: {
  wasSkipped: boolean;
  isCorrect: boolean;
  actualTimeMs: number;
  targetTimeMs: number;
  currentDifficulty: number;
}): { nextDifficulty: number; directive: AdaptiveDirective } {
  if (input.wasSkipped) {
    return { nextDifficulty: input.currentDifficulty, directive: "skipped" };
  }

  if (!input.isCorrect) {
    return {
      nextDifficulty: clampDifficulty(input.currentDifficulty - 1),
      directive: "incorrect",
    };
  }

  const p = input.actualTimeMs / input.targetTimeMs;

  if (p < 0.5) {
    return {
      nextDifficulty: clampDifficulty(input.currentDifficulty + 2),
      directive: "super_speed",
    };
  }

  if (p <= 1.0) {
    return {
      nextDifficulty: clampDifficulty(input.currentDifficulty + 1),
      directive: "in_flow",
    };
  }

  return { nextDifficulty: input.currentDifficulty, directive: "struggling" };
}

/**
 * Elite Quotient: the sum of per-question scores normalized by the highest
 * difficulty reached, so climbing to harder questions is rewarded even with
 * fewer total questions answered.
 */
export function calculateEliteQuotient(scores: number[], maxDifficultyReached: number): number {
  if (scores.length === 0 || maxDifficultyReached <= 0) return 0;
  const total = scores.reduce((sum, s) => sum + s, 0);
  return total / maxDifficultyReached;
}
