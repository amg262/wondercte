"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Brain, LayoutDashboard, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/algorithm", label: "Algorithm", icon: Brain },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">WonderCTE</span>
        </Link>

        <div className="hidden lg:flex items-center space-x-6">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button variant="ghost" size="sm">
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
          <Link href="/test">
            <Button variant="default" size="sm">
              Take Test
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/test">
            <Button variant="default" size="sm">
              Take Test
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t px-4 py-2 space-y-1 bg-background">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
