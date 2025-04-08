import express, { type Request, type Response } from "express";
import { config, sessionConfig, corsConfig, passport } from "@config/index.js";
import { authRoutes } from "@routes/index.js";

const app = express();
const port = config.port;

app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("Session ID:", req.session.id);
  res.send("Hello, World!");
});

// Protected route
app.get("/profile", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send({ message: "You are authenticated", user: req.user });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
