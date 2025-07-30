import type { SafeUser } from "@common/schemas/user";

export type AuthContext = {
  isAuthenticated: boolean;
  user: SafeUser | null;
  setUser: (user: SafeUser | null) => void;
};

export const auth: AuthContext = {
  isAuthenticated: false,
  user: null,
  setUser: (user: SafeUser | null) => {
    auth.user = user;
    auth.isAuthenticated = !!user;
  },
};
