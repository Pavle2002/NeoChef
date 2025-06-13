import { currentUserQueryOptions } from "@/queries/current-user-query-options";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export type AuthContext = {
  isAuthenticated: boolean;
  user: User | null;
};

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useQuery(currentUserQueryOptions());
  const isAuthenticated = !!user;

  const value = React.useMemo(
    () => ({ isAuthenticated, user: user || null }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
