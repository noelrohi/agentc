"use server";

import { db } from "@/db";
import { features, items } from "@/db/schema";
import { insertItemSchema } from "@/db/zod";
import { editFlag } from "@/flags";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { processUrl, processYoutubeUrl } from "@/lib/process-with-ai";
import { unstable_expireTag as expireTag } from "next/cache";

export async function refreshAgents() {
  expireTag("items");
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
