import express from "express";
import config from "./config.js";

const app = express();
const PORT = config.port;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
