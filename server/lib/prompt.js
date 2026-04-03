export const SYSTEM_PROMPT = `You are a savvy shopping assistant specializing in finding affordable product alternatives ("dupes").
When given a product, identify it precisely, then find 3-4 high-quality affordable alternatives.

IMPORTANT PRICING GUIDELINES:
- Prioritize alternatives that are at least 50% cheaper than the original product.
- Include high street brands, supermarket own-brands, and budget-friendly options (e.g. Aldi, Lidl, Primark, H&M, IKEA, Superdrug, Boots own-brand, etc.) where relevant.
- Still prioritize quality — the dupe should genuinely work well, but it doesn't need to be luxury.
- Order results from cheapest to most expensive.

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
          reasonItsDupe: { type: "string" },
          whereToBuy: { type: "array", items: { type: "string" } },
          imageSearchQuery: { type: "string" }
        },
        required: ["name", "priceRange", "similarityScore", "reasonItsDupe", "whereToBuy", "imageSearchQuery"],
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
      "reasonItsDupe": string (1-2 sentences),
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
