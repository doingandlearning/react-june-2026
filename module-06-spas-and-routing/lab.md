# Session 6 Lab — SPAs and Routing

## Overview

You're adding routing to the ToolDirectory. By the end the app has a list page, a detail page, a shared layout with navigation, and a protected settings route.

---

## Setup

Your starter files are already in `src/labs/session-06/`. The folder structure is pre-built:

```
src/labs/session-06/
  mock-api.ts               ← fetchTools + fetchToolById
  components/               ← Panel, ToolCard, ToolList, FilterBar, ResultCount, RequireAuth
  hooks/
    useTools.ts             ← complete, brought forward from Session 05
    useToolById.ts          ← stub — you complete this in Task 3
  layouts/
    AppLayout.tsx           ← stub — you complete this in Task 5
  pages/
    ToolListPage.tsx        ← mostly complete, needs Link wired up (Task 2)
    ToolDetailPage.tsx      ← stub — you complete this in Task 4
    SettingsPage.tsx        ← placeholder, ready to use
    LoginPage.tsx           ← placeholder, ready to use
    NotFoundPage.tsx        ← ready to use
  Session06Lab.tsx          ← route config stub — you complete this in Task 6
```

In `student-app/src/App.tsx`, switch to Session 06:

```tsx
import { Session06Lab as ActiveLab } from './labs/session-06/Session06Lab'
```

Run `npm run dev` — you should see the 404 page. The route config is empty until Task 1, so every URL hits the catch-all.

---

## Your Tasks

---

### Task 1 — Wire up the route config skeleton

Open `Session06Lab.tsx`.

Add a route for the index page and the detail page inside `AppLayout`, and the catch-all outside it. Leave the settings route for Task 7.

```tsx
<Route element={<AppLayout />}>
  <Route index element={<ToolListPage />} />
  <Route path="tools/:id" element={<ToolDetailPage />} />
</Route>
<Route path="*" element={<NotFoundPage />} />
```

Visit `/` — the layout renders but `<Outlet />` is empty (AppLayout is still a stub).

---

### Task 2 — Add `Link` to the tool list

Open `ToolListPage.tsx`.

Find the TODO comment and update `ToolList` or `ToolCard` so each tool name is a `<Link to={'/tools/${tool.id}'}>`. Remove the dismiss button for now — it will be restored in extension Task A.

**Outcome:** clicking a tool name changes the URL to `/tools/1` (or whichever id). The detail page placeholder renders.

---

### Task 3 — Implement `useToolById`

Open `hooks/useToolById.ts`.

The signature and state are already stubbed. Fill in the `useEffect` body — call `fetchToolById(id)`, update state, handle errors. Make sure it only runs when `id` is defined, and re-fetches if `id` changes.

**Outcome:** `useToolById("1")` returns the Deploy Bot after ~400ms.

---

### Task 4 — Build `ToolDetailPage`

Open `pages/ToolDetailPage.tsx`.

The `useParams` call and `useToolById` call are already there. Add the three render guards (loading, error, not found), then render the tool's name, owner, status, and category.

**Outcome:** visiting `/tools/1` shows Deploy Bot's details. Visiting `/tools/999` shows "Tool not found." The back link returns to the list.

---

### Task 5 — Build `AppLayout`

Open `layouts/AppLayout.tsx`.

Add `NavLink` elements to `/` (with the `end` prop) and `/settings`. The `end` prop prevents the root link from being active on every page. Leave `UserBadge` for Session 08.

**Outcome:** the nav renders on every page. Navigating between pages keeps the nav visible. The current page's link is visually distinguished.

---

### Task 6 — Complete the route config

Return to `Session06Lab.tsx`.

The settings route should be inside `RequireAuth` (which wraps `AppLayout`):

```tsx
<Route element={<RequireAuth />}>
  <Route element={<AppLayout />}>
    <Route path="settings" element={<SettingsPage />} />
  </Route>
</Route>
```

Also add `<Route path="/login" element={<LoginPage />} />` outside the layout.

**Outcome:** visiting `/settings` redirects to `/login` (IS_AUTHENTICATED is false). Flip `IS_AUTHENTICATED` to `true` in `RequireAuth.tsx` — settings renders. Flip it back.

---

### Task 7 — Protect settings with `RequireAuth`

Open `components/RequireAuth.tsx`.

The component already uses a hardcoded `IS_AUTHENTICATED` constant. This is intentional for now — Session 08 replaces it with context.

Verify the guard works correctly: unauthenticated → redirected to `/login`. Authenticated → `<Outlet />` renders. The `replace` prop on `<Navigate>` should be present so the back button doesn't loop.

**Outcome:** the auth guard redirects correctly in both states.

---

## Extension

**A — Restore dismiss with navigation**

Add dismiss back to `ToolListPage`. Keep `dismissed` state in the page.

Add a dismiss button to `ToolDetailPage` that calls `useNavigate` to navigate to `/` after dismissing. For now, dismissed state doesn't need to persist across routes.

**B — Passing state through navigation**

After dismissing on the detail page, navigate with a state payload:

```ts
navigate("/", { state: { dismissedName: tool.name } });
```

In `ToolListPage`, read `useLocation().state` and show a brief confirmation message.

**C — Breadcrumb trail**

Add a breadcrumb above the detail page content — "Tools / Deploy Bot" — where "Tools" is a `Link` and the tool name is plain text.
