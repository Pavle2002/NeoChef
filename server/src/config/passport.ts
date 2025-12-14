import passport from "passport";
import { Strategy } from "passport-local";
import { safeAwait } from "@utils/safe-await.js";
import { authService, userService } from "@services/index.js";
import type { UserCredentials } from "@common/schemas/user.js";
import { logger } from "@config/index.js";
import { NotFoundError } from "@errors/not-found-error.js";
import type { User } from "@common/schemas/user.js";

const strategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, e, p, done) => {
    const { email, password } = req.validated?.body as UserCredentials;

    const [error, user] = await safeAwait(
      authService.authenticateUser(email, password)
    );
    if (error) return done(error, false, { message: "Authentication failed" });
    if (!user) return done(null, false, { message: "Invalid credentials" });
    return done(null, user, { message: "Authentication successful" });
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id, done) => {
  const [error, user] = await safeAwait(userService.getById(id as string));
  if (error instanceof NotFoundError) return done(null, false);
  if (error) return done(error);
  return done(null, user);
});

export default passport;
