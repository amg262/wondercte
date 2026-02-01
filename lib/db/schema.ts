import { pgTable, uuid, varchar, timestamp, integer, boolean, jsonb, unique, index, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Better Auth tables
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Original Users table (kept for backwards compatibility with test data)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  googleId: varchar("google_id", { length: 255 }),
  facebookId: varchar("facebook_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Test attempts table (Wonderlic scores are 0-50)
export const testAttempts = pgTable("test_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull(), // 0-50 (Wonderlic scale)
  timeTakenSeconds: integer("time_taken_seconds").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  questionsAnswered: jsonb("questions_answered").notNull(),
}, (table) => ({
  userIdIdx: index("test_attempts_user_id_idx").on(table.userId),
  scoreIdx: index("test_attempts_score_idx").on(table.score),
  completedAtIdx: index("test_attempts_completed_at_idx").on(table.completedAt),
}));

// Groups table
export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  inviteCode: varchar("invite_code", { length: 8 }).notNull().unique(),
  creatorId: uuid("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  inviteCodeIdx: index("groups_invite_code_idx").on(table.inviteCode),
}));

// Group members table
export const groupMembers = pgTable("group_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
  uniqueGroupUser: unique().on(table.groupId, table.userId),
  groupIdIdx: index("group_members_group_id_idx").on(table.groupId),
  userIdIdx: index("group_members_user_id_idx").on(table.userId),
}));

// Test questions table
export const testQuestions = pgTable("test_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionText: varchar("question_text", { length: 1000 }).notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(), // math, verbal, logic, spatial
  difficulty: integer("difficulty").notNull(), // 1-5
  correctAnswer: varchar("correct_answer", { length: 500 }).notNull(),
  options: jsonb("options").notNull(), // Array of options for multiple choice
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  typeIdx: index("test_questions_type_idx").on(table.questionType),
  difficultyIdx: index("test_questions_difficulty_idx").on(table.difficulty),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  testAttempts: many(testAttempts),
  createdGroups: many(groups),
  groupMemberships: many(groupMembers),
}));

export const testAttemptsRelations = relations(testAttempts, ({ one }) => ({
  user: one(users, {
    fields: [testAttempts.userId],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.creatorId],
    references: [users.id],
  }),
  members: many(groupMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TestAttempt = typeof testAttempts.$inferSelect;
export type NewTestAttempt = typeof testAttempts.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;
export type TestQuestion = typeof testQuestions.$inferSelect;
export type NewTestQuestion = typeof testQuestions.$inferInsert;
