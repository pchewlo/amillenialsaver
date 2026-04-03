export default async function handler(req, res) {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + " product")}&tbm=isch&udm=2`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const html = await response.text();

    const matches = html.match(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
    if (matches && matches[1]) {
      const imgResponse = await fetch(matches[1], {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const buffer = Buffer.from(await imgResponse.arrayBuffer());
      const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(buffer);
      return;
    }

    res.status(404).json({ error: "No image found" });
  } catch {
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
