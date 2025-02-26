"use client";

import { refreshAgents } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Item } from "@/db/schema";
import { useAiSearch } from "@/hooks/use-ai-search";
import { InfoIcon, RefreshCcw, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SEARCH_EXAMPLES = [
  "free writing tools",
  "new productivity agents",
  "tools for content creation",
  "freemium agents with video demos",
];

export function ItemListPage({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();

  const {
    query,
    setQuery,
    isSearching,
    results: filteredItems,
    error,
    performSearch,
  } = useAiSearch({
    initialItems: items,
  });

  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query);
    }
  };

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search using natural language..."
              className="pl-10 pr-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">AI-powered search</p>
                  <p className="text-xs text-muted-foreground">
                    Try queries like "free tools for writing" or "new
                    productivity agents"
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="gap-2 whitespace-nowrap"
            size="default"
          >
            {isSearching ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </Button>
          <Button
            onClick={() =>
              startTransition(async () => {
                await refreshAgents();
              })
            }
            className="size-9"
            variant="outline"
            disabled={isPending}
            size="icon"
            title="Refresh agents"
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>

        {!query && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">
              Try searching for:
            </span>
            {SEARCH_EXAMPLES.map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setQuery(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm flex items-center gap-2 text-destructive">
          <InfoIcon className="size-5 inline-block" />
          {error}
        </p>
      )}

      {filteredItems.length === 0 && query && !isSearching && (
        <p className="text-sm flex items-center gap-2">
          <InfoIcon className="size-5 inline-block text-orange-500" />
          No results found for "{query}".
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isSearching
          ? // Skeleton loaders while searching
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg border p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          : // Actual results
            filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`a/${item.slug}`}
                className="group relative rounded-lg border p-6 hover:bg-muted/50"
              >
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2 flex-grow">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={item.avatar ?? ""}
                            alt={item.name}
                          />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="flex items-center gap-2 font-semibold tracking-tight">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isNew && <Badge variant="secondary">New</Badge>}
                        {item.pricingModel === "free" && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            Free
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </main>
  );
}
