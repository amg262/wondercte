"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, LogIn } from "lucide-react";
import { createGroup, joinGroupByCode } from "@/lib/actions/groups";

interface CreateGroupFormProps {
  userId: string;
}

export function CreateGroupForm({ userId }: CreateGroupFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    setIsCreating(true);
    try {
      await createGroup({
        name: groupName,
        creatorId: userId,
        isPublic: false,
      });
      setGroupName("");
      router.refresh();
    } catch (error) {
      alert("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Group
        </CardTitle>
        <CardDescription>Start a new group and invite your friends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Button
          onClick={handleCreate}
          disabled={!groupName.trim() || isCreating}
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create Group"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function JoinGroupForm({ userId }: CreateGroupFormProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;

    setIsJoining(true);
    setError("");
    try {
      const result = await joinGroupByCode(inviteCode.toUpperCase(), userId);
      if (result.success) {
        setInviteCode("");
        router.refresh();
      } else {
        setError(result.error || "Failed to join group");
      }
    } catch (error) {
      setError("Failed to join group");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Join Group
        </CardTitle>
        <CardDescription>Enter an invite code to join an existing group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Invite code"
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value.toUpperCase());
            setError("");
          }}
          maxLength={8}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          onClick={handleJoin}
          disabled={inviteCode.length !== 8 || isJoining}
          className="w-full"
        >
          {isJoining ? "Joining..." : "Join Group"}
        </Button>
      </CardContent>
    </Card>
  );
}
