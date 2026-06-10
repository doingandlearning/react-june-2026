# Session 5 — Live Coding Demo Script

## Before you start

- `src/teaching/session-5.tsx` — write everything here
- Start from the Session 4 finished state: `ToolDirectory` with lifted state, `FilterBar`, `ResultCount`, `ToolList`
- Replace the hardcoded `tools` import with a mock API — use `src/teaching/mock-api.ts` (below)
- Browser open, Vite running, network tab open

### `mock-api.ts` — paste before the demo

```ts
// src/teaching/mock-api.ts

export interface Tool {
  id: string;
  name: string;
  owner: string;
  status: "active" | "deprecated";
  category: string;
}

const TOOLS: Tool[] = [
  { id: "1", name: "Deploy Bot",      owner: "Platform",  status: "active",     category: "devops" },
  { id: "2", name: "Log Viewer",      owner: "Platform",  status: "active",     category: "devops" },
  { id: "3", name: "Feature Flags",   owner: "Product",   status: "active",     category: "product" },
  { id: "4", name: "User Lookup",     owner: "Support",   status: "active",     category: "support" },
  { id: "5", name: "Old Dashboard",   owner: "Platform",  status: "deprecated", category: "devops" },
  { id: "6", name: "Legacy Importer", owner: "Data",      status: "deprecated", category: "data" },
];

export function fetchTools(category?: string): Promise<Tool[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = category
        ? TOOLS.filter((t) => t.category === category)
        : TOOLS;
      resolve(result);
    }, 800); // fake network delay
  });
}
```

---

## Beat 1 — Reproduce the problem (3 min)

Start with the Session 4 component tree visible in split pane. Announce:

> "The tools are hardcoded. Let's fetch them instead."

Show them what doesn't work first. Write this in `session-5.tsx` — deliberately wrong:

```tsx
// This does NOT work — show the error, then delete it
export async function Session5Teaching() {
  const tools = await fetchTools(); // ← TypeScript error immediately
  return <ToolList tools={tools} />;
}
```

The editor flags it. Components can't be `async`. Ask: *"Why not?"*

Take answers, then give the reason: React calls your component synchronously — it expects JSX back immediately, not a promise. Side effects have to run after the render, not during it.

Delete the broken version. Move on to the correct pattern.

---

## Beat 2 — useEffect + loading state (5 min)

Write the minimal correct version from scratch:

```tsx
import { useState, useEffect } from "react";
import { fetchTools, type Tool } from "../teaching/mock-api";

export function Session5Teaching() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools().then((data) => {
      setTools(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading tools…</p>;
  return <p>{tools.length} tools loaded.</p>;
}
```

Run it. Show the "Loading tools…" flash, then the count.

Ask: *"What's the `[]` for?"*

Take answers. Explain the three modes:
- No array: runs after every render — almost never right
- Empty array: runs once on mount
- Array with values: runs when those values change

Now add an error state:

```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchTools()
    .then((data) => { setTools(data); setLoading(false); })
    .catch((err: Error) => { setError(err.message); setLoading(false); });
}, []);

if (loading) return <p>Loading tools…</p>;
if (error) return <p role="alert">Error: {error}</p>;
return <p>{tools.length} tools loaded.</p>;
```

Ask: *"Why does `role=\"alert\"` matter here?"* — it announces the error to screen readers without the user having to navigate to it.

---

## Beat 3 — Dependency array in action (3 min)

Add a category filter to demonstrate reactive effects:

```tsx
const CATEGORIES = ["all", "devops", "product", "support", "data"];

export function Session5Teaching() {
  const [tools, setTools]       = useState<Tool[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    fetchTools(category)
      .then((data) => { setTools(data); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [category]); // ← category drives the effect

  return (
    <div>
      <div>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === "all" ? undefined : c)}
          >
            {c}
          </button>
        ))}
      </div>
      {loading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <p>{tools.length} tools</p>}
    </div>
  );
}
```

Click the category buttons. Show the loading flash, then the filtered count.

Point at the dependency array: *"`category` is in here because the effect reads it. If we put `[]`, the effect would run once with `undefined` and never re-run when the category changes — a stale closure."*

---

## Beat 4 — useRef for DOM access (3 min)

Add an auto-focus search input to the filter bar:

```tsx
import { useState, useEffect, useRef } from "react";

export function Session5Teaching() {
  // ... existing state

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div>
      <input
        ref={searchRef}
        type="text"
        placeholder="Filter tools…"
        aria-label="Filter tools"
      />
      {/* category buttons, tool count... */}
    </div>
  );
}
```

Run it. The input is focused immediately on page load.

Point out: *"`searchRef.current` is null before the component mounts — that's why we use optional chaining `?.`. After mount, it's the real DOM node."*

Ask: *"Could we do this with useState instead?"* — yes, but every time we changed the ref value, it would trigger a re-render. `useRef` persists the reference without re-rendering. That's the distinction.

---

## Beat 5 — Extract a custom hook (4 min)

The component is getting long. Name what we'd extract:

> "The fetch logic — the three state values and the useEffect — is a unit. It has a name: `useTools`. Let's move it."

Extract side-by-side:

```tsx
// Custom hook — lives above the component (or in its own file)
function useTools(category?: string) {
  const [tools, setTools]     = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTools(category)
      .then((data) => { setTools(data); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [category]);

  return { tools, loading, error };
}

// Component — now reads cleanly
export function Session5Teaching() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { tools, loading, error } = useTools(category);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div>
      <input ref={searchRef} type="text" placeholder="Filter…" aria-label="Filter tools" />
      <div>
        {["all", "devops", "product", "support", "data"].map((c) => (
          <button key={c} onClick={() => setCategory(c === "all" ? undefined : c)}>
            {c}
          </button>
        ))}
      </div>
      {loading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <p>{tools.length} tools</p>}
    </div>
  );
}
```

The component hasn't changed behaviour — the code is identical, just moved. Point out: *"The component now reads like a description. The fetch logic is reusable — you could call `useTools` from any component that needs tool data."*

---

## Handover to the lab

> "The lab gives you the Session 4 app — the full ToolDirectory with lifted state and the filter bar — and asks you to wire it up to a real fetch, add loading and error handling, and extract the fetch logic into a custom hook. Everything you just saw, applied to code you already know."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Reproduce the problem — async component fails | 3 min |
| 2 | useEffect + loading + error states | 5 min |
| 3 | Dependency array in action — category filter | 3 min |
| 4 | useRef — auto-focus input | 3 min |
| 5 | Extract `useTools` custom hook | 4 min |
| — | Lab handover | 2 min |
| **Total** | | **~20 min** |
