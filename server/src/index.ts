import express, { type Request, type Response } from "express";
import config from "@config/config.js";
import sessionConfig from "@config/session.js";
import corsConfig from "@config/cors.js";
import passport from "@config/passport.js";
import { AuthService } from "@services/auth-service.js";
import { UserRepository } from "@repositories/user-repository.js";
import type { UserInput } from "@models/user.js";

const app = express();
const port = config.port;

app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log("Session ID:", req.session.id);
  res.send("Hello, World!");
});

//----Testing the session and passport authentication----

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
// Login route
app.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response) => {
    res.status(200).send({ message: "Login successful", user: req.user });
  }
);

// Register route
app.post("/register", async (req: Request, res: Response): Promise<void> => {
  const user = await authService.registerUser(req.body as UserInput);
  res.status(201).send({ message: "User registered successfully", user });
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
