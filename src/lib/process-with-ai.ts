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
    keybenefits: true,
    features: true,
    whoIsItFor: true,
  });

  const extractResult = await firecrawl.extract([url], {
    prompt:
      "Extract information about this AI agent or tool. For pricing model, it should be one of the following: free, paid, or freemium. For the avatar, it should be the url of an icon/favicon/apple icon.",
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
