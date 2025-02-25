"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { useCallback } from "react";
import { useVideoPlayer } from "./video-player";

interface VideoTimestampButtonProps {
  start: number;
  end: number;
}

export function VideoTimestampButton({
  start,
  end,
}: VideoTimestampButtonProps) {
  const { seekTo, scrollToPlayer } = useVideoPlayer();

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  const handleClick = useCallback(() => {
    seekTo(start);
    scrollToPlayer();
  }, [seekTo, scrollToPlayer, start]);

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      className="h-auto p-1 font-normal text-muted-foreground hover:text-foreground"
    >
      <PlayCircle className="mr-1 h-4 w-4" />
      <span>
        Watch {formatTime(start)} - {formatTime(end)}
      </span>
    </Button>
  );
}
