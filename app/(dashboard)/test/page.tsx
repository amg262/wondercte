import { getRandomQuestions, submitTestAttempt } from "@/lib/actions/test";
import { getVisitor, setVisitorName } from "@/lib/actions/visitor";
import { TestInterface } from "@/components/test/test-interface";

export default async function TestPage() {
  const visitor = await getVisitor();
  const rawQuestions = await getRandomQuestions(15);

  // drizzle's jsonb columns deserialize to native values already
  const questions = rawQuestions.map((q) => ({
    ...q,
    options: q.options as string[],
  }));

  const handleStart = async (name: string) => {
    "use server";
    const v = await setVisitorName(name);
    return v.id;
  };

  const handleSubmit = async (data: {
    userId: string;
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }) => {
    "use server";
    return await submitTestAttempt(data);
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
