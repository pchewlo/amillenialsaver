import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import dupesRouter from "./routes/dupes.js";
import imageRouter from "./routes/image.js";
import { initClaude } from "./lib/claude.js";

initClaude();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", dupesRouter);
app.use("/api", imageRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
