import http from "node:http";
import { pipeline } from "@huggingface/transformers";

console.log("Loading embedding model...");
const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2",
  { dtype: "q8" },
);
console.log("Model loaded successfully");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Health check OK" }));
  } else if (req.method === "POST" && req.url === "/embed") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { text } = JSON.parse(body);
        const result = await extractor(text, {
          pooling: "mean",
          normalize: true,
        });
        const embedding = Array.from(result.data);
        console.log("Generated embedding for:", text);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ embedding }));
      } catch (error) {
        console.error("Error processing embedding request:", error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal error" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(4000, () => {
  console.log("Embedding service is running on port 4000");
});
