"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NameGateProps {
  title: string;
  description: string;
  onSetName: (name: string) => Promise<{ id: string; name: string }>;
}

export function NameGate({ title, description, onSetName }: NameGateProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Even anonymous geniuses need a name.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await onSetName(name.trim());
      router.refresh();
    } catch {
      setError("Something went wrong. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="e.g. Definitely Not Concussed"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={100}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Setting up..." : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}
