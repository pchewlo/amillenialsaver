import { Router } from "express";
import multer from "multer";
import { findDupes } from "../lib/claude.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post("/dupes", upload.single("image"), async (req, res) => {
  try {
    const type = req.body.type;
    const query = req.body.query;
    const file = req.file;

    if (!type || !["text", "url", "image"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Must be text, url, or image." });
    }

    if ((type === "text" || type === "url") && !query) {
      return res.status(400).json({ error: "Query is required for text and url types." });
    }

    if (type === "image" && !file) {
      return res.status(400).json({ error: "Image file is required for image type." });
    }

    const result = await findDupes(type, query, file);
    res.json(result);
  } catch (err) {
    console.error("Error finding dupes:", err);

    const apiMessage = err.error?.error?.message;

    if (err.status === 400 && apiMessage) {
      return res.status(400).json({ error: apiMessage });
    }
    if (err.status === 401) {
      return res.status(401).json({ error: "Invalid API key. Check your ANTHROPIC_API_KEY in .env." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
    }

    res.status(500).json({ error: apiMessage || "Something went wrong. Please try again." });
  }
});

export default router;
