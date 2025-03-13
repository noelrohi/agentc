"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Item } from "@/db/schema";
import { useAiSearch } from "@/hooks/use-ai-search";
import { cn } from "@/lib/utils";
import { InfoIcon, RefreshCcw, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo, useTransition } from "react";

const SEARCH_EXAMPLES = [
  "agents or tools that automates testing",
  "for writing",
  "tools for creating videos",
  "free tools or agents",
];

export function ItemListPage({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAiEnabled, setIsAiEnabled] = useQueryState(
    "aiSearch",
    parseAsBoolean
      .withOptions({
        clearOnDefault: true,
      })
      .withDefault(false),
  );
  const router = useRouter();

  const {
    query,
    setQuery,
    isSearching,
    results: aiFilteredItems,
    error,
    performSearch,
  } = useAiSearch({
    initialItems: items,
  });

  const regularFilteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const searchTerm = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
  }, [items, query]);

  const filteredItems = isAiEnabled ? aiFilteredItems : regularFilteredItems;

  const handleSearch = () => {
    if (!query.trim()) return;
    if (isAiEnabled) {
      performSearch(query);
    }
    // Regular search is handled automatically through the useMemo hook
  };

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                isAiEnabled ? "Search using natural language..." : "Search..."
              }
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7",
                      isAiEnabled && "text-purple-500",
                    )}
                    onClick={() => setIsAiEnabled(!isAiEnabled)}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-semibold">
                    AI search is {isAiEnabled ? "enabled" : "disabled"}
                  </p>
                  <p className="text-xs">
                    {isAiEnabled
                      ? "Using AI to understand natural language queries"
                      : "Using basic keyword search"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <AnimatePresence>
            {isAiEnabled && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={handleSearch}
                  disabled={(isAiEnabled && isSearching) || !query.trim()}
                  className="gap-2 whitespace-nowrap"
                  size="default"
                >
                  {isAiEnabled && isSearching ? (
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
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={() =>
              startTransition(() => {
                router.refresh();
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

        {!query && isAiEnabled && (
          <AnimatePresence>
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm text-muted-foreground">
                Try searching for:
              </span>
              {SEARCH_EXAMPLES.map((example, index) => (
                <motion.div
                  key={example}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setQuery(example)}
                  >
                    {example}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
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
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </main>
  );
}
