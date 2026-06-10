---
title: "Session 8 — Completing the App"
sub_title: React for .NET/Blazor Developers — Day 2
author: Kevin Cunningham
---

## Opening scenario

The ToolDirectory now has routing, data fetching, and a form. Two problems remain.

First — the `RequireAuth` guard hardcodes a boolean to decide if the user is logged in. Every component that needs the current user has to receive it as a prop.

Second — all styles are inline or global. Two components accidentally share a class name and one breaks the other.

**Type in chat — which of these has a parallel in Blazor, and how did Blazor solve it?**

<!--
speaker_note: |
  Both have direct Blazor analogues. CascadingAuthenticationState and
  AuthorizeView solve the auth problem — state flows down the tree without
  prop drilling. The .razor.css model solves the naming collision — styles
  are scoped to the component file. This session introduces both React
  equivalents. The Blazor comparison is the hook — use it to open the discussion.
-->

<!-- end_slide -->

## The prop drilling problem

Passing data through every layer of the tree just to reach a component deep inside.

```tsx
// App → AppLayout → ToolListPage → ToolCard → DismissButton
// ...every component passes user down even if it doesn't use it

function App() {
  const [user, setUser] = useState<User | null>(null);
  return <AppLayout user={user} />;          // AppLayout doesn't use user
}

function AppLayout({ user }: { user: User | null }) {
  return <ToolListPage user={user} />;       // ToolListPage doesn't use user
}

function ToolListPage({ user }: { user: User | null }) {
  return <ToolCard user={user} />;           // only ToolCard needs it
}
```

<!-- pause -->

Every intermediate component carries a prop it doesn't care about. Adding a field to `User` means updating every interface in the chain.

<!--
speaker_note: |
  This is the exact problem CascadingParameter solves in Blazor — you put the
  value at the top and any descendant can declare it without every intermediate
  component passing it down. React's answer is useContext. Same model, different
  syntax.
-->

<!-- end_slide -->

## useContext — sharing state without prop drilling

Context makes a value available to any component in the tree, at any depth.

```tsx
import { createContext, useContext, useState } from "react";

// 1. Create the context
interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 2. Provide it near the root
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

// 3. Consume it anywhere in the tree
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

<!--
speaker_note: |
  The three steps are the complete pattern — create, provide, consume. Worth
  writing them as a checklist on a physical whiteboard if the room has one.
  The null check in useAuth is defensive — it catches the mistake of using the
  hook outside the provider early, with a clear error message rather than a
  confusing undefined crash.
-->

<!-- end_slide -->

## Using AuthContext in the tree

With the context in place, `RequireAuth` and any consumer can drop the prop.

```tsx
// main.tsx — wrap the whole app
<AuthProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</AuthProvider>

// RequireAuth — reads from context, no prop needed
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// Any component — same
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

<!-- pause -->

No props changed. `UserBadge` can sit anywhere in the tree and still reach the user.

<!--
speaker_note: |
  Point out that AppLayout, ToolListPage, and every intermediate component
  no longer carry the user prop. They don't know it exists. Only the components
  that actually need it call useAuth. This is the key benefit — adding a field
  to User no longer requires touching every layer.
  Context is not a replacement for all prop passing — it's for values that are
  genuinely global or shared across many layers. For values that flow naturally
  from parent to direct child, props are still the right choice.
-->

<!-- end_slide -->

## When not to reach for context

Context solves prop drilling. It is not a general-purpose state management tool.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Good uses for context**

<!-- incremental_lists: true -->

- Auth state — current user, login/logout
- Theme — light/dark mode preference
- Locale — language and formatting
- Feature flags — available app-wide

<!-- incremental_lists: false -->

These are values that are genuinely global, change infrequently, and are needed by many unrelated components.

<!-- column: 1 -->

<!-- pause -->

**Poor uses for context**

<!-- incremental_lists: true -->

- A list of tools that only one page needs
- Form state shared between two sibling components
- Data that fetches and changes frequently

<!-- incremental_lists: false -->

These cause every consumer to re-render whenever the value changes. For frequently-changing or locally-scoped data, lift state or use a dedicated hook instead.

<!-- reset_layout -->

<!--
speaker_note: |
  The performance point is worth naming — every component that calls useContext
  re-renders when the context value changes. For auth state that's fine, it
  rarely changes. For a list of tools that updates on every keystroke, it would
  cause unnecessary renders across the whole tree. Day 3 covers Zustand and
  TanStack Query for cases where context starts to feel painful.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

CSS Modules
===

<!-- end_slide -->

## The naming collision problem

Global CSS classes clash. The bigger the app, the more likely two components use the same name.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Global styles — fragile**

```css
/* global.css */
.card { border: 1px solid #ccc; }
.title { font-weight: bold; }
```

```css
/* some other file, weeks later */
.title { color: red; font-size: 2rem; }
```

Both `.title` rules apply globally. One breaks the other.

<!-- column: 1 -->

<!-- pause -->

**CSS Modules — scoped**

```css
/* ToolCard.module.css */
.card { border: 1px solid #ccc; }
.title { font-weight: bold; }
```

```tsx
import styles from "./ToolCard.module.css";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{tool.name}</h2>
    </div>
  );
}
```

At build time, `.title` becomes `.ToolCard_title__x3f2k` — unique per file. No collisions.

<!-- reset_layout -->

<!--
speaker_note: |
  This is exactly the .razor.css model in Blazor — styles scoped to a single
  component file, collision-free by construction. The mental model transfers
  directly. The only differences are syntax (you import styles as an object
  and reference them as properties) and the build tool doing the scoping
  (Vite instead of the Blazor compiler).
-->

<!-- end_slide -->

## CSS Modules in practice

The file convention and the import are the only new things.

```css
/* ToolCard.module.css */

.card {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
}

.card:hover {
  border-color: #94a3b8;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.statusBadge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.statusBadge.active     { background: #dcfce7; color: #15803d; }
.statusBadge.deprecated { background: #fee2e2; color: #b91c1c; }
```

```tsx
import styles from "./ToolCard.module.css";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{tool.name}</h2>
      <span className={`${styles.statusBadge} ${styles[tool.status]}`}>
        {tool.status}
      </span>
    </div>
  );
}
```

<!-- pause -->

Template literals combine multiple module classes. `styles[tool.status]` uses a dynamic key — same pattern as the form's computed property key.

<!--
speaker_note: |
  The camelCase convention in CSS Modules — statusBadge not status-badge — is
  because you're accessing the class as a JavaScript property. Hyphenated names
  require bracket notation (styles["status-badge"]), which is ugly. camelCase
  is the standard convention and worth establishing early.
  The dynamic key for status is a neat pattern — point it out as a technique
  they'll use whenever a CSS class depends on a data value.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Application Structure
===

<!-- end_slide -->

## Feature folders

Group files by feature, not by type.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**By type — hard to navigate**

```
src/
  components/
    ToolCard.tsx
    FilterBar.tsx
    UserBadge.tsx
    LoginForm.tsx
  hooks/
    useTools.ts
    useAuth.ts
    useToolById.ts
  pages/
    ToolListPage.tsx
    ToolDetailPage.tsx
    AddToolPage.tsx
    LoginPage.tsx
```

To work on the "add tool" feature you touch four different folders.

<!-- column: 1 -->

<!-- pause -->

**By feature — self-contained**

```
src/
  features/
    tools/
      ToolCard.tsx
      ToolCard.module.css
      ToolList.tsx
      FilterBar.tsx
      useTools.ts
      useToolById.ts
      ToolListPage.tsx
      ToolDetailPage.tsx
      AddToolPage.tsx
    auth/
      AuthContext.tsx
      useAuth.ts
      RequireAuth.tsx
      LoginPage.tsx
  shared/
    Panel.tsx
    ResultCount.tsx
  layouts/
    AppLayout.tsx
```

Everything for a feature lives together.

<!-- reset_layout -->

<!--
speaker_note: |
  Neither structure is wrong for a small app — the difference becomes apparent
  as the codebase grows. Feature folders make it easy to delete a feature (delete
  the folder), find everything related to a feature (one folder), and reason
  about ownership. The "shared" folder is for genuinely cross-cutting components.
  For the existing codebase they'll be working with, the structure is already
  set — the point isn't to restructure it on day one, it's to understand the
  logic so they can reason about where to put new code.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Lighthouse and WAVE
===

<!-- end_slide -->

## What Lighthouse measures

Lighthouse runs in Chrome DevTools — Cmd+Opt+I → Lighthouse tab → Analyse page load.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Five scored categories**

<!-- incremental_lists: true -->

- **Performance** — load speed, time to interactive
- **Accessibility** — automated WCAG checks
- **Best Practices** — HTTPS, console errors, deprecated APIs
- **SEO** — meta tags, crawlability
- **PWA** — service worker, manifest (Day 3 topic)

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**For internal tools, focus on**

Accessibility and Best Practices. Performance matters less for internal tools behind a VPN — the audience is small and on good connections.

<!-- pause -->

Accessibility score of **90+** is the realistic WCAG AA target for a working app. 100 is achievable with care.

<!-- reset_layout -->

<!-- pause -->

**The accessibility score is a floor, not a ceiling.** Lighthouse catches about 30–40% of WCAG issues automatically. The rest require manual testing — WAVE and screen reader checks cover the gap.

<!--
speaker_note: |
  The "30-40% automated coverage" figure is important to set expectations.
  Lighthouse passing does not mean the app is fully accessible. It means the
  automatable checks pass. Focus management, screen reader announcement, logical
  reading order, and keyboard traps cannot be fully automated — they need a
  human tester. WAVE (browser extension) catches some of what Lighthouse misses.
  For Day 3, there's a dedicated accessibility session that goes deeper.
-->

<!-- end_slide -->

## Reading a Lighthouse accessibility result

Lighthouse groups issues by severity. Focus on the failures first.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Common failures in React apps**

<!-- incremental_lists: true -->

- Missing `<html lang>` attribute
- Images without `alt` text
- Buttons with no accessible name (icon buttons)
- Form inputs with no associated label
- Insufficient colour contrast
- Links whose text is not descriptive ("click here")

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**Reading the output**

Each failure links to the element in the DOM. Click through to see exactly which element failed and why.

<!-- pause -->

Fix the failures before chasing the score. A score of 95 with known failures is worse than a score of 80 where every remaining issue is a known limitation.

<!-- reset_layout -->

<!--
speaker_note: |
  Run Lighthouse live on the finished ToolDirectory at this point if time allows.
  The failures will be real and fixable — missing lang attribute, any icon buttons
  that haven't been labelled yet. Fixing one live is more memorable than listing
  them abstractly. If time is short, skip the live run and move to the lab handover.
  This is the natural cut point if Day 2 is running long — the lab can include
  the Lighthouse task without the session covering it in depth.
-->

<!-- end_slide -->

## Closing the loop — Session 8

Back to the opening. Two problems — auth prop drilling and CSS collisions.

<!-- incremental_lists: true -->

- `AuthContext` with `AuthProvider` and `useAuth` replaces prop drilling — any component in the tree calls `useAuth()`, no intermediate props needed
- CSS Modules scope class names to the file — `.title` in `ToolCard.module.css` never collides with `.title` anywhere else
- Feature folders keep everything for one feature together — easier to navigate, easier to delete
- Lighthouse gives you a baseline — fix failures, then use WAVE and manual testing for the rest

<!-- incremental_lists: false -->

<!-- pause -->

**Day 2 complete.** You have a working app — it fetches data, has multiple pages, handles forms with validation and security, and is structured to grow.

<!--
speaker_note: |
  Take a moment before the lab to let the scope of Day 2 land. They've gone from
  a hardcoded list in a single file to a routed, data-fetching, form-capable app
  with accessible error handling and scoped styles. The lab cements it. Day 3
  picks up with testing and more advanced state management — the app they build
  today is the one they'll test and refactor tomorrow.
-->

<!-- end_slide -->

## Day 2 summary

<!-- incremental_lists: true -->

1. **`useEffect`** runs side effects after render — fetch after mount, clean up on unmount
2. **React Router v6** — `Routes`, `Route`, `Link`, `useParams`, `useNavigate`
3. **Layout components with `<Outlet />`** share UI across pages without re-rendering
4. **Controlled forms** — one handler, computed property keys, functional state updates
5. **Accessible form errors** — `aria-invalid`, `aria-describedby`, `role="alert"`, focus management
6. **JSX escapes by default** — `dangerouslySetInnerHTML` opts out; sanitise with DOMPurify if needed
7. **`useContext`** shares state down the tree without prop drilling
8. **CSS Modules** scope class names to the file — same model as Blazor's `.razor.css`

<!-- incremental_lists: false -->

<!-- end_slide -->

## Gap task — before Day 3

Complete independently. Bring notes to the Day 3 opening discussion.

<!-- incremental_lists: true -->

- Add a second route with its own view to the ToolDirectory
- Pass data between routes using route params or context
- Add CSS Modules styling to at least two components
- Run a Lighthouse accessibility audit and fix at least one issue it surfaces
- Note one thing that confused you and one thing you'd like to go deeper on

<!-- incremental_lists: false -->

<!-- pause -->

Day 3 opens with a 15-minute retro on what came up. Nothing to submit — bring your notes.

<!-- end_slide -->

<!-- jump_to_middle -->

Questions?
===
