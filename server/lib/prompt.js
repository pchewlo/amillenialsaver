export const SYSTEM_PROMPT = `You are a savvy shopping assistant specializing in finding affordable product alternatives ("dupes").
When given a product, identify it precisely, then find 3-4 high-quality affordable alternatives.

IMPORTANT PRICING GUIDELINES:
- Prioritize alternatives that are at least 50% cheaper than the original product.
- Include high street brands, supermarket own-brands, and budget-friendly options (e.g. Aldi, Lidl, Primark, H&M, IKEA, Superdrug, Boots own-brand, etc.) where relevant.
- Still prioritize quality — the dupe should genuinely work well, but it doesn't need to be luxury.
- Order results from cheapest to most expensive.

CONTENT GUIDELINES:
- For each dupe, list 2-3 specific similarities (e.g. shared ingredients, scent profile, texture, design, performance).
- List 1-2 honest differences. Users trust honesty more than hype — be upfront about trade-offs.
- Write a verdict: one confident sentence about who this dupe is best for.
- Calculate savingsPercent as the approximate percentage saved vs the original product's mid-range price.

Always respond with valid JSON matching the schema provided. No markdown, no explanation outside the JSON.`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    originalProduct: {
      type: "object",
      properties: {
        name: { type: "string" },
        estimatedPrice: { type: "string" },
        category: { type: "string" }
      },
      required: ["name", "estimatedPrice", "category"],
      additionalProperties: false
    },
    dupes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          priceRange: { type: "string" },
          similarityScore: { type: "integer" },
          similarities: { type: "array", items: { type: "string" } },
          differences: { type: "array", items: { type: "string" } },
          verdict: { type: "string" },
          savingsPercent: { type: "integer" },
          whereToBuy: { type: "array", items: { type: "string" } },
          imageSearchQuery: { type: "string" }
        },
        required: ["name", "priceRange", "similarityScore", "similarities", "differences", "verdict", "savingsPercent", "whereToBuy", "imageSearchQuery"],
        additionalProperties: false
      }
    }
  },
  required: ["originalProduct", "dupes"],
  additionalProperties: false
};

const SCHEMA_INSTRUCTION = `Return JSON matching this exact schema:
{
  "originalProduct": { "name": string, "estimatedPrice": string, "category": string },
  "dupes": [
    {
      "name": string,
      "priceRange": string,
      "similarityScore": number (0-100),
      "similarities": string[] (2-3 specific points about what makes it similar),
      "differences": string[] (1-2 honest differences or trade-offs),
      "verdict": string (1 sentence — your confidence level and who this dupe is best for),
      "savingsPercent": number (0-100, approximate percentage saved vs original),
      "whereToBuy": string[] (2-4 store names),
      "imageSearchQuery": string (search query to find images of this product)
    }
  ]
}`;

export function buildMessages(type, query, file) {
  if (type === "text") {
    return [{
      role: "user",
      content: `Find affordable dupes for this product: "${query}"\n\n${SCHEMA_INSTRUCTION}`
    }];
  }

  if (type === "url") {
    return [{
      role: "user",
      content: `I found this product at this URL: ${query}\nBased on the URL and your knowledge of this product, find affordable dupes.\n\n${SCHEMA_INSTRUCTION}`
    }];
  }

  if (type === "image" && file) {
    return [{
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: file.mimetype,
            data: file.buffer.toString("base64")
          }
        },
        {
          type: "text",
          text: `Identify this product from the image, then find 3-4 affordable dupes.\n\n${SCHEMA_INSTRUCTION}`
        }
      ]
    }];
  }

  throw new Error("Invalid input type");
}
