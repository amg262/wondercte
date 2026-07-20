import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Brain, Activity } from "lucide-react";

const MODES = [
  {
    mode: "short",
    icon: Clock,
    title: "Short Test",
    description: "25 Questions",
    body: "Quick assessment with standard Wonderlic scoring",
    meta: ["~12 minutes", "Best for quick benchmarking", "0-50 scale"],
    highlight: false,
  },
  {
    mode: "full",
    icon: Brain,
    title: "Full Test",
    description: "50 Questions",
    body: "Complete assessment with comprehensive scoring",
    meta: ["~25 minutes", "Best for detailed evaluation", "0-50 scale"],
    highlight: false,
  },
  {
    mode: "adaptive",
    icon: Activity,
    title: "Adaptive (ACE)",
    description: "10-20 Questions",
    body: "Dynamic difficulty with efficiency-based scoring",
    meta: ["Variable length", "Best for elite performance", "Elite Quotient"],
    highlight: true,
  },
] as const;

export function TestModeSelect() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pick Your Test</h1>
        <p className="text-muted-foreground">Three ways to measure your cognitive performance</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {MODES.map(({ mode, icon: Icon, title, description, body, meta, highlight }) => (
          <Link key={mode} href={`/test?mode=${mode}`} className="block h-full">
            <Card className={`h-full transition-colors hover:border-primary ${highlight ? "border-primary" : ""}`}>
              <CardHeader>
                <Icon className="h-10 w-10 mb-3 text-primary" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{body}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
