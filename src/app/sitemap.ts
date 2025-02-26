import { getItems } from "@/data";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all items
  const items = await getItems("all");

  // Create sitemap entries for each item
  const itemEntries = items.map((item) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/a/${item.slug}`,
    lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: item.isNew ? 1 : 0.8,
  }));

  // Add static routes
  const routes = [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Add other important static routes here
  ];

  return [...routes, ...itemEntries];
}
