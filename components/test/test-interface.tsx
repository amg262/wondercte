"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ChevronRight } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: number;
  options: string[];
}

interface TestInterfaceProps {
  questions: Question[];
  userId: string;
  onSubmit: (data: { answers: Record<string, string>; timeTakenSeconds: number }) => Promise<any>;
}

export function TestInterface({ questions, userId, onSubmit }: TestInterfaceProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (!testStarted) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [testStarted]);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion!.id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        answers,
        timeTakenSeconds: timeElapsed,
      });
      router.push("/results");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnswered = currentQuestion && answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  if (!testStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ready to Test Your Cognitive Abilities?</CardTitle>
          <CardDescription>
            You'll have {questions.length} questions to complete. Take your time, but remember - speed matters too!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Test Format:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>{questions.length} questions total</li>
              <li>Multiple question types: Math, Logic, Verbal, and Spatial</li>
              <li>No time limit, but faster completion = bonus points</li>
              <li>You can navigate back to previous questions</li>
            </ul>
          </div>
          <Button onClick={() => setTestStarted(true)} size="lg" className="w-full">
            Start Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
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
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={answers[currentQuestion.id] === option ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-4"
              onClick={() => handleAnswer(option)}
            >
              <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          {answeredCount} / {questions.length} answered
        </span>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount < questions.length || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!isAnswered}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
