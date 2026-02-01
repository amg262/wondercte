#!/usr/bin/env bun

import { db, nflPlayers } from "./index";

const nflPlayerData = [
  // Perfect score
  { name: "Pat McInally", position: "P", team: "Cincinnati Bengals", wonderlicScore: 50, draftYear: 1975 },

  // Top scores (40-49)
  { name: "Ryan Fitzpatrick", position: "QB", team: "Various", wonderlicScore: 48, draftYear: 2005 },
  { name: "Alex Smith", position: "QB", team: "Kansas City Chiefs", wonderlicScore: 40, draftYear: 2005 },
  { name: "Eli Manning", position: "QB", team: "New York Giants", wonderlicScore: 39, draftYear: 2004 },
  { name: "Calvin Johnson", position: "WR", team: "Detroit Lions", wonderlicScore: 41, draftYear: 2007 },
  { name: "Andrew Luck", position: "QB", team: "Indianapolis Colts", wonderlicScore: 37, draftYear: 2012 },

  // High scores (30-39)
  { name: "Aaron Rodgers", position: "QB", team: "Green Bay Packers", wonderlicScore: 35, draftYear: 2005 },
  { name: "Tom Brady", position: "QB", team: "New England Patriots", wonderlicScore: 33, draftYear: 2000 },
  { name: "Rob Gronkowski", position: "TE", team: "New England Patriots", wonderlicScore: 32, draftYear: 2010 },
  { name: "Richard Sherman", position: "CB", team: "Seattle Seahawks", wonderlicScore: 37, draftYear: 2011 },
  { name: "Russell Wilson", position: "QB", team: "Seattle Seahawks", wonderlicScore: 28, draftYear: 2012 },
  { name: "Peyton Manning", position: "QB", team: "Indianapolis Colts", wonderlicScore: 28, draftYear: 1998 },

  // Mid-range scores (20-29)
  { name: "Patrick Mahomes", position: "QB", team: "Kansas City Chiefs", wonderlicScore: 24, draftYear: 2017 },
  { name: "Deshaun Watson", position: "QB", team: "Houston Texans", wonderlicScore: 24, draftYear: 2017 },
  { name: "Brett Favre", position: "QB", team: "Green Bay Packers", wonderlicScore: 22, draftYear: 1991 },
  { name: "Marshawn Lynch", position: "RB", team: "Seattle Seahawks", wonderlicScore: 16, draftYear: 2007 },
  { name: "Adrian Peterson", position: "RB", team: "Minnesota Vikings", wonderlicScore: 16, draftYear: 2007 },
  { name: "Randy Moss", position: "WR", team: "Minnesota Vikings", wonderlicScore: 21, draftYear: 1998 },

  // Lower scores (10-19)
  { name: "Lamar Jackson", position: "QB", team: "Baltimore Ravens", wonderlicScore: 13, draftYear: 2018 },
  { name: "Dan Marino", position: "QB", team: "Miami Dolphins", wonderlicScore: 15, draftYear: 1983 },
  { name: "Donovan McNabb", position: "QB", team: "Philadelphia Eagles", wonderlicScore: 14, draftYear: 1999 },
  { name: "Terrell Owens", position: "WR", team: "San Francisco 49ers", wonderlicScore: 15, draftYear: 1996 },
  { name: "A.J. Green", position: "WR", team: "Cincinnati Bengals", wonderlicScore: 10, draftYear: 2011 },

  // Very low scores (5-9)
  { name: "Frank Gore", position: "RB", team: "San Francisco 49ers", wonderlicScore: 6, draftYear: 2005 },
  { name: "Vince Young", position: "QB", team: "Tennessee Titans", wonderlicScore: 6, draftYear: 2006 },
  { name: "Morris Claiborne", position: "CB", team: "Dallas Cowboys", wonderlicScore: 4, draftYear: 2012 },

  // Additional players for better distribution
  { name: "Josh Allen", position: "QB", team: "Buffalo Bills", wonderlicScore: 37, draftYear: 2018 },
  { name: "Matthew Stafford", position: "QB", team: "Los Angeles Rams", wonderlicScore: 38, draftYear: 2009 },
  { name: "Drew Brees", position: "QB", team: "New Orleans Saints", wonderlicScore: 28, draftYear: 2001 },
  { name: "J.J. Watt", position: "DE", team: "Houston Texans", wonderlicScore: 34, draftYear: 2011 },
  { name: "Von Miller", position: "LB", team: "Denver Broncos", wonderlicScore: 26, draftYear: 2011 },
];

export async function seedNflPlayers() {
  try {
    console.log("Seeding NFL player data...");
    await db.insert(nflPlayers).values(nflPlayerData);
    console.log(`✓ Seeded ${nflPlayerData.length} NFL players`);
  } catch (error) {
    console.error("Error seeding NFL players:", error);
    throw error;
  }
}

if (import.meta.main) {
  await seedNflPlayers();
  process.exit(0);
}
