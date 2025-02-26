import { categories } from "@/constants/categories";
import { autoFillSystemPrompt, formattingPrompt } from "@/constants/prompts";
import { insertItemSchema } from "@/db/zod";
import FirecrawlApp from "@mendable/firecrawl-js";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { LanguageModel, generateObject, generateText } from "ai";
import "server-only";
import { YoutubeTranscript } from "youtube-transcript";
import { z } from "zod";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const defaultModel = openrouter("google/gemini-2.0-flash-001");

export async function processUrl(url: string) {
  // Use the same schema from the original code
  const dataSchema = insertItemSchema.omit({
    features: true,
  });

  const extractResult = await firecrawl.extract([url], {
    prompt: `Extract comprehensive information about this AI agent or tool.
    
    PRICING MODEL:
    - "free": No paid features at all, completely free to use
    - "freemium": Core features available for free, but has premium paid features
    - "paid": No free features (may have free trial), all functionality requires payment
    
    AVATAR:
    - Extract the URL of the icon/favicon/apple-touch-icon that best represents the tool
    
    CATEGORY:
    - Must be exactly one of: ${categories.join(", ")}
    - Choose the most appropriate category based on the tool's primary function
    
    TAGS:
    - Identify 3-5 specific, relevant tags that accurately describe the tool's capabilities
    - Focus on use cases, technologies, and target industries
    
    NAME & DESCRIPTION:
    - Extract the official name of the tool
    - Provide a clear, concise description (1-2 sentences) that explains what the tool does
    
    Analyze the website thoroughly to ensure accuracy in all extracted information.`,
    schema: dataSchema,
  });

  if (!extractResult.success) {
    throw new Error("Failed to extract data from URL");
  }

  // Return in a format compatible with the existing code
  return {
    text: JSON.stringify(extractResult.data),
    reasoning: "Data extracted directly using Firecrawl extract method",
    object: {
      isValid: true,
      data: extractResult.data,
    },
  };
}

export async function processYoutubeUrl(
  url: string,
  model: LanguageModel = defaultModel,
) {
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  console.log({ transcript });
  const { object } = await generateObject({
    model,
    schema: z.object({
      features: z.array(
        z.object({
          feature: z.string(),
          description: z.string(),
          timestampStart: z.number(),
          timestampEnd: z.number(),
        }),
      ),
      keybenefits: z.array(z.string()),
      whoIsItFor: z.array(z.string()),
    }),
    system: autoFillSystemPrompt,
    prompt: `Video URL: ${url}
    Transcript: ${transcript
      .map(
        (t) =>
          `--- Text: ${t.text} \n Offset: ${t.offset} \n Duration: ${t.duration} ---`,
      )
      .join("\n")
      .slice(0, 6000)}`,
  });

  return object;
}
