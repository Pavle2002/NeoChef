import express from "express";
import config from "@config/config.js";
import sessionConfig from "@config/session.js";
import corsConfig from "@config/cors.js";

const app = express();
const port = config.port;

app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

app.get("/", (req, res) => {
  console.log("Session ID:", req.session.id);
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
