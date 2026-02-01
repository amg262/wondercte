import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRandomQuestions, submitTestAttempt } from "@/lib/actions/test";
import { TestInterface } from "@/components/test/test-interface";

export default async function TestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const rawQuestions = await getRandomQuestions(15);
  
  // Parse options from JSONB to string array
  const questions = rawQuestions.map((q) => ({
    ...q,
    options: JSON.parse(q.options as string) as string[],
  }));

  const handleSubmit = async (data: {
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }) => {
    "use server";
    return await submitTestAttempt({
      userId: session.user.id,
      ...data,
    });
  };

  return (
    <div className="container py-8">
      <TestInterface
        questions={questions}
        userId={session.user.id}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
