import { createContext, useContext, useState } from "react";

// TODO Task 2 — define the User interface (id, name, email — all strings)

// TODO Task 2 — define AuthContextValue interface
// { user: User | null, login: (user: User) => void, logout: () => void }

// TODO Task 2 — create the context with createContext<AuthContextValue | null>(null)
// const AuthContext = ...

// TODO Task 2 — write AuthProvider
// Holds user state, provides login (setUser) and logout (setUser null) via context

// TODO Task 2 — write and export useAuth()
// Reads context, throws a clear error if called outside AuthProvider

// Placeholder exports so the file compiles while tasks are in progress:
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  return {
    user: null as null | { id: string; name: string; email: string },
    login: (_user: { id: string; name: string; email: string }) => {},
    logout: () => {},
  };
}
