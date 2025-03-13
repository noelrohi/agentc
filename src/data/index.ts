import { db } from "@/db";
import { Item, ItemWithFeatures } from "@/db/schema";

type ItemType = "agent" | "tool" | "all";

export async function getItems(type: ItemType): Promise<Item[]> {
  const result = await db.query.items.findMany({
    where: (table, { eq }) =>
      type !== "all" ? eq(table.type, type) : undefined,
    orderBy: (table, { desc }) => [desc(table.isNew), desc(table.createdAt)],
  });
  return result;
}

export async function getItem(
  id: number,
): Promise<ItemWithFeatures | undefined> {
  const item = await db.query.items.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: {
      features: true,
    },
  });

  return item;
}

/**
 * Get an item by its slug
 */
export async function getItemBySlug(
  slug: string,
): Promise<ItemWithFeatures | undefined> {
  const item = await db.query.items.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
    with: {
      features: true,
    },
  });

  return item;
}
