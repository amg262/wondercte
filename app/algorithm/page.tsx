import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Target, Activity, TrendingUp, Zap, Calculator } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACE Algorithm | WonderCTE",
  description: "Learn about our Adaptive Cognitive Efficiency algorithm and three test modes: Short, Full, and Adaptive testing.",
};

export default function AlgorithmPage() {
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Our Testing Methodology</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three ways to measure your cognitive performance
          </p>
        </div>

        {/* Test Types Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 mb-3 text-primary" />
              <CardTitle>Short Test</CardTitle>
              <CardDescription>25 Questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Quick assessment with standard Wonderlic scoring</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Duration:</strong> ~12 minutes</p>
                <p><strong>Best for:</strong> Quick benchmarking</p>
                <p><strong>Scoring:</strong> 0-50 scale</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 mb-3 text-primary" />
              <CardTitle>Full Test</CardTitle>
              <CardDescription>50 Questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Complete assessment with comprehensive scoring</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Duration:</strong> ~25 minutes</p>
                <p><strong>Best for:</strong> Detailed evaluation</p>
                <p><strong>Scoring:</strong> 0-50 scale</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <Activity className="h-10 w-10 mb-3 text-primary" />
              <CardTitle>Adaptive (ACE)</CardTitle>
              <CardDescription>Variable Questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Dynamic difficulty with efficiency-based scoring</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Duration:</strong> Variable</p>
                <p><strong>Best for:</strong> Elite performance</p>
                <p><strong>Scoring:</strong> Elite Quotient</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ACE Algorithm Introduction */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">The ACE Algorithm</CardTitle>
                <CardDescription className="text-base">Adaptive Cognitive Efficiency - Version 1</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Core Philosophy</h3>
              <p className="text-muted-foreground">
                This algorithm distinguishes between "Processing Power" (Difficulty) and "Processing Efficiency" (Time/Stability).
                Unlike standard tests, <strong>accuracy is a binary gate, not the score itself</strong>. You only accrue points if
                you are accurate; the amount of points is determined by how efficiently you arrived at the truth.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scoring Function */}
        <Card>
          <CardHeader>
            <CardTitle>The Scoring Function (Per Question)</CardTitle>
            <CardDescription>Time-Decayed Exponential Model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              S<sub>i</sub> = A<sub>i</sub> × D<sub>i</sub><sup>1.5</sup> × e<sup>-λ(T<sub>i</sub> - T<sub>target</sub>)/T<sub>target</sub></sup> × max(0.5, 1 - α × C<sub>i</sub>)
            </div>
            <p className="text-sm text-muted-foreground">
              This formula prevents the "infinity score" glitch while aggressively rewarding speed and stability.
            </p>
          </CardContent>
        </Card>

        {/* Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Variable Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Variable</th>
                    <th className="text-left py-2 px-3">Name</th>
                    <th className="text-left py-2 px-3">Type</th>
                    <th className="text-left py-2 px-3">Definition</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-3 font-mono">A<sub>i</sub></td>
                    <td className="py-3 px-3">Accuracy Vector</td>
                    <td className="py-3 px-3">Binary</td>
                    <td className="py-3 px-3"><strong>0</strong> if incorrect/skipped, <strong>1</strong> if correct</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono">D<sub>i</sub></td>
                    <td className="py-3 px-3">Difficulty</td>
                    <td className="py-3 px-3">Integer</td>
                    <td className="py-3 px-3">The complexity rating of the specific question (1-10)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono">T<sub>i</sub></td>
                    <td className="py-3 px-3">Actual Time</td>
                    <td className="py-3 px-3">Float (ms)</td>
                    <td className="py-3 px-3">Time elapsed from question render to final submission</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono">T<sub>target</sub></td>
                    <td className="py-3 px-3">Target Time</td>
                    <td className="py-3 px-3">Float (ms)</td>
                    <td className="py-3 px-3">The "Elite Benchmark" - time a top 1% performer takes at this difficulty</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono">C<sub>i</sub></td>
                    <td className="py-3 px-3">Change Count</td>
                    <td className="py-3 px-3">Integer</td>
                    <td className="py-3 px-3">Number of times the answer selection was toggled before submission</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Constants */}
        <Card>
          <CardHeader>
            <CardTitle>Tunable Constants</CardTitle>
            <CardDescription>The "Knobs" that control the algorithm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Constant</th>
                    <th className="text-left py-2 px-3">Value</th>
                    <th className="text-left py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-3 font-mono">λ (Lambda)</td>
                    <td className="py-3 px-3"><code className="bg-muted px-2 py-1 rounded">0.7</code></td>
                    <td className="py-3 px-3">
                      <strong>The Decay Factor.</strong> A higher value makes the score drop off faster as time passes.
                      λ = 0.7 ensures that meeting T<sub>target</sub> exactly retains ~50% of max potential points.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono">α (Alpha)</td>
                    <td className="py-3 px-3"><code className="bg-muted px-2 py-1 rounded">0.05</code></td>
                    <td className="py-3 px-3">
                      <strong>The Uncertainty Penalty.</strong> The percentage of score lost per answer toggle (5%).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Components Breakdown */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Difficulty Scaler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded font-mono text-sm">
                D<sub>i</sub><sup>1.5</sup>
              </div>
              <p className="text-sm text-muted-foreground">
                Difficulty is raised to the power of 1.5 rather than kept linear. Solving a Difficulty 10 problem
                is exponentially more valuable than a Difficulty 1 problem. This prevents gaming the system by
                answering easy questions quickly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Decay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded font-mono text-sm">
                e<sup>-λ(T<sub>i</sub>-T<sub>target</sub>)/T<sub>target</sub></sup>
              </div>
              <p className="text-sm text-muted-foreground">
                As T<sub>i</sub> increases, the multiplier approaches 0, but never becomes negative. If you answer
                faster than the target time, the exponent becomes smaller, pushing the multiplier closer to 1
                (Maximum Efficiency).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stability Penalty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded font-mono text-sm">
                max(0.5, 1 - α × C<sub>i</sub>)
              </div>
              <p className="text-sm text-muted-foreground">
                Penalizes "guessing" or "fidgeting." Each answer change removes 5% of the raw score. The max()
                function ensures that even 20+ toggles still allows 50% of points if you eventually get it right.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Adaptive Logic */}
        <Card>
          <CardHeader>
            <CardTitle>The Adaptive Logic</CardTitle>
            <CardDescription>How the algorithm determines which question is served next</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The adaptive engine looks at the <strong>Performance Ratio (P)</strong> = T<sub>i</sub> / T<sub>target</sub>,
              not the Score itself.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Condition</th>
                    <th className="text-left py-2 px-3">Logic</th>
                    <th className="text-left py-2 px-3">Next Question</th>
                    <th className="text-left py-2 px-3">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="bg-destructive/10">
                    <td className="py-3 px-3 font-mono">A<sub>i</sub> = 0</td>
                    <td className="py-3 px-3">Incorrect</td>
                    <td className="py-3 px-3 font-semibold">Difficulty -1</td>
                    <td className="py-3 px-3">User hit failure point. Reduce load.</td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-950/20">
                    <td className="py-3 px-3 font-mono">P &lt; 0.5</td>
                    <td className="py-3 px-3">"Super Speed"</td>
                    <td className="py-3 px-3 font-semibold">Difficulty +2</td>
                    <td className="py-3 px-3">User is bored/overqualified. Aggressive jump.</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-950/20">
                    <td className="py-3 px-3 font-mono">0.5 ≤ P ≤ 1.0</td>
                    <td className="py-3 px-3">"In Flow"</td>
                    <td className="py-3 px-3 font-semibold">Difficulty +1</td>
                    <td className="py-3 px-3">User is performing optimally. Standard progression.</td>
                  </tr>
                  <tr className="bg-yellow-50 dark:bg-yellow-950/20">
                    <td className="py-3 px-3 font-mono">P &gt; 1.0</td>
                    <td className="py-3 px-3">"Struggling"</td>
                    <td className="py-3 px-3 font-semibold">Difficulty +0</td>
                    <td className="py-3 px-3">User got it right, but too slowly. Do not increase difficulty.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Skip Protocol */}
        <Card>
          <CardHeader>
            <CardTitle>The Skip Protocol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              In an efficiency test, skipping is a <strong>strategic resource</strong>.
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Score Impact:</strong> <code className="bg-muted px-2 py-1 rounded ml-2">S<sub>i</sub> = 0</code>
                <span className="ml-2 text-muted-foreground">(No points awarded)</span>
              </div>
              <div>
                <strong>Adaptive Impact:</strong> <code className="bg-muted px-2 py-1 rounded ml-2">Difficulty +0</code>
                <span className="ml-2 text-muted-foreground">(No change)</span>
              </div>
              <div className="pt-2">
                <strong>Reasoning:</strong> Unlike a wrong answer (which implies inability), a skip implies
                <em>time management strategy</em>. We do not lower the difficulty, but we do not award points.
                This prevents users from tanking their difficulty on purpose to get easier points later.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Aggregation */}
        <Card>
          <CardHeader>
            <CardTitle>Final Aggregation: Elite Quotient (EQ)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Total "Elite Quotient" is not just the sum. It is the sum normalized by the highest difficulty reached.
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              EQ = Σ(S<sub>i</sub>) / max(D<sub>achieved</sub>)
            </div>
            <p className="text-sm text-muted-foreground">
              This normalization ensures that reaching higher difficulties is rewarded, even if you don't answer as many
              questions. A user who answers 10 questions at Difficulty 8-10 will score higher than someone who answers
              50 questions at Difficulty 1-3.
            </p>
          </CardContent>
        </Card>

        {/* Implementation Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Requirements</CardTitle>
            <CardDescription>What the system needs to make ACE work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-base">1. Metadata Tables</strong>
                <p className="text-muted-foreground mt-1">
                  Every question must contain a validated T<sub>target</sub> (Target Time) based on empirical data
                  from top performers at each difficulty level.
                </p>
              </div>
              <div>
                <strong className="text-base">2. Frontend Listeners</strong>
                <p className="text-muted-foreground mt-1">
                  Capture onclick events for Change Count (C<sub>i</sub>) and precise timestamps for Actual Time (T<sub>i</sub>).
                </p>
              </div>
              <div>
                <strong className="text-base">3. Real-time Calculation</strong>
                <p className="text-muted-foreground mt-1">
                  The scoring function must be computed server-side immediately after each question submission to
                  determine the next difficulty level.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
          <p>
            The ACE Algorithm is designed to measure cognitive efficiency, not just knowledge.
            It rewards quick, confident, accurate problem-solving at increasing levels of complexity.
          </p>
        </div>
      </div>
    </div>
  );
}
