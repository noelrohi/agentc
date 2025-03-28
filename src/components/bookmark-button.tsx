"use client";

import { Button } from "@/components/ui/button";
import { BOOKMARKS_KEY } from "@/constants";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

interface BookmarkItem {
  id: string;
  name: string;
  description: string;
  href: string;
  type: "agent" | "tool";
  avatar?: string;
}

interface BookmarkButtonProps {
  item: BookmarkItem;
}

export function BookmarkButton({ item }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    setIsBookmarked(bookmarks.some((bookmark: BookmarkItem) => bookmark.id === item.id));
  }, [item.id]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmark: BookmarkItem) => bookmark.id !== item.id);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(item);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="icon"
      onClick={toggleBookmark}
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <Bookmark className="h-4 w-4" />
    </Button>
  );
}
