"use server";

import { cookies } from "next/headers";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "wondercte_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface Visitor {
  id: string;
  name: string;
}

/**
 * Read-only lookup of the current visitor from their device cookie.
 * No login required — this is the app-wide identity for anonymous play.
 */
export async function getVisitor(): Promise<Visitor | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  if (!id) return null;

  const [row] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return row ?? null;
}

/**
 * Creates (or renames) the visitor identity and persists it via cookie.
 * Must be called from a Server Action / Route Handler — cookies() can only
 * be mutated there, not during Server Component render.
 */
export async function setVisitorName(name: string): Promise<Visitor> {
  const trimmed = name.trim().slice(0, 100);
  if (!trimmed) {
    throw new Error("Name is required");
  }

  const cookieStore = await cookies();
  const existingId = cookieStore.get(COOKIE_NAME)?.value;

  if (existingId) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, existingId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(users)
        .set({ name: trimmed })
        .where(eq(users.id, existing.id))
        .returning({ id: users.id, name: users.name });
      if (updated) return updated;
    }
  }

  const [created] = await db
    .insert(users)
    .values({ name: trimmed })
    .returning({ id: users.id, name: users.name });

  if (!created) {
    throw new Error("Failed to create visitor");
  }

  cookieStore.set(COOKIE_NAME, created.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return created;
}
