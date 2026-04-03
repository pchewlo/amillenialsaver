import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a savvy shopping assistant specializing in finding affordable product alternatives ("dupes").
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, query } = req.body;

    if (!type || !["text", "url"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Must be text or url." });
    }

    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    let userContent;
    if (type === "text") {
      userContent = `Find affordable dupes for this product: "${query}"\n\n${SCHEMA_INSTRUCTION}`;
    } else {
      userContent = `I found this product at this URL: ${query}\nBased on the URL and your knowledge of this product, find affordable dupes.\n\n${SCHEMA_INSTRUCTION}`;
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }]
    });

    let text = response.content[0].text;
    text = text.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();
    const result = JSON.parse(text);

    res.json(result);
  } catch (err) {
    console.error("Error finding dupes:", err);
    const apiMessage = err.error?.error?.message;

    if (err.status === 400 && apiMessage) {
      return res.status(400).json({ error: apiMessage });
    }
    if (err.status === 401) {
      return res.status(401).json({ error: "Invalid API key." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again." });
    }

    res.status(500).json({ error: apiMessage || "Something went wrong. Please try again." });
  }
}
