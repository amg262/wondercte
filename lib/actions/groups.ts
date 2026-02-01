"use server";

import { db, groups, groupMembers, users, type NewGroup, type NewGroupMember } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { generateInviteCode } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createGroup(data: { name: string; creatorId: string; isPublic?: boolean }) {
  try {
    const inviteCode = generateInviteCode();

    const [group] = await db
      .insert(groups)
      .values({
        name: data.name,
        inviteCode,
        creatorId: data.creatorId,
        isPublic: data.isPublic ?? false,
      })
      .returning();

    if (!group) {
      throw new Error("Failed to create group");
    }

    // Add creator as a member
    await db.insert(groupMembers).values({
      groupId: group.id,
      userId: data.creatorId,
    });

    revalidatePath("/groups");

    return { success: true, group };
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error("Failed to create group");
  }
}

export async function joinGroupByCode(inviteCode: string, userId: string) {
  try {
    // Find group by invite code
    const group = await db
      .select()
      .from(groups)
      .where(eq(groups.inviteCode, inviteCode))
      .limit(1);

    if (!group[0]) {
      return { success: false, error: "Invalid invite code" };
    }

    // Check if already a member
    const existingMember = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, group[0].id),
          eq(groupMembers.userId, userId)
        )
      )
      .limit(1);

    if (existingMember[0]) {
      return { success: false, error: "Already a member of this group" };
    }

    // Add as member
    await db.insert(groupMembers).values({
      groupId: group[0].id,
      userId,
    });

    revalidatePath("/groups");

    return { success: true, group: group[0] };
  } catch (error) {
    console.error("Error joining group:", error);
    throw new Error("Failed to join group");
  }
}

export async function getUserGroups(userId: string) {
  try {
    const userGroups = await db
      .select({
        id: groups.id,
        name: groups.name,
        inviteCode: groups.inviteCode,
        isPublic: groups.isPublic,
        createdAt: groups.createdAt,
        creatorId: groups.creatorId,
        creatorName: users.name,
        memberCount: sql<number>`COUNT(DISTINCT ${groupMembers.userId})`,
      })
      .from(groupMembers)
      .innerJoin(groups, eq(groupMembers.groupId, groups.id))
      .innerJoin(users, eq(groups.creatorId, users.id))
      .where(eq(groupMembers.userId, userId))
      .groupBy(
        groups.id,
        groups.name,
        groups.inviteCode,
        groups.isPublic,
        groups.createdAt,
        groups.creatorId,
        users.name
      );

    return userGroups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw new Error("Failed to fetch groups");
  }
}

export async function getGroupMembers(groupId: string) {
  try {
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId))
      .orderBy(groupMembers.joinedAt);

    return members;
  } catch (error) {
    console.error("Error fetching group members:", error);
    throw new Error("Failed to fetch group members");
  }
}

export async function leaveGroup(groupId: string, userId: string) {
  try {
    await db
      .delete(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId)
        )
      );

    // Check if group has no members left, delete it
    const remainingMembers = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId))
      .limit(1);

    if (remainingMembers.length === 0) {
      await db.delete(groups).where(eq(groups.id, groupId));
    }

    revalidatePath("/groups");

    return { success: true };
  } catch (error) {
    console.error("Error leaving group:", error);
    throw new Error("Failed to leave group");
  }
}
