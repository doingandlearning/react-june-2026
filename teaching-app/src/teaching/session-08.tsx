// Session 8 — Completing the App
// Demo script: module-08-completing-the-app/demo.md
//
// Beats:
//   1 (~2 min)  Show prop drilling problem (sketch in comments, don't code)
//   2 (~5 min)  Build AuthContext — createContext, AuthProvider, useAuth
//   3 (~4 min)  Wire RequireAuth + LoginPage to context — real login flow
//   4 (~4 min)  CSS Modules on ToolCard — import styles, scoped class names in DevTools
//   5 (~2 min)  Feature folder structure — show, describe, don't refactor live
//   6 (~3 min)  Lighthouse run (optional — cut if short on time)
//
// Before starting:
//   • Session 6's routed app should be running (or use Session06Teaching as base)
//   • No new packages needed

import { createContext, useContext, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

// ─── Beat 1 — sketch the prop drilling problem in comments ───────────────────
// App → AppLayout → ToolListPage → ToolCard → DismissButton
// user prop threads through every layer even if only the last uses it

// ─── Beat 2 — build AuthContext here ─────────────────────────────────────────
// Step 1: create the context
// Step 2: write AuthProvider
// Step 3: write and export useAuth (throw if used outside provider)
// Write AuthProvider + useAuth below during Beat 2

// ─── Beat 3 — update RequireAuth and LoginPage to use context ─────────────────
// RequireAuth: const { user } = useAuth(); if (!user) return <Navigate ...>
// LoginPage:   const { login } = useAuth(); login({ id: "1", name: "Test User", ... })
// Demo the full flow: /settings → /login → sign in → /settings

// ─── Beat 4 — CSS Modules on ToolCard ────────────────────────────────────────
// Create ToolCard.module.css alongside ToolCard.tsx
// import styles from "./ToolCard.module.css"
// Inspect the DOM — show scoped class names like ToolCard_card__x3f2k
// Point out: same as Blazor's .razor.css

// ─── Beat 5 — feature folder structure (show, don't move) ────────────────────
// features/tools/  features/auth/  shared/  layouts/
// Rule: deleting a feature = deleting a folder
import type { Tool } from "./mock-api";
// ─── Beat 6 — Lighthouse (optional) ──────────────────────────────────────────
// DevTools → Lighthouse → Accessibility + Best Practices
// Fix one failure live (missing lang="en" is the quickest)
interface ToolCardProps {
  tool?: Tool;
  onDismiss?: () => void;
}


interface ToolListProps {
  tools: Tool[];
  onDismiss: (id: string) => void;
}

export function ToolList({ tools, onDismiss }: ToolListProps) {
  return (
    <ul>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} onDismiss={() => onDismiss(tool.id)} />
      ))}
    </ul>
  );
}

// 1. Create the context
interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 2. Provide the context -> creating a provider component

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setUser({
      name: "Test User", id: "1", email: ""
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  // Can't use useContext(AuthContext) here because App is outside the provider
  return <AuthProvider><AppLayout /></AuthProvider>;          // AppLayout doesn't use user
}

function AppLayout() {
  const { logout } = useContext(AuthContext) as AuthContextValue;  // 3. Consume the context
  return <><button onClick={logout}>Logout</button><ToolListPage /></>;       // ToolListPage doesn't use user
}

function ToolListPage() {
  return <ToolCard />;           // only ToolCard needs it
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


function ToolCard({ tool, onDismiss }: ToolCardProps) {
  // const { user, login, logout } = useContext(AuthContext) as AuthContextValue;  // 3. Consume the context
  const { user, login, logout } = useAuth();  // 3. Consume the context
  return (
    <div>
      <strong>{tool?.name}</strong>
      <span> — {tool?.owner}</span>
      <button onClick={onDismiss} aria-label={`Dismiss ${tool?.name}`}>
        Dismiss
      </button>
      <div>User: {user?.name}</div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}


export function Session08Teaching() {
  return <App />;
}
