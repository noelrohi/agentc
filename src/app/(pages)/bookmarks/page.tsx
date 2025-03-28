"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BOOKMARKS_KEY } from "@/constants";
import { Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookmarkItem {
  id: string;
  name: string;
  description: string;
  href: string;
  type: "agent" | "tool";
  avatar?: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    setBookmarks(storedBookmarks);
  }, []);

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const clearAllBookmarks = () => {
    localStorage.setItem(BOOKMARKS_KEY, "[]");
    setBookmarks([]);
  };

  return (
    <main className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-lg text-muted-foreground">Your saved agents and tools</p>
        </div>
        {bookmarks.length > 0 && (
          <Button
            variant="destructive"
            onClick={clearAllBookmarks}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No bookmarks yet</h2>
          <p className="text-muted-foreground mt-2">
            Start adding bookmarks by clicking the bookmark icon on any agent or tool page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardHeader className="flex flex-row items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={bookmark.avatar} alt={bookmark.name} />
                  <AvatarFallback>{bookmark.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="flex items-center justify-between">
                    <Link href={`/a/${bookmark.id}`} className="hover:underline">
                      {bookmark.name}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bookmark.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="capitalize">{bookmark.type}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{bookmark.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
