import { db } from "./index";
import { testQuestions } from "./schema";

// Sample questions for the Wonderlic-style test
const sampleQuestions = [
  // Math questions
  {
    questionText: "If a train travels 120 miles in 2 hours, what is its average speed in miles per hour?",
    questionType: "math",
    difficulty: 1,
    correctAnswer: "60",
    options: JSON.stringify(["50", "55", "60", "65"]),
  },
  {
    questionText: "What is 15% of 200?",
    questionType: "math",
    difficulty: 2,
    correctAnswer: "30",
    options: JSON.stringify(["25", "30", "35", "40"]),
  },
  {
    questionText: "If x + 7 = 15, what is x?",
    questionType: "math",
    difficulty: 1,
    correctAnswer: "8",
    options: JSON.stringify(["6", "7", "8", "9"]),
  },
  
  // Verbal/Logic questions
  {
    questionText: "Which word does not belong? Apple, Banana, Carrot, Orange",
    questionType: "verbal",
    difficulty: 1,
    correctAnswer: "Carrot",
    options: JSON.stringify(["Apple", "Banana", "Carrot", "Orange"]),
  },
  {
    questionText: "FAST is to SLOW as UP is to ___",
    questionType: "verbal",
    difficulty: 2,
    correctAnswer: "DOWN",
    options: JSON.stringify(["SIDE", "DOWN", "LEFT", "RIGHT"]),
  },
  {
    questionText: "If all bloops are razzies and all razzies are lazzies, then all bloops are definitely lazzies.",
    questionType: "logic",
    difficulty: 3,
    correctAnswer: "True",
    options: JSON.stringify(["True", "False"]),
  },
  
  // Pattern/Spatial questions
  {
    questionText: "What comes next in the sequence? 2, 4, 8, 16, ___",
    questionType: "logic",
    difficulty: 2,
    correctAnswer: "32",
    options: JSON.stringify(["24", "28", "32", "36"]),
  },
  {
    questionText: "Which number is missing? 1, 3, 5, 7, ___, 11",
    questionType: "logic",
    difficulty: 1,
    correctAnswer: "9",
    options: JSON.stringify(["8", "9", "10", "11"]),
  },
  
  // More math
  {
    questionText: "A store sells shirts for $25 each. If you buy 3 shirts, you get 20% off the total. How much do you pay?",
    questionType: "math",
    difficulty: 3,
    correctAnswer: "60",
    options: JSON.stringify(["55", "60", "65", "70"]),
  },
  {
    questionText: "What is 8 × 7?",
    questionType: "math",
    difficulty: 1,
    correctAnswer: "56",
    options: JSON.stringify(["48", "52", "56", "60"]),
  },
  
  // Verbal reasoning
  {
    questionText: "BRIGHT is the opposite of:",
    questionType: "verbal",
    difficulty: 1,
    correctAnswer: "DIM",
    options: JSON.stringify(["SHINY", "DIM", "CLEAR", "LOUD"]),
  },
  {
    questionText: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):",
    questionType: "verbal",
    difficulty: 4,
    correctAnswer: "OCEAN",
    options: JSON.stringify(["CITY", "ANIMAL", "OCEAN", "COUNTRY"]),
  },
  
  // More logic
  {
    questionText: "If 5 machines can make 5 widgets in 5 minutes, how long would it take 100 machines to make 100 widgets?",
    questionType: "logic",
    difficulty: 4,
    correctAnswer: "5",
    options: JSON.stringify(["5", "10", "20", "100"]),
  },
  {
    questionText: "A farmer has 17 sheep. All but 9 die. How many sheep are left?",
    questionType: "logic",
    difficulty: 3,
    correctAnswer: "9",
    options: JSON.stringify(["8", "9", "10", "17"]),
  },
  {
    questionText: "What is the next number in this sequence? 1, 1, 2, 3, 5, 8, ___",
    questionType: "logic",
    difficulty: 3,
    correctAnswer: "13",
    options: JSON.stringify(["11", "12", "13", "15"]),
  },
];

export async function seedQuestions() {
  try {
    console.log("Seeding test questions...");
    
    await db.insert(testQuestions).values(sampleQuestions);
    
    console.log(`✓ Seeded ${sampleQuestions.length} questions successfully`);
  } catch (error) {
    console.error("Error seeding questions:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.main) {
  await seedQuestions();
  process.exit(0);
}
