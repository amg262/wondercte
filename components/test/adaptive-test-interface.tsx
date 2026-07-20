"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ChevronsUp } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { ACE_MAX_DIFFICULTY, ACE_MIN_QUESTIONS, ACE_MAX_QUESTIONS } from "@/lib/actions/ace";
import type { PublicAdaptiveQuestion, AdaptiveAnswerResult } from "@/lib/actions/ace";

interface ResponseRecord {
  questionId: string;
  selectedAnswer: string | null;
  actualTimeMs: number;
  changeCount: number;
}

interface SubmitAnswerInput {
  questionId: string;
  selectedAnswer: string | null;
  actualTimeMs: number;
  changeCount: number;
  currentDifficulty: number;
  seenQuestionIds: string[];
  questionsAnswered: number;
  consecutiveAtCeiling: number;
  consecutiveAtFloor: number;
}

interface SubmitAttemptResult {
  success: true;
  attemptId: string;
  score: number;
  eliteQuotient: number;
  maxDifficultyReached: number;
  questionsAnswered: number;
}

interface AdaptiveTestInterfaceProps {
  initialQuestion: PublicAdaptiveQuestion;
  initialDifficulty: number;
  initialName?: string;
  onStart: (name: string) => Promise<string>;
  onSubmitAnswer: (input: SubmitAnswerInput) => Promise<AdaptiveAnswerResult>;
  onSubmitAttempt: (data: {
    userId: string;
    responses: ResponseRecord[];
    totalTimeSeconds: number;
  }) => Promise<SubmitAttemptResult>;
}

type Feedback = { isCorrect: boolean; skipped: boolean; pointsEarned: number };

export function AdaptiveTestInterface({
  initialQuestion,
  initialDifficulty,
  initialName,
  onStart,
  onSubmitAnswer,
  onSubmitAttempt,
}: AdaptiveTestInterfaceProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [userId, setUserId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const [testStarted, setTestStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<PublicAdaptiveQuestion>(initialQuestion);
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [consecutiveAtCeiling, setConsecutiveAtCeiling] = useState(0);
  const [consecutiveAtFloor, setConsecutiveAtFloor] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const responsesRef = useRef<ResponseRecord[]>([]);
  const seenQuestionIdsRef = useRef<string[]>([]);
  const questionStartRef = useRef<number>(0);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!testStarted || isFinishing) return;
    const interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [testStarted, isFinishing]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const handleStart = async () => {
    if (!name.trim()) {
      setStartError("Even elite candidates need a name.");
      return;
    }
    setIsStarting(true);
    setStartError("");
    try {
      const id = await onStart(name.trim());
      setUserId(id);
      setTestStarted(true);
      questionStartRef.current = Date.now();
    } catch (error) {
      console.error("Error starting adaptive test:", error);
      setStartError("Couldn't get you set up. Try again?");
    } finally {
      setIsStarting(false);
    }
  };

  const finishTest = async (finalUserId: string) => {
    setIsFinishing(true);
    try {
      const result = await onSubmitAttempt({
        userId: finalUserId,
        responses: responsesRef.current,
        totalTimeSeconds: timeElapsed,
      });
      router.push(`/results/${result.attemptId}`);
    } catch (error) {
      console.error("Error submitting adaptive attempt:", error);
      alert("Failed to submit your test. Please try again.");
      setIsFinishing(false);
    }
  };

  const lockInAnswer = async (answer: string | null) => {
    if (isProcessing || isFinishing || !userId) return;
    setIsProcessing(true);

    const actualTimeMs = Date.now() - questionStartRef.current;

    try {
      const result = await onSubmitAnswer({
        questionId: currentQuestion.id,
        selectedAnswer: answer,
        actualTimeMs,
        changeCount,
        currentDifficulty,
        seenQuestionIds: seenQuestionIdsRef.current,
        questionsAnswered,
        consecutiveAtCeiling,
        consecutiveAtFloor,
      });

      responsesRef.current = [
        ...responsesRef.current,
        { questionId: currentQuestion.id, selectedAnswer: answer, actualTimeMs, changeCount },
      ];
      seenQuestionIdsRef.current = [...seenQuestionIdsRef.current, currentQuestion.id];

      setFeedback({ isCorrect: result.isCorrect, skipped: answer === null, pointsEarned: result.pointsEarned });

      setTimeout(async () => {
        setFeedback(null);
        setQuestionsAnswered(result.questionsAnswered);
        setConsecutiveAtCeiling(result.consecutiveAtCeiling);
        setConsecutiveAtFloor(result.consecutiveAtFloor);

        if (result.isComplete || !result.nextQuestion) {
          await finishTest(userId);
          return;
        }
        setCurrentQuestion(result.nextQuestion);
        setCurrentDifficulty(result.nextDifficulty);
        setSelectedAnswer(null);
        setChangeCount(0);
        questionStartRef.current = Date.now();
        setIsProcessing(false);
      }, 700);
    } catch (error) {
      console.error("Error submitting adaptive answer:", error);
      alert("Something went wrong scoring that question. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSelect = (option: string) => {
    if (isProcessing) return;
    if (selectedAnswer !== null && selectedAnswer !== option) {
      setChangeCount((prev) => prev + 1);
    }
    setSelectedAnswer(option);

    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = setTimeout(() => {
      lockInAnswer(option);
    }, 350);
  };

  const handleSkip = () => {
    if (isProcessing) return;
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    lockInAnswer(null);
  };

  if (!testStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ready to Find Your Ceiling?</CardTitle>
          <CardDescription>
            The Adaptive (ACE) test adjusts difficulty in real time based on your speed and accuracy.
            Answer {ACE_MIN_QUESTIONS}-{ACE_MAX_QUESTIONS} questions — accuracy gets you points, but
            efficiency decides how many.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">How it works:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Answer correctly and quickly to jump to harder questions</li>
              <li>Answer correctly but slowly and difficulty holds steady</li>
              <li>Answer incorrectly and difficulty backs off</li>
              <li>Skipping costs no difficulty, but earns no points</li>
              <li>Changing your answer before it locks in costs a small penalty</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="adaptive-visitor-name" className="text-sm font-medium">
              What should we put on the leaderboard?
            </label>
            <Input
              id="adaptive-visitor-name"
              placeholder="e.g. Definitely Not Concussed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              maxLength={100}
            />
            {startError && <p className="text-sm text-destructive">{startError}</p>}
            <p className="text-xs text-muted-foreground">
              No account needed — we&apos;ll remember you on this device.
            </p>
          </div>

          <Button onClick={handleStart} size="lg" className="w-full" disabled={isStarting}>
            {isStarting ? "Getting ready..." : "Start Adaptive Test"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {questionsAnswered + 1}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: ACE_MAX_DIFFICULTY }, (_, i) => i + 1).map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full ${
                level <= currentDifficulty ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Difficulty {currentDifficulty} of {ACE_MAX_DIFFICULTY}</p>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
            <span className="text-xs px-2 py-1 bg-secondary rounded-full">
              {currentQuestion.questionType}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedback ? (
            <div
              className={`rounded-lg p-6 text-center font-semibold ${
                feedback.skipped
                  ? "bg-muted text-muted-foreground"
                  : feedback.isCorrect
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {feedback.skipped
                ? "Skipped"
                : feedback.isCorrect
                ? `Correct! +${feedback.pointsEarned.toFixed(1)} pts`
                : "Incorrect"}
            </div>
          ) : (
            currentQuestion.options.map((option, index) => (
              <Button
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleSelect(option)}
                disabled={isProcessing}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      {!feedback && (
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handleSkip} disabled={isProcessing}>
            Skip
          </Button>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <ChevronsUp className="h-4 w-4" />
            {isFinishing ? "Wrapping up..." : "Auto-advances after you pick"}
          </span>
        </div>
      )}
    </div>
  );
}
