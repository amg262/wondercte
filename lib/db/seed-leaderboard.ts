#!/usr/bin/env bun

import { db, users, testAttempts, groups, groupMembers } from "./index";

console.log("🌱 Seeding leaderboard data...\n");

async function seedLeaderboardData() {
  try {
    // Your friends with specific rankings
    const testUsers = [
      { name: "Mason Koehn", email: "mason@example.com", targetScore: 45 }, // 1st - Top score
      { name: "Peyton Ropas", email: "peyton@example.com", targetScore: 42 }, // 2nd
      { name: "Ryan Richards", email: "ryan@example.com", targetScore: 38 }, // 3rd
      { name: "Mike Sanders", email: "mike@example.com", targetScore: 35 }, // 4th
      { name: "Ben Tordik", email: "ben@example.com", targetScore: 32 }, // 5th
      { name: "Todd Porter", email: "todd@example.com", targetScore: 29 }, // 6th
      { name: "Sam Suminski", email: "sam@example.com", targetScore: 26 }, // 7th
      { name: "Matt Selkie", email: "matt@example.com", targetScore: 23 }, // 8th
      { name: "Moondog", email: "moondog@example.com", targetScore: 20 }, // 9th
      { name: "Justen Last", email: "justen@example.com", targetScore: 16 }, // 10th (bottom)
      { name: "Kyle Zodrow", email: "kyle@example.com", targetScore: 16 }, // 10th (tied bottom)
    ];

    console.log("👥 Creating your friends...");
    const createdUsers = await db.insert(users).values(
      testUsers.map(({ name, email }) => ({ name, email }))
    ).returning();
    console.log(`✓ Created ${createdUsers.length} users`);

    // Generate test attempts for each user with specified scores
    console.log("\n🧠 Creating test attempts...");
    let totalAttempts = 0;

    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i]!;
      const targetScore = testUsers[i]!.targetScore;
      const numAttempts = Math.floor(Math.random() * 2) + 2; // 2-3 attempts per user
      
      for (let j = 0; j < numAttempts; j++) {
        // Generate score around target (best score should be the target)
        let score;
        if (j === 0) {
          // First attempt is the best score (target)
          score = targetScore;
        } else {
          // Other attempts are slightly lower
          score = Math.max(10, targetScore - Math.floor(Math.random() * 8) - 1);
        }
        
        // Time taken: faster for higher scores (3-12 minutes)
        const baseTime = 180 + Math.floor(Math.random() * 540); // 180-720 seconds
        const timeTaken = Math.floor(baseTime * (55 - score) / 35); // Better scores = faster times
        
        // Create mock questions answered (15 questions)
        const correctCount = Math.round((score / 50) * 15);
        const questionsAnswered = Array.from({ length: 15 }, (_, idx) => ({
          questionId: `mock-${idx}`,
          userAnswer: idx < correctCount ? "A" : "B",
          correctAnswer: "A",
          isCorrect: idx < correctCount,
        }));

        // Random date within last 30 days, but first attempt is most recent
        const daysAgo = j === 0 ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * 30);
        const completedAt = new Date();
        completedAt.setDate(completedAt.getDate() - daysAgo);

        await db.insert(testAttempts).values({
          userId: user.id,
          score,
          timeTakenSeconds: timeTaken,
          questionsAnswered,
          completedAt,
        });
        
        totalAttempts++;
      }
    }
    console.log(`✓ Created ${totalAttempts} test attempts`);

    // Create friend groups
    console.log("\n👥 Creating friend groups...");
    
    // Group 1: "The Crew" - Everyone
    const group1 = await db.insert(groups).values({
      name: "The Crew",
      inviteCode: "THECREW1",
      creatorId: createdUsers[0]!.id, // Mason creates it
      isPublic: false,
    }).returning();

    await db.insert(groupMembers).values(
      createdUsers.map(user => ({
        groupId: group1[0]!.id,
        userId: user.id,
      }))
    );

    // Group 2: "Top Performers" - Top 5
    const group2 = await db.insert(groups).values({
      name: "Top Performers",
      inviteCode: "TOP5CREW",
      creatorId: createdUsers[0]!.id, // Mason
      isPublic: false,
    }).returning();

    await db.insert(groupMembers).values([
      { groupId: group2[0]!.id, userId: createdUsers[0]!.id }, // Mason
      { groupId: group2[0]!.id, userId: createdUsers[1]!.id }, // Peyton
      { groupId: group2[0]!.id, userId: createdUsers[2]!.id }, // Ryan
      { groupId: group2[0]!.id, userId: createdUsers[3]!.id }, // Mike
      { groupId: group2[0]!.id, userId: createdUsers[4]!.id }, // Ben
    ]);

    // Group 3: "Practice Squad" - Bottom tier
    const group3 = await db.insert(groups).values({
      name: "Practice Squad",
      inviteCode: "PRACTICE",
      creatorId: createdUsers[9]!.id, // Justen creates it
      isPublic: false,
    }).returning();

    await db.insert(groupMembers).values([
      { groupId: group3[0]!.id, userId: createdUsers[8]!.id }, // Moondog
      { groupId: group3[0]!.id, userId: createdUsers[9]!.id }, // Justen
      { groupId: group3[0]!.id, userId: createdUsers[10]!.id }, // Kyle
    ]);

    console.log(`✓ Created 3 groups with members`);

    // Print summary
    console.log("\n📊 Leaderboard Seed Summary:");
    console.log("─".repeat(50));
    console.log(`👥 Your friends created:    ${createdUsers.length}`);
    console.log(`🧠 Test attempts:           ${totalAttempts}`);
    console.log(`👥 Groups created:          3`);
    console.log(`📋 Total memberships:       19`);
    console.log("─".repeat(50));
    
    console.log("\n🎯 Friend Group Invite Codes:");
    console.log("  • The Crew (Everyone):       THECREW1");
    console.log("  • Top Performers (Top 5):    TOP5CREW");
    console.log("  • Practice Squad (Bottom 3): PRACTICE");

    console.log("\n✅ Leaderboard seeding complete!");
    console.log("\nYou can now:");
    console.log("  1. Visit http://localhost:3000/leaderboard to see rankings");
    console.log("  2. Visit http://localhost:3000/groups to join a group");
    console.log("  3. Use invite codes above to test group features");
    
  } catch (error) {
    console.error("❌ Error seeding leaderboard data:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.main) {
  await seedLeaderboardData();
  process.exit(0);
}
