# Session 8 — Live Coding Demo Script

## Before you start

- `src/teaching/session-8.tsx` — write everything here
- Start from the Session 7 finished state — routed app, add-tool form, DOMPurify
- This session adds context and CSS Modules — no new packages needed beyond what's already installed

---

## Beat 1 — Show the prop drilling problem (2 min)

Open the current `RequireAuth` component. Point at how auth is currently handled — a hardcoded boolean.

> "Every component that needs to know who's logged in has to be told. Right now we're faking it with a constant. What happens when we have a real user object — name, email, role — and three components all need it?"

Sketch the prop chain briefly on a whiteboard or in comments — don't code it:

```tsx
// App passes user → AppLayout passes user → nav uses user
// If we add a field to User, we update three files
```

> "Context lets us put the user at the top and have any component reach it directly. Let's build it."

---

## Beat 2 — Build AuthContext (5 min)

Create `src/teaching/AuthContext.tsx`:

```tsx
import { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{
      user,
      login: (u) => setUser(u),
      logout: () => setUser(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
```

Walk through the three steps as you write — create, provide, consume.

Wrap `Session8App` in `AuthProvider` in `main.tsx` (or at the root of the session teaching component).

---

## Beat 3 — Wire up RequireAuth and a login button (4 min)

Update `RequireAuth` to use the context:

```tsx
import { useAuth } from "./AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
```

Add a minimal login page that actually logs in — no real auth, just sets a user:

```tsx
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  function handleLogin() {
    login({ id: "1", name: "Test User", email: "test@example.com" });
    navigate(from, { replace: true });
  }

  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={handleLogin}>Sign in as Test User</button>
    </div>
  );
}
```

Add a `UserBadge` to the layout that shows the user's name and a logout button:

```tsx
function UserBadge() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div>
      <span>{user.name}</span>
      <button onClick={logout}>Sign out</button>
    </div>
  );
}
```

Demo the flow — visit `/settings`, get redirected to `/login`, sign in, land on `/settings`. Sign out, try again, redirected.

Ask — *"Where does `UserBadge` get the user from?"* — `useAuth()`. No prop. No parent passed it down.

---

## Beat 4 — CSS Modules on ToolCard (4 min)

Open the current `ToolCard` — styles are inline or global. Point out the problem:

> "If another component uses `.title`, one of them loses. Let's scope it."

Create `ToolCard.module.css` alongside `ToolCard.tsx`:

```css
.card {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.name {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.meta {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.active     { background: #dcfce7; color: #15803d; }
.deprecated { background: #fee2e2; color: #b91c1c; }
```

Update `ToolCard.tsx`:

```tsx
import styles from "./ToolCard.module.css";

function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div className={styles.card}>
      <div>
        <p className={styles.name}>{tool.name}</p>
        <p className={styles.meta}>{tool.owner}</p>
      </div>
      <span className={`${styles.badge} ${styles[tool.status]}`}>
        {tool.status}
      </span>
    </div>
  );
}
```

Open the browser DevTools and inspect the rendered class name — show it's been transformed to something like `ToolCard_card__x3f2`. No other component can accidentally collide with that.

Ask — *"Where have you seen this pattern before?"* — `.razor.css` in Blazor. Same idea, Vite does the scoping at build time.

---

## Beat 5 — Show feature folder structure (2 min)

Don't refactor — just show and describe. Open the file explorer:

> "Right now everything is in one folder. On a real project you'd group by feature — all the tool-related files together, all the auth files together. The rule is simple: if deleting a feature means deleting a folder, the structure is right."

Show the target structure verbally or as a comment block — no need to move files live.

---

## Beat 6 — Quick Lighthouse run (3 min, optional — cut if short on time)

Open Chrome DevTools on the running app — Lighthouse tab. Run an audit (Accessibility + Best Practices, Mobile or Desktop).

Read one failure out loud. Fix it live if it's quick (missing `lang` attribute on `<html>`, an unlabelled button).

> "This is your baseline. The lab includes a Lighthouse task — run it on your finished app and fix at least one issue it surfaces. We go deeper into accessibility later today."

---

## Handover to the lab

> "This capstone lab is the whole app assembled — auth context, CSS Modules, full CRUD with routing and a form. Everything from Sessions 5 through 8. You have all the pieces. The lab puts them together."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Show the prop drilling problem | 2 min |
| 2 | Build AuthContext | 5 min |
| 3 | Wire up RequireAuth and login flow | 4 min |
| 4 | CSS Modules on ToolCard | 4 min |
| 5 | Feature folder structure | 2 min |
| 6 | Lighthouse run (optional) | 3 min |
| — | Lab handover | 1 min |
| **Total** | | **~21 min (18 without Lighthouse)** |
