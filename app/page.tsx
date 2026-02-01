import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Users, Zap, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 md:py-24">
        <div className="container max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Ever Wonder Which Friend
                <span className="text-primary"> Has CTE?</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Take the cognitive test, share your results, and create a private leaderboard to see where you stack up against your friends. 
                Someone&apos;s gotta be at the bottom... hopefully it&apos;s not you.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/test">
                <Button size="lg" className="text-lg px-8">
                  <Brain className="mr-2 h-5 w-5" />
                  Take Test
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Powered by the ACE Algorithm
              </h2>
              <p className="text-lg text-muted-foreground">
                Adaptive Cognitive Efficiency - our proprietary scoring system that
                measures not just accuracy, but how efficiently you solve problems
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <Activity className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Three Test Modes</CardTitle>
                </CardHeader>
                <CardContent>
                  Choose from Short (25q), Full (50q), or our Adaptive ACE algorithm
                  that adjusts difficulty based on your performance
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Efficiency Matters</CardTitle>
                </CardHeader>
                <CardContent>
                  Speed and stability factor into your score. The ACE algorithm
                  rewards quick, confident answers to harder questions
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/algorithm">
                <Button size="lg" variant="outline">
                  <Brain className="mr-2 h-5 w-5" />
                  Learn About the ACE Algorithm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t px-4 py-12 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Take The Test</CardTitle>
                </div>
                <CardDescription>
                  Quick cognitive assessment in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  15 Wonderlic-style questions testing your brain&apos;s sharpness. Scored 0-50, with 20-21 being average. Find out if you&apos;re above or below the curve.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <CardTitle>Share Your Results</CardTitle>
                </div>
                <CardDescription>
                  Flex (or hide) your score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Post your results and challenge your friends to beat your score. Or keep it private if you bombed—we won&apos;t judge.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Private Leaderboards</CardTitle>
                </div>
                <CardDescription>
                  See who&apos;s the smartest in your crew
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create friend groups and compete in private leaderboards. Perfect for settling debates about who really has the brain damage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
