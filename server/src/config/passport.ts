import passport from "passport";
import { Strategy } from "passport-local";
import { AuthService } from "@services/auth-service.js";
import { UserRepository } from "@repositories/user-repository.js";
import { safeAwait } from "@utils/safe-await.js";
import type { User } from "@models/user.js";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const strategty = new Strategy(async (username, password, done) => {
  const [error, user] = await safeAwait(
    authService.authenticateUser(username, password)
  );
  if (error) return done(error);
  if (!user) return done(null, false, { message: "Invalid credentials" });
  return done(null, user);
});

passport.use(strategty);

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id, done) => {
  const [error, user] = await safeAwait(authService.getUserById(id as string));
  if (error) return done(error);
  if (!user) return done(null, false);
  return done(null, user);
});

export default passport;
