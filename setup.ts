#!/usr/bin/env bun

console.log("🚀 WonderCTE Setup Script\n");

// Check if .env.local exists
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
const envExamplePath = path.join(process.cwd(), ".env.example");

if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env.local from .env.example...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log("✅ .env.local created!");
  console.log("\n⚠️  Please edit .env.local and add your database URL and OAuth credentials\n");
} else {
  console.log("✅ .env.local already exists");
}

console.log("\n📦 Installing dependencies...");
const { spawnSync } = require("child_process");

const install = spawnSync("bun", ["install"], { stdio: "inherit" });
if (install.status !== 0) {
  console.error("❌ Failed to install dependencies");
  process.exit(1);
}

console.log("\n✅ Dependencies installed!");

console.log("\n📋 Next steps:");
console.log("1. Edit .env.local and add your DATABASE_URL");
console.log("2. Run: bun run db:push");
console.log("3. Run: bun run lib/db/seed.ts");
console.log("4. Run: bun run dev");
console.log("\nFor deployment instructions, see DEPLOYMENT.md\n");
