# Session 6 — Live Coding Demo Script

## Before you start

- `src/teaching/session-6.tsx` — write everything here
- Start from Session 5's finished `Session5Teaching` component — `useTools` hook wired up, tool list rendering
- Install React Router if not already present — `npm install react-router-dom`
- Update `main.tsx` to wrap in `BrowserRouter` before the demo starts
- Keep `src/teaching/mock-api.ts` from Session 5 — add a `fetchToolById` function (below)

### Add to `mock-api.ts` before the demo

```ts
export function fetchToolById(id: string): Promise<Tool | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(TOOLS.find((t) => t.id === id) ?? null);
    }, 400);
  });
}
```

### Update `main.tsx`

```tsx
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

## Beat 1 — The problem with conditional rendering (2 min)

Show the Session 5 component on screen. Pose the question from the slides:

> "A stakeholder wants to click a tool and see a detail page. How would you do this without a router?"

Take answers. Show the naive approach briefly — don't write it fully, just sketch it:

```tsx
// Without a router — works, but...
const [selectedId, setSelectedId] = useState<string | null>(null);

if (selectedId) return <ToolDetail id={selectedId} onBack={() => setSelectedId(null)} />;
return <ToolList onSelect={setSelectedId} />;
```

Point out what's missing — the URL doesn't change, back button doesn't work, you can't link to the detail page.

> "A router solves all three for free. Let's install one."

---

## Beat 2 — Install and wire up React Router (3 min)

Show `main.tsx` with `BrowserRouter` already added (done in setup). Explain — everything inside the `BrowserRouter` can now read and change the URL.

Write the route config in a new `src/teaching/Session6App.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";

export function Session6App() {
  return (
    <Routes>
      <Route path="/"          element={<ToolListPage />} />
      <Route path="/tools/:id" element={<ToolDetailPage />} />
    </Routes>
  );
}

function ToolListPage() {
  return <p>List page</p>;
}

function ToolDetailPage() {
  return <p>Detail page</p>;
}
```

Update `App.tsx` to render `<Session6App />` instead of the Session 5 component. Visit `/` and `/tools/1` in the browser. Show that each URL renders the right placeholder.

Ask — *"What is `:id` here?"* A URL parameter — a named slot in the path.

---

## Beat 3 — Build ToolListPage with Link (4 min)

Replace the `ToolListPage` placeholder with the real thing, wiring in the `useTools` hook and `Link`:

```tsx
import { Link } from "react-router-dom";
import { useTools } from "../hooks/useTools"; // or inline it from Session 5

function ToolListPage() {
  const { tools, loading, error } = useTools();

  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">{error}</p>;

  return (
    <div>
      <h1>Internal Tools</h1>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
            <span> — {tool.owner}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Run it. Click a link. The URL changes to `/tools/1`. The detail page placeholder renders.

Point out — no page reload. The network tab shows no new document request. React Router intercepted the click.

Ask — *"Why `Link` and not `<a href>`?"* — `<a href>` would trigger a full page reload, losing all state. `Link` updates the URL without reloading.

---

## Beat 4 — Build ToolDetailPage with useParams (4 min)

Replace the detail page placeholder:

```tsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchToolById, type Tool } from "../teaching/mock-api";

function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchToolById(id).then((data) => {
      setTool(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!tool)   return <p>Tool not found.</p>;

  return (
    <div>
      <Link to="/">← Back to tools</Link>
      <h1>{tool.name}</h1>
      <p>Owner — {tool.owner}</p>
      <p>Status — {tool.status}</p>
      <p>Category — {tool.category}</p>
    </div>
  );
}
```

Run it. Click "Deploy Bot". The URL becomes `/tools/1`, the detail renders. Click the back link. Click the browser back button — also works.

Point out `id` in the dependency array — if the user navigated directly from `/tools/1` to `/tools/2` (without going back to the list), the effect re-fires and loads the new tool.

Ask — *"What type is `id`?"* — always a string. If you need a number, `parseInt(id)`.

---

## Beat 5 — Layout component with Outlet (4 min)

The nav link is only on the detail page. Let's put navigation in a shared layout.

```tsx
import { Outlet, Link, NavLink } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <NavLink to="/" end>Tools</NavLink>
        {" | "}
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
```

Update the route config to nest pages inside the layout:

```tsx
export function Session6App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index             element={<ToolListPage />} />
        <Route path="tools/:id"  element={<ToolDetailPage />} />
        <Route path="settings"   element={<p>Settings coming in Session 7.</p>} />
      </Route>
      <Route path="*" element={<p>404 — page not found.</p>} />
    </Routes>
  );
}
```

Run it. The nav renders on every page. Navigate between pages — the nav stays, only the content changes. Visit a bad URL — the 404 message appears without the nav.

Point out `NavLink` — it adds an `active` class when the current URL matches. The `end` prop on the root link stops it being active on every page.

---

## Beat 6 — Auth guard (3 min)

Add a quick `RequireAuth` to show the pattern — keep it minimal:

```tsx
import { Navigate, Outlet } from "react-router-dom";

// Simulate auth state — in a real app this comes from context or a hook
const isLoggedIn = false; // toggle this to show the redirect in action

function RequireAuth() {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
```

Wrap the settings route:

```tsx
<Route element={<RequireAuth />}>
  <Route path="settings" element={<p>Settings — authenticated only.</p>} />
</Route>
```

Visit `/settings`. Redirected immediately. Toggle `isLoggedIn = true`. Visit `/settings`. It renders.

Point out — `RequireAuth` renders either a redirect or its children. Nothing else. `<Navigate>` renders no UI — it just changes the URL.

---

## Handover to the lab

> "The lab takes the Session 5 app and adds routing throughout — list page, detail page, layout, and a protected settings route. The useTools hook you wrote in Session 5 plugs straight in. Nothing new to learn — just the patterns from this session applied to code you already know."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | The problem with conditional rendering | 2 min |
| 2 | Install React Router, wire up routes | 3 min |
| 3 | ToolListPage with Link | 4 min |
| 4 | ToolDetailPage with useParams | 4 min |
| 5 | Layout component with Outlet | 4 min |
| 6 | Auth guard pattern | 3 min |
| — | Lab handover | 1 min |
| **Total** | | **~21 min** |
