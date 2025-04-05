import session from "express-session";
import config from "@config/config.js";
import { RedisStore } from "connect-redis";
import redisClient from "@config/redis.js";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

const sessionConfig = session({
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

export default sessionConfig;
