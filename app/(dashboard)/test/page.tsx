import { getRandomQuestions, submitTestAttempt } from "@/lib/actions/test";
import { getVisitor, setVisitorName } from "@/lib/actions/visitor";
import { startAdaptiveTest, submitAdaptiveAnswer, submitAdaptiveAttempt } from "@/lib/actions/adaptive";
import { TestInterface } from "@/components/test/test-interface";
import { AdaptiveTestInterface } from "@/components/test/adaptive-test-interface";
import { TestModeSelect } from "@/components/test/test-mode-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QUESTION_COUNT: Record<"short" | "full", number> = {
  short: 25,
  full: 50,
};

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const visitor = await getVisitor();

  const handleStart = async (name: string) => {
    "use server";
    const v = await setVisitorName(name);
    return v.id;
  };

  if (mode === "short" || mode === "full") {
    const rawQuestions = await getRandomQuestions(QUESTION_COUNT[mode]);
    // drizzle's jsonb columns deserialize to native values already
    const questions = rawQuestions.map((q) => ({
      ...q,
      options: q.options as string[],
    }));

    const handleSubmit = async (data: {
      userId: string;
      answers: Record<string, string>;
      timeTakenSeconds: number;
    }) => {
      "use server";
      return await submitTestAttempt({ ...data, mode });
    };

    return (
      <div className="container py-8">
        <TestInterface
          questions={questions}
          initialName={visitor?.name}
          onStart={handleStart}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  if (mode === "adaptive") {
    const start = await startAdaptiveTest();

    if (!start) {
      return (
        <div className="container py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Adaptive test unavailable</CardTitle>
              <CardDescription>The question bank couldn&apos;t be loaded. Try again in a moment.</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </div>
      );
    }

    return (
      <div className="container py-8">
        <AdaptiveTestInterface
          initialQuestion={start.question}
          initialDifficulty={start.difficulty}
          initialName={visitor?.name}
          onStart={handleStart}
          onSubmitAnswer={submitAdaptiveAnswer}
          onSubmitAttempt={submitAdaptiveAttempt}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <TestModeSelect />
    </div>
  );
}
