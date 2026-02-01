import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 md:py-24">
        <div className="container max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Test Your Cognitive
                <span className="text-primary"> Abilities</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Take Wonderlic-style cognitive tests (scored 0-50) and compete with friends on leaderboards.
                Average score is 20-21. Can you beat it?
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

      {/* Features Section */}
      <section className="border-t bg-muted/50 px-4 py-12 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Quick Tests</CardTitle>
                </div>
                <CardDescription>
                  Complete challenging cognitive assessments in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  15 questions covering math, logic, verbal reasoning, and spatial awareness. Scored on the standard Wonderlic scale (0-50).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <CardTitle>Global Leaderboard</CardTitle>
                </div>
                <CardDescription>
                  Compete with players worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See where you rank globally and track your improvement over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Friend Groups</CardTitle>
                </div>
                <CardDescription>
                  Create private leaderboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Invite friends to your group and compete in private leaderboards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
