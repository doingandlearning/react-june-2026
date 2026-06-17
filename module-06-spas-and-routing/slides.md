---
title: "Session 6 — SPAs and Routing"
sub_title: React for .NET/Blazor Developers — Day 2
author: Kevin Cunningham
---

## Opening scenario

The ToolDirectory is working well. A stakeholder asks for a detail page — click any tool in the list and you should see its full description, owner, status, and a back button.

You open the codebase. There's one component rendering everything. There's no router installed.

**Type in chat: without a router, how would you show the detail view today?**

<!--
speaker_note: |
  Give them a moment. Common answers — conditional rendering with useState, a
  selected tool in state, maybe hiding/showing divs. All technically possible.
  The session shows why a router is the better answer — URL reflects the view,
  the back button works, links are shareable. Those things are free with a router
  and a lot of work without one.
-->

<!-- end_slide -->

## What a SPA router does

Without a router, the URL never changes. With one, each view has its own URL.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Without a router**

```
https://tools.internal/
```

The URL is always the same, regardless of what's visible.

<!-- pause -->

- Back button doesn't navigate between views
- You can't link someone to the detail page
- Refreshing loses your place

<!-- column: 1 -->

<!-- pause -->

**With React Router**

```
https://tools.internal/           ← list view
https://tools.internal/tools/42   ← detail view
https://tools.internal/settings   ← settings
```

Each view has a URL.

<!-- pause -->

- Back and forward buttons work as expected
- Links are shareable and bookmarkable
- Refreshing lands you in the same place

<!-- reset_layout -->

<!-- pause -->

This is the same model as Blazor's `@page` directive — each component declares its route. React Router makes it explicit in one place rather than spread across files.

<!--
speaker_note: |
  The Blazor comparison lands well here. @page "/tools/{id}" in Blazor is
  conceptually identical to what React Router does — map a URL pattern to a
  component. The difference is where the mapping lives — in Blazor it's in the
  component file, in React Router it's in a central route config.
-->

<!-- end_slide -->

## Installing React Router

One package, added to the project once.

```bash
npm install react-router-dom@6
```

<!-- pause -->

Then wrap the app in `BrowserRouter` — typically at the root:

```tsx
// main.tsx
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

<!-- pause -->

`BrowserRouter` uses the HTML5 History API — real URLs, no hash fragments. Everything inside it can read and change the current URL.

<!--
speaker_note: |
  Worth mentioning HashRouter exists for environments where the server can't
  handle arbitrary URL paths (old hosting setups, some SPAs behind proxies).
  BrowserRouter is the right default for modern setups — Vite dev server handles
  it, and production Nginx/IIS config is a one-liner.
-->

<!-- end_slide -->

## Routes and Route

`Routes` matches the current URL. `Route` maps a URL pattern to a component.

```tsx
// App.tsx
import { Routes, Route } from "react-router-dom";
import { ToolList } from "./pages/ToolList";
import { ToolDetail } from "./pages/ToolDetail";
import { Settings } from "./pages/Settings";

export function App() {
  return (
    <Routes>
      <Route path="/"            element={<ToolList />} />
      <Route path="/tools/:id"   element={<ToolDetail />} />
      <Route path="/settings"    element={<Settings />} />
    </Routes>
  );
}
```

<!-- pause -->

Three things to note:

<!-- incremental_lists: true -->

- `path="/"` matches exactly the root URL
- `path="/tools/:id"` — the `:id` segment is a **URL parameter**, readable in the component
- Only one `Route` renders at a time — `Routes` picks the first match

<!-- incremental_lists: false -->

<!--
speaker_note: |
  Routes picks the best match, not just the first match — it uses specificity
  scoring similar to CSS. So /tools/42 will match /tools/:id even if / is listed
  first. This is a change from React Router v5 where order mattered and you
  needed the `exact` prop. v6 always does exact matching by default.
-->

<!-- end_slide -->

## Link and navigation

Never use `<a href>` inside a React Router app — it triggers a full page reload.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**`<Link>` — declarative navigation**

```tsx
import { Link } from "react-router-dom";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div>
      <Link to={`/tools/${tool.id}`}>
        {tool.name}
      </Link>
    </div>
  );
}
```

Renders as an `<a>` tag in the DOM — keyboard accessible, right-click works, screen readers understand it. But React Router intercepts the click and updates the URL without a reload.

<!-- column: 1 -->

<!-- pause -->

**`useNavigate` — imperative navigation**

```tsx
import { useNavigate } from "react-router-dom";

function ToolDetail() {
  const navigate = useNavigate();

  function handleDelete() {
    deleteThisTool().then(() => {
      navigate("/"); // go back to list after delete
    });
  }

  return (
    <button onClick={handleDelete}>
      Delete tool
    </button>
  );
}
```

Use `useNavigate` when navigation happens as a result of an action, not a click on a link.

<!-- reset_layout -->

<!--
speaker_note: |
  The Link vs useNavigate distinction is the same as Blazor's NavLink vs
  NavigationManager.NavigateTo. Link for navigation controls, useNavigate for
  programmatic navigation after an action completes. If they'd use an anchor tag
  in HTML, use Link. If they'd call a method, use useNavigate.
-->

<!-- end_slide -->

## Reading URL parameters

`:id` in the route path becomes available via `useParams`.

```tsx
import { useParams } from "react-router-dom";
import { useToolById } from "../hooks/useToolById";

interface Params {
  id: string;
}

export function ToolDetail() {
  const { id } = useParams<Params>();
  const { tool, loading, error } = useToolById(id!);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">Failed to load tool</p>;
  if (!tool)   return <p>Tool not found</p>;

  return (
    <div>
      <h1>{tool.name}</h1>
      <p>Owner — {tool.owner}</p>
      <p>Status — {tool.status}</p>
    </div>
  );
}
```

<!-- pause -->

`useParams` returns strings — always. If your ID is a number in the database, parse it with `parseInt` or `Number()`. TypeScript won't do that for you.

<!--
speaker_note: |
  The id! non-null assertion is needed because TypeScript sees params as
  potentially undefined — the route might not always have an :id segment.
  We know it will because this component only renders when /tools/:id matches,
  but TypeScript doesn't know that. The assertion is safe here.
  The "not found" case is worth calling out — fetching with an invalid ID should
  render a message, not crash.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Layouts and Nested Routes
===

<!-- end_slide -->

## Layout components

A layout wraps multiple pages with shared UI — navigation, a sidebar, a header.

```tsx
// layouts/AppLayout.tsx
import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="app">
      <nav>
        <Link to="/">Tools</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <main>
        <Outlet /> {/* ← the matched child route renders here */}
      </main>
    </div>
  );
}
```

<!-- pause -->

`<Outlet />` is a placeholder — React Router fills it with whichever child route matched.

<!--
speaker_note: |
  Outlet is the same concept as Blazor's @Body in MainLayout.razor — the shell
  stays, the content swaps. Worth making that comparison explicitly. The navigation
  renders once; the page content inside main changes with each route.
-->

<!-- end_slide -->

## Nested routes

Nest `Route` elements to apply a layout to a group of pages.

```tsx
// App.tsx
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ToolList } from "./pages/ToolList";
import { ToolDetail } from "./pages/ToolDetail";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index          element={<ToolList />} />
        <Route path="tools/:id" element={<ToolDetail />} />
        <Route path="settings"  element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

<!-- pause -->

Two things here:

<!-- incremental_lists: true -->

- `index` marks the default child — it renders at the parent's path (root `/` in this case)
- `path="*"` is the catch-all — it matches anything not matched above

<!-- incremental_lists: false -->

<!--
speaker_note: |
  The parent Route has no path — just an element. That's the layout pattern.
  The layout renders, its Outlet fills with whichever child matched. The catch-all
  404 route sits outside the layout because the not-found page has its own design.
  If they want the 404 inside the layout, move it inside the parent Route.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Protecting Routes
===

<!-- end_slide -->

## The auth guard pattern

Some routes should only be accessible to authenticated users. The pattern — check auth, redirect if not.

```tsx
// components/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, remembering where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
```

<!-- pause -->

`<Navigate>` renders nothing — it just changes the URL. `replace` replaces the current history entry so the back button doesn't loop back to the protected route.

<!--
speaker_note: |
  The "from" state stores the intended destination so the
  login page can redirect back after a successful login. It's optional but the
  right UX — if someone bookmarks /settings and is not logged in, they should land
  on /settings after logging in, not on the home page.
  useAuth is a placeholder — in the real codebase it might be a context value,
  a cookie check, or a token in memory. The RequireAuth component doesn't care
  how auth works, only whether the user is present.
-->

<!-- end_slide -->

## Wiring up the auth guard

Wrap protected routes with `RequireAuth` using the same nested route pattern.

```tsx
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Public routes with layout */}
      <Route element={<AppLayout />}>
        <Route index element={<ToolList />} />
      </Route>

      {/* Protected routes with layout */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="tools/:id" element={<ToolDetail />} />
          <Route path="settings"  element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

<!-- pause -->

`RequireAuth` renders either `<Outlet />` (authenticated) or `<Navigate to="/login">` (not). The layout inside it only renders if auth passes.

<!--
speaker_note: |
  This is a common point of confusion — why nest the layout inside RequireAuth
  rather than having RequireAuth inside the layout? Because if RequireAuth
  redirects, you don't want the layout to render at all. The guard wraps
  everything it's protecting, layout included.
  For the lab, a simplified useAuth that just checks localStorage for a flag is
  enough to demonstrate the pattern. The mechanism doesn't matter — the structure does.
-->

<!-- end_slide -->

## Closing the loop — Session 6

Back to the opening. A stakeholder wants a detail page — click a tool, see its full details.

Now you can answer precisely:

<!-- incremental_lists: true -->

- Install `react-router-dom`, wrap the app in `BrowserRouter`
- Add a `Route` with `path="tools/:id"` pointing to a `ToolDetail` component
- Use `<Link to={...}>` in the list to navigate without a page reload
- Read the tool ID in `ToolDetail` with `useParams`, fetch the data, render it
- A layout component with `<Outlet />` keeps the nav visible across all pages
- `RequireAuth` guards any route that needs a logged-in user

<!-- incremental_lists: false -->

<!-- pause -->

**The URL is state. When the URL changes, the right component renders — that's the entire model.**

<!--
speaker_note: |
  The closing sentence reframes routing as a form of state — the URL is just
  another piece of application state that React Router keeps in sync with the
  component tree. This helps them understand why it integrates so naturally with
  the rest of what they've learned.
-->

<!-- end_slide -->

## Session 6 summary

<!-- incremental_lists: true -->

1. **`BrowserRouter`** wraps the app once — everything inside can read and change the URL
2. **`Routes` and `Route`** map URL patterns to components — v6 does exact matching by default
3. **`Link`** for navigation controls, **`useNavigate`** for programmatic navigation after actions
4. **`useParams`** reads URL segments — values are always strings
5. **Layout components with `<Outlet />`** share UI across multiple pages without re-rendering the shell
6. **`RequireAuth`** wraps protected routes — redirect to login if no user, render children if authenticated

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 7

**The app now has pages, navigation, and auth protection.**

<!-- incremental_lists: true -->

- Data fetches from an API
- Multiple views with their own URLs
- Shared layout with persistent navigation

<!-- incremental_lists: false -->

**Session 7 — Forms, Validation, and Security:** the ToolDirectory needs a form — add a tool, edit details, submit changes. Forms in React are controlled inputs at scale. And with user input comes the question of what to trust and what to sanitise.

<!-- end_slide -->

<!-- jump_to_middle -->

Questions?
===
