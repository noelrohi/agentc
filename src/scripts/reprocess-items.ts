import { db } from "@/db";
import { features, items } from "@/db/schema";
import { processUrl } from "@/lib/process-with-ai";
import { processYoutubeUrl } from "@/lib/process-with-ai";
import { eq } from "drizzle-orm";

/**
 * This script reprocesses existing items with AI
 * It fetches all items, logs them, and then processes each one with AI
 *
 * Usage:
 * 1. Run with: npx tsx src/scripts/reprocess-items.ts
 * 2. Optionally filter by type: npx tsx src/scripts/reprocess-items.ts --type=agent
 * 3. Optionally process a single item: npx tsx src/scripts/reprocess-items.ts --id=123
 * 4. Optionally start from a specific ID: npx tsx src/scripts/reprocess-items.ts --start-id=20
 */

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const typeArg = args.find((arg) => arg.startsWith("--type="));
  const idArg = args.find((arg) => arg.startsWith("--id="));
  const startIdArg = args.find((arg) => arg.startsWith("--start-id="));
  const dryRunArg = args.includes("--dry-run");

  const type = typeArg
    ? (typeArg.split("=")[1] as "agent" | "tool")
    : undefined;
  const id = idArg ? Number.parseInt(idArg.split("=")[1], 10) : undefined;
  const startId = startIdArg
    ? Number.parseInt(startIdArg.split("=")[1], 10)
    : undefined;

  console.log("Starting reprocessing with options:", {
    type,
    id,
    startId,
    dryRun: dryRunArg,
  });

  // Build query based on filters
  const query = db.query.items.findMany({
    where: (item, { eq, and, gte }) =>
      and(
        type ? eq(item.type, type) : undefined,
        id ? eq(item.id, id) : undefined,
        startId ? gte(item.id, startId) : undefined,
      ),
    orderBy: (item, { asc }) => [asc(item.id)],
  });

  // Fetch items
  const allItems = await query;
  console.log(`Found ${allItems.length} items to process`);

  // Process each item
  for (const item of allItems) {
    console.log(`\n----- Processing item: ${item.name} (ID: ${item.id}) -----`);
    console.log(`URL: ${item.href}`);
    console.log(`Video: ${item.demoVideo || "None"}`);

    if (dryRunArg) {
      console.log("Dry run - skipping AI processing");
      continue;
    }

    try {
      // Process with AI
      console.log("Processing with AI...");
      if (!item.href) {
        throw new Error("Item has no href");
      }
      const [websiteResult, videoResult] = await Promise.all([
        processUrl(item.href),
        item.demoVideo ? processYoutubeUrl(item.demoVideo) : null,
      ]);
      const result = {
        website: websiteResult,
        video: videoResult,
      };

      console.log("AI processing complete!");
      console.log(
        "Website data:",
        JSON.stringify(result.website.object.data, null, 2),
      );

      if (result.video) {
        console.log("Video features:", result.video.features.length);
        console.log("Video key benefits:", result.video.keybenefits.length);
        console.log("Video who is it for:", result.video.whoIsItFor.length);
      }

      // Update the item with new AI data
      if (!dryRunArg) {
        const updatedItem = {
          ...item,
          name: result.website.object.data.name,
          description: result.website.object.data.description,
          category: result.website.object.data.category,
          avatar: result.website.object.data.avatar,
          tags:
            result.website.object.data.tags?.map((t) => t.toLowerCase()) || [],
        };

        // Update features if video was processed
        let updatedFeatures: (typeof features.$inferInsert)[] = [];
        if (result.video) {
          updatedFeatures = result.video.features.map((f) => ({
            feature: f.feature,
            description: f.description,
            timestampStart: Math.round(f.timestampStart),
            timestampEnd: Math.round(f.timestampEnd),
            itemId: item.id,
          }));

          updatedItem.keybenefits = result.video.keybenefits;
          updatedItem.whoIsItFor = result.video.whoIsItFor;
        }

        // Update in database
        await db.transaction(async (tx) => {
          await tx.update(items).set(updatedItem).where(eq(items.id, item.id));

          if (updatedFeatures.length > 0) {
            // Delete existing features
            await tx.delete(features).where(eq(features.itemId, item.id));
            // Insert new features
            await tx.insert(features).values(updatedFeatures);
          }
        });

        console.log(`Updated item ${item.id} in database`);
      }
    } catch (error) {
      console.error(`Error processing item ${item.id}:`, error);
    }
  }

  console.log("\nProcessing complete!");
}

// Run the script
main()
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
