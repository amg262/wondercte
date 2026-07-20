import { db } from "./index";
import { testQuestions } from "./schema";

// ACE target time benchmark, scaled by difficulty (see lib/actions/ace.ts)
function targetTimeMsFor(difficulty: number): number {
  return 8000 + difficulty * 4000;
}

// Question bank for the Wonderlic-style test.
// Spread across difficulty 1-5 and math/verbal/logic/spatial types so
// Short (25q), Full (50q), and Adaptive (ACE) modes all have real, distinct
// content to draw from without excessive repeats.
const rawQuestions: Array<{
  questionText: string;
  questionType: "math" | "verbal" | "logic" | "spatial";
  difficulty: number;
  correctAnswer: string;
  options: string[];
}> = [
  // ---------- Difficulty 1 ----------
  { questionText: "What is 12 + 15?", questionType: "math", difficulty: 1, correctAnswer: "27", options: ["25", "26", "27", "29"] },
  { questionText: "What is 9 × 6?", questionType: "math", difficulty: 1, correctAnswer: "54", options: ["45", "50", "54", "56"] },
  { questionText: "What is 100 - 37?", questionType: "math", difficulty: 1, correctAnswer: "63", options: ["61", "63", "65", "67"] },
  { questionText: "What is 48 ÷ 6?", questionType: "math", difficulty: 1, correctAnswer: "8", options: ["6", "7", "8", "9"] },
  { questionText: "What is half of 50?", questionType: "math", difficulty: 1, correctAnswer: "25", options: ["20", "25", "30", "35"] },
  { questionText: "HAPPY is the opposite of:", questionType: "verbal", difficulty: 1, correctAnswer: "SAD", options: ["GLAD", "SAD", "JOYFUL", "CONTENT"] },
  { questionText: "Which word does not belong? Dog, Cat, Bird, Chair", questionType: "verbal", difficulty: 1, correctAnswer: "Chair", options: ["Dog", "Cat", "Bird", "Chair"] },
  { questionText: "BIG is to SMALL as TALL is to ___", questionType: "verbal", difficulty: 1, correctAnswer: "SHORT", options: ["HIGH", "SHORT", "LONG", "WIDE"] },
  { questionText: "UP is to DOWN as LEFT is to ___", questionType: "verbal", difficulty: 1, correctAnswer: "RIGHT", options: ["SIDE", "RIGHT", "NORTH", "BACK"] },
  { questionText: "What comes next? 2, 4, 6, 8, ___", questionType: "logic", difficulty: 1, correctAnswer: "10", options: ["9", "10", "11", "12"] },
  { questionText: "Which number is missing? 5, 10, 15, ___, 25", questionType: "logic", difficulty: 1, correctAnswer: "20", options: ["18", "19", "20", "22"] },
  { questionText: "Mary has 3 apples. She buys 4 more. How many apples does she have now?", questionType: "logic", difficulty: 1, correctAnswer: "7", options: ["5", "6", "7", "8"] },
  { questionText: "Which shape comes next: Circle, Square, Circle, Square, ___?", questionType: "logic", difficulty: 1, correctAnswer: "Circle", options: ["Circle", "Square", "Triangle", "Star"] },
  { questionText: "If you rotate the letter 'b' 180 degrees, which letter does it most resemble?", questionType: "spatial", difficulty: 1, correctAnswer: "q", options: ["p", "d", "q", "b"] },
  { questionText: "A square has how many sides?", questionType: "spatial", difficulty: 1, correctAnswer: "4", options: ["3", "4", "5", "6"] },
  { questionText: "How many corners does a triangle have?", questionType: "spatial", difficulty: 1, correctAnswer: "3", options: ["2", "3", "4", "5"] },
  { questionText: "If you fold a square piece of paper in half once, how many layers of paper are there?", questionType: "spatial", difficulty: 1, correctAnswer: "2", options: ["1", "2", "3", "4"] },

  // ---------- Difficulty 2 ----------
  { questionText: "What is 15% of 80?", questionType: "math", difficulty: 2, correctAnswer: "12", options: ["10", "12", "14", "16"] },
  { questionText: "A shirt costs $40. It's on sale for 25% off. What's the sale price?", questionType: "math", difficulty: 2, correctAnswer: "30", options: ["25", "28", "30", "32"] },
  { questionText: "What is 7 squared?", questionType: "math", difficulty: 2, correctAnswer: "49", options: ["42", "47", "49", "56"] },
  { questionText: "If a car travels 180 miles in 3 hours, what's its average speed?", questionType: "math", difficulty: 2, correctAnswer: "60", options: ["50", "55", "60", "65"] },
  { questionText: "What is 9 × 12?", questionType: "math", difficulty: 2, correctAnswer: "108", options: ["98", "104", "108", "112"] },
  { questionText: "GENEROUS is the opposite of:", questionType: "verbal", difficulty: 2, correctAnswer: "STINGY", options: ["KIND", "STINGY", "WEALTHY", "POLITE"] },
  { questionText: "AUTHOR is to BOOK as COMPOSER is to ___", questionType: "verbal", difficulty: 2, correctAnswer: "SYMPHONY", options: ["PIANO", "SYMPHONY", "ORCHESTRA", "SONG"] },
  { questionText: "Which word does not belong? Whisper, Shout, Yell, Chair", questionType: "verbal", difficulty: 2, correctAnswer: "Chair", options: ["Whisper", "Shout", "Yell", "Chair"] },
  { questionText: "What comes next? 3, 6, 12, 24, ___", questionType: "logic", difficulty: 2, correctAnswer: "48", options: ["36", "40", "48", "52"] },
  { questionText: "If all cats are mammals and all mammals are animals, then all cats are definitely animals.", questionType: "logic", difficulty: 2, correctAnswer: "True", options: ["True", "False"] },
  { questionText: "Complete the pattern: A, C, E, G, ___", questionType: "logic", difficulty: 2, correctAnswer: "I", options: ["H", "I", "J", "K"] },
  { questionText: "Tom is older than Jerry. Jerry is older than Spike. Who is the youngest?", questionType: "logic", difficulty: 2, correctAnswer: "Spike", options: ["Tom", "Jerry", "Spike", "Can't tell"] },
  { questionText: "Which number doesn't belong: 2, 4, 6, 9, 8", questionType: "logic", difficulty: 2, correctAnswer: "9", options: ["2", "4", "9", "8"] },
  { questionText: "How many edges does a cube have?", questionType: "spatial", difficulty: 2, correctAnswer: "12", options: ["6", "8", "10", "12"] },
  { questionText: "If you rotate the letter 'p' 180 degrees, what does it look like?", questionType: "spatial", difficulty: 2, correctAnswer: "d", options: ["b", "d", "q", "p"] },
  { questionText: "A rectangle is cut in half along its diagonal. What shape are the two resulting pieces?", questionType: "spatial", difficulty: 2, correctAnswer: "Triangles", options: ["Squares", "Triangles", "Rectangles", "Pentagons"] },

  // ---------- Difficulty 3 ----------
  { questionText: "A store sells shirts for $25 each. If you buy 3 shirts, you get 20% off the total. How much do you pay?", questionType: "math", difficulty: 3, correctAnswer: "60", options: ["55", "60", "65", "70"] },
  { questionText: "If 3 workers can build a wall in 12 days, how many days would it take 6 workers at the same rate?", questionType: "math", difficulty: 3, correctAnswer: "6", options: ["4", "6", "8", "9"] },
  { questionText: "What is the average of 12, 18, and 24?", questionType: "math", difficulty: 3, correctAnswer: "18", options: ["16", "17", "18", "20"] },
  { questionText: "A number increased by 25% equals 100. What was the original number?", questionType: "math", difficulty: 3, correctAnswer: "80", options: ["75", "78", "80", "85"] },
  { questionText: "If x - 9 = 23, what is x?", questionType: "math", difficulty: 3, correctAnswer: "32", options: ["30", "31", "32", "33"] },
  { questionText: "What is 144 ÷ 12?", questionType: "math", difficulty: 3, correctAnswer: "12", options: ["10", "11", "12", "14"] },
  { questionText: "If all bloops are razzies and all razzies are lazzies, then all bloops are definitely lazzies.", questionType: "logic", difficulty: 3, correctAnswer: "True", options: ["True", "False"] },
  { questionText: "METICULOUS most nearly means:", questionType: "verbal", difficulty: 3, correctAnswer: "CAREFUL", options: ["CARELESS", "CAREFUL", "QUICK", "LAZY"] },
  { questionText: "Which word is the odd one out? Ocean, Lake, River, Desert", questionType: "verbal", difficulty: 3, correctAnswer: "Desert", options: ["Ocean", "Lake", "River", "Desert"] },
  { questionText: "A farmer has 17 sheep. All but 9 die. How many sheep are left?", questionType: "logic", difficulty: 3, correctAnswer: "9", options: ["8", "9", "10", "17"] },
  { questionText: "What is the next number in this sequence? 1, 1, 2, 3, 5, 8, ___", questionType: "logic", difficulty: 3, correctAnswer: "13", options: ["11", "12", "13", "15"] },
  { questionText: "Alex, Ben, Cara, Dana, and Eve sit in a row in that exact order. Who sits in the middle?", questionType: "logic", difficulty: 3, correctAnswer: "Cara", options: ["Alex", "Ben", "Cara", "Dana"] },
  { questionText: "If today is Wednesday, what day will it be in 10 days?", questionType: "logic", difficulty: 3, correctAnswer: "Saturday", options: ["Friday", "Saturday", "Sunday", "Monday"] },
  { questionText: "A cube is painted red on all faces, then cut into 27 equal smaller cubes (3×3×3). How many small cubes have exactly 2 red faces?", questionType: "spatial", difficulty: 3, correctAnswer: "12", options: ["8", "10", "12", "14"] },
  { questionText: "How many faces does a hexagonal prism have?", questionType: "spatial", difficulty: 3, correctAnswer: "8", options: ["6", "7", "8", "9"] },
  { questionText: "If you unfold a cube into a flat net, how many squares (faces) will you see?", questionType: "spatial", difficulty: 3, correctAnswer: "6", options: ["4", "5", "6", "8"] },
  { questionText: "Complete the pattern: 100, 90, 81, 73, ___", questionType: "logic", difficulty: 3, correctAnswer: "66", options: ["64", "65", "66", "68"] },

  // ---------- Difficulty 4 ----------
  { questionText: "If 5 machines can make 5 widgets in 5 minutes, how long would it take 100 machines to make 100 widgets?", questionType: "logic", difficulty: 4, correctAnswer: "5", options: ["5", "10", "20", "100"] },
  { questionText: "A train leaves at 2:15 PM and arrives at 5:48 PM. How long was the trip?", questionType: "math", difficulty: 4, correctAnswer: "3h33m", options: ["3h13m", "3h33m", "3h43m", "3h53m"] },
  { questionText: "The sum of three consecutive integers is 72. What is the largest of the three?", questionType: "math", difficulty: 4, correctAnswer: "25", options: ["23", "24", "25", "26"] },
  { questionText: "A tank is 40% full. After adding 30 liters, it becomes 70% full. What is the tank's total capacity in liters?", questionType: "math", difficulty: 4, correctAnswer: "100", options: ["80", "90", "100", "110"] },
  { questionText: "If y = 2x + 3 and x = 5, what is y?", questionType: "math", difficulty: 4, correctAnswer: "13", options: ["10", "11", "13", "15"] },
  { questionText: "What is 17% of 300?", questionType: "math", difficulty: 4, correctAnswer: "51", options: ["45", "48", "51", "54"] },
  { questionText: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):", questionType: "verbal", difficulty: 4, correctAnswer: "OCEAN", options: ["CITY", "ANIMAL", "OCEAN", "COUNTRY"] },
  { questionText: "EPHEMERAL most nearly means:", questionType: "verbal", difficulty: 4, correctAnswer: "TEMPORARY", options: ["TEMPORARY", "ETERNAL", "BEAUTIFUL", "LOUD"] },
  { questionText: "Which pair of words shares the same relationship as CANDLE : WAX?", questionType: "verbal", difficulty: 4, correctAnswer: "STATUE : MARBLE", options: ["STATUE : MARBLE", "BOOK : PAGE", "CAR : WHEEL", "FIRE : SMOKE"] },
  { questionText: "In a race, you overtake the person in 2nd place. What position are you in now?", questionType: "logic", difficulty: 4, correctAnswer: "2nd", options: ["1st", "2nd", "3rd", "Can't tell"] },
  { questionText: "All students who study hard get good grades. John did not get good grades. Therefore:", questionType: "logic", difficulty: 4, correctAnswer: "John did not study hard", options: ["John studied hard", "John did not study hard", "John is a good student", "Cannot be determined"] },
  { questionText: "What is the next number? 2, 6, 12, 20, 30, ___", questionType: "logic", difficulty: 4, correctAnswer: "42", options: ["38", "40", "42", "44"] },
  { questionText: "A is taller than B. C is shorter than B. D is taller than A. Who is the tallest?", questionType: "logic", difficulty: 4, correctAnswer: "D", options: ["A", "B", "C", "D"] },
  { questionText: "A cube is painted red on all faces, then cut into 64 equal smaller cubes (4×4×4). How many small cubes have exactly 1 red face?", questionType: "spatial", difficulty: 4, correctAnswer: "24", options: ["16", "20", "24", "28"] },
  { questionText: "How many diagonals does a hexagon have?", questionType: "spatial", difficulty: 4, correctAnswer: "9", options: ["6", "8", "9", "12"] },
  { questionText: "On a clock showing 3:15, what is the angle between the hour and minute hands?", questionType: "spatial", difficulty: 4, correctAnswer: "7.5°", options: ["0°", "7.5°", "15°", "30°"] },

  // ---------- Difficulty 5 ----------
  { questionText: "An investment grows by 10% each year. After 2 years, it's worth $1,210. What was the original investment?", questionType: "math", difficulty: 5, correctAnswer: "1000", options: ["900", "950", "1000", "1050"] },
  { questionText: "Two trains start 300 miles apart and move toward each other, one at 60 mph and the other at 40 mph. How long until they meet?", questionType: "math", difficulty: 5, correctAnswer: "3", options: ["2.5", "3", "3.5", "4"] },
  { questionText: "The product of two consecutive even integers is 168. What is the smaller integer?", questionType: "math", difficulty: 5, correctAnswer: "12", options: ["10", "12", "14", "16"] },
  { questionText: "A tank can be filled by pipe A in 6 hours and by pipe B in 4 hours. How long would it take both pipes together to fill the tank?", questionType: "math", difficulty: 5, correctAnswer: "2.4", options: ["2", "2.4", "2.5", "3"] },
  { questionText: "If f(x) = x² - 3x + 2, what is f(5)?", questionType: "math", difficulty: 5, correctAnswer: "12", options: ["10", "12", "14", "16"] },
  { questionText: "PERSPICACIOUS most nearly means:", questionType: "verbal", difficulty: 5, correctAnswer: "PERCEPTIVE", options: ["CONFUSED", "PERCEPTIVE", "ARROGANT", "CAUTIOUS"] },
  { questionText: "Which pair of words shares the same relationship as ARDUOUS : EFFORTLESS?", questionType: "verbal", difficulty: 5, correctAnswer: "DILIGENT : LAZY", options: ["DILIGENT : LAZY", "HAPPY : JOYFUL", "QUICK : FAST", "LOUD : NOISY"] },
  { questionText: "Choose the word that is most nearly opposite of BENEVOLENT:", questionType: "verbal", difficulty: 5, correctAnswer: "MALICIOUS", options: ["GENEROUS", "KIND", "MALICIOUS", "CHARITABLE"] },
  { questionText: "Ann is the mother of Bob. Bob is the father of Cara and Dan. How is Ann related to Dan?", questionType: "logic", difficulty: 5, correctAnswer: "Grandmother", options: ["Mother", "Grandmother", "Aunt", "Sister"] },
  { questionText: "If the code for CAT is DBU (each letter shifted forward by 1), what is the code for DOG?", questionType: "logic", difficulty: 5, correctAnswer: "EPH", options: ["EPH", "EPI", "FQH", "EQH"] },
  { questionText: "A is twice as old as B was when A was as old as B is now. If A is 24, how old is B?", questionType: "logic", difficulty: 5, correctAnswer: "16", options: ["12", "16", "18", "20"] },
  { questionText: "What is the next term? 1, 4, 9, 16, 25, ___", questionType: "logic", difficulty: 5, correctAnswer: "36", options: ["30", "32", "36", "49"] },
  { questionText: "P implies Q. Q implies R. R is false. What can we conclude about P?", questionType: "logic", difficulty: 5, correctAnswer: "P is false", options: ["P is true", "P is false", "Cannot be determined", "P is irrelevant"] },
  { questionText: "A 5×5×5 cube made of unit cubes is painted on all outer faces, then disassembled. How many unit cubes have exactly 3 painted faces?", questionType: "spatial", difficulty: 5, correctAnswer: "8", options: ["6", "8", "12", "27"] },
  { questionText: "How many space diagonals does a cube have (connecting opposite corners through the interior)?", questionType: "spatial", difficulty: 5, correctAnswer: "4", options: ["2", "4", "6", "8"] },
  { questionText: "A regular octagon has how many diagonals?", questionType: "spatial", difficulty: 5, correctAnswer: "20", options: ["16", "18", "20", "24"] },
  { questionText: "What is the sum of the interior angles of a hexagon?", questionType: "spatial", difficulty: 5, correctAnswer: "720°", options: ["540°", "600°", "720°", "900°"] },
];

const sampleQuestions = rawQuestions.map((q) => ({
  questionText: q.questionText,
  questionType: q.questionType,
  difficulty: q.difficulty,
  correctAnswer: q.correctAnswer,
  options: JSON.stringify(q.options),
  targetTimeMs: targetTimeMsFor(q.difficulty),
}));

export async function seedQuestions() {
  try {
    console.log("Seeding test questions...");

    // Full reseed keeps the bank consistent with this file — safe since
    // test_attempts snapshots question text/answers into questionsAnswered
    // rather than holding a live FK to test_questions.
    await db.delete(testQuestions);
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
