"use client";

import { refreshAgents } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Item } from "@/db/schema";
import { InfoIcon, RefreshCcw, Search } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function ItemListPage({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      // Search in name
      item.name.toLowerCase().includes(searchLower) ||
      // Search in description
      item.description.toLowerCase().includes(searchLower) ||
      // Search in tags
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex gap-4 items-center">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, tags..."
            className="pl-10 min-w-96"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={() =>
            startTransition(async () => {
              await refreshAgents();
            })
          }
          className="size-7"
          variant="outline"
          disabled={isPending}
          size="icon"
        >
          <RefreshCcw className="size-4" />
        </Button>
      </div>
      {filteredItems.length === 0 && search && (
        <p className="text-sm flex items-center gap-2">
          <InfoIcon className="size-5 inline-block text-orange-500" />
          No results found for "{search}".
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
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
                      <AvatarImage src={item.avatar ?? ""} alt={item.name} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="flex items-center gap-2 font-semibold tracking-tight">
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isNew && <Badge variant="secondary">New</Badge>}
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
