"use server";

import { db } from "@/db";
import { features, items } from "@/db/schema";
import { insertItemSchema } from "@/db/zod";
import { editFlag } from "@/flags";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { generateSlugsPrompt } from "@/constants/prompts";
import { env } from "@/env";
import { processUrl, processYoutubeUrl } from "@/lib/process-with-ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  headers:
    process.env.NODE_ENV === "production"
      ? {
          "HTTP-Referer": "https://agentc.directory",
          "X-Title": "agentc.directory",
        }
      : undefined,
});

const model = openrouter("google/gemini-2.0-flash-lite-preview-02-05:free");

export async function aiSearch(query: string): Promise<{
  results: (typeof items.$inferSelect)[];
  error?: string;
}> {
  try {
    if (!query || typeof query !== "string") {
      return { error: "Query parameter is required", results: [] };
    }

    // Step 1: Fetch context from "/llms.txt"
    const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/llms.txt`);
    const context = await res.text();

    // Step 2 & 3: Generate list of slugs using the context
    const slugs = await generateSlugsFromQuery(query, context);

    // Step 4: Query the database using the slugs
    let results: (typeof items.$inferSelect)[] = [];

    if (slugs.length > 0) {
      // If we have slugs, query by them
      results = await db.query.items.findMany({
        where: (table, { inArray }) => inArray(table.slug, slugs),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });
    } else {
      // Fallback to basic text search if no slugs were generated
      return {
        results: [],
      };
    }

    return { results };
  } catch (error) {
    console.error("Error in AI search:", error);
    return {
      error: "Failed to process search query",
      results: [],
    };
  }
}

async function generateSlugsFromQuery(
  query: string,
  context: string,
): Promise<string[]> {
  try {
    const { object } = await generateObject({
      model,
      system: generateSlugsPrompt,
      prompt: `User query: "${query}"
      
      Context:
      ${context}
      
      Based on this query and context, return the slugs of the most relevant items.`,
      schema: z.object({
        queryIsTooGeneral: z.boolean(),
        queryIsTooSpecific: z.boolean(),
        queryIsNotSafeForWork: z.boolean(),
        hasRelevantSlugs: z.boolean(),
        slugs: z.array(
          z.object({
            slug: z.string(),
            relevanceScore: z.number(),
            reason: z.string(),
          }),
        ),
      }),
    });

    console.log(JSON.stringify(object, null, 2));

    if (object.queryIsTooGeneral) {
      return [];
    }

    return object.slugs
      .filter((slug) => slug.relevanceScore > 0.6)
      .map((slug) => slug.slug);
  } catch (error) {
    console.error("Error generating slugs:", JSON.stringify(error, null, 2));
    return []; // Return empty array if generation fails
  }
}

export async function updateItem(
  id: number,
  item: z.infer<typeof insertItemSchema>,
) {
  const canEdit = await editFlag();
  if (!canEdit) {
    throw new Error("You are not authorized to edit this item", {
      cause: 403,
    });
  }
  const { slug } = await db.transaction(async (tx) => {
    await tx.update(items).set(item).where(eq(items.id, id));
    await tx.delete(features).where(eq(features.itemId, id));
    const values: (typeof features.$inferInsert)[] = item.features.map(
      (feature) => ({
        ...feature,
        itemId: id,
      }),
    );
    if (values.length > 0) {
      await tx.insert(features).values(values);
    }
    return { slug: item.slug };
  });
  return slug;
}

export async function createItem(item: z.infer<typeof insertItemSchema>) {
  const { slug } = await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(items)
      .values(item)
      .returning({ id: items.id });
    const values: (typeof features.$inferInsert)[] = item.features.map(
      (feature) => ({
        ...feature,
        itemId: id,
      }),
    );
    if (values.length > 0) {
      await tx.insert(features).values(values);
    }
    return { slug: item.slug };
  });
  return slug;
}

export async function autofillItem({
  videoUrl,
  websiteUrl,
}: {
  videoUrl: string | null;
  websiteUrl: string | null;
}) {
  const canEdit = await editFlag();
  if (!canEdit) {
    throw new Error("You are not authorized to edit this item", {
      cause: 403,
    });
  }

  if (!websiteUrl) {
    throw new Error("Website URL is required");
  }

  try {
    const [video, website] = await Promise.all([
      videoUrl
        ? processYoutubeUrl(videoUrl).catch((error) => {
            console.error("Error processing YouTube URL:", error);
            return null;
          })
        : null,
      processUrl(websiteUrl),
    ]);

    return {
      video,
      website,
    };
  } catch (error) {
    console.error("Error in autofillItem:", error);
    throw new Error(
      "Failed to process URLs. Please check the provided URLs and try again.",
    );
  }
}
