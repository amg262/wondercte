"use client";

import { Users } from "lucide-react";

interface NflBadgeProps {
  playerName: string;
  position: string;
}

export function NflBadge({ playerName, position }: NflBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs">
      <Users className="h-3 w-3" />
      <span>
        {playerName} ({position})
      </span>
    </div>
  );
}
