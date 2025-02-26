import { aiSearch } from "@/app/actions";
import { Item } from "@/db/schema";
import { useCallback, useState } from "react";

interface UseAiSearchOptions {
  initialItems: Item[];
}

interface UseAiSearchResult {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  results: Item[];
  error: string | null;
  performSearch: (searchQuery: string) => Promise<void>;
}

export function useAiSearch({
  initialItems,
}: UseAiSearchOptions): UseAiSearchResult {
  const [query, setQueryInternal] = useState("");
  const [results, setResults] = useState<Item[]>(initialItems);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(initialItems);
        setIsSearching(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const response = await aiSearch(searchQuery);

        if (response.error) {
          throw new Error(response.error);
        }

        setResults(response.results);
      } catch (err) {
        console.error("AI search error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during search",
        );
        // Fall back to client-side filtering
        const searchLower = searchQuery.toLowerCase();
        const filteredItems = initialItems.filter((item) => {
          return (
            item.name.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.tags?.some((tag: string) =>
              tag.toLowerCase().includes(searchLower),
            ) ||
            item.keybenefits?.some((benefit: string) =>
              benefit.toLowerCase().includes(searchLower),
            ) ||
            item.whoIsItFor?.some((audience: string) =>
              audience.toLowerCase().includes(searchLower),
            )
          );
        });
        setResults(filteredItems);
      } finally {
        setIsSearching(false);
      }
    },
    [initialItems],
  );

  const setQuery = useCallback((newQuery: string) => {
    setQueryInternal(newQuery);
  }, []);

  return {
    query,
    setQuery,
    isSearching,
    results,
    error,
    performSearch,
  };
}
