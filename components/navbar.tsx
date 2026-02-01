"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, Trophy, Users, Brain } from "lucide-react";

export function Navbar() {
  const session = authClient.useSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">WonderCTE</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link href="/algorithm">
              <Button variant="ghost" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                Algorithm
              </Button>
            </Link>
            {session.data?.user ? (
              <>
                <Link href="/leaderboard">
                  <Button variant="ghost" size="sm">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Button>
                </Link>
                <Link href="/groups">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Groups
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {session.data.user.name}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => authClient.signOut()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
