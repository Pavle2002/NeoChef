import session from "express-session";
import { RedisStore } from "connect-redis";
import { redisClient } from "./redis.js";
import { config } from "./config.js";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

export const sessionConfig = session({
  name: "neochef.sid",
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Refresh the session on each request
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: config.env === "production", // Use secure cookies in production
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: "lax", // Prevent CSRF attacks
  },
  store: redisStore,
});
