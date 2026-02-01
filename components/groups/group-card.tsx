"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Copy, Check, ExternalLink, LogOut } from "lucide-react";
import { leaveGroup } from "@/lib/actions/groups";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    inviteCode: string;
    creatorId: string;
    creatorName: string;
    memberCount: number;
  };
  currentUserId: string;
}

export function GroupCard({ group, currentUserId }: GroupCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    setIsLeaving(true);
    try {
      await leaveGroup(group.id, currentUserId);
      router.refresh();
    } catch (error) {
      alert("Failed to leave group");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {group.name}
            </CardTitle>
            <CardDescription>
              Created by {group.creatorName} • {group.memberCount} member
              {group.memberCount !== 1 ? "s" : ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
            {group.inviteCode}
          </code>
          <Button size="sm" variant="outline" onClick={copyInviteCode}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex gap-2">
          <Link href={`/groups/${group.id}`} className="flex-1">
            <Button variant="default" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Leaderboard
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={handleLeave}
            disabled={isLeaving}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
