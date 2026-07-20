"use server";

import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * Better Auth's `user` table (text id, OAuth identity) and the app's `users`
 * table (uuid id, FK target for test_attempts/groups/group_members) are
 * separate and unsynced. This bridges a Better Auth session user to its
 * corresponding `users.id`, creating the row on first sign-in.
 */
export async function getOrCreateAppUserId(authUser: {
  email: string;
  name: string;
  image?: string | null;
}): Promise<string> {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, authUser.email))
    .limit(1);

  if (existing[0]) {
    return existing[0].id;
  }

  const [created] = await db
    .insert(users)
    .values({
      email: authUser.email,
      name: authUser.name,
      avatarUrl: authUser.image ?? null,
    })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });

  if (created) {
    return created.id;
  }

  // Lost the race to a concurrent sign-in; the row now exists.
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, authUser.email))
    .limit(1);

  if (!row) {
    throw new Error("Failed to resolve app user after insert conflict");
  }

  return row.id;
}
