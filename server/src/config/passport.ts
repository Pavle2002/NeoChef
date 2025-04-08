import passport from "passport";
import { Strategy } from "passport-local";
import { safeAwait } from "@utils/safe-await.js";
import { authService } from "@services/index.js";
import type { User } from "@models/index.js";

const strategty = new Strategy(async (username, password, done) => {
  console.log("authenticate user");
  const [error, user] = await safeAwait(
    authService.authenticateUser(username, password)
  );
  if (error) return done(error);
  if (!user) return done(null, false, { message: "Invalid credentials" });
  return done(null, user);
});

passport.use(strategty);

passport.serializeUser((user, done) => {
  console.log("serialize user");
  done(null, (user as User).id);
});

passport.deserializeUser(async (id, done) => {
  console.log("deserialize user");
  const [error, user] = await safeAwait(authService.getUserById(id as string));
  if (error) return done(error);
  if (!user) return done(null, false);
  return done(null, user);
});

export default passport;
