import passport from "passport";
import { Strategy } from "passport-local";
import { safeAwait } from "@utils/safe-await.js";
import { authService } from "@services/index.js";
import type { User } from "@models/user.js";
import type { LoginInput } from "@app-types/auth-inputs.js";
import { logger } from "@config/index.js";

const strategty = new Strategy(
  { passReqToCallback: true },
  async (req, u, p, done) => {
    const { username, password } = req.validated?.body as LoginInput;

    const [error, user] = await safeAwait(
      authService.authenticateUser(username, password)
    );
    if (error) return done(error, false, { message: "Authentication failed" });
    if (!user) return done(null, false, { message: "Invalid credentials" });
    return done(null, user, { message: "Authentication successful" });
  }
);

passport.use(strategty);

passport.serializeUser((user, done) => {
  logger.info("serialize user");
  done(null, (user as User).id);
});

passport.deserializeUser(async (id, done) => {
  logger.info("deserialize user");
  const [error, user] = await safeAwait(authService.getUserById(id as string));
  if (error) return done(error);
  if (!user) return done(null, false);
  return done(null, user);
});

export default passport;
