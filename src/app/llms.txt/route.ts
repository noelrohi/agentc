import { db } from "@/db";

export async function GET() {
  const result = await db.query.items.findMany({
    orderBy: (table, { desc }) => [desc(table.isNew), desc(table.createdAt)],
  });

  const data = result
    .map((item) => {
      return `
# ${item.name}

## Slug
${item.slug}

## Description
${item.description}

## Details
- **Type**: ${item.type}
- **Category**: ${item.category}
- **URL**: ${item.href}
${item.demoVideo ? `- **Demo Video**: ${item.demoVideo}` : ""}
${item.isNew ? "- **NEW!**" : ""}
- **Pricing Model**: ${item.pricingModel || "Not specified"}

## Tags
${
  item.tags && item.tags.length > 0
    ? item.tags.map((tag) => `- ${tag}`).join("\n")
    : "No tags available"
}

## Key Benefits
${
  item.keybenefits && item.keybenefits.length > 0
    ? item.keybenefits.map((benefit) => `- ${benefit}`).join("\n")
    : "No key benefits listed"
}

## Who Is It For
${
  item.whoIsItFor && item.whoIsItFor.length > 0
    ? item.whoIsItFor.map((target) => `- ${target}`).join("\n")
    : "No target audience specified"
}

---
`;
    })
    .join("\n");

  return new Response(data, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
