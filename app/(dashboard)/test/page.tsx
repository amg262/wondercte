import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRandomQuestions, submitTestAttempt } from "@/lib/actions/test";
import { getOrCreateAppUserId } from "@/lib/actions/user-sync";
import { TestInterface } from "@/components/test/test-interface";

export default async function TestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const appUserId = await getOrCreateAppUserId(session.user);
  const rawQuestions = await getRandomQuestions(15);

  // drizzle's jsonb columns deserialize to native values already
  const questions = rawQuestions.map((q) => ({
    ...q,
    options: q.options as string[],
  }));

  const handleSubmit = async (data: {
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }) => {
    "use server";
    return await submitTestAttempt({
      userId: appUserId,
      ...data,
    });
  };

  return (
    <div className="container py-8">
      <TestInterface
        questions={questions}
        userId={appUserId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
