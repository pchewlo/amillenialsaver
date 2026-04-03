import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA, buildMessages } from "./prompt.js";

let anthropic;

export function initClaude() {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function findDupes(type, query, file) {
  const messages = buildMessages(type, query, file);

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages
  });

  let text = response.content[0].text;
  text = text.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();
  return JSON.parse(text);
}
