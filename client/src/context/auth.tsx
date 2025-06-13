import type { User } from "@/types/user";

export type AuthContext = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const auth: AuthContext = {
  isAuthenticated: false,
  user: null,
  setUser: (user: User | null) => {
    auth.user = user;
    auth.isAuthenticated = !!user;
  },
};
