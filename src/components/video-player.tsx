"use client";

declare global {
  interface Window {
    stonks: {
      event: (name: string, path?: string) => void;
    };
  }
}

import { getEmbedUrl } from "@/lib/utils";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  TextTrackInit,
  Track,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import { usePathname } from "next/navigation";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react";

interface Feature {
  id: string | number;
  feature: string;
  description: string;
  timestampStart: number | null;
  timestampEnd: number | null;
}

interface VideoPlayerContextType {
  seekTo: (start: number, end?: number) => void;
  scrollToPlayer: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | null>(null);

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error("useVideoPlayer must be used within a VideoPlayerProvider");
  }
  return context;
}

interface VideoPlayerProviderProps extends PropsWithChildren {
  url: string;
  title: string;
  features?: Feature[];
}

export function VideoPlayerProvider({
  children,
  url,
  title,
  features,
}: VideoPlayerProviderProps) {
  const path = usePathname();
  const playerRef = useRef<MediaPlayerInstance>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const embedUrl = getEmbedUrl(url);

  // Convert features to VTT chapters format
  const chapters: TextTrackInit | undefined = features?.length
    ? {
        kind: "chapters",
        label: "Chapters",
        language: "en",
        content: features
          .map(
            (feature) =>
              feature.timestampStart &&
              `${formatVTTTime(feature.timestampStart)} --> ${formatVTTTime(
                feature.timestampEnd ?? feature.timestampStart + 1,
              )}\n${feature.feature}`,
          )
          .filter(Boolean)
          .join("\n\n"),
      }
    : undefined;

  const seekTo = useCallback((start: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = start;
    }
  }, []);

  const scrollToPlayer = useCallback(() => {
    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const contextValue = {
    seekTo,
    scrollToPlayer,
  };

  return (
    <VideoPlayerContext.Provider value={contextValue}>
      <div className="space-y-8">
        {!embedUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Invalid video URL</p>
          </div>
        ) : (
          <div
            className="aspect-video rounded-lg overflow-hidden bg-muted"
            ref={playerContainerRef}
          >
            <MediaPlayer
              ref={playerRef}
              src={embedUrl}
              viewType="video"
              title={title}
              crossorigin
              streamType="on-demand"
              playsInline
              className="w-full h-full"
              load="visible"
              onPlay={() => {
                window.stonks.event("Played video", path);
              }}
              onError={(error) => {
                console.error("Video player error:", error);
              }}
            >
              <MediaProvider>
                {chapters && (
                  <Track
                    src={`data:text/vtt;base64,${btoa(
                      `WEBVTT\n\n${chapters.content}`,
                    )}`}
                    kind="chapters"
                    label="Chapters"
                    default
                  />
                )}
              </MediaProvider>
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
          </div>
        )}
        {children}
      </div>
    </VideoPlayerContext.Provider>
  );
}

function formatVTTTime(seconds: number | null): string {
  if (seconds === null) return "00:00:00.000";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(3, "0")}`;
}
