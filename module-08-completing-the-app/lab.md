# Session 8 Lab — Completing the App (Capstone — Sessions 5–8)

## Overview

This is the capstone for everything from Sessions 5–8. You're assembling it into a complete, production-shaped ToolDirectory — authenticated, routed, data-fetching, form-capable, and styled with scoped CSS.

That's a lot of moving parts. You don't need to finish all of it in this session.

**Core (Tasks 1–5)** gets authentication working end to end — this is the conceptual payoff of the session (context replacing prop drilling) and the part worth protecting time for.

**If time allows (Tasks 6–8)** adds the styling and the Lighthouse pass. If you're still on Task 4 when the session is wrapping up, stop there — these tasks pick up cleanly at the start of the next session, nothing is lost by deferring them.

---

## Setup

Your starter files are already in `src/labs/session-08/` in the feature folder structure:

```
src/labs/session-08/
  features/
    tools/          ← ToolCard, ToolList, FilterBar, ResultCount,
                       useTools, useToolById, ToolListPage,
                       ToolDetailPage, AddToolPage
    auth/           ← AuthContext (stub), RequireAuth, LoginPage
  shared/           ← Panel
  layouts/          ← AppLayout
  mock-api.ts
  Session08Lab.tsx
```

In `student-app/src/App.tsx`, switch to Session 08:

```tsx
import { Session08Lab as ActiveLab } from './labs/session-08/Session08Lab'
```

**The app will not compile yet** — the files were moved from Session 07's flat structure, so import paths need fixing. That's Task 1.

---

## Your Tasks

---

## Core

### Task 1 — Fix import paths after the reorganisation

The files in `features/tools/` still have import paths written for the old flat structure. Update them to match the new locations.

For a file in `features/tools/`, the mock-api is now two levels up:

```ts
// before
import { Tool } from "../mock-api";

// after
import { Tool } from "../../mock-api";
```

Work through each file in `features/tools/` and `features/auth/` and fix every broken import. `Session08Lab.tsx` also needs its imports updated to match the feature folder paths.

Run `npx tsc --noEmit` to check — aim for zero errors before continuing.

**Outcome:** the app compiles and runs. Behaviour is identical to Session 07.

---

### Task 2 — Build AuthContext

Open `features/auth/AuthContext.tsx`.

The file has placeholder exports that let it compile. Replace them with the real implementation.

Define a `User` interface with `id`, `name`, and `email` as strings.

Define an `AuthContextValue` interface with `user: User | null`, `login: (user: User) => void`, and `logout: () => void`.

Create the context with `createContext<AuthContextValue | null>(null)`.

Write `AuthProvider` — it holds `user` state and provides `login` (sets user) and `logout` (sets user to null) via the context value.

Write and export `useAuth` — reads the context and throws a clear error if called outside `AuthProvider`.

Wrap `Session08Lab` in `AuthProvider` (outside `BrowserRouter`).

**Outcome:** `useAuth()` is callable anywhere in the tree and returns the current user plus login/logout.

---

### Task 3 — Update RequireAuth to use context

Open `features/auth/RequireAuth.tsx`.

Remove the `IS_AUTHENTICATED` constant. Call `useAuth()` instead and read `user` from it.

**Outcome:** visiting `/settings` unauthenticated redirects to `/login`. Once logged in (Task 4), it renders.

---

### Task 4 — Build a working login page

Open `features/auth/LoginPage.tsx`.

Call `login` from `useAuth` when the user clicks "Sign in". Use a hardcoded user object:

```ts
{ id: "1", name: "Test User", email: "test@tools.internal" }
```

After login, navigate to the route the user was trying to reach — read it from `useLocation().state?.from` — or fall back to `/`.

**Outcome:** visiting `/settings` unauthenticated redirects to `/login`. Clicking "Sign in" logs in and returns to `/settings`. The nav can now show the user's name (Task 5).

---

### Task 5 — Add a UserBadge to the layout

Create a `UserBadge` component in `features/auth/`. It calls `useAuth()`, renders nothing if there's no user, and renders the user's name and a "Sign out" button if there is one. The button calls `logout()`.

Add `UserBadge` to `layouts/AppLayout.tsx` in the nav, on the opposite side from the nav links.

**Outcome:** after signing in, the nav shows the user's name. Clicking "Sign out" clears the session and protected routes redirect again.

---

**Checkpoint.** If auth is working end to end — protected route redirects, sign in, nav badge, sign out — the core of this session is done. Everything below is styling and a tooling pass. Take a short break here if you want one before switching gears.

---

## If time allows

### Task 6 — CSS Modules for ToolCard

Create `features/tools/ToolCard.module.css` alongside `ToolCard.tsx`.

Move all styling out of inline styles or global classes and into the module. At minimum, style the card container, the tool name, and the status badge. The badge colour should differ for `active` and `deprecated` — use a dynamic class key:

```tsx
className={`${styles.badge} ${styles[tool.status]}`}
```

**Outcome:** `ToolCard` uses only CSS Module classes. Inspecting the DOM shows scoped class names like `ToolCard_card__x3f2`. No global CSS needed for this component.

---

### Task 7 — CSS Modules for AppLayout

Create `layouts/AppLayout.module.css`.

Style the nav bar (horizontal, across the top), the main content area below it, and the active `NavLink` state. `NavLink` adds an `active` class automatically — you can target it in the module or use the `isActive` callback pattern.

**Outcome:** the app has a styled nav bar with a visually distinct active link. Layout holds up across all pages.

---

### Task 8 — Run a Lighthouse audit

With the app running in development, open Chrome DevTools → Lighthouse. Run an audit on Accessibility and Best Practices.

Fix every **failure** (red items). Common ones:
- Missing `lang="en"` on `<html>` in `index.html`
- Form inputs without labels
- Buttons with no accessible name

Document any **warnings** you chose not to fix and why.

**Outcome:** zero Lighthouse accessibility failures.

---

## Extension

**A — Dismiss persistence via context**

Move `dismissed` IDs into a `DismissedContext` alongside `AuthContext` so dismissed state persists across route changes and is shared between the list and detail pages.

**B — Optimistic UI on add**

When the user submits the add-tool form, add the new tool to the list immediately (before the API call resolves) with a visual loading indicator. If the call fails, remove the optimistic entry and show an error.

**C — Edit tool**

Add an `/tools/:id/edit` route that pre-populates the `AddToolPage` form with the existing tool's data. The form component should handle both create and edit based on whether an initial value is passed as a prop.
