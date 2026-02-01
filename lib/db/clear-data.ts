#!/usr/bin/env bun

import { db, testAttempts, groupMembers, groups, users } from "./index";

console.log("🗑️  Clearing old test data...\n");

async function clearTestData() {
  try {
    // Delete in correct order due to foreign keys
    await db.delete(testAttempts);
    console.log("✓ Cleared test attempts");
    
    await db.delete(groupMembers);
    console.log("✓ Cleared group members");
    
    await db.delete(groups);
    console.log("✓ Cleared groups");
    
    await db.delete(users);
    console.log("✓ Cleared users");
    
    console.log("\n✅ All test data cleared!");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.main) {
  await clearTestData();
  process.exit(0);
}
