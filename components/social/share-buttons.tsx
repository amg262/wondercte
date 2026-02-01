"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Copy, Check, Facebook, Twitter } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
  inviteCode?: string;
}

export function ShareButtons({ title, text, url, inviteCode }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [hasShare, setHasShare] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    setHasShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = async (platform: "native" | "twitter" | "facebook") => {
    const shareData = {
      title,
      text,
      url: shareUrl,
    };

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
      }
      return;
    }

    if (platform === "twitter") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, "_blank");
    }

    if (platform === "facebook") {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(facebookUrl, "_blank");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <p className="text-sm font-medium">Share with friends:</p>

        {inviteCode && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="flex-1 font-mono text-sm">{inviteCode}</code>
            <Button size="sm" variant="ghost" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {hasShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("native")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
