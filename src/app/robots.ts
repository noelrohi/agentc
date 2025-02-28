import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "PerplexityBot",
      },
      {
        userAgent: "Perplexity-User",
      },
      {
        userAgent: "*",
      },
    ],
    host: "https://agentc.directory",
    sitemap: "https://agentc.directory/sitemap.xml",
  };
}
