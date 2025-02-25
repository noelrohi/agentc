import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  // Try YouTube patterns
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // Loom pattern
  const loomMatch = url.match(/loom\.com\/share\/([^&\s]+)/);
  if (loomMatch?.[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  return null;
}
