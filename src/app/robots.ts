import type { MetadataRoute } from "next";

/**
 * This function generates a robots.txt file for the website.
 *
 * It defines rules for search engine crawlers:
 * - Allows all user agents to access the entire site
 * - Includes specific rules for PerplexityBot and Perplexity-User
 * - Specifies the location of the sitemap at "https://agentc.directory/sitemap.xml"
 *
 * Next.js uses this function to automatically generate a robots.txt file
 * at build time, which helps search engines understand which parts of the
 * site they should crawl and index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://agentc.directory/sitemap.xml",
  };
}
